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
import { mapState } from 'vuex'

export default {
    name: 'Pages',
    computed: {
        ...mapState(['numberOfPages'])
    },
    methods: {
        isThereAPreviousPage() {
            const url = window.location.href;
            const urlParams = new URLSearchParams(url);
            let currentPage;

            if(!urlParams.get('page')) {
                currentPage = 1;
            } else {
                currentPage = parseInt(urlParams.get('page'), 10);
            }

            if(currentPage > 1) {
                return true;
            } else {
                return false;
            }
        },
        isThereANextPage() {
            const url = window.location.href;
            const urlParams = new URLSearchParams(url);
            let currentPage;

            if(!urlParams.get('page')) {
                currentPage = 1;
            } else {
                currentPage = parseInt(urlParams.get('page'), 10);
            }

            if(currentPage < this.numberOfPages) {
                return true;
            } else {
                return false;
            }
        }
    }
}
</script>

<style>

</style>