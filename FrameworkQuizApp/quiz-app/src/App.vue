<template>
  <v-app>
    <v-main class="d-flex align-center justify-center bg-grey-lighten-3">
      <v-container fluid>
        <v-row justify="center">
          <v-col cols="12" md="6" sm="8">

            <v-card v-if="gameState === 'start'" class="text-center pa-6">
              <v-card-title class="text-h4 mb-4">Quiz Técnico</v-card-title>
              <v-card-text>
                Teste seus conhecimentos! Você terá 60 segundos por pergunta.
              </v-card-text>
              <v-card-actions class="justify-center">
                <v-btn color="primary" size="large" @click="startQuiz">Começar Quiz</v-btn>
              </v-card-actions>
            </v-card>

            <v-card v-else-if="gameState === 'playing'" class="pa-4">
              <v-progress-linear
                class="mb-4"
                color="orange"
                height="10"
                :model-value="(timer / 60) * 100"
                striped
              />

              <div class="d-flex justify-space-between align-center mb-4">
                <span class="text-subtitle-1">Questão {{ currentQuestionIndex + 1 }} de {{ questions.length }}</span>
                <v-chip color="secondary">Tempo: {{ timer }}s</v-chip>
              </div>

              <v-card-title class="text-h5 text-wrap mb-4">{{ currentQuestion.question }}</v-card-title>

              <v-row>
                <v-col v-for="option in currentQuestion.options" :key="option" cols="12">
                  <v-btn
                    block
                    :color="getButtonColor(option)"
                    :disabled="selectedAnswer !== null"
                    size="large"
                    variant="outlined"
                    @click="checkAnswer(option)"
                  >
                    {{ option }}
                  </v-btn>
                </v-col>
              </v-row>

              <v-card-actions class="mt-4 justify-end">
                <v-btn v-if="selectedAnswer !== null" color="primary" @click="nextQuestion">Próxima</v-btn>
              </v-card-actions>
            </v-card>

            <v-card v-else-if="gameState === 'finished'" class="text-center pa-6">
              <v-card-title class="text-h4">Fim do Quiz!</v-card-title>
              <v-card-text class="text-h2 my-4">{{ score }} / {{ questions.length }}</v-card-text>
              <v-list>
                <v-list-item v-for="(res, index) in results" :key="index" :subtitle="'Certo: ' + res.correct">
                  Questão {{ index + 1 }}: {{ res.status }}
                </v-list-item>
              </v-list>
              <v-card-actions class="justify-center">
                <v-btn color="primary" @click="resetQuiz">Tentar Novamente</v-btn>
              </v-card-actions>
            </v-card>

          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
  import { computed, onUnmounted, ref } from 'vue'
  import quizData from './data/quiz.json'

  // Estado do Jogo
  const gameState = ref('start') // start, playing, finished
  const currentQuestionIndex = ref(0)
  const score = ref(0)
  const timer = ref(60)
  const intervalId = ref(null)

  const questions = ref(quizData)
  const selectedAnswer = ref(null)
  const results = ref([])

  const currentQuestion = computed(() => questions.value[currentQuestionIndex.value.ref] || questions.value[currentQuestionIndex.value])

  // Funções de Lógica
  function startQuiz () {
    gameState.value = 'playing'
    startTimer()
  }

  function startTimer () {
    timer.value = 60
    intervalId.value = setInterval(() => {
      if (timer.value > 0) {
        timer.value--
      } else {
        skipQuestion()
      }
    }, 1000)
  }

  function stopTimer () {
    clearInterval(intervalId.value)
  }

  function checkAnswer (option) {
    stopTimer()
    selectedAnswer.value = option
    const isCorrect = option === currentQuestion.value.answer

    if (isCorrect) score.value++

    results.value.push({
      status: isCorrect ? 'Correto' : 'Errado',
      correct: currentQuestion.value.answer,
    })
  }

  function skipQuestion () {
    stopTimer()
    score.value = Math.max(0, score.value - 1)
    results.value.push({ status: 'Tempo Exgotado', correct: currentQuestion.value.answer })
    nextQuestion()
  }

  function nextQuestion () {
    if (currentQuestionIndex.value < questions.value.length - 1) {
      currentQuestionIndex.value++
      selectedAnswer.value = null
      startTimer()
    } else {
      gameState.value = 'finished'
    }
  }

  function getButtonColor (option) {
    if (selectedAnswer.value === null) return 'default'
    if (option === currentQuestion.value.answer) return 'success'
    if (option === selectedAnswer.value) return 'error'
    return 'default'
  }

  function resetQuiz () {
    currentQuestionIndex.value = 0
    score.value = 0
    selectedAnswer.value = null
    results.value = []
    gameState.value = 'start'
  }

  onUnmounted(() => stopTimer())
</script>
