<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-menu">
                <div class="deyatech-menu_left">
                    <el-button v-if="btnEnable.create" type="primary" :size="btnSize" @click="btnCreate" >{{$t('table.create')}}</el-button>
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

        <el-table :data="categoryList" v-loading.body="listLoading" stripe border highlight-current-row
                  @selection-change="handleSelectionChange" v-if="tableReset" style="margin-bottom: 20px;">
            <el-table-column type="selection" width="50" align="center"/>
            <el-table-tree-column fixed :expand-all="false" child-key="children" levelKey="level" :indent-size="20"
                                  parentKey="parentId" prop="name" label="分类名称" >
                <template slot-scope="scope">
                    <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                </template>
            </el-table-tree-column>
            <el-table-column align="center" label="分类名称简称" prop="shortName" />
            <!--
            <el-table-column align="center" label="上级分类编号" prop="parentId"/>
            <el-table-column align="center" label="树结构中的索引位置" prop="treePosition"/>
            -->
            <el-table-column align="center" label="排序号" prop="sortNo" width="90"/>
            <el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                        {{scope.row.enable | enums('EnableEnum')}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="200">
                <template slot-scope="scope">
                    <el-button v-if="btnEnable.create" :title="$t('table.create')" type="primary" icon="el-icon-plus" :size="btnSize" circle
                               @click.stop.safe="btnCreate(scope.row)"></el-button>
                    <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                               @click.stop.safe="btnUpdate(scope.row)"></el-button>

                    <el-badge :value="scope.row.number" style="margin: 10px 13px 11px 10px">
                    <el-button v-if="btnEnable.associateItem" title="关联事项" type="primary" icon="iconcaidan1" :size="btnSize" circle
                               @click.stop.safe="btnCategoryItem(scope.row)"></el-button>
                    </el-badge>

                    <el-button v-if="btnEnable.delete" :title="$t('table.delete')" type="danger" icon="el-icon-delete" :size="btnSize" circle
                               @click.stop.safe="btnDelete(scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible"
                   :close-on-click-modal="closeOnClickModal" @close="closeCategoryDialog">
            <el-form ref="categoryDialogForm" class="deyatech-form" :model="category" label-position="right"
                     label-width="80px" :rules="categoryRules">
                <el-row :gutter="20" :span="24">
                    <el-col :span="12">
                        <el-form-item :label="$t('table.parent')">
                            <el-cascader :options="categoryCascader" v-model="categoryTreePosition"
                                         show-all-levels expand-trigger="click" clearable
                                         change-on-select></el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="分类名称" prop="name">
                            <el-input v-model.trim="category.name"/>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="分类简称" prop="shortName">
                            <el-input v-model.trim="category.shortName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="排序号" prop="sortNo">
                            <el-input-number v-model="category.sortNo" :min="1" :max="999" :precision="0" :step="1"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" :span="24">
                    <el-col :span="24">
                        <el-form-item :label="$t('table.remark')" prop="remark">
                            <el-input type="textarea" v-model.trim="category.remark" :rows="3"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                <el-button :size="btnSize" @click="closeCategoryDialog">{{$t('table.cancel')}}</el-button>
            </span>
        </el-dialog>


        <el-dialog :title="titleMap['associateItem']" :visible.sync="dialogCategoryItemVisible"
                   :close-on-click-modal="closeOnClickModal" @click="closeCategoryItemDialog">
            <div v-loading="dialogFormLoading">
                <div class="search">
                    <el-input v-model.trim="itemListQuery.itemName" class="search-item dialog-keywords"
                              clearable :size="searchSize" placeholder="请输入事项名称"></el-input>
                    <el-button type="primary" :size="searchSize" icon="el-icon-search" @click="reloadItemList">{{$t('table.search')}}</el-button>
                </div>
                <div class="search">
                    <el-checkbox v-model="showRelatedFlag" @change="handleShowRelated">只显示已关联事项</el-checkbox>
                </div>
                <div>
                    <el-table ref="categoryItemTable" :data="itemList" border @select="selectRowItem"
                              @select-all="selectAllItem" @selection-change="handleSelectionChangeCategoryItem">
                        <el-table-column type="selection" width="50" align="center"/>
                        <el-table-column align="center" label="事项名称" prop="name"/>
                        <el-table-column align="center" label="事项简称" prop="shortName"/>
                        <el-table-column align="center" label="事项编码" prop="code"/>
                        <!--<el-table-column align="center" label="是否是第三方事项" prop="remoteEnable">-->
                            <!--<template slot-scope="scope">-->
                                <!--{{Number(scope.row.remoteEnable) | enums('YesNoEnum')}}-->
                            <!--</template>-->
                        <!--</el-table-column>-->
                        <!--<el-table-column align="center" label="第三方事项" prop="remoteId"/>-->
                    </el-table>
                    <el-pagination class="deyatech-pagination pull-right" background
                                   :current-page.sync="itemListQuery.page" :page-sizes="this.$store.state.common.pageSize"
                                   :page-size="itemListQuery.size" :layout="this.$store.state.common.pageLayout" :total="itemTotal"
                                   @size-change="handleSizeChangeCategoryItem" @current-change="handleCurrentChangeCategoryItem">
                    </el-pagination>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" :size="btnSize" @click="doSaveCategoryItem"
                           :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                <el-button :size="btnSize" @click="closeCategoryItemDialog">{{$t('table.cancel')}}</el-button>
            </div>
        </el-dialog>
    </basic-container>
</template>

<script>
    import {
        getCategoryTree,
        getCategoryCascader,
        createOrUpdateCategory,
        delCategorys,
        countCategory
    } from '@/api/item/category';
    import {deepClone, setExpanded} from '@/util/util';
    import {mapGetters} from 'vuex';
    import {getAllCategoryItem, setCategoryItems, pageItemsByItemNameAndCategoryIds} from "@/api/item/categoryItem";
    import {isStartOrEndWithWhiteSpace} from '@/util/validate';

    export default {
        name: 'category',
        data() {
            const validateWhiteSpace = (rule, value, callback) => {
                let oldValue = '';
                let msg = '';
                if (rule.field === 'name') {
                    oldValue = this.categoryTmp.name;
                    msg = '分类名称';
                } else if (rule.field === 'shortName') {
                    oldValue = this.categoryTmp.shortName;
                    msg = '分类简称';
                }
                if (isStartOrEndWithWhiteSpace(value)) {
                    callback(new Error(msg + this.$t("errorMsg.blankSpace")));
                    return;
                }
                // 值被修改的情况
                if (oldValue.trim() != value.trim()) {
                    let query = {field: rule.field, value: value};
                    countCategory(query).then(res => {
                        if (res.data > 0) {
                            callback(new Error(msg + '已存在'));
                        } else {
                            callback();
                        }

                    }).catch(() => {
                        callback(new Error(msg + '检查请求出错'))
                    });
                } else {
                    callback();
                }
            };
            return {
                categoryList: undefined,
                listLoading: true,
                category: {
                    id: undefined,
                    name: undefined,
                    shortName: undefined,
                    parentId: undefined,
                    treePosition: undefined,
                    sortNo: 1
                },
                categoryTmp: undefined,
                categoryCascader: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                selectedRows: [],
                categoryRules: {
                    name: [
                        {required: true, whiteSpace: true, message: this.$t("table.pleaseInput") + '分类名称'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'},
                        // {validator: validateWhiteSpace, trigger: 'blur'}
                    ],
                    shortName: [
                        {required: true, whiteSpace: true, message: this.$t("table.pleaseInput") + '分类简称'},
                        {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'},
                        // {validator: validateWhiteSpace, trigger: 'blur'}
                    ],
                    parentId: [
                        {required: true, message: this.$t("table.pleaseInput") + '上级分类编号'}
                    ],
                    // treePosition: [
                    //     {required: true, message: this.$t("table.pleaseInput") + '树结构中的索引位置'}
                    // ],
                    sortNo: [
                        {required: true, message: this.$t("table.pleaseInput") + '排序号'}
                    ],
                    remark: [
                        {min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur'}
                    ]
                },
                lastExpanded: undefined,
                tableReset: false,
                dialogCategoryItemVisible: false,

                itemListQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    itemName: undefined,
                    categoryId: undefined
                },
                showRelatedFlag: false,
                itemList: [],
                itemTotal: 0,
                dialogFormLoading: false,
                selectAllItemId: [],
                currentRow: undefined,
                selectedRowsItem: []
            }
        },
        created() {
            this.reloadList();
        },
        computed: {
            categoryTreePosition: {
                get() {
                    if (this.category.treePosition) {
                        return this.category.treePosition.split('&');
                    }
                },
                set(v) {
                    if (v.length > 0) {
                        this.category.parentId = v[v.length - 1];
                        this.category.treePosition = v.join('&') + "&" + this.category.parentId;
                    } else {
                        this.category.parentId = 0;
                        this.category.treePosition = undefined;
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
                    create: this.permission.category_create,
                    update: this.permission.category_update,
                    delete: this.permission.category_delete,
                    associateItem: this.permission.category_associate_item,
                };
            }
        },
        methods: {
            reloadList(){
                this.listLoading = true;
                this.selectedRows = [];
                getCategoryTree().then(response => {
                    this.tableReset = false;
                    this.categoryList = response.data;
                    if (this.lastExpanded) {
                        this.categoryList = setExpanded(this.categoryList, this.lastExpanded);
                    }
                    this.$nextTick(() => {
                        this.tableReset = true
                    });
                    this.listLoading = false;
                })
            },
            getCategoryCascader(id){
                this.submitLoading = true;
                getCategoryCascader(id).then(response => {
                    this.submitLoading = false;
                    this.categoryCascader = response.data;
                })
            },
            handleSelectionChange(rows){
                this.selectedRows = rows;
            },
            btnCreate(row){
                this.categoryTmp = {
                    name: '',
                    shortName: ''
                };
                this.resetCategory();
                if (row.id) {
                    if(row.treePosition != null){
                        this.category.treePosition = row.treePosition + "&" + row.id;
                    }else{
                        this.category.treePosition = "&" + row.id;
                    }
                    this.category.parentId = row.id;
                } else {
                    if (this.selectedRows.length == 1) {
                        if(this.selectedRows[0].treePosition != null){
                            this.category.treePosition = this.selectedRows[0].treePosition + "&" + this.selectedRows[0].id;
                        }else{
                            this.category.treePosition = "&" + this.selectedRows[0].id;
                        }
                        this.category.parentId = this.selectedRows[0].id;
                    }
                }
                this.category.children = undefined;
                this.getCategoryCascader(null);
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetCategory();
                if (row.id) {
                    this.category = deepClone(row);
                } else {
                    this.category = deepClone(this.selectedRows[0]);
                }
                this.categoryTmp = {
                    name: this.category.name,
                    shortName: this.category.shortName
                };
                this.category.children = undefined;
                this.getCategoryCascader(this.category.id);
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
                this.$refs['categoryDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateCategory(this.category).then(() => {
                            this.lastExpanded = this.category.treePosition;
                            this.resetCategoryDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doUpdate(){
                this.$refs['categoryDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateCategory(this.category).then(() => {
                            this.lastExpanded = this.category.treePosition;
                            this.resetCategoryDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delCategorys(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetCategory(){
                this.category = {
                    id: undefined,
                    name: undefined,
                    shortName: undefined,
                    parentId: 0,
                    treePosition: undefined,
                    sortNo: 1
                }
            },
            resetCategoryDialogAndList(){
                this.closeCategoryDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeCategoryDialog() {
                this.dialogVisible = false;
                this.resetCategory();
                this.$refs['categoryDialogForm'].resetFields();
            },
            // 点击关联分类按钮
            btnCategoryItem(row) {
                this.itemListQuery.itemName = undefined;
                this.currentRow = row;
                this.dialogCategoryItemVisible = true;
                this.dialogFormLoading = false;
                this.selectAllItemId = [];
                // 加载分类事项
                this.loadCategoryItem(row.id).then(res => {
                    if(res && res.length > 0) {// 分类有关联事项
                        for (let categoryItem of res) {
                            this.selectAllItemId.push(categoryItem.itemId);
                        }
                        this.showRelatedFlag = true;
                        this.handleShowRelated(true);
                    } else {// 分类无关联事项
                        this.showRelatedFlag = false;
                        this.handleShowRelated(false);
                    }
                });
            },
            // 加载选中的分类事项
            loadCategoryItem(categoryId) {
                let query = {categoryId};
                return new Promise((resolve, reject) => {
                    getAllCategoryItem(query).then(response => {
                        resolve(response.data)
                    }).catch(err => {
                        reject(err)
                    })
                });
            },
            handleShowRelated(checked) {
                if (checked) {
                    this.itemListQuery.categoryId = this.currentRow.id;
                } else {
                    this.itemListQuery.categoryId = undefined;
                }
                this.reloadItemList();
            },
            reloadItemList() {
                this.handleCurrentChangeCategoryItem(1)
            },
            handleSizeChangeCategoryItem(val) {
                this.itemListQuery.size = val;
                this.loadItemList().then(() => {
                    this.checkRelatedItemRows();
                });
            },
            handleCurrentChangeCategoryItem(val) {
                this.itemListQuery.page = val;
                this.loadItemList().then(() => {
                    this.checkRelatedItemRows();
                });
            },
            // 选中关联的事项
            checkRelatedItemRows() {
                this.$nextTick(() => {
                    if (this.selectAllItemId && this.selectAllItemId.length > 0) {
                        for (let row of this.itemList) {
                            if (this.selectAllItemId.includes(row.id)) {
                                this.$refs['categoryItemTable'].toggleRowSelection(row, true)
                            }
                        }
                    }
                });
            },
            loadItemList() {
                return new Promise((resolve, reject) => {
                    this.dialogFormLoading = true;
                    // 取得事项
                    pageItemsByItemNameAndCategoryIds(this.itemListQuery).then(response => {
                        this.dialogFormLoading = false;
                        this.itemList = response.data.records;
                        this.itemTotal = response.data.total;
                        resolve();
                    }).catch(err => {
                        reject(err);
                    })
                });
            },
            selectAllItem(selection) {
                if (selection.length > 0) {
                    for (let user of this.itemList) {
                        if (this.selectAllItemId.indexOf(user.id) < 0) {
                            this.selectAllItemId.push(user.id)
                        }
                    }
                } else {
                    for (let user of this.itemList) {
                        let i = this.selectAllItemId.indexOf(user.id)
                        if (i >= 0) {
                            this.selectAllItemId.splice(i, 1)
                        }
                    }
                }
            },
            handleSelectionChangeCategoryItem(rows) {
                this.selectedRowsItem = rows;
            },
            selectRowItem(selection, row) {
                let i = this.selectAllItemId.indexOf(row.id)
                if (i < 0) {
                    this.selectAllItemId.push(row.id)
                } else {
                    this.selectAllItemId.splice(i, 1)
                }
            },
            closeCategoryItemDialog() {
                this.dialogCategoryItemVisible = false;
                this.submitLoading = false;
            },
            doSaveCategoryItem() {
                this.submitLoading = true;
                setCategoryItems(this.currentRow.id, this.selectAllItemId).then(() => {
                    this.closeCategoryItemDialog();
                    this.reloadList();
                    this.$message.success(this.$t("table.updateSuccess"));
                }).catch(() => {
                    this.submitLoading = false;
                })
            }

        }
    }
</script>


<style>
    .search{
        margin-bottom: 20px;
    }
    .search-item {
        margin-right: 8px;
    }
    .dialog-keywords {
        width: 180px;
        height: 30px;
        line-height: 30px;
    }
</style>
