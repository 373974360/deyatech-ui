<template>
    <div class="avue-logo">
        <transition name="fade">
      <span v-if="keyCollapse"
            class="avue-logo_subtitle"
            key="0">
        <img src="img/bg/logo.png"
             width="50"/>
      </span>
        </transition>
        <transition-group name="fade">
            <template v-if="!keyCollapse">
        <span class="avue-logo_title"
              key="1">
          <div>
            <img src="img/bg/sd-logo.png"
                 width="200"
                 alt=""><!--{{userInfo.name}}--></div>
        </span>
            </template>
        </transition-group>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: "logo",
        data() {
            return {
                userInfo: this.$store.state.user.userInfo
            };
        },
        created() {
        },
        computed: {
            ...mapGetters(["website", "keyCollapse"])
        },
        methods: {}
    };
</script>

<style lang="scss">
    .fade-leave-active {
        transition: opacity 0.2s;
    }

    .fade-enter-active {
        transition: opacity 2.5s;
    }

    .fade-enter,
    .fade-leave-to {
        opacity: 0;
    }

    .avue-logo {
        position: fixed;
        top: 0;
        left: 0;
        height: 64px;
        line-height: 64px;
        background-color: #0f4c81;
        font-size: 20px;
        overflow: hidden;
        box-sizing: border-box;
        //box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.15);
        color: rgba(255, 255, 255, 0.8);
        z-index: 1024;
        font-weight: bold;

        &_title {
            display: block;
            text-align: center;
            font-weight: 300;
            font-size: 16px;

            div {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;

                img {
                   // margin-right: 5px;
                }
            }
        }

        &_subtitle {
            padding-top: 10px;
            display: block;
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            color: #fff;
        }
    }
</style>
