<template>
  <div class="home-container">
    <header class="home-header">
      <h1>NurseConnect</h1>
      <p class="tagline">Igram se i učim</p>
    </header>

    <section class="cards-section">
      <div
        class="card"
        v-for="(card, index) in prikazaneKartice"
        :key="index"
        @click="goTo(card.route)"
      >
        <i :class="card.icon"></i>
        <span>{{ card.label }}</span>
      </div>
    </section>

    <!-- UČENIK: Napredak -->
    <section v-if="!isProfesor" class="progress-section">
      <h2>Napredak</h2>

      <div class="progress-block">
        <p><strong>Materijali:</strong> {{ procentMaterijala }}%</p>
        <div class="progress-bar">
          <div class="bar-fill" :style="{ width: procentMaterijala + '%' }"></div>
        </div>
        <p class="small">{{ procitaniMaterijali.length }} / {{ sviMaterijali.length }} pročitano</p>
      </div>

      <div class="progress-block">
        <p><strong>Kvizovi:</strong> {{ procentKvizova }}%</p>
        <div class="progress-bar">
          <div class="bar-fill" :style="{ width: procentKvizova + '%' }"></div>
        </div>
        <p class="small">{{ rijeseniKvizovi.length }} / {{ sviKvizovi.length }} riješeno</p>
      </div>
    </section>

    <!-- PROFESOR: Kratka statistika kvizova -->
    <section v-if="isProfesor" class="profesor-statistika">
      <h2>Pregled statistike kvizova</h2>
      <p><strong>Ukupno dodanih kvizova:</strong> {{ brojKvizova }}</p>
      <p><strong>Ukupno riješenih pokušaja:</strong> {{ brojPokusaja }}</p>
      <p><strong>Prosječna uspješnost:</strong> {{ prosjek }}%</p>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const goTo = (page) => router.push(`/${page}`);

const isProfesor = localStorage.getItem('isProfesor') === 'true';
const user = JSON.parse(localStorage.getItem('user') || '{}');
const mojRazred = user.razred;

// Napredak - učenik
const sviMaterijali = ref([]);
const sviKvizovi = ref([]);
const procitaniMaterijali = ref([]);
const rijeseniKvizovi = ref([]);
const procentMaterijala = ref(0);
const procentKvizova = ref(0);

// Statistika - profesor
const brojKvizova = ref(0);
const brojPokusaja = ref(0);
const prosjek = ref(0);

// Kartice
const karticeUcenik = [
  { label: 'Profil', route: 'profile', icon: 'fas fa-user' },
  { label: 'Materijali', route: 'materials', icon: 'fas fa-book' },
  { label: 'Kvizovi', route: 'quizzes', icon: 'fas fa-question-circle' }
];

const karticeProfesor = [
  { label: 'Profil', route: 'profile', icon: 'fas fa-user' },
  { label: 'Materijali', route: 'materials', icon: 'fas fa-book' },
  { label: 'Kvizovi', route: 'quizzes', icon: 'fas fa-question-circle' },
  { label: 'Statistika kvizova', route: 'quiz-statistics', icon: 'fas fa-chart-bar' },
  { label: 'Chat s profesorima', route: 'chat', icon: 'fas fa-comments' }
];

const prikazaneKartice = isProfesor ? karticeProfesor : karticeUcenik;

onMounted(async () => {
  if (!isProfesor) {
    try {
      const [resMat, resKviz] = await Promise.all([
        axios.get('http://localhost:3001/materials'),
        axios.get('http://localhost:3001/quizzes')
      ]);

      sviMaterijali.value = resMat.data.filter((m) => m.razred === mojRazred);
      sviKvizovi.value = resKviz.data.filter((k) => k.razred === mojRazred);

      procitaniMaterijali.value = JSON.parse(localStorage.getItem('readMaterials') || '[]');
      rijeseniKvizovi.value = JSON.parse(localStorage.getItem('completedQuizzes') || '[]');

      procentMaterijala.value = sviMaterijali.value.length
        ? Math.round((procitaniMaterijali.value.length / sviMaterijali.value.length) * 100)
        : 0;

      procentKvizova.value = sviKvizovi.value.length
        ? Math.round((rijeseniKvizovi.value.length / sviKvizovi.value.length) * 100)
        : 0;
    } catch (err) {
      console.error('Greška pri dohvaćanju napretka:', err);
    }
  } else {
    try {
      const resStat = await axios.get(`http://localhost:3001/profesori/${user.id}/quiz-statistics`);
      brojKvizova.value = resStat.data.totalQuizzes;
      brojPokusaja.value = resStat.data.totalAttempts;
      prosjek.value = resStat.data.averageScore;
    } catch (err) {
      console.error('Greška pri dohvaćanju statistike kvizova:', err);
    }
  }
});
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
  background: linear-gradient(135deg, #e0f7fa, #f1fdf5);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.home-header {
  text-align: center;
  margin-bottom: 2rem;
}

.home-header h1 {
  color: #0077B6;
  font-size: 2.5rem;
  margin-bottom: 0.3rem;
}

.tagline {
  color: #3B9A57;
  font-size: 1.2rem;
}

.cards-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  width: 100%;
}

.card {
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 1rem;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.card:hover {
  background-color: #e0f7fa;
  transform: scale(1.03);
}

.card i {
  font-size: 2rem;
  color: #0077B6;
  margin-bottom: 0.5rem;
}

.card span {
  display: block;
  font-weight: bold;
  color: #333;
}

.progress-section {
  background-color: #ffffff;
  padding: 1rem 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  text-align: center;
  width: 100%;
}

.progress-section h2 {
  color: #0077B6;
  margin-bottom: 1.5rem;
}

.progress-block {
  margin-bottom: 1.5rem;
  text-align: left;
}

.progress-bar {
  height: 16px;
  width: 100%;
  background-color: #eee;
  border-radius: 10px;
  overflow: hidden;
  margin: 0.5rem 0;
}

.bar-fill {
  height: 100%;
  background-color: #3B9A57;
  width: 0%;
  transition: width 0.5s ease-in-out;
}

.small {
  font-size: 0.9rem;
  color: #666;
}
</style>