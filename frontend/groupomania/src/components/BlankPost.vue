<template>
    <div>
        <label for="title">Titre:</label>
        <input name="title" type="text" id="title" />
        <p>Choisissez un type de post:</p>
        <div>
            <input type="radio" id="text" name="post" value="text" />
            <label for="text">Texte</label>
        </div>
        <div>
            <input type="radio" id="image" name="post" value="image" />
            <label for="image">Image</label>
        </div>
        <textarea v-if="textischecked" name="post" id="textPost" cols="30" rows="10" placeholder="Rédigez votre post ici!"></textarea>
        <div v-if="imageischecked">
            <label for="imagePost">Choisissez une image à publier:</label>
            <input type="file" name="image" id="imagePost" accept="image/jpg, image/jpeg, image/png, image/gif, image/bmp, image/webp, image/svg+xml" />
        </div>
        <button>Publier</button>
    </div>
</template>

<script>
export default {
    name: 'BlankPost'
}
</script>

<style>

</style>