<template>
    <div>
        <Header/>
        <FormSpace welcome="Ravi de vous revoir!" linkTo="Pas encore inscrit? C\'est par ici!" link="/signup" />
    </div>
</template>

<script>
import Header from '../components/Header.vue'
//import LoginIcons from '../components/LoginIcons.vue'
//import FormLogin from '../components/FormLogin.vue'
import FormSpace from '../components/FormSpace.vue'

export default {
    name: 'Login',
    components: {
        Header, 
        //LoginIcons,
        //FormLogin,
        FormSpace
    }
}
</script>

<style>
FormSpace {
    width: 75%;
}
</style>