<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" placeholder="请输入标题"
                                  v-model="listQuery.title"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="reloadList">
                            {{$t('table.search')}}
                        </el-button>
                        <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="deyatech-menu">
                <div class="deyatech-menu_left">
                    <el-button v-if="btnEnable.create" type="primary" :size="btnSize" @click="btnCreate">
                        {{$t('table.create')}}
                    </el-button>
                    <el-button v-if="btnEnable.update" type="primary" :size="btnSize" @click="btnUpdate"
                               :disabled="selectedRows.length != 1">{{$t('table.update')}}
                    </el-button>
                    <el-button v-if="btnEnable.delete" type="danger" :size="btnSize" @click="btnDelete"
                               :disabled="selectedRows.length < 1">{{$t('table.delete')}}
                    </el-button>
                </div>
                <div class="deyatech-menu_right">
                    <!--<el-button type="primary" icon="el-icon-edit" :size="btnSize" circle @click="btnUpdate"></el-button>
                    <el-button type="danger" icon="el-icon-delete" :size="btnSize" circle @click="btnDelete"></el-button>-->
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                </div>
            </div>
            <el-table :data="zwfwInformationList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="标题" prop="title"/>
                <el-table-column align="center" label="作者" prop="author"/>
                <el-table-column align="center" label="来源" prop="source"/>
                <el-table-column align="center" label="发布时间" prop="issueTime"/>
                <el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                            {{scope.row.enable | enums('EnableEnum')}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center"
                                 width="100">
                    <template slot-scope="scope">
                        <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary"
                                   icon="el-icon-edit" :size="btnSize" circle
                                   @click.stop.safe="btnUpdate(scope.row)"></el-button>
                        <el-button v-if="btnEnable.delete" :title="$t('table.delete')" type="danger"
                                   icon="el-icon-delete" :size="btnSize" circle
                                   @click.stop.safe="btnDelete(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="deyatech-pagination pull-right" background
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                           :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>


            <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible" @open="initEditor"
                       :close-on-click-modal="closeOnClickModal" @close="closeZwfwInformationDialog">
                <el-form ref="zwfwInformationDialogForm" class="deyatech-form" :model="zwfwInformation"
                         label-position="right"
                         label-width="80px" :rules="zwfwInformationRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="标题" prop="title">
                                <el-input v-model="zwfwInformation.title"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="作者" prop="author">
                                <el-input v-model="zwfwInformation.author"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="来源" prop="source">
                                <el-input v-model="zwfwInformation.source"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="发布时间" prop="issueTime">
                                <el-date-picker
                                    v-model="zwfwInformation.issueTime"
                                    type="date"
                                    placeholder="选择日期"
                                    @change="changeIssueTime">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="20">
                            <el-form-item label="内容" prop="remark">
                                <quill-editor ref="noticeTextEditor" v-model="noticeTextHtml"
                                              :options="quillEditorOption" @focus="onEditorFocus($event)">
                                </quill-editor>
                                <el-upload name="file" v-show="false" :show-file-list="false"
                                           :action="uploadAction" :accept="imageAccepts"
                                           :on-success="handleEditorUploadSuccess" :on-error="handleEditorUploadError">
                                    <el-button id="notice_text_btn"></el-button>
                                </el-upload>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="缩略图" prop="avatar">
                                <el-upload class="avatar-uploader" name="file"
                                           :action="this.$store.state.common.uploadUrl"
                                           :accept="this.$store.state.common.imageAccepts"
                                           :show-file-list="false"
                                           :on-success="handleAvatarSuccess"
                                           :on-error="handlerAvatarError"
                                           :before-upload="beforeAvatarUpload">
                                    <img v-if="zwfwInformation.avatar"
                                         :src="this.$store.state.common.showPicImgUrl + zwfwInformation.avatar"
                                         class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model="zwfwInformation.remark" :rows="3"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate"
                               :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeZwfwInformationDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getZwfwInformationList,
        createOrUpdateZwfwInformation,
        delZwfwInformations
    } from '@/api/information/zwfwInformation';
    import moment from 'moment';
    import {quillEditor} from 'vue-quill-editor';

    export default {
        name: 'zwfwInformation',
        components: {
            quillEditor
        },
        data() {
            return {
                quillEditorOption: {
                    modules: {
                        toolbar: [
                            [{header: []}],
                            ['bold', 'italic', 'underline'],
                            [{color: []}, {background: []}],
                            [{list: 'ordered'}, {list: 'bullet'}],
                            ['clean'],
                            ['link', 'image']
                        ]
                    },
                    theme: 'snow'
                },
                noticeTextHtml: '',
                zwfwInformationList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    title: undefined
                },
                uploadAction: this.$store.state.common.uploadUrl,
                fileAccepts: this.$store.state.common.fileAccepts,
                imageAccepts: this.$store.state.common.imageAccepts,
                acceptTypes: this.$store.state.common.imageAccepts,
                zwfwInformation: {
                    id: undefined,
                    title: undefined,
                    author: undefined,
                    source: undefined,
                    issueTime: undefined,
                    avatar: undefined,
                    content: undefined
                },
                zwfwInformationRules: {
                    title: [
                        {required: true, message: this.$t("table.pleaseInput") + '标题'}
                    ],
                    author: [
                        {required: true, message: this.$t("table.pleaseInput") + '作者'}
                    ],
                    source: [
                        {required: true, message: this.$t("table.pleaseInput") + '来源'}
                    ],
                    issueTime: [
                        {required: true, message: this.$t("table.pleaseInput") + '发布时间'}
                    ],
                    content: [
                        {required: true, message: this.$t("table.pleaseInput") + '内容'}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                editor: {},
            }
        },
        computed: {
            ...mapGetters([
                'permission',
                'titleMap',
                'enums',
                'dicts',
                'closeOnClickModal',
                'searchSize',
                'btnSize'
            ]),
            btnEnable() {
                return {
                    create: this.permission.zwfwInformation_create,
                    update: this.permission.zwfwInformation_update,
                    delete: this.permission.zwfwInformation_delete
                };
            }
        },
        created() {
            this.reloadList();
        },
        methods: {

            changeIssueTime(V) {
                this.zwfwInformation.issueTime = moment(V).format('YYYY-MM-DD');
            },
            handleAvatarSuccess(res, file, fileList) {
                if (res.status === 200 && res.data.state === 'SUCCESS') {
                    this.zwfwInformation.avatar = res.data.url;
                    this.$message.success('上传成功！');
                } else {
                    this.$message.error('上传失败！');
                }
            },
            handlerAvatarError(err, file, fileList) {
                this.$message.error("网络不稳定，上传失败");
            },
            beforeAvatarUpload(file) {
                const isJPG = this.acceptTypes.includes(file.type);
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片格式不正确!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            decodeEditorHtml() {
                this.noticeTextHtml = this.zwfwInformation.content;
            },
            encodeEditorHtml() {
                this.zwfwInformation.content = encodeURIComponent(encodeURIComponent(this.noticeTextHtml));
            },
            initEditor() {
                this.$nextTick(() => {
                    this.$refs.noticeTextEditor.quill.getModule('toolbar').addHandler('image', this.imgHandlerNoticeText);
                })
            },
            imgHandlerNoticeText(image) {
                if (image) {
                    let fileUploader = document.getElementById('notice_text_btn');
                    fileUploader.click()
                }
            },
            onEditorFocus(editor) {
                this.editor = editor
            },
            handleEditorUploadSuccess(res, file, fileList) {
                if (res.state === 'SUCCESS') {
                    let length = this.editor.getSelection(true).index;
                    this.editor.insertEmbed(length, 'image', res.url);
                } else {
                    this.$message.error('上传失败！');
                }
            },
            handleEditorUploadError(err, file, fileList) {
                this.$message.error('网络不稳定，上传失败');
            },
            resetSearch() {
                this.listQuery.name = undefined;
            },
            reloadList() {
                this.listLoading = true;
                this.zwfwInformationList = undefined;
                this.total = undefined;
                getZwfwInformationList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.zwfwInformationList = response.data.records;
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
            handleSelectionChange(rows) {
                this.selectedRows = rows;
            },
            btnCreate() {
                this.resetZwfwInformation();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row) {
                this.resetZwfwInformation();
                if (row.id) {
                    this.zwfwInformation = deepClone(row);
                } else {
                    this.zwfwInformation = deepClone(this.selectedRows[0]);
                }
                this.decodeEditorHtml();
                this.dialogTitle = 'update';
                this.dialogVisible = true;
            },
            btnDelete(row) {
                let ids = [];
                if (row.id) {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        ids.push(row.id);
                        this.doDelete(ids);
                    })
                } else {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        for (const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        this.doDelete(ids);
                    })
                }
            },
            doCreate() {
                this.$refs['zwfwInformationDialogForm'].validate(valid => {
                    if (valid) {
                        this.submitLoading = true;
                        this.encodeEditorHtml();
                        createOrUpdateZwfwInformation(this.zwfwInformation).then(() => {
                            this.resetZwfwInformationDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate() {
                this.$refs['zwfwInformationDialogForm'].validate(valid => {
                    if (valid) {
                        this.submitLoading = true;
                        createOrUpdateZwfwInformation(this.zwfwInformation).then(() => {
                            this.resetZwfwInformationDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids) {
                this.listLoading = true;
                delZwfwInformations(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetZwfwInformation() {
                this.zwfwInformation = {
                    id: undefined,
                    title: undefined,
                    author: undefined,
                    source: undefined,
                    issueTime: undefined,
                    avatar: undefined,
                    content: undefined
                };
                this.noticeTextHtml= ''
            },
            resetZwfwInformationDialogAndList() {
                this.closeZwfwInformationDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeZwfwInformationDialog() {
                this.dialogVisible = false;
                this.resetZwfwInformation();
                this.$refs['zwfwInformationDialogForm'].resetFields();
            }
        }
    }
</script>

<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>

