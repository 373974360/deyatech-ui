<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <el-row :gutter="20" :span="24">
                <el-col :span="24">
                    <el-cascader ref="userCascader"
                                 filterable placeholder="请选择用户" clearable
                                 :size="searchSize"
                                 style="margin-right:10px; width: 300px;"
                                 :options="userList"
                                 v-model="selectedUserArray"
                                 :show-all-levels="false"
                                 @change="userChange">
                    </el-cascader>
                    <el-date-picker
                        v-model="timeValue"
                        :size="searchSize"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="timeChange"
                        style="margin-right: 10px;">
                    </el-date-picker>
                    <el-button :disabled="!listQuery.userId && !listQuery.departmentId"
                               type="primary"
                               icon="el-icon-search"
                               :size="searchSize"
                               @click="reloadList">{{$t('table.search')}}</el-button>
                    <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}</el-button>
                </el-col>
            </el-row>


            <el-table :data="departmentUserTreeDataList" v-loading.body="listLoading" stripe border highlight-current-row>
                <el-table-column type="selection" width="50" align="center"/>
            </el-table>



            <el-dialog width="70%" :title="'用户栏目数据'" :visible.sync="dialogUserCatalogDataVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeUserCatalogDataDialog">
                <el-table :data="userCatalogDataList" v-loading.body="listLoading" stripe border highlight-current-row>
                    <el-table-column type="selection" width="50" align="center"/>
                </el-table>
            </el-dialog>

        </div>
    </basic-container>
</template>

<script>
    import {mapGetters} from 'vuex';
    // import {deepClone} from '@/util/util';
    // import echarts from 'echarts'
    // import '../../../node_modules/echarts/map/js/china.js'
    import {getDepartmentUserTreeDataList} from "@/api/statistics/userData";

    import {getUserTreeBySiteId} from "@/api/resource/stationGroupUser";
    import {getStationDepartmentTree} from "@/api/resource/stationGroup";
    import {getUserCatalogTreeByUserId, getDepartmentCatalogTreeByDepartmentId} from '@/api/station/catalog';

    export default {
        name: "userData",
        data() {
            return {
                listQuery: {
                    siteId: this.$store.state.common.siteId,
                    userId: undefined,
                    startTime: undefined,
                    endTime: undefined
                },
                departmentUserTreeDataList: [],
                userCatalogDataList: [],
                dialogUserCatalogDataVisible: false,

                userList: [],
                selectedUserArray: [],
                timeValue: []
            }
        },
        computed: {
            ...mapGetters([
                'permission',
                'enums',
                'searchSize',
                'btnSize'
            ])
        },
        created(){
            this.$store.state.common.selectSiteDisplay = true;
            if (this.$store.state.common.siteId) {
                this.listQuery.siteId = this.$store.state.common.siteId;
            }
        },
        methods: {
            timeChange(v) {
                if (v.length > 0) {
                    this.listQuery.startTime = v[0];
                    this.listQuery.endTime = v[1];
                }
            },
            reloadList() {
                this.loadDepartmentUserTreeDataList();
            },
            resetSearch() {
                this.timeValue = [];
                this.listQuery.userId = undefined;
                this.listQuery.startTime = undefined;
                this.listQuery.endTime = undefined;
            },
            // 检索部门用户树统计数据
            loadDepartmentUserTreeDataList() {
                getDepartmentUserTreeDataList().then(response => {
                    this.departmentUserTreeDataList = response.data;
                });
            },
            closeUserCatalogDataDialog() {
                this.dialogUserCatalogDataVisible = false;
            },












            loadUserList() {
                getUserTreeBySiteId(this.listQuery.siteId).then(response => {
                    this.userList = response.data;
                });
            },
            userChange(v) {
                if (v.length > 0) {
                    this.listQuery.userId = v[v.length - 1];
                    this.getCatalogTree();
                }
            },
            departmentChange(v) {
                if (v.length > 0) {
                    this.listQuery.departmentId = v[v.length - 1];
                    this.getCatalogTree();
                }
            },

            getRemoteChildren(node,resolve) {
                if (!node.data.id) {
                    return
                }
                if (this.listQuery.choice === this.USER) {
                    // 用户分配的栏目
                    getUserCatalogTreeByUserId({
                        siteId: this.$store.state.common.siteId,
                        parentId: node.data.id,
                        userId: this.listQuery.userId}).then(response => {
                        resolve(response.data);
                    });
                }
                if (this.listQuery.choice === this.DEPARTMENT) {
                    // 部门分配的栏目
                    getDepartmentCatalogTreeByDepartmentId({
                        siteId: this.$store.state.common.siteId,
                        parentId: node.data.id,
                        departmentId: this.listQuery.departmentId}).then(response => {
                        resolve(response.data);
                    });
                }
            },
            // 分配的栏目
            getCatalogTree() {
                if (this.listQuery.choice === this.USER) {
                    // 用户分配的栏目
                    getUserCatalogTreeByUserId({
                        siteId: this.$store.state.common.siteId,
                        parentId: '0',
                        userId: this.listQuery.userId}).then(response => {
                        this.catalogList = response.data;
                        // this.setDefaultCurrentNode()
                    })
                }
                if (this.listQuery.choice === this.DEPARTMENT) {
                    // 部门分配的栏目
                    getDepartmentCatalogTreeByDepartmentId({
                        siteId: this.$store.state.common.siteId,
                        parentId: '0',
                        departmentId: this.listQuery.departmentId}).then(response => {
                        this.catalogList = response.data;
                        // this.setDefaultCurrentNode()
                    })
                }
            },
            setDefaultCurrentNode() {
                if (this.catalogList.length > 0) {
                    let data = this.catalogList[0];
                    if (!data.leaf) {
                        this.defaultExpandedKeys = [data.id];
                    } else {
                        this.defaultExpandedKeys = [];
                    }
                    this.handleNoteClick(data);
                    this.$nextTick(function(){
                        this.$refs['catalogTree'].setCurrentKey(data.id);
                    })
                }
            },
            handleNoteClick(data) {
                this.listQuery.catalogId = data.id;
            },

            loadGraphicData() {
                console.dir(this.listQuery);
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
    .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
        background-color: #a6d1ff;
    }
</style>
