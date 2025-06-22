<template>
  <div class="container my-5">
    <h2 class="mb-4 text-primary">📝 Dodaj novi kviz</h2>

    <form @submit.prevent="spremiKviz">
      <div class="mb-3">
        <label class="form-label">Naziv kviza</label>
        <input v-model="naziv" type="text" class="form-control" placeholder="Npr. Anatomija 1" required />
      </div>

      <div v-for="(pitanje, index) in pitanja" :key="index" class="card mb-4 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">Pitanje {{ index + 1 }}</h5>

          <div class="mb-3">
            <label class="form-label">Vrsta pitanja</label>
            <select v-model="pitanje.type" class="form-select">
              <option value="multiple">Višestruki odabir</option>
              <option value="truefalse">Točno / Netočno</option>
              <option value="image">Pitanje sa slikom</option>
            </select>
          </div>

          <!-- Tekst pitanja (ako nije image) -->
          <div class="mb-3" v-if="pitanje.type !== 'image'">
            <label class="form-label">Tekst pitanja</label>
            <input v-model="pitanje.question" type="text" class="form-control" required />
          </div>

          <!-- Upload slike -->
          <div class="mb-3" v-if="pitanje.type === 'image'">
            <label class="form-label">Dodaj sliku</label>
            <input type="file" accept="image/*" class="form-control" @change="handleImageUpload($event, index)" />
            <div v-if="pitanje.imagePreview" class="mt-2">
              <img :src="pitanje.imagePreview" class="img-thumbnail" style="max-width: 300px;" />
            </div>
          </div>

          <!-- Višestruki odabir -->
          <div v-if="pitanje.type === 'multiple' || pitanje.type === 'image'">
            <label class="form-label">Odgovori</label>
            <div v-for="(opcija, i) in pitanje.options" :key="i" class="input-group mb-2">
              <input v-model="pitanje.options[i]" type="text" class="form-control" />
              <button type="button" class="btn btn-outline-danger" @click="removeOption(index, i)">🗑</button>
            </div>
            <button type="button" class="btn btn-outline-secondary btn-sm mb-2" @click="addOption(index)">+ Dodaj opciju</button>

            <div class="mb-2">
              <label class="form-label">Točni odgovori</label>
              <select v-model="pitanje.correct" multiple class="form-select">
                <option v-for="(opcija, i) in pitanje.options" :key="i" :value="opcija">{{ opcija }}</option>
              </select>
              <small class="text-muted">Možete odabrati više točnih odgovora</small>
            </div>
          </div>

          <!-- True/False -->
          <div v-else-if="pitanje.type === 'truefalse'" class="mb-3">
            <label class="form-label">Točan odgovor</label>
            <div class="form-check">
              <input v-model="pitanje.correct" class="form-check-input" type="radio" :id="'t' + index" value="T" />
              <label class="form-check-label" :for="'t' + index">Točno</label>
            </div>
            <div class="form-check">
              <input v-model="pitanje.correct" class="form-check-input" type="radio" :id="'n' + index" value="N" />
              <label class="form-check-label" :for="'n' + index">Netočno</label>
            </div>
          </div>

          <button type="button" class="btn btn-sm btn-danger mt-3" @click="removePitanje(index)">Ukloni pitanje</button>
        </div>
      </div>

      <button type="button" class="btn btn-outline-primary mt-2" @click="addPitanje">+ Dodaj pitanje</button>
      <button type="submit" class="btn btn-success w-100 mt-4">✅ Spremi kviz</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AddQuiz',
  data() {
    return {
      naziv: '',
      pitanja: []
    };
  },
  methods: {
    addPitanje() {
      this.pitanja.push({
        question: '',
        type: 'multiple',
        options: [''],
        correct: [],
        image: '',
        imagePreview: ''
      });
    },
    removePitanje(index) {
      this.pitanja.splice(index, 1);
    },
    addOption(qIndex) {
      this.pitanja[qIndex].options.push('');
    },
    removeOption(qIndex, oIndex) {
      this.pitanja[qIndex].options.splice(oIndex, 1);
    },
    handleImageUpload(event, index) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.pitanja[index].image = e.target.result;
        this.pitanja[index].imagePreview = e.target.result;
        this.pitanja[index].question = 'Pogledaj sliku i odgovori';
      };
      reader.readAsDataURL(file);
    },
    async spremiKviz() {
      try {
        await axios.post('http://localhost:3001/quizzes', {
          naziv: this.naziv,
          pitanja: this.pitanja
        });
        alert('✅ Kviz uspješno spremljen!');
        this.naziv = '';
        this.pitanja = [];
      } catch (err) {
        console.error('Greška pri spremanju kviza:', err);
        alert('❌ Došlo je do greške.');
      }
    }
  }
};
</script>






<style scoped>
.add-quiz-page {
  max-width: 800px;
  margin: auto;
  padding: 1rem;
}

.input-title {
  width: 100%;
  padding: 0.6rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.pitanje-blok {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f0f9ff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.input-question {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.8rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.odgovor-red {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.input-odgovor {
  flex: 1;
  padding: 0.4rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.btn-primary {
  background-color: #3B9A57;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 1rem;
}

.btn-secondary {
  background-color: #0077B6;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 0.5rem;
  margin-right: 0.5rem;
}

.btn-secondary:hover {
  background-color: #005f8a;
}

.btn-remove,
.btn-remove-pitanje {
  background: #D9534F;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
}

.btn-remove-pitanje {
  margin-top: 0.5rem;
}

.poruka {
  margin-top: 1rem;
  color: green;
  text-align: center;
}
</style>
