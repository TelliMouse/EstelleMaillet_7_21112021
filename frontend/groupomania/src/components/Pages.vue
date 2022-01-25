<template>
    <div class="pages" v-if="loadNumPost">
        <div class="direction" v-if="existingPreviousPage">
            <router-link to="/posts/1">
                <fa icon="fast-backward" alt="Icone double flèche vers la gauche" />
                <p>Première page</p>
            </router-link>
            <router-link :to="{ name: 'Posts', params: { page: previousPage } }">
                <fa icon="arrow-circle-left" alt="Icone de flèche vers la gauche"/>
                <p>Page précèdente</p>
            </router-link>
        </div>
        <div class="direction" v-if="existingNextPage">
            <router-link :to="{ name: 'Posts', params: { page: nextPage } }">
                <fa icon="arrow-circle-right" alt="Icone de flèche vers la droite"/>
                <p>Page suivante</p>
            </router-link>
            <router-link :to="{ name: 'Posts', params: { page: lastPage } }">
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
            numberOfPages: this.getNumberOfPages(),
            previousPage: '',
            nextPage: '',
            lastPage: '',
            existingPreviousPage: '',
            existingNextPage: ''
        }
    },
    methods: {
        /**
         * Finds the number necessary to display all posts, with a maximum of 10 posts per page
         */
        getNumberOfPages() {
            //First we need to find the total number of posts
            fetch('http://localhost:3000/api/posts', {
                credentials: 'include'
            })
            .then(res => res.json())
            .then(result => {
                this.loadNumPost = true;
                const numberOfPosts = result.length;
                const modulo = numberOfPosts%10;
                //If the number of posts is a multiple of 10, the number of pages necessary is the number of posts divided by ten
                if(modulo === 0) {
                    this.numberOfPages = numberOfPosts/10;
                    //We then call all other functions that rely on the numberOfPages to work
                    this.getPreviousPageLink();
                    this.getNextPageLink();
                    this.getLastPageLink();
                    this.isThereAPreviousPage();
                    this.isThereANextPage();
                    return this.loadNumPost = true;
                //If the number of posts isn't a multiple of 10, we need to calculate the number of pages needed with the modulo of the number of posts
                } else {
                    const majPost = numberOfPosts + 10 - modulo;
                    this.numberOfPages = majPost/10;
                    //We then call all other functions that rely on the numberOfPages to work
                    this.getPreviousPageLink();
                    this.getNextPageLink();
                    this.getLastPageLink();
                    this.isThereAPreviousPage();
                    this.isThereANextPage();
                    return this.loadNumPost = true;
                }
            })
            .catch(err => {
                console.log('Error getNumberOfPosts', err);
                alert('Une erreur s\'est produite');
            });
        },
        /**
         * We find what page is on display
         */
        getCurrentPage() {
            const page = this.$route.params.page;

            if(!page) {
                return this.currentPage = 1;
            } else {
                return this.currentPage = parseInt(page, 10);
            }
        },
        /**
         * We find if there is a previous page to display
         */
        isThereAPreviousPage() {
            if(this.currentPage > 1) {
                return this.existingPreviousPage = true;
            } else {
                return this.existingPreviousPage = false;
            }
        },
        /**
         * We find if there is a next page to display
         */
        isThereANextPage() {
            if(this.currentPage < this.numberOfPages) {
                return this.existingNextPage = true;
            } else {
                return this.existingNextPage = false;
            }
        },
        /**
         * We calculate the number of the previous page
         */
        getPreviousPageLink() {
            return this.previousPage = this.currentPage - 1;
        },
        /**
         * We calculate the number of the next page
         */
        getNextPageLink() {
            return this.nextPage = this.currentPage + 1;
        },
        /**
         * We find the number of the last page
         */
        getLastPageLink() {
            return this.lastPage = this.numberOfPages;
        }
    },
    watch: {
        //When the page number change, we find again if there are previous and next pages
        $route() {
            this.currentPage = this.getCurrentPage();
            this.loadNumPost = false;
            this.numberOfPages = this.getNumberOfPages();
        }
    }
}
</script>

<style lang="scss">
div.pages {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 1.5em;
    min-width: fit-content;
    &>div.direction {
        display: flex;
        flex-direction: row;
        width: fit-content;
        justify-content: space-between;
        &>a {
            text-decoration: none;
            font-size: 1em;
            color: #4C061D;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding-left: 1em;
            padding-right: 1em;
            cursor: pointer;
        }
    }
}
</style>