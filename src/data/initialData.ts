import { EcoReport, CommunityIdea, Campaign, RecyclingMaterial, CleanPointRD, CommunityMember } from '../types';

// La aplicación inicia limpia sin datos falsos ni pruebas inventadas.
// Los reportes, ideas, campañas y perfiles de comunidad serán creados genuinamente por los usuarios.
export const INITIAL_REPORTS: EcoReport[] = [];

export const INITIAL_IDEAS: CommunityIdea[] = [];

export const INITIAL_CAMPAIGNS: Campaign[] = [];

export const COMMUNITY_MEMBERS: CommunityMember[] = [];

export const DOMINICAN_PROVINCES: string[] = [
  'Distrito Nacional',
  'Santo Domingo Este',
  'Santo Domingo Norte',
  'Santo Domingo Oeste',
  'Santiago de los Caballeros',
  'San Cristóbal',
  'La Vega',
  'Puerto Plata',
  'San Pedro de Macorís',
  'La Romana',
  'Samaná',
  'Barahona',
  'Duarte (San Fco. de Macorís)',
  'Espaillat (Moca)',
  'Otra provincia'
];

export const RECYCLING_MATERIALS: RecyclingMaterial[] = [
  {
    id: 'mat-plastico',
    name: 'Plásticos (PET y HDPE)',
    iconName: 'Wine',
    color: '#0284c7', // sky-600
    badge: 'PET 1 / HDPE 2',
    description: 'Botellas de agua, refrescos, envases de detergente, champú y galones plásticos limpios.',
    allowedItems: [
      'Botellas plásticas transparentes de agua y refresco (PET 1)',
      'Galones de cloro, desinfectante y detergente líquido (HDPE 2)',
      'Envases de champú, cremas y acondicionador bien enjuagados',
      'Tapas plásticas de botellas'
    ],
    notAllowedItems: [
      'Bolsas plásticas de un solo uso muy sucias o con restos de comida',
      'Plásticos tipo 3 (PVC) o tipo 7 (mezclas no reciclables localmente)',
      'Envases de aceite de motor o químicos industriales tóxicos',
      'Plastos y cubiertos desechables de poliestireno (foam)'
    ],
    preparationTips: [
      'Vaciar completamente el contenido líquido.',
      'Enjuagar brevemente con un poco de agua reutilizada.',
      'Aplastar la botella para reducir su volumen.',
      'Las tapas plásticas se pueden entregar juntas para proyectos de donación benéfica.'
    ],
    rdContextNote: 'En RD, miles de toneladas de botellas plásticas terminan en el Río Ozama o en vertederos como Duquesa. Reciclarlas reduce drásticamente el taponamiento de imbornales en temporadas de tormentas.'
  },
  {
    id: 'mat-papel',
    name: 'Papel y Cartón',
    iconName: 'Layers',
    color: '#d97706', // amber-600
    badge: 'Limpio y Seco',
    description: 'Material 100% biodegradable y reciclable múltiples veces siempre que se conserve seco y libre de grasas.',
    allowedItems: [
      'Cajas de cartón corrugado de envíos o electrodomésticos',
      'Papel bond de oficina, cuadernos usados y libros viejos',
      'Periódicos y revistas',
      'Cajas de cereal y medicamentos'
    ],
    notAllowedItems: [
      'Cajas de pizza manchadas con grasa o queso derretido',
      'Papel higiénico, servilletas o papel toalla usado',
      'Papel carbón, térmico (facturas de supermercado) o plastificado'
    ],
    preparationTips: [
      'Desarmar las cajas de cartón para que queden totalmente planas.',
      'Retirar cintas adhesivas gruesas y grapas metálicas grandes.',
      'Mantener alejado de la lluvia y humedad hasta el día de entrega.'
    ],
    rdContextNote: 'Las industrias locales de empaque y cajas agrícolas en el Cibao utilizan cartón reciclado para fabricar embalajes de banano y frutas de exportación.'
  },
  {
    id: 'mat-vidrio',
    name: 'Vidrio',
    iconName: 'Wine',
    color: '#059669', // emerald-600
    badge: 'Infinitamente Reciclable',
    description: 'El vidrio puede fundirse y reciclarse infinitas veces sin perder pureza, calidad ni transparencia.',
    allowedItems: [
      'Botellas de refresco, cerveza y vino',
      'Frascos de conservas, mermeladas y mayonesa',
      'Envases de perfume y cosméticos de vidrio transparente o de color'
    ],
    notAllowedItems: [
      'Espejos, vidrios planos de ventanas o parabrisas de vehículos',
      'Bombillos y tubos fluorescentes (contienen mercurio)',
      'Cristalería fina o vajilla de cerámica y porcelana'
    ],
    preparationTips: [
      'Lavar el interior para eliminar restos de salsas o azúcar.',
      'Retirar tapas metálicas o plásticas y clasificarlas por separado.',
      'Nunca romper las botellas a propósito; transportarlas enteras con cuidado.'
    ],
    rdContextNote: 'La industria cervecera y de bebidas en RD tiene un alto índice de recuperación de botellas retornables. Participar en estos programas apoya la economía circular nacional.'
  },
  {
    id: 'mat-metal',
    name: 'Metales (Aluminio y Hojalata)',
    iconName: 'Shield',
    color: '#64748b', // slate-500
    badge: 'Alto Valor de Reciclaje',
    description: 'El aluminio requiere 95% menos energía para reciclarse que para extraerlo nuevo de la bauxita.',
    allowedItems: [
      'Latas de refrescos, jugos y bebidas carbonatadas (Aluminio)',
      'Latas de maíz, atún, salsa de tomate y leche evaporada (Hojalata)',
      'Tapas metálicas de botellas (chapas) y frascos de vidrio'
    ],
    notAllowedItems: [
      'Latas de aerosol con presión remanente o inflamables',
      'Baterías de vehículos o pilas secas',
      'Envases metálicos que contuvieron pintura al óleo o pesticidas'
    ],
    preparationTips: [
      'Enjuagar bien para evitar que atraiga hormigas o insectos.',
      'Aplastar las latas de aluminio pisándolas suavemente.',
      'Empacar en bolsas transparentes o cajas pequeñas.'
    ],
    rdContextNote: 'Las latas de aluminio tienen una tasa de compra inmediata en los centros de acopio autorizados del país debido a su alta demanda industrial.'
  },
  {
    id: 'mat-raee',
    name: 'Aparatos Electrónicos (RAEE)',
    iconName: 'Cpu',
    color: '#7c3aed', // violet-600
    badge: 'Manejo Especial',
    description: 'Celulares, computadoras, cables y cargadores que contienen minerales valiosos y componentes que no deben terminar en la basura común.',
    allowedItems: [
      'Teléfonos móviles, tabletas y cargadores viejos',
      'Cables de audio, video y fuentes de poder quemadas',
      'Laptops, tarjetas electrónicas y teclados',
      'Pequeños electrodomésticos (secadores, radios)'
    ],
    notAllowedItems: [
      'Baterías de plomo-ácido abiertas o sulfatadas',
      'Neveras o aires acondicionados con fuga activa de gas refrigerante sin técnico certificado'
    ],
    preparationTips: [
      'Borrar datos personales si se trata de un teléfono o computadora.',
      'Guardar los cables enrollados para facilitar el inventario.',
      'Entregar únicamente en puntos verdes o jornadas especiales de recolección electrónica.'
    ],
    rdContextNote: 'Universidades dominicanas como el INTEC y la PUCMM organizan anualmente reciclatones tecnológicos para canalizar estos materiales de manera segura.'
  },
  {
    id: 'mat-organico',
    name: 'Residuos Orgánicos y Compost',
    iconName: 'Sprout',
    color: '#16a34a', // green-600
    badge: 'Nutrientes para la Tierra',
    description: 'Cáscaras de plátano, restos de café y vegetales que pueden nutrir la tierra en lugar de producir gas metano en vertederos.',
    allowedItems: [
      'Cáscaras de víveres (plátano, yuca, papa), frutas y vegetales',
      'Posos de café colado dominicano y bolsitas de té natural',
      'Hojas secas de jardín, aserrín limpio y cáscaras de huevo trituradas'
    ],
    notAllowedItems: [
      'Carnes, huesos, grasas o aceites de cocina usados',
      'Excrementos de mascotas o arena de gatos',
      'Comida cocinada con mucha sal o condimentos'
    ],
    preparationTips: [
      'Picar en trozos pequeños para acelerar la descomposición.',
      'Mezclar una parte húmeda (vegetales) con dos partes secas (hojas secas/cartón sin tinta).',
      'Mantener aireado para evitar malos olores.'
    ],
    rdContextNote: 'Más del 50% de los residuos generados en hogares dominicanos son orgánicos. Compostar alivia directamente el volumen enviado a los camiones recolectores.'
  }
];

