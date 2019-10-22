<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" placeholder="申请编码" v-model.trim="listQuery.ysqCode"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-select :size="searchSize" v-model.trim="listQuery.modelId" clearable placeholder="业务模型" style="width:120px;">
                            <el-option v-for="item in modelList" :label="item.modelName" :value="item.id"></el-option>
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
                <el-tab-pane label="已回复" name="third"></el-tab-pane>
                <el-tab-pane label="已发布" name="fourth"></el-tab-pane>
                <el-tab-pane label="未发布" name="fifth"></el-tab-pane>
                <el-tab-pane label="无效件" name="sixth"></el-tab-pane>
            </el-tabs>
            <el-table :data="applyOpenRecordList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange" style="border-top:none;">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="申请编码" prop="ysqCode" width="200"/>
                <el-table-column align="center" label="申请人类型" prop="ysqType">
                    <template slot-scope="scope">
                        <span v-if="scope.row.enable==1">
                            公民
                        </span>
                        <span v-if="scope.row.enable==2">
                            法人或者其他组织
                        </span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="申请人" prop="name"/>
                <el-table-column align="center" label="申请部门" prop="doDeptName" width="200"/>
                <el-table-column align="center" label="提交时间" prop="createTime" width="200"/>
                <el-table-column align="center" label="是否发布" prop="isPublish" width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isPublish==1">
                            是
                        </span>
                        <span v-if="scope.row.isPublish==2">
                            否
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                            {{scope.row.enable | enums('EnableEnum')}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="150">
                    <template slot-scope="scope">
                        <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                                   @click.stop.safe="btnUpdate(scope.row)"></el-button>
                        <el-button title="办理" type="success" icon="el-icon-edit-outline" :size="btnSize" circle
                                   @click.stop.safe="processApplyOpen(scope.row)"></el-button>
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
                                <el-select v-model.trim="applyOpenRecord.modelId" clearable placeholder="业务模型" style="width: 100%;">
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
                                <el-input v-model.trim="applyOpenRecord.tel"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="联系传真" prop="fax">
                                <el-input v-model.trim="applyOpenRecord.fax"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="手机号码" prop="phone">
                                <el-input v-model.trim="applyOpenRecord.phone"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="电子邮箱" prop="email">
                                <el-input v-model.trim="applyOpenRecord.email"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="通讯地址" prop="address">
                                <el-input v-model.trim="applyOpenRecord.address"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="邮政编码" prop="postcode">
                                <el-input v-model.trim="applyOpenRecord.postcode"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="申请部门" prop="doDept">
                                <el-cascader style="width: 100%" :options="departmentCascader" v-model.trim="applyOpenRecord.doDept"
                                             expand-trigger="hover" clearable @change="appealOpenDepartmentChange" ></el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="申请时间" prop="createTime">
                                <el-date-picker
                                    style="width:100%;"
                                    v-model.trim="applyOpenRecord.createTime"
                                    type="datetime"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="选择来信时间">
                                </el-date-picker>
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
                        <el-col :span="8">
                            <el-form-item label="是否申请减免费用" prop="isDerate">
                                <el-switch
                                    v-model.trim="applyOpenRecord.isDerate"
                                    :active-value=1 :inactive-value=2>
                                </el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="是否接受其他方式" prop="isOther">
                                <el-switch
                                    v-model.trim="applyOpenRecord.isOther"
                                    :active-value=1 :inactive-value=2>
                                </el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="是否发布" prop="isPublish">
                                <el-switch
                                    v-model.trim="applyOpenRecord.isPublish"
                                    :active-value=1 :inactive-value=2>
                                </el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="申请状态" prop="flag">
                                <el-radio-group v-model="applyOpenRecord.flag">
                                    <el-radio :label="1">未处理</el-radio>
                                    <el-radio :label="2">已受理</el-radio>
                                    <el-radio :label="3">已回复</el-radio>
                                    <el-radio :label="4">无效</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="回复部门" prop="doDept">
                                <el-cascader style="width: 100%" :options="departmentCascader" v-model.trim="applyOpenRecord.replyDeptId"
                                             expand-trigger="hover" clearable @change="appealOpenReplyDepartmentChange" ></el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="回复时间" prop="replyTime">
                                <el-date-picker
                                    style="width:100%;"
                                    v-model.trim="applyOpenRecord.replyTime"
                                    type="datetime"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="选择来信时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="回复内容" prop="replyContent">
                                <editor v-model.trim="applyOpenRecord.replyContent" :config="editorConfig" :default-msg="applyOpenRecord.replyContent" ref="replyContent" id="replyContent_index"></editor>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model.trim="applyOpenRecord.remark" :rows="3"/>
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
                                <th>接收其他方式:</th>
                                <td>
                                    <span v-if="applyOpenRecord.getMethod == 1">是</span>
                                    <span v-if="applyOpenRecord.getMethod == 2">否</span>
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
                    <el-collapse-item :title="processTitle" name="3" :hidden="processDisabled">
                        <el-form ref="processDialogForm" class="deyatech-form" :model="applyOpenRecord" label-position="right"
                                 label-width="100px" :rules="processRulesType">
                            <el-row :gutter="20" :span="24">
                                <el-col :span="12">
                                    <el-form-item label="回复时间" prop="replyTime" :hidden="replyTimeDisabled">
                                        <el-date-picker
                                            style="width:100%;"
                                            v-model.trim="applyOpenRecord.replyTime"
                                            type="datetime"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            placeholder="选择时间">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="是否发布" prop="isPublish" :hidden="isPublishDisabled">
                                        <el-switch
                                            v-model.trim="applyOpenRecord.isPublish"
                                            :active-value=1 :inactive-value=2>
                                        </el-switch>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20" :span="24">
                                <el-col :span="24">
                                    <el-form-item :label="replyContentLabel" prop="replyContent">
                                        <editor v-model.trim="applyOpenRecord.replyContent" :config="editorConfig" :default-msg="applyOpenRecord.replyContent" ref="replyContent" id="replyContents_index"></editor>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-collapse-item>
                </el-collapse>
                <span v-if="processType != undefined" slot="footer" class="dialog-footer">
                    <el-button type="primary" :size="btnSize" @click="doCreateProcess">确定</el-button>
                    <el-button :size="btnSize" @click="closeProcessDialog">取消</el-button>
                </span>
                <span v-else slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="btnProcess(1)" :size="btnSize">受理</el-button>
                    <el-button type="primary" @click="btnProcess(2)" :size="btnSize">回复申请</el-button>
                    <el-button type="primary" @click="btnProcess(3)" :size="btnSize">置为无效</el-button>
                    <el-button type="primary" :size="btnSize">打印</el-button>
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
        getApplyOpenRecordList,
        createOrUpdateApplyOpenRecord,
        delApplyOpenRecords
    } from '@/api/assembly/applyOpenRecord';
    import {getDepartmentCascader} from '@/api/admin/department';
    import {getAllApplyOpenModelList} from '@/api/assembly/applyOpenModel';

    export default {
        name: 'applyOpenRecord',
        components: {
            editor
        },
        data() {
            return {
                applyOpenRecordList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    ysqCode: undefined,
                    timeFrame: undefined,
                    modelId: undefined,
                    isPublish: 0,
                    flag: 1
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
                    isDerate: 2,
                    getMethod: 1,
                    isOther: 1,
                    isPublish: undefined,
                    flag: 1,
                    doDept: undefined,
                    createTime: undefined,
                    replyContent: undefined,
                    replyTime: undefined,
                    replyDeptId: undefined
                },
                applyOpenRecordRules:{
                    modelId: [
                        {required: true, message: this.$t("table.pleaseSelect") + '业务模型'}
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
                activeTabName: 'first',
                activeName: '1',
                dialogProcessVisible: false,
                processDisabled: true,
                processTitle: '办理',
                processType: undefined,
                isPublishDisabled: true,
                replyTimeDisabled: true,
                replyContentLabel: undefined,
                processRulesType: undefined,
                processRules_1: {
                    replyContent: [
                        {required: true, message: this.$t("table.pleaseInput") + '处理意见'}
                    ]
                },
                processRules_2: {
                    replyTime: [
                        {required: true, message: this.$t("table.pleaseSelect") + '回复时间'}
                    ],
                    replyContent: [
                        {required: true, message: this.$t("table.pleaseInput") + '处理意见'}
                    ]
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
                    create: this.permission.applyopen_create,
                    update: this.permission.applyopen_update,
                    delete: this.permission.applyopen_delete
                };
            }
        },
        created(){
            this.$store.state.common.selectSiteDisplay = false;
            this.reloadList();
            this.getModelList();
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
                    this.listQuery.isPublish = 1;
                    this.listQuery.flag = 0;
                }
                if(tab.name == 'fifth'){
                    this.listQuery.isPublish = 2;
                    this.listQuery.flag = 0;
                }
                if(tab.name == 'sixth'){
                    this.listQuery.isPublish = 0;
                    this.listQuery.flag = 4;
                }
                this.reloadList();
            },
            getModelList(){
                this.modelList = [];
                getAllApplyOpenModelList().then(response => {
                    this.modelList = response.data;
                })
            },
            getDepartmentCascader() {
                this.departmentCascader = [];
                getDepartmentCascader().then(response => {
                    this.departmentCascader = response.data;
                })
            },
            appealOpenDepartmentChange(v) {
                if (v && v.length > 0) {
                    this.applyOpenRecord.doDept = v[v.length-1];
                } else {
                    this.applyOpenRecord.doDept = undefined;
                }
            },
            appealOpenReplyDepartmentChange(v) {
                if (v && v.length > 0) {
                    this.applyOpenRecord.replyDeptId = v[v.length-1];
                } else {
                    this.applyOpenRecord.replyDeptId = undefined;
                }
            },
            resetSearch(){
                this.listQuery.ysqCode = undefined;
                this.listQuery.timeFrame = undefined;
                this.listQuery.modelId = undefined;
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
                getApplyOpenRecordList(this.listQuery).then(response => {
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
                this.applyOpenRecord.replyContent = this.$refs['replyContent'].getUeContent();
                this.$refs['applyOpenRecordDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateApplyOpenRecord(this.applyOpenRecord).then(() => {
                            this.resetApplyOpenRecordDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.applyOpenRecord.content = this.$refs['content'].getUeContent();
                this.applyOpenRecord.description = this.$refs['description'].getUeContent();
                this.applyOpenRecord.replyContent = this.$refs['replyContent'].getUeContent();
                this.$refs['applyOpenRecordDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateApplyOpenRecord(this.applyOpenRecord).then(() => {
                            this.resetApplyOpenRecordDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delApplyOpenRecords(ids).then(() => {
                    this.reloadList();
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
                    isDerate: 2,
                    getMethod: 1,
                    isOther: 1,
                    isPublish: undefined,
                    flag: 1,
                    createTime: undefined,
                    doDept: undefined,
                    replyContent: undefined,
                    replyTime: undefined,
                    replyDeptId: undefined
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
            btnProcess(proType) {
                this.processDisabled = false;
                this.activeName = '3';
                this.processType = proType;
                if(proType==1){
                    this.processTitle = '受理';
                    this.replyContentLabel = '受理意见';
                    this.isPublishDisabled = true;
                    this.replyTimeDisabled = true;
                    this.processRulesType = this.processRules_1;
                    this.applyOpenRecord.flag = 2;
                }
                if(proType==2){
                    this.processTitle = '回复';
                    this.replyContentLabel = '回复内容';
                    this.isPublishDisabled = false;
                    this.replyTimeDisabled = false;
                    this.processRulesType = this.processRules_2;
                    this.applyOpenRecord.flag = 3;
                }
                if(proType==3){
                    this.processTitle = '置为无效';
                    this.replyContentLabel = '处理意见';
                    this.isPublishDisabled = true;
                    this.replyTimeDisabled = true;
                    this.processRulesType = this.processRules_1;
                    this.applyOpenRecord.flag = 4;
                }
            },
            doCreateProcess(){
                this.applyOpenRecord.replyContent = this.$refs['replyContent'].getUeContent();
                this.$refs['processDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateApplyOpenRecord(this.applyOpenRecord).then(() => {
                            this.resetApplyOpenProcessDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            processApplyOpen(row){
                this.resetApplyOpenRecord();
                if (row.id) {
                    this.applyOpenRecord = deepClone(row);
                } else {
                    this.applyOpenRecord = deepClone(this.selectedRows[0]);
                }
                this.dialogProcessVisible = true;
                this.processDisabled = true;
                this.activeName = '1';
                this.processType = undefined;
            },
            closeProcessDialog() {
                this.resetApplyOpenRecord();
                this.dialogProcessVisible = false;
            },
            resetApplyOpenProcessDialogAndList(){
                this.closeApplyOpenProcessDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeApplyOpenProcessDialog() {
                this.dialogProcessVisible = false;
                this.resetApplyOpenRecord();
                this.$refs['processDialogForm'].resetFields();
            }
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

