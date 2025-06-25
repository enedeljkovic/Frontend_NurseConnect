<template>
  <div class="container my-5">
    <div v-if="quiz" class="card shadow p-4">
      <h2 class="mb-4 text-primary">{{ quiz.naziv }}</h2>

      <form @submit.prevent="submitAnswers">
        <div v-for="(pitanje, index) in quiz.pitanja" :key="index" class="mb-4 border rounded p-3">
          <p class="fw-bold">
            {{ index + 1 }}.
            <span v-if="pitanje.type !== 'image'">{{ pitanje.question }}</span>
            <span v-else>Pitanje sa slikom</span>
          </p>

          <div v-if="pitanje.type === 'image' && pitanje.image" class="mb-3">
            <img :src="pitanje.image" alt="Slika pitanja" class="img-fluid rounded shadow" style="max-width: 400px;" />
          </div>

          <div v-if="pitanje.type === 'multiple' || pitanje.type === 'image'">
            <div v-for="(opcija, i) in pitanje.options" :key="i" class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                :id="`q${index}-o${i}`"
                :value="opcija"
                v-model="odgovori[index]"
              />
              <label class="form-check-label" :for="`q${index}-o${i}`">{{ opcija }}</label>
            </div>
          </div>

          <div v-else-if="pitanje.type === 'truefalse'" class="mb-3">
            <div class="form-check">
              <input class="form-check-input" type="radio" :id="`q${index}-t`" value="T" v-model="odgovori[index]" />
              <label class="form-check-label" :for="`q${index}-t`">Točno</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" :id="`q${index}-n`" value="N" v-model="odgovori[index]" />
              <label class="form-check-label" :for="`q${index}-n`">Netočno</label>
            </div>
          </div>
        </div>

        <button type="submit" class="btn btn-success w-100 mt-3">Pošalji odgovore</button>
      </form>

      <div v-if="rezultat.length" class="mt-5">
        <h4 class="text-info">Rezultati:</h4>
        <ul class="list-group mt-3">
          <li
            v-for="(tocno, i) in rezultat"
            :key="i"
            class="list-group-item d-flex justify-content-between"
            :class="tocno ? 'list-group-item-success' : 'list-group-item-danger'"
          >
            <span>Pitanje {{ i + 1 }}</span>
            <strong>{{ tocno ? 'Točno' : 'Netočno' }}</strong>
          </li>
        </ul>
        <p class="text-center mt-4 fw-bold">
          ✅ Točno odgovoreno: {{ brojTocnih }}/{{ rezultat.length }} ({{ postotak }}%)
        </p>
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
    const quiz = ref(null);
    const odgovori = ref([]);
    const rezultat = ref([]);
    const quizId = Number(route.params.id);

    const fetchQuiz = async () => {
      try {
        if (!quizId || isNaN(quizId)) {
          console.error('Nevažeći ID kviza');
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
      try {
        const student = JSON.parse(localStorage.getItem('user'));
        if (!quizId || isNaN(quizId)) {
          console.error('Nevažeći ID kviza u submitu');
          return;
        }
        const res = await axios.post(`http://localhost:3001/quizzes/${quizId}/check-answers`, {
          odgovori: odgovori.value,
          studentId: student.id
        });
        rezultat.value = res.data.rezultat;
      } catch (err) {
        console.error('Greška pri slanju odgovora:', err);
      }
    };

    const brojTocnih = computed(() => rezultat.value.filter(r => r === true).length);
    const postotak = computed(() =>
      rezultat.value.length
        ? Math.round((brojTocnih.value / rezultat.value.length) * 100)
        : 0
    );

    onMounted(fetchQuiz);

    return {
      quiz,
      odgovori,
      rezultat,
      brojTocnih,
      postotak,
      submitAnswers
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
