<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.searchName')" v-model.trim="listQuery.modelName"></el-input>
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
            <el-table :data="applyOpenModelList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="业务名称" prop="modelName"/>
                <el-table-column align="center" label="参与方式" prop="mustMember">
                    <template slot-scope="scope">
                        <span v-if="scope.row.mustMember == 1">
                            不限
                        </span>
                        <span v-if="scope.row.mustMember == 2">
                            仅会员
                        </span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="自动发布" prop="isAutoPublish">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isAutoPublish == 1">
                            是
                        </span>
                        <span v-if="scope.row.isAutoPublish == 2">
                            否
                        </span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="提醒方式" prop="remindType">
                    <template slot-scope="scope">
                        <span v-if="scope.row.remindType == 1">
                            Email
                        </span>
                        <span v-if="scope.row.remindType == 2">
                            手机短信
                        </span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="办理时限" prop="timeLimit"/>
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
                       :close-on-click-modal="closeOnClickModal" @close="closeApplyOpenModelDialog" width="60%">
                <el-form ref="applyOpenModelDialogForm" class="deyatech-form" :model="applyOpenModel" label-position="right"
                         label-width="80px" :rules="applyOpenModelRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="业务名称" prop="modelName">
                                <el-input v-model.trim="applyOpenModel.modelName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="8">
                            <el-form-item label="参与方式" prop="mustMember">
                                <el-radio-group v-model="applyOpenModel.mustMember">
                                    <el-radio :label="1">不限</el-radio>
                                    <el-radio :label="2">仅会员</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="自动发布" prop="isAutoPublish">
                                <el-switch
                                    v-model.trim="applyOpenModel.isAutoPublish"
                                    active-text="是"
                                    inactive-text="否"
                                    :active-value=1 :inactive-value=2>
                                </el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="提醒方式" prop="remindType">
                                <el-radio-group v-model="applyOpenModel.remindType">
                                    <el-radio :label="1">Email</el-radio>
                                    <el-radio :label="2">手机短信</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="8">
                            <el-form-item label="业务编码" prop="codePre">
                                <el-input v-model.trim="applyOpenModel.codePre"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="日期码" prop="codeRule">
                                <el-select style="width: 100%;" v-model.trim="applyOpenModel.codeRule" placeholder="请选择">
                                    <el-option
                                        v-for="item in dayCodeOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="随机码" prop="codeNum">
                                <el-select style="width: 100%;" v-model.trim="applyOpenModel.codeNum" placeholder="请选择">
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
                            <el-form-item label="查询码" prop="queryNum">
                                <el-select style="width: 100%;" v-model.trim="applyOpenModel.queryNum" placeholder="请选择">
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
                            <el-form-item label="办理时限" prop="timeLimit">
                                <el-input v-model.trim="applyOpenModel.timeLimit"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="申请表" prop="fileUrl">
                                <el-input v-model.trim="applyOpenModel.fileUrl"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="表单模板" prop="templateForm">
                                <el-cascader
                                    style="width: 100%"
                                    placeholder="请选择模板地址"
                                    clearable
                                    expand-trigger="hover"
                                    :options="templateTreeData"
                                    v-model.trim="applyOpenModel.templateForm"
                                    :props="cascaderProps">
                                </el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="列表模板" prop="templateList">
                                <el-cascader
                                    style="width: 100%"
                                    placeholder="请选择模板地址"
                                    clearable
                                    expand-trigger="hover"
                                    :options="templateTreeData"
                                    v-model.trim="applyOpenModel.templateList"
                                    :props="cascaderProps">
                                </el-cascader>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="详情模板" prop="templateContent">
                                <el-cascader
                                    style="width: 100%"
                                    placeholder="请选择模板地址"
                                    clearable
                                    expand-trigger="hover"
                                    :options="templateTreeData"
                                    v-model.trim="applyOpenModel.templateContent"
                                    :props="cascaderProps">
                                </el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="查询模板" prop="templateQuery">
                                <el-cascader
                                    style="width: 100%"
                                    placeholder="请选择模板地址"
                                    clearable
                                    expand-trigger="hover"
                                    :options="templateTreeData"
                                    v-model.trim="applyOpenModel.templateQuery"
                                    :props="cascaderProps">
                                </el-cascader>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="回执模板" prop="templateOver">
                                <el-cascader
                                    style="width: 100%"
                                    placeholder="请选择模板地址"
                                    clearable
                                    expand-trigger="hover"
                                    :options="templateTreeData"
                                    v-model.trim="applyOpenModel.templateOver"
                                    :props="cascaderProps">
                                </el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="打印模板" prop="templatePrint">
                                <el-cascader
                                    style="width: 100%"
                                    placeholder="请选择模板地址"
                                    clearable
                                    expand-trigger="hover"
                                    :options="templateTreeData"
                                    v-model.trim="applyOpenModel.templatePrint"
                                    :props="cascaderProps">
                                </el-cascader>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model.trim="applyOpenModel.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeApplyOpenModelDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getApplyOpenModelList,
        createOrUpdateApplyOpenModel,
        delApplyOpenModels
    } from '@/api/assembly/applyOpenModel';

    export default {
        name: 'applyOpenModel',
        data() {
            return {
                applyOpenModelList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    modelName: undefined,
                    siteId: this.$store.state.common.siteId
                },
                applyOpenModel: {
                    id: undefined,
                    modelName: undefined,
                    mustMember: 1,
                    isAutoPublish: 2,
                    remindType: 1,
                    codePre: 'YSQGK',
                    codeRule: 'YYYYMMDD',
                    codeNum: 4,
                    timeLimit: 15,
                    queryNum: 6,
                    fileUrl: undefined,
                    templateForm: undefined,
                    templateList: undefined,
                    templateContent: undefined,
                    templateOver: undefined,
                    templatePrint: undefined,
                    templateQuery: undefined,
                    siteId: this.$store.state.common.siteId,
                    remark: undefined
                },
                applyOpenModelRules: {
                    modelName: [
                        {required: true, message: this.$t("table.pleaseInput") + '业务名称'}
                    ],
                    codePre: [
                        {required: true, message: this.$t("table.pleaseInput") + '业务编码'}
                    ],
                    timeLimit: [
                        {required: true, message: this.$t("table.pleaseInput") + '办理时限'}
                    ],
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
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
                    create: this.permission.applyOpenModel_create,
                    update: this.permission.applyOpenModel_update,
                    delete: this.permission.applyOpenModel_delete
                };
            }
        },
        created(){
            this.$store.state.common.selectSiteDisplay = true;
            if(this.$store.state.common.siteId != undefined){
                this.reloadList();
            }else{
                this.$message.error('请选择站点！');
            }
        },
        methods: {
            resetSearch(){
                this.listQuery.name = undefined;
            },
            reloadList(){
                this.listLoading = true;
                this.applyOpenModelList = undefined;
                this.total = undefined;
                getApplyOpenModelList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.applyOpenModelList = response.data.records;
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
                this.resetApplyOpenModel();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetApplyOpenModel();
                if (row.id) {
                    this.applyOpenModel = deepClone(row);
                } else {
                    this.applyOpenModel = deepClone(this.selectedRows[0]);
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
                this.$refs['applyOpenModelDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateApplyOpenModel(this.applyOpenModel).then(() => {
                            this.resetApplyOpenModelDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['applyOpenModelDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateApplyOpenModel(this.applyOpenModel).then(() => {
                            this.resetApplyOpenModelDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delApplyOpenModels(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetApplyOpenModel(){
                this.applyOpenModel = {
                    id: undefined,
                    modelName: undefined,
                    mustMember: 1,
                    isAutoPublish: 2,
                    remindType: 1,
                    codePre: 'YSQGK',
                    codeRule: 'YYYYMMDD',
                    codeNum: 4,
                    timeLimit: 15,
                    queryNum: 6,
                    fileUrl: undefined,
                    templateForm: undefined,
                    templateList: undefined,
                    templateContent: undefined,
                    templateOver: undefined,
                    templatePrint: undefined,
                    templateQuery: undefined,
                    siteId: this.$store.state.common.siteId,
                    remark: undefined
                }
            },
            resetApplyOpenModelDialogAndList(){
                this.closeApplyOpenModelDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeApplyOpenModelDialog() {
                this.dialogVisible = false;
                this.resetApplyOpenModel();
                this.$refs['applyOpenModelDialogForm'].resetFields();
            }
        }
    }
</script>


