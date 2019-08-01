<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.searchName')" v-model="listQuery.name"></el-input>
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
                    <!--<el-button type="primary" icon="el-icon-edit" :size="btnSize" circle @click="btnUpdate"></el-button>
                    <el-button type="danger" icon="el-icon-delete" :size="btnSize" circle @click="btnDelete"></el-button>-->
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                </div>
            </div>
            <el-table :data="handlingRecordList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="办件编号" prop="workNo"/>
                <el-table-column align="center" label="事项编号" prop="itemId"/>
                <el-table-column align="center" label="材料关联信息版本" prop="materialsVersion"/>
                <el-table-column align="center" label="是否是注册用户" prop="memberAble"/>
                <el-table-column align="center" label="前台用户编号" prop="memberId"/>
                <el-table-column align="center" label="阿里办件编号" prop="aliId"/>
                <el-table-column align="center" label="受理详情" prop="detail"/>
                <el-table-column align="center" label="办件状态" prop="status"/>
                <el-table-column align="center" label="办结时间" prop="finishTime"/>
                <el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                            {{scope.row.enable | enums('EnableEnum')}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="100">
                    <template slot-scope="scope">
                        <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                                   @click.stop.safe="btnUpdate(scope.row)"></el-button>
                        <el-button v-if="btnEnable.delete" :title="$t('table.delete')" type="danger" icon="el-icon-delete" :size="btnSize" circle
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
                       :close-on-click-modal="closeOnClickModal" @close="closeHandlingRecordDialog">
                <el-form ref="handlingRecordDialogForm" class="deyatech-form" :model="handlingRecord" label-position="right"
                         label-width="80px" :rules="handlingRecordRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="办件编号" prop="workNo">
                                <el-input v-model="handlingRecord.workNo"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="事项编号" prop="itemId">
                                <el-input v-model="handlingRecord.itemId"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="材料关联信息版本" prop="materialsVersion">
                                <el-input v-model="handlingRecord.materialsVersion"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="是否是注册用户" prop="memberAble">
                                <el-input v-model="handlingRecord.memberAble"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="前台用户编号" prop="memberId">
                                <el-input v-model="handlingRecord.memberId"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="阿里办件编号" prop="aliId">
                                <el-input v-model="handlingRecord.aliId"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="受理详情" prop="detail">
                                <el-input v-model="handlingRecord.detail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="办件状态" prop="status">
                                <el-input v-model="handlingRecord.status"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="办结时间" prop="finishTime">
                                <el-input v-model="handlingRecord.finishTime"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model="handlingRecord.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeHandlingRecordDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getHandlingRecordList,
        createOrUpdateHandlingRecord,
        delHandlingRecords
    } from '@/api/handling/handlingRecord';

    export default {
        name: 'handlingRecord',
        data() {
            return {
                handlingRecordList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined
                },
                handlingRecord: {
                    id: undefined,
                    workNo: undefined,
                    itemId: undefined,
                    materialsVersion: undefined,
                    memberAble: undefined,
                    memberId: undefined,
                    aliId: undefined,
                    detail: undefined,
                    status: undefined,
                    finishTime: undefined
                },
                handlingRecordRules: {
                    workNo: [
                        {required: true, message: this.$t("table.pleaseInput") + '办件编号'}
                    ],
                    itemId: [
                        {required: true, message: this.$t("table.pleaseInput") + '事项编号'}
                    ],
                    materialsVersion: [
                        {required: true, message: this.$t("table.pleaseInput") + '材料关联信息版本'}
                    ],
                    memberAble: [
                        {required: true, message: this.$t("table.pleaseInput") + '是否是注册用户'}
                    ],
                    memberId: [
                        {required: true, message: this.$t("table.pleaseInput") + '前台用户编号'}
                    ],
                    aliId: [
                        {required: true, message: this.$t("table.pleaseInput") + '阿里办件编号'}
                    ],
                    detail: [
                        {required: true, message: this.$t("table.pleaseInput") + '受理详情'}
                    ],
                    status: [
                        {required: true, message: this.$t("table.pleaseInput") + '办件状态'}
                    ],
                    finishTime: [
                        {required: true, message: this.$t("table.pleaseInput") + '办结时间'}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false
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
                    create: this.permission.handlingRecord_create,
                    update: this.permission.handlingRecord_update,
                    delete: this.permission.handlingRecord_delete
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
                this.handlingRecordList = undefined;
                this.total = undefined;
                getHandlingRecordList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.handlingRecordList = response.data.records;
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
                this.resetHandlingRecord();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetHandlingRecord();
                if (row.id) {
                    this.handlingRecord = deepClone(row);
                } else {
                    this.handlingRecord = deepClone(this.selectedRows[0]);
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
                this.$refs['handlingRecordDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateHandlingRecord(this.handlingRecord).then(() => {
                            this.resetHandlingRecordDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['handlingRecordDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateHandlingRecord(this.handlingRecord).then(() => {
                            this.resetHandlingRecordDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delHandlingRecords(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetHandlingRecord(){
                this.handlingRecord = {
                    id: undefined,
                    workNo: undefined,
                    itemId: undefined,
                    materialsVersion: undefined,
                    memberAble: undefined,
                    memberId: undefined,
                    aliId: undefined,
                    detail: undefined,
                    status: undefined,
                    finishTime: undefined
                }
            },
            resetHandlingRecordDialogAndList(){
                this.closeHandlingRecordDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeHandlingRecordDialog() {
                this.dialogVisible = false;
                this.resetHandlingRecord();
                this.$refs['handlingRecordDialogForm'].resetFields();
            }
        }
    }
</script>


