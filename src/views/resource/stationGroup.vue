<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item >
                        <el-cascader ref="queryStationGroupClassificationCascader" :options="stationGroupClassificationCascader"
                                     v-model.trim="listQuery.stationGroupClassificationArray"
                                     clearable placeholder="请选择分类" style="width: 300px;" :size="searchSize"></el-cascader>
                    </el-form-item>
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.searchName')" v-model.trim="listQuery.name" clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="reloadList">{{$t('table.search')}}</el-button>
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
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                </div>
            </div>

            <el-table :data="stationGroupList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="所属分类" prop="stationGroupClassificationName"/>
                <el-table-column align="center" label="名称" prop="name">
                    <template slot-scope="scope">
                        <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="英文名称" prop="englishName"/>
                <el-table-column align="center" label="简称" prop="abbreviation"/>
                <el-table-column align="center" label="排序号" prop="sortNo"/>
                <el-table-column prop="enable" :label="$t('table.enable')" align="center" width="100">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                            {{scope.row.enable == 1 ? "启用" : (scope.row.enable == 0 ? "停用" : "") }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="150">
                    <template slot-scope="scope">
                        <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                                   @click.stop="btnUpdate(scope.row)"></el-button>
                        <el-button v-if="btnEnable.delete" :title="$t('table.delete')" type="danger" icon="el-icon-delete" :size="btnSize" circle :disabled="scope.row.enable == 10"
                                   @click.stop="btnDelete(scope.row)"></el-button>
                        <el-button v-if="scope.row.enable == 1" title="停用" type="warning" icon="el-icon-close" :size="btnSize" circle
                                   @click.stop="btnCtrl(scope.row, 'stop')"></el-button>
                        <el-button v-else-if="scope.row.enable == 0" title="启用" type="warning" icon="el-icon-caret-right" :size="btnSize" circle
                                   @click.stop="btnCtrl(scope.row, 'run')"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="deyatech-pagination pull-right" background
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                           :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>

            <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeStationGroupDialog">
                <el-form ref="stationGroupDialogForm" class="deyatech-form" :model="stationGroup" label-position="right"
                         label-width="80px" :rules="stationGroupRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="所属分类" prop="stationGroupClassificationId">
                                <el-cascader ref="addOrEditStationGroupClassificationCascader" :options="stationGroupClassificationCascader"
                                             v-model.trim="stationGroupClassificationTreePosition"
                                             clearable placeholder="请选择分类" style="width: 100%;" ></el-cascader>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="名称" prop="name">
                                <el-input v-model.trim="stationGroup.name" maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="英文名称" prop="englishName">
                                <el-input v-model.trim="stationGroup.englishName" maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="简称" prop="abbreviation">
                                <el-input v-model.trim="stationGroup.abbreviation" maxlength="10"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="排序号" prop="sortNo">
                                <el-input v-model.trim="stationGroup.sortNo" maxlength="3"></el-input>
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="描述" prop="description">
                                <el-input type="textarea" v-model.trim="stationGroup.description" :rows="3" maxlength="500"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model.trim="stationGroup.remark" :rows="3" maxlength="400"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeStationGroupDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getStationGroupList,
        createOrUpdateStationGroup,
        delStationGroups,
        isNameExist,
        isEnglishNameExist,
        isAbbreviationExist,
        runOrStopStationById
    } from '@/api/resource/stationGroup';
    import {getStationGroupClassificationCascader} from '@/api/resource/stationGroupClassification';
    import {isEnglish} from '@/util/validate';

    export default {
        name: 'stationGroup',
        data() {
            const checkName = (rule, value, callback) => {
                this.$refs['stationGroupDialogForm'].validateField('stationGroupClassificationId', errorMsg => {
                    if (!errorMsg) {
                        isNameExist({
                            id: this.stationGroup.id,
                            classificationId: this.stationGroup.stationGroupClassificationId,
                            name: this.stationGroup.name}).then(response => {
                            if (response.status == 200 && response.data) {
                                callback(new Error(response.message));
                            } else {
                                callback();
                            }
                        }).catch(() => {});
                    } else {
                        callback(new Error("没有选择分类，名称无法校验"));
                    }
                });
            };
            const checkEnglishName = (rule, value, callback) => {
                if (!isEnglish(value)) {
                    callback(new Error('只能输入英文字母'));
                    return;
                }
                this.$refs['stationGroupDialogForm'].validateField('stationGroupClassificationId', errorMsg => {
                    if (!errorMsg) {
                        isEnglishNameExist({
                            id: this.stationGroup.id,
                            classificationId: this.stationGroup.stationGroupClassificationId,
                            englishName: this.stationGroup.englishName}).then(response => {
                            if (response.status == 200 && response.data) {
                                callback(new Error(response.message));
                            } else {
                                callback();
                            }
                        }).catch(() => {});
                    } else {
                        callback(new Error("没有选择分类，英文名称无法校验"));
                    }
                });
            };
            const checkAbbreviation = (rule, value, callback) => {
                this.$refs['stationGroupDialogForm'].validateField('stationGroupClassificationId', errorMsg => {
                    if (!errorMsg) {
                        isAbbreviationExist({
                            id: this.stationGroup.id,
                            classificationId: this.stationGroup.stationGroupClassificationId,
                            abbreviation: this.stationGroup.abbreviation}).then(response => {
                            if (response.status == 200 && response.data) {
                                callback(new Error(response.message));
                            } else {
                                callback();
                            }
                        }).catch(() => {});
                    } else {
                        callback(new Error("没有选择分类，简称无法校验"));
                    }
                });

            };
            const checkSortNo = (rule, value, callback) => {
                if (/[^\d]/g.test(value)) {
                    callback(new Error('请输入整数'));
                } else {
                    callback();
                }
            };
            return {
                stationGroupList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined,
                    stationGroupClassificationId: undefined,
                    stationGroupClassificationArray: []
                },
                stationGroup: {
                    id: undefined,
                    name: undefined,
                    englishName: undefined,
                    abbreviation: undefined,
                    description: undefined,
                    sortNo: undefined,
                    stationGroupClassificationId: undefined,
                    stationGroupClassificationTreePosition: undefined
                },
                stationGroupRules: {
                    stationGroupClassificationId: [
                        {required: true, message: this.$t("table.pleaseSelect") + '分类'}
                    ],
                    name: [
                        {required: true, message: this.$t("table.pleaseInput") + '名称'},
                        {validator: checkName, trigger: 'blur'}
                    ],
                    englishName: [
                        {required: true, message: this.$t("table.pleaseInput") + '英文名称'},
                        {validator: checkEnglishName, trigger: 'blur'}
                    ],
                    abbreviation: [
                        {required: true, message: this.$t("table.pleaseInput") + '简称'},
                        {validator: checkAbbreviation, trigger: 'blur'}
                    ],
                    description: [
                        {required: true, message: this.$t("table.pleaseInput") + '描述'}
                    ],
                    sortNo: [
                        {required: true, message: this.$t("table.pleaseInput") + '排序号'},
                        {validator: checkSortNo, trigger: ['blur','change']}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                stationGroupClassificationCascader: []
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
            stationGroupClassificationTreePosition: {
                get() {
                    if (this.stationGroup.stationGroupClassificationTreePosition) {
                        return this.stationGroup.stationGroupClassificationTreePosition.substr(1).split('&')
                    }
                },
                set(v) {
                    if (v.length > 0) {
                        this.stationGroup.stationGroupClassificationId = v[v.length - 1];
                        this.stationGroup.stationGroupClassificationTreePosition = '&' + v.join('&');
                    } else {
                        this.stationGroup.stationGroupClassificationId = undefined;
                        this.stationGroup.stationGroupClassificationTreePosition = undefined;
                    }
                }
            },
            btnEnable() {
                return {
                    create: this.permission.stationGroup_create,
                    update: this.permission.stationGroup_update,
                    delete: this.permission.stationGroup_delete,
                    ctrl: this.permission.stationGroup_ctrl
                };
            }
        },
        created(){
            this.reloadList();
            this.getStationGroupClassificationCascader(null);
        },
        methods: {
            getStationGroupClassificationCascader(id){
                this.submitLoading = true;
                getStationGroupClassificationCascader(id).then(response => {
                    this.submitLoading = false;
                    this.stationGroupClassificationCascader = response.data;
                })
            },
            resetSearch(){
                let obj = {};
                obj.stopPropagation = () =>{};
                this.$refs.queryStationGroupClassificationCascader.clearValue(obj);
                this.listQuery.name = undefined;
            },
            reloadList(){
                this.listLoading = true;
                this.stationGroupList = undefined;
                this.total = undefined;
                if (this.listQuery.stationGroupClassificationArray && this.listQuery.stationGroupClassificationArray.length > 0) {
                    this.listQuery.stationGroupClassificationId = this.listQuery.stationGroupClassificationArray[this.listQuery.stationGroupClassificationArray.length - 1];
                } else {
                    this.listQuery.stationGroupClassificationId = undefined;
                }
                getStationGroupList({
                    page: this.listQuery.page,
                    size: this.listQuery.size,
                    stationGroupClassificationId: this.listQuery.stationGroupClassificationId,
                    name: this.listQuery.name
                }).then(response => {
                    this.listLoading = false;
                    this.stationGroupList = response.data.records;
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
                this.resetStationGroup();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetStationGroup();
                if (row.id) {
                    this.stationGroup = deepClone(row);
                } else {
                    this.stationGroup = deepClone(this.selectedRows[0]);
                }
                this.stationGroup.stationGroupClassificationTreePosition += '&' + this.stationGroup.stationGroupClassificationId;
                this.dialogTitle = 'update';
                this.dialogVisible = true;
            },
            btnCtrl(row, flag){
                let msg = flag === 'run' ? "启用" : "停用";
                runOrStopStationById({
                    id: row.id,
                    flag: flag
                }).then((response) => {
                    this.reloadList();
                    this.$message.success(msg + "操作成功");
                })
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
                this.$refs['stationGroupDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateStationGroup(this.stationGroup).then((response) => {
                            if (response.status == 200) {
                                this.resetStationGroupDialogAndList();
                                this.$message.success(this.$t("table.createSuccess"));
                            } else {
                                this.submitLoading = false;
                                this.$message.error(response.message);
                            }
                        }).catch(error => {
                            this.submitLoading = false;
                            this.$message.error(error);
                        });
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['stationGroupDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateStationGroup(this.stationGroup).then(() => {
                            this.resetStationGroupDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delStationGroups(ids).then((response) => {
                    if (response.status == 200 && response.data) {
                        this.reloadList();
                        this.$message.success(this.$t("table.deleteSuccess"));
                    } else {
                        this.listLoading = false;
                        this.$message.error(response.message)
                    }
                }).catch(error => {
                    this.listLoading = false;
                    this.$message.error(error);
                });
            },
            resetStationGroup(){
                this.stationGroup = {
                    id: undefined,
                    name: undefined,
                    englishName: undefined,
                    abbreviation: undefined,
                    description: undefined,
                    sortNo: undefined,
                    stationGroupClassificationId: undefined
                }
            },
            resetStationGroupDialogAndList(){
                this.closeStationGroupDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeStationGroupDialog() {
                this.dialogVisible = false;
                this.resetStationGroup();
                this.$refs['stationGroupDialogForm'].resetFields();
                let obj = {};
                obj.stopPropagation = () =>{};
                this.$refs.addOrEditStationGroupClassificationCascader.clearValue(obj);
            }
        }
    }
</script>


