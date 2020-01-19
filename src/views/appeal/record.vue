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
                    <div class="deyatech-menu">
                        <div class="deyatech-menu_left">
                            <el-button v-if="btnEnable.create" type="primary" :size="btnSize" @click="btnCreate">{{$t('table.create')}}</el-button>
                            <el-button v-if="btnEnable.update" type="primary" :size="btnSize" @click="btnUpdate" :disabled="selectedRows.length != 1">{{$t('table.update')}}</el-button>
                            <el-button v-if="btnEnable.delete" type="danger" :size="btnSize" @click="btnDelete" :disabled="selectedRows.length < 1">{{$t('table.delete')}}</el-button>

                            <el-input :size="searchSize" placeholder="标题/姓名/编码/身份证号" v-model.trim="listQuery.title" maxlength="100" style="width: 170px;margin-left: 10px;margin-right:10px;"></el-input>
                            <el-select filterable :size="searchSize" v-model.trim="listQuery.modelId" clearable placeholder="业务模型" style="width:120px;">
                                <el-option v-for="item in modelList" :label="item.modelName" :value="item.id"></el-option>
                            </el-select>
                            <el-select filterable :size="searchSize" v-model.trim="listQuery.purId" clearable placeholder="诉求目的" style="width:100px;margin-left: 10px;margin-right:10px;">
                                <el-option v-for="item in purposeList" :label="item.purposeName" :value="item.id"></el-option>
                            </el-select>
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
                                :picker-options="pickerOptions" style="width:250px; margin-right: 10px;">
                            </el-date-picker>
                            <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="reloadList">{{$t('table.search')}}</el-button>
                            <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}</el-button>
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
                        <el-table-column align="left" label="标题" prop="title" width="300px;">
                            <template slot-scope="scope">
                                <nobr class="link-type" :title="scope.row.title" style="cursor:pointer" @click='processAppeal(scope.row)'>{{scope.row.title}}</nobr>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="收件部门" prop="deptName" width="130px;">
                            <template slot-scope="scope">
                                <nobr :title="scope.row.deptName">{{scope.row.deptName}}</nobr>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="回复部门" prop="replyDeptName" width="130px;">
                            <template slot-scope="scope">
                                <nobr :title="scope.row.replyDeptName">{{scope.row.replyDeptName}}</nobr>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="公开意愿" prop="isOpen" >
                            <template slot-scope="scope">
                                {{scope.row.isOpen | enums('YesNoEnum')}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="办理状态" prop="sqStatus" >
                            <template slot-scope="scope">
                                {{scope.row.sqStatus | enums('AppealStatusEnum')}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="发布状态" prop="isPublish" >
                            <template slot-scope="scope">
                                {{scope.row.isPublish | enums('YesNoEnum')}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="来信时间" prop="createTime" width="170px;">
                            <template slot-scope="scope">
                                <nobr :title="scope.row.createTime">{{scope.row.createTime}}</nobr>
                            </template>
                        </el-table-column>
                        <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" fixed="right" align="center" width="150">
                            <template slot-scope="scope">
                                <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                                           @click.stop.safe="btnUpdate(scope.row)"></el-button>
                                <el-button v-if="btnEnable.handle" title="办理" type="success" icon="el-icon-edit-outline" :size="btnSize" circle
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
                                        <el-select filterable v-model.trim="record.purId" placeholder="请选择业务模型" style="width:100%" no-data-text="无数据">
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
                                            {{record.sqStatus | enums('AppealStatusEnum')}}
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
                                            {{record.isPublish | enums('AppealStatusEnum')}}
                                        </td>
                                        <th>公开意愿:</th>
                                        <td>
                                            {{record.isOpen | enums('AppealStatusEnum')}}
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
                                                    :picker-options="pickerOptionsTime"
                                                    placeholder="选择时间">
                                                </el-date-picker>
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
                                                    :active-value=1 :inactive-value=0>
                                                </el-switch>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="是否发布" prop="isPublish" :hidden="isPublishDisabled">
                                                <el-switch
                                                    v-model.trim="process.isPublish"
                                                    :active-value=1 :inactive-value=0>
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
                            <!--正常信件可操作-->
                            <template v-if="record.sqFlag == 0">
                                <!--当前登录用户为主管部门 或者 业务模式为部门间可以转办 则显示转办按钮-->
                                <el-button v-if="competentDepartment || deptTransfer" type="primary" @click="btnProcess(1)" :size="btnSize">转办</el-button>
                                <el-button type="primary" @click="btnProcess(2)" :size="btnSize">回复</el-button>
                                <!--由发布权限的用户可以看到发布按钮-->
                                <el-button v-if="btnEnable.release" type="primary" @click="btnProcess(3)" :size="btnSize">发布</el-button>
                                <!--主管部门可以判重，职位无效，不予受理，督办-->
                                <template v-if="competentDepartment">
                                    <!--未办结-->
                                    <template v-if="record.sqStatus < 3">
                                        <el-button type="primary" @click="btnRepeat()" :size="btnSize">判重</el-button>
                                        <el-button type="primary" @click="btnProcess(6)" :size="btnSize">置为无效</el-button>
                                        <el-button type="primary" @click="btnProcess(8)" :size="btnSize">不予受理</el-button>
                                        <!--未督办信件才可督办-->
                                        <el-button v-if="record.superviseFlag == 0" type="primary" @click="btnSupervise()" :size="btnSize">督办</el-button>
                                        <!--待审核的延期-->
                                        <el-button v-if="record.limitFlag == 2" type="primary" @click="btnDelay()" :size="btnSize">延期审核</el-button>
                                    </template>
                                </template>
                                <!--参与部门有 退回 和 申请延期 的功能-->
                                <template v-if="!competentDepartment">
                                    <!--收件部门和处理部门为同一部门时代表网民直投，不允许退回-->
                                    <el-button v-if="record.deptId != record.proDeptId" type="primary" @click="btnProcess(4)" :size="btnSize">退回</el-button>
                                    <!--信件状态为预警件，并且未申请过延期，并且信件状态未办结-->
                                    <el-button v-if="record.alarmFlag > 0 && record.limitFlag == 0 && record.sqStatus < 3" type="primary" @click="btnProcess(7)" :size="btnSize">申请延期</el-button>
                                </template>
                            </template>
                            <el-button type="primary" :size="btnSize">打印</el-button>
                            <el-button :size="btnSize" @click="closeProcessDialog">取消</el-button>
                        </span>
                    </el-dialog>



                    <!--***********************************************
                                 以下信件判重
                    ***********************************************-->
                    <el-dialog title="信件判重" :visible.sync="repeatDdialog"
                               :close-on-click-modal="closeOnClickModal" @close="closeRepeatDialog" width="70%">
                        <div class="deyatech-menu">
                            <div class="deyatech-menu_left">
                                <el-select v-model.trim="repeatType" :size="searchSize" @change="repeatChange" placeholder="匹配方式">
                                    <el-option v-for="item in repeatTypeList" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </div>
                            <div class="deyatech-menu_right">
                                <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadRepeatAppealList"></el-button>
                            </div>
                        </div>
                        <el-table :data="repeatAppealList" v-loading.body="repeatListLoading" stripe border highlight-current-row
                                  @selection-change="handleRepeatSelectionChange">
                            <el-table-column type="selection" width="50" align="center"/>
                            <el-table-column align="left" label="信件标题" prop="title"/>
                            <el-table-column align="center" label="来信人" prop="userName"/>
                        </el-table>
                        <span slot="footer" class="dialog-footer">
                            <el-button type="primary" :size="btnSize" @click="btnSetRepeat">置为重复件</el-button>
                            <el-button :size="btnSize" @click="closeRepeatDialog">取消</el-button>
                        </span>
                    </el-dialog>

                    <!--***********************************************
                                 以下信件延期审核
                    ***********************************************-->
                    <el-dialog title="延期审核" :visible.sync="delayDdialog"
                               :close-on-click-modal="closeOnClickModal" @close="closeDelayDialog" width="40%">
                        此信件申请延期至：{{record.limitFlagTime}}
                        <span slot="footer" class="dialog-footer">
                            <el-button type="primary" :size="btnSize" @click="btnSetDelay(11)">同意延期</el-button>
                            <el-button type="danger" :size="btnSize" @click="btnSetDelay(10)">不予延期</el-button>
                            <el-button :size="btnSize" @click="closeDelayDialog">取消</el-button>
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
        delRecords,
        getCompetentDept,
        listRepeatByRecord,
        reloadTreeData
    } from '@/api/appeal/record';
    import {getModelByCompetentDeptId,getModel} from '@/api/appeal/model';
    import {getPurposeAllList} from '@/api/appeal/purpose';
    import {
        getProcessAllList,
        createOrUpdateProcess,
        setRepeatProcess
    } from '@/api/appeal/process';
    import {isvalidatemobile, validateEmail, isMobile, cardid, isTelephone} from '@/util/validate';
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
                let result = isvalidatemobile(value)
                if (result[0]) {
                    callback(new Error(result[1]))
                } else {
                    callback()
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
                treeData: undefined,
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
                    isPublish: undefined,
                    sqFlag: 0,
                    sqStatus: undefined,
                    isBack: undefined,
                    limitFlag: undefined,
                    alarmFlag: undefined,
                    superviseFlag: undefined
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
                    isOpen: 1,
                    content: undefined,
                    replyContent: undefined,
                    replyTime: undefined,
                    replyDeptId: undefined,
                    createTime: undefined,
                    treePosition: undefined,
                    replyTreePosition: undefined,
                    isPublish: 0,
                    sqFlag: 0,
                    sqStatus: 0,
                    isBack: 0,
                    limitFlag: 0,
                    alarmFlag: 0,
                    superviseFlag: 0
                },
                recordRules: {
                    modelId: [
                        {required: true, message: this.$t("table.pleaseInput") + '业务ID'}
                    ],
                    title: [
                        {required: true, message: this.$t("table.pleaseInput") + '标题'}
                    ],
                    purId: [
                        {required: true, message: this.$t("table.pleaseInput") + '诉求目的'}
                    ],
                    userName: [
                        {required: true, message: this.$t("table.pleaseInput") + '来信人姓名'}
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
                pickerOptionsTime: {
                    disabledDate(time) {
                        return time.getTime() < Date.now();
                    },
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
                    proTime: [
                        {required: true, message: this.$t("table.pleaseSelect") + "回复时间"},
                        {validator: validateReplyTime, trigger: 'change'}
                    ],
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
                        {required: true, message: this.$t("table.pleaseSelect") + "回复时间"},
                        {validator: validateReplyTime, trigger: 'change'}
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
                        {required: true, message: this.$t("table.pleaseSelect") + "回复时间"},
                        {validator: validateReplyTime, trigger: 'change'}
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
                appealDelay: 0,
                proCessListQuery: {
                    sqId: undefined,
                    proType: undefined
                },
                deptTransfer: false,
                competentDepartment: false,

                //信件判重
                repeatDdialog: false,
                repeatListLoading: false,
                repeatAppealList: undefined,
                repeatSelectedRows: [],
                repeatListQuery: {
                    id: undefined,
                    title: undefined,
                    userName: undefined
                },
                repeatType: 'titleAndUserName',
                repeatTypeList: [{
                    value: 'titleAndUserName',
                    label: '标题和来信人'
                },{
                    value: 'title',
                    label: '标题'
                },{
                    value: 'userName',
                    label: '来信人'
                }],
                //延期审核
                delayDdialog: false,

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
                    release: this.permission.record_release,
                    handle: this.permission.record_handle
                };
            }
        },
        created(){
            this.$store.state.common.selectSiteDisplay = false;
            this.reloadTreeData();
            this.reloadList();
            this.getModelList();
            this.getPurposeList();
        },
        methods: {
            handleNodeClick(data) {
                if (data.children && data.children.length > 0) {
                    return;
                }
                this.listQuery.isPublish = data.isPublish;
                this.listQuery.sqFlag = data.sqFlag;
                this.listQuery.sqStatus = data.sqStatus;
                this.listQuery.isBack = data.isBack;
                this.listQuery.timeFlag = data.timeFlag;
                this.listQuery.alarmFlag = data.alarmFlag;
                this.listQuery.limitFlag = data.limitFlag;
                this.listQuery.superviseFlag = data.superviseFlag;
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
                this.deptTransfer = false;
                this.competentDepartment = false;
                getModel(id).then(response => {
                    if(response.data.competentDept.indexOf(this.$store.state.user.userInfo.departmentId)>=0){
                        this.competentDepartment = true;
                    }
                    if(response.data.deptTransfer == 1){
                        this.deptTransfer = true;
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
            reloadTreeData(){
                reloadTreeData({userDepartmentId:this.listQuery.userDepartmentId}).then(response => {
                    this.treeData = response.data;
                })
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
                this.$refs['content'].setUeContent(this.record.content);
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
                    isOpen: 1,
                    content: undefined,
                    replyContent: undefined,
                    replyTime: undefined,
                    replyDeptId: undefined,
                    createTime: undefined,
                    treePosition: undefined,
                    replyTreePosition: undefined,
                    isPublish: 0,
                    sqFlag: 0,
                    sqStatus: 0,
                    isBack: 0,
                    limitFlag: 0,
                    alarmFlag: 0
                };
            },
            resetRecordDialogAndList(){
                this.closeRecordDialog();
                this.submitLoading = false;
                this.reloadTreeData();
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
                this.process.proType = undefined;
                if(proType == 1){
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
                    this.$refs['proContent'].setUeContent("");
                }
                if(proType == 2){
                    this.processTitle = '回复信件';
                    this.proTimeLabel = '回复时间';
                    this.proContentLabel = '回复内容';
                    this.proTimeDisabled = false;
                    this.toDeptIdDisabled = true;
                    this.isOpenDisabled = true;
                    this.isPublishDisabled = true;
                    this.proContentDisabled = false;
                    this.titleDisabled = true;
                    this.contentDisabled = true;
                    this.reasonsTimeDisabled = true;
                    this.reasonsStatusDisabled = true;
                    this.processRulesType = this.processRules_5;
                    this.process.isOpen = this.record.isOpen;
                    this.process.isPublish = this.record.isPublish;
                    this.process.content = this.record.content;
                    this.process.proContent = this.record.replyContent;
                    this.process.proTime = this.record.replyTime;
                    if (this.process.proContent) {
                        this.$refs['proContent'].setUeContent(this.process.proContent);
                    } else {
                        this.$refs['proContent'].setUeContent('');
                    }
                }
                if(proType == 3){
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
                    if (this.process.content) {
                        this.$refs['processContent'].setUeContent(this.process.content);
                    } else {
                        this.$refs['processContent'].setUeContent('');
                    }
                    if (this.process.proContent) {
                        this.$refs['proContent'].setUeContent(this.process.proContent);
                    } else {
                        this.$refs['proContent'].setUeContent('');
                    }
                }
                if(proType == 4){
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
                    this.$refs['proContent'].setUeContent("");
                }
                if(proType == 6){
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
                    this.$refs['proContent'].setUeContent("");
                }
                if(proType == 7){
                    this.processTitle = '信件延期';
                    this.proTimeLabel = '延期至';
                    this.proContentLabel = '延期原因';
                    this.proTimeDisabled = false;
                    this.toDeptIdDisabled = true;
                    this.isOpenDisabled = true;
                    this.isPublishDisabled = true;
                    this.proContentDisabled = false;
                    this.titleDisabled = true;
                    this.contentDisabled = true;
                    this.reasonsTimeDisabled = false;
                    this.reasonsStatusDisabled = true;
                    this.processRulesType = this.processRules_3;
                    this.$refs['proContent'].setUeContent("");
                }
                if(proType == 8){
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
                    this.$refs['proContent'].setUeContent("");
                }
                this.process.proType = proType;
                this.process.sqId = this.record.id;
                this.$nextTick(() => {
                    this.$refs['processDialogForm'].clearValidate();
                })
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
                        var msg = '成功';
                        if (this.process.proType == 1) {
                            msg = "转办" + msg;
                        } else if (this.process.proType == 2) {
                            msg = "回复" + msg;
                        } else if (this.process.proType == 3) {
                            msg = "发布" + msg;
                        } else if (this.process.proType == 4) {
                            msg = "退回" + msg;
                        } else if (this.process.proType == 5) {
                            msg = "判重" + msg;
                        } else if (this.process.proType == 6) {
                            msg = "置为无效" + msg;
                        } else if (this.process.proType == 7) {
                            msg = "延期" + msg;
                        } else if (this.process.proType == 8) {
                            msg = "不予受理" + msg;
                        }
                        createOrUpdateProcess(this.process).then(() => {
                            this.resetProcessDialogAndList();
                            this.$message.success(msg);
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
                this.resetProcess();
                if (row.id) {
                    this.record = deepClone(row);
                } else {
                    this.record = deepClone(this.selectedRows[0]);
                }
                this.getModelById(this.record.modelId);
                this.dialogProcessVisible = true;
                if(this.record.sqStatus == 3){
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
            btnSupervise(){
                this.$confirm('请确认是否督办此件！', this.$t("table.tip"), {type: 'warning'}).then(() => {
                    this.process.proType = 9;
                    this.process.sqId = this.record.id;
                    createOrUpdateProcess(this.process).then(() => {
                        this.resetProcessDialogAndList();
                        this.$message.success("督办成功！");
                    })
                })
            },

            //以下信件判重
            btnRepeat(){
                this.repeatDdialog = true;
                this.repeatChange(this.repeatType);
            },
            handleRepeatSelectionChange(rows){
                this.repeatSelectedRows = rows;
            },
            reloadRepeatAppealList(){
                this.repeatListLoading = true;
                listRepeatByRecord(this.repeatListQuery).then(response => {
                    this.repeatListLoading = false;
                    this.repeatAppealList = response.data;
                })
            },
            repeatChange(e){
                this.resetRepeatListQuery();
                this.repeatListQuery.id = this.record.id;
                if(e === 'title'){
                    this.repeatListQuery.title = this.record.title;
                }
                if(e === 'userName'){
                    this.repeatListQuery.userName = this.record.userName;
                }
                if(e === 'titleAndUserName'){
                    this.repeatListQuery.title = this.record.title;
                    this.repeatListQuery.userName = this.record.userName;
                }
                this.reloadRepeatAppealList();
            },
            resetRepeatListQuery(){
                this.repeatListQuery = {
                    id: undefined,
                    title: undefined,
                    userName: undefined
                };
            },
            closeRepeatDialog() {
                this.repeatDdialog = false;
                this.repeatAppealList = undefined;
                this.repeatType = 'titleAndUserName';
                this.resetRepeatListQuery();
            },
            btnSetRepeat(){
                let ids = [];
                this.$confirm('请确认将选中的信件置为重复件！', this.$t("table.tip"), {type: 'warning'}).then(() => {
                    for(const deleteRow of this.repeatSelectedRows){
                        ids.push(deleteRow.id);
                    }
                    this.repeatListLoading = true;
                    setRepeatProcess(ids).then(() => {
                        this.reloadRepeatAppealList();
                        this.$message.success('置为重复件成功！');
                    })
                })
            },

            //延期审核
            btnDelay(){
                this.delayDdialog = true;
            },
            closeDelayDialog(){
                this.delayDdialog = false;
            },
            btnSetDelay(type){
                this.process.proType = type;
                this.process.sqId = this.record.id;
                createOrUpdateProcess(this.process).then(() => {
                    this.resetProcessDialogAndList();
                    this.$message.success('审核成功！');
                    this.closeDelayDialog();
                })
            }
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
