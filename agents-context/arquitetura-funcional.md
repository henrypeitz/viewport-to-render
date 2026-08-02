# Arquitetura funcional - Estudio IA Render

Documento guia para a primeira implementacao React da aplicacao web integrada ao plugin do SketchUp. O foco e transformar capturas de viewport, renders base e imagens externas em renders aprimorados por IA, mantendo uma arquitetura simples, modular e facil de expandir.

Este documento reaproveita os padroes atuais de `templates/index.html`: topbar com badges de estado, painel lateral numerado de controles, workspace de comparacao antes/depois, barra de edicao do ultimo render e historico da sessao.

## 1. Visao geral da aplicacao

A aplicacao deve funcionar como uma ferramenta de producao para arquitetos, designers e equipes de visualizacao que querem transformar uma imagem base em um render mais profissional.

Entradas suportadas:

- Captura da viewport do SketchUp.
- Print ou export manual do SketchUp.
- Render base do Enscape, V-Ray ou similar.
- Upload manual de imagem.
- Ultimo render gerado pela propria aplicacao.
- Render anterior usado como base para edicao.

Saidas esperadas:

- Render gerado por IA.
- Variacoes do render.
- Edicoes incrementais sobre o ultimo resultado.
- Imagem ajustada no modulo de pos-producao.
- Arquivo exportavel para download.

Arquitetura conceitual:

```text
UI React
  -> Estado da sessao
  -> Prompt Builder
  -> Provider Adapter
  -> API do provedor
  -> Resultado / Historico / Exportacao
```

Principio central: a UI nao deve conhecer detalhes internos de cada provedor. Ela envia um pedido padronizado para uma camada de adapters, e cada adapter traduz esse pedido para OpenRouter, Google API direta ou futuros provedores.

## 2. Fluxo principal do usuario

1. O usuario escolhe o provedor e informa a API Key.
2. O usuario escolhe modelo, qualidade e resolucao de captura.
3. A aplicacao recebe uma imagem base por upload, plugin do SketchUp ou ultimo render.
4. O usuario configura cena, perspectiva, ambiente, iluminacao, materiais, preservacao e elementos adicionais.
5. O usuario adiciona uma instrucao livre, se necessario.
6. O sistema monta o prompt final a partir de blocos modulares.
7. O usuario clica em `Gerar render`.
8. A aplicacao exibe estado de processamento no workspace.
9. O resultado aparece na comparacao antes/depois.
10. O usuario pode baixar, gerar variacao, editar o ultimo render, recomecar ou aplicar pos-producao.
11. Cada resultado relevante entra no historico simples da sessao.

## 3. Modulos principais

### Configuracao de provedor

Responsavel por API Key, provedor ativo, modelo ativo e persistencia local opcional.

### Entrada de imagem

Responsavel por upload, recebimento via SketchUp, preview, validacao e definicao da imagem base atual.

### Configuracoes de render

Responsavel pelas opcoes visuais que enriquecem o prompt: cena, perspectiva, ambiente, luz, materiais, atmosfera, vidro, vegetacao e nivel de intervencao.

### Elementos adicionais

Responsavel por pessoas, veiculos, pets, mobiliario, vegetacao e objetos decorativos configuraveis.

### Edicao localizada

Responsavel por mascara, selecao de area, prompt especifico e regeneracao parcial.

### Resultado e comparacao

Responsavel por preview original, render gerado, slider antes/depois, scanline de processamento e acoes de resultado.

### Pos-producao

Responsavel por ajustes locais de imagem sem novo custo de IA.

### Presets

Responsavel por presets prontos e presets criados pelo usuario.

### Historico

Responsavel por manter resultados da sessao e permitir reutilizar uma imagem anterior como base.

## 4. Funcionalidades por modulo

## Configuracao de provedor e modelo

Funcionalidades:

