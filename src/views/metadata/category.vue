<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-menu">
                <div class="deyatech-menu_left">
                    <el-button v-if="btnEnable.create" type="primary" :size="btnSize" @click="btnCreate" :disabled="selectedRows.length > 1 || dataCount > 0">{{$t('table.create')}}</el-button>
                    <el-button v-if="btnEnable.update" type="primary" :size="btnSize" @click="btnUpdate" :disabled="selectedRows.length != 1">{{$t('table.update')}}</el-button>
                    <el-button v-if="btnEnable.delete" type="danger" :size="btnSize" @click="btnDelete" :disabled="selectedRows.length < 1 || dataCount > 0">{{$t('table.delete')}}</el-button>
                </div>
                <div class="deyatech-menu_right">
                    <!--<el-button type="primary" icon="el-icon-edit" :size="btnSize" circle @click="btnUpdate"></el-button>
                    <el-button type="danger" icon="el-icon-delete" :size="btnSize" circle @click="btnDelete"></el-button>-->
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                </div>
            </div>
        </div>

        <el-table :data="metadataCategoryList" v-loading.body="listLoading" stripe border highlight-current-row
                  @selection-change="handleSelectionChange" v-if="tableReset">
            <el-table-column type="selection" width="50" align="center"/>
            <el-table-tree-column fixed :expand-all="false" child-key="children" levelKey="level" :indent-size="20"
                                  parentKey="parentId" prop="name" label="名称">
                <template slot-scope="scope">
                    <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                </template>
            </el-table-tree-column>
            <el-table-column align="center" label="排序" prop="sortNo" width="90"/>
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
                               @click.stop.safe="btnCreate(scope.row)" :disabled="scope.row.dataCount > 0"></el-button>
                    <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                               @click.stop.safe="btnUpdate(scope.row)"></el-button>
                    <el-button v-if="btnEnable.delete" :title="$t('table.delete')" type="danger" icon="el-icon-delete" :size="btnSize" circle
                               @click.stop.safe="btnDelete(scope.row)" :disabled="scope.row.dataCount > 0"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible"
                   :close-on-click-modal="closeOnClickModal" @close="closeMetadataCategoryDialog">
            <el-form ref="metadataCategoryDialogForm" class="deyatech-form" :model="metadataCategory" label-position="right"
                     label-width="80px" :rules="metadataCategoryRules">
                <el-row :gutter="20" :span="24">
                    <el-col :span="12">
                        <el-form-item :label="$t('table.parent')" prop="parentId">
                            <el-cascader filterable :options="metadataCategoryCascader" v-model.trim="metadataCategoryTreePosition"
                                         show-all-levels expand-trigger="click" clearable
                                         change-on-select style="width: 100%;"></el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('table.searchName')" prop="name">
                            <el-input v-model.trim="metadataCategory.name" maxlength="30"/>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20" :span="24">
                    <el-col :span="12">
                        <el-form-item label="排序" prop="sortNo">
                            <el-input v-model.trim="metadataCategory.sortNo" maxlength="3"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" :span="24">
                    <el-col :span="24">
                        <el-form-item :label="$t('table.remark')">
                            <el-input type="textarea" v-model.trim="metadataCategory.remark" :rows="3" maxlength="500"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                <el-button :size="btnSize" @click="closeMetadataCategoryDialog">{{$t('table.cancel')}}</el-button>
            </span>
        </el-dialog>
    </basic-container>
</template>

