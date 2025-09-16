// postcss-validate-oocss.js
module.exports = {
  postcssPlugin: 'postcss-validate-oocss',

  Root (root, { result }) {
    root.walkRules(rule => {
      // O regex para seletores descendentes é mais preciso do que apenas .includes(' ')
      // Ele verifica por uma classe seguida de um espaço e outro seletor
      if (rule.selector.match(/\.[a-zA-Z0-9-]+\s+[a-zA-Z0-9-.]+/)) {
        result.warn(`O seletor '${rule.selector}' viola o princípio de "separar container e conteúdo" do OOCSS. Use classes independentes.`, {
          node: rule,
        });
      }
    });
  }
};