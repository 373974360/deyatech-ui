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

        <el-table :data="menuList" v-loading.body="listLoading" stripe border highlight-current-row
                  @selection-change="handleSelectionChange"  v-if="tableReset">
            <el-table-column type="selection" width="50" align="center"/>
            <el-table-tree-column fixed :expand-all="false" child-key="children" levelKey="level" :indent-size="20"
                                  parentKey="parentId" prop="name" label="菜单名称" width="200">
                <template slot-scope="scope">
                    <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                </template>
            </el-table-tree-column>
            <el-table-column align="center" label="菜单类型" prop="type">
                <template slot-scope="scope">
                    {{scope.row.type | enums('MenuTypeEnum')}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="图标" prop="icon">
                <template slot-scope="scope">
                    <i :class="scope.row.icon"></i>
                </template>
            </el-table-column>
            <el-table-column align="center" label="前台地址" prop="path"/>
            <el-table-column align="center" label="后台地址" prop="request"/>
            <el-table-column align="center" label="权限标识" prop="permission"/>
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
                   :close-on-click-modal="closeOnClickModal" @close="closeMenuDialog">
            <el-form ref="menuDialogForm" class="deyatech-form" :model="menu" label-position="right"
                     label-width="100px" :rules="menuRules">
                <el-row :gutter="20" :span="24">
                    <el-col :span="12">
                        <el-form-item label="上级菜单">
                            <el-cascader filterable :options="menuCascader"
                                         v-model.trim="menuTreePosition"
                                         :props="{ checkStrictly: true }" clearable style="width: 100%;"></el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="菜单名称" prop="name">
                            <el-input v-model.trim="menu.name"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" :span="24">
                    <el-col :span="12">
                        <el-form-item label="菜单类型" prop="type">
                            <el-radio-group v-model.trim="menu.type">
                                <el-radio v-for="item in enums['MenuTypeEnum']"
                                          :key="item.code"
                                          :label="item.code"
                                          :value="item.code">
                                    <span>{{item.value}}</span>
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="图标" prop="icon">
                            <icon-select v-model.trim="menu.icon"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" :span="24">
                    <el-col :span="12">
                        <el-form-item label="前台地址" prop="path">
                            <el-input v-model.trim="menu.path"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="后台地址" prop="request">
                            <el-input v-model.trim="menu.request"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" :span="24">
                    <el-col :span="12">
                        <el-form-item label="权限标识" prop="permission">
                            <el-input v-model.trim="menu.permission"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="排序号" prop="sortNo">
                            <el-input-number v-model.trim="menu.sortNo" :min="1" :max="100"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" :span="24">
                    <el-col :span="24">
                        <el-form-item :label="$t('table.remark')" prop="remark">
                            <el-input type="textarea" v-model.trim="menu.remark" :rows="3"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate"
                           :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                <el-button :size="btnSize" @click="closeMenuDialog">{{$t('table.cancel')}}</el-button>
            </span>
        </el-dialog>
    </basic-container>
</template>

<script>
    import {createOrUpdateMenu, delMenus, getMenuCascader, getMenuTree, getNextSortNo} from '@/api/admin/menu';
    import {deepClone, setExpanded} from '@/util/util';
    import {mapGetters} from 'vuex';
    import {isStartOrEndWithWhiteSpace} from '@/util/validate';

    export default {
        name: 'menu',
        data() {
            return {
                menuList: undefined,
                listLoading: true,
                menu: {
                    id: undefined,
                    name: undefined,
                    type: undefined,
                    parentId: 0,
                    treePosition: '&',
                    icon: undefined,
                    path: undefined,
                    request: undefined,
                    permission: undefined,
                    sortNo: undefined
                },
                menuCascader: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                selectedRows: [],
                menuRules: {
                    name: [
                        {required: true, whitespace: true, message: this.$t("table.pleaseInput") + '菜单名称'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}
                    ],
                    type: [
                        {required: true, message: this.$t("table.pleaseInput") + '菜单类型(0:CURD;1:系统菜单;2:业务菜单;)'}
                    ],
                    request: [
                        {required: true, whitespace: true,message: this.$t("table.pleaseInput") + '后台地址'},
                        {min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur'}
                    ],
                    permission: [
                        {required: true, whitespace: true, message: this.$t("table.pleaseInput") + '权限标识'},
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
            menuTreePosition: {
                get() {
                    if (this.menu.treePosition) {
                        return this.menu.treePosition.substr(1).split('&');
                    }
                },
                set(v) {
                    if (v.length > 0) {
                        this.menu.parentId = v[v.length - 1];
                        this.menu.treePosition = '&' + v.join('&');
                    } else {
                        this.menu.parentId = 0;
                        this.menu.treePosition = '&';
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
                    create: this.permission.menu_create,
                    update: this.permission.menu_update,
                    delete: this.permission.menu_delete
                };
            }
        },
        methods: {
            reloadList() {
                this.listLoading = true;
                getMenuTree().then(response => {
                    this.tableReset = false;
                    this.menuList = response.data;
                    if (this.lastExpanded) {
                        this.menuList = setExpanded(this.menuList, this.lastExpanded);
                    }
                    this.$nextTick(() => {
                        this.tableReset = true
                    })
                    this.listLoading = false;
                })
            },
            getMenuCascader(id) {
                this.submitLoading = true;
                getMenuCascader(id).then(response => {
                    this.submitLoading = false;
                    this.menuCascader = response.data;
                })
            },
            handleSelectionChange(rows) {
                this.selectedRows = rows;
            },
            btnCreate(row) {
                this.resetMenu();
                if (row.id) {
                    if (row.treePosition != '&') {
                        this.menu.treePosition = row.treePosition + "&" + row.id;
                    } else {
                        this.menu.treePosition = row.treePosition + row.id;
                    }
                    this.menu.parentId = row.id;
                } else {
                    if (this.selectedRows.length == 1) {
                        if (this.selectedRows[0].treePosition != '&') {
                            this.menu.treePosition = this.selectedRows[0].treePosition + "&" + this.selectedRows[0].id;
                        } else {
                            this.menu.treePosition = this.selectedRows[0].treePosition + this.selectedRows[0].id;
                        }
                        this.menu.parentId = this.selectedRows[0].id;
                    }
                }
                getNextSortNo().then(response=> {
                    this.$nextTick(()=>{
                        this.menu.sortNo = response.data;
                    });
                });
                this.menu.children = undefined;
                this.getMenuCascader(null);
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            selectedIcon(name) {
                this.menu.icon = name;
            },
            btnUpdate(row) {
                this.resetMenu();
                if (row.id) {
                    this.menu = deepClone(row);
                } else {
                    this.menu = deepClone(this.selectedRows[0]);
                }
                this.menu.children = undefined;
                this.getMenuCascader(this.menu.id);
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
                            this.lastExpanded = deleteRow.treePosition;
                            ids.push(deleteRow.id);
                        }
                        this.doDelete(ids);
                    })
                }
            },
            doCreate() {
                this.$refs['menuDialogForm'].validate(valid => {
                    if (valid) {
                        this.submitLoading = true;
                        createOrUpdateMenu(this.menu).then(() => {
                            this.lastExpanded = this.menu.treePosition;
                            this.resetMenuDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doUpdate() {
                this.$refs['menuDialogForm'].validate(valid => {
                    if (valid) {
                        this.submitLoading = true;
                        createOrUpdateMenu(this.menu).then(() => {
                            this.lastExpanded = this.menu.treePosition;
                            this.resetMenuDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids) {
                this.listLoading = true;
                delMenus(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetMenu() {
                this.menu = {
                    id: undefined,
                    name: undefined,
                    type: undefined,
                    parentId: 0,
                    treePosition: '&',
                    icon: undefined,
                    path: undefined,
                    request: undefined,
                    permission: undefined,
                    sortNo: undefined
                }
            },
            resetMenuDialogAndList() {
                this.closeMenuDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeMenuDialog() {
                this.dialogVisible = false;
                this.resetMenu();
                this.$refs['menuDialogForm'].resetFields();
            }
        }
    }
</script>


