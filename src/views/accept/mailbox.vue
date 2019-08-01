<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" placeholder="请输入设备ID、名称或地址" v-model="listQuery.name"></el-input>
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
            <el-table :data="mailboxList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="设备ID" prop="deviceId"/>
                <el-table-column align="center" label="设备名称" prop="name"/>
                <el-table-column align="center" label="设备地址" prop="address"/>
                <el-table-column align="center" :label="$t('table.remark')" prop="remark"/>
                <el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                            {{scope.row.enable | enums('EnableEnum')}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="150">
                    <template slot-scope="scope">
                        <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                                   @click.stop.safe="btnUpdate(scope.row)"></el-button>
                        <el-button v-if="btnEnable.delete" :title="$t('table.delete')" type="danger" icon="el-icon-delete" :size="btnSize" circle
                                   @click.stop.safe="btnDelete(scope.row)"></el-button>
                        <el-button v-if="btnEnable.info" title="箱格信息" type="primary" icon="el-icon-info"
                                   :size="btnSize" circle @click.stop.safe="getBoxStatus(scope.row)">
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="deyatech-pagination pull-right" background
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                           :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>


            <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeMailboxDialog">
                <el-form ref="mailboxDialogForm" class="deyatech-form" :model="mailbox" label-position="right"
                         label-width="80px" :rules="mailboxRules">
                    <el-row :gutter="20" :span="24" style="margin-left: 30px">
                        <el-col :span="11">
                            <el-form-item label="设备ID" prop="deviceId">
                                <el-input v-model="mailbox.deviceId"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="设备名称" prop="name">
                                <el-input v-model="mailbox.name"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24" style="margin-left: 30px">
                        <el-col :span="22">
                            <el-form-item label="设备地址" prop="address">
                                <el-input v-model="mailbox.address"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24" style="margin-left: 30px">
                        <el-col :span="22">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model="mailbox.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeMailboxDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getMailboxList,
        createOrUpdateMailbox,
        delMailboxes
    } from '@/api/accept/mailbox';
    import {
        boxStatus
    } from "../../api/mailbox";

    export default {
        name: 'mailbox',
        data() {
            return {
                mailboxList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined
                },
                mailbox: {
                    id: undefined,
                    deviceId: undefined,
                    name: undefined,
                    address: undefined
                },
                mailboxRules: {
                    deviceId: [
                        {required: true, message: this.$t("table.pleaseInput") + '设备ID'}
                    ],
                    name: [
                        {required: true, message: this.$t("table.pleaseInput") + '设备名称'}
                    ],
                    address: [
                        {required: true, message: this.$t("table.pleaseInput") + '设备地址'},
                        {max: 50, message: '最多 50 个字符', trigger: 'blur'}
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
                    create: this.permission.mailbox_create,
                    update: this.permission.mailbox_update,
                    delete: this.permission.mailbox_delete,
                    info: this.permission.mailbox_info
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
                this.mailboxList = undefined;
                this.total = undefined;
                getMailboxList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.mailboxList = response.data.records;
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
                this.resetMailbox();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetMailbox();
                if (row.id) {
                    this.mailbox = deepClone(row);
                } else {
                    this.mailbox = deepClone(this.selectedRows[0]);
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
                this.$refs['mailboxDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateMailbox(this.mailbox).then(() => {
                            this.resetMailboxDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['mailboxDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateMailbox(this.mailbox).then(() => {
                            this.resetMailboxDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delMailboxes(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            getBoxStatus(row) {
                boxStatus(row.deviceId).then(response => {
                    let boxStatus = response.data;
                    if (boxStatus) {
                        const h = this.$createElement;
                        this.$msgbox({
                            title: '箱格状态',
                            message: h('div', null, [
                                h('p', { style: 'font-size: 16px' }, '小箱数量：' + boxStatus.small),
                                h('p', { style: 'font-size: 16px' }, '中箱数量：' + boxStatus.medium),
                                h('p', { style: 'font-size: 16px' }, '大箱数量：' + boxStatus.big)
                            ]),
                            confirmButtonText: '确定'
                        })
                    }
                })
            },
            resetMailbox(){
                this.mailbox = {
                    id: undefined,
                    deviceId: undefined,
                    name: undefined,
                    address: undefined
                }
            },
            resetMailboxDialogAndList(){
                this.closeMailboxDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeMailboxDialog() {
                this.dialogVisible = false;
                this.resetMailbox();
                this.$refs['mailboxDialogForm'].resetFields();
            }
        }
    }
</script>


