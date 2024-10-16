<template>
  <div>
    <form @submit="send">
      <input type="email">
      <input type="password">
      <button type="submit">
        send
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
const email = ref('')
const password = ref('')
async function send() {
  const response = await fetch('http://dev.local:7000/login', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
  })
  console.log(await response.json())
}
</script>
