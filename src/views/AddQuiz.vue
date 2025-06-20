<template>
  <div class="add-quiz-page">
    <h2>Dodaj novi kviz</h2>

    <input v-model="quizTitle" type="text" placeholder="Naziv kviza" class="input-title" />

    <div v-for="(pitanje, index) in pitanja" :key="index" class="pitanje-blok">
      <input v-model="pitanje.tekst" type="text" placeholder="Unesi pitanje" class="input-question" />

      <div
        v-for="(odgovor, i) in pitanje.odgovori"
        :key="i"
        class="odgovor-red"
      >
        <input
          v-model="pitanje.odgovori[i]"
          type="text"
          placeholder="Odgovor"
          class="input-odgovor"
        />
        <label>
          <input
            type="checkbox"
            :value="odgovor"
            v-model="pitanje.tocniOdgovori"
          />
          Točan
        </label>
        <button class="btn-remove" @click="ukloniOdgovor(index, i)">×</button>
      </div>

      <button class="btn-secondary" @click="dodajOdgovor(index)">+ Dodaj odgovor</button>
      <button class="btn-remove-pitanje" @click="ukloniPitanje(index)">Ukloni pitanje</button>
    </div>

    <button class="btn-secondary" @click="dodajPitanje">+ Dodaj pitanje</button>
    <button class="btn-primary" @click="spremiKviz">Spremi kviz</button>

    <p v-if="poruka" class="poruka">{{ poruka }}</p>
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';

export default {
  name: 'AddQuiz',
  setup() {
    const quizTitle = ref('');
    const pitanja = ref([
      {
        tekst: '',
        odgovori: [''],
        tocniOdgovori: [],
      },
    ]);
    const poruka = ref('');

    const dodajPitanje = () => {
      pitanja.value.push({
        tekst: '',
        odgovori: [''],
        tocniOdgovori: [],
      });
    };

    const dodajOdgovor = (index) => {
      pitanja.value[index].odgovori.push('');
    };

    const ukloniOdgovor = (pitanjeIndex, odgovorIndex) => {
      const p = pitanja.value[pitanjeIndex];
      const odgovor = p.odgovori[odgovorIndex];
      p.odgovori.splice(odgovorIndex, 1);
      p.tocniOdgovori = p.tocniOdgovori.filter(o => o !== odgovor);
    };

    const ukloniPitanje = (index) => {
      pitanja.value.splice(index, 1);
    };

    const spremiKviz = async () => {
      const formatiranKviz = {
        naziv: quizTitle.value,
        pitanja: pitanja.value.map(p => ({
          question: p.tekst,
          options: p.odgovori,
          correct: [...p.tocniOdgovori],
        }))
      };

      try {
        await axios.post('http://localhost:3001/quizzes', formatiranKviz);
        poruka.value = 'Kviz uspješno spremljen!';
        quizTitle.value = '';
        pitanja.value = [
          {
            tekst: '',
            odgovori: [''],
            tocniOdgovori: [],
          },
        ];
      } catch (err) {
        poruka.value = 'Greška pri spremanju kviza.';
        console.error(err);
      }
    };

    return {
      quizTitle, pitanja, poruka,
      dodajPitanje, dodajOdgovor,
      ukloniOdgovor, ukloniPitanje,
      spremiKviz
    };
  },
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
