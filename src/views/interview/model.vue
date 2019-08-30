<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-select v-model.trim="listQuery.categoryId" :size="searchSize" placeholder="请选择分类">
                            <el-option v-for="o in categorys"
                                       :key="o.id"
                                       :label="o.name"
                                       :value="o.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-input :size="searchSize" :placeholder="$t('table.searchName')" v-model.trim="listQuery.name"></el-input>
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
                    <el-button v-if="btnEnable.update" type="primary" :size="btnSize" @click="btnLiveUpdate" :disabled="selectedRows.length != 1">直播</el-button>
                </div>
                <div class="deyatech-menu_right">
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                </div>
            </div>
            <el-table :data="modelList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="分类名称" prop="categoryName"/>
                <el-table-column align="center" label="访谈名称" prop="name">
                    <template slot-scope="scope">
                        <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="访谈时间" prop="time"/>
                <el-table-column align="center" label="访谈简介" prop="description"/>
                <el-table-column align="center" label="访谈状态" prop="status"/>
                <el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                            {{scope.row.enable | enums('EnableEnum')}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="150">
                    <template slot-scope="scope">
                        <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                                   @click.stop="btnUpdate(scope.row)"></el-button>
                        <el-button v-if="btnEnable.delete" :title="$t('table.delete')" type="danger" icon="el-icon-delete" :size="btnSize" circle
                                   @click.stop="btnDelete(scope.row)"></el-button>
                        <el-button v-if="btnEnable.update" title="直播" type="primary" icon="el-icon-sort" :size="btnSize" circle
                                   @click.stop="btnLiveUpdate(scope.row)"></el-button>
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
                            <el-form-item label="分类" prop="categoryId">
                                <el-select v-model.trim="model.categoryId" placeholder="请选择分类" style="width: 100%;">
                                    <el-option v-for="o in categorys"
                                               :key="o.id"
                                               :label="o.name"
                                               :value="o.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="访谈名称" prop="name">
                                <el-input v-model.trim="model.name" maxlength="100" placeholder="请输入访谈名称"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="访谈时间" prop="time">
                                <el-date-picker
                                    v-model.trim="model.time"
                                    type="datetime"
                                    format="yyyy-MM-dd HH:mm"
                                    placeholder="请选择访谈时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="访谈状态" prop="status">
                                <el-select v-model.trim="model.status" placeholder="请选择访谈状态">
                                    <el-option v-for="o in enums['InterviewModelStatusEnum']"
                                               :key="o.code"
                                               :label="o.value"
                                               :value="o.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="访谈封面" prop="cover">
                                <el-input v-model.trim="model.cover" v-show="false"></el-input>
                                <el-upload class="cover-uploader" name="file"
                                           :action="$store.state.common.uploadUrl"
                                           :accept="$store.state.common.imageAccepts"
                                           :show-file-list="false"
                                           :on-success="handleCoverSuccess"
                                           :on-error="handlerCoverError">
                                    <img v-if="model.cover" :src="$store.state.common.showPicImgUrl + model.cover" class="cover-add">
                                    <i v-else class="el-icon-plus cover-uploader-icon"></i>
                                </el-upload>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="访谈简介" prop="description">
                                <el-input type="textarea" v-model.trim="model.description" :rows="3" maxlength="500" placeholder="请输入访谈简介"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="直播地址" prop="liveUrl">
                                <el-input v-model.trim="model.liveUrl" maxlength="255" placeholder="请输入直播地址"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="视频地址" prop="videoUrl">
                                <el-input v-model.trim="model.videoUrl" maxlength="255" placeholder="请输入视频地址"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!--<el-row :gutter="20" :span="24">-->
                        <!--<el-col :span="24" style="margin-bottom: 0;">-->
                            <!--<el-form-item label="访谈图片" style="margin-bottom: 0">-->
                                <!--<div v-for="(o,i) in model.imageArray" class="image-uploader" :key="i">-->
                                    <!--<el-form-item :prop="`imageArray[${i}].name`"-->
                                                  <!--:rules="{ required: true, message: '请输入访谈图片名称', trigger: 'blur' }"-->
                                                  <!--style="margin-bottom: 0">-->
                                        <!--<img :src="$store.state.common.showPicImgUrl + o.url" class="image-add" >-->
                                        <!--<el-input v-model.trim="o.name" maxlength="20" @change="imageNameChange" style=""></el-input>-->
                                    <!--</el-form-item>-->
                                    <!--<div class="image-mask" @mouseover="imageMouseOver(o.url)" @mouseout="imageMouseOut(o.url)">&lt;!&ndash;v-if="o.del"&ndash;&gt;-->
                                        <!--<el-button  type="danger" icon="el-icon-delete" circle class="image-delete-button" @click="imageDeleteClick(o.url)"></el-button>-->
                                    <!--</div>-->
                                <!--</div>-->
                                <!--<el-upload class="image-uploader" name="file"-->
                                           <!--:action="$store.state.common.uploadUrl"-->
                                           <!--:accept="$store.state.common.imageAccepts"-->
                                           <!--:show-file-list="false"-->
                                           <!--:on-success="handleImagesSuccess"-->
                                           <!--:on-error="handlerImagesError">-->
                                    <!--<i class="el-icon-plus image-uploader-icon"></i>-->
                                <!--</el-upload>-->
                            <!--</el-form-item>-->
                        <!--</el-col>-->
                    <!--</el-row>-->
                    <el-row :gutter="0" :span="24">
                        <el-col :span="24" style="margin-bottom: 0;">
                            <el-form-item label="" prop="images">
                                <el-input v-model.trim="model.images" v-show="false"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model.trim="model.remark" :rows="5" maxlength="500" placeholder="请输入备注"/>
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

            <el-dialog title="直播管理" :fullscreen="true" :visible.sync="liveDialogVisible" :close-on-click-modal="closeOnClickModal" @close="liveCloseModelDialog">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <video controls="controls" src="http://v.weinan.gov.cn:81/upload/hdjl/zxft/20190828103408.mp4"></video>
                    </el-col>

                    <el-col :span="16">
                        <div class="live-content" id="idLiveContent">
                            <div class="live-row" v-for="i in liveMessageArray" :key="i.key">
                                <div class="live-type" v-text="i.type"></div>
                                <div class="live-message" v-html="i.message"></div>
                            </div>
                        </div>

                        <el-form ref="liveMessageDialogForm" class="deyatech-form" :model="liveMessage" label-position="right" label-width="0" :rules="liveMessageRules">
                            <el-row :gutter="20" :span="24">
                                <el-col :span="24">
                                    <el-form-item label="" prop="message">
                                        <editor ref="neditor" id="neditor" :default-msg="liveMessage.message" :config="editorConfig"></editor>
                                    </el-form-item>

                                </el-col>
                            </el-row>
                            <el-row :gutter="20" :span="24">
                                <el-col :span="24">
                                    <el-form-item label="" prop="type">
                                        <el-select v-model="liveMessage.type" placeholder="请选择类型">
                                            <el-option v-for="i in enums['InterviewGuestTypeEnum']" :key="i.code" :label="i.value" :value="i.code"></el-option>
                                        </el-select>
                                        <el-button type="primary" style="margin-left: 20px" @click="sendLiveMessage" :loading="submitLoading">发送</el-button>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-col>
                </el-row>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import editor from '@/components/editor/index.vue'
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getModelListByCategoryAndName,
        createOrUpdateModel,
        delModels,
        appendLiveMessage,
        appendLiveImage
    } from '@/api/interview/model';
    import { getAllCategoryList } from '@/api/interview/category';
    // import SockJS from  'sockjs';
    // import Stomp from 'stompjs';

    export default {
        name: 'model',
        components: {
            editor
        },
        data() {
            const validatorLiveUrl = (rule, value, callback) => {
                if ( /(http|https|ftp):\/\/[^\s]+/.test(value) || /^\/[^\s]*/.test(value) ) {
                    callback();
                } else {
                    callback(new Error("直播地址格式不正确"));
                }
            };
            const validatorVideoUrl = (rule, value, callback) => {
                if ( /(http|https|ftp):\/\/[^\s]+/.test(value) || /^\/[^\s]*/.test(value) ) {
                    callback();
                } else {
                    callback(new Error("视频地址格式不正确"));
                }
            };
            return {
                editorConfig: {
                    serverUrl: this.$store.state.common.uploadUrl,
                    initialFrameWidth: '100%',
                    initialFrameHeight: 350,
                    zIndex: 2000
                },
                modelList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined,
                    categoryId: undefined
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
                        {required: true, message: this.$t("table.pleaseSelect") + '分类'}
                    ],
                    name: [
                        {required: true, message: this.$t("table.pleaseInput") + '访谈名称'}
                    ],
                    time: [
                        {required: true, message: this.$t("table.pleaseSelect") + '访谈时间'}
                    ],
                    cover: [
                        {required: true, message: '请上传访谈封面'}
                    ],
                    description: [
                        {required: true, message: this.$t("table.pleaseInput") + '访谈简介'}
                    ],
                    liveUrl: [
                        {required: true, message: this.$t("table.pleaseInput") + '直播地址'},
                        {validator: validatorLiveUrl, trigger: 'blur'}
                    ],
                    videoUrl: [
                        {required: true, message: this.$t("table.pleaseInput") + '视频地址'},
                        {validator: validatorVideoUrl, trigger: 'blur'}
                    ],
                    status: [
                        {required: true, message: this.$t("table.pleaseSelect") + '访谈状态'}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                categorys: [],
                liveDialogVisible: false,
                liveSockJS: undefined,
                webSocketUrl: 'http://localhost:8088',
                liveImageArray: [],
                liveImage: {
                    key: undefined,
                    name: undefined,
                    url: undefined
                },
                liveImageRules: {
                    name: [
                        {required: true, message: this.$t("table.pleaseInput") + '访谈图片名称'}
                    ],
                    url: [
                        {required: true, message: this.$t("table.pleaseSelect") + '访谈图片'}
                    ]
                },
                liveMessageArray: [],
                liveMessage: {
                    key: undefined,
                    type: undefined,
                    message: undefined
                },
                liveMessageRules: {
                    type: [
                        {required: true, message: this.$t("table.pleaseSelect") + '类型'}
                    ],
                    message: [
                        {required: true, message: this.$t("table.pleaseInput") + '消息内容'}
                    ]
                }
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
            this.loadCategory();
        },
        methods: {
            loadCategory() {
                getAllCategoryList().then(response => {
                    this.categorys = response.data;
                }).catch((error)=>{
                    this.$message.error(error);
                });
            },
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
            },
            handleCoverSuccess(res) {
                if (res.status === 200 && res.data.state === 'SUCCESS') {
                    this.model.cover = res.data.url;
                    this.$message.success('上传成功！');
                } else {
                    this.$message.error('上传失败！');
                }
            },
            handlerCoverError() {
                this.$message.error("上传失败");
            },
            // handleImagesSuccess(res) {
            //     if (res.status === 200 && res.data.state === 'SUCCESS') {
            //         this.liveImageArray.push({name: '', url: res.data.url, del: false});
            //         this.model.images = JSON.stringify(this.liveImageArray);
            //         this.$message.success('上传成功！');
            //     } else {
            //         this.$message.error('上传失败！');
            //     }
            // },
            // handlerImagesError() {
            //     this.$message.error("上传失败");
            // },
            // imageMouseOver(url) {
            //     this.controlDeleteButton(url, true);
            // },
            // imageMouseOut(url) {
            //     this.controlDeleteButton(url, false);
            // },
            // // 删除按钮显示隐藏
            // controlDeleteButton(url, value) {
            //     if (this.model.imageArray) {
            //         for(let image of this.model.imageArray) {
            //             if (image.url === url) {
            //                 image.del = value;
            //                 break;
            //             }
            //         }
            //     }
            // },
            // // 删除图像
            // imageDeleteClick(url) {
            //     if (this.model.imageArray) {
            //         let index = -1;
            //         for(let image of this.model.imageArray) {
            //             index += 1;
            //             if (image.url === url) {
            //                 break;
            //             }
            //         }
            //         if (index > -1) {
            //             this.model.imageArray.splice(index, 1);
            //         }
            //         if (this.model.imageArray && this.model.imageArray.length > 0) {
            //             this.model.images = JSON.stringify(this.model.imageArray);
            //         } else {
            //             this.model.images = undefined;
            //         }
            //     }
            // },
            // imageNameChange() {
            //     if (this.liveImageArray) {
            //         this.model.images = JSON.stringify(this.liveImageArray);
            //     }
            // },
            liveCloseModelDialog() {
                this.liveDialogVisible = false;
                this.resetModel();
                if(this.liveSockJS) {
                    this.liveSockJS.close()
                }
                this.liveSockJS = undefined;
            },
            btnLiveUpdate(row){
                this.waitingLiveMessage();
                this.resetModel();
                if (row.id) {
                    this.model = deepClone(row);
                } else {
                    this.model = deepClone(this.selectedRows[0]);
                }

                if (this.model.images) {
                    this.liveImageArray = JSON.parse(this.model.images);
                } else {
                    this.liveImageArray = [];
                }

                if (this.model.content) {
                    this.liveMessageArray = JSON.parse(this.model.content);
                } else {
                    this.liveMessageArray = [];
                }

                this.liveDialogVisible = true;
            },
            waitingLiveMessage: function() {
                var _this = this;
                console.log('waitingMessage');
                var sockJS = new SockJS(this.webSocketUrl + "/websocketlive/");
                var stompClient = Stomp.over(sockJS);
                stompClient.connect({}, function () {
                    stompClient.subscribe('/topic/live/message/', function (response) {
                        _this.liveMessageArray.push(JSON.parse(response.body));
                    });
                });
                sockJS.onclose = function () {
                    console.dir("WebSocket 连接已经断开");
                    // 断开五秒后重连
                    setTimeout(function () {
                        _this.waitingLiveMessage();
                    }, 5000);
                }
                this.liveSockJS = sockJS;
            },
            generateKey() {
                let date = new Date();
                return new String(Math.random()).substr(3, 6) + date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds();
            },
            sendLiveMessage: function() {
                this.liveMessage.message = this.$refs['neditor'].getUeContent();
                this.$refs['liveMessageDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        let data = {};
                        data.key = this.generateKey();
                        // 主持人
                        if (this.liveMessage.type == 1) {
                            data.type = '主持人：'
                        } else if (this.liveMessage.type == 2) {
                            data.type = '嘉宾：';
                        }
                        data.message = this.liveMessage.message;
                        data.modelId = this.model.id;

                        appendLiveMessage(data).then((response) => {
                            if (response.status == 200 && response.data) {
                                this.$nextTick(function(){
                                    let div = document.getElementById('idLiveContent');
                                    div.scrollTop = div.scrollHeight;
                                })

                            } else {
                                this.$message.error("发送失败");
                            }
                            this.submitLoading = false;
                        });
                    } else {
                        return false;
                    }
                })


            }
        }
    }
