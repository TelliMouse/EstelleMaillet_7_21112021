<template>
    <div class="view-Profile">
        <HeaderPost />
        <ProfileInfo />
    </div> 
</template>

<script>
import ProfileInfo from '../components/ProfileInfo.vue'
import HeaderPost from '../components/HeaderPost.vue'

export default {
    name: 'Profile',
    components: {
        ProfileInfo,
        HeaderPost
    }
}
</script>

<style lang="scss">
div.view-Profile {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
