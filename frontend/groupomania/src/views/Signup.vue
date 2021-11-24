<template>
    <div>
        <HeaderLogin />
        <FormSpace
            welcome="Bienvenue!"
            linkTo="Déjà inscrit? C\'est par ici!"
            link="/login">
            <FormSignup/>
        </FormSpace>
    </div>
</template>

<script>
import FormSignup from '../components/FormSignup.vue'
import FormSpace from '../components/FormSpace.vue'
import HeaderLogin from '../components/HeaderLogin'

export default {
    name: 'Signup',
    components: {
        HeaderLogin,
        FormSignup,
        FormSpace
    }
}
</script>

<style>
FormSpace {
    width: 75%;
}
</style>