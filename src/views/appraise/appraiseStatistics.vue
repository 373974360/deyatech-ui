<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-date-picker
                            style="width: 384px"
                            :size="searchSize"
                            v-model="submitTimeRange"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="datetimerange"
                            align="right"
                            start-placeholder="评价时间开始"
                            end-placeholder="评价时间结束"
                            :default-time="['00:00:00', '23:59:59']"
                            @change="submitTimeRangeChange">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button :size="searchSize" type="primary" icon="el-icon-search" @click="showEvaluateCountByTime">查询</el-button>
<!--                        <el-button :size="searchSize" icon="el-icon-delete" @click="resetSearch">{{$t('table.clear')}}</el-button>-->
                    </el-form-item>
                </el-form>
            </div>

<!--            <div class="row">-->
                <!--<div class="filter-container"></div>
                <div class="className">
                    <div class="class-item" id="levelCountByUser"></div>
                </div>-->
                <div class="className" id="countByTime"></div>
<!--            </div>-->
            <div class="splitBar"></div>
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-select :size="searchSize" :placeholder="$t('table.pleaseSelect') + '评价对象'" v-model.trim="listQuery.userId" clearable>
                            <el-option
                                v-for="item in userList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button :size="searchSize" type="primary" icon="el-icon-search" @click="showEvaluateLevelCountByUser">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="className" id="levelCountByUser"></div>
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
    import {getAllUser} from '@/api/admin/user';
    import {queryEvaluateCountByTime, queryEvaluateLevelCountByUser} from '@/api/appraise/appraiseInfo';

    export default {
        name: 'statistics',
        data() {
            return {
                userList: [],
                levelCountByUserList: [
                    {name: '非常不满意', value: 0},
                    {name: '不满意', value: 0},
                    {name: '基本满意', value: 0},
                    {name: '满意', value: 0},
                    {name: '非常满意', value: 0}
                ],
                daysList: [],
                veryDissatisfiedTotals: [],
                dissatisfiedTotals: [],
                basicSatisfiedTotals: [],
                satisfiedTotals: [],
                verySatisfiedTotals: [],
                satisfactionRates: [],
                listQuery: {
                    userId: undefined,
                    evaluationTimeStart: undefined,
                    evaluationTimeEnd: undefined
                },
                submitTimeRange: [],
            }
        },
        computed: {
            ...mapGetters([
                'textMap',
                'enums',
                'closeOnClickModal',
                'searchSize',
            ])
        },
        created() {
            this.getAllUser();
            this.getToday();
        },
        mounted() {
            this.showEvaluateCountByTime();
            this.initEvaluateLevelCountByUser();
        },
        methods: {
            getAllUser(){
                this.userList = [];
                getAllUser().then(response => {
                    this.userList = response.data;
                })
            },
            submitTimeRangeChange(submitTimeRange) {
                if (submitTimeRange && submitTimeRange.length > 0) {
                    this.listQuery.evaluationTimeStart = submitTimeRange[0];
                    this.listQuery.evaluationTimeEnd = submitTimeRange[1];
                } else {
                    this.listQuery.evaluationTimeStart = undefined;
                    this.listQuery.evaluationTimeEnd = undefined;
                }
            },
            showEvaluateLevelCountByUser() {
                this.queryEvaluateLevelCountByUser().then(() => {
                    this.initEvaluateLevelCountByUser();
                });
            },
            queryEvaluateLevelCountByUser() {
                return new Promise((resolve, reject) => {
                    if (!this.listQuery.userId) {
                        this.$message.error('请选择评价对象');
                        resolve();
                        return;
                    }
                    const query = {userId: this.listQuery.userId};
                    queryEvaluateLevelCountByUser(query).then(response => {
                        if (response.status === 200) {
                            let levelCountByUser = response.data;
                            this.levelCountByUserList = [];
                            this.levelCountByUserList.push({name: '非常不满意', value: levelCountByUser.veryDissatisfiedTotal});
                            this.levelCountByUserList.push({name: '不满意', value: levelCountByUser.dissatisfiedTotal});
                            this.levelCountByUserList.push({name: '基本满意', value: levelCountByUser.basicSatisfiedTotal});
                            this.levelCountByUserList.push({name: '满意', value: levelCountByUser.satisfiedTotal});
                            this.levelCountByUserList.push({name: '非常满意', value: levelCountByUser.verySatisfiedTotal});
                            resolve();
                        } else {
                            this.$message.error('数据加载失败')
                            reject();
                        }
                    }).catch(err => {
                        reject(err)
                    });
                })
            },
            initEvaluateLevelCountByUser() {
                const e = echarts.init(document.getElementById('levelCountByUser'));
                e.setOption({
                    title : {
                        text: '个人评价情况',
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['非常不满意','不满意','基本满意','满意','非常满意']
                    },
                    series : [
                        {
                            name: '评价详情',
                            type: 'pie',
                            radius : '50%',
                            center: ['50%', '50%'],
                            data: this.levelCountByUserList,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                });
            },
            showEvaluateCountByTime() {
                this.queryEvaluateCountByTime().then(() => {
                    this.initEvaluateCountByTime();
                });
            },
            queryEvaluateCountByTime() {
                /*if (!this.listQuery.evaluationTimeStart && !this.listQuery.evaluationTimeEnd) {
                    this.$message.error('请选择评价时间');
                    return;
                }*/
                return new Promise((resolve, reject) => {
                    queryEvaluateCountByTime(this.listQuery).then(response => {
                        if (response.status === 200) {
                            let countByTimeList = response.data;
                            this.daysList = [];
                            this.veryDissatisfiedTotals = [];
                            this.dissatisfiedTotals = [];
                            this.basicSatisfiedTotals = [];
                            this.satisfiedTotals = [];
                            this.verySatisfiedTotals = [];
                            this.satisfactionRates = [];
                            for (let detail of countByTimeList) {
                                this.daysList.push(detail.days);
                                this.veryDissatisfiedTotals.push(detail.veryDissatisfiedTotal ? detail.veryDissatisfiedTotal : 0);
                                this.dissatisfiedTotals.push(detail.dissatisfiedTotal ? detail.dissatisfiedTotal : 0);
                                this.basicSatisfiedTotals.push(detail.basicSatisfiedTotal ? detail.basicSatisfiedTotal : 0);
                                this.satisfiedTotals.push(detail.satisfiedTotal ? detail.satisfiedTotal : 0);
                                this.verySatisfiedTotals.push(detail.verySatisfiedTotal ? detail.verySatisfiedTotal : 0);
                                this.satisfactionRates.push(detail.satisfactionRate ? detail.satisfactionRate : 0);
                            }
                            resolve();
                        } else {
                            this.$message.error('数据加载失败');
                            reject();
                        }
                    }).catch(err => {
                        reject(err)
                    });
                })
            },
            initEvaluateCountByTime() {
                const e = echarts.init(document.getElementById('countByTime'));
                e.setOption({
                    title: {
                        text: '评价汇总统计'
                    },
                    legend: {
                        data: ['非常满意', '满意', '一般', '不满意', '非常不满意']
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            mark: {show: true},
                            dataView: {show: true, readOnly: false},
                            magicType: {show: true, type: ['line'/*, 'bar'*/]},
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
                            data: this.daysList
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            minInterval: 1
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
                            data: this.verySatisfiedTotals
                        },
                        {
                            name: '满意',
                            type: 'bar',
                            stack: '总分',
                            data: this.satisfiedTotals
                        },
                        {
                            name: '一般',
                            type: 'bar',
                            stack: '总分',
                            data: this.basicSatisfiedTotals
                        },
                        {
                            name: '不满意',
                            type: 'bar',
                            stack: '总分',
                            data: this.dissatisfiedTotals
                        },
                        {
                            name: '非常不满意',
                            type: 'bar',
                            stack: '总分',
                            data: this.veryDissatisfiedTotals
                        },
                        {
                            name: '满意率',
                            type: 'line',
                            yAxisIndex: 1,
                            data: this.satisfactionRates
                        }
                    ]
                })
            },
            getToday() {
                // yyyy-MM-dd HH:mm:ss
                let endTime = new Date();
                let YYYY = endTime.getFullYear();
                let m = endTime.getMonth() + 1;
                let MM = m < 10 ? ('0' + m) : m;
                let d = endTime.getDate();
                let DD = d < 10 ? ('0' + d) : d;
                // const end = new Date(YYYY, MM, DD, 23, 59, 59);
                const end = YYYY + '-' + MM + '-' + DD + ' ' + '23:59:59';

                let startTime = new Date();
                startTime.setTime(endTime.getTime() - 3600 * 1000 * 24 * 30);

                YYYY = startTime.getFullYear();
                m = startTime.getMonth() + 1;
                MM = m < 10 ? ('0' + m) : m;
                d = startTime.getDate();
                DD = d < 10 ? ('0' + d) : d;
                // const start = new Date(YYYY, MM, DD, 0, 0, 0);
                const start = YYYY + '-' + MM + '-' + DD + ' ' + '00:00:00';

                this.submitTimeRange.push(start);
                this.submitTimeRange.push(end);

                this.submitTimeRangeChange(this.submitTimeRange);
            },
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

    .class-item {
        width: 50%;
        height: 540px;
        float: left;
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
