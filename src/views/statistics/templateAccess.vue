<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <el-row :span="24">
                <el-col :span="4">
                    <div class="catalog-left-Tree" ref="leftTree" v-loading.body="listLoading">
                        <div class="left-tree-title">栏目列表</div>
                        <el-tree
                            ref="catalogTree"
                            :data="catalogList"
                            :props="defaultTreeProps"
                            node-key="id"
                            highlight-current
                            :default-expand-all="false"
                            :expand-on-click-node="false"
                            @node-click="handleNoteClick">
                        </el-tree>
                    </div>
                </el-col>
                <el-col :span="20">
                    <div class="deyatech-menu">
                        <div class="deyatech-menu_left">
                            <el-date-picker
                                v-model.trim="timeFrame"
                                type="daterange"
                                align="right"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="pickerOptions"
                                value-format="yyyy-MM-dd">
                            </el-date-picker>

                            <el-radio-group :size="btnSize" v-model="accessType" style="margin-left: 10px;">
                                <el-radio-button :label="1">按栏目排行</el-radio-button>
                                <el-radio-button :label="3">按信息排行</el-radio-button>
                            </el-radio-group>
                            <el-button type="primary" :size="btnSize" style="margin-left: 10px;" @click="reloadList">统计</el-button>
                        </div>
                    </div>
                    <el-table :data="accessDataList" v-loading.body="listLoading" stripe border highlight-current-row
                              @selection-change="handleSelectionChange">
                        <el-table-column align="left" label="栏目名称" prop="catalogName"/>
                        <el-table-column align="left" label="浏览量" prop="count"/>
                    </el-table>
                    <el-pagination class="deyatech-pagination pull-right" background
                                   :current-page.sync="templateAccess.page" :page-sizes="this.$store.state.common.pageSize"
                                   :page-size="templateAccess.size" :layout="this.$store.state.common.pageLayout" :total="total"
                                   @size-change="handleSizeChange" @current-change="handleCurrentChange">
                    </el-pagination>
                </el-col>
            </el-row>
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
        getTemplateAccessList
    } from '@/api/statistics/templateAccess';

    export default {
        name: 'createHtml',
        data() {
            return {
                accessDataList: undefined,
                total: undefined,
                listLoading: true,
                treeHeight: 0,
                listLoading: false,
                templateAccess: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    siteId: this.$store.state.common.siteId,
                    catId: undefined,
                    startTime: undefined,
                    endTime: undefined
                },
                catalogList: [],
                defaultTreeProps: {
                    children: 'children',
                    label: 'name',
                    isLeaf: 'leaf'
                },
                selectedRows: [],
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
                accessType: 1,
                templateAccessList:undefined,
                timeFrame: ''
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
            }
        },
        methods: {
            getCatalogTree(){
                this.listLoading = true;
                getCatalogTree(this.templateAccess).then(response => {
                    this.catalogList = response.data;
                    this.listLoading = false;
                })
            },
            handleSizeChange(val){
                this.templateAccess.size = val;
                this.reloadList();
            },
            handleCurrentChange(val){
                this.listQuery.page = val;
                this.reloadList();
            },
            handleSelectionChange(rows){
                this.selectedRows = rows;
            },
            handleNoteClick(data) {
                this.templateAccess.catId = data.id;
                this.reloadList();
            },
            reloadList(){
                this.templateAccess.startTime = this.timeFrame[0];
                this.templateAccess.endTime = this.timeFrame[1];
                getTemplateAccessList(this.templateAccess).then(response => {
                    this.listLoading = false;
                    this.accessDataList = response.data.records;
                    this.total = response.data.total;
                })
            }
        }
    }
</script>
<style>
    .left-tree-title {
        color: #909399;
        font-weight: bold;
        font-size: 14px;
        text-align: center;
        border-bottom: 1px solid #EBEEF5;
        padding: 14px 0px;
    }
</style>
