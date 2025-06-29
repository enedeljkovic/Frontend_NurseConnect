<template>
  <div class="statistika-container">
    <h2>📊 Detaljna statistika kvizova</h2>

    <div v-for="quiz in kvizovi" :key="quiz.id" class="quiz-card">
      <h3>{{ quiz.naziv }} ({{ quiz.razred }})</h3>
      <p><strong>Ukupno pokušaja:</strong> {{ quiz.pokusaji.length }}</p>
      <p><strong>Prosjek točnosti:</strong> {{ quiz.prosjek }}%</p>

      <table v-if="quiz.pokusaji.length > 0">
        <thead>
          <tr>
            <th>Ime učenika</th>
            <th>Točno</th>
            <th>Netočno</th>
            <th>Datum</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pokusaj in quiz.pokusaji" :key="pokusaj.id">
            <td>{{ pokusaj.student.ime }} {{ pokusaj.student.prezime }}</td>
            <td>{{ pokusaj.correct }}</td>
            <td>{{ pokusaj.total - pokusaj.correct }}</td>
            <td>{{ new Date(pokusaj.solvedAt).toLocaleDateString() }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else>Nema riješenih pokušaja.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const user = JSON.parse(localStorage.getItem('user') || '{}');
const kvizovi = ref([]);

onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:3001/profesori/${user.id}/quiz-statistics`);
    const summary = res.data;

    // Dohvati detalje za svaki kviz
    const detalji = await Promise.all(
      summary.map(async (kviz) => {
        const detaljiRes = await axios.get(`http://localhost:3001/api/v1/quiz/${kviz.id}/detalji`);
        return {
          ...kviz,
          pokusaji: detaljiRes.data.pokusaji || []
        };
      })
    );

    kvizovi.value = detalji;
  } catch (err) {
    console.error('Greška pri dohvaćanju detaljne statistike:', err);
  }
});
</script>

<style scoped>
.statistika-container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
  background: #f9fdfc;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.quiz-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
}

.quiz-card h3 {
  margin-bottom: 0.5rem;
  color: #0077B6;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th, td {
  padding: 0.6rem;
  border: 1px solid #ddd;
  text-align: left;
}

th {
  background-color: #f0f0f0;
}
</style>
