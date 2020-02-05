<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <el-row :gutter="20" :span="24">
                <el-col :span="24">
                    <el-card style="width:100%;">
                        <div slot="header" class="clearfix">
                            <span>今日流量</span>
                        </div>
                        <table v-loading.body="outlineListLoading" stripe border highlight-current-row width="100%" style="border-color: #ebeef5;">
                            <tbody v-if="outlineData!=undefined">
                                <tr>
                                    <th style="width: 150px;"></th>
                                    <th align="right">浏览量(PV)</th>
                                    <th align="right">访客数(UV)</th>
                                    <th align="right">IP数</th>
                                    <th align="right">跳出率</th>
                                    <th align="right">平均访问时长</th>
                                    <th align="right">转化次数</th>
                                </tr>
                                <tr>
                                    <td align="left">{{outlineData[0][0]}}</td>
                                    <td align="right">{{outlineData[0][1]}}</td>
                                    <td align="right">{{outlineData[0][2]}}</td>
                                    <td align="right">{{outlineData[0][3]}}</td>
                                    <td align="right">{{outlineData[0][4]}}%</td>
                                    <td align="right">{{outlineData[0][5]}}</td>
                                    <td align="right">{{outlineData[0][6]}}</td>
                                </tr>
                                <tr>
                                    <td align="left">{{outlineData[1][0]}}</td>
                                    <td align="right">{{outlineData[1][1]}}</td>
                                    <td align="right">{{outlineData[1][2]}}</td>
                                    <td align="right">{{outlineData[1][3]}}</td>
                                    <td align="right">{{outlineData[1][4]}}%</td>
                                    <td align="right">{{outlineData[1][5]}}</td>
                                    <td align="right">{{outlineData[1][6]}}</td>
                                </tr>
                                <tr>
                                    <td align="left">{{outlineData[2][0]}}</td>
                                    <td align="right">
                                        <span>{{outlineData[2][1].val}}</span>
                                        <span v-if="outlineData[2][1].flag>0">
                                            <i class="el-icon-top" style="color: #f25652;font-weight: bold;"></i>
                                        </span>
                                        <span v-if="outlineData[2][1].flag<0">
                                            <i class="el-icon-bottom" style="color: #49c86b;font-weight: bold;"></i>
                                        </span>
                                    </td>
                                    <td align="right">
                                        <span>{{outlineData[2][2].val}}</span>
                                        <span v-if="outlineData[2][2].flag>0">
                                            <i class="el-icon-top" style="color: #f25652;font-weight: bold;"></i>
                                        </span>
                                        <span v-if="outlineData[2][2].flag<0">
                                            <i class="el-icon-bottom" style="color: #49c86b;font-weight: bold;"></i>
                                        </span>
                                    </td>
                                    <td align="right">
                                        <span>{{outlineData[2][3].val}}</span>
                                        <span v-if="outlineData[2][3].flag>0">
                                            <i class="el-icon-top" style="color: #f25652;font-weight: bold;"></i>
                                        </span>
                                        <span v-if="outlineData[2][3].flag<0">
                                            <i class="el-icon-bottom" style="color: #49c86b;font-weight: bold;"></i>
                                        </span>
                                    </td>
                                    <td align="right">
                                        <span>{{outlineData[2][4].val}}
                                            <span v-if="outlineData[2][4].val!='--'">%</span>
                                        </span>
                                        <span v-if="outlineData[2][4].flag>0">
                                            <i class="el-icon-top" style="color: #f25652;font-weight: bold;"></i>
                                        </span>
                                        <span v-if="outlineData[2][4].flag<0">
                                            <i class="el-icon-bottom" style="color: #49c86b;font-weight: bold;"></i>
                                        </span>
                                    </td>
                                    <td align="right">
                                        <span>{{outlineData[2][5].val}}</span>
                                        <span v-if="outlineData[2][5].flag>0">
                                            <i class="el-icon-top" style="color: #f25652;font-weight: bold;"></i>
                                        </span>
                                        <span v-if="outlineData[2][5].flag<0">
                                            <i class="el-icon-bottom" style="color: #49c86b;font-weight: bold;"></i>
                                        </span>
                                    </td>
                                    <td align="right">
                                        <span>{{outlineData[2][6].val}}</span>
                                        <span v-if="outlineData[2][6].flag>0">
                                            <i class="el-icon-top" style="color: #f25652;font-weight: bold;"></i>
                                        </span>
                                        <span v-if="outlineData[2][6].flag<0">
                                            <i class="el-icon-bottom" style="color: #49c86b;font-weight: bold;"></i>
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="left">{{outlineData[3][0]}}</td>
                                    <td align="right">{{outlineData[3][1]}}</td>
                                    <td align="right">{{outlineData[3][2]}}</td>
                                    <td align="right">{{outlineData[3][3]}}</td>
                                    <td align="right">{{outlineData[3][4]}}%</td>
                                    <td align="right">{{outlineData[3][5]}}</td>
                                    <td align="right">{{outlineData[3][6]}}</td>
                                </tr>
                                <tr>
                                    <td align="left">{{outlineData[4][0]}}</td>
                                    <td align="right">{{outlineData[4][1]}}</td>
                                    <td align="right">{{outlineData[4][2]}}</td>
                                    <td align="right">{{outlineData[4][3]}}</td>
                                    <td align="right">{{outlineData[4][4]}}%</td>
                                    <td align="right">{{outlineData[4][5]}}</td>
                                    <td align="right">{{outlineData[4][6]}}</td>
                                </tr>
                                <tr>
                                    <td align="left">{{outlineData[5][0]}}</td>
                                    <td align="right">
                                        <span :title="outlineData[5][1].date" style="cursor: pointer;">{{outlineData[5][1].val}}</span>
                                    </td>
                                    <td align="right">
                                        <span :title="outlineData[5][2].date" style="cursor: pointer;">{{outlineData[5][2].val}}</span>
                                    </td>
                                    <td align="right">
                                        <span :title="outlineData[5][3].date" style="cursor: pointer;">{{outlineData[5][3].val}}</span>
                                    </td>
                                    <td align="right">
                                        <span :title="outlineData[5][4].date" style="cursor: pointer;">{{outlineData[5][4].val}}%</span>
                                    </td>
                                    <td align="right">
                                        <span :title="outlineData[5][5].date" style="cursor: pointer;">{{outlineData[5][5].val}}</span>
                                    </td>
                                    <td align="right">
                                        {{outlineData[5][6]}}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </el-card>
                </el-col>
            </el-row>
            <!--<el-row :gutter="20" :span="24">-->
                <!--<el-col :span="24">-->
                    <!--<el-divider></el-divider>-->
                    <!--日期区间：-->
                    <!--<el-date-picker-->
                        <!--v-model="timeSlot"-->
                        <!--type="daterange"-->
                        <!--align="right"-->
                        <!--unlink-panels-->
                        <!--range-separator="至"-->
                        <!--start-placeholder="开始日期"-->
                        <!--end-placeholder="结束日期"-->
                        <!--:picker-options="pickerOptions"-->
                        <!--@change="reloadData">-->
                    <!--</el-date-picker>-->
                    <!--<el-divider></el-divider>-->
                <!--</el-col>-->
            <!--</el-row>-->
            <el-row :gutter="20" :span="24">
                <el-col :span="12">
                    <el-card style="width:100%;">
                        <div slot="header" class="clearfix">
                            <span>趋势图</span>
                        </div>
                        <div id="myChart" :style="{width: '100%', height: '400px'}"></div>
                    </el-card>
                </el-col>
                <el-col :span="12">
                    <el-card style="width:100%;">
                        <div slot="header" class="clearfix">
                            <span>Top10搜索词</span>
                        </div>
                        <el-table :data="wordData" v-loading.body="wordListLoading" stripe border highlight-current-row>
                            <el-table-column align="left" label="搜索词">
                                <template slot-scope="scope">
                                    <nobr>{{scope.row[0]}}</nobr>
                                </template>
                            </el-table-column>
                            <el-table-column align="right" label="浏览量(PV)" width="100">
                                <template slot-scope="scope">
                                    {{scope.row[1]}}
                                </template>
                            </el-table-column>
                            <el-table-column align="right" label="占比" width="100">
                                <template slot-scope="scope">
                                    {{scope.row[2]}}%
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-card>
                </el-col>
            </el-row>
            <el-row :gutter="20" :span="24">
                <el-col :span="12">
                    <el-card style="width:100%;">
                        <div slot="header" class="clearfix">
                            <span>Top10来源网站</span>
                        </div>
                        <el-table :data="sourceSiteData" v-loading.body="sourceSiteListLoading" stripe border highlight-current-row>
                            <el-table-column align="left" label="来源网站">
                                <template slot-scope="scope">
                                    <nobr>{{scope.row[0]}}</nobr>
                                </template>
                            </el-table-column>
                            <el-table-column align="right" label="浏览量(PV)" width="100">
                                <template slot-scope="scope">
                                    {{scope.row[1]}}
                                </template>
                            </el-table-column>
                            <el-table-column align="right" label="占比" width="100">
                                <template slot-scope="scope">
                                    {{scope.row[2]}}%
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-card>
                </el-col>
                <el-col :span="12">
                    <el-card style="width:100%;">
                        <div slot="header" class="clearfix">
                            <span>Top10入口页面</span>
                        </div>
                        <el-table :data="landingPageData" v-loading.body="landingPageListLoading" stripe border highlight-current-row>
                            <el-table-column align="left" label="入口页面">
                                <template slot-scope="scope">
                                    <nobr>{{scope.row[0]}}</nobr>
                                </template>
                            </el-table-column>
                            <el-table-column align="right" label="浏览量(PV)" width="100">
                                <template slot-scope="scope">
                                    {{scope.row[1]}}
                                </template>
                            </el-table-column>
                            <el-table-column align="right" label="占比" width="100">
                                <template slot-scope="scope">
                                    {{scope.row[2]}}%
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-card>
                </el-col>
            </el-row>
            <el-row :gutter="20" :span="24">
                <el-col :span="12">
                    <el-card style="width:100%;">
                        <div slot="header" class="clearfix">
                            <span>Top10受访页面</span>
                        </div>
                        <el-table :data="visitPageData" v-loading.body="visitPageListLoading" stripe border highlight-current-row>
                            <el-table-column align="left" label="受访页面">
                                <template slot-scope="scope">
                                    <nobr>{{scope.row[0]}}</nobr>
                                </template>
                            </el-table-column>
                            <el-table-column align="right" label="浏览量(PV)" width="100">
                                <template slot-scope="scope">
                                    {{scope.row[1]}}
                                </template>
                            </el-table-column>
                            <el-table-column align="right" label="占比" width="100">
                                <template slot-scope="scope">
                                    {{scope.row[2]}}%
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-card>
                </el-col>
                <el-col :span="12">
                    <el-card style="width:100%;">
                        <div slot="header" class="clearfix">
                            <span>新老访客</span>
                        </div>
                        <table v-loading.body="visitorTypeListLoading" stripe border highlight-current-row width="100%" style="border-color: #ebeef5;">
                            <tr>
                                <td align="center" style="height: 225px;">
                                    <img src="img/visit-type-icon.png"
                                         width="50"/>
                                </td>
                                <td align="left">
                                    <p>新访客</p>
                                    <p style="font-size: 22px;color:#48cb6d;">{{newVisitor.ratio}}%</p>
                                </td>
                                <td align="left">
                                    <p>老访客</p>
                                    <p style="font-size: 22px;color: #51a8f9;">{{oldVisitor.ratio}}%</p>
                                </td>
                            </tr>
                            <tr>
                                <td align="center">
                                    浏览量
                                </td>
                                <td align="left">
                                    {{newVisitor.pv_count}}
                                </td>
                                <td align="left">
                                    {{oldVisitor.pv_count}}
                                </td>
                            </tr>
                            <tr>
                                <td align="center">
                                    访客数
                                </td>
                                <td align="left">
                                    {{newVisitor.visitor_count}}
                                </td>
                                <td align="left">
                                    {{oldVisitor.visitor_count}}
                                </td>
                            </tr>
                            <tr>
                                <td align="center">
                                    跳出率
                                </td>
                                <td align="left">
                                    {{newVisitor.bounce_ratio}}%
                                </td>
                                <td align="left">
                                    {{oldVisitor.bounce_ratio}}%
                                </td>
                            </tr>
                            <tr>
                                <td align="center">
                                    平均访问时长
                                </td>
                                <td align="left">
                                    {{newVisitor.avg_visit_time}}
                                </td>
                                <td align="left">
                                    {{oldVisitor.avg_visit_time}}
                                </td>
                            </tr>
                            <tr>
                                <td align="center">
                                    平均访问页数
                                </td>
                                <td align="left">
                                    {{newVisitor.avg_visit_pages}}
                                </td>
                                <td align="left">
                                    {{oldVisitor.avg_visit_pages}}
                                </td>
                            </tr>
                        </table>
                    </el-card>
                </el-col>
            </el-row>
            <el-row :gutter="20" :span="24">
                <el-col :span="12">
                    <el-card style="width:100%;">
                        <div slot="header" class="clearfix">
                            <span>年龄分布</span>
                        </div>
                        <div id="myChart_1" :style="{width: '100%', height: '400px'}"></div>
                    </el-card>
                </el-col>
                <el-col :span="12">
                    <el-card style="width:100%;">
                        <div slot="header" class="clearfix">
                            <span>地域分布</span>
                        </div>
                        <div id="myChart_2" :style="{width: '100%', height: '400px'}"></div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getOutline,
        getWord,
        getVisitPage,
        getSourceSite,
        getLandingPage,
        getVisitorType,
        getDistrictRpt,
        getTimeTrendRpt,
        getAge,
    } from '@/api/statistics/baiduAccess';
    import echarts from 'echarts'
    import '../../../node_modules/echarts/map/js/china.js'

    export default {
        name: 'baiduAccess',
        data() {
            return {
                siteId:undefined,
                //今日流量
                outlineData: undefined,
                outlineListLoading: true,
                //Top10搜索词
                wordData: undefined,
                wordListLoading: true,
                //Top10来源网站
                sourceSiteData: undefined,
                sourceSiteListLoading: true,
                //Top10入口页面
                landingPageData: undefined,
                landingPageListLoading: true,
                //Top10受访页面
                visitPageData: undefined,
                visitPageListLoading: true,
                //新老访客
                oldVisitor: {},
                newVisitor: {},
                visitorTypeListLoading: true,
                //趋势图
                timeTrendRptData: undefined,
                timeTrendRptListLoading: true,
                //年龄分布
                ageData: undefined,
                ageListLoading: true,
                //地域分布
                districtRptData: undefined,
                districtRptListLoading: true,
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
                timeSlot: undefined
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
                this.siteId = this.$store.state.common.siteId;
                this.getOutline();
                this.reloadData();
            }
        },
        methods: {
            reloadData(){
                this.getWord();
                this.getSourceSite();
                this.getLandingPage();
                this.getVisitPage();
                this.getVisitorType();
                this.getTimeTrendRpt();
                this.getAge();
                this.getDistrictRpt();
            },
            getOutline(){
                getOutline({siteId:this.siteId}).then(response => {
                    this.outlineListLoading = false;
                    let data = JSON.parse(response.data)
                    this.outlineData = data.body.data[0].result.items;
                })
            },
            getTimeTrendRpt(){
                getTimeTrendRpt({siteId:this.siteId}).then(response => {
                    let data = JSON.parse(response.data)
                    this.timeTrendRptData = data.body.data[0].result;
                    // 基于准备好的dom，初始化echarts实例
                    let myChart = echarts.init(document.getElementById('myChart'));
                    // 绘制图表
                    myChart.setOption({
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: ["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"]
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: ["PV"]
                        },
                        toolbox: {
                            feature: {
                                saveAsImage: {}
                            }
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [{
                            data: this.timeTrendRptData.items[1].join(",").split(","),
                            stack: '总量',
                            name: 'PV',
                            type: 'line'
                        }]
                    });
                })
            },
            getWord(){
                getWord({siteId:this.siteId}).then(response => {
                    this.wordListLoading = false;
                    let data = JSON.parse(response.data)
                    this.wordData = data.body.data[0].result.items;
                })
            },
            getSourceSite(){
                getSourceSite({siteId:this.siteId}).then(response => {
                    this.sourceSiteListLoading = false;
                    let data = JSON.parse(response.data)
                    this.sourceSiteData = data.body.data[0].result.items;
                })
            },
            getLandingPage(){
                getLandingPage({siteId:this.siteId}).then(response => {
                    this.landingPageListLoading = false;
                    let data = JSON.parse(response.data)
                    this.landingPageData = data.body.data[0].result.items;
                })
            },
            getVisitPage(){
                getVisitPage({siteId:this.siteId}).then(response => {
                    this.visitPageListLoading = false;
                    let data = JSON.parse(response.data)
                    this.visitPageData = data.body.data[0].result.items;
                })
            },
            getVisitorType(){
                getVisitorType({siteId:this.siteId}).then(response => {
                    this.visitorTypeListLoading = false;
                    let data = JSON.parse(response.data)
                    this.oldVisitor = data.body.data[0].result.oldVisitor;
                    this.newVisitor = data.body.data[0].result.newVisitor;
                })
            },
            getVisitorType(){
                getVisitorType({siteId:this.siteId}).then(response => {
                    this.visitorTypeListLoading = false;
                    let data = JSON.parse(response.data)
                    this.oldVisitor = data.body.data[0].result.oldVisitor;
                    this.newVisitor = data.body.data[0].result.newVisitor;
                })
            },
            getAge(){
                getAge({siteId:this.siteId}).then(response => {
                    console.log(response.data);
                    let data = JSON.parse(response.data)
                    this.ageData = data.body.data[0].result;

                    // 基于准备好的dom，初始化echarts实例
                    let myChart = echarts.init(document.getElementById('myChart_1'));
                    // 绘制图表
                    myChart.setOption({
                        color: ['#3398DB'],
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                            },
                            formatter: '{b}<br />{a0}: {c0}%<br />'
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: ['18岁以下', '18-24岁', '25-34岁', '35-44岁', '45-54岁', '55岁以上'],
                                axisTick: {
                                    alignWithLabel: true
                                }
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value'
                            }
                        ],
                        series: [
                            {
                                name: '年龄分布',
                                type: 'bar',
                                barWidth: '60%',
                                data: this.ageData
                            }
                        ]
                    });
                })
            },
            getDistrictRpt(){
                getDistrictRpt({siteId:this.siteId}).then(response => {
                    let data = JSON.parse(response.data)
                    this.districtRptData = data.body.data[0].result;
                    let mydata = [];
                    let nameData = this.districtRptData.items[0];
                    let valueData = this.districtRptData.items[1];
                    for(let i = 0;i < nameData.length;i ++){
                        mydata.push({name:nameData[i].join(","),value:valueData[i][1]});
                    }
                    // 基于准备好的dom，初始化echarts实例
                    let myChart = echarts.init(document.getElementById('myChart_2'));
                    // 绘制图表
                    myChart.setOption({
                        backgroundColor: '#FFFFFF',
                        title: {
                            subtext: '',
                            x:'center'
                        },
                        tooltip : {
                            trigger: 'item',
                            formatter: '{b}<br />{a0}: {c0}%<br />'
                        },
                        //左侧小导航图标
                        visualMap: {
                            show : true,
                            x: 'left',
                            y: 'center',
                            splitList: [
                                {start: 80, end: 100},
                                {start: 60, end: 80},{start: 40, end: 60},
                                {start: 20, end: 40},{start: 0, end: 20},
                            ],
                            color: ['#257de6', '#5097ec','#89baf3', '#c2dcf9', '#eaf3fd']
                        },
                        //配置属性
                        series: [{
                            name: '数据',
                            type: 'map',
                            mapType: 'china',
                            roam: true,
                            label: {
                                normal: {
                                    show: true  //省份名称
                                },
                                emphasis: {
                                    show: false
                                }
                            },
                            data:mydata  //数据
                        }]
                    })
                })
            }
        }
    }
</script>
<style>
    th,td{border-color: #ebeef5;padding-left:15px;padding-right:15px;
        font-weight: normal;line-height: 40px;font-size: 14px;color:#666666;}
</style>


