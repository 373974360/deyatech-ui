<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-menu">
                <div class="deyatech-menu_left">
                    <el-button v-if="btnEnable.create" type="primary" :size="btnSize" @click="btnCreate" :disabled="selectedRows.length > 1 || templateCount > 0">{{$t('table.create')}}</el-button>
                    <el-button v-if="btnEnable.update" type="primary" :size="btnSize" @click="btnUpdate" :disabled="selectedRows.length != 1">{{$t('table.update')}}</el-button>
                    <el-button v-if="btnEnable.delete" type="danger" :size="btnSize" @click="btnDelete" :disabled="selectedRows.length < 1 || templateCount > 0">{{$t('table.delete')}}</el-button>
                </div>
                <div class="deyatech-menu_right">
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                </div>
            </div>
        </div>

        <el-table :data="catalogList" v-loading.body="listLoading" stripe border highlight-current-row
                  @selection-change="handleSelectionChange" v-if="tableReset">
            <el-table-column type="selection" width="50" align="center"/>


            <el-table-column align="center"
                             v-for="item in frontTreeHeadData"
                             :label="item.label"
                             :prop="item.prop">
                <template slot-scope="scope">
                    <el-checkbox v-if="item.prop == 'allowHidden'" v-model="scope.row.allowHidden" :true-label="1" :false-label="0" @change="allowHiddenChange(scope.row)"/>
                    <el-checkbox v-else-if="item.prop == 'placeOnFile'" v-model="scope.row.placeOnFile" :true-label="1" :false-label="0" @change="placeOnFileChange(scope.row)"/>
                    <span v-else>{{scope.row[item.prop]}}</span>
                </template>
            </el-table-column>

            <el-table-tree-column fixed :expand-all="false" child-key="children" levelKey="level" :indent-size="20"
                                  parentKey="parentId" prop="name" label="栏目名称" align="left">
                <template slot-scope="scope">
                    <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                </template>
            </el-table-tree-column>

            <el-table-column align="center"
                             v-for="item in afterTreeHeadData"
                             :label="item.label"
                             :prop="item.prop">
                <template slot-scope="scope">
                    <el-checkbox v-if="item.prop == 'allowHidden'" v-model="scope.row.allowHidden" :true-label="1" :false-label="0" @change="allowHiddenChange(scope.row)"/>
                    <el-checkbox v-else-if="item.prop == 'placeOnFile'" v-model="scope.row.placeOnFile" :true-label="1" :false-label="0" @change="placeOnFileChange(scope.row)"/>
                    <span v-else>{{scope.row[item.prop]}}</span>
                </template>
            </el-table-column>


            <!--<el-table-tree-column fixed :expand-all="false" child-key="children" levelKey="level" :indent-size="20"
                                  parentKey="parentId" prop="name" label="栏目名称" align="left">
                <template slot-scope="scope">
                    <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                </template>
            </el-table-tree-column>
            <el-table-column align="center" label="栏目别名" prop="aliasName"/>
            <el-table-column align="center" label="英文名称" prop="ename"/>
            <el-table-column align="center" label="隐藏" prop="allowHidden" width="50">
                <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.allowHidden" :true-label="1" :false-label="0" @change="allowHiddenChange(scope.row)"/>
                </template>
            </el-table-column>
            <el-table-column align="center" label="归档" prop="placeOnFile" width="50">
                <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.placeOnFile" :true-label="1" :false-label="0" @change="placeOnFileChange(scope.row)"/>
                </template>
            </el-table-column>
            <el-table-column align="center" label="排序" prop="sortNo" width="80"/>-->


            <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="150">
                <template slot-scope="scope">
                    <el-button v-if="btnEnable.create" :title="$t('table.create')" type="primary" icon="el-icon-plus" :size="btnSize" circle
                               @click.stop.safe="btnCreate(scope.row)" :disabled="scope.row.templateCount > 0"></el-button>
                    <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                               @click.stop.safe="btnUpdate(scope.row)"></el-button>
                    <el-button v-if="btnEnable.delete" :title="$t('table.delete')" type="danger" icon="el-icon-delete" :size="btnSize" circle
                               @click.stop.safe="btnDelete(scope.row)" :disabled="scope.row.templateCount > 0"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible"
                   :close-on-click-modal="closeOnClickModal" @close="closeCatalogDialog">
            <el-form ref="catalogDialogForm" class="deyatech-form" :model="catalog" label-position="right"
                     label-width="100px" :rules="catalogRules">
                <el-steps :active="stepsActive" finish-status="success" simple style="margin-bottom: 30px">
                    <el-step title="基本属性设置" ></el-step>
                    <el-step title="核心属性设置" v-if="stepsActive != 0"></el-step>
                    <el-step title="聚合属性设置" v-if="stepsActive == 2"></el-step>
                </el-steps>

                <!--基本属性设置-->
                <div v-show="stepsActive == 0">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="上级栏目" prop="parentId">
                                <el-cascader :options="catalogCascader"
                                             v-model.trim="catalogTreePosition"
                                             :props="{ checkStrictly: true }"
                                             clearable style="width: 100%" @change="parentIdChange"></el-cascader>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="内容模型" prop="contentModelId">
                                <el-select v-model.trim="selectContentModelIds" placeholder="请选择内容模型"
                                           multiple style="width: 100%">
                                    <el-option
                                        v-for="m in modelList"
                                        :key="m.id"
                                        :label="m.name"
                                        :value="m.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="栏目名称" prop="name">
                                <el-input v-model.trim="catalog.name"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="栏目别名" prop="aliasName">
                                <el-input v-model.trim="catalog.aliasName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="英文名称" prop="ename">
                                <el-input v-model.trim="catalog.ename"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20" :span="24">
                        <!--<el-col :span="12">
                            <el-form-item label="栏目名" prop="columnName">
                                <el-input v-model.trim="catalog.columnName"></el-input>
                            </el-form-item>
                        </el-col>-->
                        <el-col :span="12">
                            <el-form-item label="栏目类型" prop="columnType">
                                <el-input v-model.trim="catalog.columnType"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="栏目描述" prop="columnDescription">
                                <el-input type="textarea" v-model.trim="catalog.columnDescription" :rows="3"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="栏目关键字" prop="columnKeywords">
                                <el-input v-model.trim="catalog.columnKeywords"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="外链" prop="flagExternal">
                                <el-switch v-model.trim="catalog.flagExternal" :active-value=1 :inactive-value=0 @change="isFlagExternal"></el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>

                </div>

                <!--外链属性设置-->
                <div v-if="catalog.flagExternal">
                    <el-row :gutter="20" :span="24" v-if="">
                        <el-col :span="24">
                            <el-form-item label="外链地址" prop="linkUrl">
                                <el-input v-model.trim="catalog.linkUrl"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>

                <!--核心属性设置-->
                <div v-if="stepsActive == 1">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="频道页模板" prop="indexTemplate">
                                <el-cascader
                                    style="width: 100%"
                                    placeholder="请选择模板地址"
                                    clearable
                                    expand-trigger="hover"
                                    :options="templateTreeData"
                                    v-model.trim="selectIndexTemplate"
                                    :props="cascaderProps">
                                </el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="列表页模板" prop="listTemplate">
                                <el-cascader
                                    style="width: 100%"
                                    placeholder="请选择模板地址"
                                    clearable
                                    expand-trigger="hover"
                                    :options="templateTreeData"
                                    v-model.trim="selectListTemplate"
                                    :props="cascaderProps"
                                    @change="handleChange">
                                </el-cascader>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="导航中显示" prop="navigationShowAble">
                                <el-switch v-model.trim="catalog.navigationShowAble" :active-value=1 :inactive-value=0></el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="树中显示" prop="treeShowAble">
                                <el-switch v-model.trim="catalog.treeShowAble" :active-value=1 :inactive-value=0></el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="评论" prop="allowComment">
                                <el-switch v-model.trim="catalog.allowComment" :active-value=1 :inactive-value=0></el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="归档" prop="placeOnFile">
                                <el-switch v-model.trim="catalog.placeOnFile" :active-value=1 :inactive-value=0></el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="隐藏" prop="allowHidden">
                                <el-switch v-model.trim="catalog.allowHidden" :active-value=1 :inactive-value=0></el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="共享" prop="allowShare">
                                <el-switch v-model.trim="catalog.allowShare" :active-value=1 :inactive-value=0></el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="参与人员" prop="participant">
                                <el-radio v-model.trim="catalog.participant" border :label="1" @change="participantChange">会员</el-radio>
                                <el-radio v-model.trim="catalog.participant" border :label="2" @change="participantChange">所有人</el-radio>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="启用工作流" prop="workflowEnable">
                                <el-switch v-model.trim="catalog.workflowEnable" :active-value=1 :inactive-value=0 @change="isWorkflowEnable"></el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="工作流" prop="workflowKey" v-if="catalog.workflowEnable == 1">
                                <el-select v-model.trim="catalog.workflowKey" placeholder="请选择工作流">
                                    <el-option v-for="item in workflowList" :label="item.name" :value="item.actDefinitionKey"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="聚合规则" prop="flagAggregation">
                                <el-switch v-model.trim="catalog.flagAggregation" :active-value=1 :inactive-value=0></el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </el-form>

            <!--聚合属性设置-->
            <el-form ref="catalogAggregationDialogForm" class="deyatech-form" :model="catalogAggregation" label-position="right"
                     v-if="stepsActive == 2" label-width="100px" :rules="catalogAggregationRules">
                <el-row :gutter="20" :span="24">
                    <el-col :span="12">
                        <el-form-item label="栏目" prop="cmsCatalogId">
                            <el-cascader
                                style="width: 100%"
                                placeholder="请选择栏目"
                                clearable
                                collapse-tags
                                expand-trigger="hover"
                                :options="catalogCascader"
                                v-model.trim="selectCatalogIds"
                                :props="{ multiple: true, checkStrictly: true }"
                                @change="handleChange">
                            </el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="发布人" prop="publisher">
                            <el-input v-model.trim="catalogAggregation.publisherName" readonly @focus="btnSelectPublisher"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" :span="24">
                    <el-col :span="12">
                        <el-form-item label="发布机构" prop="publishOrganization">
                            <el-cascader style="width: 100%" :options="departmentCascader" v-model.trim="publishOrganizationArray"
                                         expand-trigger="hover" clearable @change="publishOrganizationChange" ></el-cascader>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" :span="24">
                    <el-col :span="24">
                        <el-form-item label="发布时间段" prop="publishTime">
                            <el-date-picker
                                v-model.trim="selectPublishTime"
                                type="datetimerange"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                :default-time="['00:00:00', '23:59:59']">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" :span="24">
                    <el-col :span="24">
                        <el-form-item label="关键字" prop="keyword">
                            <el-tag
                                :key="tag"
                                v-for="tag in dynamicTags"
                                closable
                                :disable-transitions="false"
                                @close="handleClose(tag)">
                                {{tag}}
                            </el-tag>
                            <el-input
                                class="input-new-tag"
                                v-if="inputVisible"
                                v-model.trim="inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm"
                                @blur="handleInputConfirm"
                                placeholder="请输入关键字"
                                maxlength="20">
                            </el-input>
                            <el-button :disabled="dynamicTags.length >= 10" class="button-new-tag" size="small" @click="showInput">添加关键字</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button v-if="stepsActive != 0" type="primary" :size="btnSize" @click="previousStep" :loading="submitLoading">上一步</el-button>
                <el-button v-if="(!catalog.flagExternal && stepsActive == 0) || (stepsActive == 1 && catalog.flagAggregation)"
                           type="primary" :size="btnSize" @click="nextStep" :loading="submitLoading">下一步</el-button>
                <el-button v-if="dialogTitle=='create' && (catalog.flagExternal || stepsActive == 2  || (stepsActive == 1 && !catalog.flagAggregation))"
                           type="primary" :size="btnSize" @click="doCreate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                <el-button v-if="dialogTitle=='update' && (catalog.flagExternal || stepsActive == 2  || (stepsActive == 1 && !catalog.flagAggregation))"
                           type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                <!--<el-button :size="btnSize" @click="closeCatalogDialog">{{$t('table.cancel')}}</el-button>-->
            </span>
        </el-dialog>

        <!--选择发布人-->
        <el-dialog title="选择发布人" :visible.sync="dialogPublisherVisible"
                   :close-on-click-modal="closeOnClickModal" @close="closePublisherDialog">
            <div v-loading="dialogFormLoading">
                <div class="dialog-search">
                    <el-cascader v-model.trim="publisherDepartment"
                                 :options="departmentCascader" @change="handleDepartmentChange"
                                 class="dialog-search-item dialog-keywords"
                                 :show-all-levels="false" expand-trigger="hover" clearable change-on-select
                                 :size="searchSize" placeholder="根据部门筛选"></el-cascader>
                    <el-input v-model.trim="userListQuery.name" class="dialog-search-item dialog-keywords"
                              clearable :size="searchSize" placeholder="根据姓名或帐户查询" maxlength="50"></el-input>
                    <el-button type="primary" :size="searchSize" icon="el-icon-search" @click="reloadUserList">{{$t('table.search')}}</el-button>
                </div>
                <div>
                    <el-table ref="publisherTable" :data="userList" border v-loading.body="publisherListLoading"
                               @select-all="selectAllPublisher" @select="handleSelectionChangePublisher">
                        <el-table-column type="selection" width="50" align="center"></el-table-column>
                        <el-table-column prop="departmentName" label="部门"></el-table-column>
                        <el-table-column prop="name" label="姓名"></el-table-column>
                        <el-table-column prop="account" label="登录帐户"></el-table-column>
                    </el-table>
                    <el-pagination class="deyatech-pagination pull-right" background
                                   :current-page.sync="userListQuery.page" :page-sizes="this.$store.state.common.pageSize"
                                   :page-size="userListQuery.size" :layout="this.$store.state.common.pageLayout" :total="userTotal"
                                   @size-change="handleSizeChangePublisher" @current-change="handleCurrentChangePublisher">
                    </el-pagination>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" :size="btnSize" @click="doSavePublisher" :disabled="!this.currentUser">选择</el-button>
                <el-button :size="btnSize" @click="closePublisherDialog">{{$t('table.cancel')}}</el-button>
            </div>
        </el-dialog>

    </basic-container>
