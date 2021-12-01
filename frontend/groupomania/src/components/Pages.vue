<template>
    <div>
        <div v-if="isThereAPreviousPage">
            <router-link to="/posts">
                <img src="../assets/fast-backward-solid.svg" alt="Icone double flèche vers la gauche" />
                <p>Première page</p>
            </router-link>
            <router-link to="{{ previousPageLink }}">
                <img src="../assets/arrow-circle-left-solid.svg" alt="Icone de flèche vers la gauche"/>
                <p>Page précèdente</p>
            </router-link>
        </div>
        <div  v-if="isThereANextPage">
            <router-link to="{{ nextPageLink }}">
                <img src="../assets/arrow-circle-right-solid.svg" alt="Icone de flèche vers la droite"/>
                <p>Page suivante</p>
            </router-link>
            <router-link to="{{ lastPageLink }}">
                <img src="../assets/fast-forward-solid.svg" alt="Icon double flèche vers la droite" />
                <p>Dernière page</p>
            </router-link>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'Pages',
    data() {
        return {
            currentPage: this.getCurrentPage(),
            previousPageLink: this.getPreviousPageLink(),
            nextPageLink: this.getNextPageLink(),
            lastPageLink: this.getLastPageLink()
        }
    },
    computed: {
        ...mapState(['numberOfPages'])
    },
    methods: {
        getCurrentPage() {
            const url = window.location.href;
            const urlParams = new URLSearchParams(url);

            if(!urlParams.get('page')) {
                return 1;
            } else {
                return parseInt(urlParams.get('page'), 10);
            }
        },
        getPreviousPageLink() {
            const param = this.currentPage - 1;
            return `/posts?page=${param}`;
        },
        getNextPageLink() {
            const param = this.currentPage + 1;
            return `/posts?page=${param}`;
        }   ,
        getLastPageLink() {
            const param = this.numberOfPages;
            return `/posts?page=${param}`;
        },
        isThereAPreviousPage() {
            if(this.currentPage > 1) {
                return true;
            } else {
                return false;
            }
        },
        isThereANextPage() {
            if(this.currentPage < this.numberOfPages) {
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