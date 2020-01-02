<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <el-row :span="24">
                <el-col :span="4">
                    <div class="classificationTree">
                        <el-tree
                            ref="catalogTree"
                            :data="catalogList"
                            :default-expanded-keys = "defaultExpandedKeys"
                            :props="defaultTreeProps"
                            node-key="id"
                            highlight-current
                            :default-expand-all="false"
                            :expand-on-click-node="false"
                            lazy
                            :load="getRemoteChildren"
                            @node-click="handleNoteClick">
                        </el-tree>
                    </div>
                </el-col>
                <el-col :span="20">
                    <div class="deyatech-menu">
                        <div class="deyatech-menu_left">
                            <el-dropdown v-if="btnEnable.create && isAddTemplate" style="margin-right: 10px" placement="bottom-start" @command="btnCreate">
                                <el-button type="primary" :size="btnSize">
                                    {{$t('table.create')}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <div v-if="modelList.length > 0">
                                        <el-dropdown-item v-for="m in modelList" :command="m.id">{{m.name}}</el-dropdown-item>
                                    </div>
                                    <div v-else>
                                        <el-dropdown-item>
                                            该栏目未配置内容模型
                                        </el-dropdown-item>
                                    </div>
                                </el-dropdown-menu>
                            </el-dropdown>

                            <el-button v-if="btnEnable.update" type="primary" :size="btnSize" @click="btnUpdate" :disabled="selectedRows.length != 1">{{$t('table.update')}}</el-button>
                            <el-button v-if="btnEnable.delete && listQuery.status == ContentStatusEnum.RECYCLE" type="danger" :size="btnSize" @click="btnDelete" :disabled="selectedRows.length < 1">彻底删除</el-button>
                            <el-button v-if="btnEnable.delete && listQuery.status == ContentStatusEnum.PUBLISH" type="danger" :size="btnSize" @click="btnCancel" :disabled="selectedRows.length < 1">撤销</el-button>
                            <el-button v-if="btnEnable.delete && listQuery.status != ContentStatusEnum.RECYCLE" type="warning" :size="btnSize" @click="btnRecycle" :disabled="selectedRows.length < 1">删除</el-button>

                            <el-dropdown style="margin-left: 10px" placement="bottom" @command="handleCommand">
                                <el-button type="warning" :size="btnSize">
                                    生成内容页或索引<i class="el-icon-arrow-down el-icon--right"></i>
                                </el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="handleCheckedStaticContent">生成勾选的内容页</el-dropdown-item>
                                    <el-dropdown-item command="handleCatalogStaticContent">生成当前栏目内容页</el-dropdown-item>
                                    <el-dropdown-item command="handleSiteStaticContent">生成站点所有内容页</el-dropdown-item>
                                    <el-dropdown-item command="handleCheckedReindex" divided>生成勾选的索引</el-dropdown-item>
                                    <el-dropdown-item command="handleCatalogReindex">生成当前栏目索引</el-dropdown-item>
                                    <!--<el-dropdown-item command="handleSiteReindex">生成站点所有索引</el-dropdown-item>-->
                                </el-dropdown-menu>
                            </el-dropdown>

                            <el-input :size="searchSize" placeholder="标题、作者、权重、时间" v-model.trim="listQuery.title" style="width: 300px;margin-left: 10px;margin-right:10px;"></el-input>
                            <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="searchReloadList">{{$t('table.search')}}</el-button>
                            <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}</el-button>
                        </div>

                    </div>




                    <div class="my-tabls">
                        <!--需要string类型的数据-->
                        <el-tabs v-model.trim="listQuery.status" type="card" @tab-click="handleTabClick">
                            <el-tab-pane v-for="item in enums['ContentStatusEnum']" :label="item.value" :key="item.code" :name="item.code.toString()"></el-tab-pane>
                        </el-tabs>
                        <div style="position:absolute;top: 0; right: 0;">
                            显示设置<el-button type="primary" :size="btnSize" icon="el-icon-setting" circle @click="displaySetting"></el-button>
                            <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                        </div>
                    </div>
                    <!-- 内容表格 -->
                    <el-table :data="templateList" v-loading.body="listLoading" stripe border highlight-current-row
                              @selection-change="handleSelectionChange" style="border-top:none;">
                        <el-table-column type="selection" width="50" align="center"/>

                        <el-table-column :align="getAlign(item.prop)"
                                         :show-overflow-tooltip="item.prop === 'thumbnail' ? false : true"
                                         v-for="item in headData"
                                         :label="item.label"
                                         :prop="item.prop"
                                         :min-width="item.prop === 'title' ? 440: ''"
                                         :width="getHeadWidth(item.prop)">
                        <template slot-scope="scope">
                            <span v-if="item.prop == 'title'" class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.title}}</span>
                            <el-input-number v-else-if="item.prop == 'sortNo'" v-model.trim="scope.row.sortNo" controls-position="right" :precision="0" :step="1" :min="1" :max="9999" size="small" style="width:100px;" @change="sortNoChange(scope.row)"></el-input-number>
                            <el-checkbox v-else-if="item.prop == 'flagTop'" v-model="scope.row.flagTop" @change="flagTopChange(scope.row)"/>
                            <span v-else-if="item.prop == 'flagExternal'">{{scope.row.flagExternal | enums('YesNoEnum')}}</span>
                            <span v-else-if="item.prop == 'status'">{{scope.row.status | enums('ContentStatusEnum')}}</span>
                            <span v-else-if="item.prop == 'resourcePublicationDate'">{{scope.row.resourcePublicationDate ? scope.row.resourcePublicationDate.substr(0, 16) : ''}}</span>
                            <span v-else-if="item.prop == 'createTime'">{{scope.row.createTime ? scope.row.createTime.substr(0, 16) : ''}}</span>
                            <span v-else-if="item.prop == 'updateTime'">{{scope.row.updateTime ? scope.row.updateTime.substr(0, 16) : ''}}</span>
                            <div v-else-if="item.prop == 'thumbnail'">
                                <el-image v-if="scope.row.thumbnail"
                                          style="width: 80px; height: 60px"
                                          :src="getOneFromArray(loadShowImageUrl(scope.row.thumbnail))"
                                          :preview-src-list="[getOneFromArray(loadShowImageUrl(scope.row.thumbnail))]">
                                </el-image>
                            </div>
                            <span v-else-if="item.prop == 'source'">{{scope.row.sourceName ? scope.row.sourceName : ''}}</span>
                            <span v-else-if="item.prop == 'resourceCategory'">{{scope.row.resourceCategoryName ? scope.row.resourceCategoryName : ''}}</span>
                            <span v-else>{{scope.row[item.prop]}}</span>
                        </template>
                    </el-table-column>


                        <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="200" fixed="right">
                            <template slot-scope="scope">
                                <el-button v-if="btnEnable.preview" :title="'预览'" type="primary" icon="el-icon-search" :size="btnSize" circle @click.stop.safe="btnPreview(scope.row)"></el-button>
                                <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle @click.stop.safe="btnUpdate(scope.row)"></el-button>
                                <el-button v-if="btnEnable.delete && listQuery.status == ContentStatusEnum.RECYCLE" title="彻底删除" type="danger" icon="el-icon-delete" :size="btnSize" circle @click.stop.safe="btnDelete(scope.row)"></el-button>
                                <el-button v-if="btnEnable.delete && listQuery.status == ContentStatusEnum.PUBLISH" title="撤销" type="danger" icon="iconskip" :size="btnSize" circle @click.stop.safe="btnCancel(scope.row)"></el-button>
                                <el-button v-if="btnEnable.delete && listQuery.status != ContentStatusEnum.RECYCLE" title="删除" type="danger" icon="el-icon-delete" :size="btnSize" circle @click.stop.safe="btnRecycle(scope.row)"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination class="deyatech-pagination pull-right" background
                                   :current-page.sync="listQuery.page" :page-sizes="this.$store.state.common.pageSize"
                                   :page-size="listQuery.size" :layout="this.$store.state.common.pageLayout" :total="total"
                                   @size-change="handleSizeChange" @current-change="handleCurrentChange">
                    </el-pagination>
                </el-col>
            </el-row>

            <!-- 表单 -->
            <el-dialog width="70%" :title="titleMap[dialogTitle]" :visible.sync="dialogVisible" :close-on-click-modal="closeOnClickModal" @close="closeTemplateDialog">

                <el-steps :active="stepsActive" finish-status="success" simple style="margin-top: -25px; margin-bottom: 20px" v-if="formList.length > 1">
                    <el-step v-for="step in formList" :key="step.pageNumber" :title="step.pageName"></el-step>
                </el-steps>

                <el-form v-show="formIndex == stepsActive" v-for="(form, formIndex) in formList" :ref="'dynamicForm' + formIndex" :model="form.pageModel"  class="deyatech-form" label-position="right" label-width="120px">

                    <template v-for="(row, rowIndex) in form.rows">
                        <el-row :span="24">
                            <el-col :span="item.controlLength == 1 ? 12 : 24"
                                    v-for="(item, itemIndex) in row">
                                <el-form-item :label="item.name"
                                              :prop="item.briefName"
                                              :rules="(item.briefName === 'resource_content' && formList[flagExternalIndex].pageModel['flag_external'] == 0) ? templateRules.resource_content : loadRules(item)"
                                              :style="(item.briefName === 'resource_summary' || item.briefName === 'keyword_') ? 'margin-bottom: 0' : ''">

                                    <!-- 输入框 -->
                                    <el-input v-if="item.controlType === 'inputElement'"
                                              v-model.trim="form.pageModel[item.briefName]"
                                              :maxlength="item.dataLength"
                                              :placeholder="'请输入' + item.name"></el-input>

                                    <!--可输入可选择部门级联器-->
                                    <inputDepartment v-else-if="item.controlType === 'inputDepartmentCascader'"
                                                     v-model.trim="form.pageModel[item.briefName]"></inputDepartment>

                                    <!-- 文本域 -->
                                    <el-input v-else-if="item.controlType === 'textareaElement'"
                                              type="textarea"
                                              v-model.trim="form.pageModel[item.briefName]"
                                              :maxlength="item.dataLength" :rows="3"
                                              :placeholder="'请输入' + item.name"></el-input>

                                    <!-- 下拉框 -->
                                    <el-select v-else-if="item.controlType === 'selectElement'" filterable
                                               v-model.trim="form.pageModel[item.briefName]"
                                               :placeholder="'请选择' + item.name" style="width: 100%;">
                                        <el-option
                                            v-for="s in form.pageList[item.briefName]"
                                            :key="s.id"
                                            :label="s.codeText"
                                            :value="s.id">
                                        </el-option>
                                    </el-select>

                                    <!-- 单选框 -->
                                    <el-radio-group v-else-if="item.controlType === 'radioElement'"
                                                    v-model.trim="form.pageModel[item.briefName]">
                                        <el-radio
                                            v-for="rd in form.pageList[item.briefName]"
                                            :key="rd.id"
                                            :label="rd.id">{{rd.codeText}}</el-radio>
                                    </el-radio-group>

                                    <!-- 复选框 -->
                                    <el-checkbox-group v-else-if="item.controlType === 'checkboxElement'"
                                                       v-model.trim="form.pageModel['checkbox_' + item.briefName]">
                                        <el-checkbox
                                            v-for="ckb in form.pageList[item.briefName]"
                                            :key="ckb.id"
                                            :label="ckb.id">{{ckb.codeText}}</el-checkbox>
                                    </el-checkbox-group>

                                    <!-- 开关 -->
                                    <el-switch v-else-if="item.controlType === 'switchElement'"
                                               v-model.trim="form.pageModel[item.briefName]"
                                               :active-value="1"
                                               :inactive-value="0"></el-switch>

                                    <!-- 标签
                                    <el-tag v-else-if="item.controlType === 'tagElement'"
                                            v-for="tag in loadTag(form.pageModel[item.briefName])"
                                            :key="tag">{{tag}}</el-tag>
                                    -->

                                    <!-- 附件 multiple -->
                                    <el-upload v-else-if="item.controlType === 'fileElement'"
                                               accept="image/*,application/*,audio/*,video/*,text/*"
                                               :action="$store.state.common.materialUploadUrl"
                                               :data="{siteId: $store.state.common.siteId, attach: formIndex + ',' + item.briefName}"
                                               :file-list="form.pageModel['file_' + item.briefName]"
                                               :on-success="handleFileSuccess"
                                               :on-error="handleFileError"
                                               :before-upload="beforeFileUpload"
                                               :on-preview="handleFilePreview"
                                               :on-remove="handleFileRemove">
                                        <el-button size="small" type="primary">点击上传</el-button>
                                    </el-upload>

                                    <!-- 附件 带输入框 multiple -->
                                    <template v-else-if="item.controlType === 'fileInputElement'">
                                        <el-input v-model.trim="form.pageModel[item.briefName]"
                                                  :maxlength="item.dataLength"
                                                  :placeholder="'请输入' + item.name"></el-input>
                                        <el-upload
                                                   accept="image/*,application/*,audio/*,video/*,text/*"
                                                   :action="$store.state.common.materialUploadUrl"
                                                   :data="{siteId: $store.state.common.siteId, attach: formIndex + ',' + item.briefName}"
                                                   :show-file-list="false"
                                                   :on-success="handleFileInputSuccess"
                                                   :on-error="handleFileError"
                                                   :before-upload="beforeFileUpload"
                                                   :on-preview="handleFilePreview"
                                                   :on-remove="handleFileRemove">
                                            <el-button size="small" type="primary">点击上传</el-button>
                                        </el-upload>
                                    </template>

                                    <!-- 图片  -->
                                    <template v-else-if="item.controlType === 'imageElement'">
                                        <el-upload class="avatar-uploader"
                                                   :class="{hide: form.pageModel['image_' + item.briefName].length >= 3}"
                                                   :action="$store.state.common.materialUploadUrl"
                                                   :data="{siteId: template.siteId, attach: formIndex + ',' + item.briefName}"
                                                   :accept="$store.state.common.imageAccepts"
                                                   list-type="picture-card"
                                                   :file-list="form.pageModel['image_' + item.briefName]"
                                                   :on-success="handleImageSuccess"
                                                   :on-error="handleImageError"
                                                   :before-upload="beforeImageUpload"
                                                   :on-preview="handleImageCardPreview"
                                                   :on-remove="handleImageRemove">
                                            <i class="el-icon-plus avatar-uploader-icon"></i>
                                        </el-upload>
                                        <el-dialog width="70%" :visible.sync="dialogVisiblePicture" :append-to-body="true">
                                            <img width="100%" :src="dialogImageUrl" alt="">
                                        </el-dialog>
                                    </template>

                                    <!-- 组图  -->
                                    <template v-else-if="item.controlType === 'imageArrayElement'">
                                        <div class="img-li-box" v-for="(item1,key) in form.pageModel['imagearray_' + item.briefName]" :key="key" style="width:100%">
                                            <el-row :span="24">
                                                <el-col :span="6">
                                                    <img class="img-li-b--url" :src="item1.url" style="width:100%;height:130px;">
                                                </el-col>
                                                <el-col :span="1">
                                                </el-col>
                                                <el-col :span="17">
                                                    <div class="img-li-b--bottom" style="width:100%;">
                                                        <el-input
                                                            type="textarea"
                                                            :rows="4"
                                                            placeholder="图片描述"
                                                            v-model.trim="item1.name">
                                                        </el-input>
                                                    </div>
                                                    <!-- 删除icon -->
                                                    <div class="img-li-b--delete">
                                                        <el-button @click="handleImageArrayRemove(item1,key)" class="el-icon-delete" size="mini">移除</el-button>
                                                        <el-button @click="selectImg(item1.url)" class="el-icon-picture-outline" size="mini">设为标题图</el-button>
                                                        <el-button v-if="key > 0" @click="handleImageArraySort(key,'up')" class="el-icon-top" size="mini">上移</el-button>
                                                        <el-button v-if="key < form.pageModel['imagearray_' + item.briefName].length-1" @click="handleImageArraySort(key,'down')" class="el-icon-bottom" size="mini">下移</el-button>
                                                    </div>
                                                </el-col>
                                            </el-row>
                                        </div>
                                        <el-upload :action="$store.state.common.materialUploadUrl"
                                                   :data="{siteId: template.siteId, attach: formIndex + ',' + item.briefName}"
                                                   :accept="$store.state.common.imageAccepts"
                                                   :show-file-list="false"
                                                   :on-success="handleImageArraySuccess"
                                                   :on-error="handleImageError"
                                                   :before-upload="beforeImageUpload"
                                                   :on-preview="handleImageCardPreview"
                                                   :on-remove="handleImageArrayRemove"
                                                   :multiple = "true">
                                            <el-button size="small" type="primary">点击上传</el-button>
                                        </el-upload>
                                    </template>

                                    <!-- 日期 -->
                                    <el-date-picker v-else-if="item.controlType === 'dateElement'"
                                                    v-model.trim="form.pageModel[item.briefName]"
                                                    value-format="yyyy-MM-dd" type="date"
                                                    placeholder="请选择日期"></el-date-picker>

                                    <!-- 时间 -->
                                    <el-time-picker v-else-if="item.controlType === 'timeElement'"
                                                    v-model.trim="form.pageModel[item.briefName]"
                                                    value-format="HH:mm:ss"
                                                    placeholder="请选择时间"></el-time-picker>

                                    <!-- 时间戳 -->
                                    <el-date-picker v-else-if="item.controlType === 'datetimeElement'"
                                                    v-model.trim="form.pageModel[item.briefName]"
                                                    value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
                                                    placeholder="请选择时间"></el-date-picker>

                                    <!-- 富文本 -->
                                    <editor v-else-if="item.controlType === 'richTextElement'"
                                            :config="editorConfig"
                                            :id="'editor' + item.briefName"
                                            :ref="'editor' + item.briefName"
                                            :attach="formIndex + ',' + item.briefName"
                                            :default-msg="form.pageModel[item.briefName]"
                                            @editorPlainTxtChange="editorPlainTxtChange"
                                            @editorContentChange="contentChange"></editor>

                                    <span v-else>{{item.controlType}}</span>

                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row :span="24" v-if="isShowRow(row, 'flag_external') && form.pageModel['flag_external']">
                            <el-col :span="24">
                                <el-form-item label="URL" prop="url_" :rules="form.pageModel['flag_external'] ? templateRules.url_ : []">
                                    <el-input v-model.trim="form.pageModel['url_']"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row :span="24" v-if="isShowRow(row, 'resource_summary')" style="margin: 0; padding: 0;">
                            <el-col :span="24">
                                <el-form-item style="margin-bottom: 0"><el-button @click="extractSummary" :size="btnSize">提取摘要</el-button></el-form-item>
                            </el-col>
                        </el-row>

                        <el-row :span="24" v-if="isShowRow(row, 'keyword_')" style="margin: 0; padding: 0;">
                            <el-col :span="24">
                                <el-form-item style="margin-bottom: 0"><el-button @click="extractKeyword" :size="btnSize">提取关键字</el-button></el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :span="24" v-if="isShowRow(row, 'thumbnail_')" style="margin: 0; padding: 0;">
                            <el-col :span="24">
                                <el-form-item style="margin-bottom: 0"><el-image style="width: 100px; height: 100px; cursor: pointer;" v-for="url in contentPicArray" :key="url" :src="url" @click="selectImg(url)"></el-image></el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :span="24" v-if="isShowRow(row, 'thumbnail_')" style="margin: 0; padding: 0;">
                            <el-col :span="24">
                                <el-form-item style="margin-bottom: 0"><el-button @click="getContentThumb" :size="btnSize">提取正文图片</el-button></el-form-item>
                            </el-col>
                        </el-row>
                    </template>
                </el-form>
                <span v-if="stepsActive == form.pageNumber - 1" v-for="form in formList" slot="footer" class="dialog-footer"><!--ycx-->
                    <el-button v-if="form.pageNumber > 1" type="primary" :size="btnSize"
                               @click="previousStep(form.pageNumber - 1)">上一步</el-button>

                    <template v-if="form.pageModel['flag_external']">
                        <el-button type="primary" :size="btnSize" :loading="submitLoading"
                                   @click="doSave(false)" >{{$t('table.confirm')}}</el-button>

                        <el-button :size="btnSize" :loading="submitLoading"
                                   @click="doSave(true)">草稿</el-button>
                    </template>

                    <template v-else>
                        <el-button v-if="form.pageNumber < maxPage" type="primary" :size="btnSize"
                                   @click="nextStep(form.pageNumber - 1)">下一步</el-button>

                        <el-button v-if="form.pageNumber == maxPage" type="primary" :size="btnSize" :loading="submitLoading"
                                   @click="doSave(false)" >{{$t('table.confirm')}}</el-button>

                        <el-button v-if="form.pageNumber == maxPage" :size="btnSize" :loading="submitLoading"
                                   @click="doSave(true)">草稿</el-button>
                    </template>


                    <el-button :size="btnSize" @click="closeTemplateDialog">{{$t('table.cancel')}}</el-button>
                </span>

            </el-dialog>



            <el-dialog title="显示设置" width="30%" :visible.sync="displaySettingVisible" :close-on-click-modal="closeOnClickModal" @close="closeDisplaySettingDialog">
                <el-table :data="headList" border height="500">
                    <el-table-column prop="label" label="名称"></el-table-column>
                    <el-table-column label="显示" align="center" width="50">
                        <template slot-scope="scope">
                            <el-checkbox v-model="scope.row.show" :disabled="scope.row.disabled"/>
                        </template>
                    </el-table-column>
                    <el-table-column label="排序" align="center" width="100">
                        <template slot-scope="scope">
                            <el-button icon="el-icon-arrow-up" :size="btnSize" circle title="上移" @click="sortFunctionUp(headList, scope.$index)"></el-button>
                            <el-button icon="el-icon-arrow-down" :size="btnSize" circle title="下移" @click="sortFunctionDown(headList, scope.$index)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="btnFunctionSave" :size="btnSize">保存</el-button>
                    <el-button type="warning" @click="btnFunctionDelete" :size="btnSize">重置</el-button>
                    <el-button :size="btnSize" @click="closeDisplaySettingDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>

            <el-dialog title="发布静态页进度" :visible.sync="proGressStaticDialogVisible" :close-on-click-modal="closeOnClickModal" >
                <el-progress :text-inside="true" :stroke-width="24" :percentage="proGressStaticPercentage" status="success"></el-progress>
                <el-row :gutter="20" :span="24" style="margin-top:20px;">
                    <el-col :span="3">
                        总数：{{proGressStaticTotle}}
                    </el-col>
                    <el-col :span="3">
                        当前：{{proGressStaticCurNo}}
                    </el-col>
                    <el-col :span="18">
                        标题： {{proGressStaticCurTitle}}
                    </el-col>
                </el-row>
            </el-dialog>

            <el-dialog title="生成索引进度" :visible.sync="proGressIndexDialogVisible" :close-on-click-modal="closeOnClickModal" >
                <el-progress :text-inside="true" :stroke-width="24" :percentage="proGressIndexPercentage" status="success"></el-progress>
                <el-row :gutter="20" :span="24" style="margin-top:20px;">
                    <el-col :span="3">
                        总数：{{proGressIndexTotle}}
                    </el-col>
                    <el-col :span="3">
                        当前：{{proGressIndexCurNo}}
                    </el-col>
                    <el-col :span="18">
                        标题： {{proGressIndexCurTitle}}
                    </el-col>
                </el-row>
            </el-dialog>
        </div>
    </basic-container>
