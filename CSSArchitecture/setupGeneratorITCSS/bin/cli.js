#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const baseDir = './styles';

// Estrutura de pastas e arquivos para o ITCSS
const structure = {
  'main.scss': `@import "settings/colors";
@import "settings/fonts";
@import "tools/mixins";
@import "generic/reset";
@import "elements/elements";
@import "objects/objects";
@import "components/components";
@import "trumps/utilities";
`,
  'settings': {
    '_colors.scss': '// Your colors variables',
    '_fonts.scss': '// Your font variables'
  },
  'tools': {
    '_mixins.scss': '// Your mixins'
  },
  'generic': {
    '_reset.scss': '// Your reset or normalize styles'
  },
  'elements': {
    '_elements.scss': '// Un-classed HTML elements (h1, p, a, etc.)'
  },
  'objects': {
    '_objects.scss': '// Layout-related classes (.container, .grid, etc.)'
  },
  'components': {
    '_components.scss': '// UI components (.button, .card, etc.)'
  },
  'trumps': {
    '_utilities.scss': '// High-specificity utility classes (.u-margin-2)'
  }
};

// Função para criar a estrutura
function createStructure(currentPath, currentStructure) {
  // Cria o diretório atual recursivamente.
  // Se o diretório já existe, não faz nada.
  fs.mkdirSync(currentPath, { recursive: true });

  for (const name in currentStructure) {
    const fullPath = path.join(currentPath, name);
    const content = currentStructure[name];

    if (typeof content === 'string') {
      // É um arquivo
      console.log(`Creating file: ${fullPath}`);
      fs.writeFileSync(fullPath, content);
    } else {
      // É um diretório
      createStructure(fullPath, content); // Chama a função recursivamente
    }
  }
}

// Execução
try {
  console.log('Generating ITCSS folder structure...');
  // A chamada inicial agora só precisa do diretório base e da estrutura
  createStructure(baseDir, structure);
  console.log('\n✅ ITCSS structure successfully generated!');
  console.log(`Start by importing your files into ${baseDir}/main.scss`);
} catch (err) {
  console.error('\n❌ An error occurred:', err);
}