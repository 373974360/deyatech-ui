<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.searchName')"
                                  v-model.trim="listQuery.name"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="reloadList">
                            {{$t('table.search')}}
                        </el-button>
                        <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
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
            <el-table :data="dictionaryIndexList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="left" label="名称" prop="name">
                    <template slot-scope="scope">
                        <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="left" label="索引" prop="key"/>
                <!--<el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                            {{scope.row.enable | enums('EnableEnum')}}
                        </el-tag>
                    </template>
                </el-table-column>-->
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center"
                                 width="150">
                    <template slot-scope="scope">
                        <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary"
                                   icon="el-icon-edit" :size="btnSize" circle
                                   @click.stop.safe="btnUpdate(scope.row)"></el-button>
                        <el-button v-if="btnEnable.dictionarymanager" title="子项目" type="success" icon="el-icon-plus" :size="btnSize"
                                   @click.stop.safe="btnDictionaryTree(scope.row)" circle></el-button>
                        <el-button v-if="btnEnable.delete" :title="$t('table.delete')" type="danger"
                                   icon="el-icon-delete" :size="btnSize" circle
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
                       :close-on-click-modal="closeOnClickModal">
                <el-form ref="dictionaryIndexDialogForm" class="deyatech-form" :model="dictionaryIndex"
                         label-position="right"
                         label-width="80px" :rules="dictionaryIndexRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="名称" prop="name">
                                <el-input v-model.trim="dictionaryIndex.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="索引" prop="key">
                                <el-input v-model.trim="dictionaryIndex.key"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model.trim="dictionaryIndex.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate"
                               :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="dialogVisible = false">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>

            <!-- 字典子项管理开始 -->
            <el-dialog title="字典管理" :visible.sync="dictionaryDialogVisible"
                       :close-on-click-modal="closeOnClickModal" style="padding-bottom: 20px;">
                <div class="deyatech-menu">
                    <div class="deyatech-menu_left">
                        <el-button v-if="btnEnable.create_d" type="primary" :size="btnSize" @click="btnDictionaryCreate">
                            {{$t('table.create')}}
                        </el-button>
                        <el-button v-if="btnEnable.update_d" type="primary" :size="btnSize" @click="btnDictionaryUpdate"
                                   :disabled="dictionarySelectedRows.length != 1 || !canEditable">{{$t('table.update')}}
                        </el-button>
                        <el-button v-if="btnEnable.delete_d" type="danger" :size="btnSize" @click="btnDictionaryDelete"
                                   :disabled="dictionarySelectedRows.length < 1">{{$t('table.delete')}}
                        </el-button>
                    </div>
                    <div class="deyatech-menu_right">
                        <!--<el-button type="primary" icon="el-icon-edit" :size="btnSize" circle @click="btnUpdate"></el-button>
                        <el-button type="danger" icon="el-icon-delete" :size="btnSize" circle @click="btnDelete"></el-button>-->
                        <el-button icon="el-icon-refresh" :size="btnSize" circle @click="dictionaryReloadList"></el-button>
                    </div>
                </div>
                <el-table :data="dictionaryList" v-loading.body="dictionaryListLoading" stripe border highlight-current-row
                          @selection-change="handleDictionarySelectionChange" v-if="tableReset">
                    <el-table-column type="selection" width="50" align="center"/>
                    <el-table-tree-column fixed :expand-all="false" child-key="children" levelKey="level" :indent-size="20" align="left"
                                          parentKey="parentId" prop="codeText" label="中文名称">
                        <template slot-scope="scope">
                            <span class="link-type">{{scope.row.codeText}}</span>
                        </template>
                    </el-table-tree-column>
                    <!--<el-table-column align="center" label="中文名称" prop="codeText"/>-->
                    <el-table-column align="left" label="英文代码" prop="code"/>
                    <el-table-column align="left" label="索引" prop="indexId"/>
                    <el-table-column align="center" label="是否可编辑" prop="editable">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.editable==1">可编辑</el-tag>
                            <el-tag type="info" v-else-if="scope.row.editable==2">不可编辑</el-tag>
                        </template>
                    </el-table-column>
                    <!--<el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                                {{scope.row.enable | enums('EnableEnum')}}
                            </el-tag>
                        </template>
                    </el-table-column>-->
                    <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="left"
                                     width="150">
                        <template slot-scope="scope">
                            <el-button v-if="btnEnable.create_d" :title="$t('table.create')" type="primary"
                                       icon="el-icon-plus" :size="btnSize" circle
                                       @click.stop.safe="btnDictionaryCreate(scope.row)"></el-button>

                            <el-button v-if="btnEnable.update_d" :title="$t('table.update')" type="primary"
                                       icon="el-icon-edit" :size="btnSize" circle :disabled="scope.row.editable==2"
                                       @click.stop.safe="btnDictionaryUpdate(scope.row)"></el-button>

                            <el-button v-if="btnEnable.delete_d" :title="$t('table.delete')" type="danger"
                                       icon="el-icon-delete" :size="btnSize" circle
                                       @click.stop.safe="btnDictionaryDelete(scope.row)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>

            <!-- 新增子项目 -->
            <el-dialog :title="dictionaryCreateDialogTitle" :visible.sync="dictionaryCreateDialogVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeDictionaryDialog">
                <el-form ref="dictionaryDialogForm" class="deyatech-form" :model="dictionary"
                         label-position="right"
                         label-width="80px" :rules="dictionaryRules">
                    <el-row :gutter="20" :span="24">
                        <el-row :gutter="20" :span="24">
                            <el-col :span="24">
                                <el-form-item label="上级字典" prop="parentId">
                                    <el-cascader filterable :options="dictionaryCascader"
                                                 v-model.trim="dictionaryTreePosition"
                                                 :props="{ checkStrictly: true }"
                                                 clearable style="width: 100%;" ></el-cascader>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-col :span="12">
                            <el-form-item label="中文名称" prop="codeText">
                                <el-input v-model.trim="dictionary.codeText"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="英文代码" prop="code">
                                <el-input v-model.trim="dictionary.code"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="排序" prop="sortNo">
                                <el-input-number v-model.trim="dictionary.sortNo" :min="1"></el-input-number>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="编辑选项" prop="editable">
                                <el-radio-group v-model.trim="dictionary.editable">
                                    <el-radio :label="1">可编辑</el-radio>
                                    <el-radio :label="2">不可编辑</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model.trim="dictionary.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dictionaryCreateDialogTitle=='新增'" type="primary" :size="btnSize" @click="doDictionaryCreate"
                               :loading="dictionarySubmitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doDictionaryUpdate" :loading="dictionarySubmitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeDictionaryDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone, setExpanded} from '@/util/util';
    import {validateLowerCase} from '@/util/validate';
    import {
        getDictionaryIndexList,
        createOrUpdateDictionaryIndex,
        delDictionaryIndexs
    } from '@/api/admin/dictionaryIndex';
    import {
        getDictionaryList,
        createOrUpdateDictionary,
        delDictionarys,
        getNextSortNo,
        getDictionaryTree,
        getDictionaryCascader
    } from '@/api/admin/dictionary';

    export default {
        name: 'dictionaryIndex',
        data() {
            const validateCode = (rule, value, callback) => {
                const reg = /^[a-z_]+$/
                if (!reg.test(value)) {
                    callback(new Error(''));
                } else {
                    callback();
                }
            };
            return {
                dictionaryCascader: [],
                tableReset: false,
                lastExpanded: undefined,
                dictionaryIndexList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined
                },
                dictionaryIndex: {
                    id: undefined,
                    key: undefined,
                    name: undefined
                },
                dictionaryIndexRules: {
                    key: [
                        {required: true, message: this.$t("table.pleaseInput") + '索引关键字'},
                        {validator: validateCode,message:'请输入小写英文字母(可用下划线分隔)',trigger:'blur'}
                    ],
                    name: [
                        {required: true, message: this.$t("table.pleaseInput") + '索引名称'}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,

                //字典子项目管理开始
                dictionaryIndexValues: undefined,
                dictionaryList: undefined,
                dictionaryListLoading: true,
                dictionaryListQuery: {
                    indexId: undefined
                },
                dictionary: {
                    id: undefined,
                    indexId: this.dictionaryIndexValues,
                    code: undefined,
                    codeText: undefined,
                    sortNo: 1,
                    editable: 1,
                    parentId: 0,
                    treePosition: '&'
                },
                dictionarySelectedRows: [],
                dictionaryDialogVisible: false,

                //新增字典子项
                dictionaryRules: {
                    indexId: [
                        {required: true, message: this.$t("table.pleaseInput") + '索引关键字'}
                    ],
                    code: [
                        {required: true, message: this.$t("table.pleaseInput") + '英文代码'},
                        {validator: validateCode,message:'请输入小写英文字母(可用下划线分隔)',trigger:'blur'}
                    ],
                    codeText: [
                        {required: true, message: this.$t("table.pleaseInput") + '中文名称'}
                    ],
                    sortNo: [
                        {required: true, message: this.$t("table.pleaseInput") + '排序'}
                    ]
                },
                dictionaryCreateDialogVisible: false,
                dictionaryCreateDialogTitle: undefined,
                dictionarySubmitLoading: false,
                canEditable: false
            }
        },
        computed: {
            ...mapGetters([
                'permission',
                'titleMap',
                'enums',
                'dicts',
                'closeOnClickModal',
                'searchSize',
                'btnSize'
            ]),
            btnEnable() {
                return {
                    create: this.permission.dictionaryIndex_create,
                    update: this.permission.dictionaryIndex_update,
                    delete: this.permission.dictionaryIndex_delete,
                    dictionarymanager: this.permission.dictionary_manager,
                    create_d: this.permission.dictionary_create,
                    update_d: this.permission.dictionary_update,
                    delete_d: this.permission.dictionary_delete,
                };
            },
            dictionaryTreePosition: {
                get() {
                    if (this.dictionary.treePosition) {
                        return this.dictionary.treePosition.substr(1).split('&')
                    }
                },
                set(v) {
                    if (v && v.length > 0) {
                        this.dictionary.parentId = v[v.length - 1];
                        this.dictionary.treePosition = '&' + v.join('&');
                    } else {
                        this.dictionary.parentId = '0';
                        this.dictionary.treePosition = '&';
                    }
                }
            }
        },
        created() {
            this.$store.state.common.selectSiteDisplay = false;
            this.reloadList();
        },
        methods: {
            resetSearch() {
                this.listQuery.name = undefined;
            },
            reloadList() {
                this.listLoading = true;
                this.dictionaryIndexList = undefined;
                getDictionaryIndexList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.dictionaryIndexList = response.data.records;
                    this.total = response.data.total;
                })
            },
            handleSizeChange(val) {
                this.listQuery.size = val;
                this.reloadList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.reloadList();
            },
            handleSelectionChange(rows) {
                this.selectedRows = rows;
            },
            btnCreate() {
                this.resetDictionaryIndex();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row) {
                this.resetDictionaryIndex();
                if (row.id) {
                    this.dictionaryIndex = deepClone(row);
                } else {
                    this.dictionaryIndex = deepClone(this.selectedRows[0]);
                }
                this.dialogTitle = 'update';
                this.dialogVisible = true;
            },
            btnDelete(row) {
                let ids = [];
                if (row.id) {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        ids.push(row.id);
                        this.doDelete(ids);
                    })
                } else {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        this.doDelete(ids);
                    })
                }
            },
            doCreate() {
                this.$refs['dictionaryIndexDialogForm'].validate(valid => {
                    if (valid) {
                        this.submitLoading = true;
                        createOrUpdateDictionaryIndex(this.dictionaryIndex).then(() => {
                            this.resetDictionaryIndexDialog();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate() {
                this.$refs['dictionaryIndexDialogForm'].validate(valid => {
                    if (valid) {
                        this.submitLoading = true;
                        createOrUpdateDictionaryIndex(this.dictionaryIndex).then(() => {
                            this.resetDictionaryIndexDialog();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids) {
                this.listLoading = true;
                delDictionaryIndexs(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetDictionaryIndex() {
                this.dictionaryIndex = {
                    id: undefined,
                    key: undefined,
                    name: undefined
                }
            },
            resetDictionaryIndexDialog() {
                this.dialogVisible = false;
                this.submitLoading = false;
                this.resetDictionaryIndex();
                this.reloadList();
            },


            //字典子项目管理开始
            btnDictionaryTree(row) {
                this.dictionaryDialogTitle = 'dictionary';
                this.dictionaryDialogVisible = true;
                this.dictionaryReloadList();
                this.dictionaryIndexValues = row.key;
                this.dictionaryListQuery.indexId = row.key;
            },
            dictionaryReloadList() {
                this.dictionaryListLoading = true;
                this.dictionaryList = undefined;
                /*getDictionaryList(this.dictionaryListQuery).then(response => {
                    this.dictionaryListLoading = false;
                    this.dictionaryList = response.data;
                })*/
                getDictionaryTree(this.dictionaryListQuery).then(response => {
                    this.tableReset = false;
                    this.dictionaryList = response.data;
                    if (this.lastExpanded) {
                        this.dictionaryList = setExpanded(this.dictionaryIndexList, this.lastExpanded);
                    }
                    this.$nextTick(() => {
                        this.tableReset = true
                    });
                    this.dictionaryListLoading = false;
                })
            },
            loadDictionaryCascader(query){
                getDictionaryCascader(query).then(response => {
                    this.dictionaryCascader = response.data;
                })
            },
            handleDictionarySelectionChange(rows) {
                this.dictionarySelectedRows = rows;
                if (this.dictionarySelectedRows) {
                    this.canEditable = true;
                    for (let item of this.dictionarySelectedRows) {
                        if (item.editable == 2) {
                            this.canEditable = false;
                            break;
                        }
                    }
                }
            },
            btnDictionaryCreate(row) {
                this.resetDictionary();

                if (row.id) {
                    if (row.treePosition != '&') {
                        this.dictionary.treePosition = row.treePosition + "&" + row.id;
                    } else {
                        this.dictionary.treePosition = row.treePosition + row.id;
                    }
                    this.dictionary.parentId = row.id;
                } else {
                    if (this.selectedRows.length == 1) {
                        if (this.selectedRows[0].treePosition != '&') {
                            this.dictionary.treePosition = this.selectedRows[0].treePosition + "&" + this.selectedRows[0].id;
                        } else {
                            this.dictionary.treePosition = this.selectedRows[0].treePosition + this.selectedRows[0].id;
                        }
                        this.dictionary.parentId = this.selectedRows[0].id;
                    }
                }
                getNextSortNo(this.dictionaryIndexValues).then(response=>{
                    this.dictionary.sortNo = response.data;
                });
                this.dictionary.children = undefined;
                this.loadDictionaryCascader(this.dictionaryListQuery);
                this.dictionaryCreateDialogTitle = '新增';
                this.dictionaryCreateDialogVisible = true;
            },
            btnDictionaryUpdate(row) {
                this.resetDictionary();
                if (row.id) {
                    this.dictionary = deepClone(row);
                } else {
                    this.dictionary = deepClone(this.dictionarySelectedRows[0]);
                }
                this.dictionary.children = undefined;
                this.loadDictionaryCascader(this.dictionaryListQuery);
                this.dictionaryCreateDialogTitle = '编辑';
                this.dictionaryCreateDialogVisible = true;
            },
            btnDictionaryDelete(row) {
                let ids = [];
                if (row.id) {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        ids.push(row.id);
                        this.doDictionaryDelete(ids);
                    })
                } else {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        for (const deleteRow of this.dictionarySelectedRows) {
                            ids.push(deleteRow.id);
                        }
                        this.doDictionaryDelete(ids);
                    })
                }
            },
            doDictionaryCreate() {
                this.$refs['dictionaryDialogForm'].validate(valid => {
                    if (valid) {
                        this.dictionarySubmitLoading = true;
                        createOrUpdateDictionary(this.dictionary).then(response => {
                            this.resetDictionaryDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doDictionaryUpdate() {
                this.$refs['dictionaryDialogForm'].validate(valid => {
                    if (valid) {
                        this.dictionarySubmitLoading = true;
                        createOrUpdateDictionary(this.dictionary).then(response => {
                            this.resetDictionaryDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDictionaryDelete(ids) {
                this.dictionaryListLoading = true;
                delDictionarys(ids).then(response => {
                    this.dictionaryReloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetDictionary() {
                this.dictionary = {
                    id: undefined,
                    indexId: this.dictionaryIndexValues,
                    code: undefined,
                    codeText: undefined,
                    sortNo: 1,
                    editable: 1,
                    parentId: 0,
                    treePosition: '&'
                }
            },
            resetDictionaryDialogAndList() {
                this.closeDictionaryDialog();
                this.dictionarySubmitLoading = false;
                this.dictionaryReloadList();
            },
            closeDictionaryDialog() {
                this.dictionaryCreateDialogVisible = false;
                this.resetDictionary();
                this.$refs['dictionaryDialogForm'].resetFields();
            }
        }
    }
</script>

<style>
    .el-dialog {
        padding-bottom: 20px;
    }
</style>

