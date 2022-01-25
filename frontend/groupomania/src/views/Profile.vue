<template>
    <div class="view-Profile">
        <HeaderProfile />
        <ProfileInfo />
    </div> 
</template>

<script>
import ProfileInfo from '../components/ProfileInfo.vue'
import HeaderProfile from '../components/HeaderProfile.vue'

export default {
    name: 'Profile',
    components: {
        ProfileInfo,
        HeaderProfile
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