export const CLEAN_POINTS_RD: CleanPointRD[] = [
  {
    id: 'punto-1',
    name: 'Punto Verde Ágora Mall',
    province: 'Distrito Nacional',
    address: 'Av. John F. Kennedy esq. Av. Abraham Lincoln, Nivel Sótano 1',
    schedule: 'Lunes a Domingo, 8:00 AM - 9:00 PM',
    materialsAccepted: ['Plásticos PET', 'Papel y Cartón', 'Vidrio', 'Aluminio', 'RAEE Electrónicos pequeños'],
    managedBy: 'Ágora Mall & NUVI',
    phone: '(809) 472-2000'
  },
  {
    id: 'punto-2',
    name: 'Punto Limpio Downtown Center',
    province: 'Distrito Nacional',
    address: 'Av. Núñez de Cáceres esq. Rómulo Betancourt, Bella Vista',
    schedule: 'Lunes a Sábado, 9:00 AM - 8:00 PM',
    materialsAccepted: ['Plásticos PET', 'Aluminio', 'Tapas plásticas'],
    managedBy: 'Downtown Center & Fundación Botellas de Amor',
    phone: '(809) 955-3000'
  },
  {
    id: 'punto-3',
    name: 'Centro de Acopio Santiago Recicla (PUCMM)',
    province: 'Santiago de los Caballeros',
    address: 'Autopista Duarte Km 1.5, Campus Universitario PUCMM',
    schedule: 'Lunes a Viernes, 8:00 AM - 5:00 PM',
    materialsAccepted: ['Plásticos PET y HDPE', 'Cartón', 'Papel de archivo', 'Aluminio', 'Electrónicos'],
    managedBy: 'Comité de Sostenibilidad PUCMM',
    phone: '(809) 580-1962'
  },
  {
    id: 'punto-4',
    name: 'Estación de Reciclaje Santo Domingo Este',
    province: 'Santo Domingo Este',
    address: 'Av. España próx. al Acuario Nacional',
    schedule: 'Lunes a Viernes, 8:30 AM - 4:00 PM',
    materialsAccepted: ['Plásticos PET', 'Cartón', 'Vidrio'],
    managedBy: 'Alcaldía de Santo Domingo Este & Voluntariado Comunitario'
  }
];
