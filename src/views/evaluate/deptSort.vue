<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <!--<div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
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
                    </el-form-item>
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
                </el-form>
            </div>
            <div class="deyatech-menu">
                <div class="deyatech-menu_right">
                    <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="searchReloadList">{{$t('table.search')}}</el-button>
                    <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}</el-button>
                </div>
            </div>-->

            <h3 class="table-title">按评价得分排名</h3>
            <el-table :data="deptSortByScoreList" v-loading.body="listScoreLoading" stripe border highlight-current-row>
                <el-table-column align="center" type="index" label="序号" width="50"/>
                <el-table-column align="center" label="部门名称" prop="acceptDept"/>
                <el-table-column align="center" label="评价得分" prop="score">
                    <template slot-scope="scope">
                        {{Math.round(scope.row.score * 100) / 100}}
                    </template>
                </el-table-column>
            </el-table>

            <div class="spacer"></div>

            <h3 class="table-title">按总评价数排名</h3>
            <el-table :data="deptSortByCountList" v-loading.body="listCountLoading" stripe border highlight-current-row>
                <el-table-column align="center" type="index" label="序号" width="50"/>
                <el-table-column align="center" label="部门名称" prop="acceptDept"/>
                <el-table-column align="center" label="总评价数" prop="count"/>
            </el-table>

            <div class="spacer"></div>

            <h3 class="table-title">按评价率分排名</h3>
            <el-table :data="deptSortByRateEvaluateList" v-loading.body="listRateEvaluateLoading" stripe border highlight-current-row>
                <el-table-column align="center" type="index" label="序号" width="50"/>
                <el-table-column align="center" label="部门名称" prop="acceptDept"/>
                <el-table-column align="center" label="办件数" prop="countAccept"/>
                <el-table-column align="center" label="评价数" prop="count"/>
                <el-table-column align="center" label="评价率" prop="rate">
                    <template slot-scope="scope">
                        {{Math.round(scope.row.rate * 100) / 100}}%
                    </template>
                </el-table-column>
            </el-table>

            <div class="spacer"></div>

            <h3 class="table-title">按差评比例排名</h3>
            <el-table :data="deptSortByRatePoorList" v-loading.body="listRatePoorLoading" stripe border highlight-current-row>
                <el-table-column align="center" type="index" label="序号" width="50"/>
                <el-table-column align="center" label="部门名称" prop="acceptDept"/>
                <el-table-column align="center" label="评价总数" prop="count"/>
                <el-table-column align="center" label="差评数" prop="countPoor"/>
                <el-table-column align="center" label="差评比例" prop="rate">
                    <template slot-scope="scope">
                        {{Math.round(scope.row.rate * 100) / 100}}%
                    </template>
                </el-table-column>
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
        qryDeptSortByScore,
        qryDeptSortByCount,
        qryDeptSortByRateEvaluate,
        qryDeptSortByRatePoor
    } from "../../api/evaluate/count";

    export default {
        name: 'deptSort',
        data() {
            return {
                deptSortByScoreList: [],
                deptSortByCountList: [],
                deptSortByRateEvaluateList: [],
                deptSortByRatePoorList: [],
                listScoreLoading: true,
                listCountLoading: true,
                listRateEvaluateLoading: true,
                listRatePoorLoading: true,
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
            ]),
            btnEnable() {
                return {
                    create: this.permission.detail_create,
                    update: this.permission.detail_update,
                    delete: this.permission.detail_delete
                };
            }
        },
        created(){
            this.loadDeptSortByScoreList();
            this.loadDeptSortByCountList();
            this.loadDeptSortByRateEvaluateList();
            this.loadDeptSortByRatePoorList();
        },
        methods: {
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
            loadDeptSortByScoreList() {
                this.listScoreLoading = true;
                qryDeptSortByScore().then(response => {
                    this.listScoreLoading = false;
                    this.deptSortByScoreList = response.data;
                })
            },
            loadDeptSortByCountList() {
                this.listCountLoading = true;
                qryDeptSortByCount().then(response => {
                    this.listCountLoading = false;
                    this.deptSortByCountList = response.data;
                })
            },
            loadDeptSortByRateEvaluateList() {
                this.listRateEvaluateLoading = true;
                qryDeptSortByRateEvaluate().then(response => {
                    this.listRateEvaluateLoading = false;
                    this.deptSortByRateEvaluateList = response.data;
                })
            },
            loadDeptSortByRatePoorList() {
                this.listRatePoorLoading = true;
                qryDeptSortByRatePoor().then(response => {
                    this.listRatePoorLoading = false;
                    this.deptSortByRatePoorList = response.data;
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

<style>
    .spacer {
        height: 28px;
    }
    .table-title {
        color: #909399;
    }
</style>
