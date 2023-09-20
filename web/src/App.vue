<!-- App.vue -->
<script setup>

</script>

<template>
  <RouterView />
  <Message
    ref="notification"
    placement="topRight"
    :duration="3000"
    :top="24"
  />
</template>
