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
  { slug: 'pepitos', name: 'Pepitos Guaros', emoji: '🥖' },
  { slug: 'burgers', name: 'Hamburguesas Smash', emoji: '🍔' },
  { slug: 'sandwiches', name: 'Sándwiches & Especiales', emoji: '🥪' },
  { slug: 'ensaladas', name: 'Ensaladas César', emoji: '🥗' },
  { slug: 'papas-entradas', name: 'Papas & Entradas', emoji: '🍟' },
  { slug: 'bebidas', name: 'Bebidas Heladas', emoji: '🥤' },
];

export const INITIAL_PRODUCTS: MenuItem[] = [
  // ==========================================
  // 🥖 CATEGORÍA: PEPITOS GUAROS (29 CM)
  // ==========================================
  {
    id: 'pepito-clasico',
    name: 'Pepito Clásico',
    category: 'pepitos',
    price: 13.00,
    badgeType: 'Popular',
    highlight: 'EL MÁS PEDIDO',
    stats: '🥖 29cm • 🥩 250g Proteína • 🍟 Papas Fritas',
    description: '250 Grs de Lomito, Pollo o Mixto con Tocineta crocante y abundante Queso Pecorino en un Pan de la casa de 29 cm, acompañado de Papas Fritas.',
    dressing: 'Salsa Tártara y de Ajo Guara',
    image: 'https://images.unsplash.com/photo-1627042633706-0150c1800752?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-brandBlue',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'pepito-champinon',
    name: 'Pepito con Champiñón',
    category: 'pepitos',
    price: 13.50,
    badgeType: 'Especial',
    highlight: 'CON CHAMPIÑONES',
    stats: '🥖 29cm • 🍄 Champiñones • 🧀 Pecorino',
    description: '250 Grs de Lomito, Pollo, Mixto o Triple con Champiñones salteados y Queso Pecorino en un Pan de la casa de 29 cm, acompañado de Papas Fritas.',
    dressing: 'Salsas de la casa y ajo',
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-brandBlue',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'pepito-gratinado',
    name: 'Pepito Gratinado',
    category: 'pepitos',
    price: 14.00,
    badgeType: 'Gratinado',
    highlight: 'FULL MOZZARELLA',
    stats: '🥖 29cm • 🧀 Mozzarella Fundido • 🥓 Tocineta',
    description: '250 Grs entre Lomito, Pollo, Mixto o Triple con Tocineta, generosa capa de Queso Mozzarella gratinado y Queso Pecorino en Pan de la casa de 29 cm, con Papas Fritas.',
    dressing: 'Salsa Tártara y Maíz',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-brandBlue',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'pepito-lomito-gratinado',
    name: 'Pepito Lomito Gratinado',
    category: 'pepitos',
    price: 14.50,
    badgeType: '100% Lomito',
    highlight: 'LOMITO SELECTO',
    stats: '🥖 29cm • 🥩 Puro Lomito • 🧀 Mozzarella Gratinado',
    description: '250 Grs de puro lomito de res tierno a la plancha, tocineta ahumada crujiente, mozzarella gratinado al horno y pecorino en pan de la casa de 29 cm con papas.',
    dressing: 'Mantequilla de Ajo y Tártara Especial',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-brandBlue',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'pepito-mar-tierra',
    name: 'Pepito Mar y Tierra',
    category: 'pepitos',
    price: 14.00,
    badgeType: 'Gourmet',
    highlight: 'CAMARONES A LA PLANCHA',
    stats: '🥖 29cm • 🍤 Camarones • 🥩 Lomito o Pollo',
    description: '250 Grs entre Lomito o Pollo y jugosos Camarones a la plancha, Tocineta crocante y Queso Pecorino en Pan de la casa de 29 cm, acompañado de Papas Fritas.',
    dressing: 'Mantequilla de Ajo y Tártara de la Casa',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-brandBlue',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'pepito-mar-tierra-gratinado',
    name: 'Pepito Mar y Tierra Gratinado',
    category: 'pepitos',
    price: 15.00,
    badgeType: 'Premium',
    highlight: 'GRATINADO SUPREMO',
    stats: '🥖 29cm • 🍤 Camarones • 🧀 Mozzarella Gratinado',
    description: 'Combinación gourmet de Camarones a la plancha y Lomito o Pollo con tocineta, cubierto con generoso queso mozzarella gratinado al horno y pecorino con papas.',
    dressing: 'Mantequilla de Ajo y Tártara Especial',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-brandBlue',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'pepito-4-quesos',
    name: 'Pepito 4 Quesos',
    category: 'pepitos',
    price: 15.00,
    badgeType: 'Super Quesúo',
    highlight: '4 QUESOS FUNDIDOS',
    stats: '🥖 29cm • 🧀 Crema + Americano + Mozzarella + Pecorino',
    description: '250 Grs Proteína Lomito, Pollo, Mixto o Triple con Tocineta, Queso Crema, Queso Americano, Mozzarella y Queso Pecorino en Pan de 29 cm con Papas Fritas.',
    dressing: 'Salsas de la casa y crema de queso',
    image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-brandBlue',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'pepito-capressa',
    name: 'Pepito Capressa',
    category: 'pepitos',
    price: 13.50,
    badgeType: 'Gourmet',
    highlight: 'QUESO DE CABRA',
    stats: '🥖 29cm • 🐐 Queso de Cabra • 🌿 Mayonesa Albahaca',
    description: '250 Grs entre Lomito, Pollo, Mixto o Triple con Tocineta, Tomates frescos, Queso de Cabra artesanal y Mayonesa de Albahaca en Pan de la casa de 29 cm.',
    dressing: 'Mayonesa de Albahaca Artesanal',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-brandBlue',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'pepito-philly-cheese',
    name: 'Pepito Philly Cheese',
    category: 'pepitos',
    price: 14.00,
    badgeType: 'Estilo Philly',
    highlight: 'CEBOLLAS SALTEADAS',
    stats: '🥖 29cm • 🥩 Lomito Tierno • 🧀 Queso Americano',
    description: '250 Grs entre Lomito, cebollas salteadas caramelizadas con abundante Queso Americano en Pan de la casa de 29 cm, acompañado de Papas Fritas.',
    dressing: 'Salsa de Queso y Aliño de la Casa',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-brandBlue',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'pepito-primavera',
    name: 'Pepito Primavera',
    category: 'pepitos',
    price: 14.50,
    badgeType: 'Especial',
    highlight: 'CREMOSO MOZZARELLA & MAÍZ',
    stats: '🥖 29cm • 🌽 Maíz Tierno • 🥓 Tocineta Troceada',
    description: 'Pan de la casa con 250g de proteínas (Lomito, Pollo o Mixto), capa de cremoso mozzarella, tocineta troceada, maíz y pecorino en pan de 29 cm con papas.',
    dressing: 'Salsa de Maíz Dulce y Tártara',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-brandBlue',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'pepito-triple-gratinado',
    name: 'Pepito Triple Gratinado',
    category: 'pepitos',
    price: 14.00,
    badgeType: 'Triple Sabor',
    highlight: 'CHULETA AHUMADA',
    stats: '🥖 29cm • 🥩 Lomito + Pollo + Chuleta • 🧀 Gratinado',
    description: '250 Grs de proteínas de lomito, pollo y chuleta ahumada, queso pecorino, salsas de la casa y ración de papas fritas en pan de la casa de 29 cm.',
    dressing: 'Salsas de la Casa y Ajo Guaro',
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-brandBlue',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },

  // ==========================================
  // 🍔 CATEGORÍA: HAMBURGUESAS SMASH
  // ==========================================
  {
    id: 'smash-cheese-burguer',
    name: 'Smash Cheese Burguer',
    category: 'burgers',
    price: 8.00,
    badgeType: 'Smash',
    highlight: 'PAN DE PAPA',
    stats: '🍔 120g Solomo Smash • 🧀 Queso Americano • 🍟 Papas Fritas',
    description: 'Pan de papa artesanal con 120 Grs Solomo Smash, Queso Americano, pepinillos crujientes y salsa de la casa, acompañado de Papas Fritas.',
    dressing: 'Salsa Especial de la Casa',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-emerald-600',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'smash-bacon-cheese-burguer',
    name: 'Smash Bacon Cheese Burguer',
    category: 'burgers',
    price: 8.50,
    badgeType: 'Bacon Smash',
    highlight: 'TOCINETA CRUNCH',
    stats: '🍔 120g Solomo • 🥓 Tocineta • 🧀 Queso Americano',
    description: 'Pan de papa artesanal con 120 Grs Solomo Smash, Queso Americano, tocineta crujiente, pepinillos y salsa de la casa, acompañado de Papas Fritas.',
    dressing: 'Salsa de la Casa y Ajo',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-emerald-600',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'smash-champinon-burguer',
    name: 'Smash Champiñón Burguer',
    category: 'burgers',
    price: 9.00,
    badgeType: 'Champiñón & Bacon',
    highlight: 'CHAMPIÑÓN SALTEADO',
    stats: '🍔 120g Solomo • 🍄 Champiñón • 🥓 Tocineta',
    description: 'Pan de papa con 120 Grs Solomo Smash, Queso Americano, champiñones salteados, tocineta, pepinillos y salsa de la casa, con Papas Fritas.',
    dressing: 'Salsa Especial de la Casa',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-emerald-600',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'smash-burguer-house-251',
    name: 'Smash Burguer House 251',
    category: 'burgers',
    price: 9.00,
    badgeType: 'Especial 251',
    highlight: 'LA ESPECIAL DE LA CASA',
    stats: '🍔 120g Solomo • 🧅 Cebollas Caramelizadas • 🍄 Champiñón',
    description: 'Pan de papa con 120 Grs Solomo Smash, Queso Americano, tocineta, champiñón, cebollas caramelizadas, pepinillos y salsa de la casa, con Papas Fritas.',
    dressing: 'Salsa Especial House 251',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-emerald-600',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'doble-smash-burger',
    name: 'Doble Smash Burger',
    category: 'burgers',
    price: 10.00,
    badgeType: 'Doble Carne',
    highlight: '250G CARNE DE PRIMERA',
    stats: '🍔 250g Carne • 🧀 Doble Facilitas Kraft • 🥒 Pepinillos',
    description: 'Delicioso pan de papa, 250 Grs de carne de primera (solomo o mixta), doble queso Facilitas Kraft, pepinillos y salsa especial de la casa con papas.',
    dressing: 'Salsa Especial de la Casa',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-emerald-600',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'triple-smash-mixta',
    name: 'Triple Smash Mixta',
    category: 'burgers',
    price: 11.00,
    badgeType: 'Triple Smash',
    highlight: '3 CARNES: SOLOMO/CERDO/POLLO',
    stats: '🍔 3 Carnes • 🍳 Huevo • 🥓 Tocineta • 🧀 Queso Kraft',
    description: '3 tipos de carnes: Solomo, Cerdo y Pollo, queso Facilitas Kraft, tocineta crocante, huevo y vegetales frescos, acompañado de papas fritas.',
    dressing: 'Salsa Especial y Ajo de la Casa',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-emerald-600',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'triple-especial-solomo',
    name: 'Triple Especial Solomo',
    category: 'burgers',
    price: 12.00,
    badgeType: 'Puro Solomo',
    highlight: 'TRIPLE CARNE SOLOMO',
    stats: '🍔 3 Patties Solomo • 🧀 Queso Kraft • 🥓 Tocineta',
    description: 'Para verdaderos amantes de la carne: 3 smash patties de puro solomo, queso Facilitas Kraft, tocineta crujiente, huevo y vegetales con papas fritas.',
    dressing: 'Salsa Especial House 251',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-emerald-600',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },

  // ==========================================
  // 🥪 CATEGORÍA: SÁNDWICHES & ESPECIALES
  // ==========================================
  {
    id: 'club-house-refresco',
    name: 'Club House + Refresco 1L',
    category: 'sandwiches',
    price: 11.00,
    badgeType: 'Combo Completo',
    highlight: 'INCLUYE REFRESCO 1L',
    stats: '🥪 4 Pisos • 🍗 Pollo + Jamón + Gouda • 🥤 Refresco 1L',
    description: 'El clásico sándwich Club House con pollo a la plancha, jamón, queso gouda, vegetales frescos, huevo, salsas tradicionales y abundantes papas fritas. ¡Incluye Refresco 1L!',
    dressing: 'Salsas Tradicionales y Tártara',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-orange-600',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'sandwich-de-pernil',
    name: 'Sandwich de Pernil',
    category: 'sandwiches',
    price: 10.00,
    badgeType: 'Tradicional',
    highlight: 'PERNIL HORNEADO',
    stats: '🥪 Pan Canilla de la Casa • 🐷 Pernil Jugoso • 🍅 Vegetales',
    description: 'Pan canilla de la casa recién horneado, tomate fresco, lechuga, jugosos trozos de cerdo con un toque especial y salsa de la casa con papas fritas.',
    dressing: 'Salsa Especial de la Casa',
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-orange-600',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'perro-caliente-tradicional',
    name: 'Perro Caliente Tradicional',
    category: 'sandwiches',
    price: 2.00,
    badgeType: 'Clásico Guaro',
    highlight: 'EL TRADICIONAL',
    stats: '🌭 Salchicha • 🧀 Queso Blanco Llanero • 🥔 Papitas Crunch',
    description: 'Clásico perro caliente con salchicha al vapor, cebollita finamente picada, lluvia crocante de papitas, queso blanco rallado y salsas tradicionales.',
    dressing: 'Salsas Tradicionales de la Casa',
    image: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-orange-600',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },

  // ==========================================
  // 🥗 CATEGORÍA: ENSALADAS CÉSAR
  // ==========================================
  {
    id: 'ensalada-cesar',
    name: 'Ensalada César',
    category: 'ensaladas',
    price: 7.00,
    badgeType: 'Fresco',
    highlight: 'ADEREZO ARTESANAL',
    stats: '🥗 200g Mix Lechugas • 🥓 Tocineta • 🍞 Crutones',
    description: '200 Grs de mix de lechugas frescas seleccionadas, tocineta en trozos crujientes, crutones dorados y aderezo césar artesanal.',
    dressing: 'Aderezo César Artesanal de la Casa',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-teal-600',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'ensalada-cesar-pollo',
    name: 'Ensalada César con Pollo',
    category: 'ensaladas',
    price: 9.50,
    badgeType: 'Proteica',
    highlight: 'POLLO AL GRILL',
    stats: '🥗 200g Lechugas • 🍗 Pechuga Grill • 🥓 Tocineta',
    description: '200 Grs de mix de lechugas frescas, jugosa pechuga de pollo a la plancha sazonada, tocineta en trozos, crutones y aderezo césar artesanal.',
    dressing: 'Aderezo César Artesanal',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-teal-600',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'ensalada-cesar-camaron',
    name: 'Ensalada César con Camarón',
    category: 'ensaladas',
    price: 11.00,
    badgeType: 'Mar & Frescura',
    highlight: 'CAMARONES AL GRILL',
    stats: '🥗 200g Lechugas • 🍤 Camarones a la Plancha • 🍞 Crutones',
    description: '200 Grs de mix de lechugas frescas, camarones a la plancha salteados en mantequilla de ajo, tocineta en trozos, crutones y aderezo césar artesanal.',
    dressing: 'Aderezo César Artesanal',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-teal-600',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },

  // ==========================================
  // 🍟 CATEGORÍA: PAPAS & ENTRADAS
  // ==========================================
  {
    id: 'papas-pequenas',
    name: 'Ración Papas Fritas Pequeña',
    category: 'papas-entradas',
    price: 3.00,
    badgeType: 'Crocante',
    highlight: 'INDIVIDUAL',
    stats: '🍟 Papas Crujientes • 🧂 Sal Marina',
    description: 'Porción individual de papas fritas doradas y crujientes con el punto exacto de sal.',
    dressing: 'Salsa tártara o de ajo',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-purple-700',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'papas-grandes',
    name: 'Ración Papas Fritas Grande',
    category: 'papas-entradas',
    price: 5.00,
    badgeType: 'Para Compartir',
    highlight: 'CANASTA FAMILIAR',
    stats: '🍟 Porción Grande • 🧂 Sal Marina',
    description: 'Generosa canasta de papas fritas doradas y crujientes, perfecta para compartir entre amigos o familia.',
    dressing: 'Salsa tártara o de ajo',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-purple-700',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'papas-queso-pqna',
    name: 'Papas con Queso y Tocineta Pequeña',
    category: 'papas-entradas',
    price: 4.00,
    badgeType: 'Quesúas',
    highlight: 'CHEDDAR & BACON',
    stats: '🍟 Papas Crujientes • 🧀 Queso Fundido • 🥓 Tocineta',
    description: 'Papas fritas crujientes bañadas en queso derretido caliente y lluvia de tocineta crocante dorada.',
    dressing: 'Salsa de Queso Especial',
    image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-purple-700',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'papas-queso-grde',
    name: 'Papas con Queso y Tocineta Grande',
    category: 'papas-entradas',
    price: 6.00,
    badgeType: 'Monstruo',
    highlight: 'LA FAVORITA',
    stats: '🍟 Canasta Grande • 🧀 Full Queso • 🥓 Abundante Bacon',
    description: 'Canasta grande de papas fritas crujientes bañadas en generosa salsa de queso derretido y lluvia abundante de tocineta crujiente.',
    dressing: 'Salsa de Queso Especial',
    image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-purple-700',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'nuggets-pollo',
    name: 'Nuggets de Pollo (10 Piezas)',
    category: 'papas-entradas',
    price: 8.00,
    badgeType: 'Para Picar',
    highlight: '10 PIEZAS + PAPAS',
    stats: '🍗 10 Nuggets • 🍟 Papas Fritas • 🥫 Salsa',
    description: '10 piezas de nuggets de pechuga de pollo dorados y crujientes, acompañados de abundante ración de papas fritas y salsas.',
    dressing: 'Salsa BBQ y Tártara',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-purple-700',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'mini-empanadas-queso',
    name: 'Ración Mini Empanadas Queso (6 Und)',
    category: 'papas-entradas',
    price: 4.00,
    badgeType: 'Criollo',
    highlight: '6 EMPANADITAS',
    stats: '🥟 6 Unidades • 🧀 Queso Blanco • 🧄 Salsa de Ajo',
    description: '6 deliciosas mini empanaditas de masa de maíz crocante rellenas de queso blanco derretido, servidas con salsa tártara y salsa de ajo.',
    dressing: 'Salsa de Ajo y Tártara Guara',
    image: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-purple-700',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'extra-salsa',
    name: 'Extra Salsa de la Casa',
    category: 'papas-entradas',
    price: 1.00,
    badgeType: 'Extra',
    highlight: 'SABOR GUARO',
    stats: '🥫 Envase 2oz • 🧄 Elige tu Favorita',
    description: 'Elige tu salsa especial en envase de 2oz: Salsa Chica Sexy, Salsa de Ajo de la casa, Salsa Tártara tradicional o Salsa de Queso fundido.',
    dressing: 'Receta Artesanal',
    image: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-purple-700',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },

  // ==========================================
  // 🥤 CATEGORÍA: BEBIDAS HELADAS & CERVEZAS
  // ==========================================
  {
    id: 'refresco-350ml',
    name: 'Refresco 350ml',
    category: 'bebidas',
    price: 1.00,
    badgeType: 'Helado',
    highlight: '350 ML',
    stats: '🥤 350ml • 🧊 De Botella Helada',
    description: 'Refresco personal de 350ml bien frío (Coca-Cola, Frescolita, Chinotto según disponibilidad).',
    dressing: 'Directo de la cava',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-amber-600',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'malta',
    name: 'Malta Polar',
    category: 'bebidas',
    price: 1.00,
    badgeType: 'Tradicional',
    highlight: 'BIEN FRÍA',
    stats: '🥤 Malta Polar • 🧊 Helada',
    description: 'La clásica e inigualable Malta Polar venezolana, servida a temperatura óptima.',
    dressing: 'Directo de la cava',
    image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-amber-600',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'cerveza-polar',
    name: 'Cerveza Polar',
    category: 'bebidas',
    price: 1.50,
    badgeType: 'Cerveza',
    highlight: 'POLARCITA PILSER',
    stats: '🍺 Polar Pilsen • 🧊 Vestida de Novia',
    description: 'Cerveza Polar Pilsen venezolana servida a punto de nieve bien fría.',
    dressing: 'A punto de hielo',
    image: 'https://images.unsplash.com/photo-1608270119337-14231b54a6db?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-amber-600',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'refresco-lata',
    name: 'Refresco en Lata',
    category: 'bebidas',
    price: 2.00,
    badgeType: 'Lata',
    highlight: '355 ML',
    stats: '🥤 355ml • 🧊 Cava Helada',
    description: 'Refresco en lata de 355ml bien frío (Coca-Cola, Frescolita, Sprite, Chinotto).',
    dressing: 'Directo de la cava',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-amber-600',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'yukipack',
    name: 'Jugo Yukery / Yukipack 250ml',
    category: 'bebidas',
    price: 2.00,
    badgeType: 'Jugo',
    highlight: '250 ML',
    stats: '🧃 Yukery 250ml • 🍑 Frutas Variadas',
    description: 'Jugo pasteurizado Yukery en presentación de 250ml (Durazno, Manzana o Pera).',
    dressing: 'Natural y dulce',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-amber-600',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'agua',
    name: 'Agua Mineral 600ml',
    category: 'bebidas',
    price: 2.00,
    badgeType: 'Natural',
    highlight: 'PURIFICADA',
    stats: '💧 600ml • 🧊 Fría o Natural',
    description: 'Botella de agua mineral purificada de 600ml.',
    dressing: '100% pura',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-amber-600',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'agua-gasificada',
    name: 'Agua Gasificada',
    category: 'bebidas',
    price: 2.50,
    badgeType: 'Burbujas',
    highlight: 'CON GAS',
    stats: '💧 Con Gas • 🧊 Helada',
    description: 'Agua mineral con gas refrescante y burbujeante, servida bien fría.',
    dressing: 'Con gas',
    image: 'https://images.unsplash.com/photo-1559839914-ba2a0f8b8989?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-amber-600',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'refresco-1-25',
    name: 'Refresco 1,25 L',
    category: 'bebidas',
    price: 2.50,
    badgeType: 'Mediano',
    highlight: '1,25 LITROS',
    stats: '🥤 1,25 Litros • 🧊 Botella Helada',
    description: 'Botella de 1,25 Litros bien fría para acompañar tus pepitos.',
    dressing: 'Directo de la cava',
    image: 'https://images.unsplash.com/photo-1581098365948-6a5a912b7a49?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-amber-600',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'cerveza-solera',
    name: 'Cerveza Solera',
    category: 'bebidas',
    price: 2.00,
    badgeType: 'Premium',
    highlight: 'SOLERA VERDE / AZUL',
    stats: '🍺 Solera • 🧊 Vestida de Novia',
    description: 'Cerveza Solera Premium bien fría para disfrutar de tu cena guara.',
    dressing: 'A punto de hielo',
    image: 'https://images.unsplash.com/photo-1608270119337-14231b54a6db?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-amber-600',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'lipton',
    name: 'Té Lipton 500ml',
    category: 'bebidas',
    price: 3.00,
    badgeType: 'Té Frío',
    highlight: '500 ML',
    stats: '🧋 500ml • 🍋 Limón o Durazno',
    description: 'Delicioso té frío Lipton sabor limón o durazno, servido bien frío.',
    dressing: 'Frío y refrescante',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-amber-600',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'refresco-1-5',
    name: 'Refresco 1,5 L',
    category: 'bebidas',
    price: 3.00,
    badgeType: 'Familiar',
    highlight: '1,5 LITROS',
    stats: '🥤 1,5 Litros • 🧊 Botella Grande',
    description: 'Botella familiar de 1,5 Litros bien fría.',
    dressing: 'Directo de la cava',
    image: 'https://images.unsplash.com/photo-1581098365948-6a5a912b7a49?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-amber-600',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'refresco-2',
    name: 'Refresco 2 L',
    category: 'bebidas',
    price: 4.00,
    badgeType: 'Mega Familiar',
    highlight: '2 LITROS',
    stats: '🥤 2 Litros • 🧊 Botella Gigante',
    description: 'Botella gigante de 2 Litros para toda la familia.',
    dressing: 'Directo de la cava',
    image: 'https://images.unsplash.com/photo-1581098365948-6a5a912b7a49?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-amber-600',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  },
  {
    id: 'verano',
    name: 'Tinto de Verano',
    category: 'bebidas',
    price: 3.00,
    badgeType: 'Cóctel',
    highlight: 'VINO & SODA HELADA',
    stats: '🍷 Vino Tinto + Soda • 🧊 Hielo y Limón',
    description: 'Preparación especial de vino tinto con toque cítrico y soda helada.',
    dressing: 'Frío con rodaja de limón',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80',
    bgAccent: 'bg-amber-600',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  }
];

export const CATEGORY_MODIFIERS: Record<string, ProductGroup[]> = {
  pepitos: [
    {
      id: 'size',
      name: 'Elige el Tamaño del Pan',
      type: 'single',
      options: [
        { id: '29cm', name: '29 cm (Pan de la Casa + Papas)', priceDelta: 0 },
        { id: '50cm', name: '50 cm (Para Compartir)', priceDelta: 3.00 },
        { id: '1metro', name: '1 Metro (Familiar / Guaro Fest)', priceDelta: 8.50 },
      ]
    },
    {
      id: 'extras',
      name: 'Toppings y Adicionales',
      type: 'multiple',
      options: [
        { id: 'extra-gratinado', name: 'Capa Extra de Queso Gratinado', priceDelta: 1.00 },
        { id: 'extra-tocineta', name: 'Tocineta Ahumada Crujiente', priceDelta: 1.50 },
        { id: 'extra-pecorino', name: 'Lluvia Extra de Queso Pecorino', priceDelta: 1.20 },
        { id: 'extra-champinon', name: 'Champiñones Salteados', priceDelta: 1.50 },
        { id: 'extra-queso-mano', name: 'Rueda de Queso de Mano a la Plancha', priceDelta: 1.50 },
        { id: 'extra-huevo', name: 'Huevo a la Plancha', priceDelta: 1.00 }
      ]
    },
    {
      id: 'salsas',
      name: 'Salsas de la Casa (Elige las que gustes)',
      type: 'multiple',
      options: [
        { id: 'salsa-chica-sexy', name: 'Salsa Chica Sexy', priceDelta: 0.00 },
        { id: 'salsa-ajo', name: 'Salsa de Ajo Guara', priceDelta: 0.00 },
        { id: 'salsa-tartara', name: 'Salsa Tártara Tradicional', priceDelta: 0.00 },
        { id: 'salsa-queso', name: 'Salsa de Queso Fundido', priceDelta: 0.00 },
        { id: 'salsa-maiz', name: 'Salsa de Maíz Dulce', priceDelta: 0.00 },
        { id: 'salsa-bbq', name: 'Salsa BBQ Dulce', priceDelta: 0.00 }
      ]
    }
  ],
  burgers: [
    {
      id: 'vegetales-burger',
      name: 'Vegetales Frescos (Sin costo)',
      type: 'multiple',
      options: [
        { id: 'con-tomate', name: 'Agregar Tomate', priceDelta: 0.00 },
        { id: 'con-cebolla', name: 'Agregar Cebolla', priceDelta: 0.00 },
        { id: 'con-lechuga', name: 'Agregar Lechuga', priceDelta: 0.00 }
      ]
    },
    {
      id: 'extras-burger',
      name: 'Adicionales para tu Hamburguesa',
      type: 'multiple',
      options: [
        { id: 'extra-kraft', name: 'Doble Queso Facilitas Kraft', priceDelta: 1.00 },
        { id: 'extra-bacon', name: 'Tiras de Tocineta Crujiente', priceDelta: 1.50 },
        { id: 'huevo-burger', name: 'Huevo a la Plancha', priceDelta: 1.00 },
        { id: 'champinon-burger', name: 'Champiñones Salteados', priceDelta: 1.50 },
        { id: 'cebolla-caramelizada', name: 'Cebollas Caramelizadas', priceDelta: 1.00 },
        { id: 'carne-extra', name: 'Patty de Carne Smash Extra', priceDelta: 2.50 }
      ]
    },
    {
      id: 'salsas-burger',
      name: 'Salsas de la Casa',
      type: 'multiple',
      options: [
        { id: 'salsa-chica-sexy', name: 'Salsa Chica Sexy', priceDelta: 0.00 },
        { id: 'salsa-ajo', name: 'Salsa de Ajo', priceDelta: 0.00 },
        { id: 'salsa-tartara', name: 'Salsa Tártara', priceDelta: 0.00 },
        { id: 'salsa-queso', name: 'Salsa de Queso', priceDelta: 0.00 }
      ]
    }
  ],
  sandwiches: [
    {
      id: 'salsas-sandwich',
      name: 'Salsas de la Casa',
      type: 'multiple',
      options: [
        { id: 'salsa-chica-sexy', name: 'Salsa Chica Sexy', priceDelta: 0.00 },
        { id: 'salsa-ajo', name: 'Salsa de Ajo', priceDelta: 0.00 },
        { id: 'salsa-tartara', name: 'Salsa Tártara', priceDelta: 0.00 },
        { id: 'salsa-queso', name: 'Salsa de Queso', priceDelta: 0.00 }
      ]
    }
  ],
  ensaladas: [
    {
      id: 'aderezo-ensalada',
      name: 'Aderezo',
      type: 'single',
      options: [
        { id: 'aderezo-cesar', name: 'Aderezo César Artesanal de la Casa', priceDelta: 0.00 },
        { id: 'aderezo-extra', name: 'Porción Extra de Aderezo César', priceDelta: 1.00 }
      ]
    }
  ],
  'papas-entradas': [
    {
      id: 'salsas-dip',
      name: 'Salsas para Acompañar',
      type: 'multiple',
      options: [
        { id: 'salsa-chica-sexy', name: 'Salsa Chica Sexy', priceDelta: 0.00 },
        { id: 'salsa-ajo', name: 'Salsa de Ajo Guara', priceDelta: 0.00 },
        { id: 'salsa-tartara', name: 'Salsa Tártara', priceDelta: 0.00 },
        { id: 'salsa-queso', name: 'Salsa de Queso', priceDelta: 0.00 }
      ]
    }
  ]
};
