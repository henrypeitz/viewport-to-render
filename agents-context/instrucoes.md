Você é um arquiteto de software e produto sênior. Quero que você me ajude a criar um arquivo `.md` de arquitetura funcional para uma aplicação web integrada a um plugin do SketchUp.

A aplicação será usada para transformar capturas de viewport/render base em imagens renderizadas por IA, usando provedores como OpenRouter e API direta do Google. O foco é arquitetura limpa, sustentável, escalável e fácil de expandir com novos módulos no futuro.

## Contexto da aplicação

A aplicação deve permitir que o usuário envie ou receba uma imagem base, como:

- Captura da viewport do SketchUp;
- Print do SketchUp;
- Imagem do Enscape;
- Upload manual de imagem;
- Último render gerado anteriormente.

Analise também o arquivo abaixo para reaproveitar ideias, comportamento e componentes existentes:

`/home/henrypeitz/Projetos/Pessoal/sketchup-plugin/project-react/templates/index.html`

Caso não consiga acessar o arquivo, indique claramente isso e proponha uma estrutura equivalente com base nos requisitos abaixo.

## Objetivo do documento

Crie um arquivo `.md` com a arquitetura funcional da aplicação. O documento deve servir como guia para implementação posterior em React, sem escrever código completo agora.

O documento deve conter:

1. Visão geral da aplicação;
2. Fluxo principal do usuário;
3. Módulos principais;
4. Funcionalidades por módulo;
5. Estrutura sugerida de arquivos;
6. Organização de estado;
7. Estratégia de prompts;
8. Estratégia de provedores/modelos;
9. Estratégia de presets;
10. Estratégia de escalabilidade;
11. Critérios de aceite para a primeira versão.

## Requisitos principais

### 1. Configuração de provedor e modelo

A aplicação deve permitir:

- Inserir uma API Key;
- Escolher o provedor de IA;
- Escolher o modelo de renderização;
- Suportar inicialmente:
  - OpenRouter;
  - API direta do Google;

- Suportar modelos como Nano Banana e similares;
- Permitir expansão futura para novos provedores e novos modelos.

A arquitetura deve prever uma camada de abstração, como `provider adapters`, para evitar que a aplicação fique presa a um único provedor.

### 2. API Key e persistência local

A aplicação deve permitir:

- Usar a API Key apenas durante a sessão;
- Opcionalmente salvar a API Key em `localStorage`;
- Carregar automaticamente a chave salva ao trocar de provedor;
- Manter chaves separadas por provedor;
- Permitir apagar uma chave salva;
- Evitar logs da API Key;
- Deixar claro no documento que, em uma versão futura, pode existir uma alternativa mais segura.

### 3. Entrada de imagem

A aplicação deve permitir diferentes formas de entrada:

- Upload manual;
- Imagem enviada pelo plugin do SketchUp;
- Captura da viewport;
- Print/render externo;
- Último render gerado;
- Render anterior usado como base para edição.

Explique como a aplicação deve lidar com:

- Preview da imagem original;
- Validação de formato;
- Limite de tamanho;
- Estado da imagem atual;
- Histórico simples de imagens geradas.

### 4. Qualidade da imagem e captura

A aplicação deve ter opções como:

- Qualidade de geração:
  - 1K — teste rápido;
  - 2K — preview/apresentação;
  - 4K — cliente/final;

- Resolução de captura:
  - 1024px;
  - 2048px;
  - 4096px, se aplicável;

- Presets de velocidade versus qualidade;
- Aviso de custo/tempo estimado quando aplicável.

Explique quais opções devem ser obrigatórias e quais podem ser opcionais.

### 5. Configurações de render

A aplicação deve permitir enriquecer o prompt com opções visuais configuráveis.

Inclua categorias como:

- Tipo de cena:
  - Interior;
  - Exterior;
  - Fachada;
  - Área gourmet;
  - Sala;
  - Cozinha;
  - Banheiro;
  - Quarto;
  - Comercial;
  - Paisagismo;

- Perspectiva:
  - Frontal;
  - Aérea;
  - Perspectiva humana;
  - Grande angular;
  - Close-up;
  - Vista de canto;

- Tipo de ambiente:
  - Residencial;
  - Comercial;
  - Corporativo;
  - Luxo;
  - Minimalista;
  - Contemporâneo;
  - Industrial;
  - Escandinavo;

- Iluminação natural:
  - Manhã;
  - Meio-dia;
  - Final de tarde;
  - Golden hour;
  - Noite;
  - Céu nublado;

- Iluminação artificial:
  - Luz quente;
  - Luz fria;
  - Spots;
  - Fitas LED;
  - Iluminação indireta;
  - Lustres;
  - Pendentes;

- Clima e atmosfera:
  - Ensolarado;
  - Nublado;
  - Chuvoso;
  - Dramático;
  - Aconchegante;
  - Editorial;
  - Comercial;

- Materiais:
  - Preservar materiais existentes;
  - Substituir por contemporâneo limpo;
  - Luxo;
  - Madeira natural;
  - Mármore;
  - Concreto aparente;
  - Tons neutros;
  - Alto contraste;

- Vidros e espelhos:
  - Preservar reflexos;
  - Melhorar reflexos;
  - Reduzir reflexos;
  - Adicionar transparência realista;

- Vegetação e entorno:
  - Preservar entorno;
  - Adicionar vegetação leve;
  - Adicionar paisagismo completo;
  - Adicionar árvores;
  - Adicionar jardim;
  - Adicionar entorno urbano;
  - Adicionar céu realista.

Cada categoria deve poder ser ativada ou desativada, porque muitas opções não se aplicam a todos os renders.

