<template>
  <div class="fr-container">
    <form @submit.prevent="sendAxios" class="space-y-4 py-8">
      <div>
        <label class="fr-label" for="email">Email</label>
        <input class="fr-input" type="email" id="email" name="email" v-model="email">
      </div>
      <div>
        <label class="fr-label" for="password">Password</label>
        <input class="fr-input" type="password" id="password" name="password" v-model="password">
      </div>
      <button type="submit" class="fr-btn">
        send
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { reloadAuth } from '~/utils/auth';

const email = ref('')
const password = ref('')

async function send() {
  const csrfResponse = await fetch('http://dev.local:7000/en/login', {
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    credentials: 'include',
  })
  const csrf = (await csrfResponse.json()).response.csrf_token;

  console.log(csrf, csrfResponse.headers)

  const response = await fetch('http://dev.local:7000/en/login', {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
  })
  console.log(await response.json())
}

async function sendAxios() {
  const csrfResponse = await axios.get('http://dev.local:7000/en/login')

  const csrf = csrfResponse.data.response.csrf_token;

  const response = await axios.post('http://dev.local:7000/en/login', {
    email: email.value,
    password: password.value,
  }, {
    params: {
      include_auth_token: true,
    },
    headers: {
      'X-CSRF-Token': csrf,
    },
  })
  console.log(response.data)

  reloadAuth()
}
</script>
