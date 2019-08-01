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
            <el-table :data="preorderList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="预审编号" prop="preauditId"/>
                <el-table-column align="center" label="注册用户编号" prop="memberId"/>
                <el-table-column align="center" label="事项编号" prop="itemId"/>
                <el-table-column align="center" label="时间段编号" prop="timeId"/>
                <el-table-column align="center" label="手机号码" prop="phone"/>
                <el-table-column align="center" label="预约时间" prop="time"/>
                <el-table-column align="center" label="预约渠道 1-最多跑一次平台" prop="channel"/>
                <el-table-column align="center" label="办理地址" prop="address"/>
                <el-table-column align="center" label="是否抽号；1=是；0=否" prop="status"/>
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
                       :close-on-click-modal="closeOnClickModal" @close="closePreorderDialog">
                <el-form ref="preorderDialogForm" class="deyatech-form" :model="preorder" label-position="right"
                         label-width="80px" :rules="preorderRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="预审编号" prop="preauditId">
                                <el-input v-model="preorder.preauditId"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="注册用户编号" prop="memberId">
                                <el-input v-model="preorder.memberId"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="事项编号" prop="itemId">
                                <el-input v-model="preorder.itemId"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="时间段编号" prop="timeId">
                                <el-input v-model="preorder.timeId"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="手机号码" prop="phone">
                                <el-input v-model="preorder.phone"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="预约时间" prop="time">
                                <el-input v-model="preorder.time"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="预约渠道 1-最多跑一次平台" prop="channel">
                                <el-input v-model="preorder.channel"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="办理地址" prop="address">
                                <el-input v-model="preorder.address"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="是否抽号；1=是；0=否" prop="status">
                                <el-input v-model="preorder.status"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model="preorder.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closePreorderDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getPreorderList,
        createOrUpdatePreorder,
        delPreorders
    } from '@/api/number/preorder';

    export default {
        name: 'preorder',
        data() {
            return {
                preorderList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined
                },
                preorder: {
                    id: undefined,
                    preauditId: undefined,
                    memberId: undefined,
                    itemId: undefined,
                    timeId: undefined,
                    phone: undefined,
                    time: undefined,
                    channel: undefined,
                    address: undefined,
                    status: undefined
                },
                preorderRules: {
                    preauditId: [
                        {required: true, message: this.$t("table.pleaseInput") + '预审编号'}
                    ],
                    memberId: [
                        {required: true, message: this.$t("table.pleaseInput") + '注册用户编号'}
                    ],
                    itemId: [
                        {required: true, message: this.$t("table.pleaseInput") + '事项编号'}
                    ],
                    timeId: [
                        {required: true, message: this.$t("table.pleaseInput") + '时间段编号'}
                    ],
                    phone: [
                        {required: true, message: this.$t("table.pleaseInput") + '手机号码'}
                    ],
                    time: [
                        {required: true, message: this.$t("table.pleaseInput") + '预约时间'}
                    ],
                    channel: [
                        {required: true, message: this.$t("table.pleaseInput") + '预约渠道 1-最多跑一次平台'}
                    ],
                    address: [
                        {required: true, message: this.$t("table.pleaseInput") + '办理地址'}
                    ],
                    status: [
                        {required: true, message: this.$t("table.pleaseInput") + '是否抽号；1=是；0=否'}
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
                    create: this.permission.preorder_create,
                    update: this.permission.preorder_update,
                    delete: this.permission.preorder_delete
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
                this.preorderList = undefined;
                this.total = undefined;
                getPreorderList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.preorderList = response.data.records;
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
                this.resetPreorder();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetPreorder();
                if (row.id) {
                    this.preorder = deepClone(row);
                } else {
                    this.preorder = deepClone(this.selectedRows[0]);
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
                this.$refs['preorderDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdatePreorder(this.preorder).then(() => {
                            this.resetPreorderDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['preorderDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdatePreorder(this.preorder).then(() => {
                            this.resetPreorderDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delPreorders(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetPreorder(){
                this.preorder = {
                    id: undefined,
                    preauditId: undefined,
                    memberId: undefined,
                    itemId: undefined,
                    timeId: undefined,
                    phone: undefined,
                    time: undefined,
                    channel: undefined,
                    address: undefined,
                    status: undefined
                }
            },
            resetPreorderDialogAndList(){
                this.closePreorderDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closePreorderDialog() {
                this.dialogVisible = false;
                this.resetPreorder();
                this.$refs['preorderDialogForm'].resetFields();
            }
        }
    }
</script>