- Inserir API Key.
- Alternar entre OpenRouter e Google API direta.
- Escolher modelo de renderizacao.
- Usar modelos como Nano Banana e similares quando estiverem disponiveis no provedor.
- Informar qualidade desejada: `1K`, `2K`, `4K`.
- Informar resolucao de captura: `1024px`, `2048px`, `4096px`.
- Exibir estimativa de tempo/custo quando o adapter fornecer essa informacao.

Decisoes:

- Provedor, modelo, API Key e qualidade sao obrigatorios para gerar.
- Resolucao de captura e obrigatoria quando a imagem vier do SketchUp.
- Estimativa de custo/tempo e opcional na primeira versao.

Interface sugerida:

- Reaproveitar `section 01 Conexao`.
- Reaproveitar `section 02 Modelo e qualidade`.
- Manter `badge provider` na topbar.
- Adicionar acao para apagar chave salva por provedor.

## API Key e persistencia local

Funcionalidades:

- Usar API Key apenas durante a sessao.
- Opcionalmente salvar chave em `localStorage`.
- Manter chaves separadas por provedor.
- Carregar automaticamente a chave salva ao trocar provedor.
- Permitir apagar a chave salva.
- Nunca registrar API Key em logs, erros, analytics ou historico.

Chaves de storage sugeridas:

```text
iaRender.apiKeys.openrouter
iaRender.apiKeys.google
iaRender.rememberKeys
iaRender.activeProvider
```

Regra de seguranca:

- Na primeira versao, `localStorage` e aceitavel por simplicidade, desde que seja opcional e transparente.
- Em versao futura, considerar backend seguro, cofre de credenciais, proxy autenticado ou integracao com conta do usuario.

## Entrada de imagem

Funcionalidades:

- Upload manual por clique ou arrastar.
- Receber imagem enviada pelo plugin do SketchUp.
- Capturar viewport atual via integracao SketchUp.
- Aceitar print/render externo.
- Reutilizar ultimo render gerado.
- Reutilizar render anterior do historico.

Validacoes:

- Aceitar inicialmente `image/png`, `image/jpeg`, `image/webp`.
- Definir limite maximo de arquivo, por exemplo `20MB`.
- Exibir erro claro para arquivo invalido.
- Gerar preview da imagem original.
- Guardar metadados basicos: origem, nome, tamanho, dimensoes, data de entrada.

Estado da imagem atual:

```ts
currentImage = {
  id: "img_123",
  source: "upload | sketchupViewport | sketchupPlugin | previousRender | externalRender",
  fileName: "sala.png",
  mimeType: "image/png",
  width: 2048,
  height: 1536,
  previewUrl: "blob:...",
  base64OrBlob: "...",
}
```

Interface sugerida:

- Reaproveitar `section 03 Imagem base`.
- Usar `dropzone` no modo navegador.
- Usar `mode-note` quando a imagem vier automaticamente do SketchUp.

## Qualidade da imagem e captura

Qualidade de geracao:

- `1K`: teste rapido, menor custo, ideal para validar prompt.
- `2K`: preview/apresentacao, equilibrio entre custo e qualidade.
- `4K`: cliente/final, maior custo e tempo.

Resolucao de captura:

- `1024px`: rapido, bom para testes.
- `2048px`: padrao recomendado.
- `4096px`: alta fidelidade, quando a maquina/provedor suportar.

Presets de velocidade versus qualidade:

- `Rapido`: captura menor, modelo mais barato, prompt mais direto.
- `Equilibrado`: captura media, modelo recomendado.
- `Final`: captura maior, modelo melhor, parametros de alta qualidade.

Obrigatorio na primeira versao:

- Qualidade de geracao.
- Modelo.
- Imagem base.

Opcional na primeira versao:

- Custo estimado.
- Tempo estimado.
- Captura 4096px, se houver limitacao no SketchUp ou no provedor.

## Configuracoes de render

Cada categoria deve ser ativavel/desativavel. Quando desativada, nao entra no prompt final.

