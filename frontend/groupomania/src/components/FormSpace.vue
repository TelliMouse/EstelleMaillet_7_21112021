<template>
    <div class="form-space">
        <h1>{{ welcome }}</h1>
        <slot></slot>
        <router-link to="{{ link }}"><p>{{ linkTo }}</p></router-link>
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
.form-space {
    background-color: #BBC8CA;
}
</style>
