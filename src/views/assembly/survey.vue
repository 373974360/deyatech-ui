<template>
    <basic-container>
        <iframe :src="src" width="100%" frameborder="0" :height="iframeHeight"></iframe>
    </basic-container>
</template>
<script>
    import {getToken} from '@/util/auth'
    export default {
        data () {
            return {
                src: 'http://127.0.0.1:8088/diaowen/design/my-survey.action?token_='+getToken(),
                iframeHeight: 0
            }
        },
        created(){
            this.getHeight()
        },
        methods:{
            getHeight(){
                this.iframeHeight=window.innerHeight-155;
            }
        }
    }
</script>

