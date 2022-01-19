<template>
    <div v-if="loadNumPost">
        <div v-if="existingPreviousPage">
            <router-link to="/posts">
                <fa icon="fast-backward" alt="Icone double flèche vers la gauche" />
                <p>Première page</p>
            </router-link>
            <router-link :to="{ name: 'Posts', query: { page: previousPage } }">
                <fa icon="arrow-circle-left" alt="Icone de flèche vers la gauche"/>
                <p>Page précèdente</p>
            </router-link>
        </div>
        <div  v-if="existingNextPage">
            <router-link :to="{ name: 'Posts', query: { page: nextPage } }">
                <fa icon="arrow-circle-right" alt="Icone de flèche vers la droite"/>
                <p>Page suivante</p>
            </router-link>
            <router-link :to="{ name: 'Posts', query: { page: lastPage } }">
                <fa icon="fast-forward" alt="Icon double flèche vers la droite" />
                <p>Dernière page</p>
            </router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Pages',
    data() {
        return {
            currentPage: this.getCurrentPage(),
            loadNumPost: false,
            numberOfPosts: this.getNumberOfPosts(),
            numberOfPages: this.getNumberOfPages(),
            previousPage: this.getPreviousPageLink(),
            nextPage: this.getNextPageLink(),
            lastPage: this.getLastPageLink(),
            existingPreviousPage: this.isThereAPreviousPage(),
            existingNextPage: this.isThereANextPage()
        }
    },
    methods: {
        getNumberOfPosts() {
            console.log('getnumpost');
            fetch('http://localhost:3000/api/posts', {
                credentials: 'include'
            })
            .then(res => res.json())
            .then(result => {
                console.log('loadnumpost true');
                this.loadNumPost = true;
                return this.numberOfPosts = result.length;
            })
            .catch(err => {
                console.log('Error getNumberOfPosts', err);
                alert('Une erreur s\'est produite');
            });
        },
        getNumberOfPages() {
            console.log('getnumpages');
            const post = this.numberOfPosts;
            console.log('post getnumpages: ', post);
            const modulo = post%10;
            console.log('modulo getnumpage: ', post%10);
            if(modulo === 0) {
                console.log('modulo 0, numpage: ', post/10);
                return this.numberOfPages = post/10;
            } else {
                const majPost = post + 10 - modulo
                console.log('modulo no0, numpage: ', majPost/10);
                return this.numberOfPages = majPost/10;
            }
        },
        getCurrentPage() {
            console.log('getcurrentpage');
            const page = this.$route.query.page;

            if(!page) {
                console.log('no query page');
                return this.currentPage = 1;
            } else {
                console.log('query page: ', parseInt(page, 10));
                return this.currentPage = parseInt(page, 10);
            }
        },
        isThereAPreviousPage() {
            console.log('isprevpage');
            if(this.currentPage > 1) {
                console.log('prevpage true');
                return this.existingPreviousPage = true;
            } else {
                console.log('prevpage false');
                return this.existingPreviousPage = false;
            }
        },
        isThereANextPage() {
            console.log('isnextpage');
            if(this.currentPage < this.numberOfPages) {
                console.log('nextpage true');
                return this.existingNextPage = true;
            } else {
                console.log('nextpage false');
                return this.existingNextPage = false;
            }
        },
        getPreviousPageLink() {
            console.log('prevpagelink: ', this.currentPage - 1);
            return this.previousPage = this.currentPage - 1;
        },
        getNextPageLink() {
            console.log('nextpagelink: ', this.currentPage + 1);
            return this.nextPage = this.currentPage + 1;
        }   ,
        getLastPageLink() {
            console.log('lastpagelink: ', this.numberOfPages);
            return this.lastPage = this.numberOfPages;
        }
    }
}
</script>

<style>

</style>