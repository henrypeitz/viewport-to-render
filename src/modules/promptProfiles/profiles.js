// Catálogo isolado dos prompts importados de agents.md/prompts-adicionais.md.
// Remover este arquivo e o módulo promptProfiles não afeta presets nem provedores.
export const PROMPT_PROFILE_MODES = [
  ['current', 'Estado atual', 'Usa o montador modular original, versionado como current-v1.'],
  ['enhanced', 'Arquitetônico', 'Usa somente o perfil arquitetônico selecionado.'],
  ['hybrid', 'Mesclado', 'Combina as opções atuais com o perfil arquitetônico.'],
]

export const ADDITIONAL_PROMPT_PROFILES = [
  {
    id: 'exterior-night',
    label: 'Externa noturna',
    description: 'Fachada em blue hour com iluminação quente de 3000K.',
    prompt: `Transforme o print do SketchUp em uma imagem fotorrealista de alta qualidade, como se fosse uma fotografia profissional de arquitetura. Preserve 100% da volumetria, proporções, enquadramento e design original do projeto, sem alterar formas, aberturas ou elementos arquitetônicos. Aplique materiais e revestimentos realistas, com texturas naturais, detalhes precisos, variação sutil de tons, relevo e reflexos compatíveis com materiais reais. Cenário de início da noite (blue hour), com céu azul profundo e suave, iluminação ambiente realista e atmosfera sofisticada. Adicione iluminação artificial branco quente (3000K) na fachada, áreas externas e vegetações, criando contraste equilibrado entre luz e sombra, com um glow sutil e realista. Vegetações com aparência natural, iluminadas de forma cênica, sem exageros. Qualidade ultra realista, iluminação global correta, sombras suaves, reflexos fisicamente plausíveis, profundidade de campo leve, estilo fotografia DSLR, render arquitetônico premium. Não altere nenhuma textura e nenhum formato da imagem base original.`,
  },
  {
    id: 'exterior-pool',
    label: 'Externa com piscina',
    description: 'Cena externa diurna, piscina e lazer com acabamento fotográfico.',
    prompt: `Converta este print 3D em uma fotografia arquitetônica profissional ultra-realista, como se tivesse sido capturada por um fotógrafo especializado em arquitetura utilizando câmera DSLR ou full-frame de alto padrão, em resolução 4K. Aparência 100% fotográfica, sem aspecto de render, ilustração ou CGI, com texturas extremamente realistas, nitidez profissional, profundidade de campo natural e balanço de cores realista. Cena diurna, céu azul limpo, sol presente, sombras suaves e reflexos físicos precisos na água da piscina, com caustics sutis. Área de lazer externa com piscina de alvenaria de revestimento realista, água cristalina com transparência e leve ondulação, deck em madeira natural ou porcelanato, espreguiçadeiras, guarda-sol e mobiliário externo sofisticado. Não alterar a arquitetura, volumetria, proporções, layout, enquadramento, ângulo de câmera ou composição do projeto original. Não altere nenhuma textura e nenhum formato da imagem base original.`,
  },
  {
    id: 'humanized-plan',
    label: 'Planta humanizada',
    description: 'Planta técnica com texturas, vegetação e sombras realistas.',
    prompt: `Transforme esta planta técnica em uma imagem fotorrealista de planta humanizada, com alto nível de realismo. Respeite 100% o projeto arquitetônico original, mantendo volumetria, proporções, layout, recuos, aberturas e materiais exatamente como no arquivo anexado, sem adicionar, remover ou modificar nenhum elemento. Aplique texturas realistas, vegetação humanizada proporcional à escala, sombras naturais e iluminação equilibrada. Estilo de render limpo, profissional e realista, com aparência de apresentação arquitetônica de alto padrão. Não reinterpretar o projeto. Não criar elementos novos. Não alterar cores, formas ou materiais.`,
  },
  {
    id: 'interior-night',
    label: 'Interna noturna',
    description: 'Interior premium à noite com luminárias de 3000K.',
    prompt: `Converta este print de ambiente interno do SketchUp em uma fotografia profissional de interior ultra-realista em 4K, como se tivesse sido capturada à noite por um fotógrafo de arquitetura utilizando câmera DSLR ou full-frame profissional. Cena noturna, sem luz natural, com todas as luzes artificiais ligadas em temperatura de cor 3000K (branco quente). Iluminação aconchegante, sofisticada e bem distribuída, com luminárias, spots, fitas de LED e luz indireta realistas, sem highlights estourados. Aparência 100% fotográfica, exposição perfeitamente equilibrada, nitidez extrema, foco preciso, profundidade de campo realista e reflexos coerentes com a iluminação artificial. Manter exatamente layout, proporções, ângulos, volumetria e composição; não adicionar, remover ou modificar nenhum elemento. Reproduzir fielmente madeira, concreto, vidro, metais, tecidos, pedras, plantas e revestimentos com microimperfeições e reflexos naturais. Cores naturais sob luz quente, contraste suave, white balance correto e estética de fotografia de interiores premium. Não altere nenhuma textura e nenhum formato da imagem base original.`,
  },
  {
    id: 'general',
    label: 'Geral fotorrealista',
    description: 'Conversão fiel do SketchUp para fotografia arquitetônica.',
    prompt: `Transforme este print de SketchUp em uma imagem fotográfica ultra-realista, como se tivesse sido capturada por um fotógrafo profissional de arquitetura com câmera DSLR ou full-frame de alto padrão. Manter 100% do projeto original, sem adicionar, remover ou modificar qualquer elemento. Não alterar materiais, texturas, cores, mobiliário, volumetria, layout ou revestimentos; não adicionar objetos decorativos, plantas, pessoas, iluminação extra ou efeitos artísticos. Eliminar o aspecto de render ou ilustração, usando iluminação natural coerente, sombras suaves e fisicamente corretas, texturas exatamente iguais às do modelo com realismo de câmera, perspectiva e enquadramento idênticos ao print original. Resolução 4K, alto nível de detalhe, leve profundidade de campo realista quando aplicável, balanço de branco neutro e exposição correta.`,
  },
  {
    id: 'interior-dusk',
    label: 'Interna entardecer',
    description: 'Interior em golden hour, com luz lateral quente.',
    prompt: `Converta este print de ambiente interno do SketchUp em uma fotografia profissional de interior ultra-realista em 4K, como se tivesse sido capturada durante o entardecer (golden hour) por um fotógrafo de arquitetura com câmera DSLR ou full-frame. Aparência 100% fotográfica, com luz solar baixa entrando pelas aberturas, tons quentes, suaves e realistas, incidência lateral, sombras longas e bem definidas. Equilíbrio preciso entre luz natural externa e iluminação interna, sem áreas estouradas ou sombras duras, com nitidez, foco e profundidade de campo fisicamente corretos. Manter exatamente layout, proporções, ângulos, volumetria, mobiliário e composição; não adicionar, remover ou modificar nenhum elemento. Reproduzir fielmente as texturas, com reflexos naturais de entardecer e microimperfeições sutis. Paleta quente e natural, contraste elegante, white balance para golden hour e qualidade de revista de arquitetura. Não altere nenhuma textura e nenhum formato da imagem base original.`,
  },
  {
    id: 'interior-day',
    label: 'Interna diurna',
    description: 'Interior claro, arejado e fiel ao projeto.',
    prompt: `Converta este print de ambiente interno do SketchUp em uma fotografia profissional de interior ultra-realista em 4K, como se tivesse sido capturada por um fotógrafo de arquitetura com câmera DSLR ou full-frame. Aparência 100% fotográfica, com iluminação interna clara e equilibrada, abundante luz natural entrando pelas aberturas e ambiente luminoso, sofisticado e arejado. Exposição perfeita, sem áreas estouradas ou sombras excessivas, nitidez máxima, foco preciso e leve profundidade de campo realista quando aplicável. Manter exatamente layout, proporções, ângulos, volumetria, mobiliário e composição; não adicionar, remover ou modificar nenhum elemento. Reproduzir fielmente madeira, concreto, vidro, metais, tecidos, pedras, plantas e revestimentos, com reflexos, imperfeições sutis e microdetalhes reais. Cores naturais, contraste suave, white balance correto e estética de interiores de alto padrão. Não altere nenhuma textura e nenhum formato da imagem base original.`,
  },
  {
    id: 'exterior-day',
    label: 'Externa diurna',
    description: 'Fachada em luz diurna com contexto urbano discreto.',
    prompt: `Transforme o print de SketchUp da fachada anexado em uma imagem fotográfica extremamente realista, mantendo 100% da geometria, proporções e design original, sem alterar volumes, aberturas ou elementos arquitetônicos. Aplique materiais e revestimentos realistas, com texturas físicas corretas, reflexos naturais, imperfeições sutis e escala real. Iluminação diurna realista, céu azul, sol natural e sombras suaves e bem definidas de acordo com a posição solar. Adicione contexto realista discreto no entorno, com paisagem urbana, casas ao fundo levemente desfocadas, vegetação natural e horizonte coerente, sem roubar o foco da fachada principal. Fotografia arquitetônica profissional, lente realista, exposição equilibrada, cores naturais, alto nível de detalhe e sem aparência de render ou ilustração. Não adicionar, remover ou alterar elementos da fachada.`,
  },
  {
    id: 'exterior-rainy',
    label: 'Externa chuvosa',
    description: 'Fachada residencial sob chuva leve e luz difusa.',
    prompt: `Transforme o print do SketchUp em uma imagem fotorrealista de fachada residencial, mantendo 100% da volumetria, proporções e elementos originais do projeto. Aplique materiais e revestimentos realistas, com texturas em alta resolução, respeitando fielmente os materiais presentes na imagem. Cena em dia chuvoso, céu totalmente nublado, luz difusa e suave, sem sol direto ou sombras duras, com reflexos realistas de água no piso e superfícies. Chuva leve, sem exagero, umidade visível nos materiais e cores naturais levemente dessaturadas. Fotografia profissional de arquitetura, lente 35mm, perspectiva realista, alta nitidez, iluminação natural e pós-processamento sutil. Não alterar design, cores, formas, arquitetura ou texturas; não adicionar ou remover elementos da fachada.`,
  },
]

export function findAdditionalPromptProfile(id) {
  return ADDITIONAL_PROMPT_PROFILES.find((profile) => profile.id === id)
    || ADDITIONAL_PROMPT_PROFILES.find((profile) => profile.id === 'general')
}
