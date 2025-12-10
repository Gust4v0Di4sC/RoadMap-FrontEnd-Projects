<template>
  <v-card class="text-center pa-6">
    <v-card-title class="text-h4 mb-4">Bem-vindo ao Quiz Técnico 🧠</v-card-title>
    <v-card-text>
      Teste seus conhecimentos! Responda o máximo de perguntas que puder.
      <br>
      **Regras:** Você terá **60 segundos** por pergunta. Se o tempo acabar, você perde 1 ponto.
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn color="primary" size="large" @click="$emit('start')">Começar Quiz</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
// O componente emite um evento 'start' para o componente pai
// indicando que o quiz deve começar.
  defineEmits(['start'])
</script>
