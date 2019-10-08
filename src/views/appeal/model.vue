<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.searchName')" v-model.trim="listQuery.name"></el-input>
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
            <el-table :data="modelList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="left" label="业务名称" prop="modelName"/>
                <el-table-column align="center" label="办理时限" prop="limitDay" width="90"/>
                <el-table-column align="center" label="自动发布" prop="autoPublish" width="90">
                    <template slot-scope="scope">
                        <span v-if="scope.row.autoPublish == 1">
                            是
                        </span>
                        <span v-if="scope.row.autoPublish == 2">
                            否
                        </span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="业务模式" prop="busType" width="90">
                    <template slot-scope="scope">
                        <span v-if="scope.row.busType == 1">
                            转发
                        </span>
                        <span v-if="scope.row.busType == 2">
                            部门直投
                        </span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="部门间转办" prop="deptTransfer" width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.deptTransfer == 1">
                            是
                        </span>
                        <span v-if="scope.row.deptTransfer == 2">
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
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="100">
                    <template slot-scope="scope">
                        <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                                   @click.stop.safe="btnUpdate(scope.row)"></el-button>
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
                       :close-on-click-modal="closeOnClickModal" @close="closeModelDialog" width="80%">
                <el-form ref="modelDialogForm" class="deyatech-form" :model="model" label-position="right"
                         label-width="100px" :rules="modelRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="业务名称" prop="modelName">
                                <el-input v-model.trim="model.modelName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="6">
                            <el-form-item label="参与人员" prop="participant">
                                <el-radio-group v-model.trim="model.participant">
                                    <el-radio :label="1">会员</el-radio>
                                    <el-radio :label="2">所有人</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="自动发布" prop="autoPublish">
                                <el-switch
                                    v-model.trim="model.autoPublish"
                                    active-text="是"
                                    inactive-text="否"
                                    :active-value=1 :inactive-value=2>
                                </el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="业务模式" prop="busType">
                                <el-radio-group v-model.trim="model.busType">
                                    <el-radio :label="1">转发</el-radio>
                                    <el-radio :label="2">直投</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="部门间转办" prop="deptTransfer">
                                <el-switch
                                    v-model.trim="model.deptTransfer"
                                    active-text="是"
                                    inactive-text="否"
                                    :active-value=1 :inactive-value=2>
                                </el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="6">
                            <el-form-item label="办理时限" prop="limitDay">
                                <el-input v-model.trim="model.limitDay"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="提醒件" prop="reminderDay">
                                <el-input v-model.trim="model.reminderDay"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="黄牌件" prop="yellowDay">
                                <el-input v-model.trim="model.yellowDay"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="红牌件" prop="redDay">
                                <el-input v-model.trim="model.redDay"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="主管部门" prop="competentDept">
                                <el-cascader style="width: 100%" :options="departmentCascader" v-model.trim="model.competentDept"
                                             expand-trigger="hover" ></el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="参与部门" prop="partDept">
                                <el-cascader
                                    style="width: 100%"
                                    placeholder="请选择绑定栏目"
                                    :options="departmentCascader"
                                    v-model.trim="model.partDept"
                                    :props="props"
                                    collapse-tags
                                    clearable></el-cascader>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="6">
                            <el-form-item label="业务码" prop="busCode">
                                <el-input v-model.trim="model.busCode"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="间隔符" prop="spacera">
                                <el-input v-model.trim="model.spacera"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="日期码" prop="dayCode">
                                <el-select style="width: 100%;" v-model.trim="model.dayCode" placeholder="请选择">
                                    <el-option
                                        v-for="item in dayCodeOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="间隔符" prop="spacerb">
                                <el-input v-model.trim="model.spacerb"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="随机码位数" prop="randomcodeCount">
                                <el-select style="width: 100%;" v-model.trim="model.randomcodeCount" placeholder="请选择">
                                    <el-option
                                        v-for="item in codeLengthOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="查询码位数" prop="querycodeCount">
                                <el-select style="width: 100%;" v-model.trim="model.querycodeCount" placeholder="请选择">
                                    <el-option
                                        v-for="item in codeLengthOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="表单模板" prop="formTemplet">
                                <el-cascader
                                    style="width: 100%"
                                    placeholder="请选择模板地址"
                                    clearable
                                    expand-trigger="hover"
                                    :options="templateTreeData"
                                    v-model.trim="model.formTemplet"
                                    :props="cascaderProps">
                                </el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="列表模板" prop="listTemplet">
                                <el-cascader
                                    style="width: 100%"
                                    placeholder="请选择模板地址"
                                    clearable
                                    expand-trigger="hover"
                                    :options="templateTreeData"
                                    v-model.trim="model.listTemplet"
                                    :props="cascaderProps">
                                </el-cascader>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="正文模板" prop="viewTemplet">
                                <el-cascader
                                    style="width: 100%"
                                    placeholder="请选择模板地址"
                                    clearable
                                    expand-trigger="hover"
                                    :options="templateTreeData"
                                    v-model.trim="model.viewTemplet"
                                    :props="cascaderProps">
                                </el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="打印模板" prop="printTemplet">
                                <el-cascader
                                    style="width: 100%"
                                    placeholder="请选择模板地址"
                                    clearable
                                    expand-trigger="hover"
                                    :options="templateTreeData"
                                    v-model.trim="model.printTemplet"
                                    :props="cascaderProps">
                                </el-cascader>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="启用工作流" prop="workflowType">
                                <el-switch
                                    v-model.trim="model.workflowType"
                                    active-text="是"
                                    inactive-text="否"
                                    :active-value=1 :inactive-value=2 @change="isWorkflowEnable">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="选择工作流" prop="workflowId" v-if="model.workflowType == 1">
                                <el-select v-model.trim="model.workflowId" placeholder="请选择工作流" style="width:100%">
                                    <el-option v-for="item in workflowList" :label="item.name" :value="item.actDefinitionKey"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model.trim="model.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeModelDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getModelList,
        createOrUpdateModel,
        delModels
    } from '@/api/appeal/model';
    import {getDepartmentCascader} from '@/api/admin/department';
    import {listTemplateAllFiles} from '@/api/template/template';
    import {getProcessDefinitionList} from '@/api/workflow/definition';

    export default {
        name: 'model',
        data() {
            return {
                modelList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined
                },
                model: {
                    id: undefined,
                    modelName: undefined,
                    participant: 2,
                    autoPublish: 2,
                    limitDay: 15,
                    reminderDay: -5,
                    yellowDay: -2,
                    redDay: 2,
                    busType: 1,
                    deptTransfer: 2,
                    competentDept: undefined,
                    partDept: undefined,
                    busCode: 'GPPS',
                    spacera: '-',
                    dayCode: 'YYYYMMDD',
                    spacerb: '-',
                    randomcodeCount: '4',
                    querycodeCount: '6',
                    workflowType: 2,
                    workflowId: undefined,
                    formTemplet: undefined,
                    listTemplet: undefined,
                    viewTemplet: undefined,
                    printTemplet: undefined
                },
                modelRules: {
                    modelName: [
                        {required: true, message: this.$t("table.pleaseInput") + '业务名称'}
                    ],
                    limitDay: [
                        {required: true, message: this.$t("table.pleaseInput") + '办理时限'}
                    ],
                    reminderDay: [
                        {required: true, message: this.$t("table.pleaseInput") + '提醒件'}
                    ],
                    yellowDay: [
                        {required: true, message: this.$t("table.pleaseInput") + '黄牌件'}
                    ],
                    redDay: [
                        {required: true, message: this.$t("table.pleaseInput") + '红牌件'}
                    ],
                    competentDept: [
                        {required: true, message: this.$t("table.pleaseInput") + '主管部门引用部门ID'}
                    ],
                    partDept: [
                        {required: true, message: this.$t("table.pleaseInput") + '参与部门部门ID数组'}
                    ],
                    busCode: [
                        {required: true, message: this.$t("table.pleaseInput") + '业务码'}
                    ],
                    randomcodeCount: [
                        {required: true, message: this.$t("table.pleaseInput") + '随机码位数'}
                    ],
                    querycodeCount: [
                        {required: true, message: this.$t("table.pleaseInput") + '查询码位数'}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                departmentCascader: [],
                props: { multiple: true},
                dayCodeOptions: [{
                    value: 'YYMM',
                    label: 'YYMM'
                }, {
                    value: 'YYYYMM',
                    label: 'YYYYMM'
                }, {
                    value: 'YYYYMMDD',
                    label: 'YYYYMMDD'
                }],
                codeLengthOptions: [{
                    value: 4,
                    label: '4位'
                },{
                    value: 5,
                    label: '5位'
                },{
                    value: 6,
                    label: '6位'
                },{
                    value: 7,
                    label: '7位'
                },{
                    value: 8,
                    label: '8位'
                }],
                cascaderProps: {
                    value: 'fileName',
                    label: 'fileName',
                    children: 'children'
                },
                templateTreeData: [],
                workflowList: []
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
                    create: this.permission.model_create,
                    update: this.permission.model_update,
                    delete: this.permission.model_delete
                };
            }
        },
        created(){
            this.$store.state.common.selectSiteDisplay = true;
            if(this.$store.state.common.siteId != undefined){
                this.reloadList();
                this.getDepartmentCascader();
                this.listTemplateAllFiles();
            }else{
                this.$message.error('请选择站点！');
            }
        },
        methods: {
            isWorkflowEnable (value) {
                if (value == 1) {
                    if (this.workflowList.length == 0) {
                        this.getWorkflowList();
                    }
                } else {
                    if (this.model.workflowId) {
                        this.model.workflowId = undefined;
                    }
                    this.workflowList = [];
                }
            },
            // 获取工作流
            getWorkflowList() {
                this.workflowList = []
                const query = {
                    page: 1,
                    size: 99999999
                }
                getProcessDefinitionList(query).then(response => {
                    if (response.status == 200) {
                        this.workflowList = response.data.records;
                    } else {
                        this.$message.error('工作流数据获取失败')
                    }
                })
            },
            listTemplateAllFiles(){
                this.templateTreeData = [];
                listTemplateAllFiles(this.$store.state.common.siteId).then(response => {
                    let result = JSON.parse(response.data)
                    this.templateTreeData = result.files
                })
            },
            getDepartmentCascader() {
                this.submitLoading = true;
                getDepartmentCascader().then(response => {
                    this.submitLoading = false;
                    this.departmentCascader = response.data;
                })
            },
            resetSearch(){
                this.listQuery.name = undefined;
            },
            reloadList(){
                this.listLoading = true;
                this.modelList = undefined;
                this.total = undefined;
                getModelList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.modelList = response.data.records;
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
                this.resetModel();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetModel();
                if (row.id) {
                    this.model = deepClone(row);
                } else {
                    this.model = deepClone(this.selectedRows[0]);
                }
                this.dialogTitle = 'update';
                this.dialogVisible = true;
                this.model.competentDept = this.model.competentDept.split(",");
                let ids = [];
                for(const id of this.model.partDept.split("&")){
                    ids.push(id.split(","));
                }
                this.model.partDept = ids;
                if(this.model.formTemplet != undefined){
                    this.model.formTemplet = this.model.formTemplet.split('/').slice(1);
                }
                if(this.model.listTemplet != undefined){
                    this.model.listTemplet = this.model.listTemplet.split('/').slice(1);
                }
                if(this.model.viewTemplet != undefined){
                    this.model.viewTemplet = this.model.viewTemplet.split('/').slice(1);
                }
                if(this.model.printTemplet != undefined){
                    this.model.printTemplet = this.model.printTemplet.split('/').slice(1);
                }
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
                this.$refs['modelDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        this.model.competentDept = this.model.competentDept.join(",");
                        let ids = [];
                        for(const id of this.model.partDept){
                            ids.push(id.join(","));
                        }
                        this.model.partDept = ids.join("&");
                        if(this.model.formTemplet != undefined){
                            this.model.formTemplet = "/" + this.model.formTemplet.join("/");
                        }
                        if(this.model.listTemplet != undefined){
                            this.model.listTemplet = "/" + this.model.listTemplet.join("/");
                        }
                        if(this.model.viewTemplet != undefined){
                            this.model.viewTemplet = "/" + this.model.viewTemplet.join("/");
                        }
                        if(this.model.printTemplet != undefined){
                            this.model.printTemplet = "/" + this.model.printTemplet.join("/");
                        }
                        createOrUpdateModel(this.model).then(() => {
                            this.resetModelDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['modelDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        this.model.competentDept = this.model.competentDept.join(",");
                        let ids = [];
                        for(const id of this.model.partDept){
                            ids.push(id.join(","));
                        }
                        this.model.partDept = ids.join("&");
                        if(this.model.formTemplet != undefined){
                            this.model.formTemplet = "/" + this.model.formTemplet.join("/");
                        }
                        if(this.model.listTemplet != undefined){
                            this.model.listTemplet = "/" + this.model.listTemplet.join("/");
                        }
                        if(this.model.viewTemplet != undefined){
                            this.model.viewTemplet = "/" + this.model.viewTemplet.join("/");
                        }
                        if(this.model.printTemplet != undefined){
                            this.model.printTemplet = "/" + this.model.printTemplet.join("/");
                        }
                        createOrUpdateModel(this.model).then(() => {
                            this.resetModelDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delModels(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetModel(){
                this.model = {
                    id: undefined,
                    modelName: undefined,
                    participant: 2,
                    autoPublish: 2,
                    limitDay: 15,
                    reminderDay: -5,
                    yellowDay: -2,
                    redDay: 2,
                    busType: 1,
                    deptTransfer: 2,
                    competentDept: undefined,
                    partDept: undefined,
                    busCode: 'GPPS',
                    spacera: '-',
                    dayCode: 'YYYYMMDD',
                    spacerb: '-',
                    randomcodeCount: '4',
                    querycodeCount: '6',
                    workflowType: 2,
                    workflowId: undefined,
                    formTemplet: undefined,
                    listTemplet: undefined,
                    viewTemplet: undefined,
                    printTemplet: undefined
                }
            },
            resetModelDialogAndList(){
                this.closeModelDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeModelDialog() {
                this.dialogVisible = false;
                this.resetModel();
                this.$refs['modelDialogForm'].resetFields();
            }
        }
    }
</script>


