<template>
    <div>
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

</style>
