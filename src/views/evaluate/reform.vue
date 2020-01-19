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
                <el-table-column prop="reformStatus" label="状态" align="center" width="120">
                    <template slot-scope="scope">
                        <el-tag v-if="[0, 12].includes(scope.row.reformStatus)">待整改</el-tag>
                        <el-tag v-if="scope.row.reformStatus === 10">无效差评审核</el-tag>
                        <el-tag v-if="scope.row.reformStatus === 220">无法整改审核</el-tag>
                        <el-tag v-if="[20, 222].includes(scope.row.reformStatus)">整改中</el-tag>
                        <el-tag v-if="scope.row.reformStatus === 11" type="info">无效差评</el-tag>
                        <el-tag v-if="scope.row.reformStatus === 21" type="success">整改完成</el-tag>
                        <el-tag v-if="scope.row.reformStatus === 221" type="info">无法整改</el-tag>
                        <el-tag v-if="checkOverdue(scope.row)" type="danger">整改超期</el-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('table.operation')" align="center" width="300">
                    <template slot-scope="scope">
                        <el-button v-if="[0, 12].includes(scope.row.reformStatus)" title="整改" type="primary" :size="btnSize" @click="btnReform(scope.row)">整改回复</el-button>
                        <el-button v-if="[20, 222].includes(scope.row.reformStatus)" type="primary" :size="btnSize" @click="btnReformChanged(scope.row)">整改完成</el-button>
                        <el-button v-if="scope.row.reformStatus === 20" type="primary" :size="btnSize" @click="btnReformUnchanged(scope.row)">无法整改</el-button>
                        <el-button v-if="[20, 222].includes(scope.row.reformStatus) && scope.row.delayFlag === 0" type="primary" :size="btnSize" @click="btnReformDelay(scope.row)">申请延期</el-button>
                        <el-button v-if="![0, 12, 20, 222].includes(scope.row.reformStatus)" type="primary" :size="btnSize" @click.stop.safe="showDetails(scope.row)">详情</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="备注" align="center" width="160">
                    <template slot-scope="scope">
                        <el-button title="抽查回访记录" type="primary" :size="btnSize" @click="btnRevisit(scope.row)">抽查回访记录</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="deyatech-pagination pull-right" background
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                           :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>

            <el-dialog id="el-dialog-edit" title="评价整改回复" :visible.sync="dialogVisible" width="80%"
                       :close-on-click-modal="closeOnClickModal" @close="closeDetailDialog">
                       <!--@open="handleDialogPosition('el-dialog-edit')">-->
                <table class="mailTable">
                    <tr>
                        <td class="column">事项编码</td><td>{{detail.itemCode}}</td>
                        <td class="column">事项名称</td><td>{{detail.itemName}}</td>
                    </tr>
                    <tr>
                        <td class="column">办件编号</td><td>{{detail.processNumber}}</td>
                        <td class="column">受理部门</td><td>{{detail.proDepartment}}</td>
                    </tr>
                    <!--<tr>
                        <td class="column">经办人</td><td>{{detail.proManager}}</td>
                        <td class="column">审核状态</td><td>{{detail.status | enums('EvaluationStatusEnum')}}</td>
                    </tr>-->
                    <tr>
                        <td class="column">办件来源</td><td>{{detail.proSource | enums('EvaluationProSourceEnum')}}</td>
                        <td class="column">评价渠道</td><td>{{detail.channel | enums('EvaluationChannelEnum')}}</td>
                    </tr>
                    <tr>
                        <!--<td class="column">评价人姓名</td><td>{{(detail.anonymityFlag == 1 || !detail.userName) ? '匿名用户' : detail.userName}}</td>-->
                        <td class="column">评价人姓名</td><td>{{detail.userName}}</td>
                        <td class="column">联系号码</td><td>{{detail.userTel}}</td>
                    </tr>
                    <tr>
                        <td class="column">整体满意度</td><td>{{detail.levelCode | enums('EvaluationLevelEnum')}}</td>
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
                        <td class="reform" colspan="3">{{detail.words | convertBlank}}</td>
                    </tr>
                    <tr v-if="recordsList && recordsList.length > 0">
                        <td class="column">操作记录</td>
                        <td colspan="3">
                            <div class="inline-tb-container">
                                <el-table :data="recordsList">
                                    <el-table-column align="center" label="操作状态" prop="status" width="160">
                                        <template slot-scope="scope">
                                            {{scope.row.status | enums('EvaluationReformStatusEnum')}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" label="操作说明" prop="content" min-width="260"/>
                                    <el-table-column align="center" label="整改/延期时间" prop="finishTime" width="160">
                                        <template slot-scope="scope">
                                            {{scope.row.finishTime | date('YYYY-MM-DD')}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" label="操作时间" prop="operateTime" width="180"/>
                                </el-table>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="revisitRecordList && revisitRecordList.length > 0">
                        <td class="column">回访记录</td>
                        <td colspan="3">
                            <div class="inline-tb-container">
                                <el-table :data="revisitRecordList">
                                    <el-table-column align="center" label="回访内容" prop="content" min-width="260"/>
                                    <el-table-column align="center" label="回访时间" prop="operateTime" width="180"/>
                                </el-table>
                            </div>
                        </td>
                    </tr>
                </table>
                <el-form ref="detailDialogForm" class="deyatech-form" :model="detail" label-position="right"
                         label-width="110px" :rules="detailRules">
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
                                    <el-input type="textarea" v-model="detail.reformContent" maxlength="300"
                                              show-word-limit :autosize="{minRows: 3}"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </template>
                    <template v-if="[20,222].includes(opType)">
                        <el-row :gutter="20" :span="24">
                            <el-col :span="24">
                                <el-form-item label="说明" prop="reformContent">
                                    <el-input type="textarea" v-model="detail.reformContent" maxlength="300"
                                              show-word-limit :autosize="{minRows: 3}"></el-input>
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
                                    <el-input type="textarea" v-model="detail.reformContent" maxlength="300"
                                              show-word-limit :autosize="{minRows: 3}"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </template>
                    <template v-if="opType === 999">
                        <el-row :gutter="20" :span="24">
                            <el-col :span="24">
                                <el-form-item label="回访内容" prop="reformContent">
                                    <el-input type="textarea" v-model="detail.reformContent" maxlength="300"
                                              show-word-limit :autosize="{minRows: 3}"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </template>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="[0,12].includes(opType)" type="primary" :size="btnSize" @click="doReform" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-if="[20,222].includes(opType)" type="primary" :size="btnSize" @click="doReformChange" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-if="opType === 3" type="primary" :size="btnSize" @click="doDelay" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-if="opType === 999" type="primary" :size="btnSize" @click="doRevisit" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
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
            <el-dialog id="el-dialog-read" title="评价详情" :visible.sync="dialogVisibleDetails" width="80%"
                       :close-on-click-modal="closeOnClickModal" @close="closeDetailDialogDetails">
                       <!--@open="handleDialogPosition('el-dialog-read')">-->
                <table class="mailTable">
                    <tr>
                        <td class="column">事项编码</td><td>{{detail.itemCode}}</td>
                        <td class="column">事项名称</td><td>{{detail.itemName}}</td>
                    </tr>
                    <tr>
                        <td class="column">办件编号</td><td>{{detail.processNumber}}</td>
                        <td class="column">受理部门</td><td>{{detail.proDepartment}}</td>
                    </tr>
                    <!--<tr>
                        <td class="column">经办人</td><td>{{detail.proManager}}</td>
                        <td class="column">审核状态</td><td>{{detail.status | enums('EvaluationStatusEnum')}}</td>
                    </tr>-->
                    <tr>
                        <td class="column">办件来源</td><td>{{detail.proSource | enums('EvaluationProSourceEnum')}}</td>
                        <td class="column">评价渠道</td><td>{{detail.channel | enums('EvaluationChannelEnum')}}</td>
                    </tr>
                    <tr>
                        <!--<td class="column">评价人姓名</td><td>{{(detail.anonymityFlag == 1 || !detail.userName) ? '匿名用户' : detail.userName}}</td>-->
                        <td class="column">评价人姓名</td><td>{{detail.userName}}</td>
                        <td class="column">联系号码</td><td>{{detail.userTel}}</td>
                    </tr>
                    <tr>
                        <td class="column">整体满意度</td><td>{{detail.levelCode | enums('EvaluationLevelEnum')}}</td>
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
                        <td class="reform" colspan="3">{{detail.words | convertBlank}}</td>
                    </tr>
                    <tr v-if="recordsList && recordsList.length > 0">
                        <td class="column">操作记录</td>
                        <td colspan="3">
                            <div class="inline-tb-container">
                                <el-table :data="recordsList">
                                    <el-table-column align="center" label="操作状态" prop="status" width="160">
                                        <template slot-scope="scope">
                                            {{scope.row.status | enums('EvaluationReformStatusEnum')}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" label="操作说明" prop="content" min-width="260"/>
                                    <el-table-column align="center" label="整改/延期时间" prop="finishTime" width="160">
                                        <template slot-scope="scope">
                                            {{scope.row.finishTime | date('YYYY-MM-DD')}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" label="操作时间" prop="operateTime" width="180">
                                        <template slot-scope="scope">
                                            {{scope.row.operateTime | date('YYYY-MM-DD HH:mm:ss')}}
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="revisitRecordList && revisitRecordList.length > 0">
                        <td class="column">回访记录</td>
                        <td colspan="3">
                            <div class="inline-tb-container">
                                <el-table :data="revisitRecordList">
                                    <el-table-column align="center" label="回访内容" prop="content" min-width="260"/>
                                    <el-table-column align="center" label="回访时间" prop="operateTime" width="180">
                                        <template slot-scope="scope">
                                            {{scope.row.operateTime | date('YYYY-MM-DD HH:mm:ss')}}
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
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
        queryEvaluateRecordList,
        reformRevisit,
    } from '@/api/evaluate/detail';
    import {
        getOrgDetail
    } from "../../api/evaluate/sso";

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
                    disabledDate: time => {
                        return time.getTime() <= new Date(this.detail.submitTime) || (time.getTime() - 3600 * 1000 * 24 * 15) > new Date(this.detail.submitTime);
                    }
                },
                delayDateOptions: {
                    disabledDate: time => {
                        return time.getTime() <= new Date(this.detail.reformDate) || (time.getTime() - 3600 * 1000 * 24 * 15) > new Date(this.detail.reformDate);
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
                    organizationalCode: undefined,
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
                    proSource: undefined,
                    proStatus: undefined,
                    proDepartment: undefined,
                    proManager: undefined,
                    channel: undefined,
                    userId: undefined,
                    userName: undefined,
                    userProp: undefined,
                    userTel: undefined,
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
                        {required: true, message: this.$t("table.pleaseInput") + '内容'},
                        {min: 1, max: 300, message: '最多输入300个字符', trigger: 'blur'}
                    ],
                    reformDate: [
                        {required: true, message: this.$t("table.pleaseSelect") + '整改期限'}
                    ],
                    delayDate: [
                        {required: true, message: this.$t("table.pleaseSelect") + '整改期限'}
                    ],
                },
                selectedRows: [],
                dialogVisible: false,
                dialogDelayVisible: false,
                submitLoading: false,
                departmentList: [],
                submitTimeRange: [],
                dialogVisibleDetails: false,
                recordsList: [],
                revisitRecordList: [],
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
            // 督查处所有数据，市级按部门，其他按区县
            if (this.userInfo.loginName.includes('duchachu') || this.userInfo.loginName === 'hcp_admin') {
                this.reloadList();
            } else if (this.userInfo.type === 'auth:org:manage' && this.userInfo.orgId.length === 6) {
                this.listQuery.organizationalCode = this.userInfo.orgId + '000000';
                this.reloadList();
            } else {
                getOrgDetail(this.userInfo.orgId).then(res => {
                    let areaCode = res.data.regionCode ? res.data.regionCode : res.data.autoCode;
                    if (!areaCode) {
                        this.listLoading = false;
                        return false;
                    }
                    if (areaCode === '610100000000') {
                        this.listQuery.proDepartment = this.userInfo.orgName;
                    } else {
                        this.listQuery.organizationalCode = areaCode;
                    }
                    this.reloadList();
                });
            }
        },
        methods: {
            handleDialogPosition(id) {
                setTimeout(() => {
                    let d = document.getElementById(id).children[0];
                    if (d.clientHeight < this.getClientHeight() - 100) {
                        d.style.position = 'absolute';
                        d.style.top = '50%';
                        d.style.left = '50%';
                        d.style.transform = 'translate(-50%,-50%)';
                        d.style.marginTop = 0;
                    } else {
                        d.style.position = '';
                        d.style.top = '';
                        d.style.left = '';
                        d.style.transform = '';
                        d.style.marginTop = '30px';
                    }
                }, 100);
            },
            getClientHeight() {
                let clientHeight = 0;
                if (document.body.clientHeight && document.documentElement.clientHeight) {
                    clientHeight = (document.body.clientHeight<document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
                } else {
                    clientHeight = (document.body.clientHeight>document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
                }
                return clientHeight;
            },
            resetSearch(){
                this.listQuery.channel = undefined;
                this.listQuery.itemCode = undefined;
                this.listQuery.itemName = undefined;
                this.listQuery.subMatter = undefined;
                this.listQuery.organizationalCode = undefined;
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
                    this.recordsList = response.data.recordsList;
                    this.revisitRecordList = response.data.revisitRecordList;
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
                    proSource: undefined,
                    proStatus: undefined,
                    proDepartment: undefined,
                    proManager: undefined,
                    channel: undefined,
                    userId: undefined,
                    userName: undefined,
                    userProp: undefined,
                    userTel: undefined,
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
                    return new Date(row.delayDate).getTime() < Date.now() - 3600 * 1000 * 24;
                }
                if (row.reformDate) {
                    return new Date(row.reformDate).getTime() < Date.now() - 3600 * 1000 * 24;
                }
                return new Date(row.submitTime).getTime() < Date.now() - 3600 * 1000 * 24 * 16;
            },
            btnRevisit(row) {
                this.resetDetail();
                this.detail = deepClone(row);
                this.detail.reformContent = '';
                this.detail.updateBy = this.userInfo.userId;
                this.opType = 999;
                this.queryRecordList(this.detail.id);
                this.dialogVisible = true;
            },
            doRevisit() {
                this.$refs['detailDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        reformRevisit(this.detail).then(() => {
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
        }
    }
</script>

<style scoped>
    @import "../../assets/css/evaluateReform.css";
</style>