<script>
    import {
        getMetadataCategoryTree,
        getMetadataCategoryCascader,
        createOrUpdateMetadataCategory,
        delMetadataCategorys,
        getNextSortNo,
        checkMetadataExist
    } from '../../api/metadata/category';
    import {deepClone, setExpanded} from '@/util/util';
    import {mapGetters} from 'vuex';

    export default {
        name: 'metadataCategory',
        data() {
            const validateParentId = (rule, value, callback) => {
                if (this.metadataCategory.id && this.metadataCategory.id === value) {
                    callback(new Error('不能添加自己'));
                    return;
                }
                checkMetadataExist(value).then(response => {
                    if (response.data) {
                        callback(new Error('当前分类下已存在元数据，不能添加分类'))
                    } else {
                        callback()
                    }
                })
            };
            const checkSortNo = (rule, value, callback) => {
                if (/[^\d]/g.test(value)) {
                    callback(new Error('请输入正整数'));
                } else {
                    callback();
                }
            };
            return {
                metadataCategoryList: undefined,
                listLoading: true,
                metadataCategory: {
                    id: undefined,
                    name: undefined,
                    parentId: 0,
                    treePosition: undefined,
                    sortNo: undefined
                },
                metadataCategoryCascader: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                selectedRows: [],
                metadataCategoryRules: {
                    name: [
                        {required: true, message: this.$t("table.pleaseInput") + '名称'}
                    ],
                    parentId: [
                        {validator: validateParentId, trigger: 'change'}
                    ],
                    sortNo: [
                        {required: true, message: this.$t("table.pleaseInput") + '排序'},
                        {validator: checkSortNo, trigger: ['blur','change']}
                    ]
                },
                lastExpanded: undefined,
                tableReset: false,
                dataCount: 0
            }
        },
        created() {
            this.reloadList();
        },
        computed: {
            metadataCategoryTreePosition: {
                get() {
                    if (this.metadataCategory.treePosition) {
                        return this.metadataCategory.treePosition.substr(1).split('&');
                    }
                },
                set(v) {
                    if (v && v.length > 0) {
                        this.metadataCategory.parentId = v[v.length - 1];
                        this.metadataCategory.treePosition = '&' + v.join('&');
                    } else {
                        this.metadataCategory.parentId = 0;
                        this.metadataCategory.treePosition = undefined;
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
                    create: this.permission.metadataCategory_create,
                    update: this.permission.metadataCategory_update,
                    delete: this.permission.metadataCategory_delete
                };
            }
        },
        methods: {
            reloadList(){
                this.listLoading = true;
                getMetadataCategoryTree().then(response => {
                    this.tableReset = false;
                    this.metadataCategoryList = response.data;
                    if (this.lastExpanded) {
                        this.metadataCategoryList = setExpanded(this.metadataCategoryList, this.lastExpanded);
                    }
                    this.$nextTick(() => {
                        this.tableReset = true
                    });
                    this.listLoading = false;
                })
            },
            getMetadataCategoryCascader(id){
                this.submitLoading = true;
                getMetadataCategoryCascader(id).then(response => {
                    this.submitLoading = false;
                    this.metadataCategoryCascader = response.data;
                })
            },
            handleSelectionChange(rows){
                this.selectedRows = rows;
                this.dataCount = 0;
                for(let r of rows) {
                    this.dataCount += r.dataCount;
                }
            },
            btnCreate(row){
                if (row.id) {
                    checkMetadataExist(row.id).then(response => {
                        if (response.data) {
                            this.$message.warning('当前分类下已存在元数据，不能添加分类');
                        } else {
                            this.btnCreate2(row);
                        }
                    })
                } else {
                    this.btnCreate2(row);
                }
            },
            btnCreate2(row) {
                this.resetMetadataCategory();
                if (row.id) {
                    if(row.treePosition != null){
                        this.metadataCategory.treePosition = row.treePosition + "&" + row.id;
                    }else{
                        this.metadataCategory.treePosition = "&" + row.id;
                    }
                    this.metadataCategory.parentId = row.id;
                } else {
                    if (this.selectedRows.length == 1) {
                        if(this.selectedRows[0].treePosition != null){
                            this.metadataCategory.treePosition = this.selectedRows[0].treePosition + "&" + this.selectedRows[0].id;
                        }else{
                            this.metadataCategory.treePosition = "&" + this.selectedRows[0].id;
                        }
                        this.metadataCategory.parentId = this.selectedRows[0].id;
                    }
                }
                getNextSortNo().then(response=> {
                    this.$nextTick(()=>{
                        this.metadataCategory.sortNo = response.data;
                    });
                });
                this.metadataCategory.children = undefined;
                this.getMetadataCategoryCascader(null);
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetMetadataCategory();
                if (row.id) {
                    this.metadataCategory = deepClone(row);
                } else {
                    this.metadataCategory = deepClone(this.selectedRows[0]);
                }
                this.metadataCategory.children = undefined;
                this.getMetadataCategoryCascader(this.metadataCategory.id);
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
                this.$refs['metadataCategoryDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateMetadataCategory(this.metadataCategory).then(() => {
                            this.lastExpanded = this.metadataCategory.treePosition;
                            this.resetMetadataCategoryDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doUpdate(){
                this.$refs['metadataCategoryDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateMetadataCategory(this.metadataCategory).then(() => {
                            this.lastExpanded = this.metadataCategory.treePosition;
                            this.resetMetadataCategoryDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delMetadataCategorys(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetMetadataCategory(){
                this.metadataCategory = {
                    id: undefined,
                    name: undefined,
                    parentId: 0,
                    treePosition: undefined,
                    sortNo: undefined
                }
            },
            resetMetadataCategoryDialogAndList(){
                this.closeMetadataCategoryDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeMetadataCategoryDialog() {
                this.dialogVisible = false;
                this.resetMetadataCategory();
                this.$refs['metadataCategoryDialogForm'].resetFields();
            }
        }
    }
</script>


