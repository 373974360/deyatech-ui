<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-menu">
                <div class="deyatech-menu_left">
                    <el-button v-if="btnEnable.create" type="primary" :size="btnSize" @click="btnCreate" :disabled="selectedRows.length > 1">{{$t('table.create')}}</el-button>
                    <el-button v-if="btnEnable.update" type="primary" :size="btnSize" @click="btnUpdate" :disabled="selectedRows.length != 1">{{$t('table.update')}}</el-button>
                    <el-button v-if="btnEnable.delete" type="danger" :size="btnSize" @click="btnDelete" :disabled="selectedRows.length < 1">{{$t('table.delete')}}</el-button>
                </div>
                <div class="deyatech-menu_right">
                    <!--<el-button type="primary" icon="el-icon-edit" :size="btnSize" circle @click="btnUpdate"></el-button>
                    <el-button type="danger" icon="el-icon-delete" :size="btnSize" circle @click="btnDelete"></el-button>-->
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                </div>
            </div>
        </div>

        <el-table :data="garrisonDepartmentList" v-loading.body="listLoading" stripe border highlight-current-row
                  @selection-change="handleSelectionChange" v-if="tableReset">
            <el-table-column type="selection" width="50" align="center"/>
            <el-table-tree-column fixed :expand-all="false" child-key="children" levelKey="level" :indent-size="20"
                                  parentKey="parentId" prop="name" label="进驻部门名称">
                <template slot-scope="scope">
                    <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                </template>
            </el-table-tree-column>
