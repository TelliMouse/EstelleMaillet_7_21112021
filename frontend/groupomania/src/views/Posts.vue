<template>
    <div class="posts">
        <HeaderPost />
        <div v-if="loadList">
            <PublishedPost 
                v-for="post in postList"
                :key="post.id"
                :postTitle="post.title"
                :post="post.text"
                :imageUrl="post.imageUrl" 
                :imageAlt="post.imageAlt" 
                :likeNumber="post.likes"
                :dislikeNumber="post.dislikes"
                :date="getDate(post.date)"
                :postId="post.id"
                :postModConditions="false"
                :postTextPost="isThereText(post.text)" 
                :postImagePost="!isThereText(post.text)"
                :userId="post.user_id"
                :postNeedLinkToPost="true"/>
        </div>
        <Pages />
    </div>
</template>

<script>
import HeaderPost from '../components/HeaderPost.vue'
import PublishedPost from '../components/PublishedPost.vue'
import Pages from '../components/Pages.vue'

export default {
    name: 'Posts',
    components: {
        HeaderPost,
        PublishedPost,
        Pages
    },
    data() {
        return {
            postList : this.getPostList(),
            loadList: false,
            nameLoaded: false,
            currentPage: this.getCurrentPage()
        }
    },
    methods: {
        /**
         * Returns a boolean answer to the question is there text in the post
         * @returns {Boolean}
         */
        isThereText(text) {
            if(text) {
                return true;
            } else {
                return false;
            }
        },
        /**
         * Display the name of the user from its id
         */
        getUserName(userId) {
            fetch(`http://localhost:3000/api/users/${userId}`, {
                credentials: 'include'
            })
            .then(res => res.json())
            .then(result => {
                const firstname = result.firstname;
                const lastname = result.lastname;
                this.nameLoaded = true;
                return firstname + ' ' + lastname;
            })
            .catch(err => {
                console.log('Error getUserName', err);
                alert('Une erreur s\'est produite');
            });
        },
        /**
         * Change the format of the date from the database format to a "day month year, hourHminutesMsecondsS" format
         */
        getDate(date) {
            //Database format: "yyyy-mm-ddThh:mm:ss.000Z"
            const firstSplit = date.split('-'); //['yyyy', 'mm', 'ddThh:mm:ss.000Z']
            const year = firstSplit[0]; // 'yyyy'
            const monthNum = firstSplit[1]; //'mm'
            const secondSplit = firstSplit[2].split('T'); // ['dd', 'hh:mm:ss.000Z']
            const day = secondSplit[0]; // 'dd'
            const thirdSplit = secondSplit[1].split(':'); // ['hh', 'mm', 'ss.000Z']
            const hour = thirdSplit[0]; // 'hh'
            const minutes = thirdSplit[1]; // 'mm'
            const fourthSplit = thirdSplit[2].split('.'); // ['ss', '000Z']
            const seconds = fourthSplit[0]; // 'ss'

            const months = {
                '01': "Janvier",
                '02': "Février",
                '03': "Mars",
                '04': "Avril",
                '05': "Mai",
                '06': "Juin",
                '07': "Juillet",
                '08': "Août",
                '09': "Septembre",
                '10': "Octobre",
                '11': "Novembre",
                '12': "Décembre"
            };

            const month = months[monthNum];

            return day + ' ' + month + ' ' + year + ', ' + hour + 'h' + minutes + 'm' + seconds + 's';
        },
        /**
         * Find the number of the page that is displayed
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
         * Retrieve all posts, and find which to display according to the page number
         */
        getPostList() {
            //We retieve all posts, ordered by date in a descending order
            fetch('http://localhost:3000/api/posts', {
                credentials: 'include'
            })
            .then(res => res.json())
            .then(result => {
                let postList = [];
                //There are 10 posts per page, so the indexes of the posts to be displayed are between majPostIndex et minPostIndex
                const majPostIndex = this.currentPage*10;
                const minPostIndex = majPostIndex - 10;
                
                for(let i = minPostIndex; i < majPostIndex; i++) {
                    if(result[i]) {
                        postList.push(result[i]);
                    }
                }

                this.loadList = true;
                return this.postList = postList;
            })
            .catch(err => {
                console.log('Error getPostList', err);
                alert('Une erreur s\'est produite');
            });
        }
    },
    watch: {
        //When the page number change, we fetch again the posts to be displayed
        $route() {
            this.currentPage = this.getCurrentPage();
            this.loadList = false;
            this.postList = this.getPostList();   
        }
    }
}
</script>

<style lang="scss">
div.posts {
    display: flex;
    flex-direction: column;
    align-items: center;
    &>div {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
}
</style>