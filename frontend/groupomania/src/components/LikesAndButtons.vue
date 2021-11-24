<template>
    <div>
        <div>
            <div>
                <button><img src="../assets/thumbs-up-solid.svg" alt="Icone de like"/> {{ likeNumber}}</button>
                <button><img src="../assets/thumbs-down-solid.svg" alt="Icon de dislike"/> {{ dislikeNumber }}</button>
            </div>
            <p>{{ date }}</p>
        </div>
        <div>
            <button v-if="something">Modifier</button>
            <button v-if="something">Supprimer</button>
            <input/>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LikesAndButtons',
    props: {
        likeNumber: Number,
        dislikeNumber: Number,
        date: String
    }
}
</script>

<style>

</style>