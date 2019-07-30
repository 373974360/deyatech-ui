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
            <el-table :data="siteList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
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
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="150">
                    <template slot-scope="scope">
                        <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                                   @click.stop.safe="btnUpdate(scope.row)"></el-button>
                        <el-button v-if="btnEnable.manager" title="关联人员" type="primary" icon="iconcaidan1"
                                   :size="btnSize" circle @click.stop.safe="btnSiteUser(scope.row)"></el-button>
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
                       :close-on-click-modal="closeOnClickModal" @close="closeSiteDialog">
                <el-form ref="siteDialogForm" class="deyatech-form" :model="site" label-position="right"
                         label-width="80px" :rules="siteRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="站点名称" prop="siteName">
                                <el-input v-model="site.siteName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="监测地址" prop="siteDomain">
                                <el-input v-model="site.siteDomain"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model="site.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeSiteDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>

            <!-- 关联人员 -->
            <el-dialog title="关联人员" :visible.sync="siteUserDialogVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeSiteUserDialog">
                <el-table ref="siteUserTable" :data="userList" v-loading.body="listLoading" stripe border highlight-current-row @select="selectRowUser"
                          @select-all="selectAllUser">
                    <el-table-column type="selection" width="50" align="center"/>
                    <el-table-column align="center" label="人员姓名" prop="userName"/>
                    <el-table-column align="center" label="手机号" prop="userPhone"/>
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
                               :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="userTotle"
                               @size-change="handleSiteUserSizeChange" @current-change="handleSiteUserCurrentChange">
                </el-pagination>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" :size="btnSize" @click="doSaveSiteUser"
                               :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeSiteUserDialog">{{$t('table.cancel')}}</el-button>
                </div>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getSiteList,
        createOrUpdateSite,
        delSites
    } from '@/api/monitor/site';
    import {
        getManagerList
    } from '@/api/monitor/manager';
    import {
        setSiteUsers,
        listBySiteManager
    } from '@/api/monitor/siteManager';

    export default {
        name: 'site',
        data() {
            return {
                siteList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined
                },
                site: {
                    id: undefined,
                    siteName: undefined,
                    siteDomain: undefined
                },
                siteRules: {
                    siteName: [
                        {required: true, message: this.$t("table.pleaseInput") + '站点名称'}
                    ],
                    siteDomain: [
                        {required: true, message: this.$t("table.pleaseInput") + '监测地址'}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                siteUserDialogVisible: false,
                userList: undefined,
                currentRow: undefined,
                selectAllUserId: [''],
                userTotle: undefined
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
                    create: this.permission.site_create,
                    update: this.permission.site_update,
                    delete: this.permission.site_delete,
                    manager: this.permission.site_user
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
                this.siteList = undefined;
                this.total = undefined;
                getSiteList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.siteList = response.data.records;
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
                this.resetSite();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetSite();
                if (row.id) {
                    this.site = deepClone(row);
                } else {
                    this.site = deepClone(this.selectedRows[0]);
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
                this.$refs['siteDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateSite(this.site).then(() => {
                            this.resetSiteDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['siteDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateSite(this.site).then(() => {
                            this.resetSiteDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delSites(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetSite(){
                this.site = {
                    id: undefined,
                    siteName: undefined,
                    siteDomain: undefined
                }
            },
            resetSiteDialogAndList(){
                this.closeSiteDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeSiteDialog() {
                this.dialogVisible = false;
                this.resetSite();
                this.$refs['siteDialogForm'].resetFields();
            },
            selectRowUser(selection, row) {
                let i = this.selectAllUserId.indexOf(row.id)
                if (i < 0) {
                    this.selectAllUserId.push(row.id)
                } else {
                    this.selectAllUserId.splice(i, 1)
                }
            },
            selectAllUser(selection) {
                if (selection.length > 0) {
                    for (let user of this.userList) {
                        if (this.selectAllUserId.indexOf(user.id) < 0) {
                            this.selectAllUserId.push(user.id)
                        }
                    }
                } else {
                    for (let user of this.userList) {
                        let i = this.selectAllUserId.indexOf(user.id)
                        if (i >= 0) {
                            this.selectAllUserId.splice(i, 1)
                        }
                    }
                }
            },
            handleSiteUserSizeChange(val){
                this.listQuery.size = val;
                this.getManagerList();
            },
            handleSiteUserCurrentChange(val){
                this.listQuery.page = val;
                this.getManagerList();
            },
            getManagerList(){
                this.listLoading = true;
                this.userList = undefined;
                this.userTotle = undefined;
                this.selectAllUserId = [];
                getManagerList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.userList = response.data.records;
                    this.userTotle = response.data.total;
                    this.$nextTick(() => {
                        this.checkSelectSiteManager();
                    });
                });
            },
            btnSiteUser(row){
                this.currentRow = row;
                this.siteUserDialogVisible = true;
                this.getManagerList();
            },
            checkSelectSiteManager(){
                listBySiteManager({siteId:this.currentRow.id}).then(response => {
                    for (let user of response.data) {
                        if (this.selectAllUserId.indexOf(user.managerId) < 0) {
                            this.selectAllUserId.push(user.managerId)
                        }
                    }
                    if (this.selectAllUserId && this.selectAllUserId.length > 0) {
                        for (let users of this.userList) {
                            if (this.selectAllUserId.includes(users.id)) {
                                this.$refs['siteUserTable'].toggleRowSelection(users);
                            }
                        }
                    }
                })
            },
            closeSiteUserDialog() {
                this.siteUserDialogVisible = false;
                this.submitLoading = false;
                this.currentRow = undefined;
            },
            doSaveSiteUser(){
                this.submitLoading = true;
                setSiteUsers(this.currentRow.id, this.selectAllUserId).then(() => {
                    this.closeSiteUserDialog();
                    this.$message.success(this.$t("关联成功"));
                }).catch(() => {
                    this.submitLoading = false;
                })
            }
        }
    }
</script>


