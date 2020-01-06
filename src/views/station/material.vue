<template>
    <basic-container>
        <div class="deyatech-container pull-auto" style="width: 100%;">
            <div class="deyatech-menu" >
                <div class="deyatech-menu_left">
                    <el-radio-group v-model="showType" @change="typeChange" :size="searchSize" style="margin-right: 10px;">
                        <el-radio-button :label="0">矩阵</el-radio-button>
                        <el-radio-button :label="1">列表</el-radio-button>
                    </el-radio-group>

                    <div v-show="showType == 0" style="display: inline-block">
                        <el-select v-model="treeListQuery.usePlace" :size="searchSize" placeholder="请选择使用" style="margin-right: 10px;">
                            <el-option v-for="i in enums['MaterialUsePlaceEnum']" :key="i.code" :label="i.value" :value="i.code"></el-option>
                        </el-select>
                        <el-input :size="searchSize" :placeholder="$t('table.searchName')" v-model.trim="treeListQuery.name" style="width: 300px;margin-left: 10px;margin-right:10px;"></el-input>
                        <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="btnTreeSearch">{{$t('table.search')}}</el-button>
                        <el-button icon="el-icon-delete" :size="searchSize" @click="resetTreeSearch">{{$t('table.clear')}}</el-button>
                    </div>

                    <div v-show="showType == 1" style="display: inline-block">
                        <el-button v-if="btnEnable.delete" type="danger" :size="btnSize" @click="btnDelete" :disabled="selectedRows.length < 1" style="margin-right: 10px;">{{$t('table.delete')}}</el-button>
                        <el-select v-model="listQuery.usePlace" :size="searchSize" placeholder="请选择使用">
                            <el-option v-for="i in enums['MaterialUsePlaceEnum']" :key="i.code" :label="i.value" :value="i.code"></el-option>
                        </el-select>
                        <el-input :size="searchSize" :placeholder="$t('table.searchName')" v-model.trim="listQuery.name" style="width: 300px;margin-left: 10px;margin-right:10px;"></el-input>
                        <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="btnSearch">{{$t('table.search')}}</el-button>
                        <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}</el-button>
                    </div>
                </div>
                <div class="deyatech-menu_right" v-show="showType == 1">
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                </div>
            </div>
        </div>

        <div v-show="showType == 0">
            <el-row :span="24">
                <el-col :span="4">
                    <div class="directoryTree">
                        <!--左侧树-->
                        <el-tree ref="directoryTree" style="max-width:500px;"
                                 :data="directoryTree"
                                 node-key="path"
                                 :highlight-current="true"
                                 :expand-on-click-node="false"
                                 @node-click="handleDirectoryTree">
                        </el-tree>
                    </div>
                </el-col>
                <el-col :span="20">
                    <div>
                        <div class="grid-box" v-for="item in treeMaterialList">
                            <el-image style="width: 100%; height: 160px" :src="getImageUrl(item.type, item.url)"></el-image>
                            <span v-text="item.name"></span>
                            <div style="position: absolute; top: 64px; left: 64px;">
                                <el-button class="hidebtn" v-if="btnEnable.delete" :title="$t('table.delete')" type="danger" icon="el-icon-delete" :size="btnSize" circle @click.stop.safe="btnDelete(item, 'grid')"></el-button>
                            </div>
                        </div>
                    </div>
                    <el-pagination class="deyatech-pagination pull-right" background
                                   :current-page.sync="treeListQuery.page" :page-sizes="this.$store.state.common.pageSize"
                                   :page-size="treeListQuery.size" :layout="this.$store.state.common.pageLayout" :total="treeMaterialTotal"
                                   @size-change="handleSizeChangeTree" @current-change="handleCurrentChangeTree">
                    </el-pagination>
                </el-col>
            </el-row>
        </div>

        <div v-show="showType == 1">
            <el-table :data="materialList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column prop="id" label="编号" align="center" width="180"/>
                <el-table-column label="图片" align="center" width="130">
                    <template slot-scope="scope">
                        <el-image
                            style="width: 100px; height: 100px"
                            :src="getImageUrl(scope.row.type, scope.row.url)"
                            :preview-src-list="[]">
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="原文件名称" align="center"/>

                <el-table-column align="center" label="URL" prop="url" width="260"/>
                <el-table-column align="center" label="路径" prop="path"/>
                <el-table-column align="center" label="使用" prop="usePlace" width="120">
                    <template slot-scope="scope">
                        {{scope.row.usePlace | enums('MaterialUsePlaceEnum')}}
                    </template>
                </el-table-column>
                <el-table-column class-name="status-col" :label="$t('table.operation')" align="center" width="80">
                    <template slot-scope="scope">
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
        </div>


    </basic-container>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {getStore} from '@/util/store';
    import {
        getMaterialList,
        delMaterials,
        getDirectoryTree,
        getTreeMaterialList
    } from "../../api/station/material";

    export default {
        name: 'catalog',
        data() {
            return {
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    siteId: this.$store.state.common.siteId,
                    name: undefined,
                    usePlace: undefined
                },
                treeListQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    siteId: this.$store.state.common.siteId,
                    name: undefined,
                    path: undefined,
                    usePlace: undefined
                },
                total: 0,
                materialList: undefined,
                listLoading: false,
                selectedRows: [],
                showType: 0,//矩阵
                treeMaterialTotal: 0,
                treeMaterialList: [],
                directoryTree: [],
                currentDirectory: undefined
            }
        },
        created() {
            this.$store.state.common.selectSiteDisplay = true;
            if (this.$store.state.common.siteId != undefined) {
                this.listQuery.siteId= this.$store.state.common.siteId;
                this.treeListQuery.siteId= this.$store.state.common.siteId;
                this.reloadTree();
                // this.reloadList();
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
            getImageUrl(fileType, url) {
                fileType = fileType.toLowerCase();
                if (fileType === ".png" || fileType === ".jpg" || fileType === ".jpeg" || fileType === ".bmp" || fileType === ".gif") {
                    return '/manage/station/material/showImageBySiteIdAndUrl?siteId=' + this.$store.state.common.siteId + '&url=' + url;
                } else if (fileType === ".txt") {
                    return "img/icon/txt.png"
                } else if (fileType === ".xls" || fileType === ".xlsx") {
                    return "img/icon/xls.png"
                } else if (fileType === ".doc" || fileType === ".docx") {
                    return "img/icon/doc.png"
                } else if (fileType === ".ppt" || fileType === ".pptx") {
                    return "img/icon/ppt.png"
                } else {
                    return "img/icon/other.png"
                }

            },
            reloadTree() {
                getDirectoryTree({siteId: this.$store.state.common.siteId}).then(response=>{
                    this.directoryTree = response.data;
                    if (this.directoryTree && this.directoryTree.length > 0) {
                        this.currentDirectory = this.directoryTree[0].path;
                        this.treeListQuery.path = this.directoryTree[0].path;
                        this.reloadTreeList();
                        this.$nextTick(()=>{
                            this.$refs.directoryTree.setCurrentKey(this.currentDirectory);
                        });
                    }
                });
            },
            btnTreeSearch() {
                this.treeListQuery.page = 1;
                this.reloadTreeList();
            },
            resetTreeSearch() {
                this.treeListQuery.name = undefined;
                this.treeListQuery.usePlace = undefined;
            },
            reloadTreeList(){
                if (!this.treeListQuery.siteId) {
                    this.$message.warning("请先选择站点");
                    return
                }
                if (!this.treeListQuery.path) {
                    this.$message.warning("请先选择目录");
                    return
                }
                getTreeMaterialList(this.treeListQuery).then(response => {
                    this.treeMaterialList = response.data.records;
                    this.treeMaterialTotal = response.data.total;
                })
            },

            btnSearch() {
                this.listQuery.page = 1;
                this.reloadList();
            },
            resetSearch() {
                this.listQuery.name = undefined;
                this.listQuery.usePlace = undefined;
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
            handleSizeChangeTree(val) {
                this.treeListQuery.size = val;
                this.reloadTreeList();
            },
            handleCurrentChangeTree(val) {
                this.treeListQuery.page = val;
                this.reloadTreeList();
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
            btnDelete(row, type){
                let ids = [];
                if (row.id) {
                    this.$confirm('此操作将永久删除该数据及文件, 是否继续？', this.$t("table.tip"), {type: 'error'}).then(() => {
                        ids.push(row.id);
                        this.doDelete(ids, type);
                    })
                } else {
                    this.$confirm('此操作将永久删除该数据及文件, 是否继续？', this.$t("table.tip"), {type: 'error'}).then(() => {
                        for(const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        this.doDelete(ids, type);
                    })
                }
            },
            doDelete(ids, type){
                this.listLoading = true;
                delMaterials(ids).then(() => {
                    if (type === 'grid') {
                        this.reloadTreeList();
                    } else {
                        this.reloadList();
                    }
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            typeChange(data){
                // 矩阵
                if (data == 0) {
                    this.reloadTreeList();
                    this.$nextTick(()=>{
                        this.$refs.directoryTree.setCurrentKey(this.currentDirectory);
                    });
                } else if (data == 1) {
                    this.reloadList()
                }
            },
            handleDirectoryTree(data) {
                this.currentDirectory = data.path;
                this.treeListQuery.path = data.path;
                this.reloadTreeList();
            }


        }
    }
</script>
<style>
    .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
        background-color: #a6d1ff;
    }
    .directoryTree {
        border:1px solid #eceef5;
        overflow-x: scroll;
        margin-right:10px;
        padding: 10px;
        height: 100%;
    }
    .grid-box {
        width: 160px;
        position: relative;
        display: inline-block;
        margin-right: 10px;
        margin-bottom: 20px;
    }
    .hidebtn {
        visibility: hidden;
    }
    .grid-box:hover button {
        visibility: visible;
    }
</style>