</script>


<style>
    video {
        width: 100%;
        height: 100%;
        object-fit:fill;
    }
    .live-content {
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        height: 300px;
        max-height: 300px;
        scroll-y: scroll;
        overflow-x: hidden;
        overflow-y: auto;
        padding: 10px;
    }

    .live-row {
        margin-bottom: 10px;
    }
    .live-type {
        color: #cc3333;
        display: block;
        text-indent: 0em;
    }
    .live-message {
        padding-left: 28px;
    }



    .cover-uploader {
        width: 160px;
        height: 160px;
    }

    .cover-uploader .el-upload {
        border: 1px solid #dcdfe6;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .cover-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .cover-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 160px;
        height: 160px;
        line-height: 160px;
        text-align: center;
    }

    .cover-add {
        width: 160px;
        height: 160px;
        display: block;
    }




    .image-uploader {
        width: 160px;
        height: 230px;
        margin-right: 10px;
        display: inline-block;
        position: relative;
        vertical-align: top;
    }

    .image-uploader .el-upload {
        border: 1px solid #dcdfe6;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .image-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .image-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 160px;
        height: 202px;
        line-height: 202px;
        text-align: center;
    }

    .image-add {
        width: 160px;
        height: 160px;
        display: block;
        margin-bottom: 4px;
    }
    .image-delete-button {
        position: relative;
        left: 60px;
        top: 60px;
        z-index: 9999;
        /*left: 60px;*/
        /*top: -144px;*/
    }
    .image-mask {
        width: 160px;
        height: 160px;
        position: relative;
        left: 0px;
        top: -204px;
        display: inline-block;
    }


</style>
