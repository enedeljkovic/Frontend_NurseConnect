<template>
  <div class="subject-materials">
    <router-link to="/materials" class="back-button">← Natrag na predmete</router-link>
    <h2 class="section-title">Materijali za predmet: {{ subject }}</h2>

    <div v-if="isProfesor">
      <form @submit.prevent="dodajMaterijal" class="material-form">
        <h3>Dodaj novi materijal</h3>
        <input v-model="naziv" type="text" placeholder="Naziv materijala" required />
        <textarea v-model="opis" placeholder="Opis materijala" required></textarea>
        <input v-model="imageUrl" type="text" placeholder="URL slike (opcionalno)" />
        <input type="file" @change="handleFileUpload" accept=".pdf,.doc,.docx" />
        <button type="submit">Dodaj materijal</button>
        <p v-if="fileUrl" class="upload-info">
          📎 Datoteka spremljena: <a :href="fileUrl" target="_blank">Preuzmi</a>
        </p>
      </form>
    </div>

    <div v-else class="not-allowed">
      
    </div>

    <div v-if="materijali.length === 0" class="no-materials">
      Trenutno nema materijala za ovaj predmet.
    </div>

    <ul v-else class="material-list">
      <li v-for="material in materijali" :key="material.id" class="material-item">
        <h3>{{ material.naziv }}</h3>
        <p>{{ material.opis }}</p>
        <img v-if="material.imageUrl" :src="material.imageUrl" class="material-image" />
        <a v-if="material.fileUrl" :href="material.fileUrl" target="_blank" class="material-download">
          📄 Preuzmi datoteku
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'SubjectMaterials',
  setup() {
    const route = useRoute();
    const subject = ref(decodeURIComponent(route.params.predmet));
    const materijali = ref([]);
    const naziv = ref('');
    const opis = ref('');
    const imageUrl = ref('');
    const file = ref(null);
    const fileUrl = ref('');
    const isProfesor = ref(localStorage.getItem('isProfesor') === 'true');

    const fetchMaterijali = async () => {
      try {
        const res = await axios.get('http://localhost:3001/materials');
        materijali.value = res.data.filter(m => m.subject === subject.value);
      } catch (err) {
        console.error('❌ Greška pri dohvaćanju materijala:', err);
      }
    };

    const handleFileUpload = async (event) => {
      file.value = event.target.files[0];
      if (!file.value) return;
      const formData = new FormData();
      formData.append('file', file.value);
      try {
        const res = await axios.post('http://localhost:3001/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        fileUrl.value = res.data.fileUrl;
      } catch (err) {
        console.error('❌ Greška pri uploadu datoteke:', err);
      }
    };

    const dodajMaterijal = async () => {
      try {
        await axios.post('http://localhost:3001/materials', {
          naziv: naziv.value,
          opis: opis.value,
          imageUrl: imageUrl.value || null,
          fileUrl: fileUrl.value || null,
          subject: subject.value
        });
        naziv.value = '';
        opis.value = '';
        imageUrl.value = '';
        file.value = null;
        fileUrl.value = '';
        await fetchMaterijali();
      } catch (err) {
        console.error('❌ Greška pri dodavanju materijala:', err);
      }
    };

    onMounted(fetchMaterijali);

    return {
      subject,
      materijali,
      naziv,
      opis,
      imageUrl,
      fileUrl,
      isProfesor,
      handleFileUpload,
      dodajMaterijal
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
