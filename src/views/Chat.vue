<template>
  <div class="container my-5">
    <h2 class="mb-4 text-primary">📬 Chat s profesorima</h2>

    <!-- Odabir primatelja -->
    <div class="mb-3">
      <label class="form-label">Odaberi profesora:</label>
      <select v-model="selectedRecipientId" class="form-select" @change="fetchMessages">
        <option disabled value="">-- Odaberi --</option>
        <option
          v-for="prof in professors"
          :key="prof.id"
          :value="prof.id"
        >
          {{ prof.ime }} {{ prof.prezime }}
          <span v-if="unreadMessages[prof.id]" class="text-danger">({{ unreadMessages[prof.id] }} nova)</span>
        </option>
      </select>
    </div>

    <!-- Poruke -->
    <div class="chat-box border p-3 rounded bg-light mb-3" style="height: 300px; overflow-y: auto;">
      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="{'text-end': msg.senderId === currentUserId}"
      >
        <p class="mb-1">
          <strong>{{ msg.senderId === currentUserId ? 'Vi' : 'On' }}:</strong>
          {{ msg.content }}
        </p>
        <small class="text-muted">{{ formatTimestamp(msg.timestamp) }}</small>
      </div>
    </div>

    <!-- Unos nove poruke -->
    <div class="input-group">
      <input
        v-model="newMessage"
        type="text"
        class="form-control"
        placeholder="Upiši poruku..."
        @keyup.enter="sendMessage"
      />
      <button class="btn btn-primary" @click="sendMessage">Pošalji</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';

export default {
  name: 'Chat',
  setup() {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const currentUserId = currentUser?.id;

    const professors = ref([]);
    const selectedRecipientId = ref('');
    const messages = ref([]);
    const newMessage = ref('');
    const unreadMessages = ref({});

    const fetchProfessors = async () => {
      const res = await axios.get('http://localhost:3001/profesori');
      professors.value = res.data.filter(p => p.id !== currentUserId);
      await fetchUnreadCounts();
    };

    const fetchUnreadCounts = async () => {
      const res = await axios.get(`http://localhost:3001/messages/unread/${currentUserId}`);
      unreadMessages.value = res.data; // primjer: { 3: 2, 5: 1 }
    };

    const fetchMessages = async () => {
      if (!selectedRecipientId.value) return;
      const res = await axios.get(`http://localhost:3001/messages/${currentUserId}/${selectedRecipientId.value}`);
      messages.value = res.data;
      await fetchUnreadCounts(); // osvježi broj nepročitanih
    };

    const sendMessage = async () => {
      if (!newMessage.value.trim() || !selectedRecipientId.value) return;
      await axios.post('http://localhost:3001/messages', {
        senderId: currentUserId,
        receiverId: selectedRecipientId.value,
        content: newMessage.value
      });
      newMessage.value = '';
      fetchMessages();
    };

    const formatTimestamp = (timestamp) => {
      const date = new Date(timestamp);
      return `${date.toLocaleDateString()} u ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };

    onMounted(() => {
      fetchProfessors();
    });

    return {
      currentUserId,
      professors,
      selectedRecipientId,
      messages,
      newMessage,
      fetchMessages,
      sendMessage,
      unreadMessages,
      formatTimestamp
    };
  }
};
</script>

<style scoped>
.chat-box {
  background-color: #f9f9f9;
  max-height: 300px;
  overflow-y: scroll;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #ddd;
}
</style>
