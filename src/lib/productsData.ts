export interface ProductOption {
  id: string;
  name: string;
  priceDelta: number;
}

export interface ProductGroup {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  options: ProductOption[];
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  badgeType: string;
  highlight: string;
  stats: string;
  description: string;
  dressing: string;
  image: string;
  bgAccent: string;
  isAvailable: boolean;
  availableDays: string[];
  groups?: ProductGroup[];
}

export interface Category {
  slug: string;
  name: string;
  emoji: string;
}

export const INITIAL_CATEGORIES: Category[] = [
  { slug: 'pepitos', name: 'Pepitos Especiales', emoji: '🥖' },
  { slug: 'burgers', name: 'Hamburguesas', emoji: '🍔' },
  { slug: 'papas', name: 'Papas Monstruo', emoji: '🍟' },
  { slug: 'ensaladas', name: 'Ensaladas Bowl', emoji: '🥗' },
  { slug: 'bebidas', name: 'Bebidas Heladas', emoji: '🥤' },
];

export const INITIAL_PRODUCTS: MenuItem[] = [
  {
    id: 'pepito-tradicional',
    name: 'Pepito Tradicional 251',
    category: 'pepitos',
    price: 9.50,
    badgeType: 'Classic',
    highlight: 'MÁS VENDIDO',
    stats: '🥖 30cm • 🥩 Lomito Angus • 🧀 Queso Pecorino',
    description: 'Lomito de res tierno a la plancha, lluvia abundante de queso pecorino larense, papitas ralladas crocantes, repollo fresco y la clásica salsa tártara de ajo guara.',
    dressing: 'Salsa Tártara Tradicional (+120 Cal)',
    image: 'https://images.unsplash.com/photo-1627042633706-0150c1800752?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-brandBlue',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'pepito-mixto-supreme',
    name: 'Pepito Mixto 4 Estrellas',
    category: 'pepitos',
    price: 11.50,
    badgeType: 'Especial',
    highlight: 'ESPECIAL GUARO',
    stats: '🥖 30cm • 🍗 Lomito + Pollo + Tocineta • 🧀 Gratinado',
    description: 'Tiras de lomito jugoso, pechuga a la plancha sazonada, tocineta ahumada crujiente, queso de mano gratinado al horno y baño de salsa de maíz dulce.',
    dressing: 'Salsa Tártara y Maíz de la Casa (+140 Cal)',
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-brandBlue',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'pepito-el-obelisco',
    name: 'Pepito Monumental 50 CM',
    category: 'pepitos',
    price: 15.00,
    badgeType: 'Gigante',
    highlight: 'TAMAÑO 50 CM',
    stats: '🥖 50cm • 🥩 3 Carnes • 🥓 Tocineta Crunch',
    description: 'Homenaje a la tradición en 50 centímetros: Lomito, chuleta ahumada, pechuga desmechada, queso amarillo Kraft rallado estilo montaña, papitas y salsa alemana especial.',
    dressing: 'Salsa Alemana & Guasacaca (+160 Cal)',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-brandBlue',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'pepito-gratinado-queso-mano',
    name: 'Pepito Quesúo con Queso de Mano',
    category: 'pepitos',
    price: 10.50,
    badgeType: 'Quesúo',
    highlight: 'SUPER QUESÚO',
    stats: '🥖 30cm • 🧀 Rueda de Queso de Mano • 🥩 Carne Parrilla',
    description: 'Lomito de primera cubierto por una rueda completa de queso de mano fresco derretido sobre el pan caliente, toques de orégano campesino y aliño guaro.',
    dressing: 'Mantequilla de ajo & Tártara (+110 Cal)',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-brandBlue',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'burger-guara-brutal',
    name: 'Hamburguesa La Campiña Doble',
    category: 'burgers',
    price: 8.50,
    badgeType: 'Doble',
    highlight: 'DOBLE CARNE',
    stats: '🍔 320g Carne • 🍳 Huevo Frito • 🥓 Jamón y Tocineta',
    description: 'Doble torta de carne de res molida y sazonada con ajo porrito, huevo frito a la plancha, queso amarillo derretido, lechuga, tomate y papitas rústicas.',
    dressing: 'Salsa Rosada Ahumada (+95 Cal)',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-emerald-600',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'burger-crispy-chucho',
    name: 'Hamburguesa Pollo Crispy 251',
    category: 'burgers',
    price: 7.90,
    badgeType: 'Crispy',
    highlight: 'CRISPY SUPREMO',
    stats: '🍔 Pechuga Empanizada • 🧀 Cheddar • 🥒 Pepinillos',
    description: 'Milanesa de pechuga extra crocante marinada en especias, queso cheddar fundido, ensaladita coleslaw casera y salsa agridulce especial.',
    dressing: 'Honey Mustard de Panela (+105 Cal)',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-emerald-600',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'papas-monstruo-guaras',
    name: 'Papas Monstruo House 251',
    category: 'papas',
    price: 7.50,
    badgeType: 'Para Compartir',
    highlight: 'PARA COMPARTIR',
    stats: '🍟 500g Papas • 🥓 Tocineta • 🧀 Cheddar Fundido',
    description: 'Canasta de papas fritas crocantes bañadas en queso cheddar líquido de la casa, lluvia de tocineta frita dorada y cebollín fresco picado.',
    dressing: 'Dip de Salsa de Ajo de Sanare (+130 Cal)',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-purple-700',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'papas-mixtas-parrilleras',
    name: 'Papas Parrilleras con Lomito',
    category: 'papas',
    price: 9.00,
    badgeType: 'Especial',
    highlight: 'FULL CARNE',
    stats: '🍟 Papas Rústicas • 🥩 Lomito Picado • 🧀 Pecorino',
    description: 'Papas fritas con trozos tiernos de lomito a la parrilla, bañadas en salsa tártara, salsa bbq de papelón y coronadas con abundante pecorino.',
    dressing: 'Salsa BBQ Dulce de Papelón (+80 Cal)',
    image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-purple-700',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'ensalada-cesar-guara',
    name: 'Ensalada César Bowl 251',
    category: 'ensaladas',
    price: 7.00,
    badgeType: 'Fresco',
    highlight: 'FRESCURA VERDE',
    stats: '🥗 350 Cal • 🍗 26g Proteína • 🥑 Aguacate',
    description: 'Lechuga romana extra crocante, tiras de pechuga al grill, crutones con mantequilla de ajo, lascas de pecorino y aguacate maduro.',
    dressing: 'Aderezo César Casero Cremoso (+90 Cal)',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-brandBlue',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'ensalada-crunch-avellana',
    name: 'Bowl Proteico Parrillero',
    category: 'ensaladas',
    price: 8.00,
    badgeType: 'Healthy',
    highlight: 'HEALTHY FIT',
    stats: '🥗 390 Cal • 🥩 30g Proteína • 🌽 Maíz Tierno',
    description: 'Mix de hojas verdes frescas, lomito magro a la plancha, maíz dulce salteado, tomates cherry dulces, cebolla morada encurtida y queso blanco llanero en cubos.',
    dressing: 'Vinagreta Balsámica de Miel (+70 Cal)',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-brandBlue',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'bebida-papelon-limon',
    name: 'Papelón con Limón Frío',
    category: 'bebidas',
    price: 2.00,
    badgeType: 'Natural',
    highlight: 'TRADICIONAL',
    stats: '🥤 500ml • 🍋 Limón Criollo • 🧊 Frappé',
    description: 'El clásico e insustituible papelón con limón bien frío con hielo frappé para acompañar tu pepito.',
    dressing: 'Refrescante 100% natural',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-amber-600',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'bebida-refresco-polar',
    name: 'Malta y Refrescos Variados',
    category: 'bebidas',
    price: 1.50,
    badgeType: 'Helada',
    highlight: 'BIEN FRÍA',
    stats: '🥤 355ml • 🧊 Lata Helada',
    description: 'Escoge tu bebida helada: Malta Polar, Frescolita, Coca-Cola o Chinotto.',
    dressing: 'Directo de la cava helada',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-amber-600',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  }
];

export const CATEGORY_MODIFIERS: Record<string, ProductGroup[]> = {
  pepitos: [
    {
      id: 'size',
      name: 'Elige el Tamaño',
      type: 'single',
      options: [
        { id: '30cm', name: '30 cm (Individual)', priceDelta: 0 },
        { id: '50cm', name: '50 cm (Para Dos)', priceDelta: 3.00 },
        { id: '1metro', name: '1 Metro (Guaro Fest)', priceDelta: 8.50 },
      ]
    },
    {
      id: 'extras',
      name: 'Salsas y Toppings Extra',
      type: 'multiple',
      options: [
        { id: 'extra-queso-mano', name: 'Queso de Mano a la Plancha', priceDelta: 1.50 },
        { id: 'extra-aguacate', name: 'Aguacate Cremoso', priceDelta: 1.00 },
        { id: 'extra-salsa-maiz', name: 'Salsa de Maíz Dulce Dulcito', priceDelta: 0.50 },
        { id: 'extra-tocineta', name: 'Tocineta Ahumada Crujiente', priceDelta: 1.50 },
        { id: 'extra-pecorino', name: 'Lluvia Extra de Queso Pecorino', priceDelta: 1.20 }
      ]
    }
  ],
  burgers: [
    {
      id: 'extras-burger',
      name: 'Adicionales para tu Hamburguesa',
      type: 'multiple',
      options: [
        { id: 'doble-queso', name: 'Queso Amarillo Extra Fundido', priceDelta: 1.00 },
        { id: 'huevo-plancha', name: 'Huevo a la Plancha', priceDelta: 1.00 },
        { id: 'tocineta-extra', name: 'Tiras de Tocineta Crujiente', priceDelta: 1.50 },
        { id: 'carne-extra', name: 'Carne Adicional 160g', priceDelta: 2.50 }
      ]
    }
  ],
  papas: [
    {
      id: 'toppings-papas',
      name: 'Toppings para tus Papas',
      type: 'multiple',
      options: [
        { id: 'extra-cheddar', name: 'Bañadas en Extra Queso Cheddar', priceDelta: 1.20 },
        { id: 'carne-lomito-topping', name: 'Troceado de Lomito Parrillero', priceDelta: 2.80 },
        { id: 'salsa-tartara-dip', name: 'Dip Adicional de Tártara Especial', priceDelta: 0.80 }
      ]
    }
  ]
};
