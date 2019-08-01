<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.searchName')" v-model.trim="listQuery.windowName"></el-input>
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
            <el-table :data="workInputList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="窗口名称" prop="windowName"/>
                <el-table-column align="center" label="办件量" prop="count"/>
                <el-table-column align="center" label="办件时间" prop="inputTime"/>
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
                       :close-on-click-modal="closeOnClickModal" @close="closeWorkInputDialog">
                <el-form ref="workInputDialogForm" class="deyatech-form" :model="workInput" label-position="right"
                         label-width="80px" :rules="workInputRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="窗口名称" prop="windowName">
                                <el-input v-model.trim="workInput.windowName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="办件量" prop="count">
                                <el-input v-model.trim="workInput.count"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="办件时间" prop="inputTime">
                                <!--<el-input v-model="workInput.inputTime"></el-input>-->
                                <el-date-picker
                                    v-model="workInput.inputTime"
                                    type="datetime"
                                    placeholder="选择日期时间"
                                    value-format="yyyy-MM-dd HH:mm:ss">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model.trim="workInput.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeWorkInputDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getWorkInputList,
        createOrUpdateWorkInput,
        delWorkInputs
    } from '@/api/number/workInput';
    import {isStartOrEndWithWhiteSpace} from "@/util/validate";

    export default {
        name: 'workInput',
        data() {
            const isWhiteSpace = (rule, value, callback) => {
                //console.log('value', value)
                if (isStartOrEndWithWhiteSpace(value)) {
                    callback(new Error('输入空白字符无效'));
                } else {
                    callback();
                }
            };
            const isInteger = (rule, value, callback) => {
                //console.log('value', value)
                if (!value) {
                    return callback(new Error('输入不可以为空'));
                }
                setTimeout(() => {
                    if (!Number(value)) {
                        callback(new Error('请输入正整数'));
                    } else {
                        const re = /^[0-9]*[1-9][0-9]*$/;
                        const rsCheck = re.test(value);
                        if (!rsCheck) {
                            callback(new Error('请输入正整数'));
                        } else if(value > 1000000) {
                            callback(new Error('超出范围(0-1000000)，请重新输入'));
                        } else {
                            callback();
                        }
                    }
                }, 0);
            };
            return {
                workInputList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    windowName: undefined
                },
                workInput: {
                    id: undefined,
                    windowName: undefined,
                    count: undefined,
                    inputTime: undefined
                },
                workInputRules: {
                    windowName: [
                        {required: true, message: this.$t("table.pleaseInput") + '窗口名称'},
                        {validator: isWhiteSpace, trigger: 'blur'},
                        {max: 50, message: '最多 50 个字符', trigger: 'blur'}
                    ],
                    count: [
                        {validator: isInteger, trigger: 'blur'}
                    ],
                    inputTime: [
                        {required: true, message: this.$t("table.pleaseInput") + '办件时间'}
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
                    create: this.permission.workInput_create,
                    update: this.permission.workInput_update,
                    delete: this.permission.workInput_delete
                };
            }
        },
        created(){
            this.reloadList();
        },
        methods: {
            resetSearch(){
                this.listQuery.windowName = undefined;
            },
            searchReloadList(){
                this.listQuery.page = 1;
                this.reloadList();
            },
            reloadList(){
                this.listLoading = true;
                this.workInputList = undefined;
                this.total = undefined;
                getWorkInputList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.workInputList = response.data.records;
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
                this.resetWorkInput();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetWorkInput();
                if (row.id) {
                    this.workInput = deepClone(row);
                } else {
                    this.workInput = deepClone(this.selectedRows[0]);
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
                this.$refs['workInputDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateWorkInput(this.workInput).then(() => {
                            this.resetWorkInputDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['workInputDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateWorkInput(this.workInput).then(() => {
                            this.resetWorkInputDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delWorkInputs(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetWorkInput(){
                this.workInput = {
                    id: undefined,
                    windowName: undefined,
                    count: undefined,
                    inputTime: undefined
                }
            },
            resetWorkInputDialogAndList(){
                this.closeWorkInputDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeWorkInputDialog() {
                this.dialogVisible = false;
                this.resetWorkInput();
                this.$refs['workInputDialogForm'].resetFields();
            }
        }
    }
</script>