</template>

<script>
    import {
        getCatalogTree,
        getCatalogCascader,
        createOrUpdateCatalog,
        delCatalogs,
        existsName,
        existsAliasName,
        existsEname,
        hasTemplate,
        updateAllowHiddenById,
        updatePlaceOnFileById
    } from '@/api/station/catalog';
    import {deepClone, setExpanded} from '@/util/util';
    import {mapGetters} from 'vuex';
    import {getStore} from '@/util/store';
    import pinyin from 'pinyin';
    import {listTemplateAllFiles} from '@/api/template/template';
    import {getProcessDefinitionList} from '@/api/workflow/definition';
    import {
        getAllModel
    } from '@/api/station/model';
    import {validateURL,isEnglish} from '@/util/validate';
    import {getDepartmentCascader} from '@/api/admin/department';
    import {getUserList} from '@/api/admin/user';
    import {getTableHeadCatalogData} from '@/api/assembly/customizationFunction'

    export default {
        name: 'catalog',
        data() {
            const checkParentId = (rule, value, callback) => {
                if (this.catalog.id && this.catalog.id === value) {
                    callback(new Error('不能添加自己'));
                    return;
                }
                if ("0" !== value) {
                    hasTemplate({id: value}).then(response => {
                        if (response.data) {
                            callback(new Error('当前栏目下已存在内容，不能添加栏目'))
                        } else {
                            callback()
                        }
                    })
                } else {
                    callback()
                }
            };
            const validateName = (rule, value, callback) => {
                const query = {
                    id: this.catalog.id,
                    parentId: this.catalog.parentId ? this.catalog.parentId : '0',
                    siteId: this.listQuery.siteId,
                    name: value
                }
                existsName(query).then(response => {
                    if (response.status == 200) {
                        if (response.data) {
                            callback(new Error('名称已存在'))
                        } else {
                            if (!this.catalog.ename) {
                                this.catalog.ename = pinyin(this.catalog.name, {
                                    style: pinyin.STYLE_FIRST_LETTER
                                }).join('')
                            }
                            callback()
                        }
                    } else {
                        callback(new Error('检查名称重复失败'))
                    }
                })
            };
            const validateAliasName = (rule, value, callback) => {
                const query = {
                    id: this.catalog.id,
                    parentId: this.catalog.parentId ? this.catalog.parentId : '0',
                    siteId: this.listQuery.siteId,
                    aliasName: value
                }
                existsAliasName(query).then(response => {
                    if (response.status == 200) {
                        if (response.data) {
                            callback(new Error('别名已存在'))
                        } else {
                            callback()
                        }
                    } else {
                        callback(new Error('检查别名重复失败'))
                    }
                })
            };
            const validateEname = (rule, value, callback) => {
                if (!isEnglish(value)) {
                    callback(new Error('只能输入英文字母'));
                    return;
                }
                const query = {
                    id: this.catalog.id,
                    parentId: this.catalog.parentId ? this.catalog.parentId : '0',
                    siteId: this.listQuery.siteId,
                    ename: value
                }
                existsEname(query).then(response => {
                    if (response.status == 200) {
                        if (response.data) {
                            callback(new Error('英文名称已存在'))
                        } else {
                            callback()
                        }
                    } else {
                        callback(new Error('检查英文名称重复失败'))
                    }
                })
            };
            const validateIndexTemplate = (rule, value, callback) => {
                this.catalog.indexTemplate = '/';
                if (this.selectIndexTemplate) {
                    this.catalog.indexTemplate += this.selectIndexTemplate.join('/');
                }
                if (this.catalog.indexTemplate.length > 500) {
                    callback(new Error('模板路径过长，最多 500 个字符'))
                    this.catalog.indexTemplate = undefined;
                } else {
                    callback()
                }
            };
            const validateListTemplate = (rule, value, callback) => {
                this.catalog.listTemplate = '/';
                if (this.selectListTemplate) {
                    this.catalog.listTemplate += this.selectListTemplate.join('/');
                }
                if (this.catalog.listTemplate.length > 500) {
                    callback(new Error('模板路径过长，最多 500 个字符'))
                    this.catalog.listTemplate = undefined;
                } else {
                    callback()
                }
            };
            const validateContentModelId = (rule, value, callback) => {
                if (this.selectContentModelIds.length == 0) {
                    callback(new Error('请选择内容模板'))
                } else {
                    this.catalog.contentModelId = this.selectContentModelIds.join();
                    if (this.catalog.contentModelId.length > 4000) {
                        callback(new Error('选择内容模板过多，最多 4000 个字符'))
                        this.catalog.contentModelId = undefined;
                    } else {
                        callback()
                    }
                }
            };
            const validateUrl = (rule, value, callback) => {
                if (this.catalog.flagExternal) {
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
            };
            const validateCmsCatalogId = (rule, value, callback) => {
                if (this.selectCatalogIds.length == 0) {
                    callback(new Error('请选择栏目'))
                } else {
                    this.catalogAggregation.cmsCatalogId = this.selectCatalogIds.join('&');
                    if (this.catalogAggregation.cmsCatalogId.length > 4000) {
                        callback(new Error('选择栏目过多，最多 4000 个字符'))
                        this.catalogAggregation.cmsCatalogId = undefined;
                    } else {
                        callback()
                    }
                }
            };
            const validatePublishTime = (rule, value, callback) => {
                if (this.selectPublishTime.length == 0) {
                    callback(new Error('请选择发布时间段'))
                } else {
                    this.catalogAggregation.publishTime = this.selectPublishTime.join();
                    callback()
                }
            };
            return {
                headData: [],
                frontTreeHeadData: [],
                afterTreeHeadData: [],
                catalogTreePosition: undefined,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    siteId: this.$store.state.common.siteId
                },
                catalogList: undefined,
                listLoading: false,
                catalog: {
                    id: undefined,
                    siteId: undefined,
                    parentId: undefined,
                    name: undefined,
                    aliasName: undefined,
                    ename: undefined,
                    showable: undefined,
                    linkUrl: '',
                    workflowId: undefined,
                    workflowKey: undefined,
                    indexTemplate: undefined,
                    listTemplate: undefined,
                    sortNo: undefined,
                    treePosition: undefined,
                    status: undefined,
                    allowComment: 0,
                    allowShare: 0,
                    allowHidden: 0,
                    applicationId: undefined,
                    attributeId: undefined,
                    autoRelease: 0,
                    contectObjectId: undefined,
                    generateHome: 0,
                    navigationShowAble: 0,
                    participant: 2,
                    treeShowAble: 0,
                    workflowEnable: 0,
                    pathName: undefined,
                    contentModelId: undefined,
                    placeOnFile: 0,
                    flagExternal: 0,
                    coverage: undefined,
                    flagAggregation: 0,
                    aggregationId: undefined,
                    catalogAggregationInfo: undefined,
                    columnName: undefined,
                    columnDescription: undefined,
                    columnKeywords: undefined,
                    columnType: undefined,
                },
                catalogCascader: [],
                dialogVisible: false,
                dialogTitle: undefined,
                selectedRows: [],
                catalogRules: {
                    siteId: [
                        {required: true, message: this.$t("table.pleaseInput") + '站点id'}
                    ],
                    parentId: [
                        {validator: checkParentId, trigger: 'change'}
                    ],
                    name: [
                        {required: true, message: this.$t("table.pleaseInput") + '栏目名称'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'},
                        {validator: validateName, trigger: 'blur'}
                    ],
                    aliasName: [
                        {required: true, message: this.$t("table.pleaseInput") + '栏目别名'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'},
                        {validator: validateAliasName, trigger: 'blur'}
                    ],
                    ename: [
                        {required: true, message: this.$t("table.pleaseInput") + '英文名称'},
                        {min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur'},
                        {validator: validateEname, trigger: 'blur'}
                    ],
                    linkUrl: [
                        {required: true, message: this.$t("table.pleaseInput") + '外部链接地址'},
                        {min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur'},
                        {validator: validateUrl, trigger: 'blur'}
                    ],
                  /*  showable: [
                        {required: true, message: this.$t("table.pleaseInput") + '是否显示'}
                    ],*/
                    workflowKey: [
                        {required: true, message: this.$t("table.pleaseSelect") + '工作流'}
                    ],
                    indexTemplate: [
                        {validator: validateIndexTemplate, trigger: 'change'}
                    ],
                    listTemplate: [
                        {validator: validateListTemplate, trigger: 'change'}
                    ],
                    sortNo: [
                        {required: true, message: this.$t("table.pleaseInput") + '排序号'}
                    ],
                    treePosition: [
                        {required: true, message: this.$t("table.pleaseInput") + '在树结构中位置'}
                    ],
                    status: [
                        {required: true, message: this.$t("table.pleaseInput") + '状态'}
                    ],
                    allowComment: [
                        {required: true, message: this.$t("table.pleaseSelect") + '是否允许评论'}
                    ],
                    allowShare: [
                        {required: true, message: this.$t("table.pleaseSelect") + '是否共享'}
                    ],
                    allowHidden: [
                        {required: true, message: this.$t("table.pleaseSelect") + '是否隐藏'}
                    ],
                    applicationId: [
                        {required: true, message: this.$t("table.pleaseInput") + '应用id'}
                    ],
                    attributeId: [
                        {required: true, message: this.$t("table.pleaseInput") + '属性id'}
                    ],
                    contectObjectId: [
                        {required: true, message: this.$t("table.pleaseInput") + '内容对象id'}
                    ],
                    navigationShowAble: [
                        {required: true, message: this.$t("table.pleaseSelect") + '是否在导航中显示'}
                    ],
                    participant: [
                        {required: true, message: this.$t("table.pleaseSelect") + '参与人员'}
                    ],
                    treeShowAble: [
                        {required: true, message: this.$t("table.pleaseSelect") + '是否在树中显示'}
                    ],
                    workflowEnable: [
                        {required: true, message: this.$t("table.pleaseSelect") + '是否启用工作流'}
                    ],
                    pathName: [
                        {required: true, message: this.$t("table.pleaseInput") + '路径名，如果是多级栏目则用/分隔各级ename'}
                    ],
                    remark: [
                        {max: 500, message: '长度最多 500 个字符', trigger: 'blur'}
                    ],
                    contentModelId: [
                        {required: true, validator: validateContentModelId, trigger: 'change'}
                    ],
                    placeOnFile: [
                        {required: true, message: this.$t("table.pleaseSelect") + '是否归档'}
                    ],
                    flagExternal: [
                        {required: true, message: this.$t("table.pleaseSelect") + '是否外链'}
                    ],
                    flagAggregation: [
                        {required: true, message: this.$t("table.pleaseSelect") + '是否设置聚合规则'}
                    ],
                    columnDescription: [
                        {max: 500, message: '长度最多 500 个字符', trigger: 'blur'}
                    ],
                    columnKeywords: [
                        {max: 200, message: '长度最多 200 个字符', trigger: 'blur'}
                    ],
                    columnType: [
                        {max: 20, message: '长度最多 20 个字符', trigger: 'blur'}
                    ],

                },
                lastExpanded: undefined,
                tableReset: true,
                templateTreeData: [],
                cascaderProps: {
                    value: 'fileName',
                    label: 'fileName',
                    children: 'children'
                },
                selectIndexTemplate: undefined,
                selectListTemplate: undefined,
                workflowList: [],
                modelList: [],
                selectContentModelIds: [],
                stepsActive: 0,
                selectCatalogIds: [],
                catalogAggregation: {
                    id: undefined,
                    cmsCatalogId: undefined,
                    keyword: undefined,
                    publishOrganization: undefined,
                    publishTime: undefined,
                    publisher: undefined,
                    publisherName: undefined,
                    publishOrganizationTreePosition: undefined
                },
                catalogAggregationRules: {
                    cmsCatalogId: [
                        {required: true, validator: validateCmsCatalogId, trigger: 'change'}
                    ],
                    publishOrganization: [
                        {required: true, message: this.$t("table.pleaseInput") + '发布机构'},
                        {min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur'},
                    ],
                    publishTime: [
                        {required: true, validator: validatePublishTime, trigger: 'blur'}
                    ],
                    publisher: [
                        {required: true, message: this.$t("table.pleaseInput") + '发布人'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'},
                    ]
                },
                submitLoading: false,
                dynamicTags: [],
                inputVisible: false,
                inputValue: '',
                selectPublishTime: [],
                departmentCascader: [],
                publishOrganizationArray: [],
                templateCount: 0,
                dialogPublisherVisible: false,
                dialogFormLoading: false,
                publisherListLoading: false,
                publisherDepartment: [],
                userList: [],
                userListQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined,
                    departmentId: undefined
                },
                currentUser: undefined,
                userTotal: undefined
            }
        },
        created() {
            this.loadHeadData();
            this.$store.state.common.selectSiteDisplay = true;
            if (this.$store.state.common.siteId != undefined) {
                this.reloadList();
                this.listTemplateAllFiles();
                this.getAllModel();
                this.getCatalogCascader();
                this.loadDepartmentCascader();
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
                    create: this.permission.catalog_create,
                    update: this.permission.catalog_update,
                    delete: this.permission.catalog_delete
                };
            }
        },
        methods: {
            loadHeadData() {
                getTableHeadCatalogData().then(response=>{
                    this.headData = response.data;
                    let flag = 0;
                    if (this.headData) {
                        for (let item of this.headData) {
                            if (item.prop === 'name') {
                                flag = 1;
                                continue;
                            }
                            if (flag == 0) {
                                this.frontTreeHeadData.push(item);
                            } else if (flag == 1) {
                                this.afterTreeHeadData.push(item)
                            }
                        }
                    }
                });
            },
            participantChange() {
                this.$refs.catalogDialogForm.validateField('participant', errorMsg => {
                });
            },
            reloadList() {
                if (!this.listQuery.siteId) {
                    this.$message.warning("请先选择站点");
                    return
                }
                this.listLoading = true;
                getCatalogTree(this.listQuery).then(response => {
                    this.tableReset = false;
                    this.catalogList = response.data;
                    if (this.lastExpanded) {
                        this.catalogList = setExpanded(this.catalogList, this.lastExpanded);
                    }
                    this.$nextTick(() => {
                        this.tableReset = true
                    });
                    this.listLoading = false;
                })
            },
            getCatalogCascader() {
                this.submitLoading = true;
                const query = {siteId: this.listQuery.siteId};
                getCatalogCascader(query).then(response => {
                    this.submitLoading = false;
                    this.catalogCascader = response.data;
                })
            },
            handleSelectionChange(rows) {
                this.selectedRows = rows;
                this.templateCount = 0;
                for (let r of rows) {
                    this.templateCount += r.templateCount;
                }
            },
            // 获取模板
            listTemplateAllFiles() {
                this.templateTreeData = [];
                listTemplateAllFiles(this.listQuery.siteId).then(response => {
                    let result = JSON.parse(response.data)
                    this.templateTreeData = result.files
                })
            },
            btnCreate(row) {
                this.resetCatalog();
                if (row.id) {
                    this.catalog = deepClone(row);
                    if (row.treePosition) {
                        this.catalog.treePosition = row.treePosition + "&" + row.id;
                    } else {
                        this.catalog.treePosition = "&" + row.id;
                    }
                    this.catalog.parentId = row.id;
                } else {
                    if (this.selectedRows.length == 1) {
                        this.catalog = deepClone(this.selectedRows[0]);
                        if (this.selectedRows[0].treePosition) {
                            this.catalog.treePosition = this.selectedRows[0].treePosition + "&" + this.selectedRows[0].id;
                        } else {
                            this.catalog.treePosition = "&" + this.selectedRows[0].id;
                        }
                        this.catalog.parentId = this.selectedRows[0].id;
                    } else {
                        this.catalog.parentId = '0';
                        this.catalog.treePosition = undefined;
                    }
                }
                if (this.catalog.treePosition) {
                    this.catalogTreePosition = this.catalog.treePosition.substring(1).split('&');
                }
                // 一些字段不需要覆盖
                this.catalog.id = undefined;
                this.catalog.name = undefined;
                this.catalog.aliasName = undefined;
                this.catalog.ename = undefined;
                this.catalog.sortNo = undefined;
                this.catalog.pathName = undefined;
                this.catalog.version = undefined;
                this.catalog.aggregationId = undefined;
                this.catalog.children = undefined;
                // 聚合栏目
                if (this.catalog.flagAggregation) {
                    this.catalogAggregation = this.catalog.catalogAggregation;
                    this.selectCatalogIds = this.catalogAggregation.cmsCatalogId ? this.catalogAggregation.cmsCatalogId.split('&') : [];
                    this.selectPublishTime = this.catalogAggregation.publishTime ? this.catalogAggregation.publishTime.split(',') : [];
                    this.dynamicTags = this.catalogAggregation.keyword ? this.catalogAggregation.keyword.split(',') : [];
                    // 一些字段不需要覆盖
                    this.catalogAggregation.id = undefined;

                    let position = undefined;
                    if (this.catalogAggregation.publishOrganizationTreePosition) {
                        position = this.catalogAggregation.publishOrganizationTreePosition + '&' + this.catalogAggregation.publishOrganization;
                    } else{
                        position = '&' + this.catalogAggregation.publishOrganization;
                    }
                    if (position) {
                        this.publishOrganizationArray = position.substring(1).split('&');
                    }
                }
                this.selectIndexTemplate = this.catalog.indexTemplate ? this.catalog.indexTemplate.split('/').slice(1) : [];
                this.selectListTemplate = this.catalog.listTemplate ? this.catalog.listTemplate.split('/').slice(1) : [];
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row) {
                this.resetCatalog();
                if (row.id) {
                    this.catalog = deepClone(row);
                } else {
                    this.catalog = deepClone(this.selectedRows[0]);
                }
                if (this.catalog.contentModelId) {
                    this.selectContentModelIds = this.catalog.contentModelId.split(',');
                }
                if (this.catalog.treePosition) {
                    this.catalogTreePosition = this.catalog.treePosition.substring(1).split('&');
                }
                this.isWorkflowEnable(this.catalog.workflowEnable);
                // 聚合栏目
                if (this.catalog.flagAggregation) {
                    this.catalogAggregation = this.catalog.catalogAggregation;
                    this.selectCatalogIds = this.catalogAggregation.cmsCatalogId ? this.catalogAggregation.cmsCatalogId.split('&') : [];
                    this.selectPublishTime = this.catalogAggregation.publishTime ? this.catalogAggregation.publishTime.split(',') : [];
                    this.dynamicTags = this.catalogAggregation.keyword ? this.catalogAggregation.keyword.split(',') : [];

                    let position = undefined;
                    if (this.catalogAggregation.publishOrganizationTreePosition) {
                        position = this.catalogAggregation.publishOrganizationTreePosition + '&' + this.catalogAggregation.publishOrganization;
                    } else{
                        position = '&' + this.catalogAggregation.publishOrganization;
                    }
                    if (position) {
                        this.publishOrganizationArray = position.substring(1).split('&');
                    }
                }

                this.selectIndexTemplate = this.catalog.indexTemplate ? this.catalog.indexTemplate.split('/').slice(1) : [];
                this.selectListTemplate = this.catalog.listTemplate ? this.catalog.listTemplate.split('/').slice(1) : [];
                this.dialogTitle = 'update';
                this.dialogVisible = true;
            },
            btnDelete(row) {
                let ids = [];
                var message = '';
                if (row.id) {
                    if (row.children) {
                        message = '所选栏目包含子栏目，'
                    }
                    this.$confirm(message + this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        ids.push(row.id);
                        this.lastExpanded = row.treePosition;
                        this.doDelete(ids);
                    })
                } else {
                    for (const deleteRow of this.selectedRows) {
                        if (deleteRow.children) {
                            message = '所选栏目包含子栏目，'
                        }
                    }
                    this.$confirm(message + this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        for (const deleteRow of this.selectedRows) {
                            this.lastExpanded = deleteRow.treePosition;
                            ids.push(deleteRow.id);
                        }
                        this.doDelete(ids);
                    })
                }
            },
            doCreate() {
                var _this = this;
                var validateForm1 = new Promise(function (resolve, reject) {
                    _this.$refs['catalogDialogForm'].validate(valid => {
                        if (valid) {
                            resolve();
                        } else {
                            return false;
                        }
                    })
                });
                var validateForm2 = true;
                if (this.catalog.flagAggregation) {
                    validateForm2 = new Promise(function (resolve, reject) {
                        _this.$refs['catalogAggregationDialogForm'].validate(valid => {
                            if (valid) {
                                resolve();
                            } else {
                                return false;
                            }
                        })
                    });
                }

                Promise.all([validateForm1, validateForm2]).then(function () {
                    _this.catalog.siteId = _this.listQuery.siteId;
                    // 聚合栏目信息
                    if (_this.catalog.flagAggregation) {
                        _this.catalogAggregation.keyword = _this.dynamicTags.join();
                        _this.catalog.catalogAggregationInfo = JSON.stringify(_this.catalogAggregation);
                    }
                    _this.submitLoading = true;
                    createOrUpdateCatalog(_this.catalog).then((response) => {
                        _this.lastExpanded = _this.catalog.treePosition;
                        _this.resetCatalogDialogAndList();
                        _this.$message.success(_this.$t("table.createSuccess"));
                    }).catch(() => {
                        _this.submitLoading = false;
                    });
                });
            },
            doUpdate() {
                var _this = this;
                var validateForm1 = new Promise(function (resolve, reject) {
                    _this.$refs['catalogDialogForm'].validate(valid => {
                        if (valid) {
                            resolve();
                        } else {
                            return false;
                        }
                    })
                });
                var validateForm2 = true;
                if (this.catalog.flagAggregation && !this.catalog.flagExternal) {
                    validateForm2 = new Promise(function (resolve, reject) {
                        _this.$refs['catalogAggregationDialogForm'].validate(valid => {
                            if (valid) {
                                resolve();
                            } else {
                                return false;
                            }
                        })
                    });
                }
                var confirm = true;
                // 外链栏目、聚合栏目不覆盖子栏目
                if (this.catalog.children) {
                    confirm = new Promise(function (resolve, reject) {
                        _this.$confirm('是否覆盖子栏目信息', _this.$t("table.tip"), {
                            confirmButtonText: '覆盖',
                            cancelButtonText: '不覆盖',
                            type: 'warning'
                        }).then(() => {
                            resolve();
                            _this.catalog.coverage = true;
                        }).catch(() => {
                            resolve();
                            _this.catalog.coverage = false;
                        });
                    });
                }

                Promise.all([validateForm1, validateForm2, confirm]).then(function () {
                    _this.catalog.children = undefined;
                    // 聚合栏目信息
                    if (_this.catalog.flagAggregation) {
                        _this.catalogAggregation.keyword = _this.dynamicTags.join();
                        _this.catalog.catalogAggregationInfo = JSON.stringify(_this.catalogAggregation);
                    }
                    _this.submitLoading = true;
                    createOrUpdateCatalog(_this.catalog).then(() => {
                        _this.lastExpanded = _this.catalog.treePosition;
                        _this.resetCatalogDialogAndList();
                        _this.$message.success(_this.$t("table.updateSuccess"));
                    }).catch(() => {
                        _this.submitLoading = false;
                    });
                });
            },
            doDelete(ids) {
                this.listLoading = true;
                delCatalogs(ids).then(() => {
                    this.selectedRows = [];
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                }).catch(() => {
                    this.listLoading = false;
                });
            },
            resetCatalog() {
                this.catalog = {
                    id: undefined,
                    siteId: undefined,
                    parentId: undefined,
                    name: undefined,
                    aliasName: undefined,
                    ename: undefined,
                    showable: undefined,
                    linkUrl: '',
                    workflowId: undefined,
                    workflowKey: undefined,
                    indexTemplate: undefined,
                    listTemplate: undefined,
                    sortNo: undefined,
                    treePosition: undefined,
                    status: undefined,
                    allowComment: 0,
                    allowShare: 0,
                    applicationId: undefined,
                    attributeId: undefined,
                    autoRelease: 0,
                    contectObjectId: undefined,
                    generateHome: 0,
                    navigationShowAble: 0,
                    participant: 2,
                    treeShowAble: 0,
                    workflowEnable: 0,
                    pathName: undefined,
                    contentModelId: undefined,
                    placeOnFile: 0,
                    flagExternal: 0,
                    coverage: undefined,
                    flagAggregation: 0,
                    catalogAggregationInfo: undefined,
                    columnName: undefined,
                    columnDescription: undefined,
                    columnKeywords: undefined,
                    columnType: undefined,
                }
            },
            resetCatalogAggregation() {
                this.catalogAggregation = {
                    id: undefined,
                    cmsCatalogId: undefined,
                    keyword: undefined,
                    publishOrganization: undefined,
                    publishTime: undefined,
                    publisher: undefined
                }
            },
            resetCatalogDialogAndList() {
                this.closeCatalogDialog();
                this.submitLoading = false;
                this.reloadList();
                this.getCatalogCascader();
            },
            closeCatalogDialog() {
                this.catalogTreePosition = [];
                this.selectedRows = [];
                this.dialogVisible = false;
                this.selectIndexTemplate = undefined;
                this.selectListTemplate = undefined;
                this.workflowList = [];
                this.resetCatalog();
                this.resetCatalogAggregation();
                this.$refs['catalogDialogForm'].resetFields();
                this.selectContentModelIds = [];
                for (let model of this.modelList) {
                    this.selectContentModelIds.push(model.id);
                }
                this.stepsActive = 0;
                this.selectCatalogIds = [];
                this.selectPublishTime = [];
                this.dynamicTags = [];
            },
            handleChange(value) {
            },
            isWorkflowEnable(value) {
                if (value == 1) {
                    if (this.workflowList.length == 0) {
                        this.getWorkflowList();
                    }
                    this.display = true;
                } else {
                    this.display = false;
                    if (this.catalog.workflowKey) {
                        this.catalog.workflowKey = undefined;
                    }
                }
            },
            // 获取工作流
            getWorkflowList() {
                this.workflowList = []
                const query = {
                    page: 1,
                    size: 99999999
                }
                getProcessDefinitionList(query).then(response => {
                    if (response.status == 200) {
                        this.workflowList = response.data.records;
                    } else {
                        this.$message.error('工作流数据获取失败')
                    }
                })
            },
            getAllModel() {
                getAllModel().then(response => {
                    this.modelList = response.data;
                    for (let model of this.modelList) {
                        this.selectContentModelIds.push(model.id);
                    }
                })
            },
            previousStep() {
                this.$refs['catalogDialogForm'].clearValidate();
                this.stepsActive--;
            },
            nextStep() {
                this.$refs['catalogDialogForm'].validate(valid => {
                    if (valid) {
                        this.stepsActive++;
                    } else {
                        return false;
                    }
                });
            },
            isFlagExternal(value) {
                if (!value && this.catalog.linkUrl) {
                    this.catalog.linkUrl = '';
                }
                // 如果是外链，就不能是聚合栏目
                if (value) {
                    this.catalog.flagAggregation = 0;
                }
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
            loadDepartmentCascader() {
                getDepartmentCascader().then(response => {
                    this.departmentCascader = response.data;
                })
            },
            publishOrganizationChange(v) {
                if (v && v.length > 0) {
                    this.catalogAggregation.publishOrganization = v[v.length-1];
                } else {
                    this.catalogAggregation.publishOrganization = undefined;
                }
            },
            // 选择发布人
            btnSelectPublisher() {
                this.currentUser = undefined;
                this.dialogPublisherVisible = true;
                this.userListQuery.page = 1;
                this.loadUserList();
            },
            closePublisherDialog() {
                this.dialogPublisherVisible = false;
                this.currentUser = undefined;
            },
            handleDepartmentChange(v) {
                if (v && v.length > 0) {
                    this.userListQuery.departmentId = v[v.length - 1];
                } else {
                    this.userListQuery.departmentId = undefined;
                }
            },
            loadUserList() {
                this.userList = undefined;
                this.publisherListLoading = true;
                getUserList(this.userListQuery).then(response => {
                    this.publisherListLoading = false;
                    this.userList = response.data.records;
                    this.userTotal = response.data.total;
                    this.checkedCurrentUser();
                }).catch(()=>{
                    this.publisherListLoading = false;
                    this.userTotal = 0;
                });
            },
            checkedCurrentUser() {
                this.$nextTick(()=>{
                    if (this.userList) {
                        for (let r of this.userList) {
                            if (this.currentUser && this.currentUser.id === r.id) {
                                this.$refs.publisherTable.toggleRowSelection(r, true);
                            } else {
                                this.$refs.publisherTable.toggleRowSelection(r, false);
                            }
                        }
                    }
                });
            },
            selectAllPublisher() {
                this.checkedCurrentUser();
            },
            handleSelectionChangePublisher(selection) {
                this.currentUser = undefined;
                if (selection.length > 0) {
                    this.currentUser = selection[selection.length - 1];
                }
                this.checkedCurrentUser();
            },
            reloadUserList() {
                this.userListQuery.page = 1;
                this.loadUserList();
            },
            handleSizeChangePublisher(val) {
                this.userListQuery.size = val;
                this.loadUserList();
            },
            handleCurrentChangePublisher(val) {
                this.userListQuery.page = val;
                this.loadUserList();
            },
            doSavePublisher() {
                this.catalogAggregation.publisher = this.currentUser.id;
                this.catalogAggregation.publisherName = this.currentUser.name;
                this.closePublisherDialog();
            },
            parentIdChange(v) {
                if (v && v.length > 0) {
                    this.catalog.parentId = v[v.length - 1];
                    this.catalog.treePosition = "&" + v.join('&') + "&" + this.catalog.parentId;
                } else {
                    this.catalog.parentId = '0';
                    this.catalog.treePosition = undefined;
                }
            },
            allowHiddenChange(row) {
                if (row) {
                    updateAllowHiddenById({allowHidden: row.allowHidden, id: row.id}).then(response=>{
                        if (response.status == 200 && response.data) {
                            this.$message.success("隐藏修改成功")
                        } else {
                            this.$message.error("隐藏修改失败")
                        }
                    });
                }
            },
            placeOnFileChange(row) {
                if (row) {
                    updatePlaceOnFileById({placeOnFile: row.placeOnFile, id: row.id}).then(response=>{
                        if (response.status == 200 && response.data) {
                            this.$message.success("归档修改成功")
                        } else {
                            this.$message.error("归档修改失败")
                        }
                    });
                }
            },
        }
    }
</script>

<style>
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
</style>
