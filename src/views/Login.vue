<template>
  <div class="login-page">
    <div class="login-box">
      <h1>NurseConnect</h1>
      <p class="tagline">Igram se i učim</p>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input v-model="email" type="email" id="email" placeholder="Unesi email" required />
        </div>

        <div class="form-group">
          <label for="kod">Kod</label>
          <input v-model="kod" type="text" id="kod" placeholder="Unesi kod" required />
        </div>

        <button type="submit">Prijavi se</button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>

      <p class="switch-mode" @click="toggleMode">
        {{ isProfesor ? 'Prijava kao učenik' : 'Prijava kao profesor' }}
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

export default {
  name: 'Login',
  setup() {
    const email = ref('');
    const kod = ref('');
    const error = ref('');
    const isProfesor = ref(false);
    const router = useRouter();

    const handleLogin = async () => {
      error.value = '';
      try {
        const url = isProfesor.value ? 'http://localhost:3001/login-profesor' : 'http://localhost:3001/login';
        const response = await axios.post(url, { kod: kod.value });

        const korisnik = isProfesor.value ? response.data.profesor : response.data.student;

        if (korisnik.email !== email.value) {
          error.value = 'Email i kod se ne podudaraju.';
          return;
        }

        localStorage.setItem('user', JSON.stringify(korisnik));
        localStorage.setItem('isProfesor', isProfesor.value.toString());
        router.push('/home');
      } catch (err) {
        error.value = err.response?.data?.error || 'Greška prilikom prijave.';
      }
    };

    const toggleMode = () => {
      isProfesor.value = !isProfesor.value;
    };

    return { email, kod, handleLogin, error, isProfesor, toggleMode };
  }
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #e0f7fa;
}

.login-box {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  width: 320px;
  text-align: center;
}

.login-box h1 {
  margin-bottom: 0.2rem;
  color: #0077B6;
}

.tagline {
  color: #3B9A57;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 0.3rem;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
}

button {
  background-color: #0077B6;
  color: white;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 0.5rem;
  width: 100%;
  font-size: 1rem;
  cursor: pointer;
}

button:hover {
  background-color: #005f8a;
}

.error {
  margin-top: 1rem;
  color: red;
}

.switch-mode {
  margin-top: 1rem;
  color: #0077B6;
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: underline;
}
</style>
