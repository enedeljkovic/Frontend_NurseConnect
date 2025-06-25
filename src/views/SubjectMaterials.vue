<template>
  <div class="container my-5">
    <router-link to="/materials" class="btn btn-outline-secondary mb-4">⬅ Natrag na predmete</router-link>
    <h2 class="text-primary mb-4">Materijali za predmet: {{ predmet }}</h2>

    <!-- Gumb za dodavanje materijala -->
    <div class="d-flex justify-content-end mb-3">
      <button
        v-if="isProfesor && predajePredmet"
        class="btn btn-primary"
        @click="goToAddMaterial"
      >
        + Dodaj materijal
      </button>
    </div>

    <div v-if="materijali.length === 0" class="alert alert-warning text-center">
      📭 Nema materijala za ovaj predmet.
    </div>

    <div v-else class="row g-4">
      <div v-for="material in materijali" :key="material.id" class="col-md-6">
        <div class="card shadow-sm h-100">
          <div class="card-body">
            <h5 class="card-title">{{ material.naziv }}</h5>
            <p class="card-text">{{ material.opis }}</p>
            <a v-if="material.fileUrl" :href="material.fileUrl" target="_blank" class="btn btn-sm btn-outline-primary">📎 Preuzmi datoteku</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'SubjectMaterials',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const predmet = decodeURIComponent(route.params.predmet);
    const materijali = ref([]);
    const isProfesor = ref(localStorage.getItem('isProfesor') === 'true');
    const predajePredmet = ref(false);

    const fetchMaterijali = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/materials`);
        materijali.value = res.data.filter(m => m.subject === predmet);
      } catch (err) {
        console.error('Greška pri dohvaćanju materijala:', err);
      }
    };

    const checkDozvola = async () => {
      if (!isProfesor.value) return;

      const user = JSON.parse(localStorage.getItem('user'));
      try {
        const res = await axios.get(`http://localhost:3001/profesori/${user.id}`);
        const predmeti = res.data.Subjects.map(s => s.naziv);
        predajePredmet.value = predmeti.includes(predmet);
      } catch (err) {
        console.error('Greška pri provjeri dozvole:', err);
      }
    };

    const goToAddMaterial = () => {
      router.push({ name: 'AddMaterial', query: { predmet } });
    };

    onMounted(() => {
      fetchMaterijali();
      checkDozvola();
    });

    return {
      predmet,
      materijali,
      isProfesor,
      predajePredmet,
      goToAddMaterial
    };
  }
};
</script>


<style scoped>
.subject-materials {
  max-width: 850px;
  margin: 2rem auto;
  padding: 1rem;
}
.back-button {
  display: inline-block;
  margin-bottom: 1rem;
  color: #0077B6;
  text-decoration: none;
  font-weight: 500;
}
.back-button:hover {
  text-decoration: underline;
}
.section-title {
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #333;
}
.material-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  border: 1px solid #cce;
  padding: 1rem;
  border-radius: 0.8rem;
  background-color: #fefefe;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}
.material-form h3 {
  margin: 0;
  color: #0077B6;
}
.material-form input,
.material-form textarea {
  padding: 0.6rem;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
}
.material-form button {
  padding: 0.6rem;
  background-color: #0077B6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}
.material-form button:hover {
  background-color: #005f8a;
}
.material-list {
  list-style-type: none;
  padding: 0;
}
.material-item {
  background-color: #f1fefc;
  border: 1px solid #cce;
  border-radius: 0.8rem;
  padding: 1rem;
  margin-bottom: 1rem;
}
.material-image {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 0.5rem;
  margin-top: 0.5rem;
}
.material-download {
  display: inline-block;
  margin-top: 0.5rem;
  color: #0077B6;
  font-weight: 500;
  text-decoration: none;
}
.material-download:hover {
  text-decoration: underline;
}
.upload-info {
  font-size: 0.9rem;
  color: #444;
}
.no-materials {
  color: #666;
  font-style: italic;
  margin-top: 1rem;
}
.not-allowed {
  text-align: center;
  color: #888;
  margin: 1rem 0 2rem;
}
</style>
