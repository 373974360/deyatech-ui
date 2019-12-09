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
        <el-table :data="pageTypeList" v-loading.body="listLoading" stripe border highlight-current-row
                  @selection-change="handleSelectionChange" v-if="tableReset">
            <el-table-column type="selection" width="50" align="center"/>
            <el-table-tree-column fixed :expand-all="false" child-key="children" levelKey="level" :indent-size="10"
                                  parentKey="parentId" prop="name" label="名称">
                <template slot-scope="scope">
                    <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                </template>
            </el-table-tree-column>
            <el-table-column align="center" label="排序号" prop="sortNo" width="90"/>
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
                               @click.stop.safe="btnCreate(scope.row)" :disabled="scope.row.count > 0"></el-button>
                    <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                               @click.stop.safe="btnUpdate(scope.row)"></el-button>
                    <el-button v-if="btnEnable.delete" :title="$t('table.delete')" type="danger" icon="el-icon-delete" :size="btnSize" circle
                               @click.stop.safe="btnDelete(scope.row)" :disabled="scope.row.count > 0"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible"
                   :close-on-click-modal="closeOnClickModal" @close="closePageTypeDialog">
            <el-form ref="pageTypeDialogForm" class="deyatech-form" :model="pageType" label-position="right"
                     label-width="80px" :rules="pageTypeRules">
                <el-row :gutter="20" :span="24">
                    <el-col :span="12">
                        <el-form-item :label="$t('table.parent')" prop="parentId">
                            <el-cascader filterable :options="pageTypeCascader" v-model.trim="pageTypeTreePosition"
                                         show-all-levels expand-trigger="click" clearable
                                         change-on-select style="width: 100%;"></el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('table.searchName')" prop="name">
                            <el-input v-model.trim="pageType.name"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" :span="24">
                    <el-col :span="12">
                        <el-form-item label="排序号" prop="sortNo">
                            <el-input v-model.trim="pageType.sortNo"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" :span="24">
                    <el-col :span="24">
                        <el-form-item :label="$t('table.remark')">
                            <el-input type="textarea" v-model.trim="pageType.remark" :rows="3"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                <el-button :size="btnSize" @click="closePageTypeDialog">{{$t('table.cancel')}}</el-button>
            </span>
        </el-dialog>
    </basic-container>
</template>

<script>
    import {
        getPageTypeTree,
        getPageTypeCascader,
        createOrUpdatePageType,
        delPageTypes,
        getNextSortNo,
        checkPageExist} from '@/api/generate/pageType';
    import {deepClone, setExpanded} from '@/util/util';
    import {mapGetters} from 'vuex';

    export default {
        name: 'pageType',
        data() {
            const validateParentId = (rule, value, callback) => {
                if (this.pageType.id && this.pageType.id === value) {
                    callback(new Error('不能添加自己'));
                    return;
                }
                checkPageExist(value).then(response => {
                    if (response.data) {
                        callback(new Error('当前分类下已存在页面，不能添加分类'))
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
                pageTypeList: undefined,
                listLoading: true,
                listQuery: {
                    siteId: this.$store.state.common.siteId
                },
                pageType: {
                    id: undefined,
                    parentId: 0,
                    treePosition: undefined,
                    sortNo: undefined,
                    siteId: this.$store.state.common.siteId,
                    name: undefined
                },
                pageTypeCascader: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                selectedRows: [],
                pageTypeRules: {
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
                tableReset: false
            }
        },
        created() {
            this.$store.state.common.selectSiteDisplay = true;
            if(this.$store.state.common.siteId != undefined){
                this.reloadList();
            }
        },
        computed: {
            pageTypeTreePosition: {
                get() {
                    if (this.pageType.treePosition) {
                        return this.pageType.treePosition.substr(1).split('&');
                    }
                },
                set(v) {
                    if (v && v.length > 0) {
                        this.pageType.parentId = v[v.length - 1];
                        this.pageType.treePosition = '&' + v.join('&');
                    } else {
                        this.pageType.parentId = 0;
                        this.pageType.treePosition = undefined;
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
                    create: this.permission.pageType_create,
                    update: this.permission.pageType_update,
                    delete: this.permission.pageType_delete
                };
            }
        },
        methods: {
            reloadList(){
                this.listLoading = true;
                getPageTypeTree(this.listQuery).then(response => {
                    this.tableReset = false;
                    this.pageTypeList = response.data;
                    if (this.lastExpanded) {
                        this.pageTypeList = setExpanded(this.pageTypeList, this.lastExpanded);
                    }
                    this.$nextTick(() => {
                        this.tableReset = true
                    });
                    this.listLoading = false;
                })
            },
            getPageTypeCascader(id){
                this.submitLoading = true;
                getPageTypeCascader(id).then(response => {
                    this.submitLoading = false;
                    this.pageTypeCascader = response.data;
                })
            },
            handleSelectionChange(rows){
                this.selectedRows = rows;
            },
            btnCreate(row){
                this.resetPageType();
                if (row.id) {
                    if(row.treePosition != null){
                        this.pageType.treePosition = row.treePosition + "&" + row.id;
                    }else{
                        this.pageType.treePosition = "&" + row.id;
                    }
                    this.pageType.parentId = row.id;
                } else {
                    if (this.selectedRows.length == 1) {
                        if(this.selectedRows[0].treePosition != null){
                            this.pageType.treePosition = this.selectedRows[0].treePosition + "&" + this.selectedRows[0].id;
                        }else{
                            this.pageType.treePosition = "&" + this.selectedRows[0].id;
                        }
                        this.pageType.parentId = this.selectedRows[0].id;
                    }
                }
                getNextSortNo(this.pageType.parentId).then(response=> {
                    this.$nextTick(()=>{
                        this.pageType.sortNo = response.data;
                    });
                });
                this.pageType.children = undefined;
                this.getPageTypeCascader(this.pageType.parentId);
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetPageType();
                if (row.id) {
                    this.pageType = deepClone(row);
                } else {
                    this.pageType = deepClone(this.selectedRows[0]);
                }
                this.pageType.children = undefined;
                this.getPageTypeCascader(this.pageType.id);
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
                this.$refs['pageTypeDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdatePageType(this.pageType).then(() => {
                            this.lastExpanded = this.pageType.treePosition;
                            this.resetPageTypeDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doUpdate(){
                this.$refs['pageTypeDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdatePageType(this.pageType).then(() => {
                            this.lastExpanded = this.pageType.treePosition;
                            this.resetPageTypeDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delPageTypes(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetPageType(){
                this.pageType = {
                    id: undefined,
                    parentId: 0,
                    treePosition: undefined,
                    sortNo: undefined,
                    siteId: this.$store.state.common.siteId,
                    name: undefined
                }
            },
            resetPageTypeDialogAndList(){
                this.closePageTypeDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closePageTypeDialog() {
                this.dialogVisible = false;
                this.resetPageType();
                this.$refs['pageTypeDialogForm'].resetFields();
            }
        }
    }
</script>


