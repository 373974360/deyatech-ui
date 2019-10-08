<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-menu">
                <div class="deyatech-menu_left">
                    <el-button v-if="btnEnable.create" type="primary" :size="btnSize" @click="btnCreate" :disabled="selectedRows.length > 1 || stationCount > 0">{{$t('table.create')}}</el-button>
                    <el-button v-if="btnEnable.update" type="primary" :size="btnSize" @click="btnUpdate" :disabled="selectedRows.length != 1">{{$t('table.update')}}</el-button>
                    <el-button v-if="btnEnable.delete" type="danger" :size="btnSize" @click="btnDelete" :disabled="selectedRows.length < 1 || classificationAndStationCount > 0">{{$t('table.delete')}}</el-button>
                </div>
                <div class="deyatech-menu_right">
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                </div>
            </div>
        </div>

        <el-table :data="stationGroupClassificationList" v-loading.body="listLoading" stripe border highlight-current-row
                  @selection-change="handleSelectionChange" v-if="tableReset">
            <el-table-column type="selection" width="50" align="center"/>
            <el-table-tree-column fixed :expand-all="false" child-key="children" levelKey="level" :indent-size="20"
                                  parentKey="parentId" prop="name" label="名称">
                <template slot-scope="scope">
                    <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                </template>
            </el-table-tree-column>
            <el-table-column align="center" label="英文名称" prop="englishName"/>
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
                    <el-button v-if="btnEnable.create" :title="$t('table.create')" type="primary" icon="el-icon-plus" :size="btnSize" circle :disabled="scope.row.stationCount > 0"
                               @click.stop.safe="btnCreate(scope.row)"></el-button>
                    <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                               @click.stop.safe="btnUpdate(scope.row)"></el-button>
                    <el-button v-if="btnEnable.delete" :title="$t('table.delete')" type="danger" icon="el-icon-delete" :size="btnSize" circle :disabled="(scope.row.stationCount + scope.row.classificationCount) > 0"
                               @click.stop.safe="btnDelete(scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible"
                   :close-on-click-modal="closeOnClickModal" @close="closeStationGroupClassificationDialog">
            <el-form ref="stationGroupClassificationDialogForm" class="deyatech-form" :model="stationGroupClassification" label-position="right"
                     label-width="80px" :rules="stationGroupClassificationRules">
                <el-row :gutter="20" :span="24">
                    <el-col :span="24">
                        <el-form-item label="上级分类" prop="parentId">
                            <el-cascader :options="stationGroupClassificationCascader" v-model.trim="stationGroupClassificationTreePosition"
                                         change-on-select show-all-levels expand-trigger="click" clearable style="width: 100%;" ></el-cascader>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" :span="24">
                    <el-col :span="12">
                        <el-form-item label="名称" prop="name">
                            <el-input v-model.trim="stationGroupClassification.name" maxlength="30"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="英文名称" prop="englishName">
                            <el-input v-model.trim="stationGroupClassification.englishName" maxlength="30"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" :span="24">
                    <el-col :span="12">
                        <el-form-item label="排序号" prop="sortNo">
                            <el-input v-model.trim="stationGroupClassification.sortNo" maxlength="3" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" :span="24">
                    <el-col :span="24">
                        <el-form-item :label="$t('table.remark')">
                            <el-input type="textarea" v-model.trim="stationGroupClassification.remark" :rows="3" maxlength="400"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                <el-button :size="btnSize" @click="closeStationGroupClassificationDialog">{{$t('table.cancel')}}</el-button>
            </span>
        </el-dialog>
    </basic-container>
</template>

