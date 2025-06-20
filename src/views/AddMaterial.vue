<template>
  <div class="add-material">
    <h2>Dodaj novi materijal</h2>

    <form @submit.prevent="dodajMaterijal" class="material-form">
      <input v-model="naziv" type="text" placeholder="Naziv materijala" required />
      <textarea v-model="opis" placeholder="Opis materijala" required></textarea>
      <input v-model="imageUrl" type="text" placeholder="URL slike (opcionalno)" />

      <select v-model="subject" required>
        <option disabled value="">Odaberi predmet</option>
        <option v-for="predmet in predmeti" :key="predmet" :value="predmet">
          {{ predmet }}
        </option>
      </select>

      <input type="file" @change="handleFileUpload" accept=".pdf,.doc,.docx" />

      <button type="submit">Dodaj materijal</button>

      <p v-if="fileUrl" class="upload-info">
        📎 Datoteka spremljena: <a :href="fileUrl" target="_blank">Preuzmi</a>
      </p>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';

export default {
  name: 'AddMaterial',
  setup() {
    const naziv = ref('');
    const opis = ref('');
    const imageUrl = ref('');
    const subject = ref('');
    const file = ref(null);
    const fileUrl = ref('');

    const predmeti = [
      'Psihologija',
      'Načela poučavanja',
      'Etika u sestrinstvu',
      'Anatomija i fiziologija',
      'Bakteriologija, virologija i parazitologija',
      'Biokemija',
      'Opća načela zdravlja i njege',
      'Zdravstvena njega - opća',
      'Zdravstvena njega zdravog djeteta i adolescenta',
      'Osnove fizikalne i radne terapije (izborni)',
      'Profesionalna komunikacija u sestrinstvu (izborni)',
      'Sat razrednika'
    ];

    const handleFileUpload = async (event) => {
      file.value = event.target.files[0];
      if (!file.value) return;

      const formData = new FormData();
      formData.append('file', file.value);

      try {
        const response = await axios.post('http://localhost:3001/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
        fileUrl.value = response.data.fileUrl;
      } catch (error) {
        console.error('Greška pri uploadu datoteke:', error);
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
        subject.value = '';

        alert('Materijal uspješno dodan!');
      } catch (err) {
        console.error('Greška pri dodavanju materijala:', err);
      }
    };

    return {
      naziv,
      opis,
      imageUrl,
      subject,
      file,
      fileUrl,
      predmeti,
      handleFileUpload,
      dodajMaterijal
    };
  }
};
</script>

<style scoped>
.add-material {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #cce;
  border-radius: 1rem;
  background-color: #fefefe;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.material-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.material-form input,
.material-form textarea,
.material-form select {
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

.upload-info {
  font-size: 0.9rem;
  margin-top: 1rem;
  color: #444;
}
</style>
