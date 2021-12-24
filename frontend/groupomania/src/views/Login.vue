<template>
    <div class="login">
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

<style lang="scss">
div.login {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>