<!--            <el-table-column align="center" label="上级部门编号" prop="parentId"/>-->
<!--            <el-table-column align="center" label="树结构中的索引位置" prop="treePosition"/>-->
            <el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                        {{scope.row.enable | enums('EnableEnum')}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="150">
                <template slot-scope="scope">
                    <el-button v-if="btnEnable.create" :title="$t('table.create')" type="primary" icon="el-icon-plus" :size="btnSize" circle
                               @click.stop.safe="btnCreate(scope.row)"></el-button>
                    <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                               @click.stop.safe="btnUpdate(scope.row)"></el-button>
                    <el-button v-if="btnEnable.delete" :title="$t('table.delete')" type="danger" icon="el-icon-delete" :size="btnSize" circle
                               @click.stop.safe="btnDelete(scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible"
                   :close-on-click-modal="closeOnClickModal" @close="closeGarrisonDepartmentDialog">
            <el-form ref="garrisonDepartmentDialogForm" class="deyatech-form" :model="garrisonDepartment" label-position="right"
                     label-width="80px" :rules="garrisonDepartmentRules">
                <el-row :gutter="20" :span="24">
                    <el-col :span="12">
                        <el-form-item :label="$t('table.parent')">
                            <el-cascader :options="garrisonDepartmentCascader" v-model.trim="garrisonDepartmentTreePosition"
                                         :show-all-levels="false" expand-trigger="hover" clearable
                                         change-on-select></el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('table.searchName')" prop="name">
                            <el-input v-model.trim="garrisonDepartment.name"/>
                        </el-form-item>
                    </el-col>
                </el-row>

                <!--<el-row :gutter="20" :span="24">
                    <el-col :span="12">
                        <el-form-item label="树结构中的索引位置" prop="treePosition">
                            <el-input v-model.trim="garrisonDepartment.treePosition"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>-->
                <el-row :gutter="20" :span="24">
                    <el-col :span="24">
                        <el-form-item :label="$t('table.remark')" prop="remark">
                            <el-input type="textarea" v-model.trim="garrisonDepartment.remark" :rows="3"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                <el-button :size="btnSize" @click="closeGarrisonDepartmentDialog">{{$t('table.cancel')}}</el-button>
            </span>
        </el-dialog>
    </basic-container>
</template>

<script>
    import {
        getGarrisonDepartmentTree,
        getGarrisonDepartmentCascader,
        createOrUpdateGarrisonDepartment,
        delGarrisonDepartments} from '@/api/appraise/garrisonDepartment';
    import {deepClone, setExpanded} from '@/util/util';
    import {mapGetters} from 'vuex';
    import {isStartOrEndWithWhiteSpace} from '@/util/validate';
    export default {
        name: 'garrisonDepartment',
        data() {
            const validateWhiteSpace = (rule, value, callback) => {
                if (isStartOrEndWithWhiteSpace(value)) {
                    callback(new Error(this.$t("errorMsg.blankSpace")));
                    return;
                }
                callback();
            };
            return {
                garrisonDepartmentList: undefined,
                listLoading: true,
                garrisonDepartment: {
                    id: undefined,
                    name: undefined,
                    parentId: undefined,
                    treePosition: undefined,
                    remark: undefined,
                },
                garrisonDepartmentCascader: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                selectedRows: [],
                garrisonDepartmentRules: {
                    name: [
                        {required: true, whiteSpace: true, message: this.$t("table.pleaseInput") + '进驻部门名称'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'},
                        {validator: validateWhiteSpace, trigger: 'blur'}
                    ],
                    parentId: [
                        {required: true, message: this.$t("table.pleaseInput") + '上级部门编号'}
                    ],
                    treePosition: [
                        {required: true, message: this.$t("table.pleaseInput") + '树结构中的索引位置'}
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
            this.reloadList();
        },
        computed: {
            garrisonDepartmentTreePosition: {
                get() {
                    if (this.garrisonDepartment.treePosition) {
                        return this.garrisonDepartment.treePosition.substr(1).split('&');
                    }
                },
                set(v) {
                    if (v.length > 0) {
                        this.garrisonDepartment.parentId = v[v.length - 1];
                        this.garrisonDepartment.treePosition = '&' + v.join('&');
                    } else {
                        this.garrisonDepartment.parentId = 0;
                        this.garrisonDepartment.treePosition = undefined;
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
                    create: this.permission.garrisonDepartment_create,
                    update: this.permission.garrisonDepartment_update,
                    delete: this.permission.garrisonDepartment_delete
                };
            }
        },
        methods: {
            reloadList(){
                this.listLoading = true;
                getGarrisonDepartmentTree().then(response => {
                    this.tableReset = false;
                    this.garrisonDepartmentList = response.data;
                    if (this.lastExpanded) {
                        this.garrisonDepartmentList = setExpanded(this.garrisonDepartmentList, this.lastExpanded);
                    }
                    this.$nextTick(() => {
                        this.tableReset = true
                    });
                    this.listLoading = false;
                })
            },
            getGarrisonDepartmentCascader(id){
                this.submitLoading = true;
                getGarrisonDepartmentCascader(id).then(response => {
                    this.submitLoading = false;
                    this.garrisonDepartmentCascader = response.data;
                })
            },
            handleSelectionChange(rows){
                this.selectedRows = rows;
            },
            btnCreate(row){
                this.resetGarrisonDepartment();
                if (row.id) {
                    if(row.treePosition != null){
                        this.garrisonDepartment.treePosition = row.treePosition + "&" + row.id;
                    }else{
                        this.garrisonDepartment.treePosition = "&" + row.id;
                    }
                    this.garrisonDepartment.parentId = row.id;
                } else {
                    if (this.selectedRows.length == 1) {
                        if(this.selectedRows[0].treePosition != null){
                            this.garrisonDepartment.treePosition = this.selectedRows[0].treePosition + "&" + this.selectedRows[0].id;
                        }else{
                            this.garrisonDepartment.treePosition = "&" + this.selectedRows[0].id;
                        }
                        this.garrisonDepartment.parentId = this.selectedRows[0].id;
                    } else {
                        this.garrisonDepartment.parentId = 0
                    }
                }
                // this.garrisonDepartment.children = undefined;
                this.getGarrisonDepartmentCascader(null);
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetGarrisonDepartment();
                if (row.id) {
                    this.garrisonDepartment = deepClone(row);
                } else {
                    this.garrisonDepartment = deepClone(this.selectedRows[0]);
                }
                // this.garrisonDepartment.children = undefined;
                this.getGarrisonDepartmentCascader(this.garrisonDepartment.id);
                this.dialogTitle = 'update';
                this.dialogVisible = true;
            },
            btnDelete(row){
                let ids = [];
                if (row.id) {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        ids.push(row.id);
                        this.lastExpanded = row.treePosition;
                        this.doDelete(ids);
                    })
                } else {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        for(const deleteRow of this.selectedRows) {
                            this.lastExpanded = deleteRow.treePosition;
                            ids.push(deleteRow.id);
                        }
                        this.doDelete(ids);
                    })
                }
            },
            doCreate(){
                this.$refs['garrisonDepartmentDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateGarrisonDepartment(this.garrisonDepartment).then(() => {
                            this.lastExpanded = this.garrisonDepartment.treePosition;
                            this.resetGarrisonDepartmentDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        }).catch(() => {
                            this.submitLoading = false;
                        })
                    } else {
                        return false;
                    }
                })
            },
            doUpdate(){
                this.$refs['garrisonDepartmentDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateGarrisonDepartment(this.garrisonDepartment).then(() => {
                            this.lastExpanded = this.garrisonDepartment.treePosition;
                            this.resetGarrisonDepartmentDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        }).catch(() => {
                            this.submitLoading = false;
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delGarrisonDepartments(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetGarrisonDepartment(){
                this.garrisonDepartment = {
                    id: undefined,
                    name: undefined,
                    parentId: undefined,
                    treePosition: undefined,
                    remark: undefined,
                }
            },
            resetGarrisonDepartmentDialogAndList(){
                this.closeGarrisonDepartmentDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeGarrisonDepartmentDialog() {
                this.dialogVisible = false;
                this.resetGarrisonDepartment();
                this.$refs['garrisonDepartmentDialogForm'].resetFields();
            }
        }
    }
</script>


