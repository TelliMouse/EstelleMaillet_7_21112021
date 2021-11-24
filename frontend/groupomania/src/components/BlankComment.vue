<template>
    <div>
        <h3>{{ userName }}</h3>
        <label for="text">Votre commentaire:</label>
        <textarea name="text" id="comment" cols="30" rows="10"></textarea>
        <button>Publier</button>
    </div>
</template>

<script>
export default {
    name: 'BlankComment'
}
</script>

<style>

</style>