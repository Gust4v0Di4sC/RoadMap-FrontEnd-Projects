<template>
  <v-card class="pa-4">

    <v-progress-linear
      class="mb-4"
      color="orange"
      height="10"
      :model-value="(timer / 60) * 100"
      striped
    />

    <div class="d-flex justify-space-between align-center mb-4">
      <span class="text-subtitle-1">Questão {{ currentIndex + 1 }} de {{ totalQuestions }}</span>
      <v-chip color="secondary">Tempo: {{ timer }}s</v-chip>
    </div>

    <v-card-title class="text-h5 text-wrap mb-4">{{ question.question }}</v-card-title>

    <v-row>
      <v-col v-for="option in question.options" :key="option" cols="12">
        <v-btn
          block
          :color="getButtonColor(option)"
          :disabled="!!selectedOption"
          size="large"
          variant="outlined"
          @click="selectAnswer(option)"
        >
          {{ option }}
        </v-btn>
      </v-col>
    </v-row>

    <v-card-actions class="mt-4 justify-end">
      <v-btn
        v-if="!!selectedOption"
        color="primary"
        @click="$emit('next')"
      >
        Próxima
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
  import { computed } from 'vue'

  // 1. Definição das Props (Dados recebidos do App.vue)
  const props = defineProps({
    question: {
      type: Object,
      required: true,
      // Garante que a estrutura da pergunta está correta
      validator: value => value.question && value.options && value.answer,
    },
    currentIndex: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    timer: {
      type: Number,
      required: true,
    },
    selectedOption: {
      type: String, // A opção que o usuário selecionou (ou null)
      default: null,
    },
  })

  // 2. Definição dos Eventos (Ações enviadas para o App.vue)
  const emit = defineEmits([
    'answer-selected', // Emitido quando o usuário clica em uma opção
    'next', // Emitido quando o usuário clica em "Próxima"
  ])

  // 3. Lógica local para seleção da resposta
  function selectAnswer (option) {
    // Envia a resposta selecionada para o componente pai para processamento
    emit('answer-selected', option)
  }

  // 4. Lógica para definir a cor do botão (Feedback Visual)
  function getButtonColor (option) {
    // Se ainda não houve seleção, todos são padrão
    if (!props.selectedOption) return 'default'

    // Opção Correta (sempre verde)
    if (option === props.question.answer) return 'success'

    // Opção Selecionada pelo Usuário (só vermelha se for diferente da correta)
    if (option === props.selectedOption) {
      return option === props.question.answer ? 'success' : 'error'
    }

    // Outras opções permanecem padrão
    return 'default'
  }
</script>
