<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.pleaseInput') + '时间段'" v-model.trim="listQuery.timeSlot"></el-input>
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
            <el-table :data="preorderTimeList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="时间段" prop="timeSlot"/>
                <el-table-column align="center" label="备注" prop="remark"/>
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
                       :close-on-click-modal="closeOnClickModal" @close="closePreorderTimeDialog">
                <el-form ref="preorderTimeDialogForm" class="deyatech-form" :model="preorderTime" label-position="right"
                         label-width="80px" :rules="preorderTimeRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="时间段" prop="timeSlot">
                                <!--<el-input v-model="preorderTime.timeSlot"></el-input>-->
                                <template slot-scope="scope">
                                    <el-time-picker
                                        format="HH:mm"
                                        value-format="HH:mm"
                                        is-range
                                        editable
                                        v-model="timeSlotArray"
                                        range-separator="——"
                                        start-placeholder="开始时间"
                                        end-placeholder="结束时间"
                                        placeholder="选择时间范围">
                                    </el-time-picker>
                                </template>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')" prop="remark">
                                <el-input type="textarea" v-model="preorderTime.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closePreorderTimeDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getPreorderTimeList,
        createOrUpdatePreorderTime,
        delPreorderTimes
    } from '@/api/number/preorderTime';

    export default {
        name: 'preorderTime',
        data() {
            const timeSlotArrayIsUndefined = (rule, value, callback) => {
                //console.log('value', value)
                //console.log('timeSlotArray', this.timeSlotArray)
                if (typeof(this.timeSlotArray) == "undefined" || !this.timeSlotArray) {
                    callback(new Error('时间范围不能为空'));
                } else {
                    callback();
                }
            };
            return {
                preorderTimeList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    timeSlot: undefined
                },
                preorderTime: {
                    id: undefined,
                    timeSlot: undefined
                },
                timeSlotArray: undefined,
                preorderTimeRules: {
                    timeSlot: [
                        {validator: timeSlotArrayIsUndefined, trigger: 'blur'}
                    ],
                    remark: [
                        {max: 500, message: '最多 500 个字符', trigger: 'blur'}
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
                    create: this.permission.preorderTime_create,
                    update: this.permission.preorderTime_update,
                    delete: this.permission.preorderTime_delete
                };
            }
        },
        created(){
            this.reloadList();
        },
        methods: {
            resetSearch(){
                this.listQuery.timeSlot = undefined;
            },
            searchReloadList(){
                this.listQuery.page = 1;
                this.reloadList();
            },
            reloadList(){
                this.listLoading = true;
                this.preorderTimeList = undefined;
                this.total = undefined;
                getPreorderTimeList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.preorderTimeList = response.data.records;
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
                this.resetPreorderTime();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetPreorderTime();
                if (row.id) {
                    this.preorderTime = deepClone(row);
                } else {
                    this.preorderTime = deepClone(this.selectedRows[0]);
                }
                this.convertTimeSlot(this.preorderTime.timeSlot);
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
                //console.log(JSON.stringify(this.preorderTime));
                //console.log(typeof this.timeSlotArray);
                this.$refs['preorderTimeDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        this.convertTimeSlot(this.timeSlotArray);
                        createOrUpdatePreorderTime(this.preorderTime).then(() => {
                            this.resetPreorderTimeDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['preorderTimeDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        this.convertTimeSlot(this.timeSlotArray);
                        createOrUpdatePreorderTime(this.preorderTime).then(() => {
                            this.resetPreorderTimeDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delPreorderTimes(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetPreorderTime(){
                this.preorderTime = {
                    id: undefined,
                    timeSlot: undefined,
                    timeSlotArray: undefined
                }
            },
            resetPreorderTimeDialogAndList(){
                this.closePreorderTimeDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closePreorderTimeDialog() {
                this.dialogVisible = false;
                this.submitLoading = false;
                this.resetPreorderTime();
                this.$refs['preorderTimeDialogForm'].resetFields();
            },
            convertTimeSlot(date) {
                //console.log(date.constructor);
                if(date instanceof Array) {
                    this.preorderTime.timeSlot = date.join("-");
                } else {
                    this.timeSlotArray = date.split("-");
                }
            }
        }
    }
</script>


