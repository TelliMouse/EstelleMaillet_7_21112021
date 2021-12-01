<template>
    <div>
        <textarea v-if="textPost" name="textarea" rows="5" cols="30" v-model="post"></textarea>
        <img src="../assets/thumbs-up-solid.svg" />
    </div>
</template>

<script>
export default {
    name: 'Test',
    data() {
        return {
            post: 'Ceci est un test'
        }
    }
}
</script>

<style>
img {
    color: blue
}
</style>