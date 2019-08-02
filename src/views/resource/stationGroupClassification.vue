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

        <el-table :data="stationGroupClassificationList" v-loading.body="listLoading" stripe border highlight-current-row
                  @selection-change="handleSelectionChange" v-if="tableReset">
            <el-table-column type="selection" width="50" align="center"/>
            <el-table-tree-column fixed :expand-all="false" child-key="children" levelKey="level" :indent-size="20"
                                  parentKey="parentId" prop="name" label="分类名称" width="200">
                <template slot-scope="scope">
                    <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                </template>
            </el-table-tree-column>
            <el-table-column align="center" label="英文名称" prop="englishName"/>
            <el-table-column align="center" label="排序号" prop="sortNo"/>
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
                   :close-on-click-modal="closeOnClickModal" @close="closeStationGroupClassificationDialog">
            <el-form ref="stationGroupClassificationDialogForm" class="deyatech-form" :model="stationGroupClassification" label-position="right"
                     label-width="80px" :rules="stationGroupClassificationRules">
                <el-row :gutter="20" :span="24">
                    <el-col :span="12">
                        <el-form-item :label="$t('table.parent')">
                            <el-cascader :options="stationGroupClassificationCascader" v-model="stationGroupClassificationTreePosition"
                                         show-all-levels expand-trigger="click" clearable
                                         change-on-select></el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="分类名称" prop="name">
                            <el-input v-model.trim="stationGroupClassification.name" maxlength="30"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" :span="24">
                    <el-col :span="12">
                        <el-form-item label="排序号" prop="sortNo">
                            <el-input-number v-model.trom="stationGroupClassification.sortNo" :min="1" :max="999" :precision="0" :step="1"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="英文名称" prop="englishName">
                            <el-input v-model.trim="stationGroupClassification.englishName" maxlength="20"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" :span="24">
                    <el-col :span="24">
                        <el-form-item :label="$t('table.remark')">
                            <el-input type="textarea" v-model.trom="stationGroupClassification.remark" :rows="3" maxlength="200"/>
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
        delStationGroupClassifications} from '@/api/resource/stationGroupClassification';
    import {deepClone, setExpanded} from '@/util/util';
    import {mapGetters} from 'vuex';
    import {isEnglish} from '@/util/validate';

    export default {
        name: 'stationGroupClassification',
        data() {
            const checkEnglishName = (rule, value, callback) => {
                if (!isEnglish(value)) {
                    callback(new Error('只能输入英文字母'));
                }
                callback();
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
                stationGroupClassificationRules: {
                    name: [
                        {required: true, message: this.$t("table.pleaseInput") + '分类名称'}
                    ],
                    englishName: [
                        {required: true, message: this.$t("table.pleaseInput") + '分类英文名称'},
                        {validator: checkEnglishName, trigger: ['blur','change']}
                    ],
                    parentId: [
                        {required: true, message: this.$t("table.pleaseInput") + '上级分类编号'}
                    ],
                    sortNo: [
                        {required: true, message: this.$t("table.pleaseInput") + '排序号'}
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
            stationGroupClassificationTreePosition: {
                get() {
                    if (this.stationGroupClassification.treePosition) {
                        return this.stationGroupClassification.treePosition.substr(1).split('&');
                    }
                },
                set(v) {
                    if (v.length > 0) {
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
            reloadList(){
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
                        createOrUpdateStationGroupClassification(this.stationGroupClassification).then(() => {
                            this.lastExpanded = this.stationGroupClassification.treePosition;
                            this.resetStationGroupClassificationDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doUpdate(){
                this.$refs['stationGroupClassificationDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateStationGroupClassification(this.stationGroupClassification).then(() => {
                            this.lastExpanded = this.stationGroupClassification.treePosition;
                            this.resetStationGroupClassificationDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delStationGroupClassifications(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
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


