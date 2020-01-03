<template>
    <basic-container>
        <div class="deyatech-container pull-auto" style="overflow-x: auto">
            <div style="width: 1200px; margin-top: -500px; overflow-x: auto">
                <iframe width="100%" height="1740" :src="host + '/pc/index.html'" scrolling="no" frameborder="0"></iframe>
            </div>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {getStore} from '@/util/store';

    export default {
        name: 'detail',
        data() {
            return {
            }
        },
        computed: {
            ...mapGetters([
                'permission',
                'titleMap',
                'enums',
                'closeOnClickModal',
                'searchSize',
                'btnSize'
            ]),
            btnEnable() {
                return {
                    create: this.permission.detail_create,
                    update: this.permission.detail_update,
                    delete: this.permission.detail_delete
                };
            },
            host() {
                return window.location.origin;
            }
        },
        created(){
        },
        methods: {
        }
    }
</script>

<style scoped>
    .basic-container, .basic-container /deep/ .el-card {
        background-color: #fafafa;
    }
</style>