Categorias:

- Tipo de cena: interior, exterior, fachada, area gourmet, sala, cozinha, banheiro, quarto, comercial, paisagismo.
- Perspectiva: frontal, aerea, perspectiva humana, grande angular, close-up, vista de canto.
- Tipo de ambiente: residencial, comercial, corporativo, luxo, minimalista, contemporaneo, industrial, escandinavo.
- Iluminacao natural: manha, meio-dia, final de tarde, golden hour, noite, ceu nublado.
- Iluminacao artificial: luz quente, luz fria, spots, fitas LED, iluminacao indireta, lustres, pendentes.
- Clima e atmosfera: ensolarado, nublado, chuvoso, dramatico, aconchegante, editorial, comercial.
- Materiais: preservar materiais existentes, contemporaneo limpo, luxo, madeira natural, marmore, concreto aparente, tons neutros, alto contraste.
- Vidros e espelhos: preservar reflexos, melhorar reflexos, reduzir reflexos, adicionar transparencia realista.
- Vegetacao e entorno: preservar entorno, vegetacao leve, paisagismo completo, arvores, jardim, entorno urbano, ceu realista.

Interface sugerida:

- Reaproveitar `section 04 Cena`, `section 05 Luz` e `section 06 Prompt`.
- Usar `chip-group` para presets rapidos.
- Usar `select` quando houver muitas opcoes.
- Usar toggle/checkbox para ativar ou desativar uma categoria.

## Instrucoes adicionais

O campo livre permite pedidos especificos:

- `Manter exatamente o layout original`.
- `Melhorar apenas iluminacao e materiais`.
- `Nao alterar geometria`.
- `Adicionar vegetacao na lateral direita`.
- `Remover aparencia de SketchUp`.
- `Deixar com cara de render profissional para cliente`.

Composicao:

- As instrucoes adicionais entram perto do fim do prompt.
- Elas devem ter prioridade sobre presets genericos.
- O prompt builder deve evitar contradicoes obvias quando possivel.
- Se houver conflito entre preset e instrucao livre, a instrucao livre deve prevalecer.

## Preservacao, alteracao e edicao localizada

Nivel de intervencao:

- Preservar geometria.
- Preservar materiais.
- Preservar composicao.
- Alterar estilo visual.
- Alterar materiais.
- Adicionar elementos.
- Remover elementos.
- Editar somente uma regiao especifica.

Edicao localizada:

- Ferramenta de mascara/desenho sobre a imagem.
- Prompt especifico para a area selecionada.
- Acao de remover objeto.
- Acao de substituir objeto.
- Acao de regenerar apenas a area.
- Preview da mascara.
- Cancelar selecao.

Estado sugerido:

```ts
localizedEdit = {
  enabled: true,
  maskUrl: "blob:...",
  mode: "remove | replace | regenerate",
  prompt: "trocar bancada por marmore claro",
}
```

Regra:

- A edicao localizada deve ser tratada como um fluxo separado da geracao completa.
- O adapter deve informar se o provedor/modelo suporta mascara ou edicao por regiao.

## Elementos adicionais

Categorias:

- Pessoas.
- Veiculos.
- Pets.
- Mobiliario.
- Vegetacao.
- Objetos decorativos.

Configuracoes por categoria:

- Ativo/inativo.
- Quantidade.
- Posicao aproximada.
- Estilo.
- Escala.
- Nivel de realismo.
- Preservar ou nao composicao original.

Exemplo:

```ts
additionalElements = {
  people: {
    enabled: true,
    quantity: 2,
    position: "ao fundo",
    style: "casual elegante",
    realism: "realista",
    preserveComposition: true,
  }
}
```

## Comparacao antes/depois

Funcionalidades:

