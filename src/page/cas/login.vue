<template>

</template>

<script>
    import {mapGetters} from 'vuex';
    import {getUser} from '@/api/common'
    export default {
        computed: {
            ...mapGetters(["tagWel"])
        },
        created() {
            this.getUserInfo();
        },
        methods:{
            getUserInfo(){
                getUser().then(response => {
                    const data = response.data;
                    this.$store.commit('SET_TOKEN', data.token);
                    this.$store.commit('SET_USERIFNO', data);
                    this.$store.commit('SET_PERMISSION', data.permissions);
                    this.$store.dispatch('SetEnums');
                    this.$store.dispatch('SetDicts');
                    this.$store.commit('DEL_ALL_TAG');
                    this.$store.commit('CLEAR_LOCK');
                    this.$message.success(this.$t("login.loginSuccess"));
                    this.$router.push({path: this.tagWel.value});
                })
            }
        }
    };
</script>
