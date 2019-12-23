<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" placeholder="redis key"
                                  v-model.trim="listQuery.key"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="reloadList">
                            {{$t('table.search')}}
                        </el-button>
                        <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}
                        </el-button>
                        <el-button icon="el-icon-delete" :size="searchSize" @click="btnDelete" type="danger"
                                   :disabled="selectedRows.length < 1">{{$t('table.delete')}}缓存
                        </el-button>
                        <el-button icon="el-icon-delete" :size="searchSize" @click="btnClear" type="danger">
                            {{$t('table.clear')}}缓存
                        </el-button>
                        <el-button icon="el-icon-refresh" :size="searchSize" @click="btnReload" type="primary">
                            刷新缓存
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="cacheList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="left" label="Key" prop="key">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="查看详细" placement="right-start">
                            <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.key}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="类型" prop="type" width="200"/>
                <el-table-column align="center" label="过期时间" width="180">
                    <template scope="scope">
                        <span v-if="scope.row.ttl">{{scope.row.ttl | date('YYYY-MM-DD HH:mm:ss')}}</span>
                        <span v-else>-1</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="deyatech-pagination pull-right" background
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                           :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>
            <el-dialog :title="dialogTitle" :visible.sync="dialogVisible"
                       :close-on-click-modal="closeOnClickModal">
                <el-form ref="cacheDialogForm" class="deyatech-form" :model="cache" label-position="right"
                         label-width="80px">
                    <el-form-item label="Key">
                        <el-input :value="cache.key" :disabled="true"/>
                    </el-form-item>
                    <el-form-item label="Value">
                        <div class="editor-container">
                            <json-editor ref="jsonEditor" v-model="cache.value"></json-editor>
                        </div>
                    </el-form-item>
                    <el-form-item label="类型">
                        <el-input :value="cache.type" :disabled="true"/>
                    </el-form-item>
                    <el-form-item label="过期时间">
                        <el-input v-if="cache.ttl" :value="cache.ttl | date('YYYY-MM-DD HH:mm:ss')" :disabled="true"/>
                        <el-input v-else value="-1" :disabled="true"/>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
    </basic-container>
</template>
<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import jsonEditor from '@/components/jsonEditor';
    import {
        getCacheList,
        delCacheKeys,
        flushCache,
        reloadCache
    } from '@/api/admin/cache';

    export default {
        name: 'logs',
        data() {
            return {
                cacheList: undefined,
                listLoading: true,
                total: undefined,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    key: undefined
                },
                selectedRows: [],
                cache: {
                    key: undefined,
                    value: undefined,
                    type: undefined,
                    ttl: undefined
                },
                dialogVisible: false,
                dialogTitle: undefined
            }
        },
        computed: {
            ...mapGetters([
                'closeOnClickModal',
                'searchSize',
                'btnSize'
            ])
        },
        components: {jsonEditor},
        created() {
            this.$store.state.common.selectSiteDisplay = false;
            this.reloadList();
        },
        methods: {
            resetSearch() {
                this.listQuery.key = undefined;
                this.listQuery.size = undefined;
            },
            reloadList() {
                this.listLoading = true;
                this.cacheList = undefined;
                getCacheList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.cacheList = response.data;
                    this.handlePage();
                })
            },
            handleSizeChange(val) {
                this.listQuery.size = val;
                this.handlePage();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.handlePage();
            },
            handlePage() {
                this.list = this.cacheList.slice((this.listQuery.page - 1) * this.listQuery.size, (this.listQuery.page - 1) * this.listQuery.size + this.listQuery.size);
            },
            handleSelectionChange(rows) {
                this.selectedRows = rows;
            },
            btnReload() {
                this.listLoading = true;
                reloadCache().then(() => {
                    this.reloadList();
                    this.$message.success("刷新成功");
                })
            },
            btnClear() {
                this.listLoading = true;
                flushCache().then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            btnUpdate(row) {
                this.resetLogs();
                if (row.key) {
                    this.cache = deepClone(row);
                } else {
                    this.cache = deepClone(this.selectedRows[0]);
                }
                this.dialogTitle = '详情';
                this.dialogVisible = true;
            },
            btnDelete(row) {
                let keys = [];
                if (row.key) {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        keys.push(row.key);
                        this.doDelete(keys);
                    })
                } else {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        for (const deleteRow of this.selectedRows) {
                            keys.push(deleteRow.key);
                        }
                        this.doDelete(keys);
                    })
                }
            },
            doDelete(ids) {
                this.listLoading = true;
                delCacheKeys(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetLogs() {
                this.cache = {
                    key: undefined,
                    value: undefined,
                    type: undefined,
                    ttl: undefined
                }
            }
        }
    }
</script>
<style>
    .editor-container, .json-editor {
        position: relative;
        height: 300px;
        overflow-x: hidden;
    }
</style>