- Visualizacao da imagem original.
- Visualizacao do render gerado.
- Slider horizontal de comparacao antes/depois.
- Botao para baixar imagem.
- Botao para recomecar.
- Botao para editar o ultimo render como base.
- Botao para gerar nova variacao.
- Historico simples de renders.

Interface sugerida:

- Reaproveitar `workspace`, `canvas-wrap`, `frame` e `stage`.
- Reaproveitar `stage-tag before` e `stage-tag after`.
- Reaproveitar `after-layer`, `slider-handle` e `scanline`.
- Agrupar acoes em `canvas-actions`.
- Usar `edit-bar` para edicao do ultimo render.

## Pos-producao sem IA

Este modulo deve ser separado da geracao por IA. Ajustes locais nao devem chamar o provedor e nao devem gerar novo custo de IA.

Opcoes:

- Brilho.
- Contraste.
- Saturacao.
- Nitidez.
- Temperatura.
- Exposicao.
- Vinheta.
- Corte/crop.
- Rotacao.
- Redimensionamento.
- Compressao.
- Exportacao em formatos diferentes.

Implementacao futura:

- Primeira versao pode usar Canvas API no navegador.
- Backend pode ser considerado para arquivos muito grandes ou processamento em lote.
- Sempre preservar a imagem original e criar uma versao ajustada separada.

## Presets configuraveis

Funcionalidades:

- Criar presets.
- Salvar combinacoes de opcoes.
- Reutilizar presets.
- Editar presets.
- Duplicar presets.
- Excluir presets.
- Marcar preset como favorito.
- Usar presets prontos da aplicacao.

Presets iniciais:

- Render limpo para cliente.
- Fachada luxo.
- Interior contemporaneo.
- Area gourmet realista.
- Paisagismo leve.
- Preview rapido.
- Render editorial.
- Preservar maximo do modelo original.

Estado sugerido:

```ts
preset = {
  id: "preset_cliente_limpo",
  name: "Render limpo para cliente",
  favorite: true,
  builtIn: true,
  settings: {
    sceneType: "interior",
    quality: "2K",
    materialStyle: "contemporaneo limpo",
    interventionLevel: "preservar composicao",
  }
}
```

Persistencia:

- Presets prontos ficam em arquivo versionado.
- Presets do usuario podem ficar em `localStorage` na primeira versao.
- Futuramente podem ser salvos em backend por conta/projeto.

## 5. Estrutura sugerida de arquivos

Estrutura simples para React:

```text
src/
  App.jsx
  main.jsx
  styles/
    ui.css
    tokens.css
  components/
    Topbar.jsx
    ControlsPanel.jsx
    Workspace.jsx
    Field.jsx
    ChipGroup.jsx
  modules/
    provider/
      ProviderConfig.jsx
      providerRegistry.ts
      providerTypes.ts
      adapters/
        openRouterAdapter.ts
        googleAdapter.ts
    imageInput/
      ImageInputPanel.jsx
      imageValidation.ts
      imageSources.ts
    renderSettings/
      RenderSettingsPanel.jsx
      renderOptions.ts
    localizedEdit/
      LocalizedEditPanel.jsx
      maskTools.ts
    results/
      ResultComparison.jsx
      HistoryPanel.jsx
      exportImage.ts
    postProduction/
      PostProductionPanel.jsx
      imageAdjustments.ts
    presets/
      PresetsPanel.jsx
      builtInPresets.ts
      presetStorage.ts
  prompts/
    promptBase.ts
    promptFragments.ts
    promptBuilder.ts
    negativePrompts.ts
    presetPrompts.ts
  state/
    appState.ts
    storage.ts
  sketchup/
    sketchupBridge.ts
    sketchupMessages.ts
```

Regra de simplicidade:

- Comecar com poucos componentes grandes por responsabilidade.
- Extrair subcomponentes somente quando houver repeticao real.
- Evitar colocar logica de provedor, prompt e imagem dentro de `App.jsx`.

## 6. Organizacao de estado

Estado principal da aplicacao:

