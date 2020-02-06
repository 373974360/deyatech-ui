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
                                value-format="yyyy-MM-dd"
                                :size="btnSize">
                            </el-date-picker>

                            <el-radio-group :size="btnSize" v-model="templateAccess.accessType" style="margin-left: 10px;" @change="handleAccessTypeClick">
                                <el-radio-button :label="1">按栏目排行</el-radio-button>
                                <el-radio-button :label="2">按信息排行</el-radio-button>
                            </el-radio-group>
                            <el-button type="primary" :size="btnSize" style="margin-left: 10px;" @click="reloadList">统计</el-button>
                        </div>
                    </div>
                    <el-table :data="accessDataList" v-loading.body="listLoading" stripe border highlight-current-row
                              @selection-change="handleSelectionChange">
                        <el-table-column v-if="templateAccess.accessType == 1" align="left" label="栏目名称" prop="catalogName"/>
                        <el-table-column v-if="templateAccess.accessType == 2" align="left" label="信息标题" prop="infoTitle"/>
                        <el-table-column align="left" label="PV" prop="pvCount"/>
                        <el-table-column align="left" label="UV" prop="uvCount"/>
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
                    accessType: 1,
                    catId: 0,
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
                templateAccessList:undefined,
                timeFrame: '',
                catalogNameHidden: false,
                infoTitleHidden: true
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
            this.$store.state.common.selectSiteDisplay = true;
            if(this.$store.state.common.siteId != undefined){
                // 获取栏目
                this.getCatalogTree();
                this.setCurrDate();
            }
        },
        methods: {
            setCurrDate(){
                let nowDate = new Date();
                let date = {
                    year: nowDate.getFullYear(),
                    month: nowDate.getMonth() + 1,
                    date: nowDate.getDate(),
                }
                this.timeFrame = [date.year + '-' + 0 + date.month + '-01',date.year + '-' + 0 + date.month + '-' + 0 + date.date];
                this.reloadList();
            },
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
            handleAccessTypeClick() {
                this.reloadList();
            },
            reloadList(){
                this.templateAccess.startTime = this.timeFrame[0]+" 00:00:00";
                this.templateAccess.endTime = this.timeFrame[1]+" 23:59:59";
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
    .catalog-left-Tree {
        border:1px solid #eceef5;
        overflow: auto;
        margin-right:10px;
        padding: 14px;
        height: 600px;
    }
    .catalog-left-Tree .el-tree {
        display: inline-block;
        margin: 10px;
        min-width: 50%;
    }
    .catalog-left-Tree::-webkit-scrollbar {
        width: 10px;
        height: 10px;
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
