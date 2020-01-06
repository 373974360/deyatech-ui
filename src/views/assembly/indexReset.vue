<template>
    <basic-container>
        <div class="deyatech-container pull-auto" v-if="this.$store.state.common.siteId">
            <el-row :gutter="20" :span="24">
                <el-col :span="24">
                    <el-form ref="indexCodeDialogForm" :inline="true" class="deyatech-form" :model="reset" label-position="left" :rules="resetRules">
                        <el-form-item label="开始日期" prop="start">
                            <el-date-picker type="date" placeholder="请选择开始日期" v-model="reset.start" format="yyyy年MM月dd日" value-format="yyyy-MM-dd"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="结束日期" prop="end">
                            <el-date-picker type="date" placeholder="请选择结束日期" v-model="reset.end" format="yyyy年MM月dd日" value-format="yyyy-MM-dd"></el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button v-if="btnEnable.save" type="primary" @click="doSave" :loading="submitLoading" :disabled="showProgress">索引码重置</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-progress v-if="btnEnable.save" :percentage="percentage" :text-inside="true" :stroke-width="20" v-show="showProgress" style="width: 200px; margin-top: 10px;"></el-progress>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {resetIndex} from '@/api/assembly/indexReset';

    export default {
        name: 'indexCode',
        data() {
            const checkStart = (rule, value, callback) => {
                if (value && this.reset.end) {
                    if (value > this.reset.end) {
                        callback(new Error('开始日期必须小于等于结束日期'));
                    } else {
                        callback();
                    }
                }
            };
            const checkEnd = (rule, value, callback) => {
                if (value && this.reset.start) {
                    if (value < this.reset.start) {
                        callback(new Error('结束日期必须大于等于开始日期'));
                    } else {
                        callback();
                    }
                }
            };
            return {
                submitLoading: undefined,
                reset: {
                    siteId: this.$store.state.common.siteId,
                    start: undefined,
                    end: undefined
                },
                resetRules: {
                    siteId: [
                        {required: true, message: '请选择开始站点'}
                    ],
                    start: [
                        {required: true, message: '请选择开始日期'},
                        {validator: checkStart, trigger: 'change'}
                    ],
                    end: [
                        {required: true, message: '请选择结束日期'},
                        {validator: checkEnd, trigger: 'change'}
                    ]
                },
                percentage: 0,
                showProgress: false
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
                    save: this.permission.indexReset_reset
                };
            }
        },
        created(){
            this.$store.state.common.selectSiteDisplay = true;
            this.showProgress = false;
            if(this.$store.state.common.siteId != undefined){
                this.processingProgress(this.$store.state.common.siteId);
            }
        },
        methods: {
            processingProgress(siteId) {
                var _this = this;
                var sockJS = new SockJS('/web/websocket-station/');
                var stompClient = Stomp.over(sockJS);
                stompClient.connect({}, function () {
                    stompClient.subscribe('/topic/reset/index/code/' + siteId + '/', function (response) {
                        if (response.body) {
                            let data = response.body.split(',');
                            let value = parseInt(data[0]);
                            let total = parseInt(data[1]);
                            if (total > 0) {
                                _this.percentage = parseInt(value / total * 100);
                                if (_this.percentage < 100) {
                                    _this.showProgress = true;
                                } else {
                                    _this.showProgress = false;
                                    _this.$message.success("索引码重置完成");
                                }
                            } else {
                                _this.showProgress = false;
                                _this.$message.success("索引码重置完成");
                            }
                        }
                    });
                });
                sockJS.onclose = function () {
                    setTimeout(function () {_this.processingProgress();}, 5000);
                };
            },
            doSave() {
                if (!this.reset.siteId) {
                    this.$message.error("请选择站点");
                }
                this.percentage = 0;
                this.$refs['indexCodeDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        resetIndex(this.reset).then(response => {
                            this.submitLoading = false;
                            if (response.data) {
                                this.showProgress = true;
                                this.$message.success("索引码重置开始");
                            } else {
                                this.showProgress = false;
                                this.$message.error("索引码重置失败");
                            }
                        }).catch((error)=>{
                            this.submitLoading = false;
                            this.showProgress = false;
                            this.$message.error(error);
                        });
                    }
                });
            }
        }
    }
</script>


