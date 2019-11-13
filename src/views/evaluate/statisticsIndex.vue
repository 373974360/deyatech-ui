<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div style="width: 100%; margin-top: -504px;">
                <iframe width="100%" height="1900" src="http://127.0.0.1:10080/pc/index.html" scrolling="no" frameborder="0"></iframe>
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
            }
        },
        created(){
        },
        methods: {
        }
    }
</script>

<style scoped>
    body, body div {
        background-color: #fafafa;
    }
</style>
