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
                    <div id="departmentChart" style="width: 100%; height: 600px; margin-left: -100px"></div>
                </el-col>
            </el-row>

            <el-table :data="departmentTreeDataList" v-loading.body="listLoading" stripe border highlight-current-row
                      v-if="tableReset" max-height="500">
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
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="100">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.departmentId" :title="'栏目'" type="primary" icon="el-icon-s-data" :size="btnSize" circle
                                   @click.stop.safe="btnCatalog(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>


            <el-dialog :fullscreen="true" :title="'部门栏目数据'" :visible.sync="dialogUserCatalogDataVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeUserCatalogDataDialog">
                <el-row :gutter="20" :span="24">
                    <el-col :span="24">
                        <div id="catalogChart" style="width: 100%; height: 600px; margin-left: -100px"></div>
                    </el-col>
                </el-row>
                <el-table :data="catalogDataList" v-loading.body="listLoadingCatalog" stripe border highlight-current-row
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
                    <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="100">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.catalogId" :title="'内容'" type="primary" icon="el-icon-s-data" :size="btnSize" circle
                                       @click.stop.safe="btnTemplate(scope.row)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>

            <el-dialog :title="'用户栏目内容数据'" :visible.sync="dialogTemplateDataVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeTemplateDataDialog">
                <el-table :data="templateList" v-loading.body="templateListLoading" stripe border highlight-current-row>
                    <el-table-column align="center" label="栏目" prop="catalogName"/>
                    <el-table-column align="center" label="标题" prop="title"/>
                    <el-table-column align="center" label="发布时间" prop="publishTime"/>
                    <el-table-column align="center" label="入库时间" prop="createTime"/>
                </el-table>
                <el-pagination class="deyatech-pagination pull-right" background
                               :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                               :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                               @size-change="handleSizeChange" @current-change="handleCurrentChange">
                </el-pagination>
            </el-dialog>

        </div>
    </basic-container>
</template>

<script>
    import {mapGetters} from 'vuex';
    // import {deepClone, setExpanded} from '@/util/util';
    import echarts from 'echarts'
    import '../../../node_modules/echarts/map/js/china.js'
    import {getDepartmentData, getDepartmentCatalogData, getDepartmentCatalogTemplateData} from "@/api/statistics/departmentData";


    export default {
        name: "userData",
        data() {
            return {
                listQuery: {
                    siteId: this.$store.state.common.siteId,
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    startTime: undefined,
                    endTime: undefined,
                    departmentId: undefined,
                    catalogId: undefined
                },
                departmentTreeDataList: [],
                departmentList: [],
                timeValue: [],
                catalogDataList: [],
                catalogList: [],
                dialogUserCatalogDataVisible: false,
                listLoading: false,
                listLoadingCatalog: false,
                lastExpanded: undefined,
                tableReset: false,
                tableResetCatalog: false,
                dialogTemplateDataVisible: false,
                templateList: [],
                total: undefined,
                templateListLoading: false
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
                getDepartmentData(this.listQuery).then(response => {
                    this.tableReset = false;
                    this.departmentTreeDataList = response.data.tree;
                    this.departmentList = response.data.departments;
                    console.dir(this.departmentTreeDataList);
                    this.$nextTick(() => {
                        this.showUserGraphic();
                        this.tableReset = true
                    })
                    this.listLoading = false;
                });
            },
            resetSearch() {
                this.timeValue = [];
                this.listQuery.startTime = undefined;
                this.listQuery.endTime = undefined;
                this.listQuery.departmentId = undefined;
                this.listQuery.catalogId = undefined;
            },
            showUserGraphic() {
                var xAxisData = [];
                var totalData = [];
                var publishData = [];
                var verifyData = [];
                var dayAverage = [];
                var weekAverage = [];
                var monthAverage = [];
                for (let department of this.departmentList) {
                    xAxisData.push(department.label);
                    totalData.push(department.total);
                    publishData.push(department.publish);
                    verifyData.push(department.verify);
                    dayAverage.push(department.dayAverage);
                    weekAverage.push(department.weekAverage);
                    monthAverage.push(department.monthAverage);
                }
                let departmentChart = echarts.init(document.getElementById('departmentChart'));
                departmentChart.setOption({
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
                if (!row.departmentId) {
                    this.$message.error("只能查看用户的栏目");
                    return;
                }
                this.listQuery.departmentId = row.departmentId;
                this.listLoadingCatalog = true;
                getDepartmentCatalogData(this.listQuery).then(response => {
                    this.tableResetCatalog = false;
                    this.catalogDataList = response.data.tree;
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
                this.dialogUserCatalogDataVisible = false;
                this.listQuery.departmentId = undefined;
                this.listQuery.catalogId = undefined;
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
            },
            btnTemplate(row) {
                this.listQuery.catalogId = row.catalogId;
                this.dialogTemplateDataVisible = true;
                this.reloadTemplateList();
            },
            reloadTemplateList() {
                this.templateListLoading = true;
                this.templateList = [];
                getDepartmentCatalogTemplateData(this.listQuery).then(response => {
                    this.templateListLoading = false;
                    this.templateList = response.data.records;
                    this.total = response.data.total;
                }).catch(() => {
                    this.templateListLoading = false;
                    this.total = undefined;
                });
            },
            closeTemplateDataDialog() {
                this.listQuery.catalogId = undefined;
                this.dialogTemplateDataVisible = false;
                this.templateList = [];
                this.total = undefined;
            },
            handleSizeChange(val){
                this.listQuery.size = val;
                this.reloadTemplateList();
            },
            handleCurrentChange(val){
                this.listQuery.page = val;
                this.reloadTemplateList();
            }
        }
    }
</script>
