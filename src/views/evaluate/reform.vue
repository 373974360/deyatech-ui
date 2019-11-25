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
                <el-table-column align="center" label="办件编号" prop="processNumber">
                    <template slot-scope="scope">
                        <span class="link-type" @click='showDetails(scope.row)'>{{scope.row.processNumber}}</span>
                    </template>
                </el-table-column>
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
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="300">
                    <template slot-scope="scope">
                        <!--<el-button type="primary" :size="btnSize" @click.stop.safe="showDetails(scope.row)">详情</el-button>-->
                        <el-button v-if="[0, 12].includes(scope.row.reformStatus)" title="整改" type="primary" :size="btnSize" @click="btnReform(scope.row)">整改回复</el-button>
                        <el-button v-if="[20, 222].includes(scope.row.reformStatus)" type="primary" :size="btnSize" @click="btnReformChanged(scope.row)">整改完成</el-button>
                        <el-button v-if="scope.row.reformStatus === 20" type="primary" :size="btnSize" @click="btnReformUnchanged(scope.row)">无法整改</el-button>
                        <el-button v-if="[20, 222].includes(scope.row.reformStatus) && scope.row.delayFlag === 0" type="primary" :size="btnSize" @click="btnReformDelay(scope.row)">申请延期</el-button>
                        <el-button v-if="[10, 220].includes(scope.row.reformStatus)" type="text" @click="showDetails(scope.row)">审核中</el-button>
                        <el-tag v-if="checkOverdue(scope.row)">整改超期</el-tag>
                        <el-tag v-if="scope.row.reformStatus === 11" type="info" @click="showDetails(scope.row)">无效差评</el-tag>
                        <el-tag v-if="scope.row.reformStatus === 21" type="success" @click="showDetails(scope.row)">已完成整改</el-tag>
                        <el-tag v-if="scope.row.reformStatus === 221" type="info" @click="showDetails(scope.row)">无法整改</el-tag>
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
                <table class="mailTable">
                    <tr>
                        <td class="column">事项编码</td><td>{{detail.itemCode}}</td>
                        <td class="column">事项名称</td><td>{{detail.itemName}}</td>
                    </tr>
                    <tr>
                        <td class="column">办件编号</td><td>{{detail.processNumber}}</td>
                        <td class="column">受理部门</td><td>{{detail.proDepartment}}</td>
                    </tr>
                    <tr>
                        <td class="column">经办人</td><td>{{detail.proManager}}</td>
                        <td class="column">审核状态</td><td>{{detail.status | enums('EvaluationStatusEnum')}}</td>
                    </tr>
                    <tr>
                        <td class="column">评价渠道</td><td>{{detail.channel | enums('EvaluationChannelEnum')}}</td>
                        <td class="column">整体满意度</td><td>{{detail.levelCode | enums('EvaluationLevelEnum')}}</td>
                    </tr>
                    <tr>
                        <td class="column">评价人姓名</td><td>{{detail.anonymityFlag == 1 ? '匿名用户' : detail.userName}}</td>
                        <td class="column">评价时间</td><td>{{detail.submitTime}}</td>
                    </tr>
                    <tr v-if="detail.content">
                        <td class="column">评价详情</td>
                        <td class="reform" colspan="3">
                            <ul>
                                <li v-for="c in detail.content.split('&')" :key="c">
                                    {{c}}
                                </li>
                            </ul>
                        </td>
                    </tr>
                    <tr v-if="detail.words">
                        <td class="column">文字评价</td>
                        <td class="reform" colspan="3">{{detail.words}}</td>
                    </tr>
                    <tr v-if="recordsList && recordsList.length > 0">
                        <td class="column">操作记录</td>
                        <td colspan="3">
                            <el-table :data="recordsList">
                                <el-table-column align="center" label="操作状态" prop="status">
                                    <template slot-scope="scope">
                                        {{scope.row.status | enums('EvaluationReformStatusEnum')}}
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="操作说明" prop="content"/>
                                <el-table-column align="center" label="整改/延期时间" prop="finishTime">
                                    <template slot-scope="scope">
                                        {{scope.row.finishTime | date('YYYY-MM-DD')}}
                                    </template>
                                </el-table-column>
                            </el-table>
                        </td>
                    </tr>
                </table>
                <el-form ref="detailDialogForm" class="deyatech-form" :model="detail" label-position="right"
                         label-width="110px" :rules="detailRules" style="margin-top: 20px">
                    <!--<el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="整体满意度">
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
                    </el-row>-->
                    <template v-if="[0,12].includes(opType)">
                        <el-row :gutter="20" :span="24" v-if="opType === 0">
                            <el-col :span="24">
                                <el-form-item label="评价是否有效" prop="poorFlag">
                                    <el-radio-group v-model="detail.poorFlag">
                                        <el-radio :label="1" >有效</el-radio>
                                        <el-radio :label="2" >无效</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" :span="24" v-if="detail.poorFlag === 1">
                            <el-col :span="24">
                                <el-form-item label="整改期限" prop="reformDate">
                                    <el-date-picker v-model="detail.reformDate" type="date" value-format="yyyy-MM-dd"
                                                    :picker-options="datePickerOptions" placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" :span="24" v-if="[1,2].includes(detail.poorFlag)">
                            <el-col :span="24">
                                <el-form-item label="说明" prop="reformContent">
                                    <el-input type="textarea" v-model="detail.reformContent" :rows="3"/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </template>
                    <template v-if="[20,222].includes(opType)">
                        <el-row :gutter="20" :span="24">
                            <el-col :span="24">
                                <el-form-item label="说明" prop="reformContent">
                                    <el-input type="textarea" v-model="detail.reformContent" :rows="3"/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </template>
                    <template v-if="opType === 3">
                        <el-row :gutter="20" :span="24">
                            <el-col :span="24">
                                <el-form-item label="延期期限" prop="delayDate">
                                    <el-date-picker v-model="detail.delayDate" type="date" value-format="yyyy-MM-dd"
                                                    :picker-options="delayDateOptions" placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" :span="24">
                            <el-col :span="24">
                                <el-form-item label="延期说明" prop="reformContent">
                                    <el-input type="textarea" v-model="detail.reformContent" :rows="3"/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </template>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="[0,12].includes(opType)" type="primary" :size="btnSize" @click="doReform" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-if="[20,222].includes(opType)" type="primary" :size="btnSize" @click="doReformChange" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-if="opType === 3" type="primary" :size="btnSize" @click="doDelay" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeDetailDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>

            <el-dialog title="整改延期" :visible.sync="dialogDelayVisible"  width="60%"
                       :close-on-click-modal="closeOnClickModal" @close="closeDelayDialog">
                <el-form ref="delayDialogForm" class="deyatech-form" :model="detail" label-position="right"
                         label-width="110px" :rules="detailRules" style="margin-top: 20px">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="整改期限" prop="delayDate">
                                <el-date-picker v-model="detail.delayDate" type="date" value-format="yyyy-MM-dd"
                                                :picker-options="delayDateOptions" placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" :size="btnSize" @click="doDelay" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeDelayDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>


            <!--详情-->
            <el-dialog title="评价详情" :visible.sync="dialogVisibleDetails" width="60%"
                       :close-on-click-modal="closeOnClickModal" @close="closeDetailDialogDetails">
                <table class="mailTable">
                    <tr>
                        <td class="column">事项编码</td><td>{{detail.itemCode}}</td>
                        <td class="column">事项名称</td><td>{{detail.itemName}}</td>
                    </tr>
                    <tr>
                        <td class="column">办件编号</td><td>{{detail.processNumber}}</td>
                        <td class="column">受理部门</td><td>{{detail.proDepartment}}</td>
                    </tr>
                    <tr>
                        <td class="column">经办人</td><td>{{detail.proManager}}</td>
                        <td class="column">审核状态</td><td>{{detail.status | enums('EvaluationStatusEnum')}}</td>
                    </tr>
                    <tr>
                        <td class="column">评价渠道</td><td>{{detail.channel | enums('EvaluationChannelEnum')}}</td>
                        <td class="column">整体满意度</td><td>{{detail.levelCode | enums('EvaluationLevelEnum')}}</td>
                    </tr>
                    <tr>
                        <td class="column">评价人姓名</td><td>{{detail.anonymityFlag == 1 ? '匿名用户' : detail.userName}}</td>
                        <td class="column">评价时间</td><td>{{detail.submitTime}}</td>
                    </tr>
                    <tr v-if="detail.content">
                        <td class="column">评价详情</td>
                        <td class="reform" colspan="3">
                            <ul>
                                <li v-for="c in detail.content.split('&')" :key="c">
                                    {{c}}
                                </li>
                            </ul>
                        </td>
                    </tr>
                    <tr v-if="detail.words">
                        <td class="column">文字评价</td>
                        <td class="reform" colspan="3">{{detail.words}}</td>
                    </tr>
                    <tr v-if="recordsList && recordsList.length > 0">
                        <td class="column">操作记录</td>
                        <td colspan="3">
                            <el-table :data="recordsList">
                                <el-table-column align="center" label="操作状态" prop="status">
                                    <template slot-scope="scope">
                                        {{scope.row.status | enums('EvaluationReformStatusEnum')}}
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="操作说明" prop="content"/>
                                <el-table-column align="center" label="整改/延期时间" prop="finishTime">
                                    <template slot-scope="scope">
                                        {{scope.row.finishTime | date('YYYY-MM-DD')}}
                                    </template>
                                </el-table-column>
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
        saveReply,
        reformChange,
        reformDelay,
        queryEvaluateRecordList
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
                datePickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() || (time.getTime() - 3600 * 1000 * 24 * 15) > Date.now();
                    }
                },
                delayDateOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() || (time.getTime() - 3600 * 1000 * 24 * 15) > Date.now();
                    }
                },
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
                    content: ''
                },
                detailRules: {
                    poorFlag: [
                        {required: true, message: this.$t("table.pleaseSelect") + '评价是否有效'}
                    ],
                    reformContent: [
                        {required: true, message: this.$t("table.pleaseInput") + '整改内容'},
                        {min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur'}
                    ],
                    reformDate: [
                        {required: true, message: this.$t("table.pleaseSelect") + '整改期限'}
                    ],
                    delayDate: [
                        {required: true, message: this.$t("table.pleaseSelect") + '整改期限'}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogDelayVisible: false,
                submitLoading: false,
                departmentList: [],
                submitTimeRange: [],
                dialogVisibleDetails: false,
                recordsList: [],
                opType: 0
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
            this.listQuery.proDepartment = this.userInfo.orgName;
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
            queryRecordList(detailId) {
                queryEvaluateRecordList(detailId).then(response => {
                    this.recordsList = response.data;
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
                    content: ''
                }
            },
            resetDetailDialogAndList(){
                this.closeDetailDialog();
                this.submitLoading = false;
                this.reloadList();
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
            btnReform(row) {
                this.resetDetail();
                this.detail = deepClone(row);
                this.detail.reformContent = '';
                this.detail.updateBy = this.userInfo.userId;
                this.queryRecordList(this.detail.id);
                this.opType = row.reformStatus;
                if (this.opType === 12) {
                    this.detail.poorFlag = 1;
                }
                this.dialogVisible = true;
            },
            doReform(){
                this.$refs['detailDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        saveReply(this.detail).then(() => {
                            this.resetDetailDialogAndList();
                            this.$message.success(this.$t("table.submitSuccess"));
                        }).catch(() => {
                            this.submitLoading = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
            btnReformChanged(row) {
                this.resetDetail();
                this.detail = deepClone(row);
                this.detail.reformContent = '';
                this.detail.updateBy = this.userInfo.userId;
                this.queryRecordList(this.detail.id);
                this.opType = row.reformStatus;
                this.detail.reformStatus = 1;
                this.dialogVisible = true;
            },
            btnReformUnchanged(row) {
                this.resetDetail();
                this.detail = deepClone(row);
                this.detail.reformContent = '';
                this.detail.updateBy = this.userInfo.userId;
                this.queryRecordList(this.detail.id);
                this.opType = row.reformStatus;
                this.detail.reformStatus = 0;
                this.dialogVisible = true;
            },
            doReformChange() {
                this.$refs['detailDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        reformChange(this.detail).then(() => {
                            this.resetDetailDialogAndList();
                            this.$message.success('操作成功');
                        }).catch(() => {
                            this.submitLoading = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
            btnReformDelay(row) {
                this.resetDetail();
                this.detail = deepClone(row);
                this.detail.reformContent = '';
                this.detail.updateBy = this.userInfo.userId;
                this.queryRecordList(this.detail.id);
                this.opType = 3;
                this.detail.delayFlag = 1;
                this.dialogVisible = true;
            },
            doDelay() {
                this.$refs['detailDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        reformDelay(this.detail).then(() => {
                            this.resetDetailDialogAndList();
                            this.$message.success(this.$t("table.submitSuccess"));
                        }).catch(() => {
                            this.submitLoading = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
            closeDelayDialog() {
                this.dialogDelayVisible = false;
                this.resetDetail();
                this.$refs['delayDialogForm'].resetFields();
            },
            showDetails(row){
                this.detail = deepClone(row);
                this.queryRecordList(this.detail.id);
                this.dialogVisibleDetails = true;
            },
            closeDetailDialogDetails() {
                this.dialogVisibleDetails = false;
                this.resetDetail();
            },
            checkOverdue(row) {
                if (![0,12,20,222].includes(row.reformStatus)) {
                    return false;
                }
                if (row.delayStatus === 1) {
                    return new Date(row.delayDate).getTime() < Date.now();
                }
                return new Date(row.reformDate).getTime() < Date.now();
            }
        }
    }
</script>

<style scoped>
    .mailTable, .mailTable tr, .mailTable tr td {
        border:1px solid #E6EAEE;
    }
    .mailTable {
        font-size: 14px;
        color: #71787E;
        width: 100%;
    }
    .mailTable tr td {
        border:1px solid #E6EAEE;
        line-height: 28px;
        box-sizing: border-box;
        padding: 6px 10px;
        width: calc(50% - 110px);
        word-break: break-all;
    }
    .mailTable tr td.column {
        background-color: #EFF3F6;
        color: #393C3E;
        width: 110px;
    }
    .mailTable tr td.reform {
        height: auto;
        line-height: 30px;
    }

    /* 表格内背景颜色 */
    .mailTable .el-table th, .mailTable .el-table tr, .mailTable .el-table td {
        border: 0;
        background-color: transparent;
    }
    .mailTable .el-table th, .mailTable .el-table td {
        border-bottom: 1px solid #E6EAEE;
    }
    /* 删除表格下横线 */
    .mailTable .el-table::before {
        left: 0;
        bottom: 0;
        width: 100%;
        height: 0px;
    }

    ul {
        padding-inline-start: 20px;
    }
</style>

