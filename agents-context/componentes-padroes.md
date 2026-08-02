# Padroes de componentes da interface

Este arquivo documenta os padroes atuais da pagina em `templates/index.html` e deve ser usado como contexto para desenhar novos botoes, componentes e features do sistema de render com IA.

Observacao: `templates/ui.css` esta vazio neste momento. Portanto, os padroes abaixo foram extraidos da estrutura, nomes de classes, hierarquia e comportamento esperado do HTML atual.

## Principios da UI

- A interface e uma ferramenta de trabalho, nao uma landing page.
- A tela principal deve abrir direto no fluxo de geracao/edicao de render.
- Priorizar leitura rapida, controles previsiveis e pouco atrito.
- Manter o foco em duas areas: painel de configuracao e workspace visual.
- Usar textos curtos, orientados a acao e em portugues.
- Evitar blocos explicativos longos dentro da UI; usar `help` apenas para apoio contextual.
- Manter os nomes de classes semanticos e estaveis para facilitar evolucao para React ou extensao no SketchUp.

## Estrutura base da tela

### `topbar`

Cabecalho fixo conceitual da ferramenta.

Uso:

```html
<header class="topbar">
  <div class="brand">
    <div class="mark">IA</div>
    <h1>Estudio IA Render</h1>
  </div>
  <div class="badges">
    <span class="badge mode">Modo: Detectando</span>
    <span class="badge provider">Provedor: OpenRouter</span>
  </div>
</header>
```

Padroes:

- `brand` agrupa marca curta e nome do produto.
- `mark` e uma sigla curta, idealmente 2 caracteres.
- `badges` mostra estado tecnico ou operacional.
- `badge mode` informa ambiente/modo.
- `badge provider` informa provedor ativo.

### `layout`

Container principal com duas colunas.

Uso:

```html
<main class="layout">
  <aside class="controls">...</aside>
  <section class="workspace">...</section>
</main>
```

Padroes:

- `controls` contem todos os parametros e comandos de geracao.
- `workspace` contem visualizacao, comparacao, edicao rapida e historico.
- Novas features devem entrar primeiro em uma dessas duas areas antes de criar uma terceira regiao.

## Painel de controles

### `section`

Bloco de configuracao numerado.

Uso:

```html
<section class="section">
  <div class="section-label"><span>01</span> Conexao</div>
  ...
</section>
```

Padroes:

- Usar uma `section` para cada decisao principal do fluxo.
- A ordem numerica deve refletir a jornada do usuario.
- `section-label` usa um numero em `span` seguido do nome curto da etapa.
- Nomes devem ser substantivos curtos: `Conexao`, `Cena`, `Luz`, `Prompt`.

Sequencia atual:

- `01 Conexao`
- `02 Modelo e qualidade`
- `03 Imagem base`
- `04 Cena`
- `05 Luz`
- `06 Prompt`

### Campos

Classes usadas:

- `field-label`
- `soft-top`
- `row`
- `key-row`
- `check-row`
- `help`
- `mode-note`
- `is-hidden`

Uso:

```html
<label class="field-label" for="modelSelect">Modelo</label>
<select id="modelSelect">...</select>

<label class="field-label soft-top" for="extraPrompt">Instrucao adicional</label>
<textarea id="extraPrompt"></textarea>
<p class="help">Editavel antes de gerar.</p>
```

Padroes:

- Todo `input`, `select` e `textarea` deve ter `label.field-label`.
- Usar `soft-top` quando um campo precisa de respiro acima dentro da mesma secao.
- Usar `row` para pares de campos relacionados.
- Usar `help` para orientacao curta, principalmente em configuracoes tecnicas.
- Usar `mode-note` para explicar diferencas entre navegador e SketchUp.
- Usar `is-hidden` para estados alternativos controlados por JS.

### Linhas especiais

`key-row`:

