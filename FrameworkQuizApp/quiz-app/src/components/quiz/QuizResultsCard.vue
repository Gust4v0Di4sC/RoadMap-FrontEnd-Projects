<template>
  <v-card class="text-center pa-6">
    <v-card-title class="text-h4">Fim do Quiz! 🎉</v-card-title>
    <v-card-text class="text-h2 my-4">{{ score }} / {{ totalQuestions }}</v-card-text>

    <v-list class="mx-auto" density="compact" style="max-width: 400px;">
      <v-list-subheader class="text-left">Resultado Detalhado:</v-list-subheader>
      <v-list-item
        v-for="(res, index) in results"
        :key="index"
        class="mb-1"
        :color="res.status === 'Correto' ? 'success' : 'error'"
      >
        <template #prepend>
          <v-badge
            class="mr-4"
            :color="getStatusColor(res.status)"
            :content="getStatusText(res.status)"
            dot
            inline
          >
            <v-icon :icon="res.status === 'Correto' ? 'mdi-check-circle' : 'mdi-close-circle'" />
          </v-badge>
        </template>
        <v-list-item-title>Questão {{ index + 1 }}</v-list-item-title>
        <v-list-item-subtitle>
          **Status:** {{ res.status }}
          <span v-if="res.status !== 'Correto'"> | Correto: {{ res.correct }}</span>
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>

    <v-card-actions class="justify-center mt-4">
      <v-btn color="primary" @click="$emit('reset')">Tentar Novamente</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
// Props recebidas do componente pai (App.vue)
  const props = defineProps({
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    results: { type: Array, required: true },
  })

  // O componente emite um evento 'reset' para reiniciar o quiz
  defineEmits(['reset'])
  function getStatusColor (status) {
    if (status === 'Correto') return 'success'
    if (status === 'Errado') return 'error'
    return 'warning' // Para 'Tempo Exgotado'
  }

  function getStatusText (status) {
    if (status === 'Correto') return '✓'
    if (status === 'Errado') return 'X'
    return '!' // Para 'Tempo Exgotado'
  }
</script>
