<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-cascader
                            placeholder="请选择分类"
                            v-model="stationGroupClassificationIds"
                            :options="stationGroupClassificationCascader"
                            :props="{ expandTrigger: 'hover' }"
                            clearable
                            @change="selectStationGroupClassificationId">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="searchReloadList">{{$t('table.search')}}</el-button>
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
            <el-table :data="stationGroupList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
<!--                <el-table-column type="selection" width="50" align="center"/>-->
                <el-table-column align="center" label="名称" prop="name"/>
                <el-table-column align="center" label="英文名称" prop="englishName"/>
                <el-table-column align="center" label="简称" prop="abbreviation"/>
                <el-table-column align="center" label="部门" prop="departmentName"/>
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="150">
                    <template slot-scope="scope">
                        <el-button title="生成站点索引" type="primary" icon="el-icon-thumb" :size="btnSize" circle @click.stop.safe="handleSiteReindex(scope.row)"></el-button>
                        <el-button title="删除站点索引" type="danger" icon="el-icon-delete" :size="btnSize" circle @click.stop.safe="removeSiteIndex(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="deyatech-pagination pull-right" background
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                           :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import { removeIndexData } from '@/api/station/index';
    import { getStationGroupList } from '@/api/resource/stationGroup';
    import { getStationGroupClassificationCascader } from '@/api/resource/stationGroupClassification';
    import { reindex } from '@/api/station/template';

    export default {
        name: 'index',
        data() {
            return {
                stationGroupList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    stationGroupClassificationId: undefined,
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                stationGroupClassificationCascader: [],
                stationGroupClassificationIds: []
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
                    create: this.permission.index_create,
                    update: this.permission.index_update,
                    delete: this.permission.index_delete
                };
            }
        },
        created(){
            this.$store.state.common.selectSiteDisplay = false;
            this.getStationGroupClassificationCascader(null);
            this.reloadList();
        },
        methods: {
            selectStationGroupClassificationId(v) {
                if (v.length > 0) {
                    this.listQuery.stationGroupClassificationId = v[v.length - 1];
                } else {
                    this.listQuery.stationGroupClassificationId = undefined;
                }
            },
            resetSearch(){
                this.stationGroupClassificationIds = [];
                this.listQuery.stationGroupClassificationId = undefined;
            },
            searchReloadList(){
                this.handleCurrentChange(1);
            },
            reloadList(){
                this.listLoading = true;
                this.stationGroupList = undefined;
                // this.total = undefined;
                getStationGroupList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.stationGroupList = response.data.records;
                    this.total = response.data.total;
                }).catch(() => {
                    this.listLoading = false;
                    this.total = 0;
                })
            },
            getStationGroupClassificationCascader(id) {
                getStationGroupClassificationCascader(id).then(response => {
                    this.stationGroupClassificationCascader = response.data;
                });
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
            // 批量生成整个站点的索引
            handleSiteReindex(row) {
                if (!row.id) {
                    this.$message.error('请先选择站点！')
                    return
                }
                reindex({siteId: row.id}).then(response => {
                    if (response.status == 200) {
                        this.$message.success('生成中，请稍后查看！')
                    } else {
                        this.$message.error('生成失败！')
                    }
                })
            },
            // 批量删除整个站点的索引
            removeSiteIndex(row) {
                if (!row.id) {
                    this.$message.error('请先选择站点！')
                    return
                }
                this.$confirm('此操作将删除该站点索引, 是否继续？', this.$t("table.tip"), {type: 'error'}).then(() => {
                    removeIndexData({siteId: row.id}).then(() => {
                        this.$message.success(this.$t("table.deleteSuccess"));
                    })
                })
            }
        }
    }
</script>
