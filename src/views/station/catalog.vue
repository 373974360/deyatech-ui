<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <!--            <div class="deyatech-header">
                            <el-form :inline="true" ref="searchForm">
                                <el-form-item>
                                    <el-input :size="searchSize" :placeholder="$t('table.searchName')" v-model.trim="listQuery.name"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="reloadList">{{$t('table.search')}}</el-button>
                                    <el-button icon="el-icon-delete" :size="searchSize" @click="resetSearch">{{$t('table.clear')}}</el-button>
                                </el-form-item>
                            </el-form>
                        </div>-->

            <div class="deyatech-menu">
                <div class="deyatech-menu_left">
                    <el-button v-if="btnEnable.create" type="primary" :size="btnSize" @click="btnCreate" :disabled="selectedRows.length > 1 || templateCount > 0">{{$t('table.create')}}</el-button>
                    <el-button v-if="btnEnable.update" type="primary" :size="btnSize" @click="btnUpdate" :disabled="selectedRows.length != 1">{{$t('table.update')}}</el-button>
                    <el-button v-if="btnEnable.delete" type="danger" :size="btnSize" @click="btnDelete" :disabled="selectedRows.length < 1 || templateCount > 0">{{$t('table.delete')}}</el-button>
                </div>
                <div class="deyatech-menu_right">
                    <!--<el-button type="primary" icon="el-icon-edit" :size="btnSize" circle @click="btnUpdate"></el-button>
                    <el-button type="danger" icon="el-icon-delete" :size="btnSize" circle @click="btnDelete"></el-button>-->
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                </div>
            </div>
        </div>

        <el-table :data="catalogList" v-loading.body="listLoading" stripe border highlight-current-row
                  @selection-change="handleSelectionChange" v-if="tableReset">
            <el-table-column type="selection" width="50" align="center"/>
            <el-table-tree-column fixed :expand-all="false" child-key="children" levelKey="level" :indent-size="20"
                                  parentKey="parentId" prop="name" label="栏目名称" align="left">
                <template slot-scope="scope">
                    <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                </template>
            </el-table-tree-column>
            <el-table-column align="center" label="栏目别名" prop="aliasName"/>
            <el-table-column align="center" label="URL" prop="linkUrl"/>
            <el-table-column align="center" label="排序" prop="sortNo" width="80"/>
            <!--<el-table-column align="center" label="站点id" prop="siteId"/>
            <el-table-column align="center" label="父节点id" prop="parentId"/>-->
            <!--            <el-table-column align="center" label="英文名称" prop="ename"/>-->
            <!--            <el-table-column align="center" label="是否显示" prop="showable"/>-->

            <!--            <el-table-column align="center" label="工作流ID" prop="workflowId"/>-->
            <!--            <el-table-column align="center" label="首页模板" prop="indexTemplate"/>-->
            <!--            <el-table-column align="center" label="列表页模板" prop="listTemplate"/>-->
            <!--            <el-table-column align="center" label="在树结构中位置" prop="treePosition"/>
                        <el-table-column align="center" label="状态" prop="status"/>
                        <el-table-column align="center" label="是否允许评论" prop="allowComment"/>
                        <el-table-column align="center" label="是否允许分享: 0.否 1.是" prop="allowShare"/>
                        <el-table-column align="center" label="应用id" prop="applicationId"/>
                        <el-table-column align="center" label="属性id" prop="attributeId"/>
                        <el-table-column align="center" label="自动发布:0.否 1.是" prop="autoRelease"/>
                        <el-table-column align="center" label="内容对象id" prop="contectObjectId"/>
                        <el-table-column align="center" label="显示条数" prop="displayNumber"/>
                        <el-table-column align="center" label="生成栏目首页:0.否 1.是" prop="generateHome"/>
                        <el-table-column align="center" label="在导航中显示: 0.否 1.是" prop="navigationShowAble"/>
                        <el-table-column align="center" label="参与人员:0.会员 1.所有人" prop="participant"/>
                        <el-table-column align="center" label="在树中显示: 0.否 1.是" prop="treeShowAble"/>
                        <el-table-column align="center" label="是否启用工作流: 0.否 1.是" prop="workflowEnable"/>
                        <el-table-column align="center" label="路径名，如果是多级栏目则用/分隔各级ename" prop="pathName"/>
                        <el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                            <template slot-scope="scope">
                                <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                                    {{scope.row.enable | enums('EnableEnum')}}
                                </el-tag>
                            </template>
                        </el-table-column>-->

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
                     label-width="140px" :rules="catalogRules">
                <el-steps :active="stepsActive" finish-status="success" simple style="margin-bottom: 30px">
                    <el-step title="基本属性设置" ></el-step>
                    <el-step title="核心属性设置" v-if="stepsActive != 0"></el-step>
                    <el-step title="聚合属性设置" v-if="stepsActive == 2"></el-step>
                </el-steps>

                <!--基本属性设置-->
                <div v-if="stepsActive == 0">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="上级栏目" prop="parentId">
                                <el-cascader :options="catalogCascader" v-model.trim="catalogTreePosition"
                                             show-all-levels expand-trigger="click" clearable
                                             change-on-select style="width: 100%"></el-cascader>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
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
                        <el-col :span="12">
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
                        <el-col :span="12">
                            <el-form-item label="字段名" prop="columnName">
                                <el-input v-model.trim="catalog.columnName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="字段类型" prop="columnType">
                                <el-input v-model.trim="catalog.columnType"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="字段描述" prop="columnDescription">
                                <el-input type="textarea" v-model.trim="catalog.columnDescription" :rows="3"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="字段关键字" prop="columnKeywords">
                                <el-input v-model.trim="catalog.columnKeywords"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="是否外链" prop="flagExternal">
                                <el-switch v-model.trim="catalog.flagExternal" :active-value=1 :inactive-value=0 @change="isFlagExternal"
                                           active-text="是" inactive-text="否">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>

                </div>

                <!--外链属性设置-->
                <div v-if="catalog.flagExternal">
                    <el-row :gutter="20" :span="24" v-if="">
                        <el-col :span="24">
                            <el-form-item label="外部链接地址" prop="linkUrl">
                                <el-input v-model.trim="catalog.linkUrl"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>

                <!--核心属性设置-->
                <div v-if="stepsActive == 1">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="首页模板" prop="indexTemplate">
                                <el-input v-model.trim="catalog.indexTemplate"></el-input>
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
                            <el-form-item label="列表页显示条数" prop="displayNumber">
                                <el-input-number v-model.trim="catalog.displayNumber" :min=1 :max=100 style="width: 100%"></el-input-number>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="是否自动发布" prop="autoRelease">
                                <el-switch v-model.trim="catalog.autoRelease" :active-value=1 :inactive-value=0
                                           active-text="是" inactive-text="否">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="是否允许评论" prop="allowComment">
                                <el-switch v-model.trim="catalog.allowComment" :active-value=1 :inactive-value=0
                                           active-text="是" inactive-text="否">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="是否允许分享" prop="allowShare">
                                <el-switch v-model.trim="catalog.allowShare" :active-value=1 :inactive-value=0
                                           active-text="是" inactive-text="否">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="是否生成栏目首页" prop="generateHome">
                                <el-switch v-model.trim="catalog.generateHome" :active-value=1 :inactive-value=0
                                           active-text="是" inactive-text="否">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="是否在导航中显示" prop="navigationShowAble">
                                <el-switch v-model.trim="catalog.navigationShowAble" :active-value=1 :inactive-value=0
                                           active-text="是" inactive-text="否">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="是否在树中显示" prop="treeShowAble">
                                <el-switch v-model.trim="catalog.treeShowAble" :active-value=1 :inactive-value=0
                                           active-text="是" inactive-text="否">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="是否归档" prop="placeOnFile">
                                <el-switch v-model.trim="catalog.placeOnFile" :active-value=1 :inactive-value=0
                                           active-text="是" inactive-text="否">
                                </el-switch>
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
                            <el-form-item label="是否启用工作流" prop="workflowEnable">
                                <el-switch v-model.trim="catalog.workflowEnable" :active-value=1 :inactive-value=0 @change="isWorkflowEnable"
                                           active-text="是" inactive-text="否">
                                </el-switch>
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
                    <!--                    <el-row :gutter="20" :span="24">
                                            <el-col :span="24">
                                                <el-form-item :label="$t('table.remark')" prop="remark" label-width="140px">
                                                    <el-input type="textarea" v-model.trim="catalog.remark" :rows="3"/>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>-->
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="是否设置聚合规则" prop="flagAggregation">
                                <el-switch v-model.trim="catalog.flagAggregation" :active-value=1 :inactive-value=0
                                           active-text="是" inactive-text="否">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </el-form>

            <!--聚合属性设置-->
            <el-form ref="catalogAggregationDialogForm" class="deyatech-form" :model="catalogAggregation" label-position="right"
                     v-if="stepsActive == 2" label-width="140px" :rules="catalogAggregationRules">
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
                            <el-input v-model.trim="catalogAggregation.publisher"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" :span="24">
                    <el-col :span="24">
                        <el-form-item label="发布机构" prop="publishOrganization">
                            <el-input v-model.trim="catalogAggregation.publishOrganization"></el-input>
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
                            <el-button :disabled="dynamicTags.length >= 10" class="button-new-tag" size="small" @click="showInput">+ 添加关键字(最多10个)</el-button>
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
                <!--                <el-button :size="btnSize" @click="closeCatalogDialog">{{$t('table.cancel')}}</el-button>-->
            </span>
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
        hasTemplate
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

    export default {
        name: 'catalog',
        data() {
            const checkParentId = (rule, value, callback) => {
                if (this.catalog.id && this.catalog.id === value) {
                    callback(new Error('不能添加自己'));
                    return;
                }
                hasTemplate({id:value}).then(response => {
                    if (response.data) {
                        callback(new Error('当前栏目下已存在内容，不能添加栏目'))
                    } else {
                        callback()
                    }
                })
            };
            const validateName = (rule, value, callback) => {
                const query = {
                    id: this.catalog.id,
                    parentId: this.catalog.parentId ? this.catalog.parentId : '0',
                    siteId : this.listQuery.siteId,
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
                    siteId : this.listQuery.siteId,
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
                    siteId : this.listQuery.siteId,
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
                    applicationId: undefined,
                    attributeId: undefined,
                    autoRelease: 0,
                    contectObjectId: undefined,
                    displayNumber: 1,
                    generateHome: 0,
                    navigationShowAble: 0,
                    participant: undefined,
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
                submitLoading: false,
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
                    showable: [
                        {required: true, message: this.$t("table.pleaseInput") + '是否显示'}
                    ],
                    workflowKey: [
                        {required: true, message: this.$t("table.pleaseSelect") + '工作流'}
                    ],
                    indexTemplate: [
                        // {required: true, message: this.$t("table.pleaseInput") + '首页模板'}
                        {max: 50, message: '模板路径过长，最多 50 个字符', trigger: 'blur'}
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
                        {required: true, message: this.$t("table.pleaseSelect") + '是否允许分享'}
                    ],
                    applicationId: [
                        {required: true, message: this.$t("table.pleaseInput") + '应用id'}
                    ],
                    attributeId: [
                        {required: true, message: this.$t("table.pleaseInput") + '属性id'}
                    ],
                    autoRelease: [
                        {required: true, message: this.$t("table.pleaseSelect") + '是否自动发布'}
                    ],
                    contectObjectId: [
                        {required: true, message: this.$t("table.pleaseInput") + '内容对象id'}
                    ],
                    displayNumber: [
                        {required: true, message: this.$t("table.pleaseInput") + '显示条数'}
                    ],
                    generateHome: [
                        {required: true, message: this.$t("table.pleaseSelect") + '是否生成栏目首页'}
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
                    columnName: [
                        {max: 50, message: '长度最多 50 个字符', trigger: 'blur'}
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
                    publisher: undefined
                },
                catalogAggregationRules: {
                    cmsCatalogId: [
                        {required: true, validator: validateCmsCatalogId, trigger: 'change'}
                    ],
                    keyword: [
                        // {required: true, message: this.$t("table.pleaseInput") + '关键字'}
                    ],
                    publishOrganization: [
                        {required: true, message: this.$t("table.pleaseInput") + '发布机构'},
                        {min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur'},
                    ],
                    publishTime: [
                        // {required: true, message: this.$t("table.pleaseSelect") + '发布时间段'}
                        {required: true, validator: validatePublishTime, trigger: 'blur'}
                    ],
                    publisher: [
                        {required: true, message: this.$t("table.pleaseInput") + '发布人'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'},
                    ]
                },
                dynamicTags: [],
                inputVisible: false,
                inputValue: '',
                selectPublishTime: [],
                templateCount: 0
            }
        },
        created() {
            this.$store.state.common.selectSiteDisplay = true;
            if(this.$store.state.common.siteId != undefined){
                this.reloadList();
                this.listTemplateAllFiles();
                this.getAllModel();
                this.getCatalogCascader();
            }else{
                this.$message.error('请选择站点！');
            }
        },
        computed: {
            catalogTreePosition: {
                get() {
                    if (this.catalog.treePosition) {
                        return this.catalog.treePosition.substr(1).split('&');
                    } else {
                        return [];
                    }
                },
                set(v) {
                    if (v && v.length > 0) {
                        this.catalog.parentId = v[v.length - 1];
                        this.catalog.treePosition = "&" + v.join('&') + "&" + this.catalog.parentId;
                    } else {
                        this.catalog.parentId = '0';
                        this.catalog.treePosition = undefined;
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
            btnEnable() {
                return {
                    create: this.permission.catalog_create,
                    update: this.permission.catalog_update,
                    delete: this.permission.catalog_delete
                };
            }
        },
        methods: {
            participantChange() {
                this.$refs.catalogDialogForm.validateField('participant', errorMsg => {});
            },
            /*            resetSearch(){
                            this.listQuery.siteId = this.$store.state.common.siteId;
                        },*/
            reloadList(){
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
            getCatalogCascader(){
                this.submitLoading = true;
                const query = {siteId : this.listQuery.siteId};
                getCatalogCascader(query).then(response => {
                    this.submitLoading = false;
                    this.catalogCascader = response.data;
                })
            },
            handleSelectionChange(rows){
                this.selectedRows = rows;
                this.templateCount = 0;
                for (let r of rows) {
                    this.templateCount += r.templateCount;
                }
            },
            /*            loadEnum(name) {
                            return getStore({name: 'enums'})[name]
                        },*/
            // 获取模板
            listTemplateAllFiles(){
                this.templateTreeData = [];
                listTemplateAllFiles(this.listQuery.siteId).then(response => {
                    let result = JSON.parse(response.data)
                    this.templateTreeData = result.files
                })
            },
            btnCreate(row){
                this.resetCatalog();
                if (row.id) {
                    this.catalog = deepClone(row);
                    if(row.treePosition){
                        this.catalog.treePosition = row.treePosition + "&" + row.id;
                    }else{
                        this.catalog.treePosition = "&" + row.id;
                    }
                    this.catalog.parentId = row.id;
                } else {
                    if (this.selectedRows.length == 1) {
                        this.catalog = deepClone(this.selectedRows[0]);
                        if(this.selectedRows[0].treePosition){
                            this.catalog.treePosition = this.selectedRows[0].treePosition + "&" + this.selectedRows[0].id;
                        }else{
                            this.catalog.treePosition = "&" + this.selectedRows[0].id;
                        }
                        this.catalog.parentId = this.selectedRows[0].id;
                    } else {
                        this.catalog.parentId = '0';
                        this.catalog.treePosition = undefined;
                    }
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
                }

                this.selectListTemplate = this.catalog.listTemplate ? this.catalog.listTemplate.split('/').slice(1) : [];
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row){
                this.resetCatalog();
                if (row.id) {
                    this.catalog = deepClone(row);
                } else {
                    this.catalog = deepClone(this.selectedRows[0]);
                }
                if (this.catalog.contentModelId) {
                    this.selectContentModelIds = this.catalog.contentModelId.split(',');
                }
                this.isWorkflowEnable(this.catalog.workflowEnable);
                // 聚合栏目
                if (this.catalog.flagAggregation) {
                    this.catalogAggregation = this.catalog.catalogAggregation;
                    this.selectCatalogIds = this.catalogAggregation.cmsCatalogId ? this.catalogAggregation.cmsCatalogId.split('&') : [];
                    this.selectPublishTime = this.catalogAggregation.publishTime ? this.catalogAggregation.publishTime.split(',') : [];
                    this.dynamicTags = this.catalogAggregation.keyword ? this.catalogAggregation.keyword.split(',') : [];
                }
                this.selectListTemplate = this.catalog.listTemplate ? this.catalog.listTemplate.split('/').slice(1) : [];
                this.dialogTitle = 'update';
                this.dialogVisible = true;
            },
            btnDelete(row){
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
                    for(const deleteRow of this.selectedRows) {
                        if (deleteRow.children) {
                            message = '所选栏目包含子栏目，'
                        }
                    }
                    this.$confirm(message + this.$t("table.deleteConfirm"), this.$t("table.tip"), {type: 'error'}).then(() => {
                        for(const deleteRow of this.selectedRows) {
                            this.lastExpanded = deleteRow.treePosition;
                            ids.push(deleteRow.id);
                        }
                        this.doDelete(ids);
                    })
                }
            },
            doCreate(){
                var _this = this;
                var validateForm1 = new Promise(function(resolve, reject) {
                    _this.$refs['catalogDialogForm'].validate(valid => {
                        if(valid) {
                            resolve();
                        } else {
                            return false;
                        }
                    })
                });
                var validateForm2 = true;
                if (this.catalog.flagAggregation) {
                    validateForm2 = new Promise(function(resolve, reject) {
                        _this.$refs['catalogAggregationDialogForm'].validate(valid => {
                            if(valid) {
                                resolve();
                            } else {
                                return false;
                            }
                        })
                    });
                }

                Promise.all([validateForm1, validateForm2]).then(function(){
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
                    });;
                });
            },
            doUpdate(){
                var _this = this;
                var validateForm1 = new Promise(function(resolve, reject) {
                    _this.$refs['catalogDialogForm'].validate(valid => {
                        if(valid) {
                            resolve();
                        } else {
                            return false;
                        }
                    })
                });
                var validateForm2 = true;
                if (this.catalog.flagAggregation && !this.catalog.flagExternal) {
                    validateForm2 = new Promise(function(resolve, reject) {
                        _this.$refs['catalogAggregationDialogForm'].validate(valid => {
                            if(valid) {
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
                    confirm = new Promise(function(resolve, reject) {
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

                Promise.all([validateForm1, validateForm2, confirm]).then(function(){
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
            doDelete(ids){
                this.listLoading = true;
                delCatalogs(ids).then(() => {
                    this.selectedRows = [];
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                }).catch(()=>{
                    this.listLoading = false;
                });
            },
            resetCatalog(){
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
                    displayNumber: 1,
                    generateHome: 0,
                    navigationShowAble: 0,
                    participant: undefined,
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
            resetCatalogAggregation(){
                this.catalogAggregation = {
                    id: undefined,
                    cmsCatalogId: undefined,
                    keyword: undefined,
                    publishOrganization: undefined,
                    publishTime: undefined,
                    publisher: undefined
                }
            },
            resetCatalogDialogAndList(){
                this.closeCatalogDialog();
                this.submitLoading = false;
                this.reloadList();
                this.getCatalogCascader();
            },
            closeCatalogDialog() {
                this.selectedRows = [];
                this.dialogVisible = false;
                this.selectListTemplate = undefined;
                this.workflowList = [];
                this.resetCatalog();
                this.resetCatalogAggregation();
                this.$refs['catalogDialogForm'].resetFields();
                this.selectContentModelIds = [];
                for (let model of this.modelList) {
                    this.selectContentModelIds.push(model.id);
                };
                this.stepsActive = 0;
                this.selectCatalogIds = [];
                this.selectPublishTime = [];
                this.dynamicTags = [];
            },
            handleChange(value) {
            },
            isWorkflowEnable (value) {
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
                this.stepsActive --;
            },
            nextStep() {
                this.$refs['catalogDialogForm'].validate(valid => {
                    if(valid) {
                        this.stepsActive ++;
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
            // 动态添加关键字 end
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
