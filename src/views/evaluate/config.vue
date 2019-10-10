<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
<!--            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-select :size="searchSize" v-model="listQuery.level" clearable :placeholder="$t('table.pleaseSelect') + '评价等级'">
                            <el-option
                                v-for="item in evaluationLevelEnum"
                                :key="item.code"
                                :label="item.value"
                                :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.pleaseSelect') + '测评指标编码'" v-model="listQuery.contentCode"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="reloadList">{{$t('table.search')}}</el-button>
                        <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}</el-button>
                    </el-form-item>
                </el-form>
            </div>-->
            <div class="deyatech-menu">
                <div class="deyatech-menu_left">
                    <el-button v-if="btnEnable.create" type="primary" :size="btnSize" @click="btnCreate">{{$t('table.create')}}</el-button>
                    <el-button v-if="btnEnable.update" type="primary" :size="btnSize" @click="btnUpdate" :disabled="selectedRows.length != 1">{{$t('table.update')}}</el-button>
                    <el-button v-if="btnEnable.delete && !callThirdPartyInterface" type="danger" :size="btnSize" @click="btnDeleteByLevel" :disabled="selectedRows.length < 1">{{$t('table.delete')}}</el-button>
                </div>
                <div class="deyatech-menu_right">
                    <!--<el-button type="primary" icon="el-icon-edit" :size="btnSize" circle @click="btnUpdate"></el-button>
                    <el-button type="danger" icon="el-icon-delete" :size="btnSize" circle @click="btnDelete"></el-button>-->
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                </div>
            </div>
            <el-table :data="configList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="评价等级" prop="level">
                    <template slot-scope="scope">
                        <el-rate
                            disabled
                            v-model="scope.row.level | levelParseInt"
                            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                            show-text
                            :texts="['非常不满意', '不满意', '基本满意', '满意', '非常满意']">
                        </el-rate>
                    </template>
                </el-table-column>
<!--                <el-table-column align="center" label="评价等级描述（非常满意、满意等）" prop="description"/>-->
<!--                <el-table-column align="center" label="测评指标编码" prop="contentCode" width="130"/>-->
<!--                <el-table-column align="center" label="测评指标内容" prop="content"/>-->
<!--                <el-table-column align="center" label="组织机构代码" prop="organizationalCode"/>-->
                <!--<el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                            {{scope.row.enable | enums('EnableEnum')}}
                        </el-tag>
                    </template>
                </el-table-column>-->
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="100">
                    <template slot-scope="scope">
                        <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                                   @click.stop.safe="btnUpdate(scope.row)"></el-button>
                        <el-button v-if="btnEnable.delete && !callThirdPartyInterface" :title="$t('table.delete')" type="danger" icon="el-icon-delete" :size="btnSize" circle
                                   @click.stop.safe="btnDeleteByLevel(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
<!--            <el-pagination class="deyatech-pagination pull-right" background
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                           :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>-->


            <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeConfigDialog">
                <el-form ref="configDialogForm" class="deyatech-form" :model="config" label-position="right"
                         label-width="110px" :rules="configRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="评价等级" prop="level">
                                <el-rate
                                    style="margin-top: 10px"
                                    :disabled="dialogTitle == 'update'"
                                    v-model="config.level"
                                    :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                                    show-text
                                    :texts="['非常不满意', '不满意', '基本满意', '满意', '非常满意']">
                                </el-rate>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <div v-if="showFlag" v-for="(content, index) in config.contentList">
                        <div style="border-bottom: 1px solid #dcdfe6; margin-bottom: 30px"></div>

                        <el-row :gutter="20" :span="24">
                            <el-col :span="12">
                                <el-form-item
                                    :label="'测评指标编码'"
                                    :key="content.id"
                                    :prop="'contentList.' + index + '.contentCode'"
                                    :rules="[
                                        {required: true, message: '请输入测评指标编码'},
                                        {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
                                    ]"
                                >
                                    <el-input v-model="content.contentCode"></el-input>

                                </el-form-item>
                            </el-col>
