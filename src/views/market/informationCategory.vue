<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <!--<div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.searchName')" v-model.trim="listQuery.name"></el-input>
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
                    <el-button v-if="btnEnable.delete" type="danger" :size="btnSize" @click="btnDelete" :disabled="selectedRows.length < 1">{{$t('table.delete')}}</el-button>
                </div>
                <div class="deyatech-menu_right">
                    <!--<el-button type="primary" icon="el-icon-edit" :size="btnSize" circle @click="btnUpdate"></el-button>
                    <el-button type="danger" icon="el-icon-delete" :size="btnSize" circle @click="btnDelete"></el-button>-->
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                </div>
            </div>
            <el-table :data="informationCategoryList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="中文名称" prop="name">
                    <template slot-scope="scope">
                        <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="英文名称" prop="enName"/>
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
                       :close-on-click-modal="closeOnClickModal" @close="closeInformationCategoryDialog">
                <el-form ref="informationCategoryDialogForm" class="deyatech-form" :model="informationCategory" label-position="right"
                         label-width="80px" :rules="informationCategoryRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="中文名称" prop="name">
                                <el-input v-model.trim="informationCategory.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="英文名称" prop="enName">
                                <el-input v-model.trim="informationCategory.enName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')" prop="remark">
                                <el-input type="textarea" v-model.trim="informationCategory.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeInformationCategoryDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import pinyin from 'pinyin';
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getInformationCategoryList,
        createOrUpdateInformationCategory,
        delInformationCategorys,
        isExistName,
    } from '@/api/market/informationCategory';
    import {isChinese, isEnglishName} from '@/util/validate';

    export default {
        name: 'informationCategory',
        data() {
            const validateName = (rule, value, callback) => {
                if (!isChinese(value)) {
                    callback(new Error('只能输入中文'))
                } else {
                    const query = {
                        id: this.informationCategory.id,
                        name : value
                    }
                    isExistName(query).then(response => {
                        if (response.status == 200) {
                            if (response.data) {
                                callback(new Error("中文名称已存在"));
                            } else {
                                this.informationCategory.enName = pinyin(value, {
                                    style: pinyin.STYLE_FIRST_LETTER
                                }).join('')
                                callback()
                            }
                        } else {
                            callback(new Error('检查名称重复失败'))
                        }
                    })
                }
            };
            const validateEnName = (rule, value, callback) => {
                if (!isEnglishName(value)) {
                    callback(new Error('只能是小写字母开头、数字和下划线组成'))
                } else {
                    callback()
                }
            };
            return {
                informationCategoryList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined
                },
                informationCategory: {
                    id: undefined,
                    name: undefined,
                    enName: undefined,
                    remark: undefined,
                },
                informationCategoryRules: {
                    name: [
                        {required: true, message: this.$t("table.pleaseInput") + '中文名称'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'},
                        {validator: validateName, trigger: 'blur'}
                    ],
                    enName: [
                        {required: true, message: this.$t("table.pleaseInput") + '英文名称'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'},
                        {validator: validateEnName, trigger: 'blur'}
                    ],
                    remark: [
                        {max: 500, message: '长度在 0 到 500 个字符', trigger: 'blur'}
                    ],
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
                    create: this.permission.informationCategory_create,
                    update: this.permission.informationCategory_update,
                    delete: this.permission.informationCategory_delete
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
                this.informationCategoryList = undefined;
                this.total = undefined;
                getInformationCategoryList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.informationCategoryList = response.data.records;
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
                this.resetInformationCategory();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetInformationCategory();
                if (row.id) {
                    this.informationCategory = deepClone(row);
                } else {
                    this.informationCategory = deepClone(this.selectedRows[0]);
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
                this.$refs['informationCategoryDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateInformationCategory(this.informationCategory).then(() => {
                            this.resetInformationCategoryDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['informationCategoryDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateInformationCategory(this.informationCategory).then(() => {
                            this.resetInformationCategoryDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delInformationCategorys(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetInformationCategory(){
                this.informationCategory = {
                    id: undefined,
                    name: undefined,
                    enName: undefined,
                    remark: undefined,
                }
            },
            resetInformationCategoryDialogAndList(){
                this.closeInformationCategoryDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeInformationCategoryDialog() {
                this.dialogVisible = false;
                this.resetInformationCategory();
                this.$refs['informationCategoryDialogForm'].resetFields();
            }
        }
    }
</script>


