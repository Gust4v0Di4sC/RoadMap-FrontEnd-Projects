// postcss-validate-smacss.js
const layoutRegex = /^\.l-[a-z-]+/;
const stateRegex = /^\.is-[a-z-]+/;
const skinProps = [
  'color', 'background', 'background-color', 'border', 'border-color',
  'box-shadow', 'text-shadow', 'font-family'
];
const structureProps = [
  'width', 'height', 'margin', 'padding', 'display',
  'flex', 'grid', 'float'
];

module.exports = {
  postcssPlugin: 'postcss-validate-smacss',

  Root (root, { result }) {
    root.walkRules(rule => {
      if (!rule.selector.startsWith('.')) {
        return;
      }
      
      const selectors = rule.selector.split(',').map(s => s.trim());
      selectors.forEach(selector => {
        if (layoutRegex.test(selector)) {
          rule.walkDecls(decl => {
            if (skinProps.includes(decl.prop)) {
              result.warn(`A classe de Layout '${selector}' não deve conter propriedades de "pele" como '${decl.prop}'.`, { node: decl });
            }
          });
        } else if (stateRegex.test(selector)) {
          rule.walkDecls(decl => {
            if (structureProps.includes(decl.prop)) {
              result.warn(`A classe de Estado '${selector}' não deve conter propriedades de "estrutura" como '${decl.prop}'.`, { node: decl });
            }
          });
        } else {
          if (selector.includes(' ')) {
            result.warn(`O seletor de Módulo '${selector}' contém um seletor descendente. Módulos devem ser autônomos.`, { node: rule });
          }
        }
      });
    });
  }
};