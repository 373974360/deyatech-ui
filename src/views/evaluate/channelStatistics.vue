<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <!--<el-form-item>
                        <el-select :size="searchSize" v-model="listQuery.levelCode" clearable :placeholder="$t('table.pleaseSelect') + '评价等级'">
                            <el-option
                                v-for="item in loadEnum('EvaluationLevelEnum')"
                                :key="item.code"
                                :label="item.value"
                                :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select :size="searchSize" v-model="listQuery.channel" clearable :placeholder="$t('table.pleaseSelect') + '评价渠道'">
                            <el-option
                                v-for="item in loadEnum('EvaluationChannelEnum')"
                                :key="item.code"
                                :label="item.value"
                                :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select :size="searchSize" v-model="listQuery.subMatter" clearable :placeholder="$t('table.pleaseSelect') + '事项主题'">
                            <el-option
                                v-for="item in loadEnum('ServiceObjectEnum')"
                                :key="item.code"
                                :label="item.value"
                                :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-input clearable :size="searchSize" :placeholder="$t('table.pleaseInput') + '事项编码'" v-model="listQuery.itemCode" style="width: 187px"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input clearable :size="searchSize" :placeholder="$t('table.pleaseInput') + '事项名称'" v-model="listQuery.itemName" style="width: 187px"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input clearable :size="searchSize" :placeholder="$t('table.pleaseInput') + '用户姓名'" v-model="listQuery.userName" style="width: 187px"></el-input>
                    </el-form-item>-->
                    <el-form-item label="评价时间">
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
                </el-form>
            </div>
            <div class="deyatech-menu">
                <div class="deyatech-menu_right">
                    <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="reloadPage">{{$t('table.search')}}</el-button>
                    <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}</el-button>
                </div>
            </div>

            <h3 class="table-title">按来源渠道统计</h3>
            <el-table :data="countByDeptChannelList" v-loading.body="listDeptChannelLoading" stripe border highlight-current-row>
                <el-table-column align="center" type="index" label="序号" width="50"/>
                <el-table-column align="center" label="部门名称" prop="acceptDept" width="150"/>
                <el-table-column align="center" label="实体大厅">
                    <template slot-scope="scope">
                        {{scope.row.countByChannelMap['3'] ? scope.row.countByChannelMap['3'].count : 0}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="占比">
                    <template slot-scope="scope">
                        {{(scope.row.countByChannelMap['5'] ? scope.row.countByChannelMap['5'].rate : 0).toFixed(2)}}%
                    </template>
                </el-table-column>
                <el-table-column align="center" label="西安政务服务网" width="120">
                    <template slot-scope="scope">
                        {{scope.row.countByChannelMap['1'] ? scope.row.countByChannelMap['1'].count : 0}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="占比">
                    <template slot-scope="scope">
                        {{(scope.row.countByChannelMap['1'] ? scope.row.countByChannelMap['1'].rate : 0).toFixed(2)}}%
                    </template>
                </el-table-column>
                <el-table-column align="center" label="I西安">
                    <template slot-scope="scope">
                        {{scope.row.countByChannelMap['2'] ? scope.row.countByChannelMap['2'].count : 0}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="占比">
                    <template slot-scope="scope">
                        {{(scope.row.countByChannelMap['2'] ? scope.row.countByChannelMap['2'].rate : 0).toFixed(2)}}%
                    </template>
                </el-table-column>
                <el-table-column align="center" label="短信">
                    <template slot-scope="scope">
                        {{scope.row.countByChannelMap['4'] ? scope.row.countByChannelMap['4'].count : 0}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="占比">
                    <template slot-scope="scope">
                        {{(scope.row.countByChannelMap['4'] ? scope.row.countByChannelMap['4'].rate : 0).toFixed(2)}}%
                    </template>
                </el-table-column>
                <!--<template v-for="item in enums['EvaluationChannelEnum']">
                    <el-table-column align="center" :label="item.value">
                        <template slot-scope="scope">
                            {{scope.row.countByChannelMap[item.code] ? scope.row.countByChannelMap[item.code].count : 0}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="占比">
                        <template slot-scope="scope">
                            {{(scope.row.countByChannelMap[item.code] ? scope.row.countByChannelMap[item.code].rate : 0).toFixed(2)}}%
                        </template>
                    </el-table-column>
                </template>-->
                <el-table-column align="center" label="总评价数" prop="count"/>
            </el-table>

            <!--<el-pagination class="deyatech-pagination pull-right" background
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                           :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>-->
        </div>
    </basic-container>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {getStore} from '@/util/store';
    import {
        qryCountByDeptChannel
    } from "../../api/evaluate/count";

    export default {
        name: 'deptStatistics',
        data() {
            return {
                countByDeptChannelList: [],
                listDeptChannelLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    channel: undefined,
                    itemCode: undefined,
                    itemName: undefined,
                    subMatter: undefined,
                    proDepartment: undefined,
                    userName: undefined,
                    levelCode: undefined,
                    anonymityFlag: undefined,
                    publicFlag: undefined,
                    evaluationTimeStart: undefined,
                    evaluationTimeEnd: undefined,
                },
                submitTimeRange: []
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
            this.reloadPage();
        },
        methods: {
            reloadPage() {
                this.loadCountByDeptChannelList();
            },
            resetSearch(){
                this.listQuery.channel = undefined;
                this.listQuery.itemCode = undefined;
                this.listQuery.itemName = undefined;
                this.listQuery.subMatter = undefined;
                this.listQuery.proDepartment = undefined;
                this.listQuery.userName = undefined;
                this.listQuery.levelCode = undefined;
                this.listQuery.anonymityFlag = undefined;
                this.listQuery.publicFlag = undefined;
                this.listQuery.evaluationTimeStart = undefined;
                this.listQuery.evaluationTimeEnd = undefined;
                this.submitTimeRange = [];
            },
            loadCountByDeptChannelList() {
                this.listDeptChannelLoading = true;
                this.countByDeptChannelList = [];
                qryCountByDeptChannel(this.listQuery).then(response => {
                    this.listDeptChannelLoading = false;
                    this.countByDeptChannelList = response.data;
                })
            },
            loadEnum(name) {
                return getStore({name: 'enums'})[name];
            },
            submitTimeRangeChange(submitTimeRange) {
                if (submitTimeRange && submitTimeRange.length > 0) {
                    this.listQuery.evaluationTimeStart = submitTimeRange[0];
                    this.listQuery.evaluationTimeEnd = submitTimeRange[1];
                } else {
                    this.listQuery.evaluationTimeStart = undefined;
                    this.listQuery.evaluationTimeEnd = undefined;
                }
            }
        }
    }
</script>

<style scoped>
    @import "../../assets/css/evaluateStatistics.css";
</style>
