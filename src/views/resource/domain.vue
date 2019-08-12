<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-select v-model.trim="listQuery.stationGroupId" :size="searchSize" placeholder="请选择站群">
                            <el-option v-for = "o in stationGroups"
                                       :label="o.name"
                                       :value="o.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-input :size="searchSize" placeholder="请输入域名" v-model.trim="listQuery.name" clearable></el-input>
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
            <el-table :data="domainList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="所属站群" prop="stationGroupName"/>
                <el-table-column align="left" label="域名" prop="name">
                    <template slot-scope="scope">
                        <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="英文名" prop="englishName"/>
                <el-table-column align="center" label="端口" prop="port"/>
                <el-table-column align="center" label="排序号" prop="sortNo"/>
                <el-table-column prop="enable" :label="$t('table.enable')" align="center" width="100">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                            {{scope.row.enable == 1 ? "启用" : (scope.row.enable == 0 ? "停用" : "") }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="200">
                    <template slot-scope="scope">
                        <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                                   @click.stop.safe="btnUpdate(scope.row)"></el-button>
                        <el-button v-if="btnEnable.delete" :title="$t('table.delete')" type="danger" icon="el-icon-delete" :size="btnSize" circle :disabled="scope.row.enable == 1"
                                   @click.stop.safe="btnDelete(scope.row)"></el-button>
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
                       :close-on-click-modal="closeOnClickModal" @close="closeDomainDialog">
                <el-form ref="domainDialogForm" class="deyatech-form" :model="domain" label-position="right"
                         label-width="80px" :rules="domainRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="所属站群" prop="stationGroupId">
                                <el-select v-model.trim="domain.stationGroupId" style="width: 100%;">
                                    <el-option v-for = "o in stationGroups"
                                               :label="o.name"
                                               :value="o.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="域名" prop="name">
                                <el-input v-model.trim="domain.name" maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="英文名称" prop="englishName">
                                <el-input v-model.trim="domain.englishName" maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="端口" prop="port">
                                <el-input v-model.trim="domain.port" maxlength="5"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="排序号" prop="sortNo">
                                <el-input v-model.trim="domain.sortNo" maxlength="3"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="描述" prop="description">
                                <el-input type="textarea" v-model.trim="domain.description" :rows="3" maxlength="400"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model.trim="domain.remark" :rows="3" maxlength="400"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeDomainDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getDomainList,
        createOrUpdateDomain,
        delDomains,
        isNameExist,
        isEnglishNameExist,
        runOrStopDomainById
    } from '@/api/resource/domain';
    import {getStore} from '@/util/store';
    import {
        getAllStationGroup
    } from '@/api/resource/stationGroup';
    import {isEnglish} from '@/util/validate';

    export default {
        name: 'domain',
        data() {
            const checkName = (rule, value, callback) => {
                isNameExist({
                    id: this.domain.id,
                    name: this.domain.name}).then(response => {
                    if (response.status == 200 && response.data) {
                        callback(new Error(response.message));
                    } else {
                        callback();
                    }
                }).catch(() => {});
                // this.$refs['domainDialogForm'].validateField('stationGroupId', errorMsg => {
                //     if (!errorMsg) {
                //
                //     } else {
                //         callback(new Error("没有选择所属站群，域名无法校验"));
                //     }
                // });

            };
            const checkEnglishName = (rule, value, callback) => {
                if (!isEnglish(value)) {
                    callback(new Error('只能输入英文字母'));
                    return;
                }
                isEnglishNameExist({
                    id: this.domain.id,
                    englishName: this.domain.englishName}).then(response => {
                    if (response.status == 200 && response.data) {
                        callback(new Error(response.message));
                    } else {
                        callback();
                    }
                }).catch(() => {});
                // this.$refs['domainDialogForm'].validateField('stationGroupClassificationId', errorMsg => {
                //     if (!errorMsg) {
                //
                //     } else {
                //         callback(new Error("没有选择分类，英文名称无法校验"));
                //     }
                // });
            };
            const checkPort = (rule, value, callback) => {
                if (/[^\d]/g.test(value)) {
                    callback(new Error('请输入整数'));
                } else {
                    callback();
                }
            };
            const checkSortNo = (rule, value, callback) => {
                if (/[^\d]/g.test(value)) {
                    callback(new Error('请输入整数'));
                } else {
                    callback();
                }
            };
            return {
                domainList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined,
                    stationGroupId: undefined
                },
                domain: {
                    id: undefined,
                    name: undefined,
                    description: undefined,
                    sortNo: undefined,
                    stationGroupId: undefined,
                    port: undefined
                },
                domainRules: {
                    name: [
                        {required: true, message: this.$t("table.pleaseInput") + '域名名称'},
                        {validator: checkName, trigger: 'blur'}
                    ],
                    englishName: [
                        {required: true, message: this.$t("table.pleaseInput") + '英文名称'},
                        {validator: checkEnglishName, trigger: 'blur'}
                    ],
                    description: [
                        {required: true, message: this.$t("table.pleaseInput") + '描述'}
                    ],
                    sortNo: [
                        {required: true, message: this.$t("table.pleaseInput") + '排序号'},
                        {validator: checkSortNo, trigger: ['blur','change']}
                    ],
                    stationGroupId: [
                        {required: true, message: this.$t("table.pleaseInput") + '所属站群'}
                    ],
                    port: [
                        {required: true, message: this.$t("table.pleaseInput") + '端口'},
                        {validator: checkPort, trigger: ['blur','change']}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                stationGroups: []
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
                    create: this.permission.domain_create,
                    update: this.permission.domain_update,
                    delete: this.permission.domain_delete
                };
            }
        },
        created(){
            this.reloadList();
            this.loadStationGroup();
        },
        methods: {
            loadStationGroup() {
                getAllStationGroup().then(response => {
                    if (response.status == 200) {
                        this.stationGroups = response.data;
                    }
                }).catch(()=>{});
            },
            loadEnum(name) {
                return getStore({name: 'enums'})[name]
            },
            resetSearch(){
                this.listQuery.stationGroupId = undefined;
                this.listQuery.name = undefined;
            },
            reloadList(){
                this.listLoading = true;
                this.domainList = undefined;
                this.total = undefined;
                getDomainList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.domainList = response.data.records;
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
                this.resetDomain();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetDomain();
                if (row.id) {
                    this.domain = deepClone(row);
                } else {
                    this.domain = deepClone(this.selectedRows[0]);
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
            btnCtrl(row, flag){
                let msg = flag === 'run' ? "启用" : "停用";
                this.listLoading = true;
                runOrStopDomainById({
                    id: row.id,
                    flag: flag
                }).then((response) => {
                    if (response.status == 200 && response.data) {
                        this.reloadList();
                        this.$message.success(msg + "操作成功");
                    } else {
                        this.listLoading = false;
                        this.$message.error(msg + "操作失败");
                    }
                }).catch(error=>{
                    this.listLoading = false;
                    this.$message.error(error);
                });
            },
            doCreate(){
                this.$refs['domainDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateDomain(this.domain).then(() => {
                            this.resetDomainDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['domainDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateDomain(this.domain).then(() => {
                            this.resetDomainDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delDomains(ids).then((response) => {
                    if (response.status == 200 && response.data) {
                        this.reloadList();
                        this.$message.success(this.$t("table.deleteSuccess"));
                    } else {
                        this.listLoading = false;
                        this.$message.error("域名删除失败");
                    }
                }).catch(error=>{
                    this.listLoading = false;
                    this.$message.error(error);
                });
            },
            resetDomain(){
                this.domain = {
                    id: undefined,
                    name: undefined,
                    description: undefined,
                    sortNo: undefined,
                    stationGroupId: undefined,
                    port: undefined
                }
            },
            resetDomainDialogAndList(){
                this.closeDomainDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeDomainDialog() {
                this.dialogVisible = false;
                this.resetDomain();
                this.$refs['domainDialogForm'].resetFields();
            }
        }
    }
</script>


