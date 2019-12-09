<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-menu">
                <div class="deyatech-menu_left">
                    <el-button v-if="btnEnable.create" type="primary" :size="btnSize" @click="btnCreate"
                               :disabled="selectedRows.length > 1">{{$t('table.create')}}
                    </el-button>
                    <el-button v-if="btnEnable.update" type="primary" :size="btnSize" @click="btnUpdate"
                               :disabled="selectedRows.length != 1">{{$t('table.update')}}
                    </el-button>
                    <el-button v-if="btnEnable.delete" type="danger" :size="btnSize" @click="btnDelete"
                               :disabled="selectedRows.length < 1">{{$t('table.delete')}}
                    </el-button>
                </div>
                <div class="deyatech-menu_right">
                    <!--<el-button type="primary" icon="el-icon-edit" :size="btnSize" circle @click="btnUpdate"></el-button>
     <el-button type="danger" icon="el-icon-delete" :size="btnSize" circle @click="btnDelete"></el-button>-->
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                </div>
            </div>
        </div>

        <el-table :data="departmentList" v-loading.body="listLoading" stripe border highlight-current-row
                  @selection-change="handleSelectionChange" v-if="tableReset">
            <el-table-column type="selection" width="50" align="center"/>
            <el-table-tree-column fixed :expand-all="false" child-key="children" levelKey="level" :indent-size="20"
                                  parentKey="parentId" prop="name" label="部门名称" >
                <template slot-scope="scope">
                    <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                </template>
            </el-table-tree-column>
            <el-table-column align="center" label="部门简称" prop="shortName"/>
            <el-table-column align="center" label="社会信用代码" prop="code"/>
            <el-table-column align="center" label="排序号" prop="sortNo" width="90"/>
            <el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                        {{scope.row.enable | enums('EnableEnum')}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center"
                             width="150">
                <template slot-scope="scope">
                    <el-button v-if="btnEnable.create" :title="$t('table.create')" type="primary" icon="el-icon-plus"
                               :size="btnSize" circle
                               @click.stop.safe="btnCreate(scope.row)"></el-button>
                    <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit"
                               :size="btnSize" circle
                               @click.stop.safe="btnUpdate(scope.row)"></el-button>
                    <el-button v-if="btnEnable.delete" :title="$t('table.delete')" type="danger" icon="el-icon-delete"
                               :size="btnSize" circle
                               @click.stop.safe="btnDelete(scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible"
                   :close-on-click-modal="closeOnClickModal" @close="closeDepartmentDialog">
            <el-form ref="departmentDialogForm" class="deyatech-form" :model="department" label-position="right"
                     label-width="106px" :rules="departmentRules">
                <el-row :gutter="20" :span="24">
                    <el-col :span="12">
                        <el-form-item :label="$t('table.parent')">
                            <el-cascader filterable :options="departmentCascader" v-model="departmentTreePosition"
                                         expand-trigger="hover" clearable
                                         change-on-select style="width: 100%"></el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="部门名称" prop="name">
                            <el-input v-model.trim="department.name" maxlength="50"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" :span="24">
                    <el-col :span="12">
                        <el-form-item label="社会信用代码" prop="code">
                            <el-input v-model.trim="department.code" maxlength="18"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="部门简称" prop="shortName">
                            <el-input v-model.trim="department.shortName" maxlength="50"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" :span="24">
                    <el-col :span="12">
                        <el-form-item label="排序号" prop="sortNo">
                            <el-input-number v-model="department.sortNo" :min="1" :max="9999"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" :span="24">
                    <el-col :span="24">
                        <el-form-item :label="$t('table.remark')" prop="remark">
                            <el-input type="textarea" v-model.trim="department.remark" :rows="3" maxlength="500"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate"
                           :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                <el-button :size="btnSize" @click="closeDepartmentDialog">{{$t('table.cancel')}}</el-button>
            </span>
        </el-dialog>
    </basic-container>
</template>

<script>
    import {
        getDepartmentTree,
        getDepartmentCascader,
        createOrUpdateDepartment,
        getNextSortNo,
        delDepartments
    } from '@/api/admin/department';
    import {deepClone, setExpanded} from '@/util/util';
    import {mapGetters} from 'vuex';
    import {isStartOrEndWithWhiteSpace} from '@/util/validate';

    export default {
        name: 'department',
        data() {
            const validateWhiteSpace = (rule, value, callback) => {
                if (isStartOrEndWithWhiteSpace(value)) {
                    callback(new Error(this.$t("errorMsg.blankSpace")));
                    return;
                }
                callback();
            };
            return {
                departmentList: undefined,
                listLoading: true,
                department: {
                    id: undefined,
                    name: undefined,
                    shortName: undefined,
                    code: undefined,
                    parentId: undefined,
                    treePosition: undefined,
                    sortNo: undefined
                },
                departmentCascader: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                selectedRows: [],
                departmentRules: {
                    name: [
                        {required: true, whiteSpace: true, message: this.$t("table.pleaseInput") + '部门名称'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'},
                        {validator: validateWhiteSpace, trigger: 'blur'}
                    ],
                    shortName: [
                        {required: true, whiteSpace: true, message: this.$t("table.pleaseInput") + '部门简称'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'},
                        {validator: validateWhiteSpace, trigger: 'blur'}
                    ],
                    code: [
                        {required: true, whiteSpace: true, message: this.$t("table.pleaseInput") + '部门编码'}
                        ,
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'},
                        {validator: validateWhiteSpace, trigger: 'blur'}
                    ],
                    parentId: [
                        {required: true, message: this.$t("table.pleaseInput") + '上级部门编号'}
                    ],
                    sortNo: [
                        {required: true, message: this.$t("table.pleaseInput") + '排序号'}
                    ],
                    remark: [
                        {min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur'}
                    ]
                },
                lastExpanded: undefined,
                tableReset: false
            }
        },
        created() {
            this.$store.state.common.selectSiteDisplay = false;
            this.reloadList();
        },
        computed: {
            departmentTreePosition: {
                get() {
                    if (this.department.treePosition) {
                        return this.department.treePosition.substr(1).split('&')
                    }
                },
                set(v) {
                    if (v.length > 0) {
                        this.department.parentId = v[v.length - 1];
                        this.department.treePosition = '&' + v.join('&');
                    } else {
                        this.department.parentId = 0;
                        this.department.treePosition = undefined;
                    }
                }
            },
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
                    create: this.permission.department_create,
                    update: this.permission.department_update,
                    delete: this.permission.department_delete
                };
            }
        },
        methods: {
            reloadList() {
                this.listLoading = true;
                getDepartmentTree().then(response => {
                    this.tableReset = false;
                    this.departmentList = response.data;
                    if (this.lastExpanded) {
                        this.departmentList = setExpanded(this.departmentList, this.lastExpanded);
                    }
                    this.$nextTick(() => {
                        this.tableReset = true
                    })
                    this.listLoading = false;
                })
            },
            getDepartmentCascader(id) {
                this.submitLoading = true;
                getDepartmentCascader(id).then(response => {
                    this.submitLoading = false;
                    this.departmentCascader = response.data;
                })
            },
            handleSelectionChange(rows) {
                this.selectedRows = rows;
            },
            btnCreate(row) {
                this.resetDepartment();
                if (row.id) {
                    if (row.treePosition != null) {
                        this.department.treePosition = row.treePosition + "&" + row.id;
                    } else {
                        this.department.treePosition = "&" + row.id;
                    }
                    this.department.parentId = row.id;
                } else {
                    if (this.selectedRows.length == 1) {
                        if (this.selectedRows[0].treePosition != null) {
                            this.department.treePosition = this.selectedRows[0].treePosition + "&" + this.selectedRows[0].id;
                        } else {
                            this.department.treePosition = "&" + this.selectedRows[0].id;
                        }
                        this.department.parentId = this.selectedRows[0].id;
                    } else {
                        this.department.parentId = 0
                    }
                }
                getNextSortNo().then(response=> {
                    this.$nextTick(()=>{
                        this.department.sortNo = response.data;
                    });
                });
                this.getDepartmentCascader(null);
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row) {
                this.resetDepartment();
                if (row.id) {
                    this.department = deepClone(row);
                } else {
                    this.department = deepClone(this.selectedRows[0]);
                }
                this.getDepartmentCascader(this.department.id);
                this.dialogTitle = 'update';
                this.dialogVisible = true;
            },
            btnDelete(row) {
                let ids = [];
                if (row.id) {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        ids.push(row.id);
                        this.lastExpanded = row.treePosition;
                        this.doDelete(ids);
                    })
                } else {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                            this.lastExpanded = deleteRow.treePosition;
                        }
                        this.doDelete(ids);
                    })
                }
            },
            doCreate() {
                this.$refs['departmentDialogForm'].validate(valid => {
                    if (valid) {
                        this.submitLoading = true;
                        createOrUpdateDepartment(this.department).then(() => {
                            this.lastExpanded = this.department.treePosition;
                            this.resetDepartmentDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        }).catch(() => {
                            this.submitLoading = false;
                        })
                    } else {
                        return false;
                    }
                })
            },
            doUpdate() {
                this.$refs['departmentDialogForm'].validate(valid => {
                    if (valid) {
                        this.submitLoading = true;
                        createOrUpdateDepartment(this.department).then(() => {
                            this.lastExpanded = this.department.treePosition;
                            this.resetDepartmentDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        }).catch(() => {
                            this.submitLoading = false;
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids) {
                this.listLoading = true;
                delDepartments(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetDepartment() {
                this.department = {
                    id: undefined,
                    name: undefined,
                    shortName: undefined,
                    code: undefined,
                    parentId: undefined,
                    treePosition: undefined,
                    sortNo: undefined
                }
            },
            resetDepartmentDialogAndList() {
                this.closeDepartmentDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeDepartmentDialog() {
                this.dialogVisible = false;
                this.resetDepartment();
                this.$refs['departmentDialogForm'].resetFields()
            }
        }
    }
</script>