### 6. Instruções adicionais

A aplicação deve ter um campo livre para instruções adicionais, onde o usuário possa escrever pedidos específicos, como:

- “Manter exatamente o layout original”;
- “Melhorar apenas iluminação e materiais”;
- “Não alterar geometria”;
- “Adicionar vegetação na lateral direita”;
- “Remover aparência de SketchUp”;
- “Deixar com cara de render profissional para cliente”.

Explique como esse campo deve ser combinado com os presets e opções selecionadas no prompt final.

### 7. Preservação, alteração e edição localizada

A aplicação deve permitir escolher o nível de intervenção:

- Preservar geometria;
- Preservar materiais;
- Preservar composição;
- Alterar estilo visual;
- Alterar materiais;
- Adicionar elementos;
- Remover elementos;
- Editar somente uma região específica.

Inclua uma funcionalidade de edição localizada, onde o usuário possa desenhar ou marcar uma área da imagem para remover, substituir ou alterar aquela parte específica.

Essa funcionalidade deve prever:

- Ferramenta de máscara/desenho;
- Prompt específico para a área selecionada;
- Opção de remover objeto;
- Opção de substituir objeto;
- Opção de regenerar apenas a área;
- Preview da máscara;
- Possibilidade de cancelar a seleção.

### 8. Elementos adicionais

A aplicação deve permitir adicionar elementos configuráveis à cena, como:

- Pessoas;
- Veículos;
- Pets;
- Mobiliário;
- Vegetação;
- Objetos decorativos.

Para cada categoria, prever configurações simples, por exemplo:

- Quantidade;
- Posição aproximada;
- Estilo;
- Escala;
- Nível de realismo;
- Preservar ou não a composição original.

Essas opções também devem ser ativáveis/desativáveis.

### 9. Comparação antes/depois

Reaproveite a ideia do template existente para permitir comparar a imagem original e a imagem gerada.

A aplicação deve conter:

- Visualização da imagem original;
- Visualização do render gerado;
- Slider horizontal de comparação antes/depois;
- Botão para baixar imagem;
- Botão para recomeçar;
- Botão para editar o último render como base;
- Botão para gerar nova variação;
- Histórico simples de renders.

### 10. Pós-produção sem IA

A aplicação deve ter um módulo de pós-produção sem IA, para ajustes básicos da imagem após a geração.

Inclua opções como:

- Brilho;
- Contraste;
- Saturação;
- Nitidez;
- Temperatura;
- Exposição;
- Vinheta;
- Corte/crop;
- Rotação;
- Redimensionamento;
- Compressão;
- Exportação em formatos diferentes.

Esse módulo deve ser separado da geração por IA, para deixar claro que são ajustes locais no navegador ou no backend, sem novo custo de IA.

### 11. Presets configuráveis

A aplicação deve ter uma aba de presets configuráveis.

O usuário deve poder:

- Criar presets;
- Salvar combinações de opções;
- Reutilizar presets;
- Editar presets;
- Duplicar presets;
- Excluir presets;
- Marcar preset como favorito;
- Usar presets prontos da aplicação.

Exemplos de presets iniciais:

- Render limpo para cliente;
- Fachada luxo;
- Interior contemporâneo;
- Área gourmet realista;
- Paisagismo leve;
- Preview rápido;
- Render editorial;
- Preservar máximo do modelo original.

### 12. Estratégia de prompts

A aplicação provavelmente usará prompts base já existentes. A arquitetura deve prever um sistema modular de prompts, onde o prompt final seja montado a partir de blocos.

Exemplo de composição:

- Prompt base;
- Tipo de cena;
- Perspectiva;
- Estilo visual;
- Materiais;
- Iluminação;
- Entorno;
- Elementos adicionais;
- Restrições;
- Instruções adicionais do usuário;
- Prompt negativo, quando aplicável.

O documento deve explicar como organizar esses blocos para facilitar manutenção e expansão futura.

Também inclua exemplos de nomes de arquivos, como:

- `promptBase.ts`;
- `promptFragments.ts`;
- `promptBuilder.ts`;
- `negativePrompts.ts`;
- `presetPrompts.ts`.

### 13. Estrutura limpa de componentes

Não crie componentes demais. Quero um fluxo limpo, com arquivos claros e fáceis de manter.

Sugira uma estrutura com poucos componentes principais, agrupados por responsabilidade.

Evite uma arquitetura exagerada. Prefira algo escalável, mas simples.

Exemplo de módulos esperados:

- Configuração de provedor;
- Entrada de imagem;
- Configurações de render;
- Edição localizada;
- Resultado e comparação;
- Pós-produção;
- Presets;
- Histórico.

Para cada módulo, descreva brevemente sua responsabilidade.

### 14. Escalabilidade

A aplicação deve ser sustentável e escalável para permitir novos módulos no futuro, como:

- Novos provedores;
- Novos modelos;
- Novos tipos de render;
- Novos presets;
- Novas ferramentas de edição;
- Novas integrações com SketchUp;
- Novas opções de exportação;
- Possível backend no futuro;
- Possível sistema de autenticação;
- Possível galeria de projetos.

Explique como separar responsabilidades para evitar que o app vire um arquivo gigante ou um conjunto de componentes acoplados.

### 15. Entregável final

Gere o conteúdo completo de um arquivo `.md`, com título, seções, subtítulos, listas e explicações objetivas.

O documento deve ser prático, implementável e organizado.

Não escreva código React completo. Pode incluir pseudocódigo, estrutura de pastas e exemplos de objetos quando ajudar.

Mantenha o foco em arquitetura funcional, fluxo de produto e organização inicial da aplicação.