```html
<div class="key-row">
  <input type="password" id="apiKey">
  <button class="icon-btn" type="button" title="Mostrar ou ocultar chave">...</button>
</div>
```

Padroes:

- Usar quando um input precisa de acao pequena acoplada.
- `icon-btn` deve ser compacto e ter `title`.
- Substituir `...` por icone quando houver biblioteca de icones disponivel.

`check-row`:

```html
<label class="check-row">
  <input type="checkbox" id="rememberKey">
  <span>Lembrar neste navegador</span>
</label>
```

Padroes:

- Usar para configuracoes binarias simples.
- O texto deve ser direto e caber em uma linha curta.

## Entrada de imagem

### `dropzone`

Area de upload da imagem base.

Uso:

```html
<div class="dropzone" id="dropzone">
  <input type="file" id="fileInput" accept="image/*">
  <p><b>Clique ou arraste</b><br>viewport, print do SketchUp, V-Ray ou Enscape</p>
  <img id="thumb" class="thumb-preview" alt="">
</div>
```

Padroes:

- Usar para anexar imagens de referencia.
- Deve aceitar clique e drag-and-drop.
- O texto principal fica em `b`.
- `thumb-preview` mostra uma miniatura apos selecionar arquivo.

## Controles por chips

### `chip-group` e `chip`

Uso:

```html
<div class="chip-group" id="moodGroup">
  <button class="chip active" type="button" data-mood="clear midday sun">Sol pleno</button>
  <button class="chip" type="button" data-mood="warm golden hour">Golden hour</button>
</div>
```

Padroes:

- Usar chips para escolhas rapidas de preset.
- Um chip ativo recebe `active`.
- Valores tecnicos devem ficar em `data-*`.
- Texto visivel deve ser curto, humano e escaneavel.
- Chips sao bons para luz, atmosfera, estilo, vegetacao, camera e presets de acabamento.

## Botoes

### `primary`

Botao principal de fluxo.

Uso:

```html
<button class="primary" id="generateBtn" type="button">Gerar render</button>
```

Padroes:

- Deve haver apenas uma acao primaria dominante por tela ou painel.
- Usar para gerar, confirmar ou executar a acao principal.
- Texto deve comecar com verbo: `Gerar render`, `Aplicar edicao`, `Salvar preset`.

### `secondary`

Acoes complementares.

Uso:

```html
<button class="secondary" id="downloadBtn" type="button" disabled>Baixar imagem</button>
```

Padroes:

- Usar para download, alternancia, recomecar, aplicar acoes nao principais.
- Pode aparecer em grupos horizontais.
- Respeitar `disabled` quando a acao depender de imagem/render pronto.

### `icon-btn`

Acao compacta associada a um campo.

Uso:

```html
<button class="icon-btn" type="button" title="Mostrar ou ocultar chave">...</button>
```

Padroes:

- Sempre incluir `title`.
- Preferir icone a texto quando a funcao for obvia.
- Manter area clicavel confortavel mesmo se visualmente compacto.

## Workspace visual

### Estrutura

```html
<section class="workspace">
  <div class="canvas-wrap">
    <div class="frame">
      <div class="stage" id="stage">...</div>
    </div>
  </div>
</section>
```

Padroes:

- `workspace` e a area de resultado e comparacao.
- `canvas-wrap` contem o bloco visual principal.
- `frame` emoldura a cena.
- `stage` e a area onde imagens, estados e overlays aparecem.

### Camadas do stage

Classes usadas:

- `stage-tag before`
- `stage-tag after`
- `empty-state`
- `after-layer`
- `slider-handle`
- `scanline`
- `bar`
- `msg`

Uso:

```html
<span class="stage-tag before">viewport</span>
<span class="stage-tag after">render</span>
<div class="empty-state">A referencia e o render aparecem aqui.</div>
<img id="beforeImg" alt="">
<img id="afterImg" class="after-layer" alt="">
<div class="slider-handle" id="sliderHandle"></div>
<div class="scanline" id="scanline">
  <div class="bar"></div>
  <div class="msg">renderizando...</div>
</div>
```

