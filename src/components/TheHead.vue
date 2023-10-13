<script lang="ts" setup>
import { availableLocales, loadLanguageAsync } from '~/modules/i18n'

const { t, locale } = useI18n()
const router = useRouter()

async function toggleLocales() {
  // change to some real logic
  const locales = availableLocales
  const newLocale = locales[(locales.indexOf(locale.value) + 1) % locales.length]
  await loadLanguageAsync(newLocale)
  locale.value = newLocale
}

function login() {
  router.push('/login/login')
}
</script>

<template>
  <div h-14 w-full flex flex-items-center border px-8>
    <div>OceanBlog</div>
    <div ml-auto>
      <button icon-btn :title="t('button.toggle_dark')" @click="toggleDark()">
        <div i="carbon-sun dark:carbon-moon" />
      </button>
      <n-button quaternary type="tertiary" @click="login">
        登录
      </n-button>
    </div>
  </div>
</template>
