export const RENDER_CATEGORIES = [
  {
    id: 'sceneType',
    label: 'Tipo de cena',
    options: [
      ['interior', 'Interior', 'architectural interior'],
      ['exterior', 'Exterior', 'architectural exterior'],
      ['facade', 'Fachada', 'building facade'],
      ['gourmet', 'Área gourmet', 'outdoor gourmet area'],
      ['living', 'Sala', 'living room'],
      ['kitchen', 'Cozinha', 'kitchen'],
      ['bathroom', 'Banheiro', 'bathroom'],
      ['bedroom', 'Quarto', 'bedroom'],
      ['commercial', 'Comercial', 'commercial space'],
      ['landscape', 'Paisagismo', 'landscape architecture'],
    ],
  },
  {
    id: 'perspective',
    label: 'Perspectiva',
    options: [
      ['front', 'Frontal', 'front-facing architectural view'],
      ['aerial', 'Aérea', 'aerial architectural view'],
      ['human', 'Altura humana', 'natural eye-level perspective'],
      ['wide', 'Grande angular', 'wide-angle architectural lens'],
      ['close', 'Close-up', 'architectural detail close-up'],
      ['corner', 'Vista de canto', 'corner perspective with balanced depth'],
    ],
  },
  {
    id: 'environment',
    label: 'Ambiente',
    options: [
      ['residential', 'Residencial', 'refined residential atmosphere'],
      ['commercial', 'Comercial', 'polished commercial atmosphere'],
      ['corporate', 'Corporativo', 'professional corporate atmosphere'],
      ['luxury', 'Luxo', 'understated luxury atmosphere'],
      ['minimal', 'Minimalista', 'minimal and uncluttered styling'],
      ['contemporary', 'Contemporâneo', 'contemporary architectural styling'],
      ['industrial', 'Industrial', 'refined industrial styling'],
      ['scandinavian', 'Escandinavo', 'warm Scandinavian styling'],
    ],
  },
  {
    id: 'naturalLight',
    label: 'Luz natural',
    chip: true,
    options: [
      ['morning', 'Manhã', 'soft morning daylight'],
      ['midday', 'Meio-dia', 'clear midday sun with crisp shadows'],
      ['afternoon', 'Fim de tarde', 'warm late-afternoon sunlight'],
      ['golden', 'Golden hour', 'golden hour with long soft shadows'],
      ['night', 'Noite', 'realistic night ambience'],
      ['overcast', 'Nublado', 'soft overcast editorial daylight'],
    ],
  },
  { id: 'artificialLight', label: 'Luz artificial', special: 'artificialLight' },
  {
    id: 'atmosphere',
    label: 'Atmosfera',
    options: [
      ['sunny', 'Ensolarado', 'bright sunny atmosphere'],
      ['cloudy', 'Nublado', 'calm cloudy atmosphere'],
      ['rainy', 'Chuvoso', 'realistic rainy atmosphere'],
      ['dramatic', 'Dramático', 'dramatic editorial mood'],
      ['cozy', 'Aconchegante', 'inviting cozy atmosphere'],
      ['editorial', 'Editorial', 'high-end architecture magazine look'],
      ['commercial', 'Comercial', 'clean client-ready commercial look'],
    ],
  },
  {
    id: 'materials',
    label: 'Materiais',
    options: [
      ['preserve', 'Preservar existentes', 'preserve the existing materials and colors'],
      ['contemporary', 'Contemporâneo limpo', 'clean contemporary materials, neutral palette, concrete, glass and subtle wood'],
      ['luxury', 'Luxo', 'premium polished stone, refined wood and soft fabrics'],
      ['wood', 'Madeira natural', 'warm natural wood with realistic grain'],
      ['marble', 'Mármore', 'refined natural marble surfaces'],
      ['concrete', 'Concreto aparente', 'realistic exposed concrete surfaces'],
      ['neutral', 'Tons neutros', 'balanced neutral material palette'],
      ['contrast', 'Alto contraste', 'high-contrast material palette'],
    ],
  },
  {
    id: 'glass',
    label: 'Vidros e espelhos',
    options: [
      ['preserve', 'Preservar reflexos', 'preserve existing glass and mirror reflections'],
      ['improve', 'Melhorar reflexos', 'improve realistic glass and mirror reflections'],
      ['reduce', 'Reduzir reflexos', 'reduce distracting reflections'],
      ['transparent', 'Transparência realista', 'add physically plausible glass transparency'],
    ],
  },
  {
    id: 'surroundings',
    label: 'Vegetação e entorno',
    options: [
      ['preserve', 'Preservar entorno', 'preserve the existing surroundings'],
      ['light', 'Vegetação leve', 'add subtle realistic vegetation'],
      ['complete', 'Paisagismo completo', 'add complete professional landscaping'],
      ['trees', 'Árvores', 'add context-appropriate realistic trees'],
      ['garden', 'Jardim', 'add a designed realistic garden'],
      ['urban', 'Entorno urbano', 'add a coherent realistic urban context'],
      ['sky', 'Céu realista', 'replace the sky with a natural realistic sky'],
    ],
  },
]

