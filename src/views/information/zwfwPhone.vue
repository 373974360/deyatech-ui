<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-menu">
                <div class="deyatech-menu_left">
                    <el-button v-if="btnEnable.create" type="primary" :size="btnSize" @click="btnCreate">
                        {{$t('table.create')}}
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
            <el-table :data="zwfwPhoneList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange"   v-if="tableReset">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-tree-column fixed :expand-all="false" child-key="children" levelKey="level" :indent-size="20"
                                      parentKey="parentId" prop="name" label="服务名称" width="200">
                    <template slot-scope="scope">
                        <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                    </template>
                </el-table-tree-column>
                <el-table-column align="center" label="电话" prop="phone"/>
                <el-table-column align="center" label="地址" prop="address"/>
                <el-table-column align="center" label="排序号" prop="sortNo"/>
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
                       :close-on-click-modal="closeOnClickModal" @close="closeZwfwPhoneDialog">
                <el-form ref="zwfwPhoneDialogForm" class="deyatech-form" :model="zwfwPhone" label-position="right"
                         label-width="80px" :rules="zwfwPhoneRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="上级服务">
                                <el-cascader :options="zwfwPhoneCascader" v-model="zwfwPhoneTreePosition"
                                             show-all-levels expand-trigger="click" clearable
                                             change-on-select></el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="服务名称" prop="name">
                                <el-input v-model.trim="zwfwPhone.name"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="电话" prop="phone">
                                <el-tooltip class="item" effect="dark" content="多个号码用,隔开" placement="top-start">
                                <el-input  type="textarea" v-model.trim="zwfwPhone.phone"  :rows="3"></el-input>
                                </el-tooltip>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="地址" prop="address">
                                <el-input v-model.trim="zwfwPhone.address"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="排序号" prop="sortNo">
                                <el-input-number v-model="zwfwPhone.sortNo" :min="1" :max="9999"></el-input-number>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model.trim="zwfwPhone.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeZwfwPhoneDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {
        getZwfwPhoneTree,
        createOrUpdateZwfwPhone,
        delZwfwPhones,
        getZwfwPhoneCascader
    } from '@/api/information/zwfwPhone';
    import {mapGetters} from 'vuex';
    import {deepClone, setExpanded} from '@/util/util';

    export default {
        name: 'zwfwPhone',
        data() {
            return {
                zwfwPhoneList: undefined,
                total: undefined,
                listLoading: true,
                zwfwPhone: {
                    id: undefined,
                    name: undefined,
                    parentId: undefined,
                    treePosition: undefined,
                    phone: undefined,
                    address: undefined,
                    sortNo: 1
                },
                zwfwPhoneRules: {
                    name: [
                        {required: true, message: this.$t("table.pleaseInput") + '服务名称'}
                    ],
                    type: [
                        {required: true, message: this.$t("table.pleaseInput") + '上级服务编号'}
                    ],
                    phone: [
                        {required: false, message: this.$t("table.pleaseInput") + '电话'}
                    ],
                    address: [
                        {required: false, message: this.$t("table.pleaseInput") + '地址'}
                    ],
                    sortNo: [
                        {required: false, message: this.$t("table.pleaseInput") + '排序号'}
                    ]
                },
                zwfwPhoneCascader: [],
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                lastExpanded: undefined,
                tableReset: false
            }
        },
        computed: {
            zwfwPhoneTreePosition: {
                get() {
                    if (this.zwfwPhone.treePosition) {
                        return this.zwfwPhone.treePosition.substr(1).split('&')
                    }
                },
                set(v) {
                    if (v.length > 0) {
                        this.zwfwPhone.parentId = v[v.length - 1];
                        this.zwfwPhone.treePosition = '&' + v.join('&');
                    } else {
                        this.zwfwPhone.parentId = 0;
                        this.zwfwPhone.treePosition = undefined;
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
                    create: this.permission.zwfwPhone_create,
                    update: this.permission.zwfwPhone_update,
                    delete: this.permission.zwfwPhone_delete
                };
            }
        },
        created(){
            this.reloadList();
        },
        methods: {
            resetSearch(){
                this.listQuery.name = undefined;
            },
            reloadList(){
                this.listLoading = true;
                getZwfwPhoneTree().then(response => {
                    this.tableReset = false;
                    if (response.data) {
                        this.zwfwPhoneList = response.data;
                    }
                    if (this.lastExpanded) {
                        this.zwfwPhoneList = setExpanded(this.zwfwPhoneList, this.lastExpanded);
                    }
                    this.$nextTick(() => {
                        this.tableReset = true;
                    });
                    this.listLoading = false;
                })
            },

            getZwfwPhoneCascader(id) {
                this.submitLoading = true;
                getZwfwPhoneCascader(id).then(response => {
                    this.submitLoading = false;
                    this.zwfwPhoneCascader = response.data;
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
            btnCreate(row){
                this.resetZwfwPhone();

                if (row.id) {
                    if (row.treePosition != null) {
                        this.zwfwPhone.treePosition = row.treePosition + "&" + row.id;
                    } else {
                        this.zwfwPhone.treePosition = "&" + row.id;
                    }
                    this.zwfwPhone.parentId = row.id;
                } else {
                    if (this.selectedRows.length == 1) {
                        if (this.selectedRows[0].treePosition != null) {
                            this.zwfwPhone.treePosition = this.selectedRows[0].treePosition + "&" + this.selectedRows[0].id;
                        } else {
                            this.zwfwPhone.treePosition = "&" + this.selectedRows[0].id;
                        }
                        this.zwfwPhone.parentId = this.selectedRows[0].id;
                    } else {
                        this.zwfwPhone.parentId = 0
                    }
                }
                this.getZwfwPhoneCascader(null);
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetZwfwPhone();
                if (row.id) {
                    this.zwfwPhone = deepClone(row);
                } else {
                    this.zwfwPhone = deepClone(this.selectedRows[0]);
                }
                this.getZwfwPhoneCascader(this.zwfwPhone.id);
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
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                            this.lastExpanded = deleteRow.treePosition;
                        }
                        this.doDelete(ids);
                    })
                }
            },
            doCreate(){
                this.$refs['zwfwPhoneDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateZwfwPhone(this.zwfwPhone).then(() => {
                            this.lastExpanded = this.zwfwPhone.treePosition;
                            this.resetZwfwPhoneDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['zwfwPhoneDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateZwfwPhone(this.zwfwPhone).then(() => {
                            this.lastExpanded = this.zwfwPhone.treePosition;
                            this.resetZwfwPhoneDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delZwfwPhones(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetZwfwPhone(){
                this.zwfwPhone = {
                    id: undefined,
                    name: undefined,
                    parentId: undefined,
                    treePosition: undefined,
                    phone: undefined,
                    address: undefined,
                    sortNo: 1
                }
            },
            resetZwfwPhoneDialogAndList(){
                this.closeZwfwPhoneDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeZwfwPhoneDialog() {
                this.dialogVisible = false;
                this.resetZwfwPhone();
                this.$refs['zwfwPhoneDialogForm'].resetFields();
            }
        }
    }
</script>


