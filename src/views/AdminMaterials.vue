<template>
  <div class="container my-5">
    <h2 class="mb-4 text-center text-primary">📚 Upravljanje materijalima</h2>

    <div v-if="materijali.length === 0" class="alert alert-warning text-center">
      Trenutno nema materijala.
    </div>

    <div class="row g-4" v-else>
      <div class="col-md-6" v-for="material in materijali" :key="material.id">
        <div class="card shadow-sm h-100">
          <div class="card-body">
            <h5 class="card-title">{{ material.naslov }}</h5>
            <p class="card-text"><strong>Predmet:</strong> {{ material.predmet }}</p>
            <p class="card-text">{{ material.opis }}</p>
            <a :href="material.datoteka" target="_blank" class="btn btn-outline-primary btn-sm me-2">
              📄 Otvori datoteku
            </a>
            <button @click="obrisiMaterial(material.id)" class="btn btn-outline-danger btn-sm">🗑 Obriši</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';

export default {
  name: 'AdminMaterials',
  setup() {
    const materijali = ref([]);

    const ucitajMaterijale = async () => {
      try {
        const res = await axios.get('http://localhost:3001/materials');
        materijali.value = res.data;
      } catch (err) {
        console.error('Greška pri dohvaćanju materijala:', err);
      }
    };

    const obrisiMaterial = async (id) => {
      if (confirm('Jeste li sigurni da želite obrisati ovaj materijal?')) {
        try {
          await axios.delete(`http://localhost:3001/materials/${id}`);
          ucitajMaterijale();
        } catch (err) {
          console.error('Greška pri brisanju materijala:', err);
        }
      }
    };

    onMounted(ucitajMaterijale);

    return { materijali, obrisiMaterial };
  }
};
</script>

<style scoped>
.card-title {
  font-size: 1.2rem;
}
</style>