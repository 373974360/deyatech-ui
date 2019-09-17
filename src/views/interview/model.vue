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
                        <el-input :size="searchSize" placeholder="请输入条件" v-model.trim="listQuery.name"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="reloadList" :disabled="!this.listQuery.categoryId">{{$t('table.search')}}</el-button>
                        <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="deyatech-menu">
                <div class="deyatech-menu_left">
                    <el-button v-if="btnEnable.create" type="primary" :size="btnSize" @click="btnCreate" :disabled="!this.listQuery.categoryId">{{$t('table.create')}}</el-button>
                    <el-button v-if="btnEnable.update" type="primary" :size="btnSize" @click="btnUpdate" :disabled="selectedRows.length != 1">{{$t('table.update')}}</el-button>
                    <el-button v-if="btnEnable.delete" type="danger" :size="btnSize" @click="btnDelete" :disabled="selectedRows.length < 1">{{$t('table.delete')}}</el-button>
                    <el-button v-if="btnEnable.update" type="primary" :size="btnSize" @click="btnLiveUpdate" :disabled="selectedRows.length != 1">直播</el-button>
                </div>
                <div class="deyatech-menu_right">
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList" :disabled="!this.listQuery.categoryId"></el-button>
                </div>
            </div>

            <!--访谈模型列表-->
            <el-table ref="modelTable" :data="modelList" v-loading.body="listLoading" stripe border highlight-current-row
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
                <el-table-column align="center" label="访谈状态" prop="status">
                    <template slot-scope="scope">{{scope.row.status | enums('InterviewModelStatusEnum')}}</template>
                </el-table-column>
                <el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                            {{scope.row.enable | enums('EnableEnum')}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="200">
                    <template slot-scope="scope">
                        <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                                   @click.stop="btnUpdate(scope.row)"></el-button>
                        <el-button v-if="btnEnable.delete" :title="$t('table.delete')" type="danger" icon="el-icon-delete" :size="btnSize" circle
                                   @click.stop="btnDelete(scope.row)"></el-button>
                        <el-button v-if="btnEnable.live" title="直播" type="primary" icon="iconvideo" :size="btnSize" circle
                                   @click.stop="btnLiveUpdate(scope.row)"></el-button>
                        <el-button v-if="btnEnable.guest" title="嘉宾" type="primary" icon="iconadd-account" :size="btnSize" circle
                                   @click.stop="btnGuest(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="deyatech-pagination pull-right" background
                           :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                           :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                           @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>


            <!--访谈模型表单-->
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
                                    value-format="yyyy-MM-dd HH:mm"
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
                                    <img v-if="model.cover" :src="showPicImgUrl + model.cover" class="cover-add">
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



            <el-dialog title="直播互动" :fullscreen="false" :visible.sync="liveDialogVisible" :close-on-click-modal="closeOnClickModal" @close="liveCloseModelDialog">
                <el-row>
                    <!--左侧-->
                    <el-col :span="6">
                        <el-row :span="24">
                            <el-col :span="24">
                                <video controls="controls" :src="model.liveUrl"></video>
                            </el-col>
                        </el-row>

                        <el-row :span="24">
                            <el-col :span="24">
                                <div class="live-content-image" id="idLiveImage">
                                    <div class="live-row" v-for="i in liveImageArray" :key="i.key">
                                        <img class="live-image" :src="showPicImgUrl + i.url"/>
                                        <div style="text-align: center">
                                            <span class="live-image-name" v-text="i.name"></span>
                                            <el-button :size="btnSize" @click="openModifyLiveImage(i.key)">编辑</el-button>
                                            <el-button :size="btnSize" @click="deleteLiveImage(i.key)">删除</el-button>
                                        </div>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>

                        <el-form ref="liveImageDialogForm" class="deyatech-form" :model="liveImage" label-position="right" label-width="0" :rules="liveImageRules">
                            <el-row :span="24">
                                <el-col :span="24" style="margin-bottom: 0">
                                    <el-form-item label="" prop="url" style="line-height: 14px">
                                        <el-input v-model="liveImage.url" v-show="false"></el-input>
                                        <el-upload class="image-uploader" name="file"
                                                   :action="$store.state.common.uploadUrl"
                                                   :accept="$store.state.common.imageAccepts"
                                                   :show-file-list="false"
                                                   :on-success="handleImagesSuccess"
                                                   :on-error="handlerImagesError">
                                            <img v-if="liveImage.url" :src="showPicImgUrl + liveImage.url" class="image-add">
                                            <i v-else class="el-icon-plus image-uploader-icon"></i>
                                        </el-upload>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :span="24">
                                <el-col :span="24" style="margin-bottom: 0">
                                    <el-form-item label="" prop="name">
                                        <el-input v-model="liveImage.name" :size="btnSize" maxlength="30" placeholder="请输入图片名称" style="width: 100%;"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :span="24">
                                <el-col :span="24">
                                    <el-button type="primary" @click="appendLiveImage" :size="btnSize">发送</el-button>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-col>



                    <!--右侧-->
                    <el-col :span="18">
                        <el-form ref="liveMessageDialogForm" class="deyatech-form" :model="liveMessage" label-position="right" label-width="0" :rules="liveMessageRules">
                            <el-row :span="24">
                                <el-col :span="24" style="margin-bottom: 0;">
                                    <el-form-item label="" prop="message">
                                        <div class="live-content-message" id="idLiveContent">
                                            <div class="live-row" v-for="i in liveMessageArray" :key="i.key">
                                                <div>
                                                    <span class="live-type" v-text="i.type == 1 ? '主持人：' : '嘉宾：'"></span>
                                                    <span class="live-button" @click="openModifyLiveMessage(i.key)">编辑</span>
                                                    <span class="live-button" @click="deleteLiveMessage(i.key)">删除</span>
                                                </div>
                                                <div class="live-message" v-html="i.message"></div>
                                            </div>
                                        </div>

                                        <editor ref="appendEditor" id="appendEditor" :default-msg="liveMessage.message" :config="editorConfig"></editor>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :span="24">
                                <el-col :span="24">
                                    <el-form-item label="" prop="type">
                                        <el-select v-model="liveMessage.type" placeholder="请选择类型" :size="btnSize">
                                            <el-option v-for="i in enums['InterviewGuestTypeEnum']" :key="i.code" :label="i.value" :value="i.code"></el-option>
                                        </el-select>
                                        <el-button type="primary" style="margin-left: 20px" @click="appendLiveMessage" :loading="submitLoading" :size="btnSize">发送</el-button>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-col>
                </el-row>
            </el-dialog>



            <el-dialog title="修改图片" :visible.sync="modifyLiveImageDialogVisible" :close-on-click-modal="closeOnClickModal" @close="modifyLiveImageCloseModelDialog">
                <el-form ref="modifyLiveImageDialogForm" class="deyatech-form" :model="liveModifyImage" label-position="right" label-width="0" :rules="liveImageRules">
                    <el-row :span="24">
                        <el-col :span="6">
                            <el-form-item label="" prop="url" style="line-height: 14px">
                                <el-input v-model="liveModifyImage.url" v-show="false"></el-input>
                                <el-upload class="image-uploader" name="file"
                                           :action="$store.state.common.uploadUrl"
                                           :accept="$store.state.common.imageAccepts"
                                           :show-file-list="false"
                                           :on-success="handleModifyImagesSuccess"
                                           :on-error="handlerImagesError">
                                    <img v-if="liveModifyImage.url" :src="showPicImgUrl + liveModifyImage.url" class="image-add">
                                    <i v-else class="el-icon-plus image-uploader-icon"></i>
                                </el-upload>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :span="24">
                        <el-col :span="24">
                            <el-form-item label="" prop="name" style="margin-bottom: 0">
                                <el-input v-model="liveModifyImage.name" :size="btnSize" maxlength="30" placeholder="请输入图片名称" style="width: 200px;"></el-input>
                                <el-button type="primary" style="margin-left: 20px" @click="modifyLiveImage" :size="btnSize">修改</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-dialog>



            <el-dialog title="修改消息" :visible.sync="modifyLiveMessageDialogVisible" width="50%" :close-on-click-modal="closeOnClickModal" @close="modifyLiveMessageCloseModelDialog">
                <el-form ref="modifyLiveMessageDialogForm" class="deyatech-form" :model="liveModifyMessage" label-position="right" label-width="0" :rules="liveMessageRules">
                    <el-row :span="24">
                        <el-col :span="24">
                            <el-form-item label="" prop="message">
                                <editor ref="modifyEditor" id="modifyEditor" :default-msg="liveModifyMessage.message" :config="editorConfig"></editor>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24">
                        <el-col :span="24">
                            <el-form-item label="" prop="type">
                                <el-select v-model="liveModifyMessage.type" placeholder="请选择类型" :size="btnSize">
                                    <el-option v-for="i in enums['InterviewGuestTypeEnum']" :key="i.code" :label="i.value" :value="i.code"></el-option>
                                </el-select>
                                <el-button type="primary" style="margin-left: 20px" @click="modifyLiveMessage" :loading="submitLoading" :size="btnSize">修改</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-dialog>


            <!--嘉宾管理 列表-->
            <el-dialog :title="titleGuest" :visible.sync="guestDialogVisible" :fullscreen="false" :close-on-click-modal="closeOnClickModal" @close="guestCloseModelDialog">
                <div class="deyatech-header">
                    <el-form :inline="true" ref="guestSearchForm">
                        <el-form-item>
                            <el-input :size="searchSize" placeholder="请输入条件" v-model.trim="guestListQuery.name"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-select :size="searchSize" v-model.trim="guestListQuery.type" placeholder="请选择类型">
                                <el-option v-for="i in enums['InterviewGuestTypeEnum']" :key="i.code" :label="i.value" :value="i.code"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="guestReloadList">{{$t('table.search')}}</el-button>
                            <el-button icon="el-icon-delete" :size="searchSize" @click="guestResetSearch">{{$t('table.clear')}}</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="deyatech-menu">
                    <div class="deyatech-menu_left">
                        <el-button v-if="btnEnable.guestCreate" type="primary" :size="btnSize" @click="btnGuestCreate">{{$t('table.create')}}</el-button>
                        <el-button v-if="btnEnable.guestUpdate" type="primary" :size="btnSize" @click="btnGuestUpdate" :disabled="guestSelectedRows.length != 1">{{$t('table.update')}}</el-button>
                        <el-button v-if="btnEnable.guestDelete" type="danger" :size="btnSize" @click="btnGuestDelete" :disabled="guestSelectedRows.length < 1">{{$t('table.delete')}}</el-button>
                    </div>
                    <div class="deyatech-menu_right">
                        <el-button icon="el-icon-refresh" :size="btnSize" circle @click="guestReloadList"></el-button>
                    </div>
                </div>
                <el-table :data="guestList" v-loading.body="guestListLoading" stripe border highlight-current-row
                          @selection-change="guestHandleSelectionChange">
                    <el-table-column type="selection" width="50" align="center"/>
                    <el-table-column align="center" label="姓名" prop="name">
                        <template slot-scope="scope">
                            <span class="link-type" @click='btnGuestUpdate(scope.row)'>{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <!--<el-table-column align="center" label="照片" prop="photo" width="120">
                        <template slot-scope="scope">
                            <img :src="showPicImgUrl + scope.row.photo" style="width: 100px; height: 100px;">
                        </template>
                    </el-table-column>-->
                    <el-table-column align="center" label="职务" prop="job"/>
                    <el-table-column align="center" label="类型" prop="type" width="100">
                        <template slot-scope="scope">
                            {{scope.row.type | enums('InterviewGuestTypeEnum')}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                                {{scope.row.enable | enums('EnableEnum')}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="100">
                        <template slot-scope="scope">
                            <el-button v-if="btnEnable.guestUpdate" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                                       @click.stop="btnGuestUpdate(scope.row)"></el-button>
                            <el-button v-if="btnEnable.guestDelete" :title="$t('table.delete')" type="danger" icon="el-icon-delete" :size="btnSize" circle
                                       @click.stop="btnGuestDelete(scope.row)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination class="deyatech-pagination pull-right" background
                               :current-page.sync="guestListQuery.page" :page-sizes="this.$store.state.common.pageSize"
                               :page-size="guestListQuery.size" :layout="this.$store.state.common.pageLayout" :total="guestTotal"
                               @size-change="guestHandleSizeChange" @current-change="guestHandleCurrentChange">
                </el-pagination>
            </el-dialog>


            <!--嘉宾管理 表单-->
            <el-dialog :title="titleMap[guestDialogTitle]" :visible.sync="guestDialogVisibleCreateUpdate"
                       :close-on-click-modal="closeOnClickModal" @close="guestCloseDialogCreateUpdate">
                <el-form ref="guestDialogForm" class="deyatech-form" :model="guest" label-position="right" label-width="80px" :rules="guestRules">
                    <el-row :span="24">
                        <el-col :span="12">
                            <el-row :span="24">
                                <el-col :span="24">
                                    <el-form-item label="模型" prop="modelId">
                                        <el-input :value="model.name" readonly></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20" :span="24">
                                <el-col :span="24">
                                    <el-form-item label="姓名" prop="name">
                                        <el-input v-model.trim="guest.name" maxlength="20" placeholder="请输入姓名"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20" :span="24">
                                <el-col :span="24">
                                    <el-form-item label="类型" prop="type">
                                        <el-select v-model.trim="guest.type" placeholder="请选择类型" style="width: 100%;">
                                            <el-option v-for="i in enums['InterviewGuestTypeEnum']" :key="i.code" :label="i.value" :value="i.code"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20" :span="24">
                                <el-col :span="24">
                                    <el-form-item label="职务" prop="job">
                                        <el-input v-model.trim="guest.job" maxlength="50" placeholder="请输入职务"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20" :span="24">
                                <el-col :span="24">
                                    <el-form-item label="部门" prop="departmentName">
                                        <el-cascader ref="mycascader" :options="departmentCascader" v-model="departmentValue"
                                                     :props="{ checkStrictly: true }"
                                                     filterable :debounce="500" style="width: 100%"
                                                     :before-filter="beforeFilterDepartment"
                                                     @blur="blurDepartment"
                                                     @focus="focusDepartment"
                                        ></el-cascader>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-col>
                        <el-col :span="12">
                            <el-row :gutter="20" :span="24">
                                <el-col :span="24">
                                    <el-form-item label="照片" prop="photo">
                                        <el-input v-model.trim="guest.photo" v-show="false"></el-input>
                                        <el-upload class="photo-uploader" name="file"
                                                   :action="$store.state.common.uploadUrl"
                                                   :accept="$store.state.common.imageAccepts"
                                                   :show-file-list="false"
                                                   :on-success="handlePhotoSuccess"
                                                   :on-error="handlerPhotoError">
                                            <img v-if="guest.photo" :src="showPicImgUrl + guest.photo" class="photo-add">
                                            <i v-else class="el-icon-plus photo-uploader-icon"></i>
                                        </el-upload>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model.trim="guest.remark" :rows="3" maxlength="500" placeholder="请输入备注"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="guestDialogTitle=='create'" type="primary" :size="btnSize" @click="doGuestCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doGuestUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="guestCloseDialogCreateUpdate">{{$t('table.cancel')}}</el-button>
                </span>
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
        operateLiveMessage,
        operateLiveImage
    } from '@/api/interview/model';
    import { getAllCategoryList } from '@/api/interview/category';
    import {
        getGuestList,
        createOrUpdateGuest,
        delGuests
    } from '@/api/interview/guest';
    import {getDepartmentCascader} from '@/api/admin/department';


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
                    initialFrameHeight: 200,
                    zIndex: 3000
                },
                showPicImgUrl: this.$store.state.common.showPicImgUrl,
                modelList: undefined,
                total: undefined,
                listLoading: false,
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
                liveMessageSockJS: undefined,
                liveImageSockJS: undefined,
                reconnectionSockJS: false,
                liveImageArray: [],
                liveImage: {
                    key: undefined,
                    name: undefined,
                    url: undefined
                },
                liveModifyImage: {
                    key: undefined,
                    name: undefined,
                    url: undefined
                },
                liveImageRules: {
                    name: [
                        {required: true, message: this.$t("table.pleaseInput") + '图片名称'}
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
                liveModifyMessage: {
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
                },
                modifyLiveImageDialogVisible: false,
                modifyLiveMessageDialogVisible: false,
                // 嘉宾管理
                titleGuest: undefined,
                guestDialogVisible: false,
                guestDialogVisibleCreateUpdate: false,
                guestDialogTitle: undefined,
                guestListQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined,
                    modelId: undefined,
                    type: undefined
                },
                guest: {
                    id: undefined,
                    modelId: undefined,
                    name: undefined,
                    photo: undefined,
                    job: undefined,
                    type: undefined,
                    departmentId: undefined,
                    departmentName: undefined,
                    departmentTreePosition: undefined
                },
                guestRules: {
                    modelId: [
                        {required: true, message: this.$t("table.pleaseSelect") + '模型'}
                    ],
                    name: [
                        {required: true, message: this.$t("table.pleaseInput") + '姓名'}
                    ],
                    photo: [
                        {required: true, message: '请上传照片'}
                    ],
                    job: [
                        {required: true, message: this.$t("table.pleaseInput") + '职务'}
                    ],
                    type: [
                        {required: true, message: this.$t("table.pleaseSelect") + '类型'}
                    ],
                    departmentName: [
                        {required: true, message: this.$t("table.pleaseSelect") + '部门'}
                    ]
                },
                guestListLoading: false,
                guestList: undefined,
                guestTotal: undefined,
                guestSelectedRows: [],
                departmentCascader: [],
                departmentCascaderBack: [],
                departmentCascaderLength: 0,
                inputDepartmentName: undefined,
                departmentValue: undefined,
                increment: 1
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
                    delete: this.permission.model_delete,
                    live:   this.permission.model_live,
                    guest:  this.permission.model_guest,
                    guestCreate: this.permission.guest_create,
                    guestUpdate: this.permission.guest_update,
                    guestDelete: this.permission.guest_delete
                };
            }
        },
        created(){
            this.$store.state.common.selectSiteDisplay = true;
            if (this.$store.state.common.siteId) {
                this.loadCategory();
            }
        },
        methods: {
            loadCategory() {
                getAllCategoryList({siteId: this.$store.state.common.siteId}).then(response => {
                    this.categorys = response.data;
                    if (this.categorys && this.categorys.length > 0) {
                        this.listQuery.categoryId = this.categorys[0].id;
                        this.reloadList();
                    }
                }).catch((error)=>{
                    this.$message.error(error);
                });
            },
            resetSearch() {
                this.listQuery.name = undefined;
            },
            reloadList(){
                if (!this.listQuery.categoryId) {
                    return;
                }
                this.listLoading = true;
                this.modelList = undefined;
                getModelListByCategoryAndName(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.modelList = response.data.records;
                    this.total = response.data.total;
                }).catch(()=>{
                    this.listLoading = false;
                    this.total = 0;
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
            btnCreate(){
                this.resetModel();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
                this.model.categoryId = this.listQuery.categoryId;
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
            // 关闭直播
            liveCloseModelDialog() {
                this.liveDialogVisible = false;
                this.resetModel();
                if(this.liveMessageSockJS) {
                    this.liveMessageSockJS.close();
                }
                if(this.liveImageSockJS) {
                    this.liveImageSockJS.close();
                }
                this.liveMessageSockJS = undefined;
                this.liveImageSockJS = undefined;
                this.reconnectionSockJS = false;
                this.reloadList();
                this.$refs['liveImageDialogForm'].resetFields();
                this.$refs['liveMessageDialogForm'].resetFields();
            },
            // 打开直播
            btnLiveUpdate(row){
                this.resetModel();

                this.resetLiveMessage();
                this.resetLiveImage();

                this.waitingLiveMessage();
                this.waitingLiveImage();

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
                this.reconnectionSockJS = true;
            },
            // 等待直播消息
            waitingLiveMessage: function() {
                let _this = this;
                let sockJS = new SockJS("/web/websocket/");
                let stompClient = Stomp.over(sockJS);
                stompClient.connect({}, function () {
                    stompClient.subscribe('/topic/live/message/', function (response) {
                        //append,modify,delete
                        let operate = JSON.parse(response.body);
                        let arr = operate.key.split(',');
                        operate.key = arr[0];
                        let flag = arr[1];
                        if (flag === 'append') {
                            _this.liveMessageArray.push(operate);
                            _this.$message.success("消息添加成功");
                            _this.$nextTick(function(){
                                let div = document.getElementById('idLiveContent');
                                div.scrollTop = div.scrollHeight;
                            });
                        } else {
                            let index = -1;
                            for(let i = 0; i < _this.liveMessageArray.length; i++) {
                                let obj = _this.liveMessageArray[i];
                                if (operate.key === obj.key) {
                                    index = i;
                                    break;
                                }
                            }
                            if (flag === 'modify') {
                                _this.liveMessageArray[index].key = operate.key;
                                _this.liveMessageArray[index].type = operate.type;
                                _this.liveMessageArray[index].message = operate.message;
                                _this.$message.success("消息修改成功");
                            } else if (flag === 'delete') {
                                _this.liveMessageArray.splice(index, 1);
                                _this.$message.success("消息删除成功");
                            }
                        }
                    });
                    console.log('消息 WebSocket 连接...');
                });
                sockJS.onclose = function () {
                    console.log("消息 WebSocket 连接已经断开");
                    if (this.reconnectionSockJS) {
                        setTimeout(function () {_this.waitingLiveMessage();}, 5000);
                    }
                }
                this.liveMessageSockJS = sockJS;
            },
            // 等待图片消息
            waitingLiveImage: function() {
                let _this = this;
                let sockJS = new SockJS("/web/websocket/");
                let stompClient = Stomp.over(sockJS);
                stompClient.connect({}, function () {
                    stompClient.subscribe('/topic/live/image/', function (response) {
                        //append,modify,delete
                        let operate = JSON.parse(response.body)
                        let arr = operate.key.split(',');
                        operate.key = arr[0];
                        let flag = arr[1];
                        if (flag === 'append') {
                            _this.liveImageArray.push(operate);
                            _this.$message.success("图片添加成功");
                            _this.$nextTick(function () {
                                let div = document.getElementById('idLiveImage');
                                div.scrollTop = div.scrollHeight;
                            });
                        } else {
                            let index = -1;
                            for(let i = 0; i < _this.liveImageArray.length; i++) {
                                let obj = _this.liveImageArray[i];
                                if (operate.key === obj.key) {
                                    index = i;
                                    break;
                                }
                            }
                            if (flag === 'modify') {
                                _this.liveImageArray[index].key = operate.key;
                                _this.liveImageArray[index].name = operate.name;
                                _this.liveImageArray[index].url = operate.url;
                                _this.$message.success("图片修改成功");
                            } else if (flag === 'delete') {
                                _this.liveImageArray.splice(index, 1);
                                _this.$message.success("图片删除成功");
                            }
                        }
                    });
                    console.log('图片 WebSocket 连接...');
                });
                sockJS.onclose = function () {
                    console.log("图片 WebSocket 连接已经断开");
                    if (this.reconnectionSockJS) {
                        setTimeout(function () {_this.waitingLiveImage();}, 5000);
                    }
                }
                this.liveImageSockJS = sockJS;
            },
            // 保存消息
            sendOperateLiveMessage(data) {
                operateLiveMessage(data).then((response) => {
                    if (response.status == 200 && response.data) {
                        this.resetLiveMessage();
                    } else {
                        this.$message.error("发送失败");
                    }
                    this.submitLoading = false;
                }).catch(error=>{
                    this.$message.error(error);
                });
            },
            // 添加消息
            appendLiveMessage: function() {
                this.liveMessage.message = this.$refs['appendEditor'].getUeContent();
                this.$refs['liveMessageDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        let data = {};
                        data.key = undefined;
                        data.type = this.liveMessage.type;
                        data.message = this.liveMessage.message;
                        data.modelId = this.model.id;
                        this.sendOperateLiveMessage(data);
                    } else {
                        return false;
                    }
                });
            },
            // 编辑消息
            openModifyLiveMessage(key) {
                this.resetModifyLiveMessage();
                this.modifyLiveMessageDialogVisible = true;
                for(let item of this.liveMessageArray) {
                    if (item.key === key) {
                        this.liveModifyMessage.key = item.key;
                        this.liveModifyMessage.type = item.type;
                        this.liveModifyMessage.message = item.message;
                        break;
                    }
                }
            },
            // 保存编辑后的消息
            modifyLiveMessage() {
                this.liveModifyMessage.message = this.$refs['modifyEditor'].getUeContent();
                this.$refs['modifyLiveMessageDialogForm'].validate(valid => {
                    if(valid) {
                        let data = {};
                        data.key = this.liveModifyMessage.key;
                        data.type = this.liveModifyMessage.type;
                        data.message = this.liveModifyMessage.message;
                        data.modelId = this.model.id;
                        this.sendOperateLiveMessage(data);
                        this.modifyLiveMessageCloseModelDialog();
                    } else {
                        return false;
                    }
                });
            },
            // 关闭编辑对话框
            modifyLiveMessageCloseModelDialog() {
                this.resetLiveMessage();
                this.$refs['modifyLiveMessageDialogForm'].resetFields();
                this.modifyLiveMessageDialogVisible = false;
            },
            // 删除消息
            deleteLiveMessage(key) {
                let data = {};
                data.key = key;
                data.type = undefined;
                data.message = undefined;
                data.modelId = this.model.id;
                this.sendOperateLiveMessage(data);
            },
            // 图片保存
            sendOperateLiveImage(data) {
                operateLiveImage(data).then((response) => {
                    if (response.status == 200 && response.data) {
                        this.resetLiveImage();
                        this.$refs['liveImageDialogForm'].resetFields();
                    } else {
                        this.$message.error("发送失败");
                    }
                }).catch(error=>{
                    this.$message.error(error);
                });
            },
            // 添加图片
            appendLiveImage: function() {
                this.$refs['liveImageDialogForm'].validate(valid => {
                    if(valid) {
                        let data = {};
                        data.key = undefined;
                        data.name = this.liveImage.name;
                        data.url = this.liveImage.url;
                        data.modelId = this.model.id;
                        this.sendOperateLiveImage(data);
                    } else {
                        return false;
                    }
                });
            },
            // 编辑图片
            openModifyLiveImage(key) {
                this.resetModifyLiveImage();
                this.modifyLiveImageDialogVisible = true;
                for(let item of this.liveImageArray) {
                    if (item.key === key) {
                        this.liveModifyImage.key = item.key;
                        this.liveModifyImage.name = item.name;
                        this.liveModifyImage.url = item.url;
                        break;
                    }
                }
            },
            // 保存编辑后的图片
            modifyLiveImage() {
                this.$refs['modifyLiveImageDialogForm'].validate(valid => {
                    if(valid) {
                        let data = {};
                        data.key = this.liveModifyImage.key;
                        data.name = this.liveModifyImage.name;
                        data.url = this.liveModifyImage.url;
                        data.modelId = this.model.id;
                        this.sendOperateLiveImage(data);
                        this.modifyLiveImageCloseModelDialog();
                    } else {
                        return false;
                    }
                });
            },
            // 关闭编辑对话框
            modifyLiveImageCloseModelDialog() {
                this.resetLiveImage();
                this.$refs['modifyLiveImageDialogForm'].resetFields();
                this.modifyLiveImageDialogVisible = false;
            },
            // 删除图片
            deleteLiveImage(key) {
                let data = {};
                data.key = key;
                data.name = undefined;
                data.url = undefined;
                data.modelId = this.model.id;
                this.sendOperateLiveImage(data);
            },
            resetLiveMessage() {
                this.liveMessage = {
                    key: undefined,
                    type: undefined,
                    message: undefined
                };
            },
            resetModifyLiveMessage() {
                this.liveModifyMessage = {
                    key: undefined,
                    type: undefined,
                    message: undefined
                };
            },
            resetLiveImage() {
                this.liveImage = {
                    key: undefined,
                    name: undefined,
                    url: undefined
                };
            },
            resetModifyLiveImage() {
                this.liveModifyImage = {
                    key: undefined,
                    name: undefined,
                    url: undefined
                };
            },
            handleImagesSuccess(res) {
                if (res.status === 200 && res.data.state === 'SUCCESS') {
                    this.liveImage.url = res.data.url;
                    this.$message.success('上传成功！');
                } else {
                    this.$message.error('上传失败！');
                }
            },
            handleModifyImagesSuccess(res) {
                if (res.status === 200 && res.data.state === 'SUCCESS') {
                    this.liveModifyImage.url = res.data.url;
                    this.$message.success('上传成功！');
                } else {
                    this.$message.error('上传失败！');
                }
            },
            handlerImagesError() {
                this.$message.error("上传失败");
            },

            // 嘉宾管理
            btnGuest(row) {
                this.resetModel();
                this.guestResetSearch();
                if (row.id) {
                    this.model = deepClone(row);
                } else {
                    this.model = deepClone(this.selectedRows[0]);
                }
                this.titleGuest = this.model.name + ' - 嘉宾管理';
                this.guestDialogVisible = true;
                this.guestReloadList();
                this.getDepartmentCascader();
            },
            guestCloseModelDialog() {
                this.guestDialogVisible = false;
                this.guestResetSearch();
            },
            guestResetSearch(){
                this.guestListQuery.modelId = undefined;
                this.guestListQuery.name = undefined;
                this.guestListQuery.type = undefined;
            },
            guestReloadList(){
                this.guestListLoading = true;
                this.guestList = undefined;
                this.guestListQuery.modelId = this.model.id;
                getGuestList(this.guestListQuery).then(response => {
                    this.guestListLoading = false;
                    this.guestList = response.data.records;
                    this.guestTotal = response.data.total;
                }).catch(()=>{
                    this.guestListLoading = false;
                    this.guestTotal = 0;
                });
            },
            btnGuestCreate(){
                this.resetGuest();
                this.guestDialogTitle = 'create';
                this.guestDialogVisibleCreateUpdate = true;
                this.guest.modelId = this.model.id;
                this.departmentCascader = deepClone(this.departmentCascaderBack);
                this.departmentValue = [];
            },
            btnGuestUpdate(row){
                this.resetGuest();
                if (row.id) {
                    this.guest = deepClone(row);
                } else {
                    this.guest = deepClone(this.guestSelectedRows[0]);
                }
                this.guestDialogTitle = 'update';
                this.guestDialogVisibleCreateUpdate = true;
                this.guest.modelId = this.model.id;
                let list = deepClone(this.departmentCascaderBack);
                // 输入值时
                if (!this.guest.departmentId) {
                    let value = this.getCascaderItemValue();
                    let item = {
                        value: value,
                        label: this.guest.departmentName,
                        children: undefined,
                        disabled: false
                    };
                    list.push(item);
                    this.guest.departmentTreePosition = '&' + value;
                } else {
                    if (this.guest.departmentTreePosition) {
                        this.guest.departmentTreePosition += '&' + this.guest.departmentId
                    } else {
                        this.guest.departmentTreePosition = '&' + this.guest.departmentId
                    }
                }
                this.departmentCascader = list;
                this.departmentValue = this.guest.departmentTreePosition.substr(1).split('&');
            },
            btnGuestDelete(row){
                let ids = [];
                if (row.id) {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        ids.push(row.id);
                        this.doGuestDelete(ids);
                    })
                } else {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        for(const deleteRow of this.guestSelectedRows){
                            ids.push(deleteRow.id);
                        }
                        this.doGuestDelete(ids);
                    })
                }
            },
            doGuestCreate() {
                this.getSelectDepartment();
                this.$refs['guestDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        if (this.guest.departmentId.length < 3) {
                            this.guest.departmentId = undefined;
                        } else {
                            this.guest.departmentName = undefined;
                        }
                        createOrUpdateGuest(this.guest).then(() => {
                            this.resetGuestDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doGuestUpdate() {
                this.getSelectDepartment();
                this.$refs['guestDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        if (this.guest.departmentId.length < 3) {
                            this.guest.departmentId = undefined;
                        } else {
                            this.guest.departmentName = undefined;
                        }
                        createOrUpdateGuest(this.guest).then(() => {
                            this.resetGuestDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            getSelectDepartment() {
                if (this.departmentValue && this.departmentValue.length > 0) {
                    this.guest.departmentId = this.departmentValue[this.departmentValue.length - 1];
                    let targetList = this.departmentCascader;
                    for (let i = 0; i < this.departmentValue.length; i++) {
                        for (let j = 0; j < targetList.length; j++) {
                            let item = targetList[j];
                            if (this.departmentValue[i] === item.value) {
                                this.guest.departmentName = item.label;
                                targetList = item.children;
                                break;
                            }
                        }
                    }
                }
            },
            doGuestDelete(ids){
                this.guestListLoading = true;
                delGuests(ids).then(() => {
                    this.guestReloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetGuest(){
                this.guest = {
                    id: undefined,
                    modelId: undefined,
                    name: undefined,
                    photo: undefined,
                    job: undefined,
                    type: undefined,
                    departmentId: undefined,
                    departmentName: undefined,
                    departmentTreePosition: undefined
                }
            },
            resetGuestDialogAndList(){
                this.guestCloseDialogCreateUpdate();
                this.submitLoading = false;
                this.guestReloadList();
            },
            guestHandleSelectionChange(rows){
                this.guestSelectedRows = rows;
            },
            guestHandleSizeChange(val){
                this.guestListQuery.size = val;
                this.guestReloadList();
            },
            guestHandleCurrentChange(val){
                this.guestListQuery.page = val;
                this.guestReloadList();
            },
            guestCloseDialogCreateUpdate() {
                this.guestDialogVisibleCreateUpdate = false;
                this.resetGuest();
                this.$refs['guestDialogForm'].resetFields();
            },
            handlePhotoSuccess(res) {
                if (res.status === 200 && res.data.state === 'SUCCESS') {
                    this.guest.photo = res.data.url;
                    this.$message.success('上传成功！');
                } else {
                    this.$message.error('上传失败！');
                }
            },
            handlerPhotoError() {
                this.$message.error("上传失败");
            },
            getDepartmentCascader() {
                getDepartmentCascader().then(response => {
                    this.departmentCascaderLength = response.data.length;
                    this.departmentCascaderBack = deepClone(response.data);
                    this.departmentCascader = response.data;
                })
            },
            beforeFilterDepartment: function(value) {
                this.inputDepartmentName = value;
                return false;
            },
            getCascaderItemValue() {
                this.increment = this.increment + 1;
                if (this.increment > 99) this.increment = 1;
                return this.increment + '';
            },
            blurDepartment() {
                if (!this.inputDepartmentName) return;
                let value = this.getCascaderItemValue();
                let item = {
                    value: value,
                    label: this.inputDepartmentName,
                    children: undefined,
                    disabled: false
                };
                this.$set(this.departmentCascader, this.departmentCascaderLength, item);
                this.departmentValue = [value];
                this.guest.departmentName = this.inputDepartmentName;
                this.inputDepartmentName = undefined;
                console.log(this.guest.departmentName);
            },
            focusDepartment() {
                this.$refs.mycascader.$refs.input.$refs.input.select();
            }
        }
    }
</script>


<style>
    .el-dialog__body {
        padding-top: 0;
    }
    p {
        padding: 0;
        margin: 0;
    }
    video {
        width: 100%;
        height: 100%;
        object-fit:fill;
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




    /*图片展示*/
    .live-content-image {
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        height: 300px;
        scroll-y: scroll;
        overflow-x: hidden;
        overflow-y: auto;
        padding: 10px;
        margin-bottom: 10px;
    }
    /*消息展示*/
    .live-content-message {
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        height: 280px;
        scroll-y: scroll;
        overflow-x: hidden;
        overflow-y: auto;
        padding: 10px;
        margin-bottom: 10px;
    }
    .live-row {
        margin-bottom: 10px;
    }
    .live-type {
        color: #cc3333;
        line-height: 22px;
        font-size: 14px;
    }
    .live-button {
        margin-left: 10px;
        color: #959698;
    }
    .live-button:hover {
        color: blue;
        cursor: pointer;
    }
    .live-message {
        text-indent: 2em;
        line-height: 22px;
        font-size: 14px;
    }
    .live-image {
        width: 100%;
        height: 260px;
    }
    .live-image-name {
        margin-right: 10px;
        font-weight: bold;
    }

    .image-uploader {
        height: 152px;
    }
    .image-uploader .el-upload {
        border: 1px solid #dcdfe6;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 150px;

    }
    .image-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .image-uploader-icon {
        font-size: 50px;
        color: #8c939d;
        position: relative;
        top: 50px;
    }
    .image-add {
        width: 100%;
        height: 150px;
    }



    .photo-uploader {
        width: 200px;
        height: 250px;
    }

    .photo-uploader .el-upload {
        border: 1px solid #dcdfe6;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .photo-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .photo-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 200px;
        height: 250px;
        line-height: 250px;
        text-align: center;
    }

    .photo-add {
        width: 200px;
        height: 250px;
        display: block;
    }

</style>
