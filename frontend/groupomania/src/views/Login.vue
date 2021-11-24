<template>
    <div>
        <HeaderLogin/>
        <FormSpace 
            welcome="Ravi de vous revoir!" 
            linkTo="Pas encore inscrit? C\'est par ici!" 
            link="/signup">
        <FormLogin />
        </FormSpace>
    </div>
</template>

<script>
import HeaderLogin from '../components/HeaderLogin.vue'
import FormLogin from '../components/FormLogin.vue'
import FormSpace from '../components/FormSpace.vue'

export default {
    name: 'Login',
    components: { 
        FormLogin,
        FormSpace,
        HeaderLogin
    }
}
</script>

<style>
FormSpace {
    width: 75%;
}
</style>