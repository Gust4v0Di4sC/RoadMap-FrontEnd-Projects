// postcss-validate-bem.js
const postcss = require('postcss');

module.exports = postcss.plugin('postcss-validate-bem', (opts = {}) => {
  return (root, result) => {
    // Sua lógica de validação virá aqui
  };
});