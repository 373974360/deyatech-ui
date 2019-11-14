<template>
    <basic-container>
        <el-row :span="24">
            <el-col :span="4">
                <div class="classificationTree">
                    <!--左侧树-->
                    <el-tree
                             :data="treeData"
                             node-key="value"
                             :highlight-current="true"
                             :default-expand-all="true"
                             :expand-on-click-node="false"
                             @node-click="handleNodeClick">
                    </el-tree>
                </div>
            </el-col>
            <el-col :span="20">
                <div class="deyatech-container pull-auto">
                    <div class="deyatech-header">
                        <el-form :inline="true" ref="searchForm">
                            <el-form-item>
                                <el-input :size="searchSize" placeholder="标题/姓名/编码/身份证号" v-model.trim="listQuery.title" maxlength="100"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-select filterable :size="searchSize" v-model.trim="listQuery.modelId" clearable placeholder="业务模型" style="width:100px;">
                                    <el-option v-for="item in modelList" :label="item.modelName" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-select filterable :size="searchSize" v-model.trim="listQuery.purId" clearable placeholder="诉求目的" style="width:100px;">
                                    <el-option v-for="item in purposeList" :label="item.purposeName" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-date-picker
                                    :size="searchSize"
                                    v-model.trim="timeFrame"
                                    type="daterange"
                                    align="right"
                                    unlink-panels
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    value-format="yyyy-MM-dd"
                                    :picker-options="pickerOptions">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="reloadList">{{$t('table.search')}}</el-button>
                                <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="deyatech-menu">
                        <div class="deyatech-menu_left">
                            <el-button v-if="btnEnable.create" type="primary" :size="btnSize" @click="btnCreate">{{$t('table.create')}}</el-button>
                            <el-button v-if="btnEnable.update" type="primary" :size="btnSize" @click="btnUpdate" :disabled="selectedRows.length != 1">{{$t('table.update')}}</el-button>
                            <el-button v-if="btnEnable.delete" type="danger" :size="btnSize" @click="btnDelete" :disabled="selectedRows.length < 1">{{$t('table.delete')}}</el-button>
                        </div>
                        <div class="deyatech-menu_right">
                            <!--<el-button type="primary" icon="el-icon-edit" :size="btnSize" circle @click="btnUpdate"></el-button>
                            <el-button type="danger" icon="el-icon-delete" :size="btnSize" circle @click="btnDelete"></el-button>-->
                            <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                        </div>
                    </div>
                    <el-table :data="recordList" v-loading.body="listLoading" stripe border highlight-current-row
                              @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="50" align="center"/>
                        <el-table-column align="left" label="标题" prop="title" min-width="300px;">
                            <template slot-scope="scope">
                                <nobr class="link-type" :title="scope.row.title" style="cursor:pointer" @click='processAppeal(scope.row)'>{{scope.row.title}}</nobr>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="收件部门" prop="deptName" min-width="130px;">
                            <template slot-scope="scope">
                                <nobr :title="scope.row.deptName">{{scope.row.deptName}}</nobr>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="回复部门" prop="replyDeptName" min-width="130px;">
                            <template slot-scope="scope">
                                <nobr :title="scope.row.replyDeptName">{{scope.row.replyDeptName}}</nobr>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="公开意愿" prop="isOpen" >
                            <template slot-scope="scope">
                                <span v-if="scope.row.isOpen == 1">
                                    是
                                </span>
                                <span v-if="scope.row.isOpen == 2">
                                    否
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="发布状态" prop="isPublish" >
                            <template slot-scope="scope">
                                <span v-if="scope.row.isPublish == 1">
                                    是
                                </span>
                                <span v-if="scope.row.isPublish == 2">
                                    否
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="来信时间" prop="createTime" min-width="170px;">
                            <template slot-scope="scope">
                                <nobr :title="scope.row.createTime">{{scope.row.createTime}}</nobr>
                            </template>
                        </el-table-column>
                        <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" fixed="right" align="center" width="150">
                            <template slot-scope="scope">
                                <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                                           @click.stop.safe="btnUpdate(scope.row)"></el-button>
                                <el-button title="办理" type="success" icon="el-icon-edit-outline" :size="btnSize" circle
                                           @click.stop.safe="processAppeal(scope.row)"></el-button>
                                <el-button v-if="btnEnable.delete" :title="$t('table.delete')" type="danger" icon="el-icon-delete" :size="btnSize" circle
                                           @click.stop.safe="btnDelete(scope.row)"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination class="deyatech-pagination pull-right" background
                                   :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                                   :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                                   @size-change="handleSizeChange" @current-change="handleCurrentChange">
                    </el-pagination>

                    <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible"
                               :close-on-click-modal="closeOnClickModal" @close="closeRecordDialog" width="60%">
                        <el-form ref="recordDialogForm" class="deyatech-form" :model="record" label-position="right"
                                 label-width="100px" :rules="recordRules">
                            <el-row :gutter="20" :span="24">
                                <el-col :span="24">
                                    <el-form-item label="标题" prop="title">
                                        <el-input v-model.trim="record.title" maxlength="100"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20" :span="24">
                                <el-col :span="12">
                                    <el-form-item label="业务模型" prop="modelId">
                                        <el-select filterable v-model.trim="record.modelId" placeholder="请选择业务模型" style="width:100%" @change="modelChange">
                                            <el-option v-for="item in modelList" :label="item.modelName" :value="item.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="诉求目的" prop="purId">
                                        <el-select filterable v-model.trim="record.purId" placeholder="请选择业务模型" style="width:100%">
                                            <el-option v-for="item in purposeList" :label="item.purposeName" :value="item.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20" :span="24">
                                <el-col :span="12">
                                    <el-form-item label="来信人姓名" prop="userName">
                                        <el-input v-model.trim="record.userName" maxlength="30"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="身份证号码" prop="cardId">
                                        <el-input v-model.trim="record.cardId" maxlength="18"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20" :span="24">
                                <el-col :span="12">
                                    <el-form-item label="手机号码" prop="phone">
                                        <el-input v-model.trim="record.phone" maxlength="11"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="电子邮箱" prop="email">
                                        <el-input v-model.trim="record.email" maxlength="50"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20" :span="24">
                                <el-col :span="24">
                                    <el-form-item label="通讯地址" prop="address">
                                        <el-input v-model.trim="record.address" maxlength="200"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20" :span="24">
                                <el-col :span="12">
                                    <el-form-item label="收件部门" prop="deptId">
                                        <el-cascader filterable style="width: 100%" :options="departmentCascader" v-model.trim="recordDepartment"
                                                     expand-trigger="hover" clearable @change="recordDepartmentChange" ></el-cascader>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="公开意愿" prop="isOpen">
                                        <el-switch
                                            v-model.trim="record.isOpen"
                                            :active-value=1 :inactive-value=2>
                                        </el-switch>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20" :span="24">
                                <el-col :span="24">
                                    <el-form-item label="来信内容" prop="content">
                                        <editor v-model.trim="record.content" :config="editorConfig" :default-msg="record.content" ref="content" id="content_index"></editor>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
                            <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                            <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                            <el-button :size="btnSize" @click="closeRecordDialog">{{$t('table.cancel')}}</el-button>
                        </span>
                    </el-dialog>
                    <!--***********************************************
                                 以下信件办理
                    ***********************************************-->
                    <el-dialog title="信件办理" :visible.sync="dialogProcessVisible"
                               :close-on-click-modal="closeOnClickModal" @close="closeProcessDialog" width="70%">
                        <el-collapse v-model.trim="activeName" accordion>
                            <el-collapse-item title="网民信息" name="1">
                                <table class="appeal_table">
                                    <tr>
                                        <th>姓　　名:</th>
                                        <td width="30%">{{record.userName}}</td>
                                        <th>证　　件:</th>
                                        <td width="30%">{{record.cardId}}</td>
                                    </tr>
                                    <tr>
                                        <th>手　　机:</th>
                                        <td>{{record.phone}}</td>
                                        <th>邮　　箱:</th>
                                        <td>{{record.email}}</td>
                                    </tr>
                                    <tr>
                                        <th>地　　址:</th>
                                        <td colspan="3">{{record.address}}</td>
                                    </tr>
                                </table>
                            </el-collapse-item>
                            <el-collapse-item title="信件信息" name="2">
                                <table class="appeal_table">
                                    <tr>
                                        <th>处理状态:</th>
                                        <td width="20%">
                                            {{record.flag | enums('AppealStatusEnum')}}
                                        </td>
                                        <th>信件编码:</th>
                                        <td width="20%">{{record.sqCode}}</td>
                                        <th>查询密码:</th>
                                        <td width="20%">{{record.queryCode}}</td>
                                    </tr>
                                    <tr>
                                        <th>收件单位:</th>
                                        <td>{{record.deptName}}</td>
                                        <th>来信时间:</th>
                                        <td>{{record.createTime}}</td>
                                        <th>诉求目的:</th>
                                        <td>{{record.purposeName}}</td>
                                    </tr>
                                    <tr>
                                        <th>递交渠道:</th>
                                        <td>{{record.modelName}}</td>
                                        <th>发布状态:</th>
                                        <td>
                                            <span v-if="record.isPublish == 1">
                                                已发布
                                            </span>
                                            <span v-if="record.isPublish == 2">
                                                未发布
                                            </span>
                                        </td>
                                        <th>公开意愿:</th>
                                        <td>
                                            <span v-if="record.isOpen == 1">
                                                公开
                                            </span>
                                            <span v-if="record.isOpen == 2">
                                                不公开
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>标　　题:</th>
                                        <td colspan="5">{{record.title}}</td>
                                    </tr>
                                    <tr>
                                        <th>来信内容:</th>
                                        <td colspan="5" v-html="record.content"></td>
                                    </tr>
                                </table>
                            </el-collapse-item>
                            <el-collapse-item title="处理记录" name="3">
                                <el-table :data="processList" stripe border highlight-current-row
                                          @selection-change="handleProcessSelectionChange">
                                    <el-table-column type="selection" width="50" align="center"/>
                                    <el-table-column align="center" label="处理部门" prop="proDeptName"/>
                                    <el-table-column align="center" label="处理类型" prop="proType">
                                        <template slot-scope="scope">
                                            {{scope.row.proType | enums('AppealProcessStatusEnum')}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" label="移交部门" prop="toDeptName"/>
                                    <el-table-column align="center" label="处理时间" prop="createTime" width="200"/>
                                    <el-table-column align="center" label="处理人" prop="createUserName" width="100"/>
                                    <el-table-column type="expand">
                                        <template slot-scope="props">
                                            <table class="appeal_table">
                                                <tr v-if="props.row.proType == 4">
                                                    <th>延期至:</th>
                                                    <td>
                                                        {{props.row.reasonsTime}}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>处理意见:</th>
                                                    <td>
                                                        <span v-html="props.row.proContent"></span>
                                                    </td>
                                                </tr>
                                            </table>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-collapse-item>
                            <el-collapse-item title="回复内容" name="4" :hidden="replyContentDisabled">
                                <table class="appeal_table">
                                    <tr>
                                        <th>回复时间:</th>
                                        <td>{{record.replyTime}}</td>
                                    </tr>
                                    <tr>
                                        <th>回复部门:</th>
                                        <td>{{record.replyDeptName}}</td>
                                    </tr>
                                    <tr>
                                        <th>回复内容:</th>
                                        <td v-html="record.replyContent"></td>
                                    </tr>
                                </table>
                            </el-collapse-item>
                            <el-collapse-item :title="processTitle" name="5" :hidden="processDisabled">
                                <el-form ref="processDialogForm" class="deyatech-form" :model="process" label-position="right"
                                         label-width="100px" :rules="processRulesType">
                                    <el-row :gutter="20" :span="24">
                                        <el-col :span="12">
                                            <el-form-item label="标题" prop="title" :hidden="titleDisabled">
                                                <el-input v-model.trim="process.title" maxlength="100"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="20" :span="24">
                                        <el-col :span="24">
                                            <el-form-item label="来信内容" prop="content" :hidden="contentDisabled">
                                                <editor v-model.trim="process.content" :config="editorConfig" :default-msg="process.content" ref="processContent" id="processContent_index"></editor>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="20" :span="24">
                                        <el-col :span="12">
                                            <el-form-item :label="proTimeLabel" prop="proTime" :hidden="proTimeDisabled">
                                                <el-date-picker
                                                    style="width:100%;"
                                                    v-model.trim="process.proTime"
                                                    type="datetime"
                                                    value-format="yyyy-MM-dd HH:mm:ss"
                                                    placeholder="选择时间">
                                                </el-date-picker>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="20" :span="24">
                                        <el-col :span="12">
                                            <el-form-item label="延期至" prop="reasonsTime" :hidden="reasonsTimeDisabled">
                                                <el-date-picker
                                                    style="width:100%;"
                                                    v-model.trim="process.reasonsTime"
                                                    type="datetime"
                                                    value-format="yyyy-MM-dd HH:mm:ss"
                                                    placeholder="选择时间">
                                                </el-date-picker>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="20" :span="24">
                                        <el-col :span="12">
                                            <el-form-item label="是否同意" prop="reasonsStatus" :hidden="reasonsStatusDisabled">
                                                <el-radio-group v-model="process.reasonsStatus">
                                                    <el-radio :label="1">同意</el-radio>
                                                    <el-radio :label="2">不同意</el-radio>
                                                </el-radio-group>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="20" :span="24">
                                        <el-col :span="12">
                                            <el-form-item label="移交部门" prop="toDeptId" :hidden="toDeptIdDisabled">
                                                <el-cascader filterable style="width: 100%" :options="departmentCascader" v-model.trim="process.toDeptId"
                                                             expand-trigger="hover" ></el-cascader>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="20" :span="24">
                                        <el-col :span="12">
                                            <el-form-item label="是否公开" prop="isOpen" :hidden="isOpenDisabled">
                                                <el-switch
                                                    v-model.trim="process.isOpen"
                                                    :active-value=1 :inactive-value=2>
                                                </el-switch>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="是否发布" prop="isPublish" :hidden="isPublishDisabled">
                                                <el-switch
                                                    v-model.trim="process.isPublish"
                                                    :active-value=1 :inactive-value=2>
                                                </el-switch>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="20" :span="24">
                                        <el-col :span="24">
                                            <el-form-item :label="proContentLabel" prop="proContent" :hidden="proContentDisabled">
                                                <editor v-model.trim="process.proContent" :config="editorConfig" :default-msg="process.proContent" ref="proContent" id="proContent_index"></editor>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-form>
                            </el-collapse-item>
                        </el-collapse>
                        <span v-if="process.proType != undefined" slot="footer" class="dialog-footer">
                            <el-button type="primary" :size="btnSize" @click="doCreateProcess">确定</el-button>
                            <el-button :size="btnSize" @click="backProcessDialog">返回</el-button>
                            <el-button :size="btnSize" @click="closeProcessDialog">取消</el-button>
                        </span>
                        <span v-else slot="footer" class="dialog-footer">
                            <el-button v-if="btnEnable.acceptance && this.record.flag == 1" type="primary" @click="btnProcess(1)" :size="btnSize">受理</el-button>
                            <el-button v-if="btnEnable.acceptance && this.record.flag == 1" type="primary" @click="btnProcess(2)" :size="btnSize">不予受理</el-button>
                            <el-button v-if="btnEnable.invalids && this.record.flag != 6" type="primary" @click="btnProcess(3)" :size="btnSize">置为无效</el-button>
                            <!--<el-button v-if="btnEnable.delay && appealDelay == 0" type="primary" @click="btnProcess(4)" :size="btnSize">延期</el-button>-->
                            <!--<el-button v-if="btnEnable.delay_sh && appealDelay == 1" type="primary" @click="btnProcess(5)" :size="btnSize">延期审核</el-button>-->
                            <el-button v-if="btnEnable.transfer && deptTransfer == 1" type="primary" @click="btnProcess(6)" :size="btnSize">转办</el-button>
                            <el-button v-if="btnEnable.reply" type="primary" @click="btnProcess(7)" :size="btnSize">回复</el-button>
                            <el-button v-if="btnEnable.returns && this.record.flag != 8" type="primary" @click="btnProcess(8)" :size="btnSize">退回</el-button>
                            <el-button v-if="btnEnable.release && this.record.isPublish != 1" type="primary" @click="btnProcess(9)" :size="btnSize">发布</el-button>
                            <el-button v-if="btnEnable.repeat" type="primary" :size="btnSize">判重</el-button>
                            <el-button type="primary" :size="btnSize">打印</el-button>
                            <el-button :size="btnSize" @click="closeProcessDialog">取消</el-button>
                        </span>
                    </el-dialog>
                </div>
            </el-col>
        </el-row>
    </basic-container>
</template>
<script>
    import editor from '@/components/editor/index.vue'
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getRecordList,
        createOrUpdateRecord,
        delRecords
    } from '@/api/appeal/record';
    import {getModelByCompetentDeptId,getModel} from '@/api/appeal/model';
    import {getPurposeAllList} from '@/api/appeal/purpose';
    import {getCompetentDept} from '@/api/appeal/record';
    import {
        getProcessAllList,
        createOrUpdateProcess
    } from '@/api/appeal/process';
    import {validateEmail, isMobile, cardid} from '@/util/validate';

    export default {
        name: 'record',
        components: {
            editor
        },
        data() {
            const validateCardId = (rule, value, callback) => {
                if (!value) {
                    callback()
                }
                let res = cardid(value);
                if (res[0]) {
                    callback(new Error(res[1]))
                } else {
                    callback()
                }
            };
            const validateMobile = (rule, value, callback) => {
                if (!value) {
                    callback()
                }
                if (isMobile(value)) {
                    callback()
                } else {
                    callback(new Error("手机号码不正确"))
                }
            };
            const validateMail = (rule, value, callback) => {
                if (!value) {
                    callback()
                }
                if (validateEmail(value)) {
                    callback()
                } else {
                    callback(new Error("电子邮箱不正确"))
                }
            };
            const validateReplyTime = (rule, value, callback) => {
                if (!value) {
                    callback()
                }
                // 来信时间
                if (this.record.createTime) {
                    if (this.record.createTime > value) {
                        callback(new Error("回复时间必须在来信时间之后"));
                    } else {
                        callback()
                    }
                } else {
                    callback(new Error("没有选择来信时间"));
                }
            };
            return {
                treeData:[{
                    label: '发布管理',
                    children: [{
                        label: '未发布',
                        isPublish: 2,
                        sqFlag: 0,
                        sqStatus: 0,
                        isBack: 0,
                        limitFlag: 0
                    },{
                        label: '已发布',
                        isPublish: 1,
                        sqFlag: 0,
                        sqStatus: 0,
                        isBack: 0,
                        limitFlag: 0
                    }]
                }, {
                    label: '信件管理',
                    children: [{
                        label: '待处理',
                        isPublish: 0,
                        sqFlag: 0,
                        sqStatus: 0,
                        isBack: 0,
                        limitFlag: 0
                    },{
                        label: '退回件',
                        isPublish: 0,
                        sqFlag: 0,
                        sqStatus: 0,
                        isBack: 1,
                        limitFlag: 0
                    },{
                        label: '办理中',
                        isPublish: 0,
                        sqFlag: 0,
                        sqStatus: 1,
                        isBack: 0,
                        limitFlag: 0
                    }, {
                        label: '待审核',
                        isPublish: 0,
                        sqFlag: 0,
                        sqStatus: 2,
                        isBack: 0,
                        limitFlag: 0
                    }, {
                        label: '已办结',
                        isPublish: 0,
                        sqFlag: 0,
                        sqStatus: 3,
                        isBack: 0,
                        limitFlag: 0
                    }]
                }, {
                    label: '督查督办',
                    children: [{
                        flag: 0,
                        isPublish: 0,
                        timeFlag: 1,
                        label: '预警件'
                    }, {
                        flag: 0,
                        isPublish: 0,
                        timeFlag: 2,
                        label: '黄牌件'
                    }, {
                        flag: 0,
                        isPublish: 0,
                        timeFlag: 3,
                        label: '红牌件'
                    }]
                }, {
                    label: '已处理信件',
                    children: [{
                        flag: 3,
                        isPublish: 0,
                        timeFlag: 0,
                        label: '不予受理'
                    }, {
                        flag: 6,
                        isPublish: 0,
                        timeFlag: 0,
                        label: '无效件'
                    }, {
                        flag: 7,
                        isPublish: 0,
                        timeFlag: 0,
                        label: '重复件'
                    }]
                }, {
                    label: '延期审核',
                    children: [{
                        label: '已审核'
                    }, {
                        flag: 6,
                        isPublish: 0,
                        timeFlag: 0,
                        label: '待审核'
                    }]
                }],
                recordList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    title: undefined,
                    modelId: undefined,
                    purId: undefined,
                    timeFrame: undefined,
                    userDepartmentId: this.$store.state.user.userInfo.departmentId,
                    isPublish: 0,
                    sqFlag: 0,
                    sqStatus: 0,
                    isBack: 0,
                    limitFlag: 0
                },
                recordDepartment: [],
                recordReplyDepartment: [],
                record: {
                    id: undefined,
                    modelId: undefined,
                    purId: undefined,
                    title: undefined,
                    userName: undefined,
                    cardId: undefined,
                    phone: undefined,
                    email: undefined,
                    ip: undefined,
                    address: undefined,
                    sqCode: undefined,
                    queryCode: undefined,
                    deptId: undefined,
                    proDeptId: undefined,
                    isOpen: 2,
                    content: undefined,
                    isPublish: 2,
                    replyContent: undefined,
                    replyTime: undefined,
                    replyDeptId: undefined,
                    createTime: undefined,
                    flag: 1,
                    treePosition: undefined,
                    replyTreePosition: undefined
                },
                recordRules: {
                    modelId: [
                        {required: true, message: this.$t("table.pleaseInput") + '业务ID'}
                    ],
                    title: [
                        {required: true, message: this.$t("table.pleaseInput") + '标题'}
                    ],
                    userName: [
                        {required: true, message: this.$t("table.pleaseInput") + '来信人姓名'}
                    ],
                    deptId: [
                        {required: true, message: this.$t("table.pleaseInput") + '收件部门'}
                    ],
                    content: [
                        {required: true, message: this.$t("table.pleaseInput") + '来信内容'}
                    ],
                    createTime: [
                        {required: true, message: this.$t("table.pleaseInput") + '来信时间'}
                    ],
                    phone: [
                        {validator: validateMobile, trigger: 'change'}
                    ],
                    cardId: [
                        {validator: validateCardId, trigger: 'change'}
                    ],
                    email: [
                        {validator: validateMail, trigger: 'change'}
                    ],
                    replyTime: [
                        {validator: validateReplyTime, trigger: 'change'}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                modelList: [],
                purposeList: [],
                departmentCascader: [],
                editorConfig: {
                    initialFrameWidth: '100%',
                    initialFrameHeight: 350,
                    zIndex: 3000,
                    toolbars: [
                        [
                            'fullscreen', 'source', '|', 'undo', 'redo', '|',
                            'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'searchreplace','|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
                            'fontfamily', 'fontsize', '|',
                            'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
                            'link', 'unlink', '|',
                            'insertimage', 'attachment','insertvideo','inserttable', '|',
                            'indent','removeformat', 'formatmatch', 'autotypeset','drafts'
                        ]
                    ]
                },
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
                timeFrame: undefined,
                processList: undefined,
                selecteProcessdRows: [],
                dialogProcessVisible: false,
                activeName: '1',
                replyContentDisabled: true,
                processDisabled: true,
                processTitle: '信件办理',
                process: {
                    id: undefined,
                    sqId: undefined,
                    proType: undefined,
                    proContent: undefined,
                    proDeptId: undefined,
                    toDeptId: undefined,
                    proTime: undefined,
                    isOpen: undefined,
                    isPublish: undefined,
                    title: undefined,
                    content: undefined,
                    reasonsTime: undefined,
                    reasonsStatus: undefined
                },
                proTimeLabel: '',
                proContentLabel: '',
                processRules_1: {
                    proTime: [
                        {required: true, message: this.$t("table.pleaseSelect") + "受理时间"}
                    ],
                    proContent: [
                        {required: true, message: this.$t("table.pleaseInput") + "受理意见"}
                    ]
                },
                processRules_2: {
                    proContent: [
                        {required: true, message: this.$t("table.pleaseInput") + "处理意见"}
                    ]
                },
                processRules_3: {
                    proContent: [
                        {required: true, message: this.$t("table.pleaseInput") + "延期原因"}
                    ]
                },
                processRules_4: {
                    toDeptId: [
                        {required: true, message: this.$t("table.pleaseSelect") + "移交部门"}
                    ],
                    proContent: [
                        {required: true, message: this.$t("table.pleaseInput") + "转办意见"}
                    ]
                },
                processRules_5: {
                    proTime: [
                        {required: true, message: this.$t("table.pleaseSelect") + "回复时间"}
                    ],
                    proContent: [
                        {required: true, message: this.$t("table.pleaseInput") + "回复内容"}
                    ]
                },
                processRules_6: {
                    proContent: [
                        {required: true, message: this.$t("table.pleaseInput") + "退回原因"}
                    ]
                },
                processRules_7: {
                    title: [
                        {required: true, message: this.$t("table.pleaseInput") + "信件标题"}
                    ],
                    content: [
                        {required: true, message: this.$t("table.pleaseInput") + "来信内容"}
                    ],
                    proTime: [
                        {required: true, message: this.$t("table.pleaseSelect") + "回复时间"}
                    ],
                    proContent: [
                        {required: true, message: this.$t("table.pleaseInput") + "退回原因"}
                    ],
                },
                proTimeDisabled: true,
                toDeptIdDisabled: true,
                isOpenDisabled: true,
                isPublishDisabled: true,
                proContentDisabled: true,
                titleDisabled: true,
                contentDisabled: true,
                reasonsTimeDisabled: true,
                reasonsStatusDisabled: true,
                processRulesType: {},
                deptTransfer: 0,
                appealDelay: 0,
                proCessListQuery: {
                    sqId: undefined,
                    proType: undefined
                }
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
                    create: this.permission.record_create,
                    update: this.permission.record_update,
                    delete: this.permission.record_delete,
                    acceptance: this.permission.record_acceptance,
                    repeat: this.permission.record_repeat,
                    invalids: this.permission.record_invalids,
                    delay: this.permission.record_delay,
                    delay_sh: this.permission.record_delay_sh,
                    transfer: this.permission.record_transfer,
                    reply: this.permission.record_reply,
                    returns: this.permission.record_returns,
                    release: this.permission.record_release
                };
            }
        },
        created(){
            this.$store.state.common.selectSiteDisplay = false;
            this.reloadList();
            this.getModelList();
            this.getPurposeList();
        },
        methods: {
            handleNodeClick(data) {
                this.listQuery.flag = data.flag;
                this.listQuery.isPublish = data.isPublish;
                this.listQuery.timeFlag = data.timeFlag;
                this.reloadList();
            },
            modelChange(v){
                this.getDepartmentCascader(v);
            },
            getDepartmentCascader(modelId) {
                this.departmentCascader = [];
                getCompetentDept({modelId:modelId}).then(response => {
                    this.departmentCascader = response.data;
                })
            },
            getModelById(id){
                this.deptTransfer = 0;
                getModel(id).then(response => {
                    if(response.data.competentDept.indexOf(this.$store.state.user.userInfo.departmentId)>=0){
                        this.deptTransfer = 1;
                    }else if(response.data.deptTransfer == 1){
                        this.deptTransfer = 1;
                    }
                })
            },
            getModelList(){
                this.modelList = [];
                getModelByCompetentDeptId({departmentId: this.$store.state.user.userInfo.departmentId}).then(response => {
                    this.modelList = response.data;
                })
            },
            getPurposeList(){
                this.purposeList = [];
                getPurposeAllList().then(response => {
                    this.purposeList = response.data;
                })
            },
            resetSearch(){
                this.listQuery.title = undefined;
                this.listQuery.modelId = undefined;
                this.listQuery.purId = undefined;
                this.listQuery.timeFrame = undefined;
                this.timeFrame = undefined;
                this.listQuery.isPublish = 0;
                this.listQuery.flag = 0;
                this.listQuery.userDepartmentId = this.$store.state.user.userInfo.departmentId
            },
            reloadList(){
                this.listLoading = true;
                this.recordList = undefined;
                this.total = undefined;
                let times = this.timeFrame;
                if(times != undefined){
                    this.listQuery.timeFrame = times[0]+","+times[1];
                }else{
                    this.listQuery.timeFrame = undefined;
                }
                getRecordList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.recordList = response.data.records;
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
                this.resetRecord();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetRecord();
                if (row.id) {
                    this.record = deepClone(row);
                } else {
                    this.record = deepClone(this.selectedRows[0]);
                }
                if (this.record.treePosition) this.recordDepartment = this.record.treePosition.substring(1).split('&');
                if (this.record.replyTreePosition) this.recordReplyDepartment = this.record.replyTreePosition.substring(1).split('&');
                this.dialogTitle = 'update';
                this.dialogVisible = true;
                this.getDepartmentCascader(this.record.modelId);
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
            recordDepartmentChange(v) {
                if (v && v.length > 0) {
                    this.record.deptId = v[v.length-1];
                } else {
                    this.record.deptId = undefined;
                }
            },
            recordReplyDepartmentChange(v) {
                if (v && v.length > 0) {
                    this.record.replyDeptId = v[v.length-1];
                } else {
                    this.record.replyDeptId = undefined;
                }
            },
            doCreate(){
                this.record.content = this.$refs['content'].getUeContent();
                this.$refs['recordDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateRecord(this.record).then(() => {
                            this.resetRecordDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        }, () => {
                            this.submitLoading = false;
                        }).catch(()=>{
                            this.submitLoading = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.record.content = this.$refs['content'].getUeContent();
                this.$refs['recordDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateRecord(this.record).then(() => {
                            this.resetRecordDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delRecords(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetRecord(){
                this.recordDepartment = [];
                this.recordReplyDepartment = [];
                this.record = {
                    id: undefined,
                    modelId: undefined,
                    purId: undefined,
                    title: undefined,
                    userName: undefined,
                    cardId: undefined,
                    phone: undefined,
                    email: undefined,
                    ip: undefined,
                    address: undefined,
                    sqCode: undefined,
                    queryCode: undefined,
                    deptId: undefined,
                    proDeptId: undefined,
                    isOpen: 2,
                    content: undefined,
                    isPublish: 2,
                    replyContent: undefined,
                    replyTime: undefined,
                    replyDeptId: undefined,
                    createTime: undefined,
                    flag: 1,
                    treePosition: undefined,
                    replyTreePosition: undefined
                };
            },
            resetRecordDialogAndList(){
                this.closeRecordDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeRecordDialog() {
                this.dialogVisible = false;
                this.resetRecord();
                this.$refs['recordDialogForm'].resetFields();
            },
            //***********************************************
            //             以下信件办理
            //***********************************************
            btnProcess(proType){
                this.resetProcess();
                this.processDisabled = false;
                this.activeName = '5';
                if(proType == 1){
                    this.processTitle = '受理信件';
                    this.proTimeLabel = '受理时间';
                    this.proContentLabel = '受理意见';
                    this.proTimeDisabled = false;
                    this.toDeptIdDisabled = true;
                    this.isOpenDisabled = true;
                    this.isPublishDisabled = true;
                    this.proContentDisabled = false;
                    this.titleDisabled = true;
                    this.contentDisabled = true;
                    this.reasonsTimeDisabled = true;
                    this.reasonsStatusDisabled = true;
                    this.processRulesType = this.processRules_1;
                }
                if(proType == 2){
                    this.processTitle = '不予受理';
                    this.proTimeLabel = '处理时间';
                    this.proContentLabel = '处理意见';
                    this.proTimeDisabled = true;
                    this.toDeptIdDisabled = true;
                    this.isOpenDisabled = true;
                    this.isPublishDisabled = true;
                    this.proContentDisabled = false;
                    this.titleDisabled = true;
                    this.contentDisabled = true;
                    this.reasonsTimeDisabled = true;
                    this.reasonsStatusDisabled = true;
                    this.processRulesType = this.processRules_2;
                }
                if(proType == 3){
                    this.processTitle = '置为无效';
                    this.proTimeLabel = '处理时间';
                    this.proContentLabel = '处理意见';
                    this.proTimeDisabled = true;
                    this.toDeptIdDisabled = true;
                    this.isOpenDisabled = true;
                    this.isPublishDisabled = true;
                    this.proContentDisabled = false;
                    this.titleDisabled = true;
                    this.contentDisabled = true;
                    this.reasonsTimeDisabled = true;
                    this.reasonsStatusDisabled = true;
                    this.processRulesType = this.processRules_2;
                }
                if(proType == 4){
                    this.processTitle = '信件延期';
                    this.proTimeLabel = '处理时间';
                    this.proContentLabel = '延期原因';
                    this.proTimeDisabled = true;
                    this.toDeptIdDisabled = true;
                    this.isOpenDisabled = true;
                    this.isPublishDisabled = true;
                    this.proContentDisabled = false;
                    this.titleDisabled = true;
                    this.contentDisabled = true;
                    this.reasonsTimeDisabled = false;
                    this.reasonsStatusDisabled = true;
                    this.processRulesType = this.processRules_3;
                }
                if(proType == 5){
                    this.processTitle = '延期审核';
                    this.proTimeLabel = '处理时间';
                    this.proContentLabel = '处理意见';
                    this.proTimeDisabled = true;
                    this.toDeptIdDisabled = true;
                    this.isOpenDisabled = true;
                    this.isPublishDisabled = true;
                    this.proContentDisabled = false;
                    this.titleDisabled = true;
                    this.contentDisabled = true;
                    this.reasonsTimeDisabled = true;
                    this.reasonsStatusDisabled = false;
                    this.process.reasonsStatus = 2;
                    this.processRulesType = this.processRules_3;
                }
                if(proType == 6){
                    this.processTitle = '信件转办';
                    this.proTimeLabel = '转办时间';
                    this.proContentLabel = '转办意见';
                    this.proTimeDisabled = true;
                    this.toDeptIdDisabled = false;
                    this.isOpenDisabled = true;
                    this.isPublishDisabled = true;
                    this.proContentDisabled = false;
                    this.titleDisabled = true;
                    this.contentDisabled = true;
                    this.reasonsTimeDisabled = true;
                    this.reasonsStatusDisabled = true;
                    this.processRulesType = this.processRules_4;
                }
                if(proType == 7){
                    this.processTitle = '回复信件';
                    this.proTimeLabel = '回复时间';
                    this.proContentLabel = '回复内容';
                    this.proTimeDisabled = false;
                    this.toDeptIdDisabled = true;
                    this.isOpenDisabled = false;
                    this.isPublishDisabled = false;
                    this.proContentDisabled = false;
                    this.titleDisabled = true;
                    this.contentDisabled = true;
                    this.reasonsTimeDisabled = true;
                    this.reasonsStatusDisabled = true;
                    this.processRulesType = this.processRules_5;
                    this.process.isOpen = this.record.isOpen;
                    this.process.isPublish = this.record.isPublish;
                }
                if(proType == 8){
                    this.processTitle = '退回信件';
                    this.proTimeLabel = '退回时间';
                    this.proContentLabel = '退回原因';
                    this.proTimeDisabled = true;
                    this.toDeptIdDisabled = true;
                    this.isOpenDisabled = true;
                    this.isPublishDisabled = true;
                    this.proContentDisabled = false;
                    this.titleDisabled = true;
                    this.contentDisabled = true;
                    this.reasonsTimeDisabled = true;
                    this.reasonsStatusDisabled = true;
                    this.processRulesType = this.processRules_6;
                }
                if(proType == 9){
                    this.processTitle = '发布信件';
                    this.proTimeLabel = '回复时间';
                    this.proContentLabel = '回复内容';
                    this.proTimeDisabled = false;
                    this.toDeptIdDisabled = true;
                    this.isOpenDisabled = false;
                    this.isPublishDisabled = false;
                    this.proContentDisabled = false;
                    this.titleDisabled = false;
                    this.contentDisabled = false;
                    this.reasonsTimeDisabled = true;
                    this.reasonsStatusDisabled = true;
                    this.processRulesType = this.processRules_7;
                    this.process.isOpen = this.record.isOpen;
                    this.process.isPublish = 1;
                    this.process.title = this.record.title;
                    this.process.content = this.record.content;
                    this.process.proTime = this.record.replyTime;
                    this.process.proContent = this.record.replyContent;
                }
                this.process.proType = proType;
                this.process.sqId = this.record.id;
            },
            doCreateProcess(){
                this.process.proContent = this.$refs['proContent'].getUeContent();
                this.process.content = this.$refs['processContent'].getUeContent();
                this.$refs['processDialogForm'].validate(valid => {
                    if(valid) {
                        const toDeptId = this.process.toDeptId;
                        if(Array.isArray(toDeptId)){
                            this.process.toDeptId = toDeptId[toDeptId.length-1];
                        }
                        createOrUpdateProcess(this.process).then(() => {
                            this.resetProcessDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            handleProcessSelectionChange(rows){
                this.selecteProcessdRows = rows;
            },
            getProcessDelayList(id){
                this.resetProCessListQuery();
                this.proCessListQuery.sqId = id;
                this.proCessListQuery.proType = 4;
                this.appealDelay = 0;
                getProcessAllList(this.proCessListQuery).then(response => {
                    if(response.data != undefined && response.data.length > 0 && response.data[0].reasonsStatus == undefined){
                        this.appealDelay = 1;
                    }
                })
            },
            getProcessList(id){
                this.processList = [];
                this.resetProCessListQuery();
                this.proCessListQuery.sqId = id;
                getProcessAllList(this.proCessListQuery).then(response => {
                    this.processList = response.data;
                })
            },
            processAppeal(row){
                this.resetRecord();
                if (row.id) {
                    this.record = deepClone(row);
                } else {
                    this.record = deepClone(this.selectedRows[0]);
                }
                this.getModelById(this.record.modelId);
                this.dialogProcessVisible = true;
                if(this.record.flag == 4){
                    this.replyContentDisabled = false;
                }
                this.getProcessDelayList(this.record.id);
                this.getProcessList(this.record.id);
                this.getDepartmentCascader(this.record.modelId);
            },
            resetProCessListQuery(){
                this.proCessListQuery = {
                    sqId: undefined,
                    proType: undefined
                }
            },
            resetProcess(){
                this.process = {
                    id: undefined,
                    sqId: undefined,
                    proType: undefined,
                    proContent: undefined,
                    proDeptId: undefined,
                    toDeptId: undefined,
                    proTime: undefined,
                    isOpen: undefined,
                    isPublish: undefined,
                    title: undefined,
                    content: undefined,
                    reasonsTime: undefined,
                    reasonsStatus: undefined
                }
            },
            backProcessDialog(){
                this.process.proType = undefined;
                this.processDisabled = true;
                this.activeName = '3';
            },
            closeProcessDialog() {
                this.resetRecord();
                this.resetProcess();
                this.dialogProcessVisible = false;
                this.activeName = '1';
                this.processDisabled = true;
                this.replyContentDisabled = true;
                this.processRulesType = {};
            },
            resetProcessDialogAndList(){
                this.closeProcessDialog();
                this.submitLoading = false;
                this.reloadList();
            },
        }
    }
</script>
<style>
    .appeal_table {
        width:100%;
    }
    .appeal_table th {
        width:100px;
        text-align:right;
        padding-right:10px;
        height:35px;
    }
    .appeal_table td {
        text-align:left;
        height:35px;
    }
    .classificationTree {
        border:1px solid #eceef5;
        margin-right:10px;
        padding: 10px;
        height: 100%;
    }
</style>
