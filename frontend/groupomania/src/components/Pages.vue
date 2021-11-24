<template>
    <div>
        <button v-if="something">
            <img src="../assets/arrow-circle-left-solid.svg" alt="Icone de flèche vers la gauche"/>
            <p>Page précèdente</p>
        </button>
        <button v-if="something">
            <img src="../assets/arrow-circle-right-solid.svg" alt="Icone de flèche vers la droite"/>
            <p>Page suivante</p>
        </button>
    </div>
</template>

<script>
export default {
    name: 'Pages'
}
</script>

<style>

</style>