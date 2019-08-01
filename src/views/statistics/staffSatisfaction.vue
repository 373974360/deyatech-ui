<template>
    <basic-container>
        <div class="app-container calendar-list-container">
            <div class="filter-container">
                <el-select v-model="checkDeptIds" class="filter-item" multiple filterable placeholder="选择部门"
                           @change="reloadUserList">
                    <el-option :key="dept.id" v-for="dept in deptList" :label="dept.name" :value="dept.id">
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
                <el-button class="filter-item" type="primary" icon="el-icon-search" @click="doPlot">查询</el-button>
                <el-button class="filter-item" icon="el-icon-delete" @click="resetSearch">{{$t('table.clear')}}</el-button>
                <el-button class="filter-item" type="primary" icon="el-icon-download" @click="export2Excel">数据导出</el-button>
            </div>
            <div class="splitBar"></div>
            <div class="row">
                <div class="filter-container">
                </div>
                <div class="className" id="staffSatisfaction"></div>
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
    require('echarts/lib/component/dataZoom');
    import {mapGetters} from 'vuex';
    import {getPlotFiveStarByUser} from '@/api/statistics/staffSatisfaction';
    import {getAllDepartments} from  '@/api/admin/department';
    import {getUsersByWindowAndDepartment} from '@/api/admin/user';
    import {date} from '@/api/statistics/orderAndLine';

    export default {
        name: 'table_demo',
        data() {
            return {
                userData: undefined,
                userName: [],
                userOneNum: [],
                userTwoNum: [],
                userThreeNum: [],
                userFourNum: [],
                userFiveNum: [],
                userZeroNum: [],
                userSatisfactionRates: [],
                listQuery: {
                    deptIds: undefined,
                    userIds: undefined,
                    startDate: undefined,
                    endDate: undefined
                },
                checkDeptIds: [],
                checkUserIds: [],
                deptList: [],
                userList: [],
                userListQuery: {
                    departmentIds: ''
                }
            }
        },
        computed: {
            ...mapGetters([
                'textMap',
                'enums',
                'closeOnClickModal'
            ])
        },
        created() {
            this.listQuery.startDate = this.getTodayStart();
            this.listQuery.endDate = this.getTodayEnd();
            this.getDeptList();
            this.getUserList();
            this.doPlot();
        },
        methods: {
            checkDate() {
                if (this.listQuery.startDate > this.listQuery.endDate) {
                    alert("开始时间不得大于结束时间！")
                }
            },
            reloadUserList() {
                this.checkUserIds = [];
                this.getUserList();
                this.listQuery.userIds = [];
            },
            resetSearch() {
                this.checkDeptIds = [];
                this.listQuery.startDate = undefined;
                this.listQuery.endDate = undefined;
                this.reloadUserList();
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
            getUserList() {
                this.userListQuery.departmentIds = this.checkDeptIds.join();
                getUsersByWindowAndDepartment(this.userListQuery).then(response => {
                    if (response.status === 200) {
                        this.userList = response.data
                    } else {
                        this.$message.error('人员信息加载失败')
                    }
                })
            },
            doPlot() {
                if (this.listQuery.startDate > this.listQuery.endDate) {
                    alert("开始时间不得大于结束时间！")
                    return;
                }
                this.listQuery.deptIds = this.checkDeptIds.join();
                this.listQuery.userIds = this.checkUserIds.join();
                getPlotFiveStarByUser(this.listQuery).then(response => {
                    if (response.status === 200) {
                        this.userData = response.data;
                        this.userName = [];
                        this.userOneNum = [];
                        this.userTwoNum = [];
                        this.userThreeNum = [];
                        this.userFourNum = [];
                        this.userFiveNum = [];
                        this.userZeroNum = [];
                        this.userSatisfactionRates = [];
                        for (let user of this.userData) {
                            this.userName.push(user.userName);
                            this.userOneNum.push(user.onetotal);
                            this.userTwoNum.push(user.twototal);
                            this.userThreeNum.push(user.threetotal);
                            this.userFourNum.push(user.fourtotal);
                            this.userFiveNum.push(user.fivetotal);
                            this.userZeroNum.push(user.zerototal);
                            this.userSatisfactionRates.push(user.satisfactionRate);
                        }
                        const e = echarts.init(document.getElementById('staffSatisfaction'));
                        e.setOption({
                            title: {
                                text: '五星级服务员'
                            },
                            legend: {
                                data: ['非常满意', '满意', '一般', '不满意', '非常不满意', '未评价']
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
                                    axisLabel: {
                                        interval: 0,
                                        rotate: 45
                                    },
                                    data: this.userName
                                }
                            ],
                            dataZoom: [
                                {
                                    show: true,
                                    start: 0,
                                    end: 100
                                },
                                {
                                    type: 'inside',
                                    start: 0,
                                    end: 100
                                },
                                {
                                    show: true,
                                    yAxisIndex: 0,
                                    filterMode: 'empty',
                                    width: 30,
                                    showDataShadow: false,
                                    left: '6%'
                                }
                            ],
                            yAxis: [
                                {
                                    type: 'value'
                                },
                                {
                                    type: 'value',
                                    min: 0,
                                    max: 100,
                                    interval: 10,
                                    axisLabel: {
                                        formatter: '{value}.00 %'
                                    }
                                }
                            ],
                            series: [
                                {
                                    name: '非常满意',
                                    type: 'bar',
                                    stack: '总分',
                                    data: this.userFiveNum
                                },
                                {
                                    name: '满意',
                                    type: 'bar',
                                    stack: '总分',
                                    data: this.userFourNum
                                },
                                {
                                    name: '一般',
                                    type: 'bar',
                                    stack: '总分',
                                    data: this.userThreeNum
                                },
                                {
                                    name: '不满意',
                                    type: 'bar',
                                    stack: '总分',
                                    data: this.userTwoNum
                                },
                                {
                                    name: '非常不满意',
                                    type: 'bar',
                                    stack: '总分',
                                    data: this.userOneNum
                                },
                                {
                                    name: '未评价',
                                    type: 'bar',
                                    stack: '总分',
                                    data: this.userZeroNum
                                },
                                {
                                    name: '满意率',
                                    type: 'line',
                                    yAxisIndex: 1,
                                    data: this.userSatisfactionRates
                                }
                            ]
                        })
                    } else {
                        this.$message.error('数据加载失败')
                    }
                })
            },
            getTodayStart() {
                return date(new Date(), 'YYYY-MM-DD');
            },
            getTodayEnd() {
                return date(new Date(), 'YYYY-MM-DD');
            },
            export2Excel() {
                require.ensure([], () => {
                    const Export2excel = require('@/excel/Export2excel');
                    //对应表格输出的title
                    const tHeader = ['姓名', '非常满意', '满意', '一般', '不满意', "非常不满意", '未评价', '满意率'];
                    // 对应表格输出的数据
                    const filterVal = ['userName', 'fivetotal', 'fourtotal', 'threetotal', 'twototal', 'onetotal', 'zerototal', 'satisfactionRate'];
                    const excelData = this.formatJson(filterVal, this.userData);
                    //对应下载文件的名字
                    Export2excel.export2Excel(tHeader, excelData, '五星级服务员excel' + new Date().toLocaleDateString().replace(/\//g,'-'));
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            }
        }
    }
</script>
<style>
    .row {
        margin-right: -15px;
        margin-left: -15px;
    }

    .className {
        width: 100%;
        height: 540px
    }

    .filter-item {
        display: inline-block;
        vertical-align: middle;
        margin-bottom: 10px;
        margin-left: 10px;
    }

    .splitBar {
        height: 60px;
    }
</style>