</template>


<script>
    import editor from '@/components/editor/index.vue'
    import inputDepartment from '@/components/inputDepartmentCascader/index.vue'
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {getStore} from '@/util/store'
    import {
        getTemplateList,
        createOrUpdateTemplate,
        delTemplates,
        recycleByIds, // 删除
        cancelByIds,  // 撤销
        updateSortNoById,
        updateFlagTopById,
        checkTitleExist,
        genStaticPage,
        reindex,
        keyword,
        summary,
        getDynamicForm,
        getBaseAndMetaField
    } from '@/api/station/template';
    import {
        getSiteUploadPath,
        getMaterial,
        setSortNoMaterial
    } from "@/api/station/material";
    import {
        getUserCatalogTree
    } from '@/api/station/catalog';
    import {
        getAllModelBySiteId,
        getModelByCatalogId
    } from '@/api/station/model';
    import {validateURL,validateEmail, isEnglish} from '@/util/validate';
    import {findMetadataCollectionAllData, getAllMetadataCollection} from '@/api/metadata/collection';
    import {getDictionaryListAlias} from '@/api/admin/dictionary';
    import {getTableHeadContentDataAlias, getCustomizationFunctionContent, saveOrUpdate, removeContentData} from '@/api/assembly/customizationFunction'
    import {getUploadFileTypeAndSize} from '@/api/resource/setting';
    import {getDomainNameBySiteId} from '@/api/resource/domain';

    export default {
        name: 'template',
        components: {
            editor,
            inputDepartment
        },
        data() {
            const validateTitle = (rule, value, callback) => {
                const query = {
                    title: value,
                    siteId: this.template.siteId,
                    cmsCatalogId: this.template.cmsCatalogId,
                    id: this.template.id,
                }
                checkTitleExist(query).then(response => {
                    if (response.status == 200) {
                        if (response.data) {
                            callback(new Error('当前栏目中已存在该标题内容'))
                        } else {
                            callback()
                        }
                    } else {
                        callback(new Error('检查内容重复查询失败'))
                    }
                })
            }
            const validateUrl = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入URL'))
                } else {
                    if (!validateURL(value)) {
                        callback(new Error('URL格式错误'))
                    } else {
                        callback()
                    }
                }
            }
            const checkSortNo = (rule, value, callback) => {
                //除了数字
                if (/[^\d]/g.test(value)) {
                    callback(new Error('请输入正整数'));
                } else {
                    callback();
                }
            };
            const checkDefault = (rule, value, callback) => {
                callback();
            };
            return {
                headData: [],
                ContentStatusEnum:{
                    PUBLISH: undefined, // 已发布
                    VERIFY: undefined,  // 待审
                    CANCEL: undefined,  // 撤销
                    REJECT: undefined,  // 退稿
                    DRAFT: undefined,   // 草稿
                    RECYCLE: undefined  // 删除
                },
                treeHeight: 0,
                templateList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    title: undefined,
                    siteId: this.$store.state.common.siteId,
                    cmsCatalogId: undefined,
                    status: undefined // 已发布
                },
                template: {
                    id: undefined,
                    siteId: undefined,
                    templatePath: undefined,
                    cmsCatalogId: undefined,
                    contentModelId: undefined,
                    contentId: undefined,
                    status: undefined,
                    contentModelTemplateId: undefined,
                    url: undefined,
                    author: undefined,
                    editor: undefined,
                    source: undefined,
                    thumbnail: undefined,
                    title: undefined,
                    flagSearch: undefined,
                    sortNo: undefined,
                    flagTop: undefined,
                    views: undefined,
                    flagExternal: undefined,
                    resourceSummary: undefined,
                    resourceContent: undefined,
                    resourceCategory: undefined,
                    keyword: undefined,
                    workflowKey: undefined,
                    workflowId: undefined,
                    contentModelName: undefined,
                    contentMapStr: undefined,
                    content: {},
                    metaDataCollectionId: undefined,
                    cmsCatalogPathName: undefined
                },
                contentItemArray: {},
                editorDefaultMsg: {},
                contentItemOptions: {},
                uploadFileList: {},
                templateRules: {
                    url_: [
                        {required: true, message: this.$t("table.pleaseInput") + 'URL'},
                        {min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur'},
                        {validator: validateUrl, trigger: ['change', 'blur']}
                    ],
                    resource_content: [
                        {required: true, message: this.$t("table.pleaseInput") + '正文'}
                    ]
                    /*siteId: [
                        {required: true, message: this.$t("table.pleaseInput") + '站点id'}
                    ],
                    templatePath: [
                        {required: true, message: this.$t("table.pleaseInput") + '模板路径'}
                    ],
                    cmsCatalogId: [
                        {required: true, message: this.$t("table.pleaseInput") + '栏目ID'}
                    ],
                    contentModelId: [
                        {required: true, message: this.$t("table.pleaseSelect") + '内容模型'}
                    ],
                    contentId: [
                        {required: true, message: this.$t("table.pleaseInput") + '内容唯一ID'}
                    ],
                    status: [
                        {required: true, message: this.$t("table.pleaseInput") + '状态'}
                    ],
                    contentModelTemplateId: [
                        {required: true, message: this.$t("table.pleaseInput") + '内容模型模板ID'}
                    ],

                    author: [
                        {required: true, message: this.$t("table.pleaseInput") + '作者姓名'},
                        {min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur'}
                    ],
                    editor: [
                        {required: true, message: this.$t("table.pleaseInput") + '编辑姓名'},
                        {min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur'}
                    ],
                    source: [
                        {required: true, message: this.$t("table.pleaseInput") + '来源'},
                        {max: 255, message: '长度最多 255 个字符', trigger: 'blur'}
                    ],
                    thumbnail: [
                        // {required: true, message: this.$t("table.pleaseInput") + '缩略图'}
                    ],
                    title: [
                        {required: true, message: this.$t("table.pleaseInput") + '标题'},
                        {min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur'},
                        {validator: validateTitle, trigger: 'blur'}
                    ],
                    flagSearch: [
                        // {required: true, message: this.$t("table.pleaseInput") + '是否允许搜索到'}
                    ],
                    sortNo: [
                        {required: true, message: this.$t("table.pleaseInput") + '权重'},
                        {validator: checkSortNo, trigger: ['blur','change']}
                    ],
                    flagTop: [
                        // {required: true, message: this.$t("table.pleaseInput") + '是否置顶'}
                    ],
                    views: [
                        // {required: true, message: this.$t("table.pleaseInput") + '浏览次数'}
                    ],
                    flagExternal: [
                        // {required: true, message: this.$t("table.pleaseInput") + '是否是外链'}
                    ],
                    resourceSummary: [
                        {max: 500, message: '长度最多 500 个字符', trigger: 'blur'}
                    ],
                    */
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                catalogList: [],
                defaultExpandedKeys: [],
                defaultTreeProps: {
                    children: 'children',
                    label: 'name',
                    isLeaf: 'leaf'
                },
                modelList: [],
                allModelList: [],
                modelTemplateList: [],
                workflowKey: undefined,
                workflowId: undefined,
                metadataCollection: {
                    metadataList: []
                },
                editorConfig: {
                    serverUrl: this.$store.state.common.materialUploadUrl+"?siteId="+this.$store.state.common.siteId,
                    imageUrlPrefix: this.$store.state.common.materialShowImageByUrl+"?siteId="+this.$store.state.common.siteId+"&url=",
                    fileUrlPrefix: this.$store.state.common.materialDownloadUrl+"?siteId="+this.$store.state.common.siteId+"&url=",
                    initialFrameWidth: '100%',
                    initialFrameHeight: 350,
                    zIndex: 3999,
                    toolbars: [
                        [
                            'source', // 源代码
                            'forecolor', // 字体颜色
                            'backcolor', // 背景色
                            '|',
                            'bold', // 加粗
                            'italic', // 斜体
                            'underline', // 下划线
                            'strikethrough', // 删除线
                            '|',
                            'insertorderedlist', // 有序列表
                            'insertunorderedlist', // 无序列表
                            '|',
                            'horizontal', // 分隔线
                            'superscript', // 上标
                            'subscript', // 下标
                            'fontborder', // 字符边框
                            'spechars', // 特殊字符
                            'blockquote', // 引用
                            '|',
                            'justifyleft', // 居左对齐
                            'justifycenter', // 居中对齐
                            'justifyright', // 居右对齐
                            '|',
                            'date', // 日期
                            'time', // 时间
                            'searchreplace', // 查询替换
                            'autotypeset', // 自动排版
                            '|',
                            //'fullscreen', // 全屏
                            //'undo', // 撤销
                            //'redo', // 重做
                            //'justifyjustify', // 两端对齐
                            //'selectall', // 全选
                            //'cleardoc', // 清空文档
                            //'map', // Baidu地图
                            //'insertframe', // 插入Iframe
                            //'background', // 背景
                            //'insertcode', // 代码语言

                            //'touppercase', // 字母大写
                            //'tolowercase', // 字母小写
                        ],
                        [
                            'link', // 超链接
                            'unlink', // 取消链接
                            'anchor', // 锚点
                            '|',
                            'pasteplain', // 纯文本粘贴模式
                            'removeformat', // 清除格式
                            'formatmatch', // 格式刷
                            '|',
                            'fontfamily', // 字体
                            'fontsize', // 字号
                            'paragraph', // 段落格式
                            'indent', // 首行缩进
                            'rowspacingtop', // 段前距
                            'rowspacingbottom', // 段后距
                            'lineheight', // 行间距
                            '|'
                            //'customstyle', // 自定义标题
                            //'directionalityltr', // 从左向右输入
                            //'directionalityrtl', // 从右向左输入
                            //'emotion', // 表情
                        ],
                        [
                            'insertimage', // 多图上传
                            'imagenone', // 图片默认
                            'imageleft', // 图片左浮动
                            'imagecenter', // 图片居中
                            'imageright', // 右浮动
                            'attachment', // 附件
                            'insertvideo', // 视频
                            '|',
                            'insertparagraphbeforetable', // 表格前插入行
                            'inserttable', // 插入表格
                            'deletetable', // 删除表格
                            'insertrow', // 前插入行
                            'insertcol', // 前插入列
                            'deleterow', // 删除行
                            'deletecol', // 删除列
                            'mergecells', // 合并多个单元格
                            'mergeright', // 右合并单元格
                            'mergedown', // 下合并单元格
                            'splittocells', // 完全拆分单元格
                            'splittorows', // 拆分成行
                            'splittocols', // 拆分成列
                            '|'
                            //'print', // 打印
                            //'preview', // 预览
                            //'drafts', // 从草稿箱加载
                            //'help' // 帮助
                        ]
                    ]
                },
                dynamicTags: [],
                inputVisible: false,
                inputValue: '',
                thumbnailList: [],
                dialogImageUrl: undefined,
                dialogVisiblePicture: undefined,
                stepsActive: 0,
                resourceCategoryList: [],
                isAddTemplate: false,

                // 动态表单
                formList: [],
                formFileTemp:[],
                maxPage: 0,
                flagExternalIndex: 0,
                baseFields: [],
                metaFields: [],

                // 显示设置
                displaySettingVisible: false,
                customizationFunction: undefined,
                headList: [],
                metadataCollectionList: [],
                uploadFileTypeList: [],
                uploadFileSize: 0,

                // 提取内容图片
                contentPicArray: [],
                picArray:[],

                //进度条-静态页
                proGressStaticDialogVisible: false,
                proGressStaticPercentage: 0.00,
                proGressStaticTotle: 0,
                proGressStaticCurNo: 0,
                proGressStaticCurTitle: '',

                //进度条-索引
                proGressIndexDialogVisible: false,
                proGressIndexPercentage: 0.00,
                proGressIndexTotle: 0,
                proGressIndexCurNo: 0,
                proGressIndexCurTitle: '',

                picArray:[],
                domainName: ''
            }
        },
        watch: {
            // 弹窗元数据相关部分 TODO
            contentItemArray: {
                handler(val) {
                    for (let item in val) {
                        this.template.content[item] = val[item].join()
                    }
                },
                deep: true
            },
        },
        filters: {
            // 弹窗元数据相关部分 TODO
            formItemRules(item) {
                let rules = []
                if (item.metadata.required) {
                    rules.push({required: true, message: '不能为空', trigger: 'blur'})
                }
                if (item.metadata.dataLength) {
                    rules.push({
                        max: parseInt(item.metadata.dataLength),
                        message: '不能超过' + item.metadata.dataLength + '个字符',
                        trigger: 'blur'
                    })
                }
                return rules
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
                    preview: this.permission.template_preview,
                    create: this.permission.template_create,
                    update: this.permission.template_update,
                    delete: this.permission.template_delete
                };
            }
        },
        updated() {

        },
        created(){
            // 动态表头
            this.loadHeadData();
            // 数据状态
            const array = getStore({name: 'enums'})['ContentStatusEnum'];
            for (let cs of array) {
                if (cs.var === 'PUBLISH') { // 已发布
                    this.ContentStatusEnum.PUBLISH = cs.code.toString();
                    this.listQuery.status = cs.code.toString();
                } else if (cs.var === 'VERIFY') { // 待审
                    this.ContentStatusEnum.VERIFY = cs.code.toString();
                } else if (cs.var === 'CANCEL') { // 撤销
                    this.ContentStatusEnum.CANCEL = cs.code.toString();
                } else if (cs.var === 'REJECT') { // 退稿
                    this.ContentStatusEnum.REJECT = cs.code.toString();
                } else if (cs.var === 'DRAFT') { // 草稿
                    this.ContentStatusEnum.DRAFT = cs.code.toString();
                } else if (cs.var === 'RECYCLE') { // 删除
                    this.ContentStatusEnum.RECYCLE = cs.code.toString();
                }
            }

            this.$store.state.common.selectSiteDisplay = true;
            if(this.$store.state.common.siteId != undefined){
                this.listQuery.siteId = this.$store.state.common.siteId;
                // 资源分类
                this.getResourceCategoryList();
                // 获取站点关联的内容模型
                this.getAllModelBySiteId();
                // 获取栏目
                this.getCatalogTree();
                // 获取站点上传路径
                this.getSiteUploadPath();
                // 获取元数据集
                this.getAllMetaDataCollection();
                // 上传文件类型大小
                this.getUploadFileTypeAndSizeObject(this.$store.state.common.siteId);
                // 获取站点域名
                this.getDomainName(this.$store.state.common.siteId)

            }
        },
        methods: {
            // 资源分类
            getResourceCategoryList() {
                getDictionaryListAlias({indexId: 'resource_category'}).then(response => {
                    if (response.status == 200) {
                        this.resourceCategoryList = response.data;
                    } else {
                        this.$message.error('获取字典项失败')
                    }
                })
            },
            getDomainName(siteId) {
                getDomainNameBySiteId({siteId: siteId}).then(response => {
                    this.domainName = response.data;
                    if (!this.domainName) {
                        this.$message.error("站点没有配置域名");
                    }
                }).catch(error=> {
                    this.$message.error(error);
                });
            },
            // 获取元数据集
            getAllMetaDataCollection() {
                getAllMetadataCollection().then(response => {
                    if (response.status == 200 && response.data.length > 0) {
                        this.metadataCollectionList = response.data;
                    }
                })
            },
            getOneFromArray(value) {
                if (value) {
                    let arr = value.split(',');
                    return arr[0];
                }
            },
            // 加载图片地址
            loadShowImageUrl(url) {
                if(!url) return undefined;
                return this.$store.state.common.materialShowImageByUrl + "?siteId=" + this.$store.state.common.siteId + "&url=" + url;
            },
            loadDownloadUrl(url) {
                if(!url) return undefined;
                return this.$store.state.common.materialDownloadUrl + "?siteId=" + this.$store.state.common.siteId + "&url=" + url;
            },
            // 加载标签数组
            loadTag(value) {
                if (value)
                    return value.split(',');
                else
                    return [];
            },
            // 加载规则
            loadRules(item) {
                let rules = [];
                // 必须检查
                if (item.required && item.required == true) {
                    let rule = {};
                    rule.required = true;
                    let please = "";
                    if (item.controlType === "inputElement" || item.controlType === "textareaElement" || item.controlType === "richTextElement") {
                        please = "请输入";
                    } else {
                        please = "请选择";
                    }
                    rule.message = please + item.name;
                    rules.push(rule);
                }
                // 类型校验
                if (item.checkModel) {
                    let rule = {};
                    rule.trigger = ['blur','change'];
                    if (item.checkModel === 'chinese') {
                        rule.validator = (rule, value, callback) => {
                            if (!value) {
                                callback()
                            }
                            if (/^[\u4e00-\u9fa5]+$/.test(value)) {
                                // let msg = this.checkDataLength(rule.field, value);
                                // if (msg) {
                                //     callback(new Error(msg));
                                // } else {
                                //     callback();
                                // }
                                callback();
                            } else {
                                callback(new Error('请输入中文'));
                            }
                        }
                    } else if (item.checkModel === 'mail') {
                        rule.validator = (rule, value, callback) => {
                            if (!value) {
                                callback()
                            }
                            if (validateEmail(value)) {
                                // let msg = this.checkDataLength(rule.field, value);
                                // if (msg) {
                                //     callback(new Error(msg));
                                // } else {
                                //     callback();
                                // }
                                callback();
                            } else {
                                callback(new Error("请输入正确的邮箱地址"))
                            }
                        }
                    } else if (item.checkModel === 'int') {
                        rule.validator = (rule, value, callback) => {
                            if (!value) {
                                callback()
                            }
                            if (/^(\+|\-)?\d+$/.test(value)) {
                                // let msg = this.checkDataLength(rule.field, value);
                                // if (msg) {
                                //     callback(new Error(msg));
                                // } else {
                                //     callback();
                                // }
                                callback();
                            } else {
                                callback(new Error('请输入整数'));
                            }
                        };
                    } else if (item.checkModel === 'positiveInteger') {
                        rule.validator = (rule, value, callback) => {
                            if (!value) {
                                callback()
                            }
                            //除了数字
                            if (/[^\d]/g.test(value)) {
                                callback(new Error('请输入正整数'));
                            } else {
                                // let msg = this.checkDataLength(rule.field, value);
                                // if (msg) {
                                //     callback(new Error(msg));
                                // } else {
                                //     callback();
                                // }
                                callback();
                            }
                        };
                    } else if (item.checkModel === 'english') {
                        rule.validator = (rule, value, callback) => {
                            if (!value) {
                                callback()
                            }
                            if (isEnglish(value)) {
                                // let msg = this.checkDataLength(rule.field, value);
                                // if (msg) {
                                //     callback(new Error(msg));
                                // } else {
                                //     callback();
                                // }
                                callback();
                            } else {
                                callback(new Error('请输入英文字母'));
                            }
                        };
                    } else if (item.checkModel === 'float') {
                        rule.validator = (rule, value, callback) => {
                            if (!value) {
                                callback()
                            }
                            if (/^(\-|\+)?\d+(\.\d+)?$/.test(value)) {
                                // let msg = this.checkDataLength(rule.field, value);
                                // if (msg) {
                                //     callback(new Error(msg));
                                // } else {
                                //     callback();
                                // }
                                callback();
                            } else {
                                callback(new Error('请输入浮点数'));
                            }
                        }
                    } else if (item.checkModel === 'url') {
                        rule.validator = (rule, value, callback) => {
                            if (!value) {
                                callback()
                            }
                            if (validateURL(value)) {
                                // let msg = this.checkDataLength(rule.field, value);
                                // if (msg) {
                                //     callback(new Error(msg));
                                // } else {
                                //     callback();
                                // }
                                callback();
                            } else {
                                callback(new Error('URL格式错误'))
                            }
                        }
                    } else if (item.checkModel === 'lessThanNow') {
                        rule.validator = (rule, value, callback) => {
                            let now = this.getNowString(value.length);
                            if (value > now) {
                                callback(new Error('必须小于当前时间'))
                            } else {
                                callback();
                            }
                        };
                    } else {
                        rule.validator = (rule, value, callback) => {
                            // let msg = this.checkDataLength(rule.field, value);
                            // if (msg) {
                            //     callback(new Error(msg));
                            // } else {
                            //     callback();
                            // }
                            callback();
                        };
                    }
                    rules.push(rule);
                }
                return rules;
            },
            getNowString(len) {
                if (1 <= len && len <= 19) {
                    let date = new Date();
                    let value = date.getFullYear().toString();
                    value += '-';
                    value += this.fillZero((date.getMonth() + 1).toString());
                    value += '-';
                    value += this.fillZero(date.getDate().toString());
                    value += ' ';
                    value += this.fillZero(date.getHours().toString());
                    value += ':';
                    value += this.fillZero(date.getMinutes().toString());
                    value += ':';
                    value += this.fillZero(date.getSeconds().toString());
                    return value.substr(0, len);
                } else {
                    return '';
                }
            },
            fillZero(v) {
                return v.length == 1 ? '0' + v : v;
            },
            checkDataLength(field, value) {
                // if (this.formList.length > 0) {
                //     for (let i = 0; i < this.formList.length; i++) {
                //         let pageModel = this.formList[i].pageModel;
                //         if (pageModel.hasOwnProperty(field)) {
                //             let form = this.formList[i];
                //             for (let row of form.rows) {
                //                 for (let item of row) {
                //                     if (item.briefName === field) {
                //                         if (item.controlType === 'inputElement' ||
                //                             item.controlType === 'textareaElement' ||
                //                             item.controlType === 'richTextElement') {
                //                             let dataLength = item.dataLength;
                //                             let len = value.length;
                //                             if (len > dataLength) {
                //                                 return '长度小于' + dataLength + '个字符'
                //                             }
                //                         }
                //                     }
                //                 }
                //             }
                //         }
                //     }
                // }
                return undefined;
            },
            // 加载动态表头
            loadHeadData() {
                getTableHeadContentDataAlias().then(response=>{
                    this.headData = response.data;
                });
            },
            getRemoteChildren(node,resolve) {
                if (!node.data.id) {
                    return
                }
                getUserCatalogTree({siteId: this.$store.state.common.siteId, parentId: node.data.id}).then(response => {
                    resolve(response.data);
                })
            },
            getCatalogTree(){
                this.listLoading = true;
                getUserCatalogTree({siteId: this.$store.state.common.siteId, parentId: '0'}).then(response => {
                    this.catalogList = response.data;
                    this.setDefaultCurrentNode()
                    this.listLoading = false;
                })
            },
            setDefaultCurrentNode() {
                if (this.catalogList.length > 0) {
                    let data = this.catalogList[0];
                    if (!data.leaf) {
                        this.defaultExpandedKeys = [data.id];
                        //this.$refs['catalogTree'].store.currentNode.expanded = true;
                    } else {
                        this.defaultExpandedKeys = [];
                    }
                    this.handleNoteClick(data);
                    this.$nextTick(function(){
                        this.$refs['catalogTree'].setCurrentKey(data.id);
                    })
                }
            },
            handleNoteClick(data) {
                // 获取内容列表
                // 设置内容工作流id
                this.workflowKey = data.workflowKey;
                this.workflowId = data.workflowId;
                this.listQuery.cmsCatalogId = data.id;
                // 获取template
                this.reloadList();
                // 非外链栏目可以添加内容 !data.childNum
                if (data.flagExternal == 0) {
                    this.isAddTemplate = true;
                    this.getModelByCatalogId(data.id);
                } else {
                    this.isAddTemplate = false;
                }
            },
            handleTabClick() {
                // 获取template
                this.reloadList();
            },
            getAllModelBySiteId() {
                this.listLoading = true;
                getAllModelBySiteId(this.listQuery).then(response => {
                    this.allModelList = response.data;
                    this.listLoading = false;
                })
            },
            getModelByCatalogId(catalogId) {
                this.listLoading = true;
                getModelByCatalogId({catalogId:catalogId}).then(response => {
                    this.modelList = response.data;
                    this.listLoading = false;
                })
            },
            getSiteUploadPath() {
                getSiteUploadPath(this.listQuery).then(response => {
                    if (response.status == 200) {
                        this.siteUploadPath = response.data
                    } else {
                        this.$message.warning('获取站点上传文件存放地址失败')
                    }
                })
            },
            resetSearch(){
                this.listQuery.title = undefined;
            },
            searchReloadList(){
                this.handleCurrentChange(1);
            },
            reloadList(){
                this.listLoading = true;
                this.templateList = undefined;
                // this.total = undefined;
                getTemplateList(this.listQuery).then(response => {
                    this.listLoading = false;
                    let list = response.data.records;
                    if (list && list.length > 0) {
                        for (let t of list) {
                            for (let m of this.allModelList) {
                                if (t.contentModelId === m.id) {
                                    t.contentModelName = m.name;
                                    break;
                                }
                            }
                            for (let d of this.resourceCategoryList) {
                                if (t.resourceCategory === d.id) {
                                    t.resourceCategoryName = d.codeText;
                                    break;
                                }
                            }
                        }
                    }
                    this.templateList = list;
                    this.total = response.data.total;
                }).catch(() => {
                    this.listLoading = false;
                    this.total = 0;
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
            sortNoChange(row) {
                if (row) {
                    updateSortNoById({sortNo: row.sortNo, id: row.id}).then(response=>{
                        if (response.status == 200 && response.data) {
                            this.$message.success("权重修改成功")
                        } else {
                            this.$message.error("权重修改失败")
                        }
                    });
                }

            },
            flagTopChange(row) {
                if (row) {
                    updateFlagTopById({flagTop: row.flagTop, id: row.id}).then(response=>{
                        if (response.status == 200 && response.data) {
                            this.$message.success("置顶修改成功")
                        } else {
                            this.$message.error("置顶修改失败")
                        }
                    });
                }
            },
            // 加载动态表单
            loadForm(contentModelId, templateId) {
                getBaseAndMetaField({contentModelId: contentModelId}).then(response=>{
                    let data = response.data;
                    this.baseFields = data.baseFields;
                    this.baseFields.push('url_');
                    this.metaFields = data.metaFields;
                    this.template.metaDataCollectionId = data.metaDataCollectionId;
                });

                getDynamicForm({contentModelId: contentModelId, templateId: templateId}).then(response=>{
                    this.formList = response.data;
                    if (this.formList.length > 0) {
                        this.maxPage = this.formList.length;
                        for (let i = 0; i < this.formList.length; i++) {
                            let pageModel = this.formList[i].pageModel;
                            if (pageModel.hasOwnProperty("flag_external")) {
                                this.flagExternalIndex = i;
                            }
                            // if (!templateId && pageModel.hasOwnProperty("sort_no")) {
                            //     // 默认权重
                            //     pageModel['sort_no'] = 1;
                            // }
                        }
                    } else {
                        this.maxPage = 0;
                        this.flagExternalIndex = 0;
                    }
                }).catch(err=>{
                    this.$message.error(err);
                });
            },
            //预览
            btnPreview(row) {
                //let url = '/myiframe/urlPath?name=预览&src=/manage/cms/info/' + this.$store.state.common.siteId + '?namePath=' + row.cmsCatalogPathName + '/details/info/' + row.id;
                //this.$router.push({path: url});
                //let url = window.location.origin + '/manage/cms/info/' + this.$store.state.common.siteId + '?namePath=' + row.cmsCatalogPathName + '/details/info/' + row.id;
                let url = window.location.protocol + '//' + this.domainName + '/' + row.cmsCatalogPathName + '/details/info/' + row.id + '.html';
                window.open(url);
            },
            btnCreate(command){
                let has = false;
                let mcId = '';
                for (let m of this.modelList) {
                    if (m.id === command) {
                        mcId = m.metaDataCollectionId;
                        break;
                    }
                }
                for (let mc of this.metadataCollectionList) {
                    if (mcId === mc.id) {
                        has = true;
                    }
                }
                if (!has) {
                    this.$message.error('元数据集不存在')
                    return
                }
                if (command) {
                    let catalogNode = this.$refs.catalogTree.getCurrentNode()
                    if (!catalogNode) {
                        this.$message.warning('请先选择栏目再执行此操作')
                        return
                    }
                    this.resetTemplate();
                    this.template.contentModelId = command;
                    this.template.siteId = this.listQuery.siteId;
                    this.template.cmsCatalogId = this.listQuery.cmsCatalogId;
                    this.template.workflowKey = this.workflowKey;
                    this.template.workflowId = this.workflowId;
                    this.dialogTitle = 'create';
                    this.dialogVisible = true;
                    this.stepsActive = 0;
                    this.maxPage = 0;
                    this.formList = [];
                    this.formFileTemp = [];
                    this.contentPicArray = [];
                    this.loadForm(command, undefined);
                }

            },
            btnUpdate(row){
                this.resetTemplate();
                if (row.id) {
                    this.template = deepClone(row);
                } else {
                    this.template = deepClone(this.selectedRows[0]);
                }
                this.template.workflowKey = this.workflowKey;
                this.template.workflowId = this.workflowId;
                this.contentPicArray = [];
                this.loadForm(this.template.contentModelId, this.template.id);
                this.dialogTitle = 'update';
                this.dialogVisible = true;
            },
            btnCancel(row){
                this.$confirm('此操作将撤销已发布信息, 是否继续？', this.$t("table.tip"), {type: 'error'}).then(() => {
                    let ids = [];
                    if (row.id) {
                        ids.push(row.id);
                    } else {
                        for(const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                    }
                    cancelByIds(ids).then((response)=>{
                        if (response.status == 200 && response.data) {
                            this.reloadList();
                            this.$message.success("撤销成功");
                        } else {
                            this.listLoading = false;
                            this.$message.error(response.message)
                        }
                    });
                });
            },
            // 删除
            btnRecycle(row){
                this.$confirm('此操作将删除该信息, 是否继续？', this.$t("table.tip"), {type: 'error'}).then(() => {
                    let ids = [];
                    if (row.id) {
                        ids.push(row.id);
                    } else {
                        for(const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                    }
                    recycleByIds(ids).then((response)=>{
                        if (response.status == 200 && response.data) {
                            this.reloadList();
                            this.$message.success("删除成功");
                        } else {
                            this.listLoading = false;
                            this.$message.error(response.message)
                        }
                    });
                });
            },
            // 彻底删除
            btnDelete(row){
                let ids = [];
                if (row.id) {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        ids.push({
                            id: row.id,
                            metaDataCollectionId: row.metaDataCollectionId,
                            contentId: row.content ? row.content.id_ : undefined,
                            contentModelId: row.contentModelId
                        });
                        this.doDelete(ids);
                    })
                } else {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        for(const deleteRow of this.selectedRows){
                            ids.push({
                                id: deleteRow.id,
                                metaDataCollectionId: deleteRow.metaDataCollectionId,
                                contentId: deleteRow.content ? deleteRow.content.id_ : undefined,
                                contentModelId: deleteRow.contentModelId
                            });
                        }
                        this.doDelete(ids);
                    })
                }
            },
            // draftFlag草稿
            doSave(draftFlag) {
                this.template.draftFlag = draftFlag;
                let _this = this;
                let formValidate = [];
                for (let form of this.formList) {
                    let formIndex = parseInt(form.pageNumber) - 1;
                    if (_this.$refs['dynamicForm' + formIndex]) {
                        formValidate.push(new Promise(function(resolve, reject) {
                            _this.$refs['dynamicForm' + formIndex][0].validate(valid => {
                                if(valid) {
                                    resolve();
                                }
                            });
                        }));
                    }
                }
                Promise.all(formValidate).then(function() {
                    let content = {};
                    for (let form of _this.formList) {
                        let pageModel = form.pageModel;
                        let checkboxFields = [];
                        let imageArrayFields = [];
                        let pageModelFields = Object.getOwnPropertyNames(pageModel);
                        for (let f of pageModelFields) {
                            if (f.startsWith('checkbox_')) {
                                checkboxFields.push(f.substring(f.indexOf('_') + 1));
                            }
                            if (f.startsWith('imagearray_')) {
                                imageArrayFields.push(f.substring(f.indexOf('_') + 1));
                            }
                        }
                        // 保存基础字段
                        for (let base of _this.baseFields) {
                            // 当前页没有 base 属性
                            if (!pageModel.hasOwnProperty(base)) {
                                continue;
                            }
                            // 下划线转驼峰
                            let dest = base.replace(/_(\w)/g,function ($0,$1){return $1.toUpperCase();});
                            if (dest.endsWith('_')) {
                                dest = dest.substr(0, dest.length -1);
                            }
                            _this.template[dest] = pageModel[base];
                        }
                        // 保存元数据字段
                        for (let meta of _this.metaFields) {
                            // 当前页没有 meta 属性
                            if (!pageModel.hasOwnProperty(meta)) {
                                continue;
                            }
                            let isCheckbox = false;
                            let isImageArray = false;
                            for(let ckb of checkboxFields) {
                                if (ckb === meta) {
                                    isCheckbox = true;
                                    break;
                                }
                            }
                            for(let imgarr of imageArrayFields) {
                                if (imgarr === meta) {
                                    isImageArray = true;
                                    break;
                                }
                            }
                            // 有复选框字段
                            if (isCheckbox) {
                                // 复选框绑定的数组拼接成逗号分隔的字符
                                let arr = pageModel['checkbox_' + meta];
                                if (arr instanceof Array && arr.length > 0) {
                                    content[meta] = arr.join(',');
                                }
                            } else {
                                content[meta] = pageModel[meta];
                            }

                            // 有组图字段
                            if (isImageArray) {
                                let arr = pageModel['imagearray_' + meta];
                                if (arr instanceof Array && arr.length > 0) {
                                    let tmp = [];
                                    for (let item of arr) {
                                        tmp.push("{\"url\":\""+item.value+"\",\"remark\":\""+item.name+"\"}");
                                    }
                                    content[meta] = tmp.length > 0 ? "["+tmp.join(',')+"]" : '';
                                }
                            } else {
                                content[meta] = pageModel[meta];
                            }
                        }
                    }
                    if (draftFlag) {
                        _this.template.draftFlag = draftFlag;
                    }
                    _this.template.contentMapStr = JSON.stringify(content);
                    _this.template.metadataCollectionVo = undefined;
                    _this.template.content = undefined;
                    _this.submitLoading = true;
                    if (_this.template.id) {
                        createOrUpdateTemplate(_this.template).then(() => {
                            _this.resetTemplateDialogAndList();
                            _this.$message.success(_this.$t("table.updateSuccess"));
                        }, (error)=>{
                            _this.$message.error(error);
                        }).catch((err)=>{
                            _this.$message.error(err);
                        });
                    } else {
                        createOrUpdateTemplate(_this.template).then(() => {
                            _this.resetTemplateDialogAndList();
                            _this.$message.success(_this.$t("table.createSuccess"));
                        }, (error)=>{
                            _this.$message.error(error);
                        }).catch((err)=>{
                            _this.$message.error(err);
                        });
                    }
                });
            },
            doDelete(ids){
                this.listLoading = true;
                delTemplates(JSON.stringify(ids)).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetTemplate(){
                this.template = {
                    id: undefined,
                    siteId: undefined,
                    templatePath: undefined,
                    cmsCatalogId: undefined,
                    contentModelId: undefined,
                    contentId: undefined,
                    status: undefined,
                    contentModelTemplateId: undefined,
                    url: undefined,
                    author: undefined,
                    editor: undefined,
                    source: undefined,
                    thumbnail: undefined,
                    title: undefined,
                    flagSearch: undefined,
                    sortNo: undefined,
                    flagTop: undefined,
                    views: undefined,
                    flagExternal: undefined,
                    resourceSummary: undefined,
                    resourceContent: undefined,
                    resourceCategory: undefined,
                    keyword: undefined,
                    workflowKey: undefined,
                    workflowId: undefined,
                    contentModelName: undefined,
                    contentMapStr: undefined,
                    content: {}
                }
            },
            resetTemplateDialogAndList(){
                this.closeTemplateDialog();
                this.submitLoading = false;
                this.stepsActive = 0;
                this.reloadList();
            },
            closeTemplateDialog() {
                this.dialogVisible = false;
                this.metadataCollection = {};
                this.metadataCollection.metadataList = [];
                this.editorDefaultMsg = {};
                this.contentItemOptions = {};
                this.contentItemArray = {};
                this.uploadFileList = {};
                this.dynamicTags = [];
                this.thumbnailList = [];
                this.stepsActive = 0;
                this.formList = [];
                this.formFileTemp = [];
                this.resetTemplate();
                this.maxPage = 0;
                this.flagExternalIndex = 0;
            },
            // 选择菜单触发
            handleCommand(command) {
                if(this.proGressStaticPercentage > 0 && this.proGressStaticPercentage < 100){
                    this.proGressStaticDialogVisible = true;
                }else{
                    // 生成勾选的内容页
                    if (command == 'handleCheckedStaticContent') {
                        this.handleCheckedStaticContent();
                    }
                    // 生成当前栏目的内容页
                    if (command == 'handleCatalogStaticContent') {
                        this.handleCatalogStaticContent();
                    }
                    // 生成整个站点的内容页
                    if (command == 'handleSiteStaticContent') {
                        this.handleSiteStaticContent();
                    }
                }
                if(this.proGressIndexPercentage > 0 && this.proGressIndexPercentage < 100){
                    this.proGressIndexDialogVisible = true;
                }else{
                    // 生成勾选的索引页
                    if (command == 'handleCheckedReindex') {
                        this.handleCheckedReindex();
                    }
                    // 生成当前栏目的索引
                    if (command == 'handleCatalogReindex') {
                        this.handleCatalogReindex();
                    }
                }
                // 生成整个站点的索引
                /*if (command == 'handleSiteReindex') {
                    this.handleSiteReindex();
                }*/
            },
            // 批量生成勾选的内容页
            handleCheckedStaticContent() {
                if (!this.listQuery.siteId) {
                    this.$message.error('请先选择站点！')
                    return
                }
                let ids = []
                for (const row of this.selectedRows) {
                    ids.push(row.id)
                }
                if (ids.length === 0) {
                    this.$message.info('请先勾选数据')
                    return
                }
                let params = {
                    ids: ids.join(),
                    siteId: this.listQuery.siteId
                }
                genStaticPage(params).then(response => {
                    if (response.status == 200) {
                        this.staticPathProgress();
                    } else {
                        this.$message.error('操作失败！')
                    }
                })
            },
            // 批量生成当前栏目的内容页
            handleCatalogStaticContent() {
                if (!this.listQuery.siteId) {
                    this.$message.error('请先选择站点！')
                    return
                }
                if (!this.listQuery.cmsCatalogId) {
                    this.$message.error('请先选择栏目！')
                    return
                }
                let params = {
                    cmsCatalogId: this.listQuery.cmsCatalogId,
                    siteId: this.listQuery.siteId
                }
                genStaticPage(params).then(response => {
                    if (response.status == 200) {
                        this.staticPathProgress();
                    } else {
                        this.$message.error('操作失败！')
                    }
                })
            },
            // 批量生成整个站点的内容页
            handleSiteStaticContent() {
                if (!this.listQuery.siteId) {
                    this.$message.error('请先选择站点！')
                    return
                }
                genStaticPage({siteId: this.listQuery.siteId}).then(response => {
                    if (response.status == 200) {
                        this.staticPathProgress();
                    } else {
                        this.$message.error('操作失败！')
                    }
                })
            },
            // 批量生成勾选的索引
            handleCheckedReindex() {
                if (!this.listQuery.siteId) {
                    this.$message.error('请先选择站点！')
                    return
                }
                let ids = []
                for (let row of this.selectedRows) {
                    ids.push(row.id)
                }
                if (ids.length === 0) {
                    this.$message.info('请先勾选数据')
                    return
                }

                let params = {
                    ids: ids.join(),
                    siteId: this.listQuery.siteId
                }
                reindex(params).then(response => {
                    if (response.status == 200) {
                        this.indexPathProgress();
                    } else {
                        this.$message.error('生成失败！')
                    }
                })
            },
            // 批量生成当前栏目的索引
            handleCatalogReindex() {
                if (!this.listQuery.siteId) {
                    this.$message.error('请先选择站点！')
                    return
                }
                if (!this.listQuery.cmsCatalogId) {
                    this.$message.error('请先选择栏目！')
                    return
                }
                let params = {
                    cmsCatalogId: this.listQuery.cmsCatalogId,
                    siteId: this.listQuery.siteId
                }
                reindex(params).then(response => {
                    if (response.status == 200) {
                        this.indexPathProgress();
                    } else {
                        this.$message.error('生成失败！')
                    }
                })
            },
            // 批量生成整个站点的索引
            /*handleSiteReindex() {
                if (!this.listQuery.siteId) {
                    this.$message.error('请先选择站点！')
                    return
                }
                // 校验
                /!*const titles = [];
                for (let t of this.templateList) {
                    if (!t.flagSearch) {
                        titles.push(t.title);
                    }
                }
                if (titles.length > 0) {
                    this.$message.error('不被允许搜索到的内容不可以生成索引！内容标题：' + titles.join());
                    return;
                }*!/
                reindex({siteId: this.listQuery.siteId}).then(response => {
                    if (response.status == 200) {
                        this.$message.success('生成中，请稍后查看！')
                        this.reloadList()
                    } else {
                        this.$message.error('生成失败！')
                    }
                })
            },*/

            handleSuccess(data, prefix) {
                let attach = data.attach.split(',');
                // 页索引
                let formIndex = attach[0];
                // 页字段
                let briefName = attach[1];
                // 上传返回的材料对象
                let customData = data.customData;
                if ('image_' === prefix) {
                    // 显示地址
                    customData.url = this.loadShowImageUrl(customData.url);
                }
                else if ('file_' === prefix) {
                    // 下载地址
                    customData.url = this.loadDownloadUrl(customData.url);
                } else {
                    return
                }
                // 绑定数组
                let dataList = this.formList[formIndex].pageModel[prefix + briefName];
                // 追加新对象
                dataList.push(customData);
                let tmp = [];
                for (let item of dataList) {
                    tmp.push(item.value);
                }
                // 表单值
                this.formList[formIndex].pageModel[briefName] = tmp.length > 0 ? tmp.join(',') : '';
            },
            handleRemove(file, prefix) {
                let value = '';
                // 新上传的
                if (file.hasOwnProperty("response")) {
                    value = file.response.data.customData.value;
                }
                // 后端返回的
                else if (file.hasOwnProperty("value")) {
                    value = file.value;
                }
                if (!value) {
                    return;
                }
                for(let i = 0; i < this.formList.length; i++) {
                    let pageModel = this.formList[i].pageModel;
                    let fields = Object.getOwnPropertyNames(pageModel);
                    for (let field of fields) {
                        if (field.startsWith(prefix)) {
                            let index = -1;
                            // 绑定数组中寻找要删除的url
                            let list = pageModel[field];
                            for(let j = 0; j < list.length; j++) {
                                if (value === list[j].value) {
                                    index = j;
                                    break;
                                }
                            }
                            if (index > -1) {
                                list.splice(index, 1);
                                index = -1;
                                let tmp = [];
                                for (let item of list) {
                                    tmp.push(item.value);
                                }
                                pageModel[field.substring(prefix.length)] = tmp.length > 0 ? tmp.join(',') : '';
                            }
                        }
                    }
                }
            },



            // 图片处理
            handleImageSuccess(response, file, fileList) {
                if (response.status === 200 && response.data.state === 'SUCCESS') {
                    this.handleSuccess(response.data, 'image_');
                    this.$message.success('上传成功！');
                } else {
                    console.error(response);
                    this.$message.error('上传失败！');
                }
            },
            handleImageError(err, file, fileList) {
                console.error(err);
                this.$message.error('网络不稳定，上传失败！')
            },
            beforeImageUpload(file) {
                const isJPG = this.$store.state.common.imageAccepts.includes(file.type);
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) {
                    this.$message.error('上传图片格式不正确!');
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 2M');
                }
                return isJPG && isLt2M;
            },
            handleImageCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisiblePicture = true;
            },
            handleImageRemove(file, fileList) {
                this.handleRemove(file, 'image_');
            },

            // 组图处理
            handleArraySuccess(data, prefix) {
                let attach = data.attach.split(',');
                // 页索引
                let formIndex = attach[0];
                // 页字段
                let briefName = attach[1];
                // 上传返回的材料对象
                let customData = data.customData;
                if ('imagearray_' === prefix) {
                    // 显示地址
                    customData.url = this.loadShowImageUrl(customData.url);
                } else {
                    return
                }
                // 绑定数组
                let dataList = this.formList[formIndex].pageModel[prefix + briefName];
                // 追加新对象
                dataList.push(customData);
                let tmp = [];
                for (let item of dataList) {
                    tmp.push("{\"url\":\""+item.value+"\",\"remark\":\""+item.name+"\"}");
                }
                // 表单值
                this.formList[formIndex].pageModel[briefName] = tmp.length > 0 ? "["+tmp.join(',')+"]" : '';
            },
            handleImageArraySuccess(response, file, fileList) {
                if (response.status === 200 && response.data.state === 'SUCCESS') {
                    this.handleArraySuccess(response.data, 'imagearray_');
                    this.$message.success('上传成功！');
                } else {
                    console.error(response);
                    this.$message.error('上传失败！');
                }
            },
            handleImageArraySort(key,type){
                let prefix = 'imagearray_';
                for(let i = 0; i < this.formList.length; i++) {
                    let pageModel = this.formList[i].pageModel;
                    let fields = Object.getOwnPropertyNames(pageModel);
                    for (let field of fields) {
                        if (field.startsWith(prefix)) {
                            let list = pageModel[field];
                            let cur = list[key];
                            let curs;
                            if(type === 'up'){
                                curs = list[key-1];
                                list.splice(key-1,1,cur);
                            }
                            if(type === 'down'){
                                curs = list[key+1];
                                list.splice(key+1,1,cur);
                            }
                            list.splice(key,1,curs);
                            let tmp = [];
                            for (let item of list) {
                                tmp.push("{\"url\":\""+item.value+"\",\"remark\":\""+item.name+"\"}");
                            }
                            pageModel[field.substring(prefix.length)] = tmp.length > 0 ? "["+tmp.join(',')+"]" : '';
                        }
                    }
                }
            },
            handleImageArrayRemove(file, fileList) {
                let value = '';
                let prefix = 'imagearray_';
                // 新上传的
                if (file.hasOwnProperty("response")) {
                    value = file.response.data.customData.value;
                }
                // 后端返回的
                else if (file.hasOwnProperty("value")) {
                    value = file.value;
                }
                if (!value) {
                    return;
                }
                for(let i = 0; i < this.formList.length; i++) {
                    let pageModel = this.formList[i].pageModel;
                    let fields = Object.getOwnPropertyNames(pageModel);
                    for (let field of fields) {
                        if (field.startsWith(prefix)) {
                            let index = -1;
                            // 绑定数组中寻找要删除的url
                            let list = pageModel[field];
                            for(let j = 0; j < list.length; j++) {
                                if (value === list[j].value) {
                                    index = j;
                                    break;
                                }
                            }
                            if (index > -1) {
                                list.splice(index, 1);
                                index = -1;
                                let tmp = [];
                                for (let item of list) {
                                    tmp.push("{\"url\":\""+item.value+"\",\"remark\":\""+item.name+"\"}");
                                }
                                pageModel[field.substring(prefix.length)] = tmp.length > 0 ? "["+tmp.join(',')+"]" : '';
                            }
                        }
                    }
                }
            },


            // 文件处理 带输入框
            handleFileInputSuccess(response, file, fileList) {
                if (response.status === 200 && response.data.state === 'SUCCESS') {
                    this.handleInputSuccess(response.data, 'file_');
                    this.$message.success('上传成功！');
                } else {
                    console.error(response);
                    this.$message.error('上传失败！');
                }
            },
            handleInputSuccess(data, prefix) {
                let attach = data.attach.split(',');
                // 页索引
                let formIndex = attach[0];
                // 页字段
                let briefName = attach[1];
                // 上传返回的材料对象
                let customData = data.customData;
                // 表单值
                this.formList[formIndex].pageModel[briefName] = customData.url;
            },
            // 文件处理
            handleFileSuccess(response, file, fileList) {
                if (response.status === 200 && response.data.state === 'SUCCESS') {
                    this.handleSuccess(response.data, 'file_');
                    this.$message.success('上传成功！');
                } else {
                    console.error(response);
                    this.$message.error('上传失败！');
                }
            },
            handleFileError(err, file, fileList) {
                console.error(err);
                this.$message.error('网络不稳定，上传失败！')
            },
            beforeFileUpload(file) {
                let isOK = false;
                if ((file.size / 1024 / 1024) > this.uploadFileSize) {
                    this.$message.error('上传文件大小不能超过 ' + this.uploadFileSize + 'M');
                } else {
                    let index = file.name.lastIndexOf('.');
                    if (index < 0) {
                        this.$message.error('不支持该类型的文件');
                    } else {
                        let suffix = file.name.substring(index + 1);
                        for (let sf of this.uploadFileTypeList) {
                            if (sf === suffix) {
                                isOK = true;
                                break;
                            }
                        }
                        if (!isOK) {
                            this.$message.error('不支持该类型的文件');
                        }
                    }
                }
                return isOK;
            },
            handleFilePreview(file) {
                window.location.href = file.url;
            },
            handleFileRemove(file, fileList) {
                this.handleRemove(file, 'file_');
            },



            // 动态添加关键字 start
            handleClose(tag) {
                this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
            },
            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            handleInputConfirm() {
                let inputValue = this.inputValue;
                if (inputValue) {
                    this.dynamicTags.push(inputValue);
                }
                this.inputVisible = false;
                this.inputValue = '';
            },
            // 动态添加关键字 end
            previousStep(formIndex) {
                this.stepsActive--;
            },
            nextStep(formIndex) {
                this.$refs['dynamicForm' + formIndex][0].validate(valid => {
                    if(valid) {
                        this.stepsActive++;
                    } else {
                        return false;
                    }
                });
            },
            displaySetting() {
                this.headList = [];
                this.displaySettingVisible = true;
                getCustomizationFunctionContent().then(response=>{
                    this.customizationFunction = response.data;
                    this.headList = this.customizationFunction.headList;
                });
            },
            closeDisplaySettingDialog() {
                this.displaySettingVisible = false;
                this.customizationFunction = undefined;
                this.headList = [];
            },
            sortFunctionUp(headList, index) {
                if (index > 0) {
                    const row = headList.splice(index, 1)[0];
                    headList.splice(index - 1, 0, row);
                }
            },
            sortFunctionDown(headList, index) {
                if (index !== headList.length - 1) {
                    const row = headList.splice(index, 1)[0];
                    headList.splice(index + 1, 0, row);
                }
            },
            btnFunctionSave() {
                let data = JSON.stringify(this.headList);
                this.customizationFunction.headList = undefined;
                this.customizationFunction.data = data;
                saveOrUpdate(this.customizationFunction).then(response=>{
                    if (response.status == 200 && response.data) {
                        this.loadHeadData();
                        this.closeDisplaySettingDialog();
                        this.$message.success("保存成功");
                    } else {
                        this.$message.success("保存失败");
                    }
                });
            },
            btnFunctionDelete() {
                removeContentData().then(()=>{
                    this.loadHeadData();
                    this.closeDisplaySettingDialog();
                    this.$message.success("重置成功");
                });
            },
            isShowRow(row, field) {
                if (row && row.length > 0) {
                    for (let item of row) {
                        if (item.briefName === field) {
                            return true;
                        }
                    }
                }
                return false;
            },
            contentChange(content, attach) {
                let value = attach.split(',');
                let formIndex = parseInt(value[0]);
                let briefName = value[1];
                this.formList[formIndex].pageModel[briefName] = content;
            },
            editorPlainTxtChange(content, attach) {
                let value = attach.split(',');
                let formIndex = parseInt(value[0]);
                let briefName = value[1];
                this.formList[formIndex].pageModel[briefName + '_PlainTxt'] = content.replace(/<[\s\S]*>/g, '');
            },
            extractSummary() {
                let titleFormIndex = -1
                let summaryFormIndex = -1;
                let contentIndex = -1;
                for (let i = 0; i < this.formList.length; i++) {
                    let pageModel = this.formList[i].pageModel;
                    if (pageModel.hasOwnProperty('title_')) {
                        titleFormIndex = i;
                    }
                    if (pageModel.hasOwnProperty('resource_summary')) {
                        summaryFormIndex = i;
                    }
                    if (pageModel.hasOwnProperty('resource_content')) {
                        contentIndex = i;
                    }
                    if (titleFormIndex != -1 && summaryFormIndex != -1 && contentIndex != -1) {
                        break;
                    }
                }
                if (titleFormIndex != -1 && summaryFormIndex != -1 && contentIndex != -1) {
                    let title = this.formList[titleFormIndex].pageModel['title_'];
                    let content = this.formList[contentIndex].pageModel['resource_content_PlainTxt'].trim();
                    if (!content || content.length == 0) {
                        this.$message.error("请输入正文");
                        return;
                    }
                    summary({title: title, content: content}).then(response=>{
                        if (response && response.status == 200) {
                            this.formList[summaryFormIndex].pageModel['resource_summary'] = response.data;
                        }
                    });
                } else {
                    this.$message.error("摘要提取错误");
                }
            },
            extractKeyword() {
                let contentIndex = -1;
                let keywordFormIndex = -1;
                let titleFormIndex = -1
                for (let i = 0; i < this.formList.length; i++) {
                    let pageModel = this.formList[i].pageModel;
                    if (pageModel.hasOwnProperty('title_')) {
                        titleFormIndex = i;
                    }
                    if (pageModel.hasOwnProperty('keyword_')) {
                        keywordFormIndex = i;
                    }
                    if (pageModel.hasOwnProperty('resource_content')) {
                        contentIndex = i;
                    }
                    if (titleFormIndex != -1 && keywordFormIndex != -1 && contentIndex != -1) {
                        break;
                    }
                }
                if (titleFormIndex != -1 && keywordFormIndex != -1 && contentIndex != -1) {
                    let title = this.formList[titleFormIndex].pageModel['title_'].trim();
                    let content = this.formList[contentIndex].pageModel['resource_content_PlainTxt'].trim();
                    if (!title || title.length == 0) {
                        this.$message.error("请输入标题");
                        return;
                    }
                    if (!content || content.length == 0) {
                        this.$message.error("请输入正文");
                        return;
                    }
                    if (title && content) {
                        // 标题最大80字节，正文最大65535字节
                        keyword({title: title, content: content}).then(response=>{
                            if (response && response.status == 200) {
                                if (response.data.length > 0) {
                                    this.formList[keywordFormIndex].pageModel['keyword_'] = response.data.join(',');
                                }
                            }
                        });
                    }
                } else {
                    this.$message.error("关键字提取错误");
                }

            },
            getAlign(prop) {
                if (prop === 'title' || prop === '')
                    return 'left';
                else if (prop === '')
                    return 'right'
                else
                    return 'center'
            },
            getHeadWidth(prop) {
                if (prop === 'title')
                    return '';
                else if (prop === 'source')
                    return '160';
                else if (prop === 'resourcePublicationDate' || prop === 'createTime' || prop === 'updateTime')
                    return '140';
                else if (prop === 'status')
                    return '80';
                else if (prop === 'sortNo')
                    return '130';
                else if (prop === 'flagTop' || prop === 'flagExternal')
                    return '50';
                else if (prop === 'thumbnail')
                    return '120'
                else if (prop === 'author' || prop === 'createUserName' || prop === 'updateUserName')
                    return '100';
                else if (prop === 'resourceCategory')
                    return '160';
                else if (prop === 'templatePath')
                    return '200';
                else if (prop === 'indexCode')
                    return '230';
                else if (prop === 'contentModelName')
                    return '160';
                else if (prop === 'createUserDepartmentName' || prop === 'updateUserDepartmentName')
                    return '160';
            },
            // 允许上传的附件类型
            getUploadFileTypeAndSizeObject(siteId) {
                getUploadFileTypeAndSize(siteId).then(response => {
                    if (response.status == 200) {
                        let data = response.data;
                        this.uploadFileTypeList = data.types;
                        this.uploadFileSize = data.size
                    } else {
                        this.$message.error('获取字典项失败')
                    }
                })
            },
            getContentThumb(){
                this.contentPicArray = [];
                let content;
                if (this.formList.length > 0) {
                    for (let i = 0; i < this.formList.length; i++) {
                        let form = this.formList[i];
                        let itemRows = form.rows;
                        for(let j = 0; j < itemRows.length; j++){
                            let items = itemRows[j];
                            for(let k = 0; k < items.length; k++) {
                                let item = items[k];
                                if (item.controlType == 'richTextElement') {
                                    content += form.pageModel[item.briefName];
                                }
                            }
                        }
                    }
                }
                let re = new RegExp(/<img.*?src.*?=.*?(.*?)>/ig);
                let r = content.match(re);
                if (r != null && r.length > 0) {
                    for (let i = 0; i < r.length; i++) {
                        let src = r[i].replace(/<img[\s]*.*?src=\"(.*?)[\"](.*)/ig, "$1");
                        this.contentPicArray.push(src);
                    }
                }
            },
            selectImg(src){
                let value = src.substring(src.indexOf("/upload/"));
                let pic = {url: src,value: value}
                if (this.formList.length > 0) {
                    for (let i = 0; i < this.formList.length; i++) {
                        let form = this.formList[i];
                        let itemRows = form.rows;
                        for(let j = 0; j < itemRows.length; j++){
                            let items = itemRows[j];
                            for(let k = 0; k < items.length; k++) {
                                let item = items[k];
                                if (item.briefName == 'thumbnail_') {
                                    let thumbnail = form.pageModel['image_' + item.briefName];
                                    if(thumbnail && thumbnail.length < 3){
                                        thumbnail.push(pic);
                                    }
                                    let tmp = [];
                                    for (let thum of thumbnail) {
                                        tmp.push(thum.value);
                                    }
                                    // 表单值
                                    form.pageModel[item.briefName] = tmp.length > 0 ? tmp.join(',') : '';
                                }
                            }
                        }
                    }
                }
            },
            staticPathProgress(){
                let _this = this;
                _this.proGressStaticTotle = 0;
                _this.proGressStaticCurNo = 0;
                _this.proGressStaticCurTitle = '';
                _this.proGressStaticPercentage = 0;
                _this.proGressStaticDialogVisible = true;
                let sockJS = new SockJS('/web/websocket-station/');
                let stompClient = Stomp.over(sockJS)
                stompClient.connect({}, function () {
                    stompClient.subscribe('/topic/staticPage/message/', function (response) {
                        //append,modify,delete
                        let operate = JSON.parse(response.body);
                        _this.proGressStaticTotle = operate.totle;
                        _this.proGressStaticCurNo = operate.currNo;
                        _this.proGressStaticCurTitle = operate.currTitle;
                        _this.proGressStaticPercentage = parseFloat(operate.currNo/operate.totle*100).toFixed(2)*1;
                    });
                });
                sockJS.onclose = function () {
                    console.log("连接已关闭 "+new Date());
                }
            },
            indexPathProgress(){
                let _this = this;
                _this.proGressIndexTotle = 0;
                _this.proGressIndexCurNo = 0;
                _this.proGressIndexCurTitle = '';
                _this.proGressIndexPercentage = 0;
                _this.proGressIndexDialogVisible = true;
                let sockJS = new SockJS('/web/websocket-station/');
                let stompClient = Stomp.over(sockJS)
                stompClient.connect({}, function () {
                    stompClient.subscribe('/topic/reIndex/message/', function (response) {
                        //append,modify,delete
                        let operate = JSON.parse(response.body);
                        _this.proGressIndexTotle = operate.totle;
                        _this.proGressIndexCurNo = operate.currNo;
                        _this.proGressIndexCurTitle = operate.currTitle;
                        _this.proGressIndexPercentage = parseFloat(operate.currNo/operate.totle*100).toFixed(2)*1;
                    });
                });
                sockJS.onclose = function () {
                    console.log("连接已关闭 "+new Date());
                }
            }
        }
    }
