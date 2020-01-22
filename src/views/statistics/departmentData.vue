<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <el-row :gutter="20" :span="24">
                <el-col :span="3">
                    <div class="catalog-left-Tree">
                        <el-tree
                            ref="catalogTree"
                            :data="catalogList"
                            :default-expanded-keys = "defaultExpandedKeys"
                            :props="defaultTreeProps"
                            node-key="id"
                            highlight-current
                            :default-expand-all="false"
                            :expand-on-click-node="false"
                            lazy
                            :load="getRemoteChildren"
                            @node-click="handleNoteClick">
                        </el-tree>
                    </div>
                </el-col>
                <el-col :span="21">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-radio v-model="listQuery.choice" :label="USER" @change="choiceChange">按用户</el-radio>
                            <el-radio v-model="listQuery.choice" :label="DEPARTMENT" @change="choiceChange">按部门</el-radio>
                            <el-cascader ref="userCascader" v-if="listQuery.choice === USER"
                                         filterable placeholder="请选择用户" clearable
                                         :size="searchSize"
                                         style="margin-right:10px; width: 300px;"
                                         :options="userList"
                                         v-model="selectedUserArray"
                                         :show-all-levels="false"
                                         @change="userChange">
                            </el-cascader>
                            <el-cascader ref="userCascader" v-if="listQuery.choice === DEPARTMENT"
                                         filterable placeholder="请选择部门" clearable
                                         :size="searchSize"
                                         style="margin-right:10px; width: 300px;"
                                         :options="departmentList"
                                         v-model="selectedDepartmentArray"
                                         :show-all-levels="false"
                                         :props="{ checkStrictly: true }"
                                         @change="departmentChange">
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
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24" style="padding: 0">
                            <div id="myChart" style="width: 100%; height: 600px; margin-left: -100px"></div>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24" style="padding: 0">

                        </el-col>
                    </el-row>
                </el-col>
            </el-row>



        </div>
    </basic-container>
</template>

<script>
    import {mapGetters} from 'vuex';
    // import {deepClone} from '@/util/util';
    import echarts from 'echarts'
    import '../../../node_modules/echarts/map/js/china.js'
    import {getUserTreeBySiteId} from "@/api/resource/stationGroupUser";
    import {getStationDepartmentTree} from "@/api/resource/stationGroup";
    import {getUserCatalogTreeByUserId, getDepartmentCatalogTreeByDepartmentId} from '@/api/station/catalog';

    export default {
        name: "departmentData",
        data() {
            return {
                USER: 'user',
                DEPARTMENT: 'department',
                listQuery: {
                    siteId: this.$store.state.common.siteId,
                    choice: this.USER,
                    userId: undefined,
                    departmentId: undefined,
                    catalogId: undefined,
                    startTime: undefined,
                    endTime: undefined
                },
                userList: [],
                selectedUserArray: [],
                departmentList: [],
                selectedDepartmentArray: [],
                timeValue: [],
                catalogList: [],
                defaultExpandedKeys: [],
                defaultTreeProps: {
                    children: 'children',
                    label: 'name',
                    isLeaf: 'leaf'
                }
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
                this.listQuery.choice = this.USER;
                this.loadUserList();
            }
        },
        methods: {
            // 站点分配用户
            loadUserList() {
                getUserTreeBySiteId(this.listQuery.siteId).then(response => {
                    this.userList = response.data;
                });
            },
            // 站点所属部门及子部门
            loadDepartmentList() {
                getStationDepartmentTree(this.listQuery.siteId).then(response => {
                    this.departmentList = response.data;
                });
            },
            choiceChange(v) {
                if (v === this.USER) {
                    this.loadUserList();
                }
                if (v === this.DEPARTMENT) {
                    this.loadDepartmentList();
                }
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
            timeChange(v) {
              if (v.length > 0) {
                  this.listQuery.startTime = v[0];
                  this.listQuery.endTime = v[1];
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
            reloadList() {
                this.loadGraphicData();
            },
            resetSearch() {
                this.catalogList = [];
                this.$refs['catalogTree'].setCheckedKeys([]);
                this.selectedUserArray = [];
                this.selectedDepartmentArray = [];
                this.timeValue = [];
                this.listQuery.userId = undefined;
                this.listQuery.departmentId = undefined;
                this.listQuery.catalogId = undefined;
                this.listQuery.startTime = undefined;
                this.listQuery.endTime = undefined;
            },
            loadGraphicData() {
                console.dir(this.listQuery);

                var xAxisData = [];
                var totalData = [];
                var publishData = [];
                var verifyData = [];
                var dayAverage = [];
                var weekAverage = [];
                var monthAverage = [];
                for (var i = 0; i < 10; i++) {
                    xAxisData.push('栏目' + i);
                    totalData.push(i*10 + i);
                    publishData.push(i*10);
                    verifyData.push(i);
                    dayAverage.push(i + 2);
                    weekAverage.push(i + 5);
                    monthAverage.push(i + 10);
                }

                let myChart = echarts.init(document.getElementById('myChart'));
                myChart.setOption({
                    title: {
                        text: ''
                    },
                    legend: {
                        data: ['待审核', '已发布', '发稿总量', '平均日发稿量', '平均周发稿量', '平均月发稿量']
                    },
                    toolbox: {
                        // y: 'bottom',
                        feature: {
                            magicType: {
                                type: ['stack', 'tiled']
                            },
                            dataView: {},
                            saveAsImage: {
                                pixelRatio: 2
                            }
                        }
                    },
                    tooltip: {},
                    xAxis: {
                        data: xAxisData,
                        splitLine: {
                            show: true
                        }
                    },
                    yAxis: {
                    },
                    dataZoom: [
                        {
                            type: 'inside'
                        }
                    ],
                    series: [
                        {
                            name: '待审核',
                            type: 'bar',
                            data: verifyData
                        },
                        {
                            name: '已发布',
                            type: 'bar',
                            data: publishData
                        },
                        {
                            name: '发稿总量',
                            type: 'bar',
                            data: totalData
                        },
                        {
                            name: '平均日发稿量',
                            type: 'bar',
                            data: dayAverage
                        },
                        {
                            name: '平均周发稿量',
                            type: 'bar',
                            data: weekAverage
                        },
                        {
                            name: '平均月发稿量',
                            type: 'bar',
                            data: monthAverage
                        }
                    ]
                });
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
