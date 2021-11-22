<template>
    <div class="form-space">
        <h1>{{ Welcome }}</h1>
        <div>
            <label for="email">Email:</label>
            <input type="email" name="email">
            <label for="password">Mot-de-passe:</label>
            <input type="password" name="password">
        </div>
        <router-link to="{{ link }}"><p>{{ LinkTo }}</p></router-link>
        <router-view/>
    </div>    
</template>

<script>

export default {
    name: "FormSpace",
    props: {
        welcome: {
            type: String
        },
        linkTo: {
            type: String
        },
        link: {
            type: String
        }
    }
}
</script>

<style>
.formspace {
    background-color: #BBC8CA;
}
</style>
