## Validador CSS de arquiteturas 
escaneia o codigo css enviado pelo usuário e valida se esta seguindo os padroes e regras da arquitetura escolhida , as opções de arquitetura são BEM, SMACSS e OOCSS.

### Stack
JavaScript  , HTML e CSS
Parser de CSS para fazer verificação da arquitetura
PostCSS ou css-tree

### Estrutura do Validador
input de escolha da arquitetura drop down
Input para o codigo CSS 
resposta em relatório com todos os pontos corretos e faltantes se houver.

### Fluxo 
usuario envia o codigo css no input , parser faz a validação do codigo e retornar uma arvore de sintaxe abstrata

### Implementação das regras

- **BEM (Block, Element, Modifier):** Crie regras para verificar se os seletores CSS seguem a sintaxe `bloco__elemento--modificador`. Você precisará usar expressões regulares para validar a formatação dos nomes.
    
- **SMACSS (Scalable and Modular Architecture for CSS):** As regras do SMACSS são mais conceituais. Você precisará verificar a separação de código em categorias como **Base**, **Layout**, **Module**, **State** e **Theme**. A validação pode ser feita verificando se os seletores de cada categoria seguem uma convenção de nomenclatura ou se a estrutura de arquivos do projeto está organizada por essas categorias.
    
- **OOCSS (Object-Oriented CSS):** Para OOCSS, o foco é a separação de **estrutura** (o que é estático) e **aparência** (o que é visual). A validação pode verificar se não há seletores de classes que combinam elementos estruturais e de aparência em um só. Por exemplo, a regra `box-size` (estrutura) e `background-color` (aparência) podem estar em classes separadas.

### Desenvolvimento do Validador
- [x] **Fase 1: Protótipo do Validador BEM:** Comece com a arquitetura BEM, que tem regras de nomenclatura bem definidas. Use **PostCSS** para criar um plugin de validação que verifica se os seletores seguem o padrão `bloco__elemento--modificador`.

- [x] **Fase 2: Expansão para SMACSS e OOCSS:** Adicione as regras para as outras arquiteturas.

- [x] **Fase 3: Desenvolvimento da Interface do Usuário:** Crie a interface front-end, que pode ser uma página simples com HTML, CSS e JavaScript.

## Gerador de Setup ITCSS
Gera uma estrutura de pastas e arquivos e arquivos pre-definidas seguindo o padrao ITCSS e separa o projeto em camadas, serve como ponto de partida para novos projetos, apos a estrutura gerada basta criar os arquivos de acordo com o projeto, servindo como um molde.

### Stack
nodejs
conta no NPM
JS/NODE


### Estrutura dos arquivos gerados
 **Estrutura de Arquivos ITCSS:**

- A arquitetura ITCSS organiza os arquivos em camadas, do mais genérico para o mais específico. Uma estrutura básica poderia ser assim:
```
/seu-projeto
|-- /sass (ou /css)
|   |-- 0-settings/       # Variáveis, cores, fontes, etc.
|   |-- 1-tools/          # Mixins, funções
|   |-- 2-generic/        # Reset, normalize.css
|   |-- 3-elements/       # Estilos para tags HTML (h1, a, p)
|   |-- 4-objects/        # Classes de objetos/layouts (containers, media objects)
|   |-- 5-components/     # Componentes específicos (botões, cards)
|   |-- 6-utilities/      # Classes de utilidade (helper classes)
|   |-- main.scss         # O arquivo principal onde todas as camadas são importadas
```

### Fluxo de uso
usuario roda um comando npm e a estrutura ITCSS de arquivos e pastas é gerada diretamente no projeto que foi rodado o comando.


### Estrutura do pacote
Criar uma nova pasta para o  projeto e inicialize-o com `npm init -y`. O arquivo `package.json` será o coração do seu pacote.

A estrutura de pastas do seu projeto ficará assim:

```
/seu-gerador-itcss
|-- /templates/          # Aqui ficarão os arquivos "de rascunho" do setup ITCSS
|   |-- 0-settings/
|   |-- 1-tools/
|   |-- ...
|   |-- main.scss
|-- index.js             # O script que será executado quando o pacote for usado
|-- package.json
```

Script do Codigo Index.js
- **Obter o caminho do projeto:** Descobrir em qual pasta o comando está sendo executado.
    
- **Copiar os arquivos do "template":** Ler a estrutura de pastas e arquivos da pasta `/templates` e copiá-la para o diretório de destino.
    
- **Adicionar mensagens de feedback:** Exibir mensagens para o usuário, confirmando que a estrutura foi criada com sucesso.

módulos nativos do Node.js, como `fs` e `path`, para lidar com o sistema de arquivos. Para simplificar, existem bibliotecas excelentes que fazem isso de forma mais robusta e com menos código.

**Bibliotecas úteis:**

- **`fs-extra`:** Uma versão aprimorada do módulo `fs`, com funções como `copySync` para copiar diretórios inteiros de forma síncrona.
    
- **`yargs` ou `commander`:** Para criar uma interface de linha de comando mais amigável, caso você queira adicionar opções extras, como `--sass` ou `--less`.

### Publicação do pacote

1. **Faça o login no npm:** Use o comando `npm login` no seu terminal.
    
2. **Publique o pacote:** Depois de criar o código, use `npm publish` para enviá-lo para o registro do npm.
    

Após a publicação, qualquer pessoa poderá usar o seu gerador com o comando:

Bash

```
# Para usar sem precisar instalar globalmente
npx nome-do-seu-pacote
