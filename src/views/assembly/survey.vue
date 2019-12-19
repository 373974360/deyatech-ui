<template>
    <basic-container>
        <iframe :src="src" id="surveyIframe" width="100%" frameborder="0" :height="iframeHeight"></iframe>
    </basic-container>
</template>
<script>
    import $ from "jquery";
    import {getToken} from '@/util/auth'
    export default {
        data () {
            return {
                src: 'http://127.0.0.1:8088/survey/design/my-survey.action?token_='+getToken(),
                iframeHeight: 0
            }
        },
        mounted(){
            const surveyIframe = document.getElementById('surveyIframe');
            const deviceHeight = document.documentElement.clientHeight;
            surveyIframe.style.height = (Number(deviceHeight)-155) + 'px'; //数字是页面布局高度差
        },
        methods: {

        }
    }
</script>

