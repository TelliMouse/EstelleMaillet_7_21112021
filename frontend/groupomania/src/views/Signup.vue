<template>
    <div>
        <HeaderLogin />
        <FormSignup/>
    </div>
</template>

<script>
import FormSignup from '../components/FormSignup.vue'
import HeaderLogin from '../components/HeaderLogin'

export default {
    name: 'Signup',
    components: {
        HeaderLogin,
        FormSignup,
    }
}
</script>

<style>
FormSpace {
    width: 75%;
}
</style>