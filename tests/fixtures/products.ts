export interface Product {
  name: string;
  description: string;
  price: string;
}

export const allProducts: Product[] = [
  { name: 'Chocolate Cups',      description: 'Candy Chocolate Cups.',                                                           price: '£1.00' },
  { name: 'Sherbert Straws',     description: 'Rainbow Dust Straws - Choose your colour.',                                       price: '£0.75' },
  { name: 'Sherbert Discs',      description: "UFO's Sherbert Filled Flying Saucers.",                                           price: '£0.95' },
  { name: 'Bon Bons',            description: 'Pink Strawberry Bonbons - sugar dusted, strawberry flavoured chewy sweets.',      price: '£1.00' },
  { name: 'Jellies',             description: 'Fruit flavoured chewy sea monster jellies.',                                      price: '£0.75' },
  { name: 'Fruit Salads',        description: 'Fruit salad chews.',                                                              price: '£0.50' },
  { name: 'Bubble Gums',         description: 'Fruit flavoured bubble gums and tattoo.',                                         price: '£0.25' },
  { name: 'Wham Bars',           description: 'Wham original raspberry chew bar.',                                               price: '£0.15' },
  { name: 'Whistles',            description: 'Candy whistles.',                                                                 price: '£0.25' },
  { name: 'Sherbert Fountains',  description: 'Sherbert fountain with a liquorice stick for dipping.',                          price: '£0.35' },
  { name: 'Swansea Mixture',     description: 'Originally made in Swansea this classic mix is popular across South Wales.',     price: '£1.50' },
  { name: 'Chocolate Beans',     description: 'Chocolate beans.',                                                                price: '£0.80' },
  { name: 'Nerds',               description: 'American candy sweets.',                                                          price: '£0.60' },
  { name: 'Drumsticks',          description: 'Raspberry and milk flavour chews.',                                               price: '£0.20' },
  { name: 'Bubbly',              description: 'Fruit flavoured bubble gum.',                                                     price: '£0.10' },
  { name: 'Dolly Mixture',       description: 'Dolly mixture.',                                                                  price: '£0.90' }
];

export const popularProducts: string[] = [
  'Chocolate Cups',
  'Sherbert Discs',
  'Sherbert Straws',
  'Bon Bons'
];
