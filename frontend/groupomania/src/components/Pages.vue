<template>
    <div>
        <div v-if="isThereAPreviousPage">
            <button>
                <img src="../assets/fast-backward-solid.svg" alt="Icone double flèche vers la gauche" />
                <p>Première page</p>
            </button>
            <button>
                <img src="../assets/arrow-circle-left-solid.svg" alt="Icone de flèche vers la gauche"/>
                <p>Page précèdente</p>
            </button>
        </div>
        <div  v-if="isThereANextPage">
            <button>
                <img src="../assets/arrow-circle-right-solid.svg" alt="Icone de flèche vers la droite"/>
                <p>Page suivante</p>
            </button>
            <button>
                <img src="../assets/fast-forward-solid.svg" alt="Icon double flèche vers la droite" />
                <p>Dernière page</p>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Pages'
}
</script>

<style>

</style>