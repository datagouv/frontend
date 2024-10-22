<template>
  <div class="fr-container">
    <span>{{ counter }}</span>

    <form @submit.prevent="send" class="space-y-4 py-8">
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
const { $api } = useNuxtApp()
const me = useMaybeMe();

const counter = useState('counter', () => Math.round(Math.random() * 1000))

onMounted(async () => {
  setInterval(() => {
    counter.value++;
  }, 1000)
  
  if (me.value) {
    await navigateTo('/en/newadmin') // TODO Check why localisation doesn't work?
  }
})

const email = ref('')
const password = ref('')

async function send() {
  // The login page is protected by CSRF (unlike the API), so we need to fetch a CSRF
  // token before making a login request. We could disable this protection inside the
  // backend (but not sure about the security of this change).
  const csrfResponse = await $api<{ response: { csrf_token: string }}>('/en/login')
  const csrfToken = csrfResponse.response.csrf_token

  const response = await $api.raw('/en/login?include_auth_token=true', {
    method: 'POST',
    body: JSON.stringify({ email: email.value, password: password.value }),
    headers: { 'X-CSRF-Token': csrfToken },
  })
  console.log(response)
  console.log(response.headers)

  await refreshMe(me)
}
</script>
