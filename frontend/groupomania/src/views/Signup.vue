<template>
    <div class="signup">
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

<style lang="scss">
div.signup {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>