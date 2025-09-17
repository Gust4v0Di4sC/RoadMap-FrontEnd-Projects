// postcss-validate-bem.js
const bemBlockRegex = /^[a-z]+(?:-[a-z]+)*$/;
const bemElementRegex = /^[a-z]+(?:-[a-z]+)*__[a-z]+(?:-[a-z]+)*$/;
const bemModifierRegex = /^[a-z]+(?:-[a-z]+)*(?:__[a-z]+(?:-[a-z]+)*)?--[a-z]+(?:-[a-z]+)*$/;

module.exports = {
  postcssPlugin: 'postcss-validate-bem',
  
  // O método Root é o ponto de entrada para a validação
  Root (root, { result }) {
    root.walkRules(rule => {
      const selectors = rule.selector.split(',').map(s => s.trim());

      selectors.forEach(selector => {
        if (!selector.startsWith('.')) {
          return;
        }

        const className = selector.substring(1);

        if (
          !bemBlockRegex.test(className) &&
          !bemElementRegex.test(className) &&
          !bemModifierRegex.test(className)
        ) {
          result.warn(`A classe '${className}' não segue a convenção de nomenclatura BEM.`, {
            node: rule,
          });
        }
      });
    });
  }
};