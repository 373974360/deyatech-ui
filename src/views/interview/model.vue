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
            <el-table :data="modelList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="分类ID" prop="categoryId"/>
                <el-table-column align="center" label="访谈名称" prop="name">
                    <template slot-scope="scope">
                        <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="访谈时间" prop="time"/>
                <el-table-column align="center" label="访谈图片" prop="cover"/>
                <el-table-column align="center" label="访谈简介" prop="description"/>
                <el-table-column align="center" label="直播地址" prop="liveUrl"/>
                <el-table-column align="center" label="视频地址" prop="videoUrl"/>
                <el-table-column align="center" label="访谈图片" prop="images"/>
                <el-table-column align="center" label="访谈内容" prop="content"/>
                <el-table-column align="center" label="访谈状态(0为预告,1为直播,2为往期)" prop="status"/>
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
                                   @click.stop="btnUpdate(scope.row)"></el-button>
                        <el-button v-if="btnEnable.delete" :title="$t('table.delete')" type="danger" icon="el-icon-delete" :size="btnSize" circle
                                   @click.stop="btnDelete(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="deyatech-pagination pull-right" background
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                           :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>


            <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeModelDialog">
                <el-form ref="modelDialogForm" class="deyatech-form" :model="model" label-position="right"
                         label-width="80px" :rules="modelRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="分类ID" prop="categoryId">
                                <el-input v-model="model.categoryId"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="访谈名称" prop="name">
                                <el-input v-model="model.name"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="访谈时间" prop="time">
                                <el-input v-model="model.time"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="访谈图片" prop="cover">
                                <el-input v-model="model.cover"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="访谈简介" prop="description">
                                <el-input v-model="model.description"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="直播地址" prop="liveUrl">
                                <el-input v-model="model.liveUrl"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="视频地址" prop="videoUrl">
                                <el-input v-model="model.videoUrl"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="访谈图片" prop="images">
                                <el-input v-model="model.images"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="访谈内容" prop="content">
                                <el-input v-model="model.content"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="访谈状态(0为预告,1为直播,2为往期)" prop="status">
                                <el-input v-model="model.status"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model="model.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeModelDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getModelListByCategoryAndName,
        createOrUpdateModel,
        delModels
    } from '@/api/interview/model';

    export default {
        name: 'model',
        data() {
            return {
                modelList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined
                },
                model: {
                    id: undefined,
                    categoryId: undefined,
                    name: undefined,
                    time: undefined,
                    cover: undefined,
                    description: undefined,
                    liveUrl: undefined,
                    videoUrl: undefined,
                    images: undefined,
                    content: undefined,
                    status: undefined
                },
                modelRules: {
                    categoryId: [
                        {required: true, message: this.$t("table.pleaseInput") + '分类ID'}
                    ],
                    name: [
                        {required: true, message: this.$t("table.pleaseInput") + '访谈名称'}
                    ],
                    time: [
                        {required: true, message: this.$t("table.pleaseInput") + '访谈时间'}
                    ],
                    cover: [
                        {required: true, message: this.$t("table.pleaseInput") + '访谈图片'}
                    ],
                    description: [
                        {required: true, message: this.$t("table.pleaseInput") + '访谈简介'}
                    ],
                    liveUrl: [
                        {required: true, message: this.$t("table.pleaseInput") + '直播地址'}
                    ],
                    videoUrl: [
                        {required: true, message: this.$t("table.pleaseInput") + '视频地址'}
                    ],
                    images: [
                        {required: true, message: this.$t("table.pleaseInput") + '访谈图片'}
                    ],
                    content: [
                        {required: true, message: this.$t("table.pleaseInput") + '访谈内容'}
                    ],
                    status: [
                        {required: true, message: this.$t("table.pleaseInput") + '访谈状态(0为预告,1为直播,2为往期)'}
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
                    create: this.permission.model_create,
                    update: this.permission.model_update,
                    delete: this.permission.model_delete
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
                this.modelList = undefined;
                this.total = undefined;
                getModelListByCategoryAndName(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.modelList = response.data.records;
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
                this.resetModel();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetModel();
                if (row.id) {
                    this.model = deepClone(row);
                } else {
                    this.model = deepClone(this.selectedRows[0]);
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
                this.$refs['modelDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateModel(this.model).then(() => {
                            this.resetModelDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['modelDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateModel(this.model).then(() => {
                            this.resetModelDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delModels(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetModel(){
                this.model = {
                    id: undefined,
                    categoryId: undefined,
                    name: undefined,
                    time: undefined,
                    cover: undefined,
                    description: undefined,
                    liveUrl: undefined,
                    videoUrl: undefined,
                    images: undefined,
                    content: undefined,
                    status: undefined
                }
            },
            resetModelDialogAndList(){
                this.closeModelDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeModelDialog() {
                this.dialogVisible = false;
                this.resetModel();
                this.$refs['modelDialogForm'].resetFields();
            }
        }
    }
</script>


