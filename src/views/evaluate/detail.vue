<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
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

<!--                    <el-form-item>
                        <el-switch
                            v-model="listQuery.anonymityFlag"
                            active-value="2"
                            inactive-value="1"
                            active-text="不匿名"
                            inactive-text="匿名">
                        </el-switch>
                    </el-form-item>
                    <el-form-item>
                        <el-switch
                            v-model="listQuery.publicFlag"
                            active-value="2"
                            inactive-value="1"
                            active-text="不公开"
                            inactive-text="公开">
                        </el-switch>
                    </el-form-item>-->

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
                    <el-form-item v-if="deptFilterVisible">
                        <el-select :size="searchSize" v-model="listQuery.organizationalCode" filterable clearable :placeholder="$t('table.pleaseSelect') + '区县'">
                            <el-option
                                v-for="item in this.$store.state.common.areas"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="deptFilterVisible">
                        <el-input clearable :size="searchSize" :placeholder="$t('table.pleaseInput') + '部门名称'" v-model="listQuery.proDepartment" style="width: 187px"></el-input>
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
<!--                <el-table-column type="selection" width="50" align="center"/>-->
<!--                <el-table-column align="center" label="事项编码" prop="itemCode"/>-->
                <el-table-column align="center" label="事项名称" prop="itemName"/>
                <el-table-column align="center" label="受理部门" prop="proDepartment"/>
<!--                <el-table-column align="center" label="评价渠道" prop="channel" width="180px">
                    <template slot-scope="scope">
                        {{scope.row.channel | enums('EvaluationChannelEnum')}}
                    </template>
                </el-table-column>-->
                <el-table-column align="center" label="整体满意度" prop="levelCode">
                    <template slot-scope="scope">
                        <el-rate
                            disabled
                            v-model="scope.row.levelCode | levelParseInt"
                            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                            :show-text="false"
                            :texts="['非常不满意', '不满意', '基本满意', '满意', '非常满意']">
                        </el-rate>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="评价人姓名" prop="userName">
                    <!--<template slot-scope="scope">
                        {{(scope.row.anonymityFlag == 1 || !scope.row.userName) ? '匿名用户' : scope.row.userName}}
                    </template>-->
                </el-table-column>
                <el-table-column align="center" label="评价时间" prop="submitTime"/>
                <el-table-column align="center" label="文字评价">
                    <template slot-scope="scope">
                        {{scope.row.words ? (scope.row.words.length > 9 ? scope.row.words.substr(0, 8) + '...' : scope.row.words) : '无'}}
                    </template>
                </el-table-column>