```ts
appState = {
  provider: {
    activeProvider: "openrouter",
    apiKeyByProvider: {},
    rememberKeys: false,
    selectedModel: "google/gemini-3.1-flash-image",
  },
  image: {
    currentImage: null,
    sourceMode: "browser | sketchup",
  },
  renderSettings: {
    quality: "4K",
    captureSize: 2048,
    aspect: "original",
    enabledCategories: {},
    selectedOptions: {},
    interventionLevel: [],
    additionalInstructions: "",
  },
  localizedEdit: null,
  generation: {
    status: "idle | validating | generating | success | error",
    error: null,
    finalPrompt: "",
    currentResult: null,
  },
  history: [],
  presets: [],
  postProduction: {},
}
```

Organizacao recomendada:

- Estado local para campos simples e UI aberta/fechada.
- Estado global para provider, imagem atual, configuracoes de render, resultado atual e historico.
- Persistencia isolada em `storage.ts`.
- Nenhum componente visual deve escrever diretamente no `localStorage`.

## 7. Estrategia de prompts

O prompt final deve ser montado por blocos, nao escrito como string unica espalhada pela UI.

Blocos:

- Prompt base.
- Tipo de cena.
- Perspectiva.
- Estilo visual.
- Materiais.
- Iluminacao.
- Entorno.
- Elementos adicionais.
- Regras de preservacao.
- Restricoes.
- Instrucoes adicionais do usuario.
- Prompt negativo, quando aplicavel.

Arquivos:

- `promptBase.ts`: regra geral de render arquitetonico.
- `promptFragments.ts`: blocos por categoria.
- `promptBuilder.ts`: monta prompt final.
- `negativePrompts.ts`: termos a evitar.
- `presetPrompts.ts`: prompts associados a presets prontos.

Ordem sugerida:

```text
base
  + descricao da imagem de referencia
  + objetivo de qualidade
  + cena/perspectiva/ambiente
  + luz/atmosfera/materiais
  + elementos adicionais
  + preservacao/intervencao
  + restricoes
  + instrucao livre do usuario
  + prompt negativo
```

Regras:

- Categorias desligadas nao entram no prompt.
- Instrucoes livres tem prioridade sobre presets.
- Preservar geometria/composicao deve ser explicito quando selecionado.
- O prompt final deve ficar visivel e editavel antes de gerar, como no template atual.

## 8. Estrategia de provedores/modelos

Usar adapters por provedor.

Contrato conceitual:

```ts
providerAdapter = {
  id: "openrouter",
  label: "OpenRouter",
  models: [],
  supportsImageInput: true,
  supportsMaskEdit: false,
  supportsCostEstimate: false,
  generateImage(request) {},
  editImage(request) {},
  estimateCost(request) {},
}
```

Pedido padrao:

```ts
generationRequest = {
  providerId: "openrouter",
  modelId: "google/gemini-3.1-flash-image",
  apiKey: "...",
  image: currentImage,
  prompt: finalPrompt,
  negativePrompt: "...",
  quality: "4K",
  aspect: "original",
  mask: null,
}
```

Regras:

- UI chama somente o registry/adapters, nunca endpoints diretamente.
- Cada adapter converte request padrao para o formato do provedor.
- Capacidades do modelo devem controlar a UI: mascara, resolucao, variacoes, custo, formatos.
- Novos provedores entram adicionando adapter e registro no `providerRegistry.ts`.

## 9. Estrategia de presets

Presets devem salvar uma combinacao funcional de configuracoes, nao apenas texto de prompt.

Tipos:

- Preset pronto da aplicacao.
- Preset criado pelo usuario.
- Preset favorito.
- Preset duplicado/editado.

Conteudo recomendado:

- Nome.
- Descricao curta.
- Tags.
- Qualidade sugerida.
- Configuracoes de cena.
- Configuracoes de luz/material.
- Nivel de intervencao.
- Elementos adicionais.
- Fragmentos de prompt.

