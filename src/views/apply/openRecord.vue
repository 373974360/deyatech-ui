<template>
    <basic-container>
        <el-row :span="24">
            <el-col :span="3">
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
            <el-col :span="21">
                <div class="deyatech-container pull-auto">
                    <div class="deyatech-menu">
                        <div class="deyatech-menu_left">
                            <el-button v-if="btnEnable.create" type="primary" :size="btnSize" @click="btnCreate">{{$t('table.create')}}</el-button>
                            <el-button v-if="btnEnable.update" type="primary" :size="btnSize" @click="btnUpdate" :disabled="selectedRows.length != 1">{{$t('table.update')}}</el-button>
                            <el-button v-if="btnEnable.delete" type="danger" :size="btnSize" @click="btnDelete" :disabled="selectedRows.length < 1">{{$t('table.delete')}}</el-button>

                            <el-input :size="searchSize" placeholder="申请编码" v-model.trim="listQuery.ysqCode" clearable style="width: 170px;margin-left: 10px;margin-right:10px;"></el-input>
                            <el-select filterable :size="searchSize" v-model.trim="listQuery.modelId" clearable placeholder="业务模型" style="width:120px;">
                                <el-option v-for="item in modelList" :label="item.modelName" :value="item.id"></el-option>
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
                                :picker-options="pickerOptions" style="width:250px; margin-left: 10px; margin-right: 10px;">
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
                    <el-table :data="applyOpenRecordList" v-loading.body="listLoading" stripe border highlight-current-row
                              @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="50" align="center"/>
                        <el-table-column align="center" label="申请编码" prop="ysqCode" width="200"/>
                        <el-table-column align="center" label="申请人类型" prop="ysqType" width="120">
                            <template slot-scope="scope">
                                <span v-if="scope.row.enable==1">
                                    公民
                                </span>
                                <span v-if="scope.row.enable==2">
                                    法人或者其他组织
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="申请人" prop="name" width="120"/>
                        <el-table-column align="center" label="申请部门" prop="proDeptName" width="200"/>
                        <el-table-column align="center" label="提交时间" prop="createTime" width="200"/>
                        <el-table-column align="center" label="是否发布" prop="isPublish" width="100">
                            <template slot-scope="scope">
                                {{scope.row.isPublish | enums('YesNoEnum')}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="办理状态" prop="applyStatus" >
                            <template slot-scope="scope">
                                {{scope.row.applyStatus | enums('AppealStatusEnum')}}
                            </template>
                        </el-table-column>
                       <!-- <el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                            <template slot-scope="scope">
                                <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                                    {{scope.row.enable | enums('EnableEnum')}}
                                </el-tag>
                            </template>
                        </el-table-column>-->
                        <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" fixed="right" align="center" width="150">
                            <template slot-scope="scope">
                                <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                                           @click.stop.safe="btnUpdate(scope.row)"></el-button>
                                <el-button v-if="btnEnable.handle" title="办理" type="success" icon="el-icon-edit-outline" :size="btnSize" circle
                                           @click.stop.safe="processApply(scope.row)"></el-button>
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
                               :close-on-click-modal="closeOnClickModal" @close="closeApplyOpenRecordDialog" width="60%">
                        <el-form ref="applyOpenRecordDialogForm" class="deyatech-form" :model="applyOpenRecord" label-position="right"
                                 label-width="130px" :rules="applyOpenRecordRules">
                            <el-row :gutter="20" :span="24">
                                <el-col :span="12">
                                    <el-form-item label="业务模型" prop="modelId">
                                        <el-select filterable v-model.trim="applyOpenRecord.modelId" clearable placeholder="业务模型" style="width: 100%;">
                                            <el-option v-for="item in modelList" :label="item.modelName" :value="item.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="申请人类型" prop="ysqType">
                                        <el-radio-group v-model="applyOpenRecord.ysqType">
                                            <el-radio :label="1">公民</el-radio>
                                            <el-radio :label="2">法人或其他组织</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row v-if="applyOpenRecord.ysqType == 1" :gutter="20" :span="24">
                                <el-col :span="12">
                                    <el-form-item label="姓名" prop="name">
                                        <el-input v-model.trim="applyOpenRecord.name"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="工作单位" prop="company">
                                        <el-input v-model.trim="applyOpenRecord.company"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row v-if="applyOpenRecord.ysqType == 1" :gutter="20" :span="24">
                                <el-col :span="12">
                                    <el-form-item label="证件名称" prop="cardName">
                                        <el-input v-model.trim="applyOpenRecord.cardName"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="证件号码" prop="cardCode">
                                        <el-input v-model.trim="applyOpenRecord.cardCode"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row v-if="applyOpenRecord.ysqType == 2" :gutter="20" :span="24">
                                <el-col :span="12">
                                    <el-form-item label="组织机构代码" prop="orgCode">
                                        <el-input v-model.trim="applyOpenRecord.orgCode"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="营业执照代码" prop="licence">
                                        <el-input v-model.trim="applyOpenRecord.licence"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row v-if="applyOpenRecord.ysqType == 2" :gutter="20" :span="24">
                                <el-col :span="12">
                                    <el-form-item label="法人代表" prop="legalperson">
                                        <el-input v-model.trim="applyOpenRecord.legalperson"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="联系人" prop="linkman">
                                        <el-input v-model.trim="applyOpenRecord.linkman"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20" :span="24">
                                <el-col :span="12">
                                    <el-form-item label="联系电话" prop="tel">
                                        <el-input v-model.trim="applyOpenRecord.tel" maxlength="13"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="联系传真" prop="fax">
                                        <el-input v-model.trim="applyOpenRecord.fax" maxlength="13"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20" :span="24">
                                <el-col :span="12">
                                    <el-form-item label="手机号码" prop="phone">
                                        <el-input v-model.trim="applyOpenRecord.phone" maxlength="11"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="电子邮箱" prop="email">
                                        <el-input v-model.trim="applyOpenRecord.email" maxlength="50"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20" :span="24">
                                <el-col :span="12">
                                    <el-form-item label="通讯地址" prop="address">
                                        <el-input v-model.trim="applyOpenRecord.address" maxlength="100"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="邮政编码" prop="postcode">
                                        <el-input v-model.trim="applyOpenRecord.postcode" maxlength="6"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20" :span="24">
                                <el-col :span="24">
                                    <el-form-item label="所需信息内容描述" prop="content">
                                        <editor v-model.trim="applyOpenRecord.content" :config="editorConfig" :default-msg="applyOpenRecord.content" ref="content" id="content_index"></editor>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20" :span="24">
                                <el-col :span="24">
                                    <el-form-item label="用途描述" prop="description">
                                        <editor v-model.trim="applyOpenRecord.description" :config="editorConfig" :default-msg="applyOpenRecord.description" ref="description" id="description_index"></editor>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20" :span="24">
                                <el-col :span="24">
                                    <el-form-item label="获取信息方式" prop="getMethod">
                                        <el-radio-group v-model="applyOpenRecord.getMethod">
                                            <el-radio :label="1">电子邮箱</el-radio>
                                            <el-radio :label="2">邮寄</el-radio>
                                            <el-radio :label="3">传真</el-radio>
                                            <el-radio :label="4">自行领取</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20" :span="24">
                                <el-col :span="24">
                                    <el-form-item label="获取信息方式" prop="offerType">
                                        <el-radio-group v-model="applyOpenRecord.offerType">
                                            <el-radio :label="1">电子邮箱</el-radio>
                                            <el-radio :label="2">邮寄</el-radio>
                                            <el-radio :label="3">传真</el-radio>
                                            <el-radio :label="4">自行领取</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
                            <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                            <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                            <el-button :size="btnSize" @click="closeApplyOpenRecordDialog">{{$t('table.cancel')}}</el-button>
                        </span>
                    </el-dialog>

                    <el-dialog title="依申请公开办理" :visible.sync="dialogProcessVisible"
                               :close-on-click-modal="closeOnClickModal" @close="closeProcessDialog" width="70%">
                        <el-collapse v-model.trim="activeName" accordion>
                            <el-collapse-item title="申请人信息" name="1">
                                <table class="appeal_table">
                                    <tr>
                                        <th>申请人类型:</th>
                                        <td colspan="3">
                                            <span v-if="applyOpenRecord.ysqType == 1">公民</span>
                                            <span v-if="applyOpenRecord.ysqType == 2">法人或其他组织</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>申请编码:</th>
                                        <td>{{applyOpenRecord.ysqCode}}</td>
                                        <th>查询编码:</th>
                                        <td>{{applyOpenRecord.queryCode}}</td>
                                    </tr>
                                    <tr v-if="applyOpenRecord.ysqType==1">
                                        <th>姓名:</th>
                                        <td>{{applyOpenRecord.name}}</td>
                                        <th>工作单位:</th>
                                        <td>{{applyOpenRecord.company}}</td>
                                    </tr>
                                    <tr v-if="applyOpenRecord.ysqType==1">
                                        <th>证件名称:</th>
                                        <td>{{applyOpenRecord.cardName}}</td>
                                        <th>证件号码:</th>
                                        <td>{{applyOpenRecord.cardCode}}</td>
                                    </tr>
                                    <tr v-if="applyOpenRecord.ysqType==2">
                                        <th>组织机构代码:</th>
                                        <td>{{applyOpenRecord.orgCode}}</td>
                                        <th>营业执照代码:</th>
                                        <td>{{applyOpenRecord.licence}}</td>
                                    </tr>
                                    <tr v-if="applyOpenRecord.ysqType==2">
                                        <th>法人代表:</th>
                                        <td>{{applyOpenRecord.legalperson}}</td>
                                        <th>联系人:</th>
                                        <td>{{applyOpenRecord.linkman}}</td>
                                    </tr>
                                    <tr>
                                        <th>联系电话:</th>
                                        <td>{{applyOpenRecord.tel}}</td>
                                        <th>联系传真:</th>
                                        <td>{{applyOpenRecord.fax}}</td>
                                    </tr>
                                    <tr>
                                        <th>手机号码:</th>
                                        <td>{{applyOpenRecord.phone}}</td>
                                        <th>电子邮箱:</th>
                                        <td>{{applyOpenRecord.email}}</td>
                                    </tr>
                                    <tr>
                                        <th>通讯地址:</th>
                                        <td>{{applyOpenRecord.address}}</td>
                                        <th>邮政编码:</th>
                                        <td>{{applyOpenRecord.postcode}}</td>
                                    </tr>
                                </table>
                            </el-collapse-item>
                            <el-collapse-item title="所需信息情况" name="2">
                                <table class="appeal_table">
                                    <tr>
                                        <th>所需信息描述:</th>
                                        <td colspan="3" v-html="applyOpenRecord.content"></td>
                                    </tr>
                                    <tr>
                                        <th>用途描述:</th>
                                        <td colspan="3" v-html="applyOpenRecord.description"></td>
                                    </tr>
                                    <tr>
                                        <th>申请减免费用:</th>
                                        <td>
                                            <span v-if="applyOpenRecord.isDerate == 1">是</span>
                                            <span v-if="applyOpenRecord.isDerate == 2">否</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>信息获取方式:</th>
                                        <td colspan="3">
                                            <span v-if="applyOpenRecord.isOther == 1">电子邮箱</span>
                                            <span v-if="applyOpenRecord.isOther == 2">邮寄</span>
                                            <span v-if="applyOpenRecord.isOther == 3">传真</span>
                                            <span v-if="applyOpenRecord.isOther == 4">自行领取</span>
                                        </td>
                                    </tr>
                                </table>
                            </el-collapse-item>
                            <el-collapse-item title="回复内容" name="3" :hidden="replyContentDisabled">
                                <table class="appeal_table">
                                    <tr>
                                        <th>回复时间:</th>
                                        <td>{{applyOpenRecord.replyTime}}</td>
                                    </tr>
                                    <tr>
                                        <th>回复部门:</th>
                                        <td>{{applyOpenRecord.replyDeptName}}</td>
                                    </tr>
                                    <tr>
                                        <th>回复内容:</th>
                                        <td v-html="applyOpenRecord.replyContent"></td>
                                    </tr>
                                </table>
                            </el-collapse-item>
                            <el-collapse-item :title="processTitle" name="4" :hidden="processDisabled">
                                <el-form ref="processDialogForm" class="deyatech-form" :model="applyOpenRecord" label-position="right"
                                         label-width="100px" :rules="processRulesType">

                                </el-form>
                            </el-collapse-item>
                        </el-collapse>
                        <span v-if="proType != undefined" slot="footer" class="dialog-footer">
                            <el-button type="primary" :size="btnSize" @click="doCreateProcess">确定</el-button>
                            <el-button :size="btnSize" @click="backProcessDialog">返回</el-button>
                            <el-button :size="btnSize" @click="closeProcessDialog">取消</el-button>
                        </span>
                        <span v-else slot="footer" class="dialog-footer">
                             <!--正常信件可操作-->
                            <template v-if="applyOpenRecord.applyFlag == 0">
                                <el-button type="primary" @click="btnProcess(1)" :size="btnSize">回复</el-button>
                                <el-button v-if="btnEnable.release" type="primary" @click="btnProcess(2)" :size="btnSize">发布</el-button>
                                <template v-if="competentDepartment">
                                    <!--未办结-->
                                    <template v-if="applyOpenRecord.applyStatus < 3">
                                        <!--未督办信件才可督办-->
                                        <el-button v-if="applyOpenRecord.superviseFlag == 0" type="primary" @click="updateStatus(1)" :size="btnSize">督办</el-button>
                                        <el-button type="primary" @click="updateStatus(2)" :size="btnSize">置为无效</el-button>
                                        <el-button type="primary" @click="updateStatus(3)" :size="btnSize">不予受理</el-button>
                                    </template>
                                </template>
                            </template>
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
        getOpenRecordList,
        createOrUpdateOpenRecord,
        delOpenRecords,
        getCompetentDept,
        reloadTreeData
    } from '@/api/apply/openRecord';
    import {getDepartmentCascader} from '@/api/admin/department';
    import {getOpenModelByCompetentDeptId,getOpenModel} from '@/api/apply/openModel';
    import {isvalidatemobile, validateEmail, cardid, isZipCode, isTelephone, isFax} from '@/util/validate';

    export default {
        name: 'applyOpenRecord',
        components: {
            editor
        },
        data() {
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
            const validateTelephone = (rule, value, callback) => {
                if (!value) {
                    callback()
                }
                if (isTelephone(value)) {
                    callback()
                } else {
                    callback(new Error("联系电话不正确"))
                }
            };
            const validateFax = (rule, value, callback) => {
                if (!value) {
                    callback()
                }
                if (isFax(value)) {
                    callback()
                } else {
                    callback(new Error("联系传真不正确"))
                }
            };
            const validatePostCode = (rule, value, callback) => {
                if (!value) {
                    callback()
                }
                if (isZipCode(value)) {
                    callback()
                } else {
                    callback(new Error("邮政编码不正确"))
                }
            };
            return {
                treeData:[],
                applyOpenRecordList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    userDepartmentId: this.$store.state.user.userInfo.departmentId,
                    ysqCode: undefined,
                    timeFrame: undefined,
                    modelId: undefined,
                    isPublish: undefined,
                    applyFlag: 0,
                    applyStatus: undefined,
                    alarmFlag: undefined,
                    superviseFlag: undefined
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
                applyOpenRecord: {
                    id: undefined,
                    modelId: undefined,
                    ysqCode: undefined,
                    queryCode: undefined,
                    ysqType: 1,
                    name: undefined,
                    company: undefined,
                    cardName: undefined,
                    cardCode: undefined,
                    orgCode: undefined,
                    licence: undefined,
                    legalperson: undefined,
                    linkman: undefined,
                    tel: undefined,
                    fax: undefined,
                    phone: undefined,
                    email: undefined,
                    address: undefined,
                    postcode: undefined,
                    content: undefined,
                    description: undefined,
                    getMethod: 1,
                    offerType: 1,
                    isOther: 1,
                    isPublish: 0,
                    deptId: undefined,
                    proDeptId: undefined,
                    replyContent: undefined,
                    replyTime: undefined,
                    replyDeptId: undefined,
                    timeLimit: undefined,
                    alarmFlag: 0,
                    applyStatus: 0,
                    applyFlag: 0,
                    superviseFlag: 0
                },
                applyOpenRecordRules:{
                    modelId: [
                        {required: true, message: this.$t("table.pleaseSelect") + '业务模型'}
                    ],
                    phone: [
                        {validator: validateMobile, trigger: 'change'}
                    ],
                    email: [
                        {validator: validateMail, trigger: 'change'}
                    ],
                    tel: [
                        {validator: validateTelephone, trigger: 'change'}
                    ],
                    fax: [
                        {validator: validateFax, trigger: 'change'}
                    ],
                    postcode: [
                        {validator: validatePostCode, trigger: 'change'}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                modelList: [],
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
                activeName: '1',
                processDisabled: true,
                replyContentDisabled: true,
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
                isPublishDisabled: true,
                proContentDisabled: true,
                titleDisabled: true,
                contentDisabled: true,
                reasonsTimeDisabled: true,
                reasonsStatusDisabled: true,
                processRulesType: {},
                competentDepartment: false,
                proType:undefined,
                dialogProcessVisible:false,
                processTitle: undefined
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
                    create: this.permission.applyOpen_create,
                    update: this.permission.applyOpen_update,
                    delete: this.permission.applyOpen_delete,
                    release: this.permission.applyOpen_release,
                    handle: this.permission.applyOpen_handle
                };
            }
        },
        created(){
            this.$store.state.common.selectSiteDisplay = false;
            this.reloadTreeData();
            this.reloadList();
            this.getModelList();
        },
        methods: {
            handleNodeClick(data) {
                this.listQuery.isPublish = data.isPublish;
                this.listQuery.applyFlag = data.applyFlag;
                this.listQuery.applyStatus = data.applyStatus;
                this.listQuery.alarmFlag = data.alarmFlag;
                this.listQuery.limitFlag = data.limitFlag;
                this.listQuery.superviseFlag = data.superviseFlag;
                this.reloadList();
            },
            getModelById(id){
                this.competentDepartment = false;
                getOpenModel(id).then(response => {
                    if(response.data.competentDept.indexOf(this.$store.state.user.userInfo.departmentId)>=0){
                        this.competentDepartment = true;
                    }
                })
            },
            getModelList(){
                this.modelList = [];
                getOpenModelByCompetentDeptId({departmentId: this.$store.state.user.userInfo.departmentId}).then(response => {
                    this.modelList = response.data;
                })
            },
            getDepartmentCascader(modelId) {
                this.departmentCascader = [];
                getCompetentDept({modelId:modelId}).then(response => {
                    this.departmentCascader = response.data;
                })
            },
            resetSearch(){
                this.listQuery.ysqCode = undefined;
                this.listQuery.timeFrame = undefined;
                this.listQuery.modelId = undefined;
            },
            reloadTreeData(){
                reloadTreeData({userDepartmentId:this.listQuery.userDepartmentId}).then(response => {
                    this.treeData = response.data;
                })
            },
            reloadList(){
                this.listLoading = true;
                this.applyOpenRecordList = undefined;
                this.total = undefined;
                let times = this.timeFrame;
                if(times != undefined){
                    this.listQuery.timeFrame = times[0]+","+times[1];
                }else{
                    this.listQuery.timeFrame = undefined;
                }
                getOpenRecordList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.applyOpenRecordList = response.data.records;
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
                this.resetApplyOpenRecord();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetApplyOpenRecord();
                if (row.id) {
                    this.applyOpenRecord = deepClone(row);
                } else {
                    this.applyOpenRecord = deepClone(this.selectedRows[0]);
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
                this.applyOpenRecord.content = this.$refs['content'].getUeContent();
                this.applyOpenRecord.description = this.$refs['description'].getUeContent();
                this.$refs['applyOpenRecordDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateOpenRecord(this.applyOpenRecord).then(() => {
                            this.resetApplyOpenRecordDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                            this.reloadTreeData();
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.applyOpenRecord.content = this.$refs['content'].getUeContent();
                this.applyOpenRecord.description = this.$refs['description'].getUeContent();
                this.$refs['applyOpenRecordDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateOpenRecord(this.applyOpenRecord).then(() => {
                            this.resetApplyOpenRecordDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                            this.reloadTreeData();
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delOpenRecords(ids).then(() => {
                    this.reloadList();
                    this.reloadTreeData();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetApplyOpenRecord(){
                this.applyOpenRecord = {
                    id: undefined,
                    modelId: undefined,
                    ysqCode: undefined,
                    queryCode: undefined,
                    ysqType: 1,
                    name: undefined,
                    company: undefined,
                    cardName: undefined,
                    cardCode: undefined,
                    orgCode: undefined,
                    licence: undefined,
                    legalperson: undefined,
                    linkman: undefined,
                    tel: undefined,
                    fax: undefined,
                    phone: undefined,
                    email: undefined,
                    address: undefined,
                    postcode: undefined,
                    content: undefined,
                    description: undefined,
                    isDerate: 0,
                    getMethod: 1,
                    isOther: 1,
                    isPublish: 0,
                    deptId: undefined,
                    proDeptId: undefined,
                    replyContent: undefined,
                    replyTime: undefined,
                    replyDeptId: undefined,
                    timeLimit: undefined,
                    alarmFlag: 0,
                    applyStatus: 0,
                    applyFlag: 0,
                    isBack: 0,
                    limitFlag: 0,
                    limitFlagTime: undefined
                }
            },
            resetApplyOpenRecordDialogAndList(){
                this.closeApplyOpenRecordDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeApplyOpenRecordDialog() {
                this.dialogVisible = false;
                this.resetApplyOpenRecord();
                this.$refs['applyOpenRecordDialogForm'].resetFields();
            },


            //***********************************************
            //             以下信件办理
            //***********************************************
            updateStatus(proType){
                let msg = "";
                if(proType == 1){
                    msg = "请确认是否督办此件！";
                    this.applyOpenRecord.superviseFlag = 1;
                }
                if(proType == 2){
                    msg = "请确认是否将此件置为无效件！";
                    this.applyOpenRecord.applyFlag = -1;
                }
                if(proType == 3){
                    msg = "请确认是否不予受理此件！";
                    this.applyOpenRecord.applyFlag = 2;
                }
                this.$confirm(msg, this.$t("table.tip"), {type: 'warning'}).then(() => {
                    createOrUpdateOpenRecord(this.applyOpenRecord).then(() => {
                        this.closeProcessDialog();
                        this.$message.success("操作成功！");
                        this.reloadTreeData();
                    })
                })
            },
            btnProcess(proType){
                this.$confirm('请确认是否督办此件！', this.$t("table.tip"), {type: 'warning'}).then(() => {
                    this.applyOpenRecord.superviseFlag = 1;
                    createOrUpdateOpenRecord(this.applyOpenRecord).then(() => {
                        this.closeProcessDialog();
                        this.$message.success("督办成功！");
                        this.reloadTreeData();
                    })
                })
            },
            doCreateProcess(){

            },
            processApply(row){
                this.resetApplyOpenRecord();
                if (row.id) {
                    this.applyOpenRecord = deepClone(row);
                } else {
                    this.applyOpenRecord = deepClone(this.selectedRows[0]);
                }
                this.dialogProcessVisible = true;
                if(this.applyOpenRecord.applyStatus == 3){
                    this.replyContentDisabled = false;
                }
                this.getModelById(this.applyOpenRecord.modelId);
                this.getDepartmentCascader(this.applyOpenRecord.modelId);
            },
            backProcessDialog(){
            },
            closeProcessDialog() {
                this.resetApplyOpenRecord();
                this.activeName = '1';
                this.replyContentDisabled = true;
                this.dialogProcessVisible = false;
                this.processRulesType = {};
                this.reloadList();
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

