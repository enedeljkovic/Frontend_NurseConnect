<template>
  <div class="quizzes-page">
    <div class="header">
      <h2>Kvizovi</h2>
      <!-- Gumb za dodavanje kviza samo za profesore -->
      <button v-if="isProfesor" @click="goToAddQuiz">+ Dodaj kviz</button>
    </div>

    <div v-if="quizzes.length === 0" class="no-quizzes">
      Trenutno nema dostupnih kvizova.
    </div>

    <ul v-else class="quiz-list">
      <li v-for="quiz in quizzes" :key="quiz.id" class="quiz-item">
        <div class="quiz-info">
          <h3>{{ quiz.naziv }}</h3>
          <p>{{ quiz.pitanja.length }} pitanja</p>
        </div>
        <button class="solve-btn" @click="goToQuiz(quiz.id)">Riješi kviz</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'Quizzes',
  setup() {
    const quizzes = ref([]);
    const isProfesor = ref(localStorage.getItem('isProfesor') === 'true');
    const router = useRouter();

    const fetchQuizzes = async () => {
      try {
        const res = await axios.get('http://localhost:3001/quizzes');
        quizzes.value = res.data;
      } catch (error) {
        console.error('Greška pri dohvaćanju kvizova:', error);
      }
    };

    const goToAddQuiz = () => {
      router.push('/add-quiz');
    };

    const goToQuiz = (id) => {
      router.push(`/quizzes/${id}`);
    };

    onMounted(fetchQuizzes);

    return { quizzes, goToAddQuiz, goToQuiz, isProfesor };
  }
};
</script>

<style scoped>
.quizzes-page {
  max-width: 800px;
  margin: auto;
  padding: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.header h2 {
  color: #0077B6;
}

.header button {
  background-color: #0077B6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1rem;
  cursor: pointer;
}

.header button:hover {
  background-color: #005f8a;
}

.no-quizzes {
  text-align: center;
  color: #999;
}

.quiz-list {
  list-style: none;
  padding: 0;
}

.quiz-item {
  background-color: #f0f9ff;
  padding: 1rem;
  border-radius: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.solve-btn {
  background-color: #3B9A57;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.solve-btn:hover {
  background-color: #2f7b45;
}
</style>
