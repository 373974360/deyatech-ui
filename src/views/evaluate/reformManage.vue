<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
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
<!--                    <el-form-item>
                        <el-select :size="searchSize" v-model="listQuery.proDepartment" clearable :placeholder="$t('table.pleaseSelect') + '受理部门'">
                            <el-option
                                v-for="item in departmentList"
                                :key="item.code"
                                :label="item.value"
                                :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>-->
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
<!--                    <el-form-item>
                        <el-select :size="searchSize" v-model="listQuery.anonymityFlag" clearable :placeholder="$t('table.pleaseSelect') + '是否匿名'">
                            <el-option
                                v-for="item in loadEnum('EvaluationAnonymityEnum')"
                                :key="item.code"
                                :label="item.value"
                                :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select :size="searchSize" v-model="listQuery.publicFlag" clearable :placeholder="$t('table.pleaseSelect') + '是否公开'">
                            <el-option
                                v-for="item in loadEnum('EvaluationPublicEnum')"
                                :key="item.code"
                                :label="item.value"
                                :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>-->
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

                    <!--                    <el-form-item >
                                            <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="searchReloadList">{{$t('table.search')}}</el-button>
                                            <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}</el-button>
                                        </el-form-item>-->
                </el-form>
            </div>
            <div class="deyatech-menu">
                <!--<div class="deyatech-menu_left">
                    <el-button v-if="btnEnable.create" type="primary" :size="btnSize" @click="btnCreate">{{$t('table.create')}}</el-button>
                    <el-button v-if="btnEnable.update" type="primary" :size="btnSize" @click="btnUpdate" :disabled="selectedRows.length != 1">{{$t('table.update')}}</el-button>
                    <el-button v-if="btnEnable.delete" type="danger" :size="btnSize" @click="btnDelete" :disabled="selectedRows.length < 1">{{$t('table.delete')}}</el-button>
                </div>-->
                <div class="deyatech-menu_right">
                    <!--<el-button type="primary" icon="el-icon-edit" :size="btnSize" circle @click="btnUpdate"></el-button>
                    <el-button type="danger" icon="el-icon-delete" :size="btnSize" circle @click="btnDelete"></el-button>-->
                    <!--                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>-->
                    <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="searchReloadList">{{$t('table.search')}}</el-button>
                    <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}</el-button>
                </div>
            </div>

            <el-table :data="detailList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column align="center" label="事项名称" prop="itemName"/>
                <el-table-column align="center" label="受理部门" prop="proDepartment"/>
                <el-table-column align="center" label="整体满意度" prop="levelCode">
                    <template slot-scope="scope">
                        <!--<el-rate
                            disabled
                            v-model="scope.row.levelCode | levelParseInt"
                            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                            show-text
                            :texts="['非常不满意', '不满意', '基本满意', '满意', '非常满意']">
                        </el-rate>-->
                        {{scope.row.levelCode | enums('EvaluationLevelEnum')}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="评价时间" prop="submitTime"/>
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="160">
                    <template slot-scope="scope">
                        <el-button type="primary" :size="btnSize" @click.stop.safe="showDetails(scope.row)">详情</el-button>
                        <el-button v-if="scope.row.delayFlag === 1 && scope.row.delayStatus === 0" type="primary" :size="btnSize" @click="btnReformDelay(scope.row)">延期审核</el-button>
                        <el-tag v-if="checkOverdue(scope.row)">整改超期</el-tag>
                        <el-tag v-if="scope.row.poorFlag === 2" type="info">无效差评</el-tag>
                        <el-tag v-if="scope.row.reformStatus === 2" type="success">已完成整改</el-tag>
                        <el-tag v-if="scope.row.reformStatus === 3" type="info">无法整改</el-tag>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="deyatech-pagination pull-right" background
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                           :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>

            <el-dialog title="评价整改回复" :visible.sync="dialogVisible" width="60%"
                       :close-on-click-modal="closeOnClickModal" @close="closeDetailDialog">
                <el-form ref="detailDialogForm" class="deyatech-form" :model="detail" label-position="right"
                         label-width="110px" :rules="detailRules" style="margin-top: 20px">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="整体满意度">
                                <!--<el-rate
                                    style="margin-top: 10px"
                                    disabled
                                    v-model="detail.levelCode | levelParseInt"
                                    :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                                    show-text
                                    :texts="['非常不满意', '不满意', '基本满意', '满意', '非常满意']">
                                </el-rate>-->
                                <el-input disabled :value="detail.levelCode | enums('EvaluationLevelEnum')"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="事项名称">
                                <el-input disabled v-model="detail.itemName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="受理部门">
                                <el-input disabled v-model="detail.proDepartment"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="经办人">
                                <el-input disabled v-model="detail.proManager"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="评价人姓名">
                                <el-input disabled v-model="detail.anonymityFlag == 1 ? '匿名用户' : detail.userName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="评价时间">
                                <el-input disabled v-model="detail.submitTime"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="评价详情">
                                <ul v-if="detail.content">
                                    <li v-for="c in detail.content.split('&')" :key="c">
                                        {{c}}
                                    </li>
                                </ul>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="文字评价">
                                <el-input disabled type="textarea" v-model="detail.words" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="评价是否有效" prop="poorFlag">
                                <el-radio-group disabled v-model="detail.poorFlag">
                                    <el-radio :label="1" >有效</el-radio>
                                    <el-radio :label="2" >无效</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="回复内容" prop="reformContent">
                                <el-input type="textarea" disabled v-model="detail.reformContent" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24" v-if="detail.poorFlag === 1">
                        <el-col :span="24">
                            <el-form-item label="整改期限" prop="reformDate">
                                <el-date-picker disabled v-model="detail.reformDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24" v-if="detail.delayFlag === 1">
                        <el-col :span="24">
                            <el-form-item label="延期日期" prop="delayDate">
                                <el-date-picker disabled v-model="detail.delayDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="是否同意延期" prop="delayStatus">
                                <el-radio-group v-model="detail.delayStatus">
                                    <el-radio :label="1" >同意</el-radio>
                                    <el-radio :label="2" >不同意</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" :size="btnSize" @click="doReformDelay">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeDetailDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>


            <!--详情-->
            <el-dialog title="评价详情" :visible.sync="dialogVisibleDetails" width="60%"
                       :close-on-click-modal="closeOnClickModal" @close="closeDetailDialogDetails">
                <table class="mailTable">
                    <tr>
                        <td class="column">事项编码</td>
                        <td>{{detail.itemCode}}</td>
                        <td class="column">事项名称</td>
                        <td>{{detail.itemName}}</td>
                    </tr>
                    <tr>
                        <td class="column">办件编号</td>
                        <td>{{detail.processNumber}}</td>
                        <td class="column">受理部门</td>
                        <td>{{detail.proDepartment}}</td>
                    </tr>
                    <tr>
                        <td class="column">经办人</td>
                        <td>{{detail.proManager}}</td>
                        <td class="column">审核状态</td>
                        <td>{{detail.status | enums('EvaluationStatusEnum')}}</td>
                    </tr>
                    <!--<tr>
                        <td class="column">是否匿名</td>
                        <td>{{detail.anonymityFlag | enums('EvaluationAnonymityEnum')}}</td>
                        <td class="column">是否公开</td>
                        <td>{{detail.publicFlag | enums('EvaluationPublicEnum')}}</td>
                    </tr>-->
                    <tr>
                        <td class="column">评价渠道</td>
                        <td>{{detail.channel | enums('EvaluationChannelEnum')}}</td>
                        <td class="column">整体满意度</td>
                        <td>
                            <!--<el-rate
                                disabled
                                v-model="detail.levelCode | levelParseInt"
                                :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                                show-text
                                :texts="['非常不满意', '不满意', '基本满意', '满意', '非常满意']">
                            </el-rate>-->
                            {{detail.levelCode | enums('EvaluationLevelEnum')}}
                        </td>
                    </tr>
                    <tr>
                        <td class="column">评价人姓名</td>
                        <td>{{detail.anonymityFlag == 1 ? '匿名用户' : detail.userName}}</td>
                        <td class="column">评价时间</td>
                        <td>{{detail.submitTime}}</td>
                    </tr>
                    <tr v-if="detail.content">
                        <td class="column">评价详情</td>
                        <td class="reform" colspan="3">
                            <ul>
                                <li v-for="c in detail.content.split('&')">
                                    {{c}}
                                </li>
                            </ul>
                        </td>
                    </tr>
                    <tr v-if="detail.words">
                        <td class="column">文字评价</td>
                        <td class="reform" colspan="3">{{detail.words}}</td>
                    </tr>
                    <!--<tr v-if="detail.reformContent">
                        <td class="column">整改回复内容</td>
                        <td class="reform" colspan="3">{{detail.reformContent}}</td>
                    </tr>
                    <tr v-if="detail.reformDate">
                        <td class="column">整改期限</td>
                        <td colspan="3">{{detail.reformDate}}</td>
                    </tr>-->
                    <tr>
                        <td class="column">操作记录</td>
                        <td colspan="3">
                            <el-table :data="recordsList">
                                <el-table-column align="center" label="操作状态" prop="status">
                                    <template slot-scope="scope">
                                        {{scope.row.status | enums('EvaluationReformStatusEnum')}}
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="操作说明" prop="content"/>
                                <el-table-column align="center" label="操作完成时间" prop="finish_time"/>
                            </el-table>
                        </td>
                    </tr>
                </table>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {getStore} from '@/util/store';
    import {
        getReplyDetailList,
        reformDelayAudit
    } from '@/api/evaluate/detail';

    export default {
        name: 'detail',
        filters: {
            levelParseInt: function (value) {
                return parseInt(value);
            }
        },
        data() {
            return {
                levelParseInt: {},
                detailList: undefined,
                total: undefined,
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
                    anonymityFlag: undefined,
                    publicFlag: undefined,
                    evaluationTimeStart: undefined,
                    evaluationTimeEnd: undefined,
                },
                detail: {
                    id: undefined,
                    organizationalCode: undefined,
                    itemCode: undefined,
                    processItemCode: undefined,
                    itemName: undefined,
                    subMatter: undefined,
                    processNumber: undefined,
                    proStatus: undefined,
                    proDepartment: undefined,
                    proManager: undefined,
                    channel: undefined,
                    userId: undefined,
                    userName: undefined,
                    userProp: undefined,
                    anonymityFlag: undefined,
                    levelCode: undefined,
                    contentCode: undefined,
                    words: undefined,
                    submitTime: undefined,
                    number: undefined,
                    status: undefined,
                    publicFlag: undefined,
                    reformContent: undefined,
                    reformDate: undefined,
                    poorFlag: undefined,
                    reformStatus: undefined,
                    delayFlag: undefined,
                    delayDate: undefined,
                    delayStatus: undefined,
                    content: ''
                },
                detailRules: {
                    delayStatus: [
                        {required: true, message: this.$t("table.pleaseSelect") + '是否同意延期'}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                departmentList: [],
                submitTimeRange: [],
                dialogVisibleDetails: false,
                recordsList: [
                    {
                        status: 1,
                        content: '整改中~~~~~~~',
                        finish_time: ''
                    },
                    {
                        status: 2,
                        content: '整改完成~~~~~~~',
                        finish_time: ''
                    },
                ],
            }
        },
        computed: {
            ...mapGetters([
                'permission',
                'titleMap',
                'enums',
                'closeOnClickModal',
                'searchSize',
                'btnSize',
                'userInfo'
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
                this.listQuery.anonymityFlag = undefined;
                this.listQuery.publicFlag = undefined;
                this.listQuery.evaluationTimeStart = undefined;
                this.listQuery.evaluationTimeEnd = undefined;
                this.submitTimeRange = [];
            },
            searchReloadList() {
                this.handleCurrentChange(1);
            },
            reloadList(){
                this.listLoading = true;
                this.detailList = undefined;
                this.total = undefined;
                getReplyDetailList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.detailList = response.data.records;
                    this.total = response.data.total;
                })
            },
            handleSizeChange(val){
                this.listQuery.size = val;
                this.reloadList();
            },
            handleCurrentChange(val){
                this.listQuery.page = val;
                this.reloadList();
            },
            handleSelectionChange(rows){
                this.selectedRows = rows;
            },
            resetDetail(){
                this.detail = {
                    id: undefined,
                    organizationalCode: undefined,
                    itemCode: undefined,
                    processItemCode: undefined,
                    itemName: undefined,
                    subMatter: undefined,
                    processNumber: undefined,
                    proStatus: undefined,
                    proDepartment: undefined,
                    proManager: undefined,
                    channel: undefined,
                    userId: undefined,
                    userName: undefined,
                    userProp: undefined,
                    anonymityFlag: undefined,
                    levelCode: undefined,
                    contentCode: undefined,
                    words: undefined,
                    submitTime: undefined,
                    number: undefined,
                    status: undefined,
                    publicFlag: undefined,
                    reformContent: undefined,
                    reformDate: undefined,
                    poorFlag: undefined,
                    reformStatus: undefined,
                    delayFlag: undefined,
                    delayDate: undefined,
                    delayStatus: undefined,
                    content: ''
                }
            },
            closeDetailDialog() {
                this.dialogVisible = false;
                this.resetDetail();
                this.$refs['detailDialogForm'].resetFields();
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
            },
            btnReformDelay(row) {
                this.detail = deepClone(row);
                this.dialogVisible = true;
            },
            doReformDelay() {
                this.$refs['detailDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        reformDelayAudit(this.detail).then(() => {
                            this.$message.success(this.$t("table.submitSuccess"));
                            this.closeDetailDialog();
                            this.submitLoading = false;
                            this.reloadList();
                        }).catch(() => {
                            this.submitLoading = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
            checkOverdue(row) {
                if (row.poorFlag !== 1 || row.reformStatus !== 1) {
                    return false;
                }
                if (row.delayStatus === 1) {
                    return new Date(row.delayDate).getTime() < Date.now();
                }
                return new Date(row.reformDate).getTime() < Date.now();
            },
            showDetails(row){
                this.detail = deepClone(row);
                this.dialogVisibleDetails = true;
            },
            closeDetailDialogDetails() {
                this.dialogVisibleDetails = false;
                this.resetDetail();
            },
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

    /* 表格内背景颜色 */
    td .el-table th, td .el-table tr, td .el-table td{
        border: 0;
        background-color: transparent;
    }
    /* 删除表格下横线 */
    td .el-table::before {
        left: 0;
        bottom: 0;
        width: 100%;
        height: 0px;
    }

    ul {
        padding-inline-start: 20px;
    }
</style>