<!--                <el-table-column align="center" label="审核状态" prop="status" width="90px">
                    <template slot-scope="scope">
                        {{scope.row.status | enums('EvaluationStatusEnum')}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="是否匿名" prop="anonymityFlag" width="90px">
                    <template slot-scope="scope">
                        {{scope.row.anonymityFlag | enums('EvaluationAnonymityEnum')}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="是否公开" prop="publicFlag" width="90px">
                    <template slot-scope="scope">
                        {{scope.row.publicFlag | enums('EvaluationPublicEnum')}}
                    </template>
                </el-table-column>-->
<!--                <el-table-column align="center" label="整改回复内容" prop="reformContent" width="120px"/>-->
<!--                <el-table-column align="center" label="整改期限" prop="reformDate" width="120px"/>-->
<!--                <el-table-column align="center" label="组织机构代码" prop="organizationalCode"/>
                <el-table-column align="center" label="事项办理项编码" prop="processItemCode"/>
                <el-table-column align="center" label="事项主题" prop="subMatter"/>
                <el-table-column align="center" label="办件编号" prop="processNumber"/>
                <el-table-column align="center" label="办件状态" prop="proStatus"/>
                <el-table-column align="center" label="经办人" prop="proManager"/>
                <el-table-column align="center" label="评价人身份唯一标识" prop="userId"/>
                <el-table-column align="center" label="用户属性（个人=1、法人=2）" prop="userProp"/>
                <el-table-column align="center" label="测评指标编码（501，502），多选用,隔开" prop="contentCode"/>
                <el-table-column align="center" label="文字评价" prop="words"/>
                <el-table-column align="center" label="评价次数（首次评价=1，二次评价=2）" prop="number"/>
                <el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                            {{scope.row.enable | enums('EnableEnum')}}
                        </el-tag>
                    </template>
                </el-table-column>-->
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="100">
                    <template slot-scope="scope">
                        <!--<el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                                   @click.stop.safe="btnUpdate(scope.row)"></el-button>
                        <el-button v-if="btnEnable.delete" :title="$t('table.delete')" type="danger" icon="el-icon-delete" :size="btnSize" circle
                                   @click.stop.safe="btnDelete(scope.row)"></el-button>-->
                        <el-button type="primary" :size="btnSize" @click.stop.safe="showDetails(scope.row)">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="deyatech-pagination pull-right" background
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                           :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>

            <!--详情-->
            <el-dialog title="评价详情" :visible.sync="dialogVisibleDetails" width="80%"
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
                    <!--<tr>
                        <td class="column">经办人</td><td>{{detail.proManager}}</td>
                        <td class="column">审核状态</td><td>{{detail.status | enums('EvaluationStatusEnum')}}</td>
                    </tr>-->
                    <!--<tr>
                        <td class="column">是否匿名</td>
                        <td>{{detail.anonymityFlag | enums('EvaluationAnonymityEnum')}}</td>
                        <td class="column">是否公开</td>
                        <td>{{detail.publicFlag | enums('EvaluationPublicEnum')}}</td>
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
                        <td class="column">评价时间</td><td>{{detail.submitTime}}</td>
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

            <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible" width="60%"
                       :close-on-click-modal="closeOnClickModal" @close="closeDetailDialog">
                <el-form ref="detailDialogForm" class="deyatech-form" :model="detail" label-position="right"
                         label-width="80px" :rules="detailRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="组织机构代码" prop="organizationalCode">
                                <el-input v-model="detail.organizationalCode"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="事项编码" prop="itemCode">
                                <el-input v-model="detail.itemCode"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="事项办理项编码" prop="processItemCode">
                                <el-input v-model="detail.processItemCode"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="事项名称" prop="itemName">
                                <el-input v-model="detail.itemName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="事项主题（个人=1，法人=2）" prop="subMatter">
                                <el-input v-model="detail.subMatter"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="办件编号" prop="processNumber">
                                <el-input v-model="detail.processNumber"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="办件状态" prop="proStatus">
                                <el-input v-model="detail.proStatus"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="受理部门" prop="proDepartment">
                                <el-input v-model="detail.proDepartment"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="经办人" prop="proManager">
                                <el-input v-model="detail.proManager"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="评价渠道（pc端=1，移动端=2，二维码=3，政务大厅平板电脑=4，政务大厅其他终端=5）" prop="channel">
                                <el-input v-model="detail.channel"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="评价人身份唯一标识" prop="userId">
                                <el-input v-model="detail.userId"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="评价人姓名" prop="userName">
                                <el-input v-model="detail.userName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="用户属性（个人=1、法人=2）" prop="userProp">
                                <el-input v-model="detail.userProp"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="是否匿名（是=1、否=2）" prop="anonymityFlag">
                                <el-input v-model="detail.anonymityFlag"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="评价等级（整体满意度）" prop="levelCode">
                                <el-input v-model="detail.levelCode"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="测评指标编码（501，502），多选用,隔开" prop="contentCode">
                                <el-input v-model="detail.contentCode"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="文字评价" prop="words">
                                <el-input v-model="detail.words"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="提交时间" prop="submitTime">
                                <el-input v-model="detail.submitTime"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="评价次数（首次评价=1，二次评价=2）" prop="number">
                                <el-input v-model="detail.number"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="审核状态（无需审核=1，已审核=2，未审核=3）无审核系统默认为1" prop="status">
                                <el-input v-model="detail.status"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="是否公开（公开=1，不公开=2）无审核系统默认为1" prop="public">
                                <el-input v-model="detail.publicFlag"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model="detail.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeDetailDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
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
        delDetails,
        queryEvaluateRecordList
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
                    levelCode: undefined,
                    anonymityFlag: undefined,
                    publicFlag: undefined,
                    evaluationTimeStart: undefined,
                    evaluationTimeEnd: undefined
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
                },
                detailRules: {
                    organizationalCode: [
                        {required: true, message: this.$t("table.pleaseInput") + '组织机构代码'}
                    ],
                    itemCode: [
                        {required: true, message: this.$t("table.pleaseInput") + '事项编码'}
                    ],
                    processItemCode: [
                        {required: true, message: this.$t("table.pleaseInput") + '事项办理项编码'}
                    ],
                    itemName: [
                        {required: true, message: this.$t("table.pleaseInput") + '事项名称'}
                    ],
                    subMatter: [
                        {required: true, message: this.$t("table.pleaseInput") + '事项主题（个人=1，法人=2）'}
                    ],
                    processNumber: [
                        {required: true, message: this.$t("table.pleaseInput") + '办件编号'}
                    ],
                    proStatus: [
                        {required: true, message: this.$t("table.pleaseInput") + '办件状态'}
                    ],
                    proDepartment: [
                        {required: true, message: this.$t("table.pleaseInput") + '受理部门'}
                    ],
                    proManager: [
                        {required: true, message: this.$t("table.pleaseInput") + '经办人'}
                    ],
                    channel: [
                        {required: true, message: this.$t("table.pleaseInput") + '评价渠道（pc端=1，移动端=2，二维码=3，政务大厅平板电脑=4，政务大厅其他终端=5）'}
                    ],
                    userId: [
                        {required: true, message: this.$t("table.pleaseInput") + '评价人身份唯一标识'}
                    ],
                    userName: [
                        {required: true, message: this.$t("table.pleaseInput") + '评价人姓名'}
                    ],
                    userProp: [
                        {required: true, message: this.$t("table.pleaseInput") + '用户属性（个人=1、法人=2）'}
                    ],
                    anonymityFlag: [
                        {required: true, message: this.$t("table.pleaseInput") + '是否匿名（是=1、否=2）'}
                    ],
                    levelCode: [
                        {required: true, message: this.$t("table.pleaseInput") + '评价等级（整体满意度）'}
                    ],
                    contentCode: [
                        {required: true, message: this.$t("table.pleaseInput") + '测评指标编码（501，502），多选用,隔开'}
                    ],
                    words: [
                        {required: true, message: this.$t("table.pleaseInput") + '文字评价'}
                    ],
                    submitTime: [
                        {required: true, message: this.$t("table.pleaseInput") + '提交时间'}
                    ],
                    number: [
                        {required: true, message: this.$t("table.pleaseInput") + '评价次数（首次评价=1，二次评价=2）'}
                    ],
                    status: [
                        {required: true, message: this.$t("table.pleaseInput") + '审核状态（无需审核=1，已审核=2，未审核=3）无审核系统默认为1'}
                    ],
                    publicFlag: [
                        {required: true, message: this.$t("table.pleaseInput") + '是否公开（公开=1，不公开=2）无审核系统默认为1'}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                departmentList: [], //TODO  阿里提供接口查询
                submitTimeRange: [],
                levelParseInt: {},
                dialogVisibleDetails: false,
                recordsList: [],
                revisitRecordList: [],
                deptFilterVisible: false
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
                this.deptFilterVisible = true;
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
            resetSearch(){
                this.listQuery.channel = undefined;
                this.listQuery.itemCode = undefined;
                this.listQuery.itemName = undefined;
                this.listQuery.subMatter = undefined;
                this.listQuery.organizationalCode = undefined;
                this.listQuery.proDepartment = undefined;
                this.listQuery.userName = undefined;
                this.listQuery.levelCode = undefined;
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
                getDetailList(this.listQuery).then(response => {
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
            btnCreate(){
                this.resetDetail();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetDetail();
                if (row.id) {
                    this.detail = deepClone(row);
                } else {
                    this.detail = deepClone(this.selectedRows[0]);
                }
                this.dialogTitle = 'update';
                this.dialogVisible = true;
            },
            btnDelete(row){
                let ids = [];
                if (row.id) {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        ids.push(row.id);
                        this.doDelete(ids);
                    })
                } else {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        for(const deleteRow of this.selectedRows){
                            ids.push(deleteRow.id);
                        }
                        this.doDelete(ids);
                    })
                }
            },
            doCreate(){
                this.$refs['detailDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateDetail(this.detail).then(() => {
                            this.resetDetailDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['detailDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateDetail(this.detail).then(() => {
                            this.resetDetailDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delDetails(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
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
                if (!!submitTimeRange) {
                    this.listQuery.evaluationTimeStart = submitTimeRange[0];
                    this.listQuery.evaluationTimeEnd = submitTimeRange[1];
                } else {
                    this.listQuery.evaluationTimeStart = undefined;
                    this.listQuery.evaluationTimeEnd = undefined;
                }
            },
            showDetails(row){
                this.detail = deepClone(row);
                this.queryRecordList(this.detail.id);
                this.dialogVisibleDetails = true;
            },
            queryRecordList(detailId) {
                queryEvaluateRecordList(detailId).then(response => {
                    this.recordsList = response.data.recordsList;
                    this.revisitRecordList = response.data.revisitRecordList;
                })
            },
            closeDetailDialogDetails() {
                this.dialogVisibleDetails = false;
                this.resetDetail();
            }
        }
    }
</script>

<style scoped>
    @import "../../assets/css/evaluateReform.css";
</style>
