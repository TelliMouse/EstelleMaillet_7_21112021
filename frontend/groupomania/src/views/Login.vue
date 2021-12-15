<template>
    <div>
        <HeaderLogin/>
        <FormLogin />
    </div>
</template>

<script>
import HeaderLogin from '../components/HeaderLogin.vue'
import FormLogin from '../components/FormLogin.vue'

export default {
    name: 'Login',
    components: { 
        FormLogin,
        HeaderLogin
    }
}
</script>

<style>
</style>