<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-date-picker
                            :size="searchSize"
                            v-model.trim="prePeriodTimeRange"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="上期开始时间"
                            end-placeholder="上期结束时间"
                            value-format="yyyy-MM-dd"
                            :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker
                            :size="searchSize"
                            v-model.trim="curPeriodTimeRange"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="本期开始时间"
                            end-placeholder="本期结束时间"
                            value-format="yyyy-MM-dd"
                            :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="searchReloadList">{{$t('table.search')}}</el-button>
                        <el-button type="primary" :size="btnSize" @click="export2Excel" :disabled="!tenDayPriceSurveyData || tenDayPriceSurveyData.length == 0">
                            导出<i class="el-icon-download el-icon--right"></i>
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="tenDayPriceSurveyData" v-loading.body="listLoading" border highlight-current-row :span-method="spanMethod">
                <el-table-column label="西安市主要农产品旬价格调查表" align="center">
                    <el-table-column  label="西安市农业信息网络中心&（单位: 元/公斤 元/升）" :render-header="renderHeader">
                        <el-table-column
                            align="center"
                            prop="typeName"
                            label="类别">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="productName"
                            label="名称">
                        </el-table-column>
                        <el-table-column align="center" label="批发价格">
                            <el-table-column
                                align="center"
                                prop="maxWholesalePrice"
                                label="最高价"
                                :formatter="rounding">
                            </el-table-column>
                            <el-table-column
                                align="center"
                                prop="minWholesalePrice"
                                label="最低价"
                                :formatter="rounding">
                            </el-table-column>
                            <el-table-column
                                align="center"
                                prop="avgWholesalePrice"
                                label="均价"
                                :formatter="rounding">
                            </el-table-column>
                            <el-table-column
                                align="center"
                                prop="wholesaleMOM"
                                label="环比（%）"
                                :formatter="rounding">
                            </el-table-column>
                            <el-table-column
                                align="center"
                                prop="wholesaleYOY"
                                label="同比（%）"
                                :formatter="rounding">
                            </el-table-column>
                        </el-table-column>
                        <el-table-column align="center" label="零售价格">
                            <el-table-column
                                align="center"
                                prop="maxRetailPrice"
                                label="最高价"
                                :formatter="rounding">
                            </el-table-column>
                            <el-table-column
                                align="center"
                                prop="minRetailPrice"
                                label="最低价"
                                :formatter="rounding">
                            </el-table-column>
                            <el-table-column
                                align="center"
                                prop="avgRetailPrice"
                                label="均价"
                                :formatter="rounding">
                            </el-table-column>
                            <el-table-column
                                align="center"
                                prop="retailMOM"
                                label="环比（%）"
                                :formatter="rounding">
                            </el-table-column>
                            <el-table-column
                                align="center"
                                prop="retailYOY"
                                label="同比（%）"
                                :formatter="rounding">
                            </el-table-column>
                        </el-table-column>
                    </el-table-column>
                </el-table-column>
            </el-table>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {
        getTenDayPriceSurveyData,
    } from '@/api/market/daycollect';

    export default {
        name: 'dailyPriceSurvey',
        data() {
            return {
                prePeriodTimeRange: undefined,
                curPeriodTimeRange: undefined,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    prePeriodStartTime: undefined,
                    prePeriodEndTime: undefined,
                    curPeriodStartTime: undefined,
                    curPeriodEndTime: undefined,
                },
                tenDayPriceSurveyData: [],
                spanArr: [],
                listLoading: false,
                pickerOptions: {
                    // disabledDate是一个函数,参数是当前选中的日期值,这个函数需要返回一个Boolean值,
                    disabledDate: (time) => {
                        // 如果函数处理比较简单,可以直接在这里写逻辑方法
                        // return time.getTime() < Date.now() - 8.64e7

                        // 如果函数里处理的数据比较麻烦,也可以单独放在一个函数里,避免data数据太臃肿
                        return this.dealDisabledDate(time)
                    }
                },
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
            ]),
        },
        created(){

        },
        methods: {
            searchReloadList() {
                if (!this.prePeriodTimeRange || !this.curPeriodTimeRange) {
                    this.$message.error("请选择完整时间");
                    return false;
                }
                this.listQuery.prePeriodStartTime = this.prePeriodTimeRange[0];
                this.listQuery.prePeriodEndTime = this.prePeriodTimeRange[1];
                this.listQuery.curPeriodStartTime = this.curPeriodTimeRange[0];
                this.listQuery.curPeriodEndTime = this.curPeriodTimeRange[1];
                this.reloadList();
            },
            reloadList(){
                this.listLoading = true;
                this.tenDayPriceSurveyData = [];
                this.spanArr = [];
                getTenDayPriceSurveyData(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.tenDayPriceSurveyData = response.data;

                    this.initSpanArr();
                })
            },
            dealDisabledDate (time) {
                // time.getTime是把选中的时间转化成自1970年1月1日 00:00:00 UTC到当前时间的毫秒数
                // Date.now()是把今天的时间转化成自1970年1月1日 00:00:00 UTC到当前时间的毫秒数,这样比较好比较
                // return的值,true是不可以操作选择,false可以操作选择,比如下面这个判断就只能选择今天之后的时间
                return time.getTime() > Date.now()

                // 这里减8.64e7的作用是,让今天的日期可以选择,如果不减的话,今天的日期就不可以选择,判断中写<= 也是没用的,一天的毫秒数就是8.64e7
                // return time.getTime() <= Date.now()
                // return time.getTime() < Date.now() - 8.64e7
            },
            // render 事件
            renderHeader (h,{column}) { // h即为cerateElement的简写，具体可看vue官方文档
                let header = column.label.split('&');
                return h(
                    'p', {style: 'margin: 0'},
                    [
                        h('p', {style: 'float: left; margin: 0'}, header[0]),
                        h('p', {style: 'float: right; margin: 0'}, header[1])
                    ],
                );
            },
            initSpanArr() {
                // 定义一个空数组：[]
                // 定义一个变量：0
                // 遍历数据如果有相同数据 在空数组添加一个0(相同数据的起始位加1)，不相同在数据push 一个1（变量改成当前索引）
                let contactDot = 0;
                this.tenDayPriceSurveyData.forEach((item, index) => {

                    // 同比环比显示为null时显示‘-’
                    item.wholesaleMOM = !item.wholesaleMOM && item.wholesaleMOM != 0 ? '-' : item.wholesaleMOM ;
                    item.wholesaleYOY = !item.wholesaleYOY && item.wholesaleYOY != 0 ? '-' : item.wholesaleYOY ;
                    item.retailMOM = !item.retailMOM && item.retailMOM != 0 ? '-' : item.retailMOM ;
                    item.retailYOY = !item.retailYOY && item.retailYOY != 0 ? '-' : item.retailYOY ;

                    if(index === 0){
                        this.spanArr.push(1)
                    }else{
                        if(item.typeName === this.tenDayPriceSurveyData[index-1].typeName){
                            this.spanArr[contactDot] += 1;
                            this.spanArr.push(0)
                        }else{
                            contactDot = index
                            this.spanArr.push(1)
                        }
                    }
                })
            },
            spanMethod({ row, column, rowIndex, columnIndex }) {
                if(columnIndex ===0){
                    if(this.spanArr[rowIndex]){
                        return {
                            rowspan:this.spanArr[rowIndex],
                            colspan:1
                        }
                    }else{
                        return {
                            rowspan: 0,
                            colspan: 0
                        }
                    }
                }
            },
            rounding(row, column, cellValue, index) {
                if (typeof cellValue == 'number') {
                    return cellValue.toFixed(2);
                } else {
                    return cellValue;
                }
            },
            export2Excel() {
                if (!this.tenDayPriceSurveyData || this.tenDayPriceSurveyData.length == 0) {
                    this.$message.error('无导出数据');
                    return;
                }
                require.ensure([], () => {
                    const Export2excel = require('@/excel/Export2excel');
                    //对应表格输出的title
                    const tHeader1 = ['西安市主要农产品旬价格调查表'];
                    const tHeader2 = ['西安市农业信息网络中心（单位: 元/公斤 元/升）'];
                    const tHeader3 = ['类别', '名称', '批发价格', '', '', '', '', '零售价格', '', '', '', ''];
                    const tHeader4 = ['', '', '最高价', '最低价', '均价', '环比（%）', '同比（%）', '最高价', '最低价', '均价', '环比（%）', '同比（%）'];
                    // 对应表格输出的数据
                    const filterVal = ['typeName', 'productName', 'maxWholesalePrice', 'minWholesalePrice', 'avgWholesalePrice', 'wholesaleMOM',
                        'wholesaleYOY', 'maxRetailPrice', 'minRetailPrice', 'avgRetailPrice', 'retailMOM', 'retailYOY'];
                    const excelData = this.formatJson(filterVal, this.tenDayPriceSurveyData);
                    // 添加表头
                    excelData.unshift(tHeader4);
                    excelData.unshift(tHeader3);
                    excelData.unshift(tHeader2);
                    excelData.unshift(tHeader1);
                    //对应下载文件的名字
                    Export2excel.exportTenDayPriceSurveyData2Excel(excelData, '西安市主要农产品旬价格调查表excel' + new Date().toLocaleDateString().replace(/\//g,'-'));
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            },
        }
    }
</script>


