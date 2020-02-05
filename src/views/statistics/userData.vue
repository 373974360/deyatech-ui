<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <el-row :gutter="20" :span="24">
                <el-col :span="24">
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
                    <el-button type="primary"
                               icon="el-icon-search"
                               :size="searchSize"
                               @click="reloadList">{{$t('table.search')}}</el-button>
                    <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}</el-button>
                </el-col>
            </el-row>

            <el-row :gutter="20" :span="24">
                <el-col :span="24">
                    <div id="userChart" style="width: 100%; height: 600px; margin-left: -100px"></div>
                </el-col>
            </el-row>

            <el-table :data="departmentUserTreeDataList" v-loading.body="listLoading" stripe border highlight-current-row
                      v-if="tableReset" max-height="500">
                <el-table-tree-column fixed :expand-all="true" :indent-size="20"
                                      child-key="children" levelKey="level" treeKey="value" parentKey="parentId" prop="label" label="名称" >
                </el-table-tree-column>
                <el-table-column align="center" label="总发稿量" prop="total" width="200"/>
                <el-table-column align="center" label="已发布" prop="publish" width="200"/>
                <el-table-column align="center" label="待审" prop="verify" width="200"/>
                <el-table-column align="center" label="采纳率" prop="adoptRate" width="200"/>
                <el-table-column align="center" label="日平均发稿量" prop="dayAverage" width="200"/>
                <el-table-column align="center" label="周平均发稿量" prop="weekAverage" width="200"/>
                <el-table-column align="center" label="月平均发稿量" prop="monthAverage" width="200"/>
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="100">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.userId" :title="'栏目'" type="primary" icon="el-icon-s-data" :size="btnSize" circle
                                   @click.stop.safe="btnCatalog(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>


            <el-dialog :fullscreen="true" :title="'用户栏目数据'" :visible.sync="dialogUserCatalogDataVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeUserCatalogDataDialog">
                <el-row :gutter="20" :span="24">
                    <el-col :span="24">
                        <div id="catalogChart" style="width: 100%; height: 600px; margin-left: -100px"></div>
                    </el-col>
                </el-row>
                <el-table :data="userCatalogDataList" v-loading.body="listLoadingCatalog" stripe border highlight-current-row
                          v-if="tableResetCatalog" max-height="500">
                    <el-table-tree-column fixed :expand-all="true" :indent-size="20"
                                          child-key="children" levelKey="level" treeKey="value" parentKey="parentId" prop="label" label="名称" >
                    </el-table-tree-column>
                    <el-table-column align="center" label="总发稿量" prop="totalShow" width="200"/>
                    <el-table-column align="center" label="已发布" prop="publishShow" width="200"/>
                    <el-table-column align="center" label="待审" prop="verifyShow" width="200"/>
                    <el-table-column align="center" label="采纳率" prop="adoptRateShow" width="200"/>
                    <el-table-column align="center" label="日平均发稿量" prop="dayAverageShow" width="200"/>
                    <el-table-column align="center" label="周平均发稿量" prop="weekAverageShow" width="200"/>
                    <el-table-column align="center" label="月平均发稿量" prop="monthAverageShow" width="200"/>
                </el-table>

            </el-dialog>

        </div>
    </basic-container>
</template>

<script>
    import {mapGetters} from 'vuex';
    // import {deepClone, setExpanded} from '@/util/util';
    import echarts from 'echarts'
    import '../../../node_modules/echarts/map/js/china.js'
    import {getDepartmentUserTreeDataList, getUserCatalogDataList} from "@/api/statistics/userData";


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
                userList: [],
                timeValue: [],
                userCatalogDataList: [],
                catalogList: [],
                dialogUserCatalogDataVisible: false,
                listLoading: false,
                listLoadingCatalog: false,
                lastExpanded: undefined,
                tableReset: false,
                tableResetCatalog: false
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
            if (this.$store.state.common.siteId) {
                this.listQuery.siteId = this.$store.state.common.siteId;
                this.reloadList();
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
                this.listLoading = true;
                getDepartmentUserTreeDataList(this.listQuery).then(response => {
                    this.tableReset = false;
                    this.departmentUserTreeDataList = response.data.tree;
                    this.userList = response.data.users;
                    this.$nextTick(() => {
                        this.showUserGraphic();
                        this.tableReset = true
                    })
                    this.listLoading = false;
                });
            },
            resetSearch() {
                this.timeValue = [];
                this.listQuery.userId = undefined;
                this.listQuery.startTime = undefined;
                this.listQuery.endTime = undefined;
            },
            showUserGraphic() {
                var xAxisData = [];
                var totalData = [];
                var publishData = [];
                var verifyData = [];
                var dayAverage = [];
                var weekAverage = [];
                var monthAverage = [];
                for (let user of this.userList) {
                    xAxisData.push(user.userName);
                    totalData.push(user.total);
                    publishData.push(user.publish);
                    verifyData.push(user.verify);
                    dayAverage.push(user.dayAverage);
                    weekAverage.push(user.weekAverage);
                    monthAverage.push(user.monthAverage);
                }
                let userChart = echarts.init(document.getElementById('userChart'));
                userChart.setOption({
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
            },

            btnCatalog(row) {
                if (!row.userId) {
                    this.$message.error("只能查看用户的栏目");
                    return;
                }
                this.listQuery.userId = row.userId;
                this.listLoadingCatalog = true;
                getUserCatalogDataList(this.listQuery).then(response => {
                    this.tableResetCatalog = false;
                    this.userCatalogDataList = response.data.tree;
                    this.catalogList = response.data.catalogs;
                    this.$nextTick(() => {
                        this.showCatalogGraphic();
                        this.tableResetCatalog = true
                    })
                    this.listLoadingCatalog = false;
                });
                this.dialogUserCatalogDataVisible = true;
            },
            closeUserCatalogDataDialog() {
                this.listQuery.userId = undefined;
                this.dialogUserCatalogDataVisible = false;
            },
            showCatalogGraphic() {
                var xAxisData = [];
                var totalData = [];
                var publishData = [];
                var verifyData = [];
                var dayAverage = [];
                var weekAverage = [];
                var monthAverage = [];
                for (let catalog of this.catalogList) {
                    xAxisData.push(catalog.catalogName);
                    totalData.push(catalog.total);
                    publishData.push(catalog.publish);
                    verifyData.push(catalog.verify);
                    dayAverage.push(catalog.dayAverage);
                    weekAverage.push(catalog.weekAverage);
                    monthAverage.push(catalog.monthAverage);
                }
                let catalogChart = echarts.init(document.getElementById('catalogChart'));
                catalogChart.setOption({
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