<script>
    import {
        getStationGroupClassificationTree,
        getStationGroupClassificationCascader,
        createOrUpdateStationGroupClassification,
        delStationGroupClassifications,
        isNameExist,
        isEnglishNameExist,
        hasStationOrClassification,
        hasStation} from '@/api/resource/stationGroupClassification';
    import {deepClone, setExpanded} from '@/util/util';
    import {mapGetters} from 'vuex';
    import {isEnglish} from '@/util/validate';

    export default {
        name: 'stationGroupClassification',
        data() {
            const checkParentId = (rule, value, callback) => {
                if (this.stationGroupClassification.id && this.stationGroupClassification.id === value) {
                    callback(new Error('不能添加自己'));
                    return;
                }
                hasStation({id:value}).then(response => {
                    if (response.data) {
                        callback(new Error('当前分类下已存在站群，不能添加分类'))
                    } else {
                        callback()
                    }
                })
            };
            const checkName = (rule, value, callback) => {
                isNameExist({id: this.stationGroupClassification.id, parentId: this.stationGroupClassification.parentId, name: this.stationGroupClassification.name}).then(response => {
                    if (response.status == 200 && response.data) {
                        callback(new Error(response.message));
                        return;
                    }
                    callback();
                }).catch(() => {
                });
            };
            const checkEnglishName = (rule, value, callback) => {
                if (!isEnglish(value)) {
                    callback(new Error('只能输入英文字母'));
                    return;
                }
                isEnglishNameExist({id: this.stationGroupClassification.id, parentId: this.stationGroupClassification.parentId, englishName: this.stationGroupClassification.englishName}).then(response => {
                    if (response.status == 200 && response.data) {
                        callback(new Error(response.message));
                        return;
                    }
                    callback();
                }).catch(() => {
                });
            };
            const checkSortNo = (rule, value, callback) => {
                if (/[^\d]/g.test(value)) {
                    callback(new Error('请输入正整数'));
                } else {
                    callback();
                }
            };
            return {
                stationGroupClassificationList: undefined,
                listLoading: true,
                stationGroupClassification: {
                    id: undefined,
                    name: undefined,
                    englishName: undefined,
                    parentId: undefined,
                    treePosition: undefined,
                    sortNo: undefined
                },
                stationGroupClassificationCascader: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                selectedRows: [],
                stationCount: 0,
                classificationAndStationCount: 0,
                stationGroupClassificationRules: {
                    name: [
                        {required: true, message: this.$t("table.pleaseInput") + '分类名称'},
                        {validator: checkName, trigger: 'blur'}
                    ],
                    englishName: [
                        {required: true, message: this.$t("table.pleaseInput") + '分类英文名称'},
                        {validator: checkEnglishName, trigger: 'blur'}
                    ],
                    parentId: [
                        {validator: checkParentId, trigger: 'change'}
                    ],
                    sortNo: [
                        {required: true, message: this.$t("table.pleaseInput") + '排序号'},
                        {validator: checkSortNo, trigger: ['blur','change']}
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
            stationGroupClassificationTreePosition: {
                get() {
                    if (this.stationGroupClassification.treePosition) {
                        return this.stationGroupClassification.treePosition.substr(1).split('&');
                    }
                },
                set(v) {
                    if (v && v.length > 0) {
                        this.stationGroupClassification.parentId = v[v.length - 1];
                        this.stationGroupClassification.treePosition = '&' + v.join('&');
                    } else {
                        this.stationGroupClassification.parentId = 0;
                        this.stationGroupClassification.treePosition = undefined;
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
                    create: this.permission.stationGroupClassification_create,
                    update: this.permission.stationGroupClassification_update,
                    delete: this.permission.stationGroupClassification_delete
                };
            }
        },
        methods: {
            reloadList() {
                this.listLoading = true;
                getStationGroupClassificationTree().then(response => {
                    this.tableReset = false;
                    this.stationGroupClassificationList = response.data;
                    if (this.lastExpanded) {
                        this.stationGroupClassificationList = setExpanded(this.stationGroupClassificationList, this.lastExpanded);
                    }
                    this.$nextTick(() => {
                        this.tableReset = true
                    });
                    this.listLoading = false;
                })
            },
            getStationGroupClassificationCascader(id){
                this.submitLoading = true;
                getStationGroupClassificationCascader(id).then(response => {
                    this.submitLoading = false;
                    this.stationGroupClassificationCascader = response.data;
                })
            },
            handleSelectionChange(rows){
                this.selectedRows = rows;
                this.stationCount = 0;
                this.classificationAndStationCount = 0;
                for(let r of rows) {
                    this.stationCount += r.stationCount;
                    this.classificationAndStationCount += r.stationCount + r.classificationCount;
                }
            },
            btnCreate(row){
                this.resetStationGroupClassification();
                if (row.id) {
                    if(row.treePosition != null){
                        this.stationGroupClassification.treePosition = row.treePosition + "&" + row.id;
                    }else{
                        this.stationGroupClassification.treePosition = "&" + row.id;
                    }
                    this.stationGroupClassification.parentId = row.id;
                } else {
                    if (this.selectedRows.length == 1) {
                        if(this.selectedRows[0].treePosition != null){
                            this.stationGroupClassification.treePosition = this.selectedRows[0].treePosition + "&" + this.selectedRows[0].id;
                        }else{
                            this.stationGroupClassification.treePosition = "&" + this.selectedRows[0].id;
                        }
                        this.stationGroupClassification.parentId = this.selectedRows[0].id;
                    } else {
                        this.stationGroupClassification.parentId = 0
                    }
                }
                // this.stationGroupClassification.children = undefined;
                this.getStationGroupClassificationCascader(null);
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetStationGroupClassification();
                if (row.id) {
                    this.stationGroupClassification = deepClone(row);
                } else {
                    this.stationGroupClassification = deepClone(this.selectedRows[0]);
                }
                this.stationGroupClassification.children = undefined;
                this.getStationGroupClassificationCascader(this.stationGroupClassification.id);
                this.dialogTitle = 'update';
                this.dialogVisible = true;
            },
            btnDelete(row){
                alert(1);
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
                this.$refs['stationGroupClassificationDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateStationGroupClassification(this.stationGroupClassification).then((response) => {
                            if (response.status == 200) {
                                this.lastExpanded = this.stationGroupClassification.treePosition;
                                this.resetStationGroupClassificationDialogAndList();
                                this.$message.success(this.$t("table.createSuccess"));
                            } else {
                                this.$message.error(response.message);
                            }
                        }).catch(() => {
                            this.submitLoading = false;
                        });
                    } else {
                        return false;
                    }
                })
            },
            doUpdate(){
                this.$refs['stationGroupClassificationDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateStationGroupClassification(this.stationGroupClassification).then((response) => {
                            if (response.status == 200) {
                                this.lastExpanded = this.stationGroupClassification.treePosition;
                                this.resetStationGroupClassificationDialogAndList();
                                this.$message.success(this.$t("table.updateSuccess"));
                            } else {
                                this.submitLoading = false;
                                this.$message.error(response.message);
                            }
                        }).catch(() => {
                            this.submitLoading = false;
                        });
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                hasStationOrClassification(ids).then(response => {
                    if (response.status == 200) {
                        if (response.data) {
                            this.listLoading = false;
                            this.$message.error(response.message);
                        } else {
                            delStationGroupClassifications(ids).then((response) => {
                                if (response.status == 200) {
                                    this.reloadList();
                                    this.$message.success(this.$t("table.deleteSuccess"));
                                } else {
                                    this.listLoading = false;
                                    this.$message.error(response.message);
                                }
                            })
                        }
                    }
                }).catch(() => {
                    this.listLoading = false;
                });
            },
            resetStationGroupClassification(){
                this.stationGroupClassification = {
                    id: undefined,
                    name: undefined,
                    englishName: undefined,
                    parentId: undefined,
                    treePosition: undefined,
                    sortNo: undefined
                }
            },
            resetStationGroupClassificationDialogAndList(){
                this.closeStationGroupClassificationDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeStationGroupClassificationDialog() {
                this.dialogVisible = false;
                this.resetStationGroupClassification();
                this.$refs['stationGroupClassificationDialogForm'].resetFields();
            }
        }
    }
</script>


