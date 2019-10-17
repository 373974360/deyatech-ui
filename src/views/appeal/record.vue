<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" placeholder="标题/姓名/编码/身份证号" v-model.trim="listQuery.title" maxlength="100"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-select :size="searchSize" v-model.trim="listQuery.modelId" clearable placeholder="业务模型" style="width:120px;">
                            <el-option v-for="item in modelList" :label="item.modelName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select :size="searchSize" v-model.trim="listQuery.purId" clearable placeholder="诉求目的" style="width:120px;">
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
            <el-tabs v-model.trim="activeTabName" type="card" @tab-click="handleTabClick">
                <el-tab-pane label="未处理" name="first"></el-tab-pane>
                <el-tab-pane label="已受理" name="second"></el-tab-pane>
                <el-tab-pane label="办理中" name="third"></el-tab-pane>
                <el-tab-pane label="已办结" name="fourth"></el-tab-pane>
                <el-tab-pane label="已发布" name="fifth"></el-tab-pane>
                <el-tab-pane label="未发布" name="sixth"></el-tab-pane>
                <el-tab-pane label="无效件" name="seventh"></el-tab-pane>
            </el-tabs>
            <el-table :data="recordList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange" style="border-top:none;">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="left" label="标题" prop="title" min-width="400">
                    <template slot-scope="scope">
                        <span class="link-type" style="cursor:pointer" @click='processAppeal(scope.row)'>{{scope.row.title}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="业务模型" prop="modelName" width="90"/>
                <el-table-column align="center" label="诉求目的" prop="purposeName" width="90"/>
                <el-table-column align="center" label="来信人IP" prop="ip" width="130"/>
                <el-table-column align="center" label="收件部门" prop="deptName" width="150"/>
                <el-table-column align="center" label="回复部门" prop="replyDeptName" width="150"/>
                <el-table-column align="center" label="公开意愿" prop="isOpen" width="90">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isOpen == 1">
                            是
                        </span>
                        <span v-if="scope.row.isOpen == 2">
                            否
                        </span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="发布状态" prop="isPublish" width="90">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isPublish == 1">
                            是
                        </span>
                        <span v-if="scope.row.isPublish == 2">
                            否
                        </span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="来信时间" prop="createTime" width="200"/>
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
                        <el-col :span="12">
                            <el-form-item label="标题" prop="title">
                                <el-input v-model.trim="record.title" maxlength="100"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="信件状态" prop="flag">
                                <el-radio-group v-model.trim="record.flag">
                                    <el-radio :label="2">已受理</el-radio>
                                    <el-radio :label="3">办理中</el-radio>
                                    <el-radio :label="4">已办结</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="业务模型" prop="modelId">
                                <el-select v-model.trim="record.modelId" placeholder="请选择业务模型" style="width:100%">
                                    <el-option v-for="item in modelList" :label="item.modelName" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="诉求目的" prop="purId">
                                <el-select v-model.trim="record.purId" placeholder="请选择业务模型" style="width:100%">
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
                            <el-form-item label="来信时间" prop="createTime">
                                <el-date-picker
                                    style="width:100%;"
                                    v-model.trim="record.createTime"
                                    type="datetime"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="选择来信时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="收件部门" prop="deptId">
                                <el-cascader style="width: 100%" :options="departmentCascader" v-model.trim="recordDepartment"
                                             expand-trigger="hover" clearable @change="recordDepartmentChange" ></el-cascader>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="公开意愿" prop="isOpen">
                                <el-switch
                                    v-model.trim="record.isOpen"
                                    active-text="是"
                                    inactive-text="否"
                                    :active-value=1 :inactive-value=2>
                                </el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="是否发布" prop="isPublish">
                                <el-switch
                                    v-model.trim="record.isPublish"
                                    active-text="是"
                                    inactive-text="否"
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
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="回复时间" prop="replyTime">
                                <el-date-picker
                                    style="width:100%;"
                                    v-model.trim="record.replyTime"
                                    type="datetime"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="选择来信时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="回复部门" prop="replyDeptId">
                                <el-cascader style="width: 100%" :options="departmentCascader" v-model.trim="recordReplyDepartment"
                                             expand-trigger="hover" clearable @change="recordReplyDepartmentChange"></el-cascader>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="回复内容" prop="replyContent">
                                <editor v-model.trim="record.replyContent" :config="editorConfig" :default-msg="record.replyContent" ref="replyContent" id="replyContent_index"></editor>
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
                                <td>{{record.userName}}</td>
                                <th>证　　件:</th>
                                <td>{{record.cardId}}</td>
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
                                <td>
                                    <span v-if="record.flag == 1">
                                        未处理
                                    </span>
                                    <span v-if="record.flag == 2">
                                        已受理
                                    </span>
                                    <span v-if="record.flag == 3">
                                        办理中
                                    </span>
                                    <span v-if="record.flag == 4">
                                        已办结
                                    </span>
                                    <span v-if="record.flag == 5">
                                        无效件
                                    </span>
                                </td>
                                <th>信件编码:</th>
                                <td>{{record.sqCode}}</td>
                                <th>查询密码:</th>
                                <td>{{record.queryCode}}</td>
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
                                    <span v-if="scope.row.proType == 1">
                                        信件受理
                                    </span>
                                    <span v-if="scope.row.proType == 2">
                                        设为无效件
                                    </span>
                                    <span v-if="scope.row.proType == 3">
                                        申请延期
                                    </span>
                                    <span v-if="scope.row.proType == 4">
                                        信件转办
                                    </span>
                                    <span v-if="scope.row.proType == 5">
                                        信件回复
                                    </span>
                                    <span v-if="scope.row.proType == 6">
                                        退回信件
                                    </span>
                                    <span v-if="scope.row.proType == 7">
                                        同意延期
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="移交部门" prop="toDeptName"/>
                            <el-table-column align="center" label="处理时间" prop="createTime" width="200"/>
                            <el-table-column align="center" label="处理人" prop="createUserName" width="100"/>
                            <el-table-column type="expand">
                                <template slot-scope="props">
                                    <span v-html="props.row.proContent"></span>
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
                                    <el-form-item label="移交部门" prop="toDeptId" :hidden="toDeptIdDisabled">
                                        <el-cascader style="width: 100%" :options="departmentCascader" v-model.trim="process.toDeptId"
                                                     expand-trigger="hover" ></el-cascader>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20" :span="24">
                                <el-col :span="12">
                                    <el-form-item label="是否公开" prop="isOpen" :hidden="isOpenDisabled">
                                        <el-switch
                                            v-model.trim="process.isOpen"
                                            active-text="是"
                                            inactive-text="否"
                                            :active-value=1 :inactive-value=2>
                                        </el-switch>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="是否发布" prop="isPublish" :hidden="isPublishDisabled">
                                        <el-switch
                                            v-model.trim="process.isPublish"
                                            active-text="是"
                                            inactive-text="否"
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
                    <el-button :size="btnSize" @click="closeProcessDialog">取消</el-button>
                </span>
                <span v-else slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="btnProcess(1)" :size="btnSize">受理信件</el-button>
                    <el-button type="primary" @click="btnProcess(2)" :size="btnSize">置为无效</el-button>
                    <el-button type="primary" @click="btnProcess(3)" :size="btnSize">申请延期</el-button>
                    <el-button type="primary" @click="btnProcess(4)" :size="btnSize">转办信件</el-button>
                    <el-button type="primary" @click="btnProcess(5)" :size="btnSize">回复信件</el-button>
                    <el-button type="primary" @click="btnProcess(6)" :size="btnSize">退回信件</el-button>
                    <el-button type="primary" @click="btnProcess(7)" :size="btnSize">发布信件</el-button>
                    <el-button type="primary" :size="btnSize">打印信件</el-button>
                    <el-button :size="btnSize" @click="closeProcessDialog">取消</el-button>
                </span>
            </el-dialog>
        </div>
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
    import {getModeAllList} from '@/api/appeal/model';
    import {getPurposeAllList} from '@/api/appeal/purpose';
    import {getDepartmentCascader} from '@/api/admin/department';
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
                    callback()
                } else {
                    callback(new Error(res[1]))
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
                    isPublish: 0,
                    flag: 1
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
                    flag: 0,
                    treePosition: undefined,
                    replyTreePosition: undefined
                },
                recordRules: {
                    modelId: [
                        {required: true, message: this.$t("table.pleaseInput") + '业务ID'}
                    ],
                    purId: [
                        {required: true, message: this.$t("table.pleaseInput") + '诉求目的'}
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
                    content: undefined
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
                processRulesType: [],
                activeTabName: 'first'
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
                    delete: this.permission.record_delete
                };
            }
        },
        created(){
            this.$store.state.common.selectSiteDisplay = false;
            this.reloadList();
            this.getModelList();
            this.getPurposeList();
            this.getDepartmentCascader();
        },
        methods: {
            handleTabClick(tab){
                if(tab.name == 'first'){
                    this.listQuery.isPublish = 0;
                    this.listQuery.flag = 1;
                }
                if(tab.name == 'second'){
                    this.listQuery.isPublish = 0;
                    this.listQuery.flag = 2;
                }
                if(tab.name == 'third'){
                    this.listQuery.isPublish = 0;
                    this.listQuery.flag = 3;
                }
                if(tab.name == 'fourth'){
                    this.listQuery.isPublish = 0;
                    this.listQuery.flag = 4;
                }
                if(tab.name == 'fifth'){
                    this.listQuery.isPublish = 1;
                    this.listQuery.flag = 0;
                }
                if(tab.name == 'sixth'){
                    this.listQuery.isPublish = 2;
                    this.listQuery.flag = 0;
                }
                if(tab.name == 'seventh'){
                    this.listQuery.isPublish = 0;
                    this.listQuery.flag = 5;
                }
                this.reloadList();
            },
            getDepartmentCascader() {
                this.departmentCascader = [];
                getDepartmentCascader().then(response => {
                    this.departmentCascader = response.data;
                })
            },
            getModelList(){
                this.modelList = [];
                getModeAllList().then(response => {
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
                this.listQuery.flag = 1;
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
                this.record.replyContent = this.$refs['replyContent'].getUeContent();
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
                this.record.replyContent = this.$refs['replyContent'].getUeContent();
                this.$refs['recordDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        const deptId = this.record.deptId;
                        if(Array.isArray(deptId)){
                            this.record.deptId = deptId[deptId.length-1];
                        }
                        const replyDeptId = this.record.replyDeptId;
                        if(Array.isArray(replyDeptId)){
                            this.record.replyDeptId = replyDeptId[replyDeptId.length-1];
                        }
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
                    flag: 0,
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
                    this.processRulesType = this.processRules_1;
                }
                if(proType == 2){
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
                    this.processRulesType = this.processRules_2;
                }
                if(proType == 3){
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
                    this.processRulesType = this.processRules_3;
                }
                if(proType == 4){
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
                    this.processRulesType = this.processRules_4;
                }
                if(proType == 5){
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
                    this.processRulesType = this.processRules_5;
                    this.process.isOpen = this.record.isOpen;
                    this.process.isPublish = this.record.isPublish;
                }
                if(proType == 6){
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
                    this.processRulesType = this.processRules_6;
                }
                if(proType == 7){
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
                    this.processRulesType = this.processRules_7;
                    this.process.isOpen = this.record.isOpen;
                    this.process.isPublish = this.record.isPublish;
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
            getProcessList(id){
                this.processList = [];
                getProcessAllList({sqId:id}).then(response => {
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
                this.dialogProcessVisible = true;
                if(row.flag == 4){
                    this.replyContentDisabled = false;
                }
                this.getProcessList(row.id);
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
                    content: undefined
                }
            },
            closeProcessDialog() {
                this.resetRecord();
                this.resetProcess();
                this.dialogProcessVisible = false;
                this.activeName = '1';
                this.processDisabled = true;
                this.replyContentDisabled = true;
                this.processRulesType = [];
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
    .el-tabs__header{margin:0;}
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
</style>
