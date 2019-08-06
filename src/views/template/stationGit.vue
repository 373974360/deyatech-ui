<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="stationGitForm" :model="stationGit" :rules="stationGitRules">
                    <el-form-item prop="siteId">
                        <el-select v-model="stationGit.siteId" placeholder="请选择站点" :size="searchSize" @change="stationGitChange">
                            <el-option
                                v-for="s in stationGitList"
                                :key="s.siteId"
                                :label="s.siteName"
                                :value="s.siteId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="gitUrl">
                        <el-input :size="searchSize" placeholder="Git地址" v-model="stationGit.gitUrl" :disabled="gitUrlInputDisabled"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button v-if="btnEnable.sync" type="primary" icon="el-icon-refresh" :size="searchSize" @click="doCreateOrUpdate" :loading="submitLoading">同步</el-button>
                        <el-button v-if="btnEnable.upload" icon="el-icon-upload" :size="searchSize">上传</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="templateFiles" v-loading.body="listLoading" stripe border highlight-current-row>
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="left" label="文件名称" prop="fileName">
                    <template slot-scope="scope">
                        <template v-if="scope.row.fileType=='file'">
                            <i class="iconfont icon-file-fill"></i>
                        </template>
                        <template v-else>
                            <i class="iconfont icon-folder-fill"></i>
                        </template>
                        <a href="javascript:void(0)"
                           @click="scope.row.fileType=='folder' ? getChildFiles(scope.row.filePath) : getFileContext(scope.row)">
                            <span style="margin-left: 10px; font-size: 14px;">{{ scope.row.fileName }}</span>
                        </a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="添加时间" prop="lastModified"/>
            </el-table>
        </div>
        <el-dialog title="Git登录" :visible.sync="dialogVisible"
                   :close-on-click-modal="closeOnClickModal" @close="closePageDialog">
            <el-form ref="gitForm" class="deyatech-form" :model="synchronize" label-position="right"
                     label-width="80px" :rules="synchronizeRules">
                <el-row :gutter="20" :span="24">
                    <el-col :span="24">
                        <el-form-item label="用户名" prop="userName">
                            <el-input v-model="synchronize.userName"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" :span="24">
                    <el-col :span="24">
                        <el-form-item label="密码" prop="passWord">
                            <el-input type="password" v-model="synchronize.passWord"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :size="btnSize" :loading="submitLoading" @click="doSync">{{$t('table.confirm')}}</el-button>
                <el-button :size="btnSize" @click="closePageDialog">{{$t('table.cancel')}}</el-button>
            </span>
        </el-dialog>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        createOrUpdateStationGit,
        listByStationGroupAndStationGit,
        doSync,
        listTemplateFiles
    } from '@/api/template/stationGit';

    export default {
        name: 'stationGit',
        data() {
            return {
                params: {},
                templateFiles: [],
                fileList: undefined,
                stationGitList: [],
                filePath: '',
                listLoading: false,
                gitUrlInputDisabled: true,
                stationGitSiteId: undefined,
                stationGit: {
                    id: undefined,
                    gitUrl: undefined,
                    siteId: undefined
                },
                stationGitRules: {
                    siteId: [
                        {required: true, message: this.$t("table.pleaseSelect") + '站点'}
                    ],
                    gitUrl: [
                        {required: true, message: this.$t("table.pleaseInput") + 'Git地址'}
                    ]
                },
                synchronize: {
                    userName: undefined,
                    passWord: undefined
                },
                synchronizeRules: {
                    userName: [
                        {required: true, message: this.$t("table.pleaseInput") + '用户名'}
                    ],
                    passWord: [
                        {required: true, message: this.$t("table.pleaseInput") + '密码'}
                    ]
                },
                submitLoading: false,
                dialogVisible: false,
                dialogTitle: undefined
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
                    sync: this.permission.stationGit_sync,
                    upload: this.permission.stationGit_upload
                };
            }
        },
        created(){
            this.listByStationGroupAndStationGit();
        },
        methods: {
            listTemplateFiles(){
                this.listLoading = true;
                this.templateFiles = [];
                listTemplateFiles(this.stationGit.siteId,this.filePath).then(response => {
                    let result = JSON.parse(response.data)
                    this.templateFiles = result.files
                    this.listLoading = false;
                })
            },
            getChildFiles (path) {
                this.filePath = path;
                this.listTemplateFiles();
            },
            getFileContext (row) {

            },
            listByStationGroupAndStationGit(){
                this.stationGitList = [];
                listByStationGroupAndStationGit().then(response => {
                    this.stationGitList = response.data;
                })
            },
            stationGitChange(val){
                this.resetStationGit();
                this.stationGit.siteId = val;
                this.gitUrlInputDisabled = false;
                this.stationGitSiteId = undefined;
                for(const stationGit of this.stationGitList){
                    if(stationGit.tempSiteId == val){
                        this.stationGit.gitUrl = stationGit.gitUrl;
                        this.stationGit.id = stationGit.id;
                        this.gitUrlInputDisabled = true;
                        this.stationGitSiteId = stationGit.tempSiteId;
                    }
                }
                this.listTemplateFiles();
            },
            doCreateOrUpdate(){
                this.$refs['stationGitForm'].validate(valid => {
                    if(valid) {
                        this.resestSynchronize();
                        if(this.stationGitSiteId == undefined){
                            this.submitLoading = true;
                            createOrUpdateStationGit(this.stationGit).then(() => {
                                this.listByStationGroupAndStationGit();
                                this.gitUrlInputDisabled = true;
                                this.submitLoading = false;
                                this.dialogVisible = true;
                                this.stationGitSiteId = this.stationGit.siteId;
                            })
                        }else{
                            this.dialogVisible = true;
                        }
                    } else {
                        return false;
                    }
                });
            },
            doSync(){
                this.$refs['gitForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        doSync(this.stationGit.siteId,this.stationGit.gitUrl,this.synchronize.userName,this.synchronize.passWord).then(() => {
                            this.dialogVisible = false;
                            this.submitLoading = false;
                            this.listTemplateFiles();
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetStationGit(){
                this.stationGit = {
                    id: undefined,
                    gitUrl: undefined,
                    siteId: undefined
                }
            },
            resestSynchronize(){
                this.synchronize = {
                    userName: undefined,
                    passWord: undefined
                }
            },
            closePageDialog() {
                this.dialogVisible = false;
            }
        }
    }
</script>