export const ARTIFICIAL_LIGHT_FIXTURES = [
  ['spots', 'Spots', 'carefully placed architectural spotlights'],
  ['led', 'Fitas LED', 'subtle integrated LED strips'],
  ['indirect', 'Indireta', 'soft indirect lighting'],
  ['chandelier', 'Lustres', 'refined chandelier lighting'],
  ['pendants', 'Pendentes', 'decorative pendant lighting'],
]

export const COLOR_TEMPERATURES = [
  ['2200K', '2200K', 'âmbar'],
  ['2700K', '2700K', 'muito quente'],
  ['3000K', '3000K', 'quente'],
  ['3500K', '3500K', 'neutra quente'],
  ['4000K', '4000K', 'neutra'],
  ['5000K', '5000K', 'branca'],
  ['6500K', '6500K', 'fria'],
]

export const FIDELITY_LEVELS = [
  ['faithful', 'Fiel ao projeto', 'Mantém geometria, materiais e composição.'],
  ['enhance', 'Aprimorar visual', 'Mantém o projeto e melhora luz, texturas e acabamento.'],
  ['creative', 'Direção criativa', 'Mantém a geometria e permite reinterpretar estilo e materiais.'],
  ['open', 'Livre', 'Permite mudanças visuais e elementos quando solicitados.'],
]

export const ELEMENT_OPTIONS = [
  ['people', 'Pessoas'],
  ['vehicles', 'Veículos'],
  ['pets', 'Pets'],
  ['furniture', 'Mobiliário'],
  ['vegetation', 'Vegetação'],
  ['decor', 'Objetos decorativos'],
]

export const ELEMENT_DETAIL_FIELDS = {
  people: [
    ['gender', 'Perfil', [['unspecified', 'Sem especificar'], ['woman', 'Mulher'], ['man', 'Homem'], ['nonbinary', 'Não binário']]],
    ['age', 'Faixa etária', [['adult', 'Adulto'], ['youngAdult', 'Jovem adulto'], ['child', 'Criança'], ['teen', 'Adolescente'], ['elderly', 'Idoso']]],
    ['activity', 'Ação', [['walking', 'Caminhando'], ['sitting', 'Sentado'], ['talking', 'Conversando'], ['relaxing', 'Relaxando'], ['working', 'Trabalhando']]],
    ['clothing', 'Roupa', [['casual', 'Casual'], ['casualElegant', 'Casual elegante'], ['formal', 'Social'], ['sport', 'Esportiva'], ['neutral', 'Neutra']]],
  ],
  vehicles: [
    ['vehicleType', 'Tipo', [['car', 'Carro'], ['suv', 'SUV'], ['motorcycle', 'Moto'], ['bicycle', 'Bicicleta'], ['utility', 'Utilitário']]],
    ['state', 'Estado', [['parked', 'Estacionado'], ['arriving', 'Chegando'], ['moving', 'Em movimento']]],
    ['color', 'Cor', [['neutral', 'Neutra'], ['white', 'Branca'], ['black', 'Preta'], ['silver', 'Prata'], ['earth', 'Terrosa']]],
  ],
  pets: [
    ['animalType', 'Animal', [['dog', 'Cão'], ['cat', 'Gato'], ['bird', 'Pássaro']]],
    ['size', 'Porte', [['small', 'Pequeno'], ['medium', 'Médio'], ['large', 'Grande']]],
    ['activity', 'Ação', [['resting', 'Descansando'], ['walking', 'Caminhando'], ['playing', 'Brincando']]],
  ],
  furniture: [
    ['furnitureType', 'Peça', [['seating', 'Assentos'], ['table', 'Mesa'], ['outdoor', 'Mobiliário externo'], ['storage', 'Aparador ou estante'], ['lighting', 'Luminária decorativa']]],
    ['material', 'Material', [['wood', 'Madeira'], ['fabric', 'Tecido'], ['metal', 'Metal'], ['natural', 'Fibras naturais'], ['mixed', 'Materiais mistos']]],
    ['condition', 'Acabamento', [['new', 'Novo'], ['livedIn', 'Vivido e natural'], ['premium', 'Premium']]],
  ],
  vegetation: [
    ['vegetationType', 'Tipo', [['trees', 'Árvores'], ['shrubs', 'Arbustos'], ['groundcover', 'Forração'], ['tropical', 'Tropical'], ['native', 'Nativa']]],
    ['density', 'Densidade', [['light', 'Leve'], ['balanced', 'Equilibrada'], ['lush', 'Densa']]],
    ['maturity', 'Porte', [['young', 'Jovem'], ['mature', 'Adulto'], ['established', 'Consolidado']]],
  ],
  decor: [
    ['objectType', 'Objeto', [['art', 'Arte'], ['textiles', 'Têxteis'], ['tabletop', 'Objetos de mesa'], ['books', 'Livros'], ['plants', 'Plantas decorativas']]],
    ['material', 'Material', [['natural', 'Natural'], ['ceramic', 'Cerâmica'], ['glass', 'Vidro'], ['metal', 'Metal'], ['mixed', 'Misto']]],
    ['arrangement', 'Composição', [['minimal', 'Minimalista'], ['balanced', 'Equilibrada'], ['layered', 'Em camadas']]],
  ],
}