Padroes:

- `beforeImg` representa viewport/referencia.
- `afterImg.after-layer` representa render final ou edicao.
- `stage-tag` identifica as camadas comparadas.
- `empty-state` aparece quando ainda nao ha imagem.
- `slider-handle` controla comparacao antes/depois.
- `scanline` comunica processamento visual.

## Acoes do workspace

### `canvas-actions`

Uso:

```html
<div class="canvas-actions">
  <button class="secondary" type="button" disabled>Baixar imagem</button>
  <button class="secondary" type="button" disabled>Ver 100% depois</button>
  <button class="secondary" type="button" disabled>Recomecar cena</button>
</div>
```

Padroes:

- Agrupar acoes relacionadas ao resultado visivel.
- Manter botoes secundarios.
- Desabilitar ate existir uma imagem valida.

### `edit-bar`

Uso:

```html
<div class="edit-bar">
  <div>
    <label class="field-label" for="editPrompt">Editar usando o ultimo render como base</label>
    <textarea id="editPrompt" rows="1"></textarea>
  </div>
  <button class="secondary" id="editBtn" type="button" disabled>Aplicar edicao</button>
</div>
```

Padroes:

- Usar para comandos curtos de edicao iterativa.
- O textarea deve aceitar instrucao objetiva.
- O botao pode ser `secondary`, pois a acao primaria continua sendo gerar render.

## Historico

### `history`

Uso:

```html
<div class="history" id="history">
  <div class="history-empty">Historico desta sessao</div>
</div>
```

Padroes:

- Historico e local da sessao atual.
- Usar `history-empty` para estado inicial.
- Itens futuros devem privilegiar miniatura, data/ordem, provider/modelo e acao rapida.

## Estados

Classes e atributos padrao:

- `active`: item selecionado.
- `is-hidden`: elemento oculto por estado ou ambiente.
- `disabled`: acao indisponivel ate cumprir pre-condicao.
- `mode`: badge/estado de modo.
- `provider`: badge/estado de provedor.

Padroes:

- Preferir classes de estado simples e reutilizaveis.
- Estados visuais devem ser refletidos por atributo quando houver semantica nativa, como `disabled`.
- Elementos ocultos devem continuar no DOM quando forem alternancias de modo.

## Nomenclatura

Padrao atual:

- Classes em kebab-case: `section-label`, `canvas-actions`, `empty-state`.
- IDs em camelCase: `generateBtn`, `statusLine`, `providerSelect`.
- Classes descrevem papel visual/estrutural.
- IDs descrevem elemento ou acao controlada por JS.

Regras:

- Nova classe: usar kebab-case.
- Novo ID: usar camelCase.
- Evitar abreviacoes obscuras.
- Preferir nomes por funcao, nao por cor ou posicao.

## Novos componentes recomendados

Ao criar proximas features, seguir estes encaixes:

- Presets de estilo: `section` + `chip-group`.
- Ajustes numericos: `section` + `row` + input/select.
- Configuracao tecnica: `section` + `field-label` + `help`.
- Acao sobre imagem pronta: `canvas-actions` + `secondary`.
- Edicao incremental: `edit-bar`.
- Estado global: `topbar` + `badge`.
- Estado da imagem/processamento: `stage` + overlay.

## Checklist para novos componentes

- Tem um lugar claro em `controls` ou `workspace`.
- Usa `section-label` numerado quando for parte do fluxo.
- Todo campo possui `label.field-label`.
- A acao principal usa `primary`; acoes auxiliares usam `secondary`.
- Estados usam `active`, `is-hidden` ou `disabled`.
- Textos estao em portugues curto e direto.
- IDs seguem camelCase.
- Classes seguem kebab-case.
- O componente funciona em modo navegador e pode ser adaptado para SketchUp.
