<template>
  <div></div>
</template>

<script>
export default {
  name: 'Home',
  beforeMount() {
    this.$router.push({ path: '/login' });
  }
}
</script>
