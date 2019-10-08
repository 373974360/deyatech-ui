<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.searchName')" v-model.trim="listQuery.name"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="btnSearch">{{$t('table.search')}}</el-button>
                        <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="deyatech-menu">
                <div class="deyatech-menu_left">
                    <!--<el-button v-if="btnEnable.create" type="primary" :size="btnSize" @click="btnCreate" :disabled="selectedRows.length > 1">{{$t('table.create')}}</el-button>-->
                    <!--<el-button v-if="btnEnable.update" type="primary" :size="btnSize" @click="btnUpdate" :disabled="selectedRows.length != 1">{{$t('table.update')}}</el-button>-->
                    <el-button v-if="btnEnable.delete" type="danger" :size="btnSize" @click="btnDelete" :disabled="selectedRows.length < 1">{{$t('table.delete')}}</el-button>
                </div>
                <div class="deyatech-menu_right">
                    <!--<el-button type="primary" icon="el-icon-edit" :size="btnSize" circle @click="btnUpdate"></el-button>
                    <el-button type="danger" icon="el-icon-delete" :size="btnSize" circle @click="btnDelete"></el-button>-->
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                </div>
            </div>
        </div>

        <el-table :data="materialList" v-loading.body="listLoading" stripe border highlight-current-row
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center"/>
            <el-table-column prop="name" label="原文件名称" align="center">
                <template slot-scope="scope">
                    <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="URL" prop="url"/>
            <el-table-column align="center" label="路径" prop="path"/>
            <el-table-column class-name="status-col" :label="$t('table.operation')" align="center" width="150">
                <template slot-scope="scope">
                    <!--<el-button v-if="btnEnable.create" :title="$t('table.create')" type="primary" icon="el-icon-plus" :size="btnSize" circle
                               @click.stop.safe="btnCreate(scope.row)"></el-button>-->
                    <!--<el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                               @click.stop.safe="btnUpdate(scope.row)"></el-button>-->
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
    </basic-container>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {getStore} from '@/util/store';
    import {
        getMaterialList,
        delMaterials
    } from "../../api/station/material";

    export default {
        name: 'catalog',
        data() {
            return {
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    siteId: this.$store.state.common.siteId,
                    name: undefined
                },
                total: 0,
                materialList: undefined,
                listLoading: false,
                selectedRows: []
            }
        },
        created() {
            this.$store.state.common.selectSiteDisplay = true;
            if (this.$store.state.common.siteId != undefined) {
                this.reloadList();
            } else {
                this.$message.error('请选择站点！');
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
                    create: this.permission.material_create,
                    update: this.permission.material_update,
                    delete: this.permission.material_delete
                };
            }
        },
        methods: {
            btnSearch() {
                this.listQuery.page = 1;
                this.reloadList();
            },
            resetSearch() {
                this.listQuery.name = undefined;
            },
            reloadList(){
                if (!this.listQuery.siteId) {
                    this.$message.warning("请先选择站点");
                    return
                }
                this.listLoading = true;
                getMaterialList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.materialList = response.data.records;
                    this.total = response.data.total;
                })
            },
            handleSizeChange(val) {
                this.listQuery.size = val;
                this.reloadList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.reloadList();
            },
            handleSelectionChange(rows){
                this.selectedRows = rows;
            },
            btnDelete(row){
                let ids = [];
                if (row.id) {
                    this.$confirm(message + this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        ids.push(row.id);
                        this.doDelete(ids);
                    })
                } else {
                    this.$confirm(message + this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        for(const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        this.doDelete(ids);
                    })
                }
            },
            doDelete(ids){
                this.listLoading = true;
                delMaterials(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            }
        }
    }
</script>
