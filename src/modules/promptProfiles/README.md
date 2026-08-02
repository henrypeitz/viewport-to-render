# Perfis de prompt

Este módulo contém os perfis arquitetônicos adicionados a partir de `agents.md/prompts-adicionais.md`. Ele é deliberadamente separado de presets, provedores e componentes de resultado.

## Conceitos

- **Preset** salva o estado da interface: qualidade, luz, fidelidade, elementos, estratégia e demais controles.
- **Perfil de prompt** é uma estratégia textual reutilizável. Ele não salva uma configuração visual inteira.

## Modos

- `current`: usa o montador modular existente, identificado como `current-v1` para comparações futuras.
- `enhanced`: envia somente o texto do perfil arquitetônico selecionado, acrescido apenas de instrução adicional, máscara quando ativa e restrições de segurança.
- `hybrid`: envia os controles modulares e o perfil selecionado. O perfil é colocado depois das opções modulares para que suas restrições arquitetônicas tenham precedência. A instrução livre do usuário continua por último.

## Arquivos

- `profiles.js`: catálogo dos nove textos e metadados de interface.
- `PromptProfilePanel.jsx`: seletor da estratégia e do perfil.
- `promptProfileBuilder.js`: regra única de composição entre perfil, prompt atual, máscara e instrução livre.

Todo resultado gerado registra `promptProfile`, uma cópia das configurações e o prompt enviado. Isso mantém comparações entre estratégias reproduzíveis dentro do histórico da sessão.

## Como editar ou adicionar um perfil

Adicione um objeto em `ADDITIONAL_PROMPT_PROFILES` com `id`, `label`, `description` e `prompt`. O `id` deve ser estável: ele é salvo em presets e no histórico.

## Como remover o recurso

1. Remova `PromptProfilePanel` de `App.jsx`.
2. Troque a chamada de `buildPromptWithProfile` por `buildCurrentPrompt` em `src/prompts/promptBuilder.js`.
3. Remova a pasta `src/modules/promptProfiles/`.
4. Opcionalmente remova `promptProfile` de `createDefaultSettings` e de `normalizeSettings`.

Presets antigos continuam funcionais porque `normalizeSettings` preenche todos os novos campos com valores padrão.
