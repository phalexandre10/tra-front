# Catálogo de Produtos EPI

Este é um projeto de catálogo web para produtos de Equipamentos de Proteção Individual (EPI), desenvolvido inteiramente em português do Brasil.

## Descrição

O projeto consiste em uma página web que exibe um catálogo de produtos EPI, com funcionalidades de visualização de produtos, solicitação de orçamentos e informações sobre EPIs.

## Funcionalidades

- Exibição dinâmica de produtos via API (simulada com JavaScript)
- Sistema de orçamento com adição/remoção de produtos e cálculo de valor total
- Formulário de solicitação de orçamento com validação completa
- Sistema de filtragem de produtos por categoria
- Listas ordenadas e não ordenadas para organização de informações
- Tabela estruturada com dados de produtos populares
- Design responsivo e acessível
- Feedback visual através de modais e mensagens de sucesso/erro

## Tecnologias Utilizadas

- HTML5 semântico para acessibilidade e organização
- CSS3 com design responsivo e variáveis CSS
- JavaScript moderno com módulos ES6
- Programação Orientada a Objetos com classes e herança
- Comunicação assíncrona com Promises e async/await
- Manipulação do DOM para exibição de dados
- Validação de formulários no lado do cliente
- Atributos ARIA para melhor acessibilidade

## Como Usar

1. Clone este repositório para sua máquina local
2. Inicie um servidor local (devido ao uso de módulos ES6)
   - Você pode usar `npx serve` (requer Node.js)
   - Ou usar a extensão Live Server no VS Code
3. Acesse a aplicação no navegador
4. Navegue pelo catálogo, visualize os produtos e teste o formulário de orçamento

## Estrutura do Projeto

- `index.html`: Arquivo principal com a estrutura HTML
- `estilos.min.css`: Arquivo de estilização principal (versão minimizada)
- `estilos-produto-lista.css`: Estilos específicos para a exibição de produtos
- `js/`: Pasta contendo módulos JavaScript
  - `api.js`: Módulo para comunicação com API (simulada)
  - `models.js`: Módulo com classes e entidades do negócio
  - `validacao.js`: Módulo para validação de formulários
  - `dom.js`: Módulo para manipulação do DOM
  - `app.js`: Módulo principal que integra os demais
  - `fix-form.js`: Script complementar para garantir inicialização correta do formulário

## Mudanças Recentes

- **Remoção do carrinho de compras**: A funcionalidade foi simplificada para focar apenas no sistema de orçamento.
- **Melhorias de acessibilidade**: Adição de atributos ARIA e roles para melhor compatibilidade com leitores de tela.
- **Correção do formulário**: Adição do `fix-form.js` para garantir inicialização correta do formulário de orçamento.
- **Validação aprimorada**: Implementação de classe `ValidacaoHelper` com métodos modernos de validação.
- **Feedback visual**: Adição de modais e mensagens para melhor experiência do usuário.

## Requisitos Implementados

### HTML5 Semântico e Acessível
- Elementos semânticos como header, main, section, nav, footer
- Atributos ARIA para melhor acessibilidade (role, aria-label, aria-required)
- Formulário bem estruturado com validação
- Listas ordenadas e não ordenadas
- Tabelas para estruturação de dados com caption e scope

### CSS Avançado
- Separação de conteúdo e apresentação
- Modelo de Caixa (Box Model) para controle preciso de layout
- Estilização de elementos (texto, links, imagens)
- Layout responsivo com media queries
- Organização eficiente de seletores (tag, classe, ID)

### JavaScript Moderno
- Modularização com ES Modules (import/export)
- Programação Orientada a Objetos com classes e herança
- Comunicação assíncrona com API simulada
- Promises e async/await para operações assíncronas
- Validação de formulários no cliente
- Manipulação do DOM para conteúdo dinâmico
- Tratamento de eventos do usuário
- Feedback visual para o usuário através de modais

## Autores

Desenvolvido como projeto educacional.

## Licença

Este projeto está sob a licença MIT. 