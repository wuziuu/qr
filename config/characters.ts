export interface CharacterConfig {
  id: string;
  name: string;
  image: string;
  bgImage: string;
  color: {
    hex: string;
    r: number;
    g: number;
    b: number;
  };
  coords: Array<{ x: number; y: number }>;
}

export const characters: CharacterConfig[] = [
  {
    id: 'chii-chobits',
    name: 'Chii Chobits',
    image: '/demo-img/Chii-Chobits.jpg',
    bgImage: '/Chii-Chobits/bg.jpg',
    color: {
      hex: '#BC5B88',
      r: 188,
      g: 91,
      b: 136
    },
    coords: [
      { x: 737, y: 601 },
      { x: 1150, y: 601 },
      { x: 1151, y: 1036 },
      { x: 739, y: 1034 }
    ]
  },
  {
    id: 'conan',
    name: 'Conan',
    image: '/demo-img/conan.jpg',
    bgImage: '/conan/bg.jpg',
    color: {
      hex: '#3994C3',
      r: 57,
      g: 148,
      b: 195
    },
    coords: [
      { x: 119, y: 514 },
      { x: 551, y: 510 },
      { x: 619, y: 943 },
      { x: 176, y: 953 }
    ]
  },
  {
    id: 'evernight',
    name: 'Evernight',
    image: '/demo-img/Evernight.jpg',
    bgImage: '/Evernight/bg.jpg',
    color: {
      hex: '#EB425F',
      r: 235,
      g: 66,
      b: 95
    },
    coords: [
      { x: 389, y: 350 },
      { x: 681, y: 345 },
      { x: 626, y: 664 },
      { x: 312, y: 617 }
    ]
  },
  {
    id: 'march-7th',
    name: 'March 7th',
    image: '/demo-img/March-7th.jpg',
    bgImage: '/March 7th/bg.jpg',
    color: {
      hex: '#E277AB',
      r: 226,
      g: 119,
      b: 171
    },
    coords: [
      { x: 131, y: 702 },
      { x: 360, y: 675 },
      { x: 388, y: 905 },
      { x: 159, y: 933 }
    ]
  },
  {
    id: 'nefer',
    name: 'Nefer',
    image: '/demo-img/Nefer.jpg',
    bgImage: '/Nefer/bg.jpg',
    color: {
      hex: '#4B7D62',
      r: 75,
      g: 125,
      b: 98
    },
    coords: [
      { x: 180, y: 266 },
      { x: 423, y: 243 },
      { x: 415, y: 476 },
      { x: 192, y: 504 }
    ]
  },
  {
    id: 'yumemizuki-mizuki',
    name: 'Yumemizuki Mizuki',
    image: '/demo-img/Yumemizuki-Mizuki.jpg',
    bgImage: '/Yumemizuki Mizuki/bg.jpg',
    color: {
      hex: '#7F638C',
      r: 127,
      g: 99,
      b: 140
    },
    coords: [
      { x: 167, y: 391 },
      { x: 661, y: 389 },
      { x: 664, y: 881 },
      { x: 169, y: 882 }
    ]
  }
];

