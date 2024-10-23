<template>
  <div class="fr-container">
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

definePageMeta({ middleware: ['guest'] });

const email = ref('')
const password = ref('')

const token = useToken();
const localePath = useLocalePath()

async function send() {
  // The login page is protected by CSRF (unlike the API), so we need to fetch a CSRF
  // token before making a login request. We could disable this protection inside the
  // backend (but not sure about the security of this change).
  const csrfResponse = await $api<{ response: { csrf_token: string }}>('/en/login', {
    credentials: 'include',
  })
  const csrfToken = csrfResponse.response.csrf_token

  const response = await $api<{ response: { user: { authentication_token: string }}}>('/en/login?include_auth_token=true', {
    method: 'POST',
    body: JSON.stringify({ email: email.value, password: password.value }),
    headers: { 'X-CSRF-Token': csrfToken },
    credentials: 'include',
  })
  // token.value = response.response.user.authentication_token

  await loadMe(me)
  await navigateTo(localePath('/newadmin'))
}
</script>
