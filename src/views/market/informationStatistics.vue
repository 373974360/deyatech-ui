<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-date-picker
                            :size="searchSize"
                            v-model.trim="dateRange"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="searchGetStatisticsInfo">{{$t('table.search')}}</el-button>
                        <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="splitBar"></div>
            <div class="row">
                <div class="filter-container">
                </div>
                <div class="className" id="informationStatistics"></div>
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
    import {
        getStatisticsInfo
    } from '@/api/market/information';

    export default {
        name: 'informationStatistics',
        data() {
            return {
                dateRange: undefined,
                listQuery: {
                    startDate: undefined,
                    endDate: undefined
                },
                statisticsInfo: undefined,
                categoryName: [],
                memberCategoryName: [],
                seriesData: [],
            }
        },
        computed: {
            ...mapGetters([
                'textMap',
                'enums',
                'closeOnClickModal',
                'permission',
                'titleMap',
                'enums',
                'searchSize',
                'btnSize'
            ])
        },
        created() {
            this.getStatisticsInfo();
        },
        methods: {
            resetSearch() {
                this.listQuery.startDate = undefined;
                this.listQuery.endDate = undefined;
            },
            searchGetStatisticsInfo() {
                if (this.dateRange) {
                    this.listQuery.startDate = this.dateRange[0];
                    this.listQuery.endDate = this.dateRange[1];
                }
                this.getStatisticsInfo();
            },
            getStatisticsInfo() {
                this.categoryName = [];
                this.memberCategoryName = [];
                this.seriesData = [];
                getStatisticsInfo(this.listQuery).then(response => {
                    if (response.status === 200) {
                        this.statisticsInfo = response.data;
                        this.getSeriesData();
                        for (let info of this.statisticsInfo) {
                            if (this.categoryName.indexOf(info.categoryName) == -1) {
                                this.categoryName.push(info.categoryName);
                            }
                            if (this.memberCategoryName.indexOf(info.memberCategoryName) == -1) {
                                this.memberCategoryName.push(info.memberCategoryName);
                            }
                        }
                        const e = echarts.init(document.getElementById('informationStatistics'));
                        e.setOption({
                            title: {
                                text: '市场供求信息统计'
                            },
                            legend: {
                                data: this.categoryName
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
                            xAxis: [
                                {
                                    type: 'category',
                                    axisLabel: {
                                        interval: 0,
                                        rotate: 45
                                    },
                                    data: this.memberCategoryName
                                }
                            ],
                            yAxis: [
                                {
                                    type: 'value'
                                }
                            ],
                            series: this.seriesData
                        })
                    } else {
                        this.$message.error('数据加载失败')
                    }
                })
            },
            getSeriesData() {
                const groupArray = this.groupBy(this.statisticsInfo, function (item) {
                    return [item.categoryName];
                });
                for (let categoryArray of groupArray) {
                    const data = []
                    for (let categoryData of categoryArray) {
                        data.push(categoryData.total)
                    }
                    this.seriesData.push({
                        name: categoryArray[0].categoryName,
                        type: 'bar',
                        stack: '总数',
                        data: data
                    })
                }
            },

            /**
             * 按条件分组
             * 1. 函数groupBy有两个形参，一为对象数组，二为匿名函数（该函数功能：返回对象的某个指定属性的属性值并存放在数组中）；
             * 2. groupBy函数内，先创建一个空对象；
             * 3. 然后forEach遍历对象数组，遍历时要执行的函数中只有一个形参o（数组中的每个元素）；
             * 4. 由于下面函数调用是想用name来分组，因此let group = JSON.stringify( f(o) )，相当于先获取到对象数组list中的name属性对应的属性值并放入数组中：["John"]，然后再将属性值转换为json字符串：'["John"]'；
             * 5. groups[group] = groups[group] || []，在js中对象也是关联数组，因此这里相当于做了两件事，一是把group作为groups的key，二是将对应的value初始化，第一次执行为空数组，循环执行时找到相同的name时保持不变；
             * 6. groups[group].push( o )，这句相当于把list中每个对象压入数组中作为value；
             * 7. 最后，Object.keys(groups)是取出groups对象中的所有key，然后遍历一个个key组成的新数组，返回分好了组的二维数组
             */
            groupBy(array, f) {
                const groups = {};
                array.forEach(function (o) {
                    const group = JSON.stringify(f(o));
                    groups[group] = groups[group] || [];
                    groups[group].push(o);
                });
                return Object.keys(groups).map(function (group) {
                    return groups[group];
                });
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

    .splitBar {
        height: 60px;
    }
</style>
