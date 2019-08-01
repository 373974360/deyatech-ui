<template>
    <basic-container>
    <div class="app-container order-line">
        <div class="card-container">
            <div class="sum-msg">今日累计抽号排队数：<span>{{total.todayCountTotal}}</span>人次</div>
            <div :span="8">
                <el-card>
                    <div class="card-title">当前等待人数：<span>{{total.currentWaitTotal}}</span>人</div>
                    <div class="card-title">平均等待时长：<span>{{total.avgWaitTimeTotal}}</span>分钟</div>
                </el-card>
            </div>
        </div>
        <div class="splitBar"></div>
        <div class="chart-container">
            <div class="filter-container">
                <el-select v-model="checkItemIds" class="filter-item" multiple filterable placeholder="选择事项">
                    <el-option :key="item.id" v-for="item in itemList" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
                <el-select v-model="checkDeptIds" class="filter-item" multiple filterable placeholder="选择部门"
                           @change="reloadItemUserList">
                    <el-option :key="dept.id" v-for="dept in deptList" :label="dept.name" :value="dept.id">
                    </el-option>
                </el-select>
                <el-select v-model="checkWindowIds" class="filter-item" multiple filterable placeholder="选择窗口"
                           @change="reloadItemUserList">
                    <el-option :key="window.id" v-for="window in windowList" :label="window.name" :value="window.id">
                    </el-option>
                </el-select>
                <el-select v-model="checkUserIds" class="filter-item" multiple filterable placeholder="选择人员">
                    <el-option :key="user.id" v-for="user in userList" :label="user.name" :value="user.id">
                    </el-option>
                </el-select>
                <el-date-picker class="filter-item" v-model="listQuery.startDate" type="date" :editable="false"
                                placeholder="开始时间" :clearable="false" format="yyyy-MM-dd" clearable
                                value-format="yyyy-MM-dd" @change="checkDate">
                </el-date-picker>
                <el-date-picker class="filter-item" v-model="listQuery.endDate" type="date" :editable="false"
                                placeholder="结束时间" :clearable="false" format="yyyy-MM-dd" clearable
                                value-format="yyyy-MM-dd" @change="checkDate">
                </el-date-picker>
                <el-button class="filter-item" type="primary" icon="el-icon-search" @click="doPlot">统计</el-button>
                <el-button class="filter-item" icon="el-icon-delete" @click="resetSearch">{{$t('table.clear')}}</el-button>
            </div>
            <div class="className" id="lineWaitTime"></div>
        </div>
        <div class="splitBar"></div>
        <div class="line-top5">
            <div class="title">排队等待时长 Top 5</div>
            <el-radio-group style="margin-left: 20px" v-model="tableDataType" @change="lineWaitTimeTop5">
                <el-radio-button label="1" >按窗口</el-radio-button>
                <el-radio-button label="2">按事项</el-radio-button>
            </el-radio-group>
            <el-row style="padding:20px;" :gutter="20">
                <div v-show="windowDisplay">
                    <el-col :span="12">
                        <el-table :data="windowWaitTopListAsc" v-loading.body="windowWaitTopListLoading" border fit
                                  highlight-current-row>
                            <el-table-column type="index" label="排名" width="80" align="center"></el-table-column>
                            <el-table-column align="center" label="窗口">
                                <template scope="scope">
                                    <span>{{scope.row.windowName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="所属部门">
                                <template scope="scope">
                                    <span>{{scope.row.deptName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="平均等待时间(分)">
                                <template scope="scope">
                                    <span>{{scope.row.avgWaitTimeTotal}}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>

                    <el-col :span="12">
                        <el-table :data="windowWaitTopListDesc" v-loading.body="windowWaitTopListLoading" border fit
                                  highlight-current-row>
                            <el-table-column type="index" label="排名" width="80" align="center"></el-table-column>
                            <el-table-column align="center" label="窗口">
                                <template scope="scope">
                                    <span>{{scope.row.windowName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="所属部门">
                                <template scope="scope">
                                    <span>{{scope.row.deptName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="平均等待时间(分)">
                                <template scope="scope">
                                    <span>{{scope.row.avgWaitTimeTotal}}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </div>

                <div v-show="itemDisplay">
                    <el-col :span="12">
                        <el-table :data="itemWaitTopListAsc" v-loading.body="itemWaitTopListLoading" border fit
                                  highlight-current-row>
                            <el-table-column type="index" label="排名" width="80" align="center"></el-table-column>
                            <el-table-column align="center" label="事项">
                                <template scope="scope">
                                    <div style="height:2em;overflow:hidden">{{scope.row.itemName}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="所属部门">
                                <template scope="scope">
                                    <div>{{scope.row.deptName}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="平均等待时间(分)">
                                <template scope="scope">
                                    <span>{{scope.row.avgWaitTimeTotal}}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>

                    <el-col :span="12">
                        <el-table :data="itemWaitTopListDesc" v-loading.body="itemWaitTopListLoading" border fit
                                  highlight-current-row>
                            <el-table-column type="index" label="排名" width="80" align="center"></el-table-column>
                            <el-table-column align="center" label="事项">
                                <template scope="scope">
                                    <div style="height:2em;overflow:hidden">{{scope.row.itemName}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="所属部门">
                                <template scope="scope">
                                    <div>{{scope.row.deptName}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="平均等待时间(分)">
                                <template scope="scope">
                                    <span>{{scope.row.avgWaitTimeTotal}}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </div>
            </el-row>
        </div>
    </div>
    </basic-container>
</template>
<script>
    const echarts = require('echarts/lib/echarts');
    require('echarts/lib/chart/bar');
    require('echarts/lib/chart/pie');
    require('echarts/lib/chart/line');
    require('echarts/lib/component/tooltip');
    require('echarts/lib/component/legend');
    require('echarts/lib/component/toolbox');
    require('echarts/lib/component/title');
    require('echarts/lib/component/visualMap');
    import {date,
        dataPlotQueueCount,
        dataPlotCount,
        dataPlotTopWaitWindow,
        dataPlotTopWaitItem
    } from '@/api/statistics/orderAndLine';
    import {getItemsByWindowAndDepartment} from '@/api/item/item';
    import {getAllDepartments} from  '@/api/admin/department';
    import {getAllWindows} from '@/api/number/window';
    import {getUsersByWindowAndDepartment} from '@/api/admin/user';

    export default {
        name: 'orderAndLine',
        data() {
            return {
                total: '',
                listQuery: {
                    itemIds: undefined,
                    deptIds: undefined,
                    windowIds: undefined,
                    userIds: undefined,
                    startDate: undefined,
                    endDate: undefined
                },
                checkItemIds: [],
                checkDeptIds: [],
                checkWindowIds: [],
                checkUserIds: [],
                itemListQuery: {
                    departmentIds: '',
                    windowIds: ''
                },
                userListQuery: {
                    departmentIds: '',
                    windowIds: ''
                },
                tableDataType: '1',
                itemList: [],
                windowList: [],
                deptList: [],
                userList: [],
                windowDisplay: true,
                itemDisplay: false,
                lineNum: [],
                waitTime: [],
                windowWaitTopListAsc: [],
                windowWaitTopListDesc: [],
                itemWaitTopListAsc: [],
                itemWaitTopListDesc: [],
                windowWaitTopListLoading: false,
                itemWaitTopListLoading: false
            }
        },
        created() {
            this.listQuery.startDate = this.getTodayStart();
            this.listQuery.endDate = this.getTodayEnd();
            this.getItemList();
            this.getDeptList();
            this.getWindowList();
            this.getUserList();
            this.plotQueueCount();
            this.doPlot();
        },
        methods: {
            checkDate() {
                if (this.listQuery.startDate > this.listQuery.endDate) {
                    alert("开始时间不得大于结束时间！")
                }
            },
            resetSearch() {
                this.checkDeptIds = [];
                this.checkWindowIds = [];
                this.listQuery.startDate = undefined;
                this.listQuery.endDate = undefined;
                this.reloadItemUserList();
            },
            getItemList() {
                this.itemListQuery.departmentIds = this.checkDeptIds.join();
                this.itemListQuery.windowIds = this.checkWindowIds.join();
                getItemsByWindowAndDepartment(this.itemListQuery).then(response => {
                    if (response.status === 200) {
                        this.itemList = response.data
                    } else {
                        this.$message.error('事项信息加载失败')
                    }
                })
            },
            getDeptList() {
                getAllDepartments().then(response => {
                    if (response.status === 200) {
                        this.deptList = response.data;
                    } else {
                        this.$message.error('部门信息加载失败')
                    }
                })
            },
            getWindowList() {
                getAllWindows().then(response => {
                    if (response.status === 200) {
                        this.windowList = response.data;
                    } else {
                        this.$message.error('窗口信息加载失败')
                    }
                })
            },
            getUserList() {
                this.userListQuery.departmentIds = this.checkDeptIds.join();
                this.userListQuery.windowIds = this.checkWindowIds.join();
                getUsersByWindowAndDepartment(this.userListQuery).then(response => {
                    if (response.status === 200) {
                        this.userList = response.data
                    } else {
                        this.$message.error('人员信息加载失败')
                    }
                })
            },
            reloadItemUserList() {
                this.reloadItemList();
                this.reloadUserList();
            },
            reloadItemList() {
                this.checkItemIds = [];
                this.getItemList();
                this.listQuery.itemIds = [];
            },
            reloadUserList() {
                this.checkUserIds = [];
                this.getUserList();
                this.listQuery.userIds = [];
            },
            plotQueueCount() {
                dataPlotQueueCount().then(response => {
                    if (response.status === 200) {
                        this.total = response.data;
                    } else {
                        this.$message.error('数据加载失败');
                    }
                })
            },
            doPlot() {
                if (this.listQuery.startDate > this.listQuery.endDate) {
                    alert("开始时间不得大于结束时间！")
                    return;
                }
                this.listQuery.itemIds = this.checkItemIds.join();
                this.listQuery.deptIds = this.checkDeptIds.join();
                this.listQuery.windowIds = this.checkWindowIds.join();
                this.listQuery.userIds = this.checkUserIds.join();
                dataPlotCount(this.listQuery).then(response => {
                    if (response.status === 200) {
                        console.log("response:" + JSON.stringify(response))
                        const lineWaitData = response.data;
                        this.lineNum = [];
                        this.waitTime = [];
                        this.lineNum.push(
                            lineWaitData.countWaitHour8,
                            lineWaitData.countWaitHour9,
                            lineWaitData.countWaitHour10,
                            lineWaitData.countWaitHour11,
                            lineWaitData.countWaitHour12,
                            lineWaitData.countWaitHour13,
                            lineWaitData.countWaitHour14,
                            lineWaitData.countWaitHour15,
                            lineWaitData.countWaitHour16,
                            lineWaitData.countWaitHour17);
                        this.waitTime.push(
                            lineWaitData.avgWaitHour8,
                            lineWaitData.avgWaitHour9,
                            lineWaitData.avgWaitHour10,
                            lineWaitData.avgWaitHour11,
                            lineWaitData.avgWaitHour12,
                            lineWaitData.avgWaitHour13,
                            lineWaitData.avgWaitHour14,
                            lineWaitData.avgWaitHour15,
                            lineWaitData.avgWaitHour16,
                            lineWaitData.avgWaitHour17);
                        const e = echarts.init(document.getElementById('lineWaitTime'));
                        e.setOption({
                            legend: {
                                data: ['排队数', '等待时长']
                            },
                            tooltip: {
                                trigger: 'axis'
                            },
                            toolbox: {
                                show: true,
                                feature: {
                                    mark: {show: true},
                                    dataView: {show: true, readOnly: false},
                                    magicType: {show: true, type: ['line', 'bar']},
                                    restore: {show: true},
                                    saveAsImage: {show: true}
                                }
                            },
                            calculable: true,
                            xAxis: [
                                {
                                    type: 'category',
                                    data: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']
                                }
                            ],
                            yAxis: [
                                {
                                    type: 'value',
                                    name: '人'
                                },
                                {
                                    type: 'value',
                                    name: '分钟'
                                }
                            ],
                            series: [
                                {
                                    name: '排队数',
                                    type: 'bar',
                                    itemStyle: {
                                        normal: {
                                            color: new echarts.graphic.LinearGradient(
                                                0, 0, 0, 1,
                                                [
                                                    {offset: 0, color: '#83bff6'},
                                                    {offset: 0.5, color: '#188df0'},
                                                    {offset: 1, color: '#188df0'}
                                                ]
                                            )
                                        },
                                        emphasis: {
                                            color: new echarts.graphic.LinearGradient(
                                                0, 0, 0, 1,
                                                [
                                                    {offset: 0, color: '#2378f7'},
                                                    {offset: 0.7, color: '#2378f7'},
                                                    {offset: 1, color: '#83bff6'}
                                                ]
                                            )
                                        }
                                    },
                                    barMaxWidth: '150',
                                    data: this.lineNum
                                },
                                {
                                    name: '等待时长',
                                    type: 'line',
                                    yAxisIndex: 1,
                                    data: this.waitTime
                                }
                            ]
                        })
                    } else {
                        this.$message.error('数据加载失败')
                    }
                });
                this.lineWaitTimeTop5();
            },
            lineWaitTimeTop5() {
                if (this.tableDataType == 1) {
                    this.loadTop5WindowData();
                    this.windowDisplay = true;
                    this.itemDisplay = false;
                } else {
                    this.loadTop5ItemData();
                    this.windowDisplay = false;
                    this.itemDisplay = true;
                }
            },
            loadTop5WindowData() {
                this.windowWaitTopListLoading = true;
                dataPlotTopWaitWindow(this.listQuery).then(response => {
                    this.windowWaitTopListLoading = false;
                    if (response.status === 200) {
                        this.windowWaitTopListAsc = response.data.asc;
                        this.windowWaitTopListDesc = response.data.desc;
                    } else {
                        this.$message.error('加载失败');
                    }
                });
            },
            loadTop5ItemData() {
                this.itemWaitTopListLoading = true;
                dataPlotTopWaitItem(this.listQuery).then(response => {
                    this.itemWaitTopListLoading = false;
                    if (response.status === 200) {
                        this.itemWaitTopListAsc = response.data.asc;
                        this.itemWaitTopListDesc = response.data.desc;
                    } else {
                        this.$message.error('加载失败');
                    }
                });
            },
            getTodayStart() {
                return date(new Date(), 'YYYY-MM-DD');
            },
            getTodayEnd() {
                return date(new Date(), 'YYYY-MM-DD');
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .order-line {
        .card-container {
            .sum-msg {
                font-weight: bold;
                font-size: 24px;
                text-align: center;
                padding: 12px 0 12px 0;
                span {
                    font-size: 36px;
                    color: burlywood;
                }
            }
            .el-card {
                width: 350px;
                margin-left: 40%;
                .card-title {
                    font-weight: bold;
                    font-size: 20px;
                    text-align: center;
                    padding-bottom: 10px;
                    span {
                        font-size: 36px;
                        color: burlywood;
                    }
                }
            }

        }

        .chart-container {
            .filter-container {
                .filter-item {
                    display: inline-block;
                    vertical-align: middle;
                    margin-bottom: 10px;
                    margin-left: 10px;
                }
            }
            .className {
                width: 100%;
                height: 540px;
            }
        }

        .line-top5 {
            .title {
                font-weight: bold;
                font-size: 20px;
                text-align: center;
            }
        }

        .splitBar {
            height: 60px;
        }


    }
</style>
