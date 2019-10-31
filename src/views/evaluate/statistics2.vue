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
            <el-table :data="detailList" v-loading.body="listLoading" stripe border highlight-current-row>
                <el-table-column align="center" label="部门名称" prop="acceptDept"/>
                <el-table-column align="center" label="非常满意">
                    <template slot-scope="scope">
                        {{scope.row.countByLevelMap['5'] ? scope.row.countByLevelMap['5'].count : 0}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="占比">
                    <template slot-scope="scope">
                        {{(scope.row.countByLevelMap['5'] ? scope.row.countByLevelMap['5'].rate : 0).toFixed(2)}}%
                    </template>
                </el-table-column>
                <el-table-column align="center" label="满意">
                    <template slot-scope="scope">
                        {{scope.row.countByLevelMap['4'] ? scope.row.countByLevelMap['4'].count : 0}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="占比">
                    <template slot-scope="scope">
                        {{(scope.row.countByLevelMap['4'] ? scope.row.countByLevelMap['4'].rate : 0).toFixed(2)}}%
                    </template>
                </el-table-column>
                <el-table-column align="center" label="基本满意">
                    <template slot-scope="scope">
                        {{scope.row.countByLevelMap['3'] ? scope.row.countByLevelMap['3'].count : 0}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="占比">
                    <template slot-scope="scope">
                        {{(scope.row.countByLevelMap['3'] ? scope.row.countByLevelMap['3'].rate : 0).toFixed(2)}}%
                    </template>
                </el-table-column>
                <el-table-column align="center" label="不满意">
                    <template slot-scope="scope">
                        {{scope.row.countByLevelMap['2'] ? scope.row.countByLevelMap['2'].count : 0}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="占比">
                    <template slot-scope="scope">
                        {{(scope.row.countByLevelMap['2'] ? scope.row.countByLevelMap['2'].rate : 0).toFixed(2)}}%
                    </template>
                </el-table-column>
                <el-table-column align="center" label="非常不满意">
                    <template slot-scope="scope">
                        {{scope.row.countByLevelMap['1'] ? scope.row.countByLevelMap['1'].count : 0}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="占比">
                    <template slot-scope="scope">
                        {{(scope.row.countByLevelMap['1'] ? scope.row.countByLevelMap['1'].rate : 0).toFixed(2)}}%
                    </template>
                </el-table-column>
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
    import {deepClone} from '@/util/util';
    import {getStore} from '@/util/store';
    import {
        getDetailList,
        createOrUpdateDetail,
        delDetails
    } from '@/api/evaluate/detail';
    import {
        queryEvaluateCountByDept
    } from "../../api/evaluate/count";

    export default {
        name: 'detail',
        filters: {
            levelParseInt: function (value) {
                return parseInt(value);
            }
        },
        data() {
            return {
                detailList: [],
                total: 0,
                listLoading: true,
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
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                departmentList: [], //TODO  阿里提供接口查询
                submitTimeRange: [],
                levelParseInt: {},
                dialogVisibleDetails: false,
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
            this.reloadList();
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
            reloadList(){
                this.listLoading = true;
                this.detailList = [];
                this.total = 0;
                queryEvaluateCountByDept().then(response => {
                    this.listLoading = false;
                    this.detailList = response.data;
                })
            },
            loadEnum(name) {
                return getStore({name: 'enums'})[name];
            },
            submitTimeRangeChange(submitTimeRange) {
                if (!!submitTimeRange) {
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
    .mailTable, .mailTable tr, .mailTable tr td {
        border:1px solid #E6EAEE;
    }
    .mailTable {
        font-size: 14px;
        color: #71787E;
    }
    .mailTable tr td {
        border:1px solid #E6EAEE;
        width: 225px;
        height: 40px;
        line-height: 40px;
        box-sizing: border-box;
        padding: 0 10px;
    }
    .mailTable tr td.column {
        width: 175px;
        background-color: #EFF3F6;
        color: #393C3E;
    }
    .mailTable tr td.reform {
        height: auto;
        line-height: 30px;
    }
    ul {
        padding-inline-start: 20px;
    }
</style>