<!--                            <el-col :span="11">
                                <el-form-item
                                    :label="'组织机构代码'"
                                    :key="content.id"
                                    :prop="'contentList.' + index + '.organizationalCode'"
                                    :rules="[
                                        {required: true, message: '请输入组织机构代码'},
                                        {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
                                    ]">
                                    <el-input v-model="content.organizationalCode"></el-input>
                                </el-form-item>
                            </el-col>-->
                            <el-col :span="12">
                                <el-button v-if="!callThirdPartyInterface || (callThirdPartyInterface && !content.id && index > 0)"
                                           :title="$t('table.delete')" type="danger" icon="el-icon-delete" :size="btnSize" circle
                                           @click.prevent="removeContent(content)"></el-button>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" :span="24">
                            <el-col :span="24">
                                <el-form-item
                                    :label="'测评指标内容'"
                                    :key="content.id"
                                    :prop="'contentList.' + index + '.content'"
                                    :rules="[
                                        {required: true, message: '请输入测评指标内容'},
                                        {min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur'}
                                    ]"
                                >
                                    <el-input type="textarea" v-model="content.content" :rows="3"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>

                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-button @click="addContent" type="primary" :size="btnSize" style="float: right; padding-right: 20px">新增测评指标</el-button>
                        </el-col>
                        </el-row>
                    </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeConfigDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {getStore} from '@/util/store';
    import {
        getEvaluateConfig,
        createOrUpdateConfig,
        delConfigs,
        delConfigsByLevel
    } from '@/api/evaluate/config';

    export default {
        name: 'config',
        filters: {
            levelParseInt: function (value) {
                return parseInt(value);
            }
        },
        data() {
            const validateLevel = (rule, value, callback) => {
                if (value == 0) {
                    callback(new Error(this.$t("table.pleaseSelect") + '评价等级'));
                    return;
                } else {
                    for (let e of this.evaluationLevelEnum) {
                        if (value == e.code) {
                            this.config.description = e.value;
                            break;
                        }
                    }
                }
                callback();
            };
            return {
                configList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    contentCode: undefined,
                    level: undefined
                },
                config: {
                    id: undefined,
                    level: undefined,
                    description: undefined,
                    content: undefined,
                    contentCode: undefined,
                    organizationalCode: undefined,
                    contentList: []
                },
                configRules: {
                    level: [
                        {required: true, message: this.$t("table.pleaseSelect") + '评价等级'},
                        {validator: validateLevel, trigger: 'blur'}
                    ],
                    description: [
                        {required: true, message: this.$t("table.pleaseInput") + '评价等级描述（非常满意、满意等）'}
                    ],
                    content: [
                        {required: true, message: this.$t("table.pleaseInput") + '测评指标内容'},
                        {min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur'}
                    ],
                    contentCode: [
                        {required: true, message: this.$t("table.pleaseInput") + '测评指标编码'},
                        {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
                    ],
                    organizationalCode: [
                        {required: true, message: this.$t("table.pleaseInput") + '组织机构代码'},
                        {min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur'}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                evaluationLevelEnum: [],
                levelParseInt: {},
                showFlag: true,
                callThirdPartyInterface: this.$store.state.common.callThirdPartyInterface,
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
                    create: this.permission.config_create,
                    update: this.permission.config_update,
                    delete: this.permission.config_delete
                };
            }
        },
        created(){
            this.evaluationLevelEnum = this.loadEnum('EvaluationLevelEnum');
            this.reloadList();
        },
        methods: {
            loadEnum(name) {
                return getStore({name: 'enums'})[name];
            },
            resetSearch(){
                this.listQuery.contentCode = undefined;
                this.listQuery.level = undefined;
            },
            reloadList(){
                this.listLoading = true;
                this.configList = undefined;
                getEvaluateConfig().then(response => {
                    this.listLoading = false;
                    this.configList = response.data;
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
                this.resetConfig();
                if (this.callThirdPartyInterface) {
                    this.config.contentList.push({
                        id: '',
                        contentCode: '',
                        content: ''
                    });
                }
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetConfig();
                if (row.level) {
                    this.config = deepClone(row);
                } else {
                    this.config = deepClone(this.selectedRows[0]);
                }
                this.config.level = parseInt(this.config.level)
                if (this.config.contentList.length == 1) {
                    this.showFlag = false;
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
                this.$refs['configDialogForm'].validate(valid => {
                    if(valid) {

                        // 测评指标信息
                        const contentInfo = JSON.stringify(this.config.contentList);
                        this.$set(this.config, 'contentInfo', contentInfo);
                        this.$delete(this.config, 'contentList');

                        this.submitLoading = true;
                        createOrUpdateConfig(this.config).then(() => {
                            this.resetConfigDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['configDialogForm'].validate(valid => {
                    if(valid) {

                        // 测评指标信息
                        const contentInfo = JSON.stringify(this.config.contentList);
                        this.$set(this.config, 'contentInfo', contentInfo);
                        this.$delete(this.config, 'contentList');

                        this.submitLoading = true;
                        createOrUpdateConfig(this.config).then(() => {
                            this.resetConfigDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                // this.listLoading = true;
                delConfigs(ids).then(() => {
                    // this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetConfig(){
                this.config = {
                    id: undefined,
                    level: undefined,
                    description: undefined,
                    content: undefined,
                    contentCode: undefined,
                    organizationalCode: undefined,
                    contentList: []
                }
            },
            resetConfigDialogAndList(){
                this.closeConfigDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeConfigDialog() {
                this.dialogVisible = false;
                this.resetConfig();
                this.$refs['configDialogForm'].resetFields();
                this.showFlag = true;
            },
            addContent() {
                if (!this.showFlag) {
                    this.showFlag = true;
                } else {
                    this.config.contentList.push({
                        id: '',
                        contentCode: '',
                        content: ''
                    });
                }
            },
            removeContent(content) {

                // 修改时删除
/*                if (content.id) {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        let ids = []
                        ids.push(content.id);
                        this.doDelete(ids);

                        var index = this.config.contentList.indexOf(content)
                        if (index !== -1) {
                            this.config.contentList.splice(index, 1)
                        }
                    })
                } else {*/
                    var index = this.config.contentList.indexOf(content)
                    if (index !== -1) {
                        this.config.contentList.splice(index, 1)
                    }
                // }
            },
            btnDeleteByLevel(row){
                let levels = [];
                if (row.level) {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        levels.push(row.level);
                        this.doDeleteByLevel(levels);
                    })
                } else {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        for(const deleteRow of this.selectedRows){
                            levels.push(deleteRow.level);
                        }
                        this.doDeleteByLevel(levels);
                    })
                }
            },
            doDeleteByLevel(levels){
                this.listLoading = true;
                delConfigsByLevel(levels).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
        }
    }
</script>


