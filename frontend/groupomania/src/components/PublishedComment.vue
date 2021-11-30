<template>
    <div>
        <h3>{{ userName }}</h3>
        <textarea name="textarea" rows="5" cols="30" readonly v-model="comment"></textarea>
        <div>
            <div>
                <button><img src="../assets/thumbs-up-solid.svg" alt="Icone de like"/> {{ likeNumber }}</button>
                <button><img src="../assets/thumbs-down-solid.svg" alt="Icon de dislike"/> {{ dislikeNumber }}</button>
            </div>
            <p>{{ date }}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PublishedComment',
    props: {
        userName: String,
        propComment: String,
        likeNumber: Number,
        dislikeNumber: Number,
        date: String
    },
    data() {
        return {
            comment: this.propComment
        }
    }
}
</script>

<style>

</style>