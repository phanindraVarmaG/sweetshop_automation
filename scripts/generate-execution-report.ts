import fs from 'fs';
import path from 'path';

const resultsPath = path.resolve('reports/results.json');
const outputPath = path.resolve('reports/execution-report.md');

interface TestResult {
  status?: string;
  duration?: number;
  errors?: Array<{ message?: string; stack?: string }>;
}

interface TestEntry {
  testId: string;
  projectName: string;
  expectedStatus: string;
  outcome?: string;
  results?: TestResult[];
}

interface SpecEntry {
  title: string;
  file: string;
  tests?: TestEntry[];
}

interface Suite {
  specs?: SpecEntry[];
  suites?: Suite[];
}

interface PlaywrightResults {
  suites?: Suite[];
  config?: { metadata?: { baseURL?: string } };
}

interface FlatSpec {
  id: string;
  title: string;
  file: string;
  project: string;
  expectedStatus: string;
  status: string;
  duration: number;
  errors: Array<{ message?: string; stack?: string }>;
}

function readResults(): PlaywrightResults | null {
  if (!fs.existsSync(resultsPath)) return null;
  return JSON.parse(fs.readFileSync(resultsPath, 'utf8')) as PlaywrightResults;
}

function flattenSpecs(suites: Suite[] | undefined, output: FlatSpec[] = []): FlatSpec[] {
  for (const suite of suites ?? []) {
    for (const spec of suite.specs ?? []) {
      for (const test of spec.tests ?? []) {
        const results = test.results ?? [];
        const lastResult = results[results.length - 1] ?? {};
        output.push({
          id: spec.title.match(/TC-[A-Z]+-\d+/)?.[0] ?? test.testId,
          title: spec.title,
          file: spec.file,
          project: test.projectName,
          expectedStatus: test.expectedStatus,
          status: test.outcome ?? lastResult.status ?? 'unknown',
          duration: results.reduce((sum, r) => sum + (r.duration ?? 0), 0),
          errors: results.flatMap((r) => r.errors ?? [])
        });
      }
    }
    flattenSpecs(suite.suites, output);
  }
  return output;
}

function formatDuration(ms: number): string {
  return `${(ms / 1000).toFixed(2)}s`;
}

function stripAnsi(text: unknown): string {
  return String(text ?? '').replace(/\u001b\[[0-9;]*m/g, '');
}

const data = readResults();
const generatedAt = new Date().toISOString();

let markdown = `# Sweet Shop Execution Report\n\nGenerated: ${generatedAt}\n\n`;

if (!data) {
  markdown += [
    'No Playwright JSON results were found.',
    '',
    'Run `npm run test:report` to execute the suite and regenerate this report.',
    ''
  ].join('\n');
} else {
  const specs = flattenSpecs(data.suites);
  const total = specs.length;
  const passed = specs.filter((s) => s.status === 'passed' || s.status === 'expected').length;
  const failed = total - passed;
  const duration = specs.reduce((sum, s) => sum + s.duration, 0);

  const baseURL =
    data.config?.metadata?.baseURL ??
    process.env.BASE_URL ??
    'https://sweetshop.netlify.app';

  markdown += `Base URL: ${baseURL}\n\n`;
  markdown += `| Metric | Value |\n| --- | --- |\n`;
  markdown += `| Total executions | ${total} |\n`;
  markdown += `| Passed | ${passed} |\n`;
  markdown += `| Failed/Unexpected | ${failed} |\n`;
  markdown += `| Duration | ${formatDuration(duration)} |\n\n`;

  markdown += `## Result Details\n\n`;
  markdown += `| Test ID | Scenario | Project | Status | Duration |\n| --- | --- | --- | --- | --- |\n`;
  for (const spec of specs) {
    markdown += `| ${spec.id} | ${spec.title.replace(/\|/g, '\\|')} | ${spec.project} | ${spec.status} | ${formatDuration(spec.duration)} |\n`;
  }

  const failures = specs.filter((s) => s.errors.length > 0);
  if (failures.length > 0) {
    markdown += `\n## Failures\n\n`;
    for (const failure of failures) {
      const firstError = failure.errors[0];
      markdown += `### ${failure.id} - ${failure.project}\n\n`;
      markdown += `${failure.title}\n\n`;
      markdown += '```text\n';
      markdown += `${stripAnsi(firstError?.message ?? firstError?.stack ?? 'No error message captured.')}\n`;
      markdown += '```\n\n';
    }
  }
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, markdown);
console.log(`Execution report written to ${outputPath}`);