Regras:

- Presets nao devem sobrescrever API Key.
- Presets podem sugerir modelo, mas o usuario deve poder trocar.
- Ao aplicar preset, mostrar claramente quais campos foram alterados.
- Presets prontos devem ser versionados em arquivo.
- Presets do usuario podem iniciar em `localStorage`.

## 10. Estrategia de escalabilidade

Separar responsabilidades desde a primeira versao:

- UI: componentes visuais e eventos.
- Estado: dados ativos da sessao.
- Prompt builder: composicao textual.
- Provider adapters: comunicacao com IA.
- Image services: validacao, conversao, preview e exportacao.
- SketchUp bridge: mensagens entre plugin e app.
- Storage: persistencia local.

Para evitar acoplamento:

- `App.jsx` orquestra, mas nao concentra regras.
- Componentes recebem dados e callbacks.
- Adapters nao importam componentes.
- Prompt builder nao depende do DOM.
- Storage nao depende de componentes.
- Integracao SketchUp fica isolada em `sketchupBridge.ts`.

Expansoes futuras previstas:

- Novos provedores.
- Novos modelos.
- Novos tipos de render.
- Novos presets.
- Novas ferramentas de edicao.
- Novas integracoes com SketchUp.
- Novas opcoes de exportacao.
- Backend.
- Autenticacao.
- Galeria de projetos.

## 11. Criterios de aceite para a primeira versao

A primeira versao sera considerada aceitavel quando:

- O usuario conseguir informar API Key por provedor.
- A chave puder ser usada apenas na sessao ou salva opcionalmente.
- As chaves salvas forem separadas por provedor.
- O usuario conseguir escolher OpenRouter ou Google API direta.
- O usuario conseguir escolher modelo, qualidade e resolucao de captura.
- O usuario conseguir carregar uma imagem base por upload no navegador.
- O modo SketchUp estiver previsto por bridge, mesmo que parcialmente implementado.
- A imagem original aparecer no workspace.
- O usuario conseguir selecionar tipo de cena, luz, materiais e instrucao adicional.
- O prompt final for montado por blocos e permanecer editavel.
- O usuario conseguir gerar um render por pelo menos um provedor funcional.
- O resultado aparecer na comparacao antes/depois.
- O usuario conseguir baixar a imagem gerada.
- O usuario conseguir editar o ultimo render como base.
- O usuario conseguir gerar nova variacao.
- O historico simples da sessao registrar resultados.
- Erros de API, imagem invalida e falta de chave forem exibidos claramente.
- Nenhuma API Key aparecer em logs, historico ou mensagens de erro.
- A arquitetura permitir adicionar um novo provider adapter sem reescrever a UI.

## Decisoes para nao exagerar a primeira versao

- Nao criar componentes pequenos demais antes de existir repeticao real.
- Nao implementar backend na primeira versao, a menos que seguranca ou limite de arquivo exija.
- Nao implementar galeria de projetos agora.
- Nao misturar pos-producao local com geracao por IA.
- Nao acoplar prompts diretamente aos componentes de formulario.
- Nao depender de um unico modelo ou provedor.

## Relacao com os componentes atuais

Mapeamento direto com `templates/index.html`:

- `topbar`: status global de modo e provedor.
- `controls`: painel principal de configuracao.
- `section`: blocos numerados do fluxo.
- `dropzone`: entrada manual de imagem.
- `chip-group`: presets rapidos de luz, atmosfera e estilo.
- `primary`: acao principal de geracao.
- `secondary`: acoes de resultado e edicao.
- `workspace`: area visual principal.
- `stage`: antes/depois, loading e overlays.
- `edit-bar`: edicao do ultimo render.
- `history`: resultados da sessao.

Essa estrutura deve ser mantida como base visual e evoluida por modulos, sem transformar a primeira tela em uma landing page ou dashboard generico.
