<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="standard-text">
                <!-- 栏目列表 -->
                <div class="left-tree" ref="leftTree" v-loading.body="listLoading">
                    <div class="left-tree-title">栏目列表</div>
                    <el-tree
                        ref="catalogTree"
                        :data="catalogList"
                        :props="defaultTreeProps"
                        node-key="id"
                        highlight-current
                        show-checkbox
                        :default-expand-all="false"
                        :expand-on-click-node="false">
                    </el-tree>
                </div>
                <el-form class="deyatech-form" label-position="right" label-width="80px">
                    <el-row>
                        <el-form-item label="发布时间" prop="timeFrame">
                            <el-date-picker
                                v-model.trim="timeFrame"
                                type="daterange"
                                align="right"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                :picker-options="pickerOptions">
                            </el-date-picker>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-button type="primary" :size="btnSize" @click="createHtml()">一键发布</el-button>
                    </el-row>
                </el-form>
                <el-dialog title="进度" :visible.sync="dialogVisible" :close-on-click-modal="closeOnClickModal" >
                    <el-progress :text-inside="true" :stroke-width="24" :percentage="percentage" status="success"></el-progress>
                    <el-row :gutter="20" :span="24" style="margin-top:20px;">
                        <el-col :span="3">
                                总数：{{totle}}
                        </el-col>
                        <el-col :span="3">
                                当前：{{curNo}}
                        </el-col>
                        <el-col :span="18">
                                标题： {{curTitle}}
                        </el-col>
                    </el-row>
                </el-dialog>
            </div>
        </div>
    </basic-container>
</template>
<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getCatalogTree
    } from '@/api/station/catalog';
    import {
        createHtml
    } from '@/api/station/generate';

    export default {
        name: 'createHtml',
        data() {
            return {
                treeHeight: 0,
                listLoading: false,
                listQuery: {
                    siteId: this.$store.state.common.siteId
                },
                catalogList: [],
                defaultTreeProps: {
                    children: 'children',
                    label: 'name',
                    isLeaf: 'leaf'
                },
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                timeFrame: '',
                dialogVisible: false,
                percentage: 0.00,
                totle: 0,
                curNo: 0,
                curTitle: ''
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
            ])
        },
        created(){
            console.log("siteId: " + this.$store.state.common.siteId);
            this.$store.state.common.selectSiteDisplay = true;
            if(this.$store.state.common.siteId != undefined){
                // 获取栏目
                this.getCatalogTree();
                this.staticPathProgress();
            }
        },
        methods: {
            getCatalogTree(){
                this.listLoading = true;
                getCatalogTree(this.listQuery).then(response => {
                    this.catalogList = response.data;
                    this.listLoading = false;
                })
            },
            createHtml(){
                const data = {ids:this.$refs.catalogTree.getCheckedKeys(),timeFrame:this.timeFrame}
                createHtml(data).then(response => {
                    this.staticPathProgress();
                })
            },
            checkDialogVisible(){
                if(this.totle > 0 && this.percentage < 100){
                    this.dialogVisible = true;
                }else if(this.totle > 0 && this.percentage == 100){
                    this.$message.success("发布完成！");
                    this.dialogVisible = false;
                    this.totle = 0;
                    this.percentage = 0;
                }else{
                    this.dialogVisible = false;
                    this.totle = 0;
                    this.percentage = 0;
                }
            },
            staticPathProgress(){
                this.dialogVisible = true;
                let _this = this;
                let sockJS = new SockJS('/web/websocket-station/');
                let stompClient = Stomp.over(sockJS)
                stompClient.connect({}, function () {
                    stompClient.subscribe('/topic/staticPage/message/', function (response) {
                        //append,modify,delete
                        let operate = JSON.parse(response.body);
                        _this.totle = operate.totle;
                        _this.curNo = operate.currNo;
                        _this.curTitle = operate.currTitle;
                        _this.percentage = parseFloat(operate.currNo/operate.totle*100).toFixed(2)*1;
                        _this.checkDialogVisible();
                    });
                });
                sockJS.onclose = function () {
                    console.log("连接已关闭 "+new Date());
                }
                _this.checkDialogVisible();
            }
        }
    }
</script>
<style>
    /*标准管理树*/
    .standard-text{
        display: flex;
        justify-content: flex-start;
        overflow: auto;
        margin-top: 20px;
    }
    /*组织机构树*/
    .left-tree
    {
        width: 210px;
        margin-right:10px;
        background:white;
        border:1px solid #EBEEF5;
        overflow-x: auto;
        overflow-y: auto;
    }
    .left-tree::-webkit-scrollbar {/*滚动条整体样式*/
        width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
        height: 4px;
    }
    .left-tree::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
        border-radius: 5px;
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        background: #f0f7ff;
    }
    .left-tree::-webkit-scrollbar-track {/*滚动条里面轨道*/
        /*-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);*/
        border-radius: 0;
        background: #fff;
    }
    .left-tree-title {
        color: #909399;
        font-weight: bold;
        font-size: 14px;
        text-align: center;
        border-bottom: 1px solid #EBEEF5;
        padding: 14px 0px;
    }
</style>