</script>
<style>
    .classificationTree {
        border:1px solid #eceef5;
        overflow-x: scroll;
        margin-right:10px;
        padding: 10px;
        height: 100%;
    }
    .el-textarea__inner {
        height: 100%;
    }
    .el-dialog__body {
        padding-bottom: 0;
    }
    /*标准管理树*/
    .standard-text{
        display: flex;
        justify-content: flex-start;
        overflow: auto;
        margin-top: 20px;
    }

    /*组织机构树*/
    /*树字体*/
    .el-tree {
        font-size: 14px;
        color: #535353;
    }
    /*树编辑弹框*/
    .tree-edit .el-textarea{
        width: 434px;
    }
    .left-tree
    {
        width: 210px;
        margin-right:10px;
        background:white;
        border:1px solid #EBEEF5;
        overflow-x: auto;
        overflow-y: auto;
    }
    .left-tree .el-tree {
        display: inline-block;
        margin: 10px ;
        min-width: 90%;
    }
    .left-tree::-webkit-scrollbar {/*滚动条整体样式*/
        width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
        height: 4px;
    }
    .left-tree::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
        border-radius: 5px;
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        background: #f0f7ff;
    }
    .left-tree::-webkit-scrollbar-track {/*滚动条里面轨道*/
        /*-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);*/
        border-radius: 0;
        background: #fff;
    }
    /*设置根节点上编辑按钮*/
    .custom-tree-node {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
    /*编辑按钮弹框*/
    /deep/ .el-dialog__body .el-input__inner{
        padding-right: 30px;
        -moz-user-select: text;
        -webkit-user-select: text;
        -ms-user-select: text;
    }
    /*表格样式根据elementUIIndex样式文件来设置*/
    /*树节点选中状态高亮色的设置*/
    .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
        background-color: #a6d1ff;
    }
    /deep/ .el-tree-node > .el-tree-node__children {
        overflow: visible !important;
    }

    /*表格*/
    .table-list{
        width: 100% !important;
        margin-top: 0px !important;
        /*margin-top: 1px !important;
        margin-left: 1px !important;*/
    }

    /*缩略图*/
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        width: 178px;
        height: 178px;
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
    .avatar-uploader .el-upload-list__item {
        width: 178px;
        height: 178px;
    }
    .avatar-uploader .el-upload-list__item .el-upload-list__item-status-label {
        display: none;
    }
    .hide .el-upload--picture-card {
        display: none;
    }

    /*table-expand*/
    .table-expand {
        font-size: 0;
    }
    .table-expand label {
        width: 160px;
        color: #99a9bf;
    }
    .table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }

    /*关键字*/
    .el-tag {
        margin-right: 10px;
    }
    .button-new-tag {
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 320px;
        margin-right: 10px;
        vertical-align: bottom;
    }
    .my-tabls {
        position: relative;
    }
    .my-tabls>.el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
        background-color: #F0F0F0;
        border-bottom: 1px solid #F0F0F0;
    }
    .el-tabs__nav-wrap {
        overflow: hidden;
        margin-bottom: 0px;
        position: relative;
    }
    .el-tabs__header{margin:0;}
    .appeal_table {
        width:100%;
    }

</style>

