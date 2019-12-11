<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" placeholder="关键字" v-model.trim="listQuery.groupName" maxlength="100"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-select :size="searchSize" placeholder="请选择触发模式" v-model.trim="listQuery.triggerType">
                            <el-option label="固定时刻" value="1">固定时刻</el-option>
                            <el-option label="日历周期" value="2">日历周期</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select :size="searchSize" placeholder="请选择任务状态" v-model.trim="listQuery.runType">
                            <el-option label="运行中" value="1">运行中</el-option>
                            <el-option label="空闲" value="2">空闲</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="btnSearch">{{$t('table.search')}}</el-button>
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
            <el-table :data="groupList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="任务名称" prop="groupName"/>
                <el-table-column align="center" label="触发模式" prop="triggerType">
                    <template slot-scope="scope">
                        <span v-if="scope.row.triggerType == 1">
                            固定时刻
                        </span>
                        <span v-if="scope.row.triggerType == 2">
                            日历周期
                        </span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="任务状态" prop="runType">
                    <template slot-scope="scope">
                        <span v-if="scope.row.runType == 1">
                            <el-tag type="danger">运行中</el-tag>
                        </span>
                        <span v-if="scope.row.runType == 2">
                           <el-tag type="success">空闲</el-tag>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="运行时间" prop="lastDtime">
                    <template slot-scope="scope">
                        {{scope.row.lastDtime ? scope.row.lastDtime.substr(0, 16) : ''}}
                    </template>
                </el-table-column>
                <!--<el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                            {{scope.row.enable | enums('EnableEnum')}}
                        </el-tag>
                    </template>
                </el-table-column>-->
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="150">
                    <template slot-scope="scope">
                        <div style="padding-top: 8px;">
                            <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                                       @click.stop.safe="btnUpdate(scope.row)" style="margin-right:10px"></el-button>
                            <el-badge :hidden="scope.row.siteNum <= 0 || !btnEnable.manager" :value="scope.row.siteNum"
                                      :max="99" style="margin-right:20px">
                                <el-button v-if="btnEnable.manager" title="关联站点" type="primary" icon="iconcaidan1"
                                           :size="btnSize" circle @click.stop.safe="btnGroupSite(scope.row)"></el-button>
                            </el-badge>
                            <el-button v-if="btnEnable.delete" :title="$t('table.delete')" type="danger" icon="el-icon-delete" :size="btnSize" circle
                                       @click.stop.safe="btnDelete(scope.row)"></el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="deyatech-pagination pull-right" background
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                           :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>


            <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeGroupDialog">
                <el-form ref="groupDialogForm" class="deyatech-form" :model="group" label-position="right"
                         label-width="80px" :rules="groupRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="任务名称" prop="groupName">
                                <el-input v-model.trim="group.groupName" maxlength="100"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="触发模式" prop="triggerType">
                                <el-radio-group v-model.trim="group.triggerType" @change="changeTriggerType">
                                    <el-radio :label="1" border>固定时刻</el-radio>
                                    <el-radio :label="2" border>日历周期</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="触发类型" prop="calendarType">
                                <el-radio-group v-model.trim="group.calendarType" @change="changeCalendarType" :disabled="calendarTypeDisabled">
                                    <el-radio :label="1" border>每日</el-radio>
                                    <el-radio :label="2" border>每周</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="间隔时间" prop="incrementSeconds">
                                <el-input v-model.trim="group.incrementSeconds" :disabled="incrementSecondsDisabled" maxlength="10"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="触发时间" prop="calendarTime">
                                <el-time-select
                                    v-model.trim="group.calendarTime"
                                    :picker-options="{
                                        start: '00:00',
                                        step: '00:30',
                                        end: '24:00'
                                     }"
                                    placeholder="时间点" :disabled="calendarTimeDisabled">
                                </el-time-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="每周" prop="calendarWorkday">
                                <el-checkbox-group v-model.trim="group.calendarWorkday" :disabled="calendarWorkdayDisabled">
                                    <el-checkbox label="1">周一</el-checkbox>
                                    <el-checkbox label="2">周二</el-checkbox>
                                    <el-checkbox label="3">周三</el-checkbox>
                                    <el-checkbox label="4">周四</el-checkbox>
                                    <el-checkbox label="5">周五</el-checkbox>
                                    <el-checkbox label="6">周六</el-checkbox>
                                    <el-checkbox label="7">周日</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model.trim="group.remark" :rows="3" maxlength="500"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeGroupDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>

            <!-- 关联站点 -->
            <el-dialog title="关联站点" :visible.sync="groupSiteDialogVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeGroupSiteDialog">
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
                               @size-change="handleGroupSiteSizeChange" @current-change="handleGroupSiteCurrentChange">
                </el-pagination>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" :size="btnSize" @click="doSaveGroupSite"
                               :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeGroupSiteDialog">{{$t('table.cancel')}}</el-button>
                </div>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import moment from 'moment';
    import {
        getGroupList,
        createOrUpdateGroup,
        delGroups
    } from '@/api/monitor/group';
    import {
        getSiteList
    } from '@/api/monitor/site';
    import {
        setGroupSites,
        listByGroupSite
    } from '@/api/monitor/groupSite';

    export default {
        name: 'group',
        data() {
            const checkIncrementSeconds = (rule, value, callback) => {
                if (!value) {
                    callback();
                }
                if (/[^\d]/.test(value)) {
                    callback(new Error('请输入正整数'))
                } else {
                    callback();
                }
            };
            return {
                calendarTypeDisabled: true,
                incrementSecondsDisabled: false,
                calendarTimeDisabled: true,
                calendarWorkdayDisabled: true,
                groupList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    groupName: undefined,
                    triggerType: undefined,
                    runType: undefined
                },
                group: {
                    id: undefined,
                    groupName: undefined,
                    triggerType: 1,
                    incrementSeconds: undefined,
                    calendarTime: '00:00',
                    calendarType: 1,
                    calendarWorkday: [],
                    runType: 2,
                    nextDtime: undefined
                },
                groupRules: {
                    groupName: [
                        {required: true, message: this.$t("table.pleaseInput") + '任务组名称'}
                    ],
                    incrementSeconds: [
                        {validator: checkIncrementSeconds, trigger: ['change','blur']}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                groupSiteDialogVisible: false,
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
                'btnSize',
                'dicts'
            ]),
            btnEnable() {
                return {
                    create: this.permission.monitor_group_create,
                    update: this.permission.monitor_group_update,
                    delete: this.permission.monitor_group_delete,
                    manager: this.permission.monitor_group_site
                };
            }
        },
        created(){
            this.$store.state.common.selectSiteDisplay = false;
            this.reloadList();
        },
        methods: {
            changeTriggerType(e){
                if(e==1){
                    this.incrementSecondsDisabled = false;
                    this.calendarTypeDisabled = true;
                    this.calendarTimeDisabled = true;
                    this.calendarWorkdayDisabled = true;
                }
                else if(e==2){
                    this.incrementSecondsDisabled = true;
                    this.calendarTypeDisabled = false;
                    this.calendarTimeDisabled = false;
                    this.calendarWorkdayDisabled = true;
                }
                this.$set(this.group, 'incrementSeconds', undefined);
                this.group.calendarTime = '00:00';
                this.group.calendarType = 1;
                this.group.calendarWorkday = [];
                console.dir(this.group);
            },
            changeCalendarType(e){
                if(e==1){
                    this.calendarWorkdayDisabled = true;
                }
                if(e==2){
                    this.calendarWorkdayDisabled = false;
                }
                this.group.calendarWorkday = [];
            },
            btnSearch(){
                this.listQuery.page = 1;
                this.reloadList();
            },
            resetSearch(){
                this.listQuery.groupName = undefined;
                this.listQuery.triggerType = undefined;
                this.listQuery.runType = undefined;
            },
            reloadList(){
                this.listLoading = true;
                this.groupList = undefined;
                getGroupList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.groupList = response.data.records;
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
                this.resetGroup();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
                this.incrementSecondsDisabled = false;
                this.calendarTypeDisabled = true;
                this.calendarTimeDisabled = true;
                this.calendarWorkdayDisabled = true;
            },
            btnUpdate(row){
                this.resetGroup();
                if (row.id) {
                    this.group = deepClone(row);
                } else {
                    this.group = deepClone(this.selectedRows[0]);
                }
                if(this.group.triggerType==1){
                    this.incrementSecondsDisabled = false;
                    this.calendarTypeDisabled = true;
                    this.calendarTimeDisabled = true;
                    this.calendarWorkdayDisabled = true;
                }
                else if(this.group.triggerType==2){
                    this.incrementSecondsDisabled = true;
                    this.calendarTypeDisabled = false;
                    this.calendarTimeDisabled = false;
                    this.calendarWorkdayDisabled = true;
                }
                if(this.group.calendarType==1){
                    this.calendarWorkdayDisabled = true;
                    this.group.calendarWorkday = [];
                }
                else if(this.group.calendarType==2){
                    this.calendarWorkdayDisabled = false;
                    if(this.group.calendarWorkday){
                        this.group.calendarWorkday = this.group.calendarWorkday.split(",");
                    }else{
                        this.group.calendarWorkday = [];
                    }
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
                this.$refs['groupDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        if(this.group.calendarWorkday!=undefined&&this.group.calendarWorkday!=""){
                            this.group.calendarWorkday = this.group.calendarWorkday.join(",");
                        }
                        createOrUpdateGroup(this.group).then(() => {
                            this.resetGroupDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                console.dir(this.group);
                this.$refs['groupDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;

                        if(this.group.calendarWorkday){
                            this.group.calendarWorkday = this.group.calendarWorkday.join(",");
                        }
                        this.group.nextDtime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss").toString();

                        createOrUpdateGroup(this.group).then(() => {
                            this.resetGroupDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delGroups(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetGroup(){
                this.group = {
                    id: undefined,
                    groupName: undefined,
                    triggerType: 1,
                    incrementSeconds: undefined,
                    calendarTime: '00:00',
                    calendarType: 1,
                    calendarWorkday: [],
                    runType: 2,
                    nextDtime: undefined
                }
            },
            resetGroupDialogAndList(){
                this.closeGroupDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeGroupDialog() {
                this.dialogVisible = false;
                this.resetGroup();
                this.$refs['groupDialogForm'].resetFields();
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
            handleGroupSiteSizeChange(val){
                this.listQuery.size = val;
                this.getSiteList();
            },
            handleGroupSiteCurrentChange(val){
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
                        this.checkSelectGroupSite();
                    });
                });
            },
            btnGroupSite(row){
                this.currentRow = row;
                this.groupSiteDialogVisible = true;
                this.getSiteList();
            },
            checkSelectGroupSite(){
                listByGroupSite({groupId:this.currentRow.id}).then(response => {
                    for (let user of response.data) {
                        if (this.selectAllSiteId.indexOf(user.siteId) < 0) {
                            this.selectAllSiteId.push(user.siteId)
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
            closeGroupSiteDialog() {
                this.groupSiteDialogVisible = false;
                this.submitLoading = false;
                this.currentRow = undefined;
            },
            doSaveGroupSite(){
                this.submitLoading = true;
                setGroupSites(this.currentRow.id, this.selectAllSiteId).then(() => {
                    this.closeGroupSiteDialog();
                    this.reloadList();
                    this.$message.success(this.$t("关联成功"));
                }).catch(() => {
                    this.submitLoading = false;
                })
            }
        }
    }
</script>


