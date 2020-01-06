<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-menu">
                <div class="deyatech-menu_left">
                    <el-button v-if="btnEnable.create" type="primary" :size="btnSize" @click="btnCreate">{{$t('table.create')}}</el-button>
                    <el-button v-if="btnEnable.update" type="primary" :size="btnSize" @click="btnUpdate" :disabled="selectedRows.length != 1">{{$t('table.update')}}</el-button>
                    <!--<el-button v-if="btnEnable.enable" type="primary" :size="btnSize" @click="btnStatusEnable" :disabled="enableDisabled">启用</el-button>
                    <el-button v-if="btnEnable.disable" type="warning" :size="btnSize" @click="btnStatusDisable" :disabled="disableDisabled">停用</el-button>-->
                    <el-button v-if="btnEnable.delete" type="danger" :size="btnSize" @click="btnDelete" :disabled="selectedRows.length < 1 || beUsed">{{$t('table.delete')}}</el-button>

                    <el-input :size="searchSize" :placeholder="$t('table.searchName')" v-model.trim="listQuery.name" style="width: 300px;margin-left: 10px;margin-right:10px;"></el-input>
                    <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="reloadList">{{$t('table.search')}}</el-button>
                    <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}</el-button>
                </div>
                <div class="deyatech-menu_right">
                    <!--<el-button type="primary" icon="el-icon-edit" :size="btnSize" circle @click="btnUpdate"></el-button>
                    <el-button type="danger" icon="el-icon-delete" :size="btnSize" circle @click="btnDelete"></el-button>-->
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                </div>
            </div>
            <el-table :data="processDefinitionList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <!--<el-table-column align="center" label="流程编号" prop="id"/>
                <el-table-column align="center" label="模型编号" prop="processModelId"/>
                <el-table-column align="center" label="流程ID" prop="actDefinitionId"/>
                <el-table-column align="center" label="流程KEY" prop="actDefinitionKey"/>-->
                <el-table-column align="center" label="流程名称" prop="name">
                    <template slot-scope="scope">
                        <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <!--<el-table-column align="center" label="版本" prop="ver"/>-->
                <el-table-column align="center" label="发布时间" prop="deploymentTime"/>
                <!--<el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                            {{scope.row.enable | enums('EnableEnum')}}
                        </el-tag>
                    </template>
                </el-table-column>-->
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="200">
                    <template slot-scope="scope">
                        <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                                   @click.stop.safe="btnUpdate(scope.row)"></el-button>
                        <el-button v-if="btnEnable.setting" type="primary" title="流程节点配置" icon="iconset" :size="btnSize" circle
                                   @click="btnTaskSetting(scope.row)"></el-button>
                        <!--<el-button v-if="btnEnable.enable && scope.row.enable === 0" type="primary" title="启用" icon="iconsuccess" :size="btnSize" circle
                                   @click="btnStatusEnable(scope.row)"></el-button>
                        <el-button v-if="btnEnable.disable && scope.row.enable === 1" type="warning" title="停用" icon="iconwarning" :size="btnSize" circle
                                   @click="btnStatusDisable(scope.row)"></el-button>-->
                        <el-button v-if="btnEnable.delete" :title="$t('table.delete')" type="danger" icon="el-icon-delete" :size="btnSize" circle
                                   @click.stop.safe="btnDelete(scope.row)" :disabled="scope.row.beUsed"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="deyatech-pagination pull-right" background
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                           :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>

            <el-dialog title="流程节点设置" :visible.sync="dialogTaskSettingVisible" :close-on-click-modal="closeOnClickModal" width="80%">
                <el-row class="setting-container">
                    <p>流程名称：{{processDefinition.name}}</p>
                    <p>ID：{{processDefinition.actDefinitionId}}</p>
                    <p>KEY：{{processDefinition.actDefinitionKey}}</p>
                    <p>版本：{{processDefinition.ver}}</p>
                    <p>发布时间：{{processDefinition.deploymentTime | date('YYYY-MM-DD HH:mm:ss')}}</p>
                </el-row>
                <el-row>
                    <el-col :span="14">
                        <div class="setting-container" v-if="dialogTaskSettingVisible">
                            <div id="diagramHolder" class="diagramHolder" style="margin-left: auto; margin-right: auto">
                                <!--<div class="con-bank-20"></div>-->
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="10">
                        <div class="setting-container">
                            <div id="diagramInfo"></div>
                            <div class="con-bank-20"></div>
                            <div v-show="taskUserInfoVisible">
                                <h3>人员安排</h3>
                                <label>流程中锁定为（变量）所表示的用户</label>
                            </div>
                            <div v-show="taskUserEditorVisible">
                                <h3>人员安排设置</h3>
                                <div>
                                    <el-radio-group v-model.trim="processTaskSetting.candidateType">
                                        <el-radio :label="1">按用户分配</el-radio>
                                        <el-radio :label="2">按角色分配</el-radio>
                                        <el-radio :label="3">按部门分配</el-radio>
                                    </el-radio-group>
                                </div>
                                <div class="con-bank-20"></div>
                                <div>
                                    <div v-show="processTaskSetting.candidateType === 1">
                                        <!--<el-select filterable v-model.trim="selectedUser" remote :remote-method="getUserOptions"
                                                   filterable placeholder="请输入姓名或帐号查询" style="width: 60%">
                                            <el-option v-for="item in userOptions" :key="item.id" :label="item.name" :value="item.id">
                                            </el-option>
                                        </el-select>-->
                                        <el-button type="primary" :size="btnSize" @click="btnSelectUser">添加用户</el-button>
                                        <!--<el-button type="primary" :size="btnSize" style="margin-left: 10px" @click="addCandidateUser">添加</el-button>-->
                                        <div class="con-bank-20"></div>
                                        <el-table :data="candidateUserList" border>
                                            <!--<el-table-column prop="empNo" label="工号"/>-->
                                            <el-table-column prop="name" label="姓名"/>
                                            <el-table-column prop="account" label="帐号"/>
                                            <el-table-column label="操作" width="60">
                                                <template slot-scope="scope">
                                                    <el-button type="danger" title="删除" icon="el-icon-delete" :size="btnSize" circle
                                                               @click="delCandidateUser(scope.$index)">
                                                    </el-button>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </div>
                                    <el-select filterable v-show="processTaskSetting.candidateType === 2" v-model.trim="candidateGroupList" multiple
                                               placeholder="请选择" style="width: 75%">
                                        <el-option v-for="item in groupOptions" :key="item.id" :label="item.name" :value="item.id">
                                        </el-option>
                                    </el-select>
                                    <el-cascader filterable v-show="processTaskSetting.candidateType === 3" v-model.trim="selectedDepartment"
                                                 :options="departmentCascader" style="width: 75%"
                                                 show-all-levels expand-trigger="hover"
                                                 filterable clearable change-on-select
                                                 :props="{ multiple: true, checkStrictly: true }"
                                                 placeholder="请选择">
                                    </el-cascader>
                                </div>
                            </div>
                            <div class="con-bank-20"></div>
                            <div v-show="userTaskSettingVisible">
                                <h3>用户任务其他设置</h3>
                                <el-checkbox v-model.trim="processTaskSetting.autoPass">没有对应审批人员时自动进入下一个审批环节</el-checkbox>
                            </div>
                            <div class="con-bank-20"></div>
                        </div>
                        <div v-show="userTaskSettingVisible">
                            <el-button type="primary" @click="saveTaskSetting">保存设置</el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-dialog>

            <el-dialog :title="titleMap['associateUser']" :visible.sync="dialogUserVisible" width="80%"
                       :close-on-click-modal="closeOnClickModal" @close="closeUserDialog" @open="initUserTable">
                <div v-loading="dialogFormLoading">
                    <div class="dialog-search">
                        <el-cascader filterable :options="departmentCascader" @change="handleDepartmentChange"
                                     class="dialog-search-item dialog-keywords"
                                     :show-all-levels="false" expand-trigger="hover" clearable change-on-select
                                     :size="searchSize" placeholder="根据部门筛选">
                        </el-cascader>
                        <el-input v-model.trim="userListQuery.name" class="dialog-search-item dialog-keywords"
                                  clearable :size="searchSize" placeholder="根据姓名或帐户查询">
                        </el-input>
                        <el-button type="primary" :size="searchSize" icon="el-icon-search" @click="reloadUserList">{{$t('table.search')}}</el-button>
                    </div>
                    <div>
                        <el-table ref="userTable" :data="userList" border @select="selectRowUser"
                                  @select-all="selectAllUser" @selection-change="handleSelectionChangeUser">
                            <el-table-column type="selection" width="50" align="center"></el-table-column>
                            <el-table-column prop="departmentName" label="部门"></el-table-column>
                            <el-table-column prop="name" label="姓名"></el-table-column>
                            <el-table-column prop="account" label="登录帐户"></el-table-column>
                        </el-table>
                        <el-pagination class="deyatech-pagination pull-right" background
                                       :current-page.sync="userListQuery.page" :page-sizes="this.$store.state.common.pageSize"
                                       :page-size="userListQuery.size" :layout="this.$store.state.common.pageLayout" :total="userTotal"
                                       @size-change="handleSizeChangeUser" @current-change="handleCurrentChangeUser">
                        </el-pagination>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" :size="btnSize" @click="doAddCandidateUser"
                               :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeUserDialog">{{$t('table.cancel')}}</el-button>
                </div>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getProcessDefinitionList,
        createOrUpdateProcessDefinition,
        delProcessDefinitions,
        processActivate,
        processSuspend
    } from '../../api/workflow/definition';
    import {
        getProcessTaskSetting,
        createOrUpdateProcessTaskSetting
    } from "../../api/workflow/taskSetting";
    import {
        getUserList,
        findUserByIds
    } from "../../api/admin/user";
    import {
        getAllRole
    } from "../../api/admin/role";
    import {
        getDepartmentCascader,
        findDepartmentByIds
    } from "../../api/admin/department";
    import {
        clearWorkFlow,
        getAllCatalogWorkFlowId
    } from "../../api/station/catalog";

    export default {
        name: 'processDefinition',
        data() {
            return {
                processDefinitionList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined
                },
                processDefinition: {
                    id: undefined,
                    processModelId: undefined,
                    actDeploymentId: undefined,
                    actDefinitionId: undefined,
                    name: undefined,
                    actDefinitionKey: undefined,
                    deploymentTime: undefined,
                    ver: undefined
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                dialogTaskSettingVisible: false,
                taskUserInfoVisible: false,
                taskUserEditorVisible: false,
                userTaskSettingVisible: false,
                processTaskSetting: {
                    id: undefined,
                    actDefinitionId: undefined,
                    actTaskDefinitionId: undefined,
                    source: undefined,
                    assignee: undefined,
                    candidateType: undefined,
                    candidateUsers: undefined,
                    candidateGroups: undefined,
                    candidateDepartments: undefined,
                    autoPass: false
                },
                dialogUserVisible: false,
                dialogFormLoading: false,
                userListQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    departmentId: undefined,
                    name: undefined
                },
                departmentCascader: [],
                userTotal: 0,
                userList: [],
                selectedRowsUser: [],
                selectedAllUserId: [],
                selectedAllUser: [],
                groupOptions: [],
                userLoading: false,
                selectedUser: undefined,
                candidateUserList: [],
                candidateGroupList: [],
                candidateDepartmentTreePosition: [],
                beUsed: false
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
                    create: this.permission.processDefinition_create,
                    update: this.permission.processDefinition_update,
                    enable: this.permission.processDefinition_enable,
                    disable: this.permission.processDefinition_disable,
                    delete: this.permission.processDefinition_delete,
                    setting: this.permission.processDefinition_setting
                };
            },
            enableDisabled() {
                if (this.selectedRows.length < 1) {
                    return true;
                }
                for (let row of this.selectedRows) {
                    if (row.enable !== 0) {
                        return true;
                    }
                }
                return false;
            },
            disableDisabled() {
                if (this.selectedRows.length < 1) {
                    return true;
                }
                for (let row of this.selectedRows) {
                    if (row.enable !== 1) {
                        return true;
                    }
                }
                return false;
            },
            selectedDepartment: {
                get() {
                    if (this.candidateDepartmentTreePosition.length > 0) {
                        let departments = [];
                        for (let item of this.candidateDepartmentTreePosition) {
                            departments.push(item.substr(1).split('&'));
                        }
                        return departments;
                    }
                },
                set(v) {
                    if (v && v.length > 0) {
                        let departmentIds = [];
                        let departmentTreePosition = [];
                        for (let item of v) {
                            departmentIds.push(item[item.length - 1]);
                            departmentTreePosition.push('&' + item.join('&'));
                        }
                        this.processTaskSetting.candidateDepartments = departmentIds.join();
                        this.candidateDepartmentTreePosition = departmentTreePosition;
                    } else {
                        this.processTaskSetting.candidateDepartments = undefined;
                        this.candidateDepartmentTreePosition = [];
                    }
                }
            }
        },
        created(){
            this.$store.state.common.selectSiteDisplay = false;
            this.reloadList();
            this.init();
            this.getGroupOptions();
            this.loadDepartment();
        },
        methods: {
            resetSearch(){
                this.listQuery.name = undefined;
            },
            reloadList(){
                this.listLoading = true;
                this.processDefinitionList = undefined;
                getProcessDefinitionList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.processDefinitionList = response.data.records;
                    this.total = response.data.total;
                    if (this.processDefinitionList) {
                        getAllCatalogWorkFlowId().then(response => {
                            let workflowIds = response.data;
                            if (workflowIds) {
                                for (let item of this.processDefinitionList) {
                                    let has = false;
                                    for (let id of workflowIds) {
                                        if (item.actDefinitionId === id) {
                                            has = true;
                                        }
                                    }
                                    if (has) {
                                        this.$set(item, 'beUsed', true);
                                    } else {
                                        this.$set(item, 'beUsed', false);
                                    }
                                }
                            }
                        });
                    }
                })
            },
            loadDepartment() {
                getDepartmentCascader().then(response => {
                    this.departmentCascader = response.data;
                })
            },
            loadUserList() {
                this.dialogFormLoading = true;
                return new Promise((resolve, reject) => {
                    getUserList(this.userListQuery).then(response => {
                        this.dialogFormLoading = false;
                        this.userList = response.data.records;
                        this.userTotal = response.data.total;
                        resolve()
                    })
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
                this.beUsed = false;
                if (this.selectedRows) {
                    for (let item of this.selectedRows) {
                        if (item.beUsed) {
                            this.beUsed = true;
                            break;
                        }
                    }
                }
            },
            handleSizeChangeUser(val) {
                this.userListQuery.size = val;
                this.loadUserList().then(() => {
                    this.checkSelectedRowsUser();
                })
            },
            handleCurrentChangeUser(val) {
                this.userListQuery.page = val;
                this.loadUserList().then(() => {
                    this.checkSelectedRowsUser();
                })
            },
            handleSelectionChangeUser(rows) {
                this.selectedRowsUser = rows;
            },
            btnCreate(){
                this.resetProcessDefinition();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetProcessDefinition();
                if (row.id) {
                    this.processDefinition = deepClone(row);
                } else {
                    this.processDefinition = deepClone(this.selectedRows[0]);
                }
                this.dialogTitle = 'update';
                this.dialogVisible = true;
            },
            btnDelete(row){
                let ids = [];
                let actDefinitionIdList = [];
                if (row.id) {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        ids.push(row.id);
                        actDefinitionIdList.push(row.actDefinitionId);
                        this.doDelete(ids, actDefinitionIdList);
                    })
                } else {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        for(const deleteRow of this.selectedRows){
                            ids.push(deleteRow.id);
                            actDefinitionIdList.push(deleteRow.actDefinitionId);
                        }
                        this.doDelete(ids, actDefinitionIdList);
                    })
                }
            },
            btnStatusEnable(row) {
                let ids = [];
                if (row.id) {
                    ids.push(row.actDefinitionId);
                } else {
                    for (const item of this.selectedRows) {
                        ids.push(item.actDefinitionId);
                    }
                }
                processActivate(ids).then(() => {
                    this.reloadList();
                    this.$message.success("流程已启用");
                })
            },
            btnStatusDisable(row) {
                this.$confirm("禁用后将无法发起该流程，是否继续？", this.$t("table.tip"), {type: 'warning'}).then(() => {
                    let ids = [];
                    if (row.id) {
                        ids.push(row.actDefinitionId);
                    } else {
                        for (const item of this.selectedRows) {
                            ids.push(item.actDefinitionId);
                        }
                    }
                    processSuspend(ids).then(() => {
                        this.reloadList();
                        this.$message.success("流程已禁用");
                    })
                })
            },
            btnTaskSetting(row) {
                ProcessDiagramGenerator.processDiagrams = {};
                ProcessDiagramGenerator.diagramBreadCrumbs = null;
                this.dialogTaskSettingVisible = true;
                this.processDefinition = deepClone(row);
                this.flush(row.actDefinitionId);
            },
            btnSelectUser() {
                this.dialogUserVisible = true;
            },
            doCreate(){
                this.$refs['processDefinitionDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateProcessDefinition(this.processDefinition).then(() => {
                            this.resetProcessDefinitionDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['processDefinitionDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateProcessDefinition(this.processDefinition).then(() => {
                            this.resetProcessDefinitionDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids, actDefinitionIdList){
                this.listLoading = true;
                delProcessDefinitions(ids).then(() => {
                    if (actDefinitionIdList) {
                        // 清除栏目中的工作流
                        clearWorkFlow(actDefinitionIdList).then(()=>{});
                    }
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            saveTaskSetting() {
                // 按用户分配
                if (this.processTaskSetting.candidateType == 1) {
                    let userIds = [];
                    for (let user of this.candidateUserList) {
                        userIds.push(user.id);
                    }
                    this.processTaskSetting.candidateUsers = userIds.join();
                    this.processTaskSetting.candidateGroups = '';
                    this.processTaskSetting.candidateDepartments = '';
                    if (!this.processTaskSetting.candidateUsers) {
                        this.$message.error('请选择用户');
                        return;
                    }
                }
                // 按角色分配
                else if (this.processTaskSetting.candidateType == 2) {
                    this.processTaskSetting.candidateUsers = '';
                    this.processTaskSetting.candidateGroups = this.candidateGroupList.join();
                    this.processTaskSetting.candidateDepartments = '';
                    if (!this.processTaskSetting.candidateGroups) {
                        this.$message.error('请选择角色');
                        return;
                    }
                }
                // 按部门分配
                else if (this.processTaskSetting.candidateType == 3) {
                    this.processTaskSetting.candidateUsers = '';
                    this.processTaskSetting.candidateGroups = '';

                    if (!this.processTaskSetting.candidateDepartments) {
                        this.$message.error('请选择部门');
                        return;
                    }
                } else {
                    this.$message.error('请选人员安排设置');
                    return;
                }
                createOrUpdateProcessTaskSetting(this.processTaskSetting).then(() => {
                    this.$message.success('保存成功');
                    getProcessTaskSetting({actDefinitionId: this.processTaskSetting.actDefinitionId,
                        actTaskDefinitionId: this.processTaskSetting.actTaskDefinitionId}).then(response => {
                        if (response.data) {
                            this.processTaskSetting = deepClone(response.data);
                        }
                    });
                })
            },
            resetProcessDefinition(){
                this.processDefinition = {
                    id: undefined,
                    processModelId: undefined,
                    actDeploymentId: undefined,
                    actDefinitionId: undefined,
                    name: undefined,
                    actDefinitionKey: undefined,
                    deploymentTime: undefined,
                    ver: undefined
                }
            },
            resetProcessDefinitionDialogAndList(){
                this.closeProcessDefinitionDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeProcessDefinitionDialog() {
                this.dialogVisible = false;
                this.resetProcessDefinition();
                this.$refs['processDefinitionDialogForm'].resetFields();
            },
            resetTaskSettingTemp() {
                this.processTaskSetting = {
                    id: undefined,
                    actDefinitionId: undefined,
                    actTaskDefinitionId: undefined,
                    source: undefined,
                    assignee: undefined,
                    candidateType: undefined,
                    candidateUsers: undefined,
                    candidateGroups: undefined,
                    candidateDepartments: undefined,
                    autoPass: false
                };
                this.selectedUser = undefined;
                this.userOptions = [];
                this.candidateUserList = [];
                this.candidateGroupList = []
            },
            initUserTable() {
                Promise.all([this.loadUserList(), this.$nextTick()]).then(() => {
                    this.selectedAllUserId = [];
                    this.selectedAllUser = [];
                    for (let item of this.candidateUserList) {
                        this.selectedAllUser.push(deepClone(item));
                        this.selectedAllUserId.push(item.id);
                    }
                    this.checkSelectedRowsUser();
                })
            },
            handleDepartmentChange(val) {
                if (val.length > 0) {
                    this.userListQuery.departmentId = val[val.length - 1]
                } else {
                    this.userListQuery.departmentId = undefined
                }
            },
            reloadUserList() {
                this.handleCurrentChangeUser(1);
            },
            selectRowUser(selection, row) {
                let i = this.selectedAllUserId.indexOf(row.id);
                if (i < 0) {
                    this.selectedAllUserId.push(row.id);
                    this.selectedAllUser.push(deepClone(row));
                } else {
                    this.selectedAllUserId.splice(i, 1);
                    for (let [index, item] of this.selectedAllUser.entries()) {
                        if (item.id === row.id) {
                            this.selectedAllUser.splice(index, 1);
                            break;
                        }
                    }
                }
            },
            selectAllUser(selection) {
                if (selection.length > 0) {
                    for (let row of this.userList) {
                        if (this.selectedAllUserId.indexOf(row.id) < 0) {
                            this.selectedAllUserId.push(row.id);
                            this.selectedAllUser.push(deepClone(row));
                        }
                    }
                } else {
                    for (let row of this.userList) {
                        let i = this.selectedAllUserId.indexOf(row.id);
                        if (i >= 0) {
                            this.selectedAllUserId.splice(i, 1)
                        }
                        for (let [index, item] of this.selectedAllUser.entries()) {
                            if (item.id === row.id) {
                                this.selectedAllUser.splice(index, 1);
                                break;
                            }
                        }
                    }
                }
            },
            checkSelectedRowsUser() {
                for (let row of this.userList) {
                    if (this.selectedAllUserId.includes(row.id)) {
                        this.$refs['userTable'].toggleRowSelection(row, true);
                    }
                }
            },
            doAddCandidateUser() {
                let user = [];
                for (const row of this.selectedAllUser) {
                    user.push(deepClone(row));
                    // let addFlag = true;
                    // for (const related of this.candidateUserList) {
                    //     if (related.id === row.id) {
                    //         addFlag = false;
                    //         break;
                    //     }
                    // }
                    // if (addFlag) {
                    //     this.candidateUserList.push(deepClone(row));
                    // }
                }
                this.candidateUserList = user;
                this.closeUserDialog();
            },
            closeUserDialog() {
                this.dialogUserVisible = false;
                this.$refs['userTable'].clearSelection();
                this.selectedRowsUser = [];
                this.selectedAllUserId = [];
                this.selectedAllUser = [];
                this.userListQuery = {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    departmentId: undefined,
                    name: undefined
                }
            },
            getUserOptions(name) {
                if (!name) {
                    this.userOptions = [];
                    return;
                }
                let query = {
                    page: 1,
                    size: 20,
                    name: name
                };
                this.userLoading = true;
                getUserList(query).then(response => {
                    this.userLoading = false;
                    this.userOptions = response.data.records;
                })
            },
            addCandidateUser() {
                if (!this.selectedUser) {
                    return;
                }
                for (let user of this.candidateUserList) {
                    if (this.selectedUser === user.id) {
                        this.$message.warning('请勿重复添加');
                        this.selectedUser = undefined;
                        return;
                    }
                }
                for (let user of this.userOptions) {
                    if (this.selectedUser === user.id) {
                        this.candidateUserList.push(deepClone(user));
                        this.selectedUser = undefined;
                        return;
                    }
                }
            },
            delCandidateUser(index) {
                this.candidateUserList.splice(index, 1);
            },
            getGroupOptions() {
                getAllRole().then(response => {
                    this.groupOptions = response.data;
                })
            },
            getTaskSetting(actDefinitionId, actTaskDefinitionId) {
                getProcessTaskSetting({actDefinitionId, actTaskDefinitionId}).then(response => {
                    if (response.data) {
                        this.processTaskSetting = deepClone(response.data);
                        if (this.processTaskSetting.candidateType === 1) {
                            this.getCandidateUserList(this.processTaskSetting.candidateUsers);
                        } else if (this.processTaskSetting.candidateType === 2) {
                            if (this.processTaskSetting.candidateGroups) {
                                this.candidateGroupList = this.processTaskSetting.candidateGroups.split(',')
                            } else {
                                this.candidateGroupList = [];
                            }
                        } else if (this.processTaskSetting.candidateType === 3) {
                            this.getCandidateDepartmentList(this.processTaskSetting.candidateDepartments).then(data => {
                                this.candidateDepartmentTreePosition = [];
                                for (let item of data) {
                                    this.candidateDepartmentTreePosition.push(item.treePosition + '&' + item.id);
                                }
                            })
                        }
                    }
                    this.processTaskSetting.actDefinitionId = actDefinitionId;
                    this.processTaskSetting.actTaskDefinitionId = actTaskDefinitionId;
                })
            },
            getCandidateUserList(ids) {
                findUserByIds(ids).then(response => {
                    this.candidateUserList = response.data;
                })
            },
            getCandidateDepartmentList(ids) {
                return new Promise((resolve, reject) => {
                    findDepartmentByIds(ids).then(response => {
                        resolve(response.data);
                    })
                })
            },
            init() {
                const _this = this;
                ProcessDiagramGenerator.options = {
                    diagramHolderId: "diagramHolder", //显示流程图区域的id
                    diagramInfoId: "diagramInfo", //展示节点信息区域的id
                    on: {
                        click: function (canvas, element, contextObject) {

                            let mouseEvent = this;
                            //console.log("[CLICK] mouseEvent: %o, canvas: %o, clicked element: %o, contextObject: %o", mouseEvent, canvas, element, contextObject);
                            _this.resetProcessTaskSetting();

                            // 如果点击的是连接线，显示连接线信息
                            if (contextObject.flow) {
                                ProcessDiagramGenerator.showFlowInfo(contextObject);
                            } else {
                                ProcessDiagramGenerator.showActivityInfo(contextObject);
                                let type = contextObject.getProperty("type");
                                if (type == "userTask") {
                                    //查询节点配置信息
                                    _this.getTaskSetting(canvas.processDefinitionId, contextObject.id);
                                    // 如果指定了执行人员
                                    let assignee = contextObject.getProperty("assignee");
                                    if (assignee) {
                                        _this.assignee = assignee;// todo
                                        _this.taskUserInfoVisible = true;
                                        _this.taskUserEditorVisible = false;
                                    } else {
                                        // 显示人员列表
                                        _this.taskUserInfoVisible = false;
                                        _this.taskUserEditorVisible = true;
                                    }
                                    _this.userTaskSettingVisible = true;

                                } else if (type == 'boundaryTimer') {

                                } else if (type == 'callActivity') {
                                    let processDefinitons = contextObject.getProperty("processDefinitons");
                                    let processDefiniton = processDefinitons[0];
                                    //console.log("Load callActivity '" + processDefiniton.processDefinitionKey + "', contextObject: ", contextObject);

                                    // Load processDefinition
                                    ProcessDiagramGenerator.drawDiagram(processDefiniton.processDefinitionId);
                                }
                            }
                        },
                        rightClick: function (canvas, element, contextObject) {
                            var mouseEvent = this;
                            //console.log("[RIGHTCLICK] mouseEvent: %o, canvas: %o, clicked element: %o, contextObject: %o", mouseEvent, canvas, element, contextObject);
                        },
                        over: function (canvas, element, contextObject) {
                            var mouseEvent = this;
                            //console.log("[OVER] mouseEvent: %o, canvas: %o, clicked element: %o, contextObject: %o", mouseEvent, canvas, element, contextObject);
                            // ProcessDiagramGenerator.showActivityInfo(contextObject);
                        },
                        out: function (canvas, element, contextObject) {
                            var mouseEvent = this;
                            //console.log("[OUT] mouseEvent: %o, canvas: %o, clicked element: %o, contextObject: %o", mouseEvent, canvas, element, contextObject);
                            // ProcessDiagramGenerator.hideInfo();
                        }
                    }
                };

                ActivitiRest.options = {
                    processInstanceHighLightsUrl: "/manage/workflow/diagram/process-instance/{processInstanceId}/highlights?callback=?",
                    processDefinitionUrl: "/manage/workflow/diagram/process-definition/{processDefinitionId}/diagram-layout?callback=?"
                };

                ProcessDiagramGenerator.processDiagrams = {};
                ProcessDiagramGenerator.diagramBreadCrumbs = null;
            },
            resetProcessTaskSetting() {
                // 清空节点信息
                ProcessDiagramGenerator.hideInfo();
                this.resetTaskSettingTemp();
                // 隐藏人员列表
                this.taskUserInfoVisible = false;
                this.taskUserEditorVisible = false;
                // 隐藏时限设置
                this.userTaskSettingVisible = false;
            },
            flush(definitionId) {
                this.resetProcessTaskSetting();
                ProcessDiagramGenerator.drawDiagram(definitionId);
            }
        }
    }
</script>

<style>
    .setting-container {
        background-color: #fff;
        margin: 10px 8px;
        padding: 8px 20px;
        font-size: 14px;
        border: 1px #eceef5 solid;
        overflow: scroll;
    }
    .con-bank-20 {
        height: 20px;
    }
</style>
