<template>
  <div class="container my-5">
    <div v-if="quiz" class="card shadow p-4">
      <h2 class="mb-4 text-primary">{{ quiz.naziv }}</h2>

      <div v-if="alreadySolved && rezultat.length">
        <h4 class="text-success">✅ Već si riješio ovaj kviz!</h4>
        <p class="fw-bold">
          Točno odgovoreno: {{ brojTocnih }}/{{ rezultat.length }} ({{ postotak }}%)
        </p>
        <p class="text-muted">Pregled točnih i netočnih odgovora:</p>
      </div>

      <form v-if="!alreadySolved" @submit.prevent="submitAnswers">
        <div v-for="(pitanje, index) in quiz.pitanja" :key="index" class="mb-4 border rounded p-3">
          <p class="fw-bold">{{ index + 1 }}. {{ pitanje.question }}</p>

          <div v-if="pitanje.type === 'multiple' || pitanje.type === 'image'">
            <div v-for="(opcija, i) in pitanje.options" :key="i" class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                :value="opcija"
                v-model="odgovori[index]"
              />
              <label class="form-check-label">{{ opcija }}</label>
            </div>
          </div>

          <div v-else-if="pitanje.type === 'truefalse'">
            <div class="form-check">
              <input class="form-check-input" type="radio" :value="'T'" v-model="odgovori[index]" />
              <label class="form-check-label">Točno</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" :value="'N'" v-model="odgovori[index]" />
              <label class="form-check-label">Netočno</label>
            </div>
          </div>
        </div>

        <button type="submit" class="btn btn-success w-100 mt-3">Pošalji odgovore</button>
      </form>

      <div v-if="alreadySolved" class="mt-4">
        <div v-for="(pitanje, index) in quiz.pitanja" :key="index" class="mb-4">
          <h6 class="fw-bold">Pitanje {{ index + 1 }}: {{ pitanje.question }}</h6>
          <p>
            Tvoj odgovor:
            <span :class="{'text-success': rezultat[index], 'text-danger': !rezultat[index]}">
              {{ formatOdgovor(odgovori[index]) }}
            </span>
          </p>
          <p v-if="!rezultat[index]" class="text-info">
            ✅ Točan odgovor: {{ formatOdgovor(pitanje.correct) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'TakeQuiz',
  setup() {
    const route = useRoute();
    const quizId = Number(route.params.id);
    const quiz = ref(null);
    const odgovori = ref([]);
    const rezultat = ref([]);
    const alreadySolved = ref(false);

    const fetchQuiz = async () => {
      const student = JSON.parse(localStorage.getItem('user'));
      try {
        const solvedRes = await axios.get(`http://localhost:3001/solved/${student.id}/${quizId}`);
        if (solvedRes.data.solved) {
          const res = await axios.get(`http://localhost:3001/quizzes/${quizId}`);
          quiz.value = res.data;
          rezultat.value = solvedRes.data.rezultat;
          alreadySolved.value = true;
          odgovori.value = quiz.value.pitanja.map(p => p.correct); // show correct answers
          return;
        }

        const res = await axios.get(`http://localhost:3001/quizzes/${quizId}`);
        quiz.value = res.data;
        odgovori.value = quiz.value.pitanja.map(p =>
          p.type === 'truefalse' ? '' : []
        );
      } catch (err) {
        console.error('Greška pri dohvaćanju kviza:', err);
      }
    };

    const submitAnswers = async () => {
      const student = JSON.parse(localStorage.getItem('user'));
      try {
        const res = await axios.post(`http://localhost:3001/quizzes/${quizId}/check-answers`, {
          odgovori: odgovori.value,
          studentId: student.id
        });
        rezultat.value = res.data.rezultat;
        alreadySolved.value = true;
      } catch (err) {
        if (err.response && err.response.status === 403) {
          alert('❌ Dosegnut je maksimalan broj pokušaja.');
        } else {
          console.error('Greška pri slanju odgovora:', err);
        }
      }
    };

    const brojTocnih = computed(() => rezultat.value.filter(r => r === true).length);
    const postotak = computed(() =>
      rezultat.value.length
        ? Math.round((brojTocnih.value / rezultat.value.length) * 100)
        : 0
    );

    const formatOdgovor = (odg) => {
      if (Array.isArray(odg)) return odg.join(', ');
      return odg;
    };

    onMounted(fetchQuiz);

    return {
      quiz,
      odgovori,
      rezultat,
      alreadySolved,
      brojTocnih,
      postotak,
      submitAnswers,
      formatOdgovor
    };
  }
};
</script>





<style scoped>
.take-quiz-page {
  max-width: 800px;
  margin: auto;
  padding: 2rem;
  background-color: #fefefe;
  border-radius: 10px;
}

.quiz-title {
  text-align: center;
  margin-bottom: 2rem;
  color: #0077b6;
}

.question-card {
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid #d6e9f8;
  border-radius: 10px;
  background-color: #f0f9ff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.question-text {
  font-weight: bold;
  margin-bottom: 1rem;
}

.results {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}
</style>
