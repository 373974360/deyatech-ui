<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="stationGitForm" :model="stationGit" :rules="stationGitRules">
                    <el-form-item prop="gitUrl">
                        <el-input :size="searchSize" placeholder="Git地址" v-model="stationGit.gitUrl" :disabled="gitUrlInputDisabled"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button v-if="btnEnable.sync" type="primary" icon="el-icon-refresh" :size="searchSize" @click="doCreateOrUpdate" :loading="submitLoading">同步</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-upload v-if="btnEnable.upload"
                                   :action="this.$store.state.common.uploadUrl"
                                   :accept="this.$store.state.common.imageAccepts"
                                   :show-file-list="false"
                                   :on-success="handleAvatarSuccess"
                                   :on-error="handlerAvatarError"
                                   :before-upload="beforeAvatarUpload"
                                   :disabled="uploadDesabled">
                            <el-button :size="searchSize" icon="el-icon-upload" @click="handlerSiteId">上传</el-button>
                        </el-upload>
                    </el-form-item>
                    <el-form-item>
                        <div style="font-size:12px;color: red;">上传zip格式的压缩包</div>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="templateFiles" v-loading.body="listLoading" stripe border highlight-current-row>
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="left" label="文件名称" prop="fileName">
                    <template slot-scope="scope">
                        <i v-if="scope.row.fileType=='file'" class="el-icon-tickets"></i>
                        <i v-else-if="scope.row.fileType=='folder' &&scope.row.fileName=='...'" class="el-icon-back"></i>
                        <i v-else class="el-icon-news"></i>
                        <a href="javascript:void(0)"
                           @click="scope.row.fileType=='folder' ? getChildFiles(scope.row.filePath) : getFileContext(scope.row)">
                            <span style="margin-left: 10px; font-size: 14px;">{{ scope.row.fileName }}</span>
                        </a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="添加时间" prop="lastModified"/>
            </el-table>
        </div>
        <!-- Git账户登录 -->
        <el-dialog title="Git登录" :visible.sync="dialogVisible"
                   :close-on-click-modal="closeOnClickModal" @close="closeStationGitDialog">
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
                <el-button :size="btnSize" @click="closeStationGitDialog">{{$t('table.cancel')}}</el-button>
            </span>
        </el-dialog>
        <!-- 文件湘西内容 -->
        <el-dialog title="内容" :visible.sync="dialogContentVisible"
                   :close-on-click-modal="closeOnClickModal" @close="closeContentDialog" width="100%" :fullscreen="dialogWindow">
            <codemirror :value="contentCode" :options="options" style="border:1px solid #cccccc;"></codemirror>
        </el-dialog>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {
        createOrUpdateStationGit,
        listByStationGroupAndStationGit,
        doSync,
        listTemplateFiles,
        getFileContent,
        unzip,
        getStationGitBySiteId
    } from '@/api/template/stationGit';
    import { codemirror } from 'vue-codemirror-lite';
    require('codemirror/mode/vue/vue.js')
    require('codemirror/mode/javascript/javascript.js')
    require('codemirror/mode/xml/xml.js')
    require('codemirror/mode/htmlmixed/htmlmixed.js')

    export default {
        name: 'stationGit',
        components: {
            codemirror
        },
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
                    siteId: this.$store.state.common.siteId
                },
                stationGitRules: {
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
                dialogTitle: undefined,
                dialogContentVisible: false,
                contentCode: undefined,
                mode: undefined,
                dialogWindow: true,
                uploadAction: this.$store.state.common.uploadUrl,
                acceptTypes: 'application/zip',
                uploadDesabled: true
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
            },
            options: function () {
                return {
                    mode: this.mode,
                    tabSize: 2,
                    lineNumbers: true,
                    lineWrapping: true,
                    extraKeys: {'Ctrl-Space': 'autocomplete'},
                }
            }
        },
        created(){
            this.$store.state.common.selectSiteDisplay = true;
            if(this.$store.state.common.siteId != undefined){
                this.listTemplateFiles();
                this.getStationGit();
                this.uploadDesabled = false;
            }else{
                this.$message.error('请选择站点！');
            }
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
                this.mode = row.filePath.substring(row.filePath.indexOf(".")+1,row.filePath.length);
                if(this.mode == 'js'){
                    this.mode = 'javascript';
                }
                if(this.mode == 'html'){
                    this.mode = 'htmlmixed';
                }
                this.dialogContentVisible = true;
                this.contentCode = undefined;
                getFileContent(row.filePath).then(response => {
                    this.contentCode = response.data;
                })
            },
            getStationGit(){
                getStationGitBySiteId(this.stationGit.siteId).then(response => {
                    if(response.data != undefined){
                        this.stationGit.id = response.data.id;
                        this.stationGit.gitUrl = response.data.gitUrl;
                    }else{
                        this.gitUrlInputDisabled = false;
                    }
                })
            },
            doCreateOrUpdate(){
                if(this.stationGit.siteId != undefined){
                    this.$refs['stationGitForm'].validate(valid => {
                        if(valid) {
                            this.resestSynchronize();
                            if(this.stationGitSiteId == undefined){
                                this.submitLoading = true;
                                createOrUpdateStationGit(this.stationGit).then(() => {
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
                }else{
                    this.$message.error('请选择站点！');
                }
            },
            doSync(){
                this.$refs['gitForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        doSync(this.stationGit.siteId,this.stationGit.gitUrl,this.synchronize.userName,this.synchronize.passWord).then(() => {
                            this.dialogVisible = false;
                            this.submitLoading = false;
                            this.listTemplateFiles();
                        }).catch(() => {
                            this.submitLoading = false
                        })
                    } else {
                        return false;
                    }
                });
            },
            resestSynchronize(){
                this.synchronize = {
                    userName: undefined,
                    passWord: undefined
                }
            },
            closeStationGitDialog() {
                this.dialogVisible = false;
            },
            closeContentDialog() {
                this.dialogContentVisible = false;
            },
            handleAvatarSuccess(res, file, fileList) {
                if (res.status === 200 && res.data.state === 'SUCCESS') {
                    unzip(res.data.filePath,this.stationGit.siteId).then(response => {
                        if(response.data){
                            this.$message.success('上传成功！');
                            this.listTemplateFiles();
                        }else{
                            this.$message.error('上传失败！');
                        }
                    })
                } else {
                    this.$message.error('上传失败！');
                }
            },
            handlerAvatarError(err, file, fileList) {
                this.$message.error("网络不稳定，上传失败");
            },
            beforeAvatarUpload(file) {
                let isZip = this.acceptTypes.includes(file.type);
                if(file.type == ''){
                    isZip = false;
                }
                if (!isZip) {
                    this.$message.error('请上传zip格式的文件!');
                }
                return isZip;
            },
            handlerSiteId(){
                if(this.stationGit.siteId == undefined){
                    this.uploadDesabled = true;
                    this.$message.error('请选择站点!');
                    return false;
                }else{
                    this.uploadDesabled = false;
                }
            }
        }
    }
</script>
<style>
    .CodeMirror{height:100%;}
</style>


