<template>
    <div class="login-container" style="background: url(img/bg/login-bg.jpg) 0 bottom repeat-x #2790ee;"
         @keyup.enter.native="handleLogin" >
        <top-color v-show="false"></top-color>
        <div class="login-weaper animated bounceInDown">
            <div class="login-left">
                <div class="login-time">
                    {{time}}
                </div>
                <img class="img"
                     src="img/logo.png"
                     alt="">
                <p class="title">{{ $t('login.info') }}</p>
            </div>
            <div class="login-border">
                <div class="login-main">
                    <h4 class="login-title">
                        {{ $t('login.title') }}
                        <!--<top-lang></top-lang>-->
                    </h4>
                    <userLogin></userLogin>
                </div>

            </div>
        </div>
    </div>
</template>
<script>
    import userLogin from "./userlogin";
    import {mapGetters} from "vuex";
    import {dateFormat} from "@/util/date";
    import topLang from "@/page/index/top/top-lang";
    import topColor from "@/page/index/top/top-color";

    export default {
        name: "login",
        components: {
            userLogin,
            topLang,
            topColor
        },
        data() {
            return {
                time: "",
            };
        },
        created() {
            this.getTime();
            setInterval(() => {
                this.getTime();
            }, 1000);
        },
        mounted() {
        },
        computed: {
            ...mapGetters(["website"])
        },
        props: [],
        methods: {
            getTime() {
                this.time = dateFormat(new Date());
            }
        }
    };
</script>

<style lang="scss">
    @import "@/styles/login.scss";
</style>
