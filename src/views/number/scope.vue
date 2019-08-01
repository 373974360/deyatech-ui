<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.searchName')" v-model.trim="listQuery.prefix"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="searchReloadList">{{$t('table.search')}}</el-button>
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
            <el-table :data="scopeList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="叫号前缀" prop="prefix"/>
                <el-table-column align="center" label="起始号码" prop="start"/>
                <el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                            {{scope.row.enable | enums('EnableEnum')}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="200">
                    <template slot-scope="scope">
                        <el-button  v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                                   @click.stop.safe="btnUpdate(scope.row)"></el-button>
                        <el-badge class="badge" :value="scope.row.scopeItemCount == 0 ? undefined : scope.row.scopeItemCount" type="primary">
                            <el-button v-if="btnEnable.ScopeItems" title="关联事项" type="primary" icon="iconcaidan1"
                                       :size="btnSize" circle @click.stop.safe="btnScopeItems(scope.row)"></el-button>
                        </el-badge>
                        <el-button class="badge" v-if="btnEnable.delete" :title="$t('table.delete')" type="danger" icon="el-icon-delete" :size="btnSize" circle
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
                       :close-on-click-modal="closeOnClickModal" @close="closeScopeDialog">
                <el-form ref="scopeDialogForm" class="deyatech-form" :model="scope" label-position="right"
                         label-width="80px" :rules="scopeRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="叫号前缀" prop="prefix">
                                <el-input v-model.trim="scope.prefix"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="起始号码" prop="start">
                                <el-input v-model.trim="scope.start"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model="scope.remark" :rows="3"
                                          maxlength="200"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>

                    <el-button :size="btnSize" @click="closeScopeDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>

            <!-- 关联事项 -->

            <el-dialog :title="titleMap['associateItem']" :visible.sync="dialogScopeItemVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeScopeItemDialog">
                <div v-loading="dialogFormLoading">
                    <div class="dialog-search">
                        <el-input v-model.trim="itemListQuery.itemName" class="dialog-search-item dialog-keywords"
                                  clearable :size="searchSize" placeholder="事项名称"></el-input>
                        <el-button type="primary" :size="searchSize" icon="el-icon-search" @click="reloadItemList">{{$t('table.search')}}</el-button>
                        <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}</el-button>
                    </div>
                    <div class="dialog-search">
                        <el-checkbox v-model="showRelatedFlag" @change="handleItemShowRelated">只显示已关联事项</el-checkbox>
                    </div>
                    <div>
                        <el-table ref="scopeItemTable" :data="itemList" border @select="selectRowItem"
                                  @select-all="selectAllItem" @selection-change="handleSelectionChangeScopeItem">
                            <el-table-column type="selection" width="50" align="center"/>
                            <el-table-column align="center" label="事项名称" prop="itemName"/>
                            <el-table-column align="center" label="事项简称" prop="itemShortName"/>
                            <el-table-column align="center" label="事项编码" prop="itemCode"/>
                        </el-table>
                        <el-pagination class="deyatech-pagination pull-right" background
                                       :current-page.sync="itemListQuery.page" :page-sizes="this.$store.state.common.pageSize"
                                       :page-size="itemListQuery.size" :layout="this.$store.state.common.pageLayout" :total="itemTotal"
                                       @size-change="handleSizeChangeScopeItem" @current-change="handleCurrentChangeScopeItem">
                        </el-pagination>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" :size="btnSize" @click="doSaveScopeItem"
                               :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeScopeItemDialog">{{$t('table.cancel')}}</el-button>
                </div>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {getItemList, getAllScopeItem, setScopeItems} from "@/api/number/scopeItem";
    import {
        getScopeList,
        createOrUpdateScope,
        delScopes
    } from '@/api/number/scope';
    import {isStartOrEndWithWhiteSpace,validatenull} from '@/util/validate'
    export default {
        name: 'scope',
        data() {
            const validatePrefix = (rule,value,callback) => {
                if(isStartOrEndWithWhiteSpace(value)){
                    callback(new Error(this.$t("errorMsg.blankSpace")));
                    return;
                }
                callback();
            };
            const validateStart = (rule,value,callback) => {
                if(isStartOrEndWithWhiteSpace(value)){
                    callback(new Error(this.$t("errorMsg.blankSpace")));
                    return;
                }
                callback();
            };

            return {
                scopeList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    prefix: undefined,
                    name: undefined
                },
                scope: {
                    id: undefined,
                    prefix: undefined,
                    start: undefined
                },
                itemListQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    itemName: undefined,
                    scopeId: undefined
                },
                scopeRules: {
                    prefix: [
                        {required: true, message: this.$t("table.pleaseInput") + '叫号前缀'},
                        {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'},
                        {validator: validatePrefix, trigger: 'blur'}
                    ],
                    start: [
                        {required: true, message: this.$t("table.pleaseInput") + '起始号码'},
                        {min: 4, max: 4 , message: '只能为数字，且长度是4个字符', trigger: 'blur'},
                        {validator: validateStart, trigger: 'blur'}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                dialogFormLoading: false,
                selectAllItemId: [],
                itemList: [],
                itemTotal: 0,
                currentRow: undefined,
                showRelatedFlag: false,
                dialogScopeItemVisible: false
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
                    create: this.permission.scope_create,
                    update: this.permission.scope_update,
                    delete: this.permission.scope_delete,
                    ScopeItems: this.permission.scopeItem_manage
                };
            }
        },
        created(){
            this.reloadList();
        },
        methods: {
            resetSearch(){
                this.listQuery.prefix = undefined;
                this.itemListQuery.itemName = undefined;
            },
            searchReloadList(){
                this.listQuery.page = 1;
                this.reloadList();
            },
            reloadList(){
                this.listLoading = true;
                this.scopeList = undefined;
                this.total = undefined;
                getScopeList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.scopeList = response.data.records;
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
                this.resetScope();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetScope();
                if (row.id) {
                    this.scope = deepClone(row);
                } else {
                    this.scope = deepClone(this.selectedRows[0]);
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
                this.$refs['scopeDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateScope(this.scope).then(() => {
                            this.resetScopeDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['scopeDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateScope(this.scope).then(() => {
                            this.resetScopeDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delScopes(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetScope(){
                this.scope = {
                    id: undefined,
                    prefix: undefined,
                    start: undefined
                }
            },
            resetScopeDialogAndList(){
                this.closeScopeDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeScopeDialog() {
                this.dialogVisible = false;
                this.resetScope();
                this.$refs['scopeDialogForm'].resetFields();
            },

            handleSelectionChangeCategoryItem(rows) {
                this.selectedRowsItem = rows;
            },


            handleSelectionChangeScopeItem(rows) {
                this.selectedRowsUser = rows;
            },

            btnScopeItems(row) {
                this.currentRow = row;
                this.dialogScopeItemVisible = true;
                this.dialogFormLoading = true;
                this.selectAllItemId = [];
                this.loadScopeItem(row.id).then(res => {
                    if(res && res.length > 0) {
                        for (let ScopeItem of res) {
                            this.selectAllItemId.push(ScopeItem.itemId);
                        }
                        this.showRelatedFlag = true;
                        this.handleItemShowRelated(true);
                    } else {
                        this.showRelatedFlag = false;
                        this.handleItemShowRelated(false);
                    }
                });
            },
            loadScopeItem(scopeId) {
                let query = {scopeId}
                return new Promise((resolve, reject) => {
                    getAllScopeItem(query).then(response => {
                        resolve(response.data)
                    }).catch(err => {
                        reject(err)
                    })
                });
            },

            handleItemShowRelated(checked) {
                if (checked) {
                    this.itemListQuery.scopeId = this.currentRow.id;
                } else {
                    this.itemListQuery.scopeId = undefined;
                }
                this.reloadItemList();
            },

            reloadItemList() {
                this.handleCurrentChangeScopeItem(1)
            },
            handleCurrentChangeScopeItem(val) {
                this.itemListQuery.page = val;
                this.loadItemList().then(() => {
                    this.checkRelatedItemRows();
                });
            },
            loadItemList() {
                return new Promise((resolve, reject) => {
                    this.dialogFormLoading = true;
                    getItemList(this.itemListQuery).then(response => {
                        this.dialogFormLoading = false;
                        this.itemList = response.data.records;
                        this.itemTotal = response.data.total;
                        resolve();
                    }).catch(err => {
                        reject(err);
                    })
                });
            },
            checkRelatedItemRows() {
                this.$nextTick(() =>{
                    if (this.selectAllItemId && this.selectAllItemId.length > 0) {
                        for (let row of this.itemList) {
                            if (this.selectAllItemId.includes(row.itemId)) {
                                this.$refs['scopeItemTable'].toggleRowSelection(row,true)
                            }
                        }
                    }
                })
            },
            selectRowItem(selection, row) {
                let i = this.selectAllItemId.indexOf(row.itemId)
                if (i < 0) {
                    this.selectAllItemId.push(row.itemId)
                } else {
                    this.selectAllItemId.splice(i, 1)
                }
            },
            selectAllItem(selection) {
                if (selection.length > 0) {
                    for (let item of this.itemList) {
                        if (this.selectAllItemId.indexOf(item.itemId) < 0) {
                            this.selectAllItemId.push(item.itemId)
                        }
                    }
                } else {
                    for (let item of this.itemList) {
                        let i = this.selectAllItemId.indexOf(item.itemId)
                        if (i >= 0) {
                            this.selectAllItemId.splice(i, 1)
                        }
                    }
                }
            },

            handleSizeChangeScopeItem(val) {
                this.itemListQuery.size = val;
                this.loadItemList().then(() => {
                    this.checkRelatedItemRows();
                });
            },
            doSaveScopeItem() {
                this.submitLoading = true;
                setScopeItems(this.currentRow.id, this.selectAllItemId).then(() => {
                    this.closeScopeItemDialog();
                    this.$message.success(this.$t("table.updateSuccess"));
                    this.reloadList();
                }).catch(() => {
                    this.submitLoading = false;
                })
            },

            closeScopeItemDialog() {
                this.dialogScopeItemVisible = false;
                this.submitLoading = false;
            }
        }
    }
</script>

<style>
    .badge {
        margin-top: 10px;
        margin-bottom: 10px;
        margin-left: 15px;

    }
</style>