const LEGACY_INTERVENTION_TO_FIDELITY = {
  'preserveComposition,preserveGeometry,preserveMaterials': 'faithful',
  'preserveComposition,preserveGeometry': 'enhance',
  changeStyle: 'creative',
  changeMaterials: 'creative',
  addElements: 'open',
  removeElements: 'open',
}

function createElementDefaults(id) {
  return {
    enabled: false,
    quantity: 1,
    position: 'integrado à cena',
    style: 'natural e discreto',
    scale: 'realista',
    realism: 'fotorealista',
    preserveComposition: true,
    details: Object.fromEntries(
      (ELEMENT_DETAIL_FIELDS[id] || []).map(([field, , options]) => [field, options[0][0]]),
    ),
  }
}

function createCategoryDefaults() {
  return Object.fromEntries(RENDER_CATEGORIES.map((category) => {
    if (category.id === 'artificialLight') {
      return [category.id, {
        enabled: false,
        temperature: '3000K',
        fixtures: Object.fromEntries(ARTIFICIAL_LIGHT_FIXTURES.map(([id]) => [id, false])),
      }]
    }
    return [category.id, { enabled: true, value: category.options[0][0] }]
  }))
}

function normalizeArtificialLight(config, fallback) {
  const legacyValue = config?.value
  const fixtures = { ...fallback.fixtures, ...(config?.fixtures || {}) }
  let temperature = config?.temperature || fallback.temperature

  if (legacyValue === 'warm') temperature = '3000K'
  if (legacyValue === 'cool') temperature = '5000K'
  if (ARTIFICIAL_LIGHT_FIXTURES.some(([id]) => id === legacyValue)) fixtures[legacyValue] = true

  return { enabled: Boolean(config?.enabled), temperature, fixtures }
}

function legacyFidelity(intervention) {
  if (!Array.isArray(intervention)) return 'enhance'
  const sorted = [...intervention].sort().join(',')
  if (LEGACY_INTERVENTION_TO_FIDELITY[sorted]) return LEGACY_INTERVENTION_TO_FIDELITY[sorted]
  if (intervention.some((id) => ['addElements', 'removeElements'].includes(id))) return 'open'
  if (intervention.some((id) => ['changeStyle', 'changeMaterials'].includes(id))) return 'creative'
  return 'enhance'
}

export function createDefaultSettings() {
  return {
    quality: '2K',
    captureSize: 2048,
    aspect: 'original',
    speedPreset: 'balanced',
    promptProfile: { mode: 'current', templateId: 'general', version: 'current-v1' },
    categories: createCategoryDefaults(),
    fidelityLevel: 'enhance',
    additionalElements: Object.fromEntries(ELEMENT_OPTIONS.map(([id]) => [id, createElementDefaults(id)])),
    extraInstructions: '',
  }
}

export function normalizeSettings(settings = {}) {
  const defaults = createDefaultSettings()
  const incomingCategories = settings.categories || {}
  const categories = Object.fromEntries(RENDER_CATEGORIES.map((category) => {
    const fallback = defaults.categories[category.id]
    const current = incomingCategories[category.id]
    if (category.id === 'artificialLight') {
      return [category.id, normalizeArtificialLight(current, fallback)]
    }
    return [category.id, { ...fallback, ...(current || {}) }]
  }))

  const additionalElements = Object.fromEntries(ELEMENT_OPTIONS.map(([id]) => {
    const fallback = createElementDefaults(id)
    const current = settings.additionalElements?.[id] || {}
    return [id, { ...fallback, ...current, details: { ...fallback.details, ...(current.details || {}) } }]
  }))

  return {
    ...defaults,
    ...settings,
    promptProfile: { ...defaults.promptProfile, ...(settings.promptProfile || {}) },
    categories,
    fidelityLevel: settings.fidelityLevel || legacyFidelity(settings.intervention),
    additionalElements,
  }
}

export function findRenderOption(categoryId, optionId) {
  const category = RENDER_CATEGORIES.find((item) => item.id === categoryId)
  const option = category?.options?.find(([id]) => id === optionId)
  return option ? { id: option[0], label: option[1], prompt: option[2] } : null
}

export function getElementDetailLabel(elementId, fieldId, value) {
  const field = (ELEMENT_DETAIL_FIELDS[elementId] || []).find(([id]) => id === fieldId)
  return field?.[2].find(([id]) => id === value)?.[1] || value
}
