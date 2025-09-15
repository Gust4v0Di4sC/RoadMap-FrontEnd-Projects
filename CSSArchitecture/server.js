// server.js
const express = require('express');
const postcss = require('postcss');
const path = require('path');

const app = express();
const PORT = 3000;

// Importar os validadores PostCSS
const validateBem = require('./postcss-plugins/validate-bem');
// Você vai criar os outros validadores aqui
const validateSmacss = require('./postcss-plugins/validate-smacss');
const validateOocss = require('./postcss-plugins/validate-oocss');

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Para receber dados JSON do front-end

// Mapeia as arquiteturas aos plugins
const validators = {
  bem: validateBem,
  smacss: validateSmacss,
  oocss: validateOocss
};

// Endpoint de validação
app.post('/validate', async (req, res) => {
  const { css, architecture } = req.body;

  if (!css || !architecture || !validators[architecture]) {
    return res.status(400).json({ error: 'Dados inválidos.' });
  }

  const validator = validators[architecture];

  try {
    const result = await postcss([validator]).process(css, { from: undefined });

    if (result.warnings().length > 0) {
      // Extrai as mensagens de erro
      const messages = result.warnings().map(w => w.text);
      res.json({ isValid: false, messages });
    } else {
      res.json({ isValid: true, messages: [`O código CSS segue a arquitetura ${architecture.toUpperCase()}.`] });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erro ao processar o CSS.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});