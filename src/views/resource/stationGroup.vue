<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-menu">
                <div class="deyatech-menu_left">
                    <el-button v-show="btnEnable.create"  type="primary" :size="btnSize" @click="btnCreate">{{$t('table.create')}}</el-button>
                    <el-button v-show="btnEnable.update"  type="primary" :size="btnSize" @click="btnUpdate" :disabled="selectedRows.length != 1">{{$t('table.update')}}</el-button>
                    <el-button v-show="btnEnable.delete"  type="danger"  :size="btnSize" @click="btnDelete" :disabled="selectedRows.length < 1 || disableDelete">{{$t('table.delete')}}</el-button>
                    <el-button v-show="btnEnable.setting" type="primary" :size="btnSize" @click="btnSetting" :disabled="selectedRows.length != 1">设置</el-button>
                    <el-button v-show="btnEnable.setting" type="primary" :size="btnSize" @click="btnGlobalSetting">全局设置</el-button>
                    <el-button v-show="btnEnable.domain"  type="primary" :size="btnSize" @click="btnDomain" :disabled="selectedRows.length != 1">域名</el-button>

                    <el-cascader filterable :options="departmentCascader"
                                 v-model.trim="listQueryDepartmentTreePosition"
                                 placeholder="请选择部门" :size="btnSize" style="width:300px;margin-left: 10px;"></el-cascader>
                    <el-input :size="searchSize" :placeholder="$t('table.searchName')" v-model.trim="listQuery.name" maxlength="100" style="width: 300px;margin-left: 10px;margin-right:10px;"></el-input>
                    <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="searchList">{{$t('table.search')}}</el-button>
                    <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}</el-button>
                </div>
                <div class="deyatech-menu_right">
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                </div>
            </div>

            <el-row :span="24">
                <el-col :span="4">
                    <div class="classificationTree">
                        <!--左侧树-->
                        <el-tree ref="stationGroupClassificationTree" style="max-width:500px;"
                                 :data="stationGroupClassificationCascader"
                                 node-key="value"
                                 :highlight-current="true"
                                 :default-expand-all="true"
                                 :expand-on-click-node="false"
                                 @node-click="handleStationGroupClassificationNodeClick">
                        </el-tree>
                    </div>
                </el-col>
                <el-col :span="20">
                    <!--右侧一览-->
                    <el-table :data="stationGroupList" v-loading.body="listLoading" stripe border highlight-current-row
                              @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="50" align="center"/>
                        <!--<el-table-column align="center" label="所属分类" prop="stationGroupClassificationName"/>-->
                        <el-table-column align="left" label="名称" prop="name">
                            <template slot-scope="scope">
                                <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="英文名称" prop="englishName" width="120"/>
                        <!--<el-table-column align="center" label="简称" prop="abbreviation"/>-->
                        <!--<el-table-column align="center" label="部门" prop="departmentName"/>-->
                        <el-table-column align="center" label="排序号" prop="sortNo" width="90"/>
                        <el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                            <template slot-scope="scope">
                                <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                                    {{scope.row.enable == 1 ? "启用" : (scope.row.enable == 0 ? "停用" : "") }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="300">
                            <template slot-scope="scope">
                                <div style="padding-top: 8px;">
                                    <el-button v-show="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                                               @click.stop="btnUpdate(scope.row)"></el-button>
                                    <el-button v-show="btnEnable.delete" :title="$t('table.delete')" type="danger" icon="el-icon-delete" :size="btnSize" circle
                                               :disabled="scope.row.enable == 1"
                                               @click.stop="btnDelete(scope.row)"></el-button>
                                    <el-button v-if="scope.row.enable == 1" title="停用" type="warning" icon="el-icon-close" :size="btnSize" circle
                                               @click.stop="btnCtrl(scope.row, 'stop')"></el-button>
                                    <el-button v-else-if="scope.row.enable == 0" title="启用" type="warning" icon="el-icon-caret-right" :size="btnSize" circle
                                               @click.stop="btnCtrl(scope.row, 'run')"></el-button>
                                    <el-button v-show="btnEnable.setting" title="设置" type="primary" icon="el-icon-setting" :size="btnSize" circle
                                               @click.stop="btnSetting(scope.row)"></el-button>
                                    <el-button v-show="btnEnable.domain" title="域名" type="primary" icon="icon-earth" :size="btnSize" circle
                                               @click.stop="btnDomain(scope.row)"></el-button>
                                    <el-button v-show="btnEnable.user" title="关联用户" type="primary" icon="el-icon-user" :size="btnSize" circle
                                               @click.stop="btnUser(scope.row)"></el-button>
                                <!--<el-button title="关联角色" type="primary" icon="icon-category" :size="btnSize" circle
                                           @click.stop="btnStationGroupRole(scope.row)"></el-button>-->

                                </div>
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


            <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeStationGroupDialog">
                <el-form ref="stationGroupDialogForm" class="deyatech-form" :model="stationGroup" label-position="right"
                         label-width="80px" :rules="stationGroupRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="分类" prop="stationGroupClassificationId">
                                <el-cascader filterable :options="stationGroupClassificationCascader"
                                             v-model.trim="stationGroupClassificationTreePosition"
                                             placeholder="请选择分类" style="width: 100%;" ></el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="部门" prop="departmentId">
                                <el-cascader filterable :options="departmentCascader"
                                             v-model.trim="formDepartmentTreePosition"
                                             placeholder="请选择部门" style="width: 100%;"></el-cascader>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="名称" prop="name">
                                <el-input v-model.trim="stationGroup.name" maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="英文名称" prop="englishName">
                                <el-input v-model.trim="stationGroup.englishName" maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="简称" prop="abbreviation">
                                <el-input v-model.trim="stationGroup.abbreviation" maxlength="20"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="排序号" prop="sortNo">
                                <el-input v-model.trim="stationGroup.sortNo" maxlength="3"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="标识码" prop="siteCode">
                                <el-input v-model.trim="stationGroup.siteCode" maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="ICP备案" prop="icpCode">
                                <el-input v-model.trim="stationGroup.icpCode" maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="公安备案" prop="policeCode">
                                <el-input v-model.trim="stationGroup.policeCode" maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="描述" prop="description">
                                <el-input v-model.trim="stationGroup.description" maxlength="500"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model.trim="stationGroup.remark" :rows="3" maxlength="400"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeStationGroupDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>


            <!--站点设置-->
            <el-dialog :title="titleSetting" :visible.sync="dialogSettingVisible" :close-on-click-modal="closeOnClickModal" @close="closeSettingDialog">
                <el-form ref="settingDialogForm" class="deyatech-form" :model="setting" label-position="right" label-width="160px" :rules="settingRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="允许上传的附件类型" prop="uploadFileType">
                                <el-select filterable v-model.trim="uploadFileTypeArray" @change="uploadFileTypeChange" clearable multiple style="width: 100%">
                                    <!--<el-option v-for="item in enums['UploadFileTypeEnum']"
                                               :key="item.code"
                                               :label="item.value"
                                               :value="item.code"></el-option>-->
                                    <el-option
                                        v-for="s in uploadFileTypeList"
                                        :key="s.id"
                                        :label="s.codeText"
                                        :value="s.codeText">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="允许上传文件大小(M)" prop="uploadFileSize">
                                <el-input v-model.trim="setting.uploadFileSize" maxlength="3"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="是否生成缩略图" prop="thumbnailEnable">
                                <el-select filterable v-model.trim="setting.thumbnailEnable" style="width: 100%" @change="thumbnailEnableChange">
                                    <el-option v-for="item in enums['YesNoEnum']"
                                               :key="item.code"
                                               :label="item.value"
                                               :value="item.code"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="缩略图宽度(px)" prop="thumbnailWidth" ref="thumbnailWidthField" v-show="setting.thumbnailEnable == 1" :rules="setting.thumbnailEnable == 0 ? [] : settingRules.thumbnailWidth">
                                <el-input v-model.trim="setting.thumbnailWidth" maxlength="4"></el-input>
                            </el-form-item>
                        </el-col>
                        <!--<el-col :span="12">
                            <el-form-item label="缩略图高度(px)" prop="thumbnailHeight" ref="thumbnailHeightField" v-show="setting.thumbnailEnable == 1" :rules="setting.thumbnailEnable == 0 ? [] : settingRules.thumbnailHeight">
                                <el-input v-model.trim="setting.thumbnailHeight" maxlength="4"></el-input>
                            </el-form-item>
                        </el-col>-->
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="是否生成水印" prop="watermarkEnable">
                                <el-select filterable v-model.trim="setting.watermarkEnable" style="width:100%" @change="watermarkEnableChange">
                                    <el-option v-for="item in enums['YesNoEnum']"
                                               :key="item.code"
                                               :label="item.value"
                                               :value="item.code"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="水印类型" prop="watermarkType" ref="watermarkTypeField" v-show="setting.watermarkEnable == 1" :rules="setting.watermarkEnable == 0 ? [] : settingRules.watermarkType">
                                <el-select filterable v-model.trim="setting.watermarkType" style="width:100%" @change="watermarkTypeChange">
                                    <el-option label="图片" :value="1"></el-option>
                                    <!--<el-option v-for="item in enums['WaterMarkTypeEnum']"
                                               :key="item.code"
                                               :label="item.value"
                                               :value="item.code"></el-option>-->
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="水印宽度(px)" prop="watermarkWidth" ref="watermarkWidthField" v-show="setting.watermarkEnable == 1 && setting.watermarkType == 1" :rules="setting.watermarkEnable == 0 || setting.watermarkType == 2 ? [] : settingRules.watermarkWidth">
                                <el-input v-model.trim="setting.watermarkWidth" maxlength="4"></el-input>
                            </el-form-item>
                        </el-col>
                        <!--<el-col :span="12">
                            <el-form-item label="水印高度(px)" prop="watermarkHeight" ref="watermarkHeightField" v-show="setting.watermarkEnable == 1" :rules="setting.watermarkEnable == 0 ? [] : settingRules.watermarkHeight">
                                <el-input v-model.trim="setting.watermarkHeight" maxlength="4"></el-input>
                            </el-form-item>
                        </el-col>-->
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="水印透明度(px)" prop="watermarkTransparency" ref="watermarkTransparencyField" v-show="setting.watermarkEnable == 1 && setting.watermarkType == 1" :rules="setting.watermarkEnable == 0 || setting.watermarkType == 2 ? [] : settingRules.watermarkTransparency">
                                <el-slider v-model.trim="setting.watermarkTransparency" :min="0" :max="100" :step="1" show-input/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="水印图片" prop="watermarkUrl" ref="watermarkUrlField" v-show="setting.watermarkEnable == 1 && setting.watermarkType == 1" :rules="setting.watermarkEnable == 0 || setting.watermarkType == 2 ? [] : settingRules.watermarkUrl">
                                <el-upload name="file"
                                           class="avatar-uploader"
                                           :action="imageUploadUrl"
                                           :data="imageUploadData"
                                           accept="image/jpg,image/jpeg,image/png,image/bpm"
                                           :show-file-list="false"
                                           :on-success="watermarkUrlUploadSuccess"
                                           :on-error="handlerImagesError"
                                           :before-upload="beforeImageUpload">
                                    <img v-if="setting.watermarkUrl" :src="imageShowUrl + setting.watermarkUrl" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="水印文字" prop="watermarkWord" ref="watermarkWordField" v-show="setting.watermarkEnable == 1 && setting.watermarkType == 2" :rules="setting.watermarkEnable == 0 || setting.watermarkType == 1 ? [] : settingRules.watermarkWord">
                                <el-input v-model.trim="setting.watermarkWord" maxlength="50"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="文字大小" prop="watermarkPointSize" ref="watermarkPointSizeField" v-show="setting.watermarkEnable == 1 && setting.watermarkType == 2" :rules="setting.watermarkEnable == 0 || setting.watermarkType == 1 ? [] : settingRules.watermarkPointSize">
                                <el-input v-model.trim="setting.watermarkPointSize" maxlength="2"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="文字颜色" prop="watermarkFillColor" ref="watermarkFillColorField" v-show="setting.watermarkEnable == 1 && setting.watermarkType == 2" :rules="setting.watermarkEnable == 0 || setting.watermarkType == 1 ? [] : settingRules.watermarkFillColor">
                                <el-color-picker v-model="setting.watermarkFillColor"></el-color-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="水印位置" prop="watermarkPosition" ref="watermarkPositionField" v-show="setting.watermarkEnable == 1" :rules="setting.watermarkEnable == 0 ? [] : settingRules.watermarkPosition">
                                <div>
                                    <el-radio v-model.trim="setting.watermarkPosition" label="northwest" border>左上</el-radio>
                                    <el-radio v-model.trim="setting.watermarkPosition" label="north" border>上边</el-radio>
                                    <el-radio v-model.trim="setting.watermarkPosition" label="northeast" border>右上</el-radio>
                                </div>
                                <div style="margin-top: 10px">
                                    <el-radio v-model.trim="setting.watermarkPosition" label="west" border>左边</el-radio>
                                    <el-radio v-model.trim="setting.watermarkPosition" label="center" border>中间</el-radio>
                                    <el-radio v-model.trim="setting.watermarkPosition" label="east" border>右边</el-radio>
                                </div>
                                <div style="margin-top: 10px">
                                    <el-radio v-model.trim="setting.watermarkPosition" label="southwest" border>左下</el-radio>
                                    <el-radio v-model.trim="setting.watermarkPosition" label="south" border>下边</el-radio>
                                    <el-radio v-model.trim="setting.watermarkPosition" label="southeast" border>右下</el-radio>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="ICO图片" prop="icoUrl">
                                <el-upload name="file"
                                           class="avatar-uploader"
                                           :action="imageUploadUrl"
                                           :data="imageUploadData"
                                           accept="image/jpg,image/jpeg,image/png"
                                           :show-file-list="false"
                                           :on-success="icoUrlUploadSuccess"
                                           :on-error="handlerImagesError"
                                           :before-upload="beforeImageUpload">
                                    <img v-if="setting.icoUrl" :src="imageShowUrl + setting.icoUrl" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model.trim="setting.remark" :rows="3" maxlength="400"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doSettingCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doSettingUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeSettingDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>


            <!--域名管理 列表-->
            <el-dialog :title="titleDomain" :visible.sync="dialogDomainVisible" :close-on-click-modal="closeOnClickModal" @close="closeDomainDialog">
                <div class="deyatech-menu">
                    <div class="deyatech-menu_left">
                        <el-button v-if="btnEnable.domainCreate" type="primary" :size="btnSize" @click="btnDomainCreate">{{$t('table.create')}}</el-button>
                        <el-button v-if="btnEnable.domainUpdate" type="primary" :size="btnSize" @click="btnDomainUpdate" :disabled="domainSelectedRows.length != 1">{{$t('table.update')}}</el-button>
                        <el-button v-if="btnEnable.domainDelete" type="danger" :size="btnSize" @click="btnDomainDelete" :disabled="domainSelectedRows.length < 1 || domainDisableDelete">{{$t('table.delete')}}</el-button>

                        <el-input :size="searchSize" placeholder="请输入域名" v-model.trim="domainListQuery.name" clearable style="width: 300px;margin-left: 10px;margin-right:10px;"></el-input>
                        <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="searchDomainList">{{$t('table.search')}}</el-button>
                        <el-button icon="el-icon-delete" :size="searchSize" @click="domainResetSearch">{{$t('table.clear')}}</el-button>
                    </div>
                    <div class="deyatech-menu_right">
                        <el-button icon="el-icon-refresh" :size="btnSize" circle @click="domainReloadList"></el-button>
                    </div>
                </div>
                <el-table :data="domainList" v-loading.body="domainListLoading" stripe border highlight-current-row
                          @selection-change="domainHandleSelectionChange">
                    <el-table-column type="selection" width="50" align="center"/>
                    <el-table-column align="left" label="域名" prop="name">
                        <template slot-scope="scope">
                            <span class="link-type" @click='btnDomainUpdate(scope.row)'>{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="端口" prop="port" width="90"/>
                    <el-table-column align="center" label="排序号" prop="sortNo" width="90"/>
                    <el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                                {{scope.row.enable == 1 ? "启用" : (scope.row.enable == 0 ? "停用" : "") }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="200">
                        <template slot-scope="scope">
                            <el-button v-if="btnEnable.domainUpdate" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                                       @click.stop="btnDomainUpdate(scope.row)"></el-button>
                            <el-button v-if="btnEnable.domainDelete" :title="$t('table.delete')" type="danger" icon="el-icon-delete" :size="btnSize" circle :disabled="scope.row.enable == 1"
                                       @click.stop="btnDomainDelete(scope.row)"></el-button>
                            <el-button v-if="scope.row.enable == 1" title="停用" type="warning" icon="el-icon-close" :size="btnSize" circle
                                       @click.stop="btnDomainCtrl(scope.row, 'stop')"></el-button>
                            <el-button v-else-if="scope.row.enable == 0" title="启用" type="warning" icon="el-icon-caret-right" :size="btnSize" circle
                                       @click.stop="btnDomainCtrl(scope.row, 'run')"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination class="deyatech-pagination pull-right" background
                               :current-page.sync="domainListQuery.page" :page-sizes="this.$store.state.common.pageSize"
                               :page-size="domainListQuery.size" :layout="this.$store.state.common.pageLayout" :total="domainTotal"
                               @size-change="domainHandleSizeChange" @current-change="domainHandleCurrentChange">
                </el-pagination>
            </el-dialog>


            <!--域名管理 表单-->
            <el-dialog :title="titleMap[domainFormDialogTitle]" :visible.sync="domainFormDialogVisible" :close-on-click-modal="closeOnClickModal" @close="closeDomainFormDialog">
                <el-form ref="domainDialogForm" class="deyatech-form" :model="domain" label-position="right" label-width="80px" :rules="domainRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="所属站点" prop="stationGroupId">
                                <el-input :value="stationGroup.name" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="域名" prop="name">
                                <el-input v-model.trim="domain.name" maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="端口" prop="port">
                                <el-input v-model.trim="domain.port" maxlength="5"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="排序号" prop="sortNo">
                                <el-input v-model.trim="domain.sortNo" maxlength="3"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="描述" prop="description">
                                <el-input v-model.trim="domain.description" :rows="3" maxlength="100"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')">
                                <el-input type="textarea" v-model.trim="domain.remark" :rows="3" maxlength="400"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="domainFormDialogTitle=='create'" type="primary" :size="btnSize" @click="doDomainCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doDomainUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeDomainFormDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>

            <!-- 关联角色 -->
            <el-dialog :title="titleDomain" :visible.sync="dialogStationGroupRoleVisible" :close-on-click-modal="closeOnClickModal" @close="closeStationGroupRoleDialog">
                <div v-loading="dialogStationGroupRoleLoading">
                    <div class="dialog-search">
                        <el-checkbox v-model.trim="showRelatedFlag" @change="handleShowRelated">只显示已关联角色</el-checkbox>
                    </div>
                    <div>
                        <el-table ref="stationGroupRoleTable" :data="roleList" border @select="selectRowRole"
                                  @select-all="selectAllRole" @selection-change="handleSelectionChangeStationGroupRole">
                            <el-table-column type="selection" width="50" align="center"></el-table-column>
                            <el-table-column prop="name" label="角色名称"></el-table-column>
                        </el-table>
                        <el-pagination class="deyatech-pagination pull-right" background
                                       :current-page.sync="roleListQuery.page" :page-sizes="this.$store.state.common.pageSize"
                                       :page-size="roleListQuery.size" :layout="this.$store.state.common.pageLayout" :total="roleTotal"
                                       @size-change="handleSizeChangeStationGroupRole" @current-change="handleCurrentChangeStationGroupRole">
                        </el-pagination>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" :size="btnSize" @click="doSaveStationGroupRole"
                               :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeStationGroupRoleDialog">{{$t('table.cancel')}}</el-button>
                </div>
            </el-dialog>


            <!--关联用户-->
            <el-dialog width="70%" :title="titleMap['associateUser']" :visible.sync="dialogStationGroupUserVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeStationGroupUserDialog">
                <el-row :span="24">
                    <el-col :span="11" style="margin-bottom: 0;">
                        <el-row :gutter="20" :span="24" style=" padding-right: 5px;">
                            <el-col :span="10">
                                <el-select filterable v-model.trim="associateAdmin"
                                           @change="associateChange" clearable
                                           placeholder="管理员" :size="btnSize" style="width: 100%">
                                    <el-option label="是" :value="1"></el-option>
                                    <el-option label="否" :value="2"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="14">
                                <el-input v-model="associateUserName"
                                          @change="associateChange" clearable
                                          placeholder="姓名" :size="btnSize" style="width: 100%;"></el-input>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" :span="24" style=" padding-right: 5px;">
                            <el-col :span="24">
                                <el-cascader filterable :options="departmentCascader"
                                             v-model.trim="associateDepartmentTreePosition"
                                             @change="associateChange" clearable
                                             placeholder="部门" :size="btnSize" style="width: 100%"></el-cascader>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="2"></el-col>
                    <el-col :span="11"><span style="display: inline-block; margin-top: 55px; font-weight: bold;">已关联用户列表</span></el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="11">
                        <!--左侧-->
                        <el-table :data="leftUserList"
                                  @selection-change="leftSelectionChange"
                                  :default-sort = "{prop: 'userTreePositionId', order: 'ascending'}"
                                  border height="500" style="margin-top: 2px; margin-bottom: 10px;">
                            <el-table-column type="selection" width="55"/>
                            <el-table-column prop="name" label="姓名" width="180"/>
                            <el-table-column prop="userTreePositionName" label="部门层级" />
                        </el-table>
                    </el-col>

                    <el-col :span="2">
                        <div style="margin-top: 210px; margin-bottom: 10px; text-align: center;">
                            <el-button type="primary" icon="el-icon-arrow-right" circle
                                       @click="moveToRight"
                                       :disabled="this.leftSelectedRows.length == 0"></el-button>
                        </div>
                        <div style="text-align: center;">
                            <el-button type="primary" icon="el-icon-arrow-left" circle
                                       @click="moveToLeft"
                                       :disabled="this.rightSelectedRows.length == 0"></el-button>
                        </div>
                    </el-col>

                    <el-col :span="11">
                        <!--右侧-->
                        <el-table :data="rightUserList"
                                  @selection-change="rightSelectionChange"
                                  :default-sort = "{prop: 'userTreePositionId', order: 'ascending'}"
                                  border height="500" style="margin-top: 2px; margin-bottom: 10px;">
                            <el-table-column type="selection" width="55" :selectable="getSelectable"/>
                            <el-table-column prop="name" label="姓名" width="180"/>
                            <el-table-column prop="userTreePositionName" label="部门层级" />
                        </el-table>
                    </el-col>
                </el-row>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" :size="btnSize" @click="doSaveStationGroupUser"
                               :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeStationGroupUserDialog">{{$t('table.cancel')}}</el-button>
                </div>
            </el-dialog>

        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {
        getNextSortNo,
        getStationGroupList,
        createOrUpdateStationGroup,
        delStationGroups,
        isNameExist,
        isEnglishNameExist,
        isAbbreviationExist,
        runOrStopStationById,
        getLoginUserStationCascader
    } from '@/api/resource/stationGroup';
    import {getStationGroupClassificationCascader} from '@/api/resource/stationGroupClassification';
    import {isEnglish} from '@/util/validate';
    import {
        getSettingByStationGroupId,
        createOrUpdateSetting
    } from '@/api/resource/setting';
    import {
        getDomainNextSortNo,
        getDomainList,
        createOrUpdateDomain,
        delDomains,
        isDomainNameExist,
        isDomainEnglishNameExist,
        runOrStopDomainById
    } from '@/api/resource/domain';
    import {getDepartmentCascader} from '@/api/admin/department';
    import {getAllRoleStationGroup,getStationGroupRoleList,setStationGroupRoles} from "@/api/resource/stationGroupRole";
    import {getDictionaryList} from '@/api/admin/dictionary';
    import {getStationGroupUser, setStationGroupUsers} from "@/api/resource/stationGroupUser";

    export default {
        name: 'stationGroup',
        data() {
            const checkName = (rule, value, callback) => {
                isNameExist({
                    id: this.stationGroup.id,
                    classificationId: this.stationGroup.stationGroupClassificationId,
                    name: this.stationGroup.name}).then(response => {
                    if (response.status == 200 && response.data) {
                        callback(new Error(response.message));
                    } else {
                        callback();
                    }
                }).catch(() => {});
            };
            const checkEnglishName = (rule, value, callback) => {
                if (!isEnglish(value)) {
                    callback(new Error('只能输入英文字母'));
                    return;
                }
                isEnglishNameExist({
                    id: this.stationGroup.id,
                    classificationId: this.stationGroup.stationGroupClassificationId,
                    englishName: this.stationGroup.englishName}).then(response => {
                    if (response.status == 200 && response.data) {
                        callback(new Error(response.message));
                    } else {
                        callback();
                    }
                }).catch(() => {});
            };
            const checkAbbreviation = (rule, value, callback) => {
                if (!value) {
                    callback();
                    return;
                }
                isAbbreviationExist({
                    id: this.stationGroup.id,
                    classificationId: this.stationGroup.stationGroupClassificationId,
                    abbreviation: this.stationGroup.abbreviation}).then(response => {
                    if (response.status == 200 && response.data) {
                        callback(new Error(response.message));
                    } else {
                        callback();
                    }
                }).catch(() => {});
            };
            const checkNumber = (rule, value, callback) => {
                if (!value) {
                    callback();
                    return;
                }
                if (/[^\d]/g.test(value)) {
                    callback(new Error('请输入正整数'));
                } else {
                    callback();
                }
            };
            // 域名管理
            const checkDomainName = (rule, value, callback) => {
                // 匹配中文 \u4e00-\u9fa5
                if (/^[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/.test(value)) {
                    isDomainNameExist({
                        id: this.domain.id,
                        name: this.domain.name}).then(response => {
                        if (response.status == 200 && response.data) {
                            callback(new Error(response.message));
                        } else {
                            callback();
                        }
                    }).catch(() => {});
                } else {
                    callback(new Error("域名格式不正确"));
                }
            };
            const checkDomainEnglishName = (rule, value, callback) => {
                if (!isEnglish(value)) {
                    callback(new Error('只能输入英文字母'));
                    return;
                }
                isDomainEnglishNameExist({
                    id: this.domain.id,
                    englishName: this.domain.englishName}).then(response => {
                    if (response.status == 200 && response.data) {
                        callback(new Error(response.message));
                    } else {
                        callback();
                    }
                }).catch(() => {});
            };
            const checkDomainPort = (rule, value, callback) => {
                if (/[^\d]/g.test(value)) {
                    callback(new Error('请输入正整数'));
                } else {
                    callback();
                }
            };
            const checkSortNo = (rule, value, callback) => {
                if (!value) {
                    callback();
                    return;
                }
                if (/[^\d]/g.test(value)) {
                    callback(new Error('请输入正整数'));
                } else {
                    callback();
                }
            };
            return {
                stationGroupList: undefined,
                total: undefined,
                listLoading: false,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined,
                    stationGroupClassificationTreePosition: undefined,
                    stationGroupClassificationId: undefined,
                    departmentId: undefined,
                    departmentTreePosition: undefined
                },
                stationGroup: {
                    id: undefined,
                    name: undefined,
                    englishName: undefined,
                    abbreviation: undefined,
                    description: undefined,
                    sortNo: undefined,
                    stationGroupClassificationId: undefined,
                    stationGroupClassificationTreePosition: undefined,
                    departmentId: undefined,
                    departmentTreePosition: undefined,
                    siteCode: undefined,
                    icpCode: undefined,
                    policeCode: undefined
                },
                stationGroupRules: {
                    stationGroupClassificationId: [
                        {required: true, message: this.$t("table.pleaseSelect") + '分类'}
                    ],
                    departmentId: [
                        {required: true, message: this.$t("table.pleaseSelect") + '部门'}
                    ],
                    name: [
                        {required: true, message: this.$t("table.pleaseInput") + '名称'},
                        {validator: checkName, trigger: 'blur'}
                    ],
                    englishName: [
                        {required: true, message: this.$t("table.pleaseInput") + '英文名称'},
                        {validator: checkEnglishName, trigger: 'blur'}
                    ],
                    abbreviation: [
                        {validator: checkAbbreviation, trigger: 'blur'}
                    ],
                    sortNo: [
                        {validator: checkNumber, trigger: ['blur','change']}
                    ]
                },
                departmentCascader: [],
                selectedRows: [],
                disableDelete: false,
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                stationGroupClassificationCascader: [],
                setting: {
                    id: undefined,
                    stationGroupName: undefined,
                    stationGroupId: undefined,
                    uploadFileType: undefined,
                    uploadFileSize: undefined,
                    thumbnailEnable: 1,
                    thumbnailWidth: undefined,
                    thumbnailHeight: undefined,
                    watermarkEnable: 1,
                    watermarkType: 1,
                    watermarkWidth: undefined,
                    watermarkHeight: undefined,
                    watermarkTransparency: undefined,
                    watermarkUrl: undefined,
                    watermarkWord: undefined,
                    watermarkPointSize: undefined,
                    watermarkFillColor: '#409EFF',
                    watermarkPosition: undefined,
                    icoUrl: undefined
                },
                settingRules: {
                    stationGroupId: [
                        {required: true, message: this.$t("table.pleaseInput") + '站点'}
                    ],
                    uploadFileType: [
                        {required: true, message: this.$t("table.pleaseSelect") + '允许上传的附件类型'}
                    ],
                    uploadFileSize: [
                        {required: true, message: this.$t("table.pleaseInput") + '允许上传文件大小'},
                        {validator: checkNumber, trigger: ['blur','change']}
                    ],
                    thumbnailEnable: [
                        {required: true, message: this.$t("table.pleaseSelect") + '是否生成缩略图'}
                    ],
                    thumbnailWidth: [
                        {required: true, message: this.$t("table.pleaseInput") + '缩略图宽度'},
                        {validator: checkNumber, trigger: ['blur','change']}
                    ],
                    thumbnailHeight: [
                        {required: true, message: this.$t("table.pleaseInput") + '缩略图高度'},
                        {validator: checkNumber, trigger: ['blur','change']}
                    ],
                    watermarkEnable: [
                        {required: true, message: this.$t("table.pleaseSelect") + '是否生成水印'}
                    ],
                    watermarkType: [
                        {required: true, message: this.$t("table.pleaseInput") + '水印类型'}
                    ],
                    watermarkWidth: [
                        {required: true, message: this.$t("table.pleaseInput") + '水印高度'},
                        {validator: checkNumber, trigger: ['blur','change']}
                    ],
                    watermarkHeight: [
                        {required: true, message: this.$t("table.pleaseInput") + '水印宽度'},
                        {validator: checkNumber, trigger: ['blur','change']}
                    ],
                    watermarkTransparency: [
                        {required: true, message: this.$t("table.pleaseInput") + '水印透明度'}
                    ],
                    watermarkUrl: [
                        {required: true, message: this.$t("table.pleaseSelect") + '水印图片'}
                    ],
                    watermarkWord: [
                        {required: true, message: this.$t("table.pleaseInput") + '水印文字'}
                    ],
                    watermarkPointSize: [
                        {required: true, message: this.$t("table.pleaseInput") + '文字大小'},
                        {validator: checkNumber, trigger: ['blur','change']}
                    ],
                    watermarkFillColor: [
                        {required: true, message: this.$t("table.pleaseInput") + '文字颜色'}
                    ],
                    watermarkPosition: [
                        {required: true, message: this.$t("table.pleaseSelect") + '水印位置'}
                    ],
                    icoUrl: [
                        {required: true, message: this.$t("table.pleaseSelect") + 'ICO图片'}
                    ]
                },
                dialogSettingVisible: false,
                uploadFileTypeArray: [],

                titleSetting: undefined,

                // 域名管理
                titleDomain: undefined,
                dialogDomainVisible: false,
                domainDisableDelete: false,
                domainList: undefined,
                domainTotal: undefined,
                domainListLoading: true,
                domainListQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined,
                    stationGroupId: undefined
                },
                domain: {
                    id: undefined,
                    name: undefined,
                    englishName: undefined,
                    description: undefined,
                    sortNo: undefined,
                    stationGroupId: undefined,
                    port: 80
                },
                domainRules: {
                    name: [
                        {required: true, message: this.$t("table.pleaseInput") + '域名名称'},
                        {validator: checkDomainName, trigger: 'blur'}
                    ],
                    sortNo: [
                        {validator: checkSortNo, trigger: ['blur','change']}
                    ],
                    stationGroupId: [
                        {required: true, message: this.$t("table.pleaseInput") + '所属站点'}
                    ],
                    port: [
                        {required: true, message: this.$t("table.pleaseInput") + '端口'},
                        {validator: checkDomainPort, trigger: ['blur','change']}
                    ]
                },
                domainSelectedRows: [],
                domainFormDialogVisible: false,
                domainFormDialogTitle: undefined,
                imageShowUrl: undefined,
                imageUploadUrl: undefined,
                imageUploadData: undefined,

                // 站点关联角色
                roleList: undefined,
                roleTotal: undefined,
                dialogStationGroupRoleVisible: false,
                showRelatedFlag: false,
                selectAllRoleId: [],
                selectedRowsRole: undefined,
                roleListQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    stationGroupId: undefined
                },
                dialogStationGroupRoleLoading: false,
                uploadFileTypeList: [],


                // 关联用户
                dialogStationGroupUserVisible: false,
                dialogFormLoading: false,
                // 左侧
                originalLeftUserList: [],
                leftUserList: [],
                leftSelectedRows: [],
                // 右侧
                rightUserList: [],
                rightSelectedRows: [],
                associateAdmin: undefined,
                associateUserName: undefined,
                associateDepartmentTreePosition: []
            }
        },
        computed: {
            selecteDepartmentPosition: {
                get() {
                    if (this.department.treePosition) {
                        return this.department.treePosition.substr(1).split('&')
                    }
                },
                set(v) {
                    if (v.length > 0) {
                        this.department.parentId = v[v.length - 1];
                        this.department.treePosition = '&' + v.join('&');
                    } else {
                        this.department.parentId = 0;
                        this.department.treePosition = undefined;
                    }
                }
            },
            ...mapGetters([
                'permission',
                'titleMap',
                'enums',
                'closeOnClickModal',
                'searchSize',
                'btnSize'
            ]),
            stationGroupClassificationTreePosition: {
                get() {
                    if (this.stationGroup.stationGroupClassificationTreePosition) {
                        return this.stationGroup.stationGroupClassificationTreePosition.substr(1).split('&')
                    }
                },
                set(v) {
                    if (v && v.length > 0) {
                        this.stationGroup.stationGroupClassificationId = v[v.length - 1];
                        this.stationGroup.stationGroupClassificationTreePosition = '&' + v.join('&');
                    } else {
                        this.stationGroup.stationGroupClassificationId = undefined;
                        this.stationGroup.stationGroupClassificationTreePosition = undefined;
                    }
                }
            },
            listQueryDepartmentTreePosition: {
                get() {
                    if (this.listQuery.departmentTreePosition) {
                        return this.listQuery.departmentTreePosition.substr(1).split('&')
                    }

                },
                set(v) {
                    if (v && v.length > 0) {
                        this.listQuery.departmentId = v[v.length - 1];
                        this.listQuery.departmentTreePosition = '&' + v.join('&');
                    } else {
                        this.listQuery.departmentId = undefined;
                        this.listQuery.departmentTreePosition = undefined;
                    }
                }
            },
            formDepartmentTreePosition: {
                get() {
                    if (this.stationGroup.departmentTreePosition) {
                        return this.stationGroup.departmentTreePosition.substr(1).split('&')
                    }
                },
                set(v) {
                    if (v && v.length > 0) {
                        this.stationGroup.departmentId = v[v.length - 1];
                        this.stationGroup.departmentTreePosition = '&' + v.join('&');
                    } else {
                        this.stationGroup.departmentId = undefined;
                        this.stationGroup.departmentTreePosition = undefined;
                    }
                }
            },
            btnEnable() {
                return {
                    create: this.permission.station_group_create,
                    update: this.permission.station_group_update,
                    delete: this.permission.station_group_delete,
                    ctrl: this.permission.station_group_ctrl,
                    setting: this.permission.station_group_setting,
                    user: this.permission.station_group_user,
                    domain: this.permission.station_group_domain,
                    domainCreate: this.permission.station_group_domain_create,
                    domainUpdate: this.permission.station_group_domain_update,
                    domainDelete: this.permission.station_group_domain_delete
                };
            }
        },
        created(){
            this.$store.state.common.selectSiteDisplay = false;
            this.getStationGroupClassificationCascader(null);
            this.getDepartmentCascader();
            this.getUploadFileType();
        },
        methods: {
            getDepartmentCascader() {
                this.submitLoading = true;
                getDepartmentCascader().then(response => {
                    this.departmentCascader = response.data;
                })
            },
            loadSetting(stationGroupId) {
                return new Promise((resolve, reject) => {
                    getSettingByStationGroupId(stationGroupId).then(response=>{
                        resolve(response);
                    }).catch(error=>{
                        reject(error);
                    });
                });
            },
            getStationGroupClassificationCascader(id) {
                this.submitLoading = true;
                getStationGroupClassificationCascader(id).then(response => {
                    this.submitLoading = false;
                    this.stationGroupClassificationCascader = response.data;
                    if (this.stationGroupClassificationCascader && this.stationGroupClassificationCascader.length > 0) {
                        let defaultSelect = this.getDefaultClassificationNode(this.stationGroupClassificationCascader[0]);
                        if (defaultSelect) {
                            this.listQuery.stationGroupClassificationId = defaultSelect.value;
                            this.listQuery.stationGroupClassificationTreePosition = defaultSelect.treePosition + '&' + defaultSelect.value;
                            this.reloadList();
                            this.$nextTick(()=>{
                                this.$refs['stationGroupClassificationTree'].setCurrentKey(this.listQuery.stationGroupClassificationId);
                            });
                        }
                    }
                });
            },
            getDefaultClassificationNode(v) {
                if (v.children && v.children.length > 0) {
                    return this.getDefaultClassificationNode(v.children[0]);
                } else {
                    return v;
                }
            },
            handleStationGroupClassificationNodeClick(data) {
                if (data.children && data.children.length > 0) {
                    if (this.listQuery.stationGroupClassificationId) {
                        this.$refs['stationGroupClassificationTree'].setCurrentKey(this.listQuery.stationGroupClassificationId);
                    } else {
                        this.$refs['stationGroupClassificationTree'].setCurrentKey(null);
                    }
                    return;
                }
                this.listQuery.stationGroupClassificationId = data.value;
                if (data.treePosition) {
                    this.listQuery.stationGroupClassificationTreePosition = data.treePosition + '&' + data.value;
                } else {
                    this.listQuery.stationGroupClassificationTreePosition = '&' + data.value;
                }
                this.resetSearch();
                this.handleCurrentChange(1);
            },
            resetSearch(){
                this.listQueryDepartmentTreePosition = [];
                this.listQuery.name = undefined;
            },
            searchList(){
                this.listQuery.page = 1;
                this.reloadList();
            },
            reloadList(){
                this.listLoading = true;
                this.stationGroupList = undefined;
                getStationGroupList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.stationGroupList = response.data.records;
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
                this.disableDelete = false;
                if (this.selectedRows && this.selectedRows.length > 0) {
                    for (let r of rows) {
                        if (r.enable == 1) {
                            this.disableDelete = true;
                            break;
                        }
                    }
                } else {
                    this.disableDelete = false;
                }
            },
            btnCreate(){
                this.resetStationGroup();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
                this.stationGroup.stationGroupClassificationId = this.listQuery.stationGroupClassificationId;
                this.stationGroup.stationGroupClassificationTreePosition = this.listQuery.stationGroupClassificationTreePosition;
                getNextSortNo().then(response=> {
                    this.$nextTick(()=>{
                        this.stationGroup.sortNo = response.data;
                    });
                });
            },
            btnUpdate(row){
                this.resetStationGroup();
                if (row.id) {
                    this.stationGroup = deepClone(row);
                } else {
                    this.stationGroup = deepClone(this.selectedRows[0]);
                }
                if (this.stationGroup.stationGroupClassificationTreePosition) {
                    this.stationGroup.stationGroupClassificationTreePosition += '&' + this.stationGroup.stationGroupClassificationId;
                } else {
                    this.stationGroup.stationGroupClassificationTreePosition = '&' + this.stationGroup.stationGroupClassificationId;
                }
                console.log(this.stationGroup.stationGroupClassificationTreePosition);
                this.stationGroup.departmentTreePosition += '&' + this.stationGroup.departmentId;
                this.dialogTitle = 'update';
                this.dialogVisible = true;
            },
            btnCtrl(row, flag){
                let msg = flag === 'run' ? "启用" : "停用";
                runOrStopStationById({
                    id: row.id,
                    flag: flag
                }).then(() => {
                    this.reloadList();
                    this.$message.success(msg + "操作成功");
                })
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
                        for(const deleteRow of this.selectedRows) {
                            ids.push(deleteRow.id);
                        }
                        this.doDelete(ids);
                    })
                }
            },
            doCreate(){
                this.$refs['stationGroupDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        if (!this.stationGroup.sortNo) {
                            this.stationGroup.sortNo = 1;
                        }
                        createOrUpdateStationGroup(this.stationGroup).then((response) => {
                            if (response.status == 200) {
                                this.getAllStationGroup();
                                this.resetStationGroupDialogAndList();
                                this.$message.success(this.$t("table.createSuccess"));
                            } else {
                                this.submitLoading = false;
                                this.$message.error(response.message);
                            }
                        }).catch(error => {
                            this.submitLoading = false;
                            this.$message.error(error);
                        });
                    } else {
                        return false;
                    }
                });
            },
            doUpdate(){
                this.$refs['stationGroupDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        if (!this.stationGroup.sortNo) {
                            this.stationGroup.sortNo = 1;
                        }
                        createOrUpdateStationGroup(this.stationGroup).then(() => {
                            this.getAllStationGroup();
                            this.resetStationGroupDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids){
                this.listLoading = true;
                delStationGroups(ids).then((response) => {
                    if (response.status == 200 && response.data) {
                        this.getAllStationGroup();
                        this.reloadList();
                        this.$message.success(this.$t("table.deleteSuccess"));
                    } else {
                        this.listLoading = false;
                        this.$message.error(response.message)
                    }
                }).catch(error => {
                    this.listLoading = false;
                    this.$message.error(error);
                });
            },
            //自动填充站点下拉狂开始
            getAllStationGroup(){
                this.$store.state.common.topSelectStatinoGroupList = [];
                getLoginUserStationCascader().then(response => {
                    this.$store.state.common.topSelectStatinoGroupList = response.data;
                    if(this.$store.state.common.topSelectStatinoGroupList.length > 0){
                        let v = [];
                        this.getDefault(v, this.$store.state.common.topSelectStatinoGroupList);
                        this.$store.state.common.topSelectStationGroupTreePosition = v;
                        if (v.length > 0) {
                            this.$store.state.common.siteId = v[v.length - 1];
                            this.$store.state.common.siteName = this.currentLabels(v);
                        }
                    }
                })
            },
            getDefault(result, list) {
                if (list) {
                    result.push(list[0].value);
                    this.getDefault(result, list[0].children);
                }
            },
            currentLabels(v) {
                let options = this.$store.state.common.topSelectStatinoGroupList;
                let labels = [];
                v.forEach(value => {
                    const targetOption = options && options.filter(option => option['value'] === value)[0];
                    if (targetOption) {
                        labels.push(targetOption['label']);
                        options = targetOption['children'];
                    }
                });
                //labels[labels.length - 1]
                return labels.join('/');
            },
            //自动填充站点下拉狂结束
            resetStationGroup(){
                this.stationGroup.id = undefined;
                this.stationGroup.name = undefined;
                this.stationGroup.englishName = undefined;
                this.stationGroup.abbreviation = undefined;
                this.stationGroup.description = undefined;
                this.stationGroup.sortNo = undefined;
                this.stationGroup.stationGroupClassificationId = undefined;
                this.stationGroup.stationGroupClassificationTreePosition = undefined;
                this.stationGroup.departmentId = undefined;
                this.stationGroup.departmentTreePosition = undefined;
                this.stationGroup.siteCode = undefined;
                this.stationGroup.icpCode = undefined;
                this.stationGroup.policeCode = undefined;
            },
            resetStationGroupDialogAndList(){
                this.closeStationGroupDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeStationGroupDialog() {
                this.dialogVisible = false;
                this.resetStationGroup();
                this.formDepartmentTreePosition = [];
                this.stationGroupClassificationTreePosition = [];
                this.$refs['stationGroupDialogForm'].resetFields();
            },
            resetSetting(){
                this.setting = {
                    id: undefined,
                    stationGroupId: undefined,
                    uploadFileType: undefined,
                    uploadFileSize: undefined,
                    thumbnailEnable: 1,
                    thumbnailWidth: undefined,
                    thumbnailHeight: undefined,
                    watermarkEnable: 1,
                    watermarkType: 1,
                    watermarkWidth: undefined,
                    watermarkHeight: undefined,
                    watermarkTransparency: undefined,
                    watermarkUrl: undefined,
                    watermarkWord: undefined,
                    watermarkFillColor: '#409EFF',
                    watermarkPosition: undefined,
                    icoUrl: undefined
                };
                this.uploadFileTypeArray = [];
            },
            btnGlobalSetting(){
                this.titleSetting = "站点全局设置";
                this.imageUploadUrl = this.$store.state.common.materialUploadUrl;
                this.imageUploadData = {siteId: '0', deal: 'no'};
                this.imageShowUrl = this.$store.state.common.materialShowImageByUrl + "?siteId=0&url=";
                this.getSetting(undefined);
            },
            btnSetting(row) {
                this.imageUploadUrl = this.$store.state.common.materialUploadUrl;
                this.imageUploadData = {siteId: row.id, deal: 'no'};
                this.imageShowUrl = this.$store.state.common.materialShowImageByUrl + "?siteId=" + row.id + "&url=";
                let stationGroupId = undefined;
                if (row.id) {
                    stationGroupId = row.id;
                    this.titleSetting = row.name;
                } else {
                    this.stationGroup = deepClone(this.selectedRows[0]);
                    stationGroupId = this.stationGroup.id;
                    this.titleSetting = this.stationGroup.name;
                }
                this.resetSetting();
                this.setting.stationGroupId = stationGroupId;
                this.getSetting(stationGroupId)
            },
            getSetting(stationGroupId) {
                this.loadSetting({stationGroupId: stationGroupId}).then(response=>{
                    if (response.status == 200 && response.data.id) {
                        this.setting = response.data;
                        if (this.setting.uploadFileType) this.uploadFileTypeArray = this.setting.uploadFileType.split(',');
                        if (typeof(this.setting.thumbnailWidth) === 'undefined') this.$set(this.setting, 'thumbnailWidth', undefined);
                        if (typeof(this.setting.thumbnailHeight) === 'undefined') this.$set(this.setting, 'thumbnailHeight', undefined);
                        if (typeof(this.setting.watermarkType) === 'undefined') this.$set(this.setting, 'watermarkType', undefined);
                        if (typeof(this.setting.watermarkWidth) === 'undefined') this.$set(this.setting, 'watermarkWidth', undefined);
                        if (typeof(this.setting.watermarkHeight) === 'undefined') this.$set(this.setting, 'watermarkHeight', undefined);
                        if (typeof(this.setting.watermarkTransparency) === 'undefined') this.$set(this.setting, 'watermarkTransparency', undefined);
                        if (typeof(this.setting.watermarkUrl) === 'undefined') this.$set(this.setting, 'watermarkUrl', undefined);
                        if (typeof(this.setting.watermarkWord) === 'undefined') this.$set(this.setting, 'watermarkWord', undefined);
                        if (typeof(this.setting.watermarkPointSize) === 'undefined') this.$set(this.setting, 'watermarkPointSize', undefined);
                        if (typeof(this.setting.watermarkFillColor) === 'undefined') this.$set(this.setting, 'watermarkFillColor', '#409EFF');
                        if (typeof(this.setting.watermarkPosition) === 'undefined') this.$set(this.setting, 'watermarkPosition', undefined);
                    }
                    this.dialogSettingVisible = true;
                }).catch(error=>{
                    this.$message.error(error);
                });
            },
            doSettingCreate(){
                this.$refs['settingDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        createOrUpdateSetting(this.setting).then(() => {
                            this.resetSettingDialogAndList();
                            this.$message.success('设置成功');
                        })
                    } else {
                        return false;
                    }
                });
            },
            doSettingUpdate(){
                this.$refs['settingDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        // 没有缩略图
                        if (this.setting.thumbnailEnable == 0) {
                            this.setting.thumbnailWidth = undefined;
                            this.setting.thumbnailHeight = undefined;
                        }
                        // 没有水印
                        if (this.setting.watermarkEnable == 0) {
                            this.setting.watermarkType = undefined;
                            this.setting.watermarkWidth = undefined;
                            this.setting.watermarkHeight = undefined;
                            this.setting.watermarkTransparency = undefined;
                            this.setting.watermarkUrl = undefined;
                            this.setting.watermarkWord = undefined;
                            this.setting.watermarkPointSize = undefined;
                            this.setting.watermarkFillColor = undefined;
                            this.setting.watermarkPosition = undefined;
                        } else {
                            // 图片
                            if (this.setting.watermarkType == 1) {
                                this.setting.watermarkWord = undefined;
                                this.setting.watermarkPointSize = undefined;
                                this.setting.watermarkFillColor = undefined;
                                // 文字
                            } else if (this.setting.watermarkType == 2) {
                                this.setting.watermarkUrl = undefined;
                                this.setting.watermarkTransparency = undefined;
                            }
                        }
                        createOrUpdateSetting(this.setting).then(() => {
                            this.resetSettingDialogAndList();
                            this.$message.success('设置成功');
                        })
                    } else {
                        return false;
                    }
                })
            },
            resetSettingDialogAndList(){
                this.closeSettingDialog();
                this.reloadList();
                this.submitLoading = false;
            },
            closeSettingDialog() {
                this.dialogSettingVisible = false;
                this.resetSetting();
                this.$refs['settingDialogForm'].resetFields();
            },
            uploadFileTypeChange(selectedType) {
                if (selectedType.length > 0) {
                    this.setting.uploadFileType = selectedType.join(',');
                } else {
                    this.setting.uploadFileType = selectedType.join(',');
                }
            },
            thumbnailEnableChange() {
                if (this.setting.thumbnailEnable == 0) {
                    this.$refs['thumbnailWidthField'].clearValidate();
                    //this.$refs['thumbnailHeightField'].clearValidate();
                    this.setting.thumbnailWidth = undefined;
                    this.setting.thumbnailHeight = undefined;
                }
            },
            watermarkEnableChange() {
                if (this.setting.watermarkEnable == 0) {
                    this.$refs['watermarkTypeField'].clearValidate();
                    this.$refs['watermarkWidthField'].clearValidate();
                    //this.$refs['watermarkHeightField'].clearValidate();
                    this.$refs['watermarkTransparencyField'].clearValidate();
                    this.$refs['watermarkUrlField'].clearValidate();
                    this.$refs['watermarkWordField'].clearValidate();
                    this.$refs['watermarkPointSizeField'].clearValidate();
                    this.$refs['watermarkFillColorField'].clearValidate();
                    this.$refs['watermarkPositionField'].clearValidate();
                    this.setting.watermarkType = undefined;
                    this.setting.watermarkWidth = undefined;
                    this.setting.watermarkHeight = undefined;
                    this.setting.watermarkTransparency = undefined;
                    this.setting.watermarkUrl = undefined;
                    this.setting.watermarkWord = undefined;
                    this.setting.watermarkPointSize = undefined;
                    this.setting.watermarkFillColor = undefined;
                    this.setting.watermarkPosition = undefined;
                } else if (this.setting.watermarkEnable == 1) {
                    if (!this.setting.watermarkType) {
                        this.setting.watermarkType = 1;
                    }
                }
            },
            watermarkTypeChange() {
                // 图片
                if (this.setting.watermarkType == 1) {
                    this.$refs['watermarkWordField'].clearValidate();
                    this.$refs['watermarkPointSizeField'].clearValidate();
                    this.$refs['watermarkFillColorField'].clearValidate();
                    this.setting.watermarkWord = undefined;
                    this.setting.watermarkPointSize = undefined;
                    this.setting.watermarkFillColor = undefined;
                    // 文字
                } else if (this.setting.watermarkType == 2) {
                    this.$refs['watermarkUrlField'].clearValidate();
                    this.$refs['watermarkTransparencyField'].clearValidate();
                    this.$refs['watermarkWidthField'].clearValidate();
                    //this.$refs['watermarkHeightField'].clearValidate();
                    this.setting.watermarkUrl = undefined;
                    this.setting.watermarkWidth = undefined;
                    this.setting.watermarkHeight = undefined;
                    this.setting.watermarkTransparency = undefined;
                }
            },
            watermarkUrlUploadSuccess(response) {
                if (response.status === 200 && response.data.state === 'SUCCESS') {
                    this.setting.watermarkUrl = response.data.url;
                    this.$message.success('上传成功！');
                } else {
                    console.error(response);
                    this.$message.error("上传失败");
                }
            },
            icoUrlUploadSuccess(response) {
                if (response.status === 200 && response.data.state === 'SUCCESS') {
                    this.setting.icoUrl = response.data.url;
                    this.$message.success('上传成功！');
                } else {
                    console.error(response);
                    this.$message.error("上传失败");
                }
            },
            handlerImagesError(err) {
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
                    this.$message.error('上传图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            // 域名管理
            btnDomain(row) {
                this.domainListQuery.page = 1;
                this.resetStationGroup();
                if (row.id) {
                    this.stationGroup = deepClone(row);
                } else {
                    this.stationGroup = deepClone(this.selectedRows[0]);
                }
                this.domainReloadList();
                this.titleDomain = '域名管理';//this.stationGroup.name
                this.dialogDomainVisible = true;
            },
            closeDomainDialog() {
                this.dialogDomainVisible = false;
            },
            domainResetSearch(){
                this.domainListQuery.name = undefined;
            },
            searchDomainList(){
                this.domainListQuery.page = 1;
                this.domainReloadList();
            },
            domainReloadList(){
                this.domainListLoading = true;
                this.domainList = undefined;
                this.domainListQuery.stationGroupId = this.stationGroup.id;
                getDomainList(this.domainListQuery).then(response => {
                    this.domainListLoading = false;
                    this.domainList = response.data.records;
                    this.domainTotal = response.data.total;
                }).catch(()=>{
                    this.domainListLoading = false;
                    this.domainTotal = 0;
                });
            },
            domainHandleSizeChange(val){
                this.domainListQuery.size = val;
                this.domainReloadList();
            },
            domainHandleCurrentChange(val){
                this.domainListQuery.page = val;
                this.domainReloadList();
            },
            domainHandleSelectionChange(rows){
                this.domainSelectedRows = rows;
                if (this.domainSelectedRows && this.domainSelectedRows.length > 0) {
                    for (let r of rows) {
                        if (r.enable == 1) {
                            this.domainDisableDelete = true;
                            break;
                        }
                    }
                } else {
                    this.domainDisableDelete = false;
                }
            },
            btnDomainCreate(){
                this.resetDomain();
                this.domainFormDialogTitle = 'create';
                this.domainFormDialogVisible = true;
                this.domain.stationGroupId = this.stationGroup.id;
                getDomainNextSortNo().then(response=> {
                    this.$nextTick(()=>{
                        this.domain.sortNo = response.data;
                    });
                });
                this.$nextTick(()=>{
                    this.$refs['domainDialogForm'].clearValidate();
                });
            },
            btnDomainUpdate(row){
                this.resetDomain();
                if (row.id) {
                    this.domain = deepClone(row);
                } else {
                    this.domain = deepClone(this.domainSelectedRows[0]);
                }
                this.domainFormDialogTitle = 'update';
                this.domainFormDialogVisible = true;
                this.$nextTick(()=>{
                    this.$refs['domainDialogForm'].clearValidate();
                });
            },
            btnDomainDelete(row){
                let ids = [];
                if (row.id) {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        ids.push(row.id);
                        this.doDomainDelete(ids);
                    })
                } else {
                    this.$confirm(this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        for(const deleteRow of this.selectedRows){
                            ids.push(deleteRow.id);
                        }
                        this.doDomainDelete(ids);
                    })
                }
            },
            btnDomainCtrl(row, flag){
                let msg = flag === 'run' ? "启用" : "停用";
                this.domainListLoading = true;
                runOrStopDomainById({
                    id: row.id,
                    flag: flag
                }).then((response) => {
                    if (response.status == 200 && response.data) {
                        this.domainReloadList();
                        this.$message.success(msg + "操作成功");
                    } else {
                        this.domainListLoading = false;
                        this.$message.error(msg + "操作失败");
                    }
                }).catch(error=>{
                    this.domainListLoading = false;
                    this.$message.error(error);
                });
            },
            doDomainCreate(){
                this.$refs['domainDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        if (!this.domain.sortNo) {
                            this.domain.sortNo = 1;
                        }
                        this.domain.englishName = this.domain.name;
                        createOrUpdateDomain(this.domain).then(() => {
                            this.resetDomainDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doDomainUpdate(){
                this.$refs['domainDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        if (!this.domain.sortNo) {
                            this.domain.sortNo = 1;
                        }
                        this.domain.englishName = this.domain.name;
                        createOrUpdateDomain(this.domain).then(() => {
                            this.resetDomainDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDomainDelete(ids){
                this.domainListLoading = true;
                delDomains(ids).then((response) => {
                    if (response.status == 200 && response.data) {
                        this.domainReloadList();
                        this.$message.success(this.$t("table.deleteSuccess"));
                    } else {
                        this.domainListLoading = false;
                        this.$message.error("域名删除失败");
                    }
                }).catch(error=>{
                    this.domainListLoading = false;
                    this.$message.error(error);
                });
            },
            resetDomain(){
                this.domain = {
                    id: undefined,
                    name: undefined,
                    description: undefined,
                    sortNo: undefined,
                    stationGroupId: undefined,
                    port: 80
                }
            },
            resetDomainDialogAndList(){
                this.closeDomainFormDialog();
                this.submitLoading = false;
                this.domainReloadList();
            },
            closeDomainFormDialog() {
                this.domainFormDialogVisible = false;
                this.resetDomain();
                this.$refs['domainDialogForm'].resetFields();
            },

            btnStationGroupRole(row){
                this.titleDomain = row.name + ' - 关联角色';
                this.dialogStationGroupRoleVisible = true;
                this.currentRow = row;
                this.loadStationGroupRole(row.id).then(res => {
                    if (res && res.length > 0) {
                        for (let stationGroupRole of res) {
                            this.selectAllRoleId.push(stationGroupRole.roleId)
                        }
                        this.showRelatedFlag = true;
                        this.handleShowRelated(true);
                    } else {
                        this.showRelatedFlag = false;
                        this.handleShowRelated(false);
                    }
                })
            },
            loadStationGroupRole(stationGroupId) {
                let query = {stationGroupId}
                return new Promise((resolve, reject) => {
                    getAllRoleStationGroup(query).then(response => {
                        resolve(response.data)
                    }).catch(err => {
                        reject(err)
                    })
                });
            },
            loadRoleList() {
                return new Promise((resolve, reject) => {
                    this.dialogStationGroupRoleLoading = true;
                    getStationGroupRoleList(this.roleListQuery).then(response => {
                        this.dialogStationGroupRoleLoading = false;
                        this.roleList = response.data.records;
                        this.roleTotal = response.data.total;
                        resolve();
                    }).catch(err => {
                        reject(err);
                    })
                });
            },
            handleShowRelated(checked) {
                if (checked) {
                    this.roleListQuery.stationGroupId = this.currentRow.id;
                } else {
                    this.roleListQuery.stationGroupId = undefined;
                }
                this.reloadRoleList();
            },
            handleSelectionChangeStationGroupRole(rows) {
                this.selectedRowsRole = rows;
            },
            selectRowRole(selection, row) {
                let i = this.selectAllRoleId.indexOf(row.roleId)
                if (i < 0) {
                    this.selectAllRoleId.push(row.roleId)
                } else {
                    this.selectAllRoleId.splice(i, 1)
                }
            },
            handleSizeChangeStationGroupRole(val) {
                this.roleListQuery.size = val;
                this.loadRoleList().then(() => {
                    this.checkRelatedRoleRows();
                });
            },
            handleCurrentChangeStationGroupRole(val) {
                this.roleListQuery.page = val;
                this.loadRoleList().then(() => {
                    this.checkRelatedRoleRows();
                });
            },
            checkRelatedRoleRows() {
                this.$nextTick(() => {
                    if (this.selectAllRoleId && this.selectAllRoleId.length > 0) {
                        for (let row of this.roleList) {
                            if (this.selectAllRoleId.includes(row.roleId)) {
                                this.$refs['stationGroupRoleTable'].toggleRowSelection(row, true)
                            }
                        }
                    }
                });
            },
            selectAllRole(selection) {
                if (selection.length > 0) {
                    for (let role of this.roleList) {
                        if (this.selectAllRoleId.indexOf(role.roleId) < 0) {
                            this.selectAllRoleId.push(role.roleId)
                        }
                    }
                } else {
                    for (let role of this.roleList) {
                        let i = this.selectAllRoleId.indexOf(role.roleId)
                        if (i >= 0) {
                            this.selectAllRoleId.splice(i, 1)
                        }
                    }
                }
            },
            doSaveStationGroupRole(){
                this.submitLoading = true;
                setStationGroupRoles(this.currentRow.id,this.selectAllRoleId).then(() => {
                    this.closeStationGroupRoleDialog();
                    this.reloadList();
                    this.$message.success(this.$t("table.updateSuccess"));
                }).catch(() => {
                    this.submitLoading = false;
                })
            },
            reloadRoleList() {
                this.handleCurrentChangeStationGroupRole(1)
            },
            closeStationGroupRoleDialog(){
                this.dialogStationGroupRoleVisible = false;
                this.submitLoading = false;
            },
            // 允许上传的附件类型
            getUploadFileType() {
                getDictionaryList({indexId: 'upload_file_type'}).then(response => {
                    if (response.status == 200) {
                        this.uploadFileTypeList = response.data;
                    } else {
                        this.$message.error('获取字典项失败')
                    }
                })
            },

            // 关联用户
            btnUser(row) {
                this.stationGroup = row;
                this.leftSelectedRows = [];
                this.rightSelectedRows = [];
                this.dialogFormLoading = true;
                getStationGroupUser(row.id, row.departmentId).then(response => {
                    this.leftUserList = response.data.unselectedUserList;
                    this.rightUserList = response.data.selectedUserList;
                    this.originalLeftUserList = deepClone(this.leftUserList);
                    this.dialogFormLoading = false;
                }).catch(err => {
                    this.leftUserList = [];
                    this.rightUserList = [];
                })
                this.dialogStationGroupUserVisible = true;
            },
            closeStationGroupUserDialog() {
                this.dialogStationGroupUserVisible = false;
                this.submitLoading = false;
                this.originalLeftUserList = [];
                this.leftUserList = [];
                this.leftSelectedRows = [];
                this.rightUserList = [];
                this.rightSelectedRows = [];
                this.associateAdmin = undefined;
                this.associateUserName = undefined;
                this.associateDepartmentTreePosition = [];
            },
            doSaveStationGroupUser() {
                this.submitLoading = true;
                let ids = [];
                if (this.rightUserList.length > 0) {
                    for (let item of this.rightUserList) {
                        ids.push(item.userId);
                    }
                }
                setStationGroupUsers(this.stationGroup.id, ids).then(() => {
                    this.closeStationGroupUserDialog();
                    this.reloadList();
                    this.$message.success(this.$t("table.updateSuccess"));
                }).catch(() => {
                    this.submitLoading = false;
                })
            },
            leftSelectionChange(rows) {
                this.leftSelectedRows = rows;
            },
            rightSelectionChange(rows) {
                this.rightSelectedRows = rows;
            },
            // 给左侧添加
            moveToLeft() {
                if (this.rightSelectedRows.length > 0) {
                    for (let item of this.rightSelectedRows) {
                        this.leftUserList.push(item);
                        this.originalLeftUserList.push(item);
                        let i = -1;
                        if (this.rightUserList && this.rightUserList.length > 0) {
                            for (let tag of this.rightUserList) {
                                i++;
                                if (tag.userId === item.userId) {
                                    break;
                                }
                            }
                            if (i > -1) {
                                this.rightUserList.splice(i, 1)
                            }
                        }
                    }
                }
                this.rightSelectedRows = [];
            },
            // 给右侧添加
            moveToRight() {
                if (this.leftSelectedRows.length > 0) {
                    for (let item of this.leftSelectedRows) {
                        this.rightUserList.push(item);
                        if (this.leftUserList && this.leftUserList.length > 0) {
                            let i = -1;
                            for (let tag of this.leftUserList) {
                                i++;
                                if (tag.userId === item.userId) {
                                    break;
                                }
                            }
                            if (i > -1) {
                                this.leftUserList.splice(i, 1);
                            }
                        }
                        if (this.originalLeftUserList && this.originalLeftUserList.length > 0) {
                            let i = -1;
                            for (let tag of this.originalLeftUserList) {
                                i++;
                                if (tag.userId === item.userId) {
                                    break;
                                }
                            }
                            if (i > -1) {
                                this.originalLeftUserList.splice(i, 1);
                            }
                        }
                    }
                }
                this.leftSelectedRows = [];
            },
            associateChange() {
                this.leftUserList = this.getFilterData();
            },
            getFilterData() {
                let origin = deepClone(this.originalLeftUserList);
                let list = [];
                for (let item of origin) {
                    if (this.associateAdmin) {
                        if (item.admin == this.associateAdmin) {
                            list.push(item);
                        }
                    } else {
                        list.push(item);
                    }
                }
                let list2 = [];
                for (let item of list) {
                    if (this.associateUserName) {
                        if (item.name.indexOf(this.associateUserName) > -1) {
                            list2.push(item);
                        }
                    } else {
                        list2.push(item);
                    }
                }
                let list3 = [];
                let departmentId = '';
                if (this.associateDepartmentTreePosition.length > 0) {
                    departmentId = this.associateDepartmentTreePosition[this.associateDepartmentTreePosition.length - 1];
                }
                console.dir(departmentId);
                for (let item of list2) {
                    if (departmentId) {
                        if (item.userTreePositionId.indexOf(departmentId) > -1) {
                            list3.push(item);
                        }
                    } else {
                        list3.push(item);
                    }
                }
                return list3;
            },
            getSelectable(row) {
                console.log(row.selectable)
                return row.selectable;
            }
        }
    }
</script>


<style>

    .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
        background-color: #a6d1ff;
    }

    .classificationTree {
        border:1px solid #eceef5;
        overflow-x: scroll;
        margin-right:10px;
        padding: 10px;
        height: 100%;
    }

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
