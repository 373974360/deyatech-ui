<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        开启日志：<el-switch v-model="enable" @change="changeLogEnable"
                        active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                    </el-form-item>
                </el-form>
            </div>
            <div class="logContainer" ref="logContainer" v-loading.body="listLoading">
                <div class="logRow" v-for="log in logList">
                    <span class="logTime">{{log.time}}</span>
                    <span :class="'logLevel '+log.level">{{log.level}}</span>
                    <span class="logThread">{{log.thread}}</span>
                    <span class="logLogger">{{log.logger}}</span>
                    <span class="logMessage">{{log.message}}</span>
                </div>
            </div>
        </div>
    </basic-container>
</template>
<script>
    import {mapGetters} from 'vuex';
    import SockJS from 'sockjs-client';
    import Stomp from 'stompjs';

    export default {
        name: 'logs',
        data() {
            return {
                listLoading: true,
                enable: true,
                stompClient: undefined,
                logList: []
            }
        },
        computed: {
            ...mapGetters([
                'closeOnClickModal',
                'searchSize',
                'btnSize'
            ])
        },
        created() {
            this.$store.state.common.selectSiteDisplay = false;
            this.connect();
        },
        methods: {
            resetSearch() {
                this.listQuery.notes = undefined;
            },
            connect: function () {
                let _this = this;
                let sock = new SockJS('/web/websocket/');
                this.stompClient = Stomp.over(sock);
                this.stompClient.connect({}, function () {
                    _this.listLoading = false;
                    _this.stompClient.subscribe('/topic/logs/', function (data) {
                        if (_this.logList.length >= 50) {
                            _this.logList.shift();
                        }
                        _this.logList.push(JSON.parse(data.body));
                        _this.$nextTick(() => {
                            let container = _this.$refs.logContainer;
                            container.scrollTop = container.scrollHeight;
                        });
                    });
                });
                sock.onclose = function () {
                    console.dir("websocket已经断开连接，5秒后重新连接");
                    //断开五秒后重连
                    setTimeout(function () {
                        _this.connect();
                    }, 5000);
                }
            },
            disconnect() {
                if (this.stompClient != null) {
                    this.stompClient.disconnect();
                }
            },
            changeLogEnable(enable){
                if(enable){
                    this.connect();
                }else{
                    this.disconnect();
                }
            }
        }
    }
</script>
<style>
    .logContainer{
        background: #000000;
        height: 750px;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .logRow{
        padding: 8px;
        height: auto;
        line-height: 2;
    }
    .logRow span{
        margin-right: 10px;
    }
    .logTime{
        color: #ffffff;
    }
    .logLevel{
        color: #ffffff;
    }
    .INFO,.DEBUG{
        color: #5daf34;
    }
    .ERROR{
        color: #ff4d51;
    }
    .logThread{
        color: #1dedff;
    }
    .logLogger{
        color: #8432ff;
    }
    .logMessage{
        color: #ffffff;
        word-break: break-word;
    }
</style>

