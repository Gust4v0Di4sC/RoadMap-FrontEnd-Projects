<template>
  <v-app>
    <v-main class="d-flex align-center justify-center bg-grey-darken-3">
      <v-container fluid>
        <v-row justify="center">
          <v-col cols="12" md="6" sm="8">

            <QuizStartCard v-if="gameState === 'start'" @start="startQuiz" />

            <QuizQuestionCard
              v-else-if="gameState === 'playing'"
              :current-index="currentQuestionIndex"
              :question="currentQuestion"
              :selected-option="selectedAnswer"
              :timer="timer"
              :total-questions="questions.length"
              @answer-selected="checkAnswer"
              @next="nextQuestion"
            />

            <QuizResultsCard
              v-else-if="gameState === 'finished'"
              :results="results"
              :score="score"
              :total-questions="questions.length"
              @reset="resetQuiz"
            />

          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
  import { computed, onUnmounted, ref } from 'vue'

  import QuizQuestionCard from './components/quiz/QuizQuestionCard.vue'
  import QuizResultsCard from './components/quiz/QuizResultsCard.vue'
  import QuizStartCard from './components/quiz/QuizStartCard.vue'

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
