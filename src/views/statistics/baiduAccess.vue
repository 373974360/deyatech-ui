<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <el-row :gutter="20" :span="24">
                <el-col :span="24">
                    <el-card style="width:100%;">
                        <div slot="header" class="clearfix">
                            <span>今日流量</span>
                        </div>
                        <el-table :data="outlineData" v-loading.body="outlineListLoading" stripe border highlight-current-row>
                            <el-table-column align="left" label="">
                                <template slot-scope="scope">
                                    {{scope.row[0]}}
                                </template>
                            </el-table-column>
                            <el-table-column align="right" label="浏览量(PV)">
                                <template slot-scope="scope">
                                    {{scope.row[1]}}
                                </template>
                            </el-table-column>
                            <el-table-column align="right" label="访客数(UV)">
                                <template slot-scope="scope">
                                    {{scope.row[2]}}
                                </template>
                            </el-table-column>
                            <el-table-column align="right" label="IP数">
                                <template slot-scope="scope">
                                    {{scope.row[3]}}
                                </template>
                            </el-table-column>
                            <el-table-column align="right" label="跳出率">
                                <template slot-scope="scope">
                                    {{scope.row[4]}}
                                </template>
                            </el-table-column>
                            <el-table-column align="right" label="平均访问时长">
                                <template slot-scope="scope">
                                    {{scope.row[5]}}
                                </template>
                            </el-table-column>
                            <el-table-column align="right" label="转化次数">
                                <template slot-scope="scope">
                                    <span>{{scope.row[6]}}</span>
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
                            <span>趋势图</span>
                        </div>
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
                <el-col :span="12">
                    <el-card style="width:100%;">
                        <div slot="header" class="clearfix">
                            <span>Top10入口页面</span>
                        </div>
                        <el-table :data="landingPageData" v-loading.body="landingPageListLoading" stripe border highlight-current-row>
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
                            <span>Top10受访页面</span>
                        </div>
                        <el-table :data="visitPageData" v-loading.body="visitPageListLoading" stripe border highlight-current-row>
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
                <el-col :span="12">
                    <el-card style="width:100%;">
                        <div slot="header" class="clearfix">
                            <span>新老访客</span>
                        </div>
                        <table v-loading.body="visitorTypeListLoading" stripe border highlight-current-row width="100%" style="border-color: #ebeef5;">
                            <tr>
                                <td align="center" style="border-color: #ebeef5;height: 210px;">
                                    <img src="img/visit-type-icon.png"
                                         width="50"/>
                                </td>
                                <td align="left" style="border-color: #ebeef5;padding-left:15px;">
                                    <p>新访客</p>
                                    <p style="font-size: 22px;color:#48cb6d;">{{newVisitor.ratio}}%</p>
                                </td>
                                <td align="left" style="border-color: #ebeef5;padding-left:15px;">
                                    <p>老访客</p>
                                    <p style="font-size: 22px;color: #51a8f9;">{{oldVisitor.ratio}}%</p>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="border-color: #ebeef5;line-height: 40px;color:#666666;">
                                    浏览量
                                </td>
                                <td align="left" style="border-color: #ebeef5;padding-left:15px;">
                                    {{newVisitor.pv_count}}
                                </td>
                                <td align="left" style="border-color: #ebeef5;padding-left:15px;">
                                    {{oldVisitor.pv_count}}
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="border-color: #ebeef5;line-height: 40px;color:#666666;">
                                    访客数
                                </td>
                                <td align="left" style="border-color: #ebeef5;padding-left:15px;">
                                    {{newVisitor.visitor_count}}
                                </td>
                                <td align="left" style="border-color: #ebeef5;padding-left:15px;">
                                    {{oldVisitor.visitor_count}}
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="border-color: #ebeef5;line-height: 40px;color:#666666;">
                                    跳出率
                                </td>
                                <td align="left" style="border-color: #ebeef5;padding-left:15px;">
                                    {{newVisitor.bounce_ratio}}%
                                </td>
                                <td align="left" style="border-color: #ebeef5;padding-left:15px;">
                                    {{oldVisitor.bounce_ratio}}%
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="border-color: #ebeef5;line-height: 40px;color:#666666;">
                                    平均访问时长
                                </td>
                                <td align="left" style="border-color: #ebeef5;padding-left:15px;">
                                    {{newVisitor.avg_visit_time}}
                                </td>
                                <td align="left" style="border-color: #ebeef5;padding-left:15px;">
                                    {{oldVisitor.avg_visit_time}}
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="border-color: #ebeef5;line-height: 40px;color:#666666;">
                                    平均访问页数
                                </td>
                                <td align="left" style="border-color: #ebeef5;padding-left:15px;">
                                    {{newVisitor.avg_visit_pages}}
                                </td>
                                <td align="left" style="border-color: #ebeef5;padding-left:15px;">
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
                    </el-card>
                </el-col>
                <el-col :span="12">
                    <el-card style="width:100%;">
                        <div slot="header" class="clearfix">
                            <span>地域分布</span>
                        </div>
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
        getAge
    } from '@/api/statistics/baiduAccess';

    export default {
        name: 'baiduAccess',
        data() {
            return {
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
                visitorTypeListLoading: true
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
            this.getOutline();
            this.getWord();
            this.getSourceSite();
            this.getLandingPage();
            this.getVisitPage();
            this.getVisitorType();
        },
        methods: {
            getOutline(){
                getOutline().then(response => {
                    this.outlineListLoading = false;
                    let data = JSON.parse(response.data)
                    this.outlineData = data.body.data[0].result.items;
                })
            },
            getWord(){
                getWord().then(response => {
                    this.wordListLoading = false;
                    let data = JSON.parse(response.data)
                    this.wordData = data.body.data[0].result.items;
                })
            },
            getSourceSite(){
                getSourceSite().then(response => {
                    this.sourceSiteListLoading = false;
                    let data = JSON.parse(response.data)
                    this.sourceSiteData = data.body.data[0].result.items;
                })
            },
            getLandingPage(){
                getLandingPage().then(response => {
                    this.landingPageListLoading = false;
                    let data = JSON.parse(response.data)
                    this.landingPageData = data.body.data[0].result.items;
                })
            },
            getVisitPage(){
                getVisitPage().then(response => {
                    this.visitPageListLoading = false;
                    let data = JSON.parse(response.data)
                    this.visitPageData = data.body.data[0].result.items;
                })
            },
            getVisitorType(){
                getVisitorType().then(response => {
                    this.visitorTypeListLoading = false;
                    let data = JSON.parse(response.data)
                    this.oldVisitor = data.body.data[0].result.oldVisitor;
                    this.newVisitor = data.body.data[0].result.newVisitor;
                })
            }
        }
    }
</script>


