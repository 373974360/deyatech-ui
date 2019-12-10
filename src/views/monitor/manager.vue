<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.searchName')" v-model.trim="listQuery.name" maxlength="100"></el-input>
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
            <el-table :data="managerList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="人员姓名" prop="userName"/>
                <el-table-column align="center" label="手机号" prop="userPhone"/>
                <!--<el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                            {{scope.row.enable | enums('EnableEnum')}}
                        </el-tag>
                    </template>
                </el-table-column>-->
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="150">
                    <template slot-scope="scope">
                        <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                                   @click.stop.safe="btnUpdate(scope.row)"></el-button>
                        <el-button v-if="btnEnable.manager" title="关联站点" type="primary" icon="iconcaidan1"
                                   :size="btnSize" circle @click.stop.safe="btnManagerSite(scope.row)"></el-button>
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
                       :close-on-click-modal="closeOnClickModal" @close="closeManagerDialog">
                <el-form ref="managerDialogForm" class="deyatech-form" :model="manager" label-position="right"
                         label-width="80px" :rules="managerRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="人员姓名" prop="userName">
                                <el-input v-model.trim="manager.userName" maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="手机号" prop="userPhone">
                                <el-input v-model.trim="manager.userPhone" maxlength="11"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model.trim="manager.remark" :rows="3" maxlength="500"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeManagerDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>

            <!-- 关联站点 -->
            <el-dialog title="关联站点" :visible.sync="managerSiteDialogVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeManagerSiteDialog">
                <el-table ref="groupSiteTable" :data="siteList" v-loading.body="listLoading" stripe border highlight-current-row @select="selectRowSite"
                          @select-all="selectAllSite">
                    <el-table-column type="selection" width="50" align="center"/>
                    <el-table-column align="center" label="站点名称" prop="siteName"/>
                    <el-table-column align="center" label="监测地址" prop="siteDomain"/>
                    <el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                                {{scope.row.enable | enums('EnableEnum')}}
                            </el-tag>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination class="deyatech-pagination pull-right" background
                               :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                               :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="siteTotle"
                               @size-change="handleManagerSiteSizeChange" @current-change="handleManagerSiteCurrentChange">
                </el-pagination>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" :size="btnSize" @click="doSaveManagerSite"
                               :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeManagerSiteDialog">{{$t('table.cancel')}}</el-button>
                </div>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getManagerList,
        createOrUpdateManager,
        delManagers
    } from '@/api/monitor/manager';
    import {
        getSiteList
    } from '@/api/monitor/site';
    import {
        setUserSites,
        listBySiteManager
    } from '@/api/monitor/siteManager';
    import {isMobile} from '@/util/validate';

    export default {
        name: 'manager',
        data() {
            const checkUserPhone = (rule, value, callback) => {
                if (isMobile(value)) {
                    callback();
                } else {
                    callback(new Error('手机号不正确'));
                }
            };
            return {
                managerList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined
                },
                manager: {
                    id: undefined,
                    userName: undefined,
                    userPhone: undefined
                },
                managerRules: {
                    userName: [
                        {required: true, message: this.$t("table.pleaseInput") + '管理员姓名'}
                    ],
                    userPhone: [
                        {required: true, message: this.$t("table.pleaseInput") + '管理员手机号'},
                        {validator: checkUserPhone, trigger: ['change','blur']}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                managerSiteDialogVisible: false,
                siteList: undefined,
                currentRow: undefined,
                selectAllSiteId: [''],
                siteTotle: undefined
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
                    create: this.permission.monitor_manager_create,
                    update: this.permission.monitor_manager_update,
                    delete: this.permission.monitor_manager_delete,
                    manager: this.permission.monitor_site_user
                };
            }
        },
        created(){
            this.$store.state.common.selectSiteDisplay = false;
            this.reloadList();
        },
        methods: {
            resetSearch(){
                this.listQuery.name = undefined;
            },
            reloadList(){
                this.listLoading = true;
                this.managerList = undefined;
                this.total = undefined;
                getManagerList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.managerList = response.data.records;
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
                this.resetManager();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetManager();
                if (row.id) {
                    this.manager = deepClone(row);
                } else {
                    this.manager = deepClone(this.selectedRows[0]);
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
                this.$refs['managerDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateManager(this.manager).then(() => {
                            this.resetManagerDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['managerDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateManager(this.manager).then(() => {
                            this.resetManagerDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delManagers(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetManager(){
                this.manager = {
                    id: undefined,
                    userName: undefined,
                    userPhone: undefined
                }
            },
            resetManagerDialogAndList(){
                this.closeManagerDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeManagerDialog() {
                this.dialogVisible = false;
                this.resetManager();
                this.$refs['managerDialogForm'].resetFields();
            },
            selectRowSite(selection, row) {
                let i = this.selectAllSiteId.indexOf(row.id)
                if (i < 0) {
                    this.selectAllSiteId.push(row.id)
                } else {
                    this.selectAllSiteId.splice(i, 1)
                }
            },
            selectAllSite(selection) {
                if (selection.length > 0) {
                    for (let site of this.siteList) {
                        if (this.selectAllSiteId.indexOf(site.id) < 0) {
                            this.selectAllSiteId.push(site.id)
                        }
                    }
                } else {
                    for (let site of this.siteList) {
                        let i = this.selectAllSiteId.indexOf(site.id)
                        if (i >= 0) {
                            this.selectAllSiteId.splice(i, 1)
                        }
                    }
                }
            },
            handleManagerSiteSizeChange(val){
                this.listQuery.size = val;
                this.getSiteList();
            },
            handleManagerSiteCurrentChange(val){
                this.listQuery.page = val;
                this.getSiteList();
            },
            getSiteList(){
                this.listLoading = true;
                this.siteList = undefined;
                this.siteTotle = undefined;
                this.selectAllSiteId = [];
                getSiteList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.siteList = response.data.records;
                    this.siteTotle = response.data.total;
                    this.$nextTick(() => {
                        this.checkSelectManagerSite();
                    });
                });
            },
            btnManagerSite(row){
                this.currentRow = row;
                this.managerSiteDialogVisible = true;
                this.getSiteList();
            },
            checkSelectManagerSite(){
                listBySiteManager({managerId:this.currentRow.id}).then(response => {
                    for (let site of response.data) {
                        if (this.selectAllSiteId.indexOf(site.siteId) < 0) {
                            this.selectAllSiteId.push(site.siteId)
                        }
                    }
                    if (this.selectAllSiteId && this.selectAllSiteId.length > 0) {
                        for (let sites of this.siteList) {
                            if (this.selectAllSiteId.includes(sites.id)) {
                                this.$refs['groupSiteTable'].toggleRowSelection(sites);
                            }
                        }
                    }
                })
            },
            closeManagerSiteDialog() {
                this.managerSiteDialogVisible = false;
                this.submitLoading = false;
                this.currentRow = undefined;
            },
            doSaveManagerSite(){
                this.submitLoading = true;
                setUserSites(this.currentRow.id, this.selectAllSiteId).then(() => {
                    this.closeManagerSiteDialog();
                    this.$message.success(this.$t("关联成功"));
                }).catch(() => {
                    this.submitLoading = false;
                })
            }
        }
    }
</script>


