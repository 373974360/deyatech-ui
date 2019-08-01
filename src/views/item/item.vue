<template>
    <basic-container>
        <div class="deyatech-container pull-auto">
            <div class="deyatech-header">
                <el-form :inline="true" ref="searchForm">
                    <el-form-item>
                        <el-input :size="searchSize" placeholder="请输入事项名称" v-model.trim="listQuery.name"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" :size="searchSize" @click="btnSearch">
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
                    <el-button v-if="btnEnable.preorderConfig" type="primary" :size="btnSize" icon="el-icon-time"
                               @click="btnPreorderConfigBatch" :disabled="selectedRows.length < 1">{{'预约配置'}}
                    </el-button>
                </div>
                <div class="deyatech-menu_right">
                    <!--<el-button type="primary" icon="el-icon-edit" :size="btnSize" circle @click="btnUpdate"></el-button>
                    <el-button type="danger" icon="el-icon-delete" :size="btnSize" circle @click="btnDelete"></el-button>-->
                    <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
                </div>
            </div>
            <el-table :data="itemList" v-loading.body="listLoading" stripe border highlight-current-row
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" align="center"/>
                <el-table-column align="center" label="事项名称" prop="name">
                    <template slot-scope="scope">
                        <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="事项简称" prop="shortName"/>
                <el-table-column align="center" label="事项编码" prop="code"/>
                <el-table-column align="center" label="是否第三方事项" prop="remoteEnable">
                    <template slot-scope="scope">
                        {{scope.row.remoteEnable | enums('YesNoEnum')}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="第三方事项" prop="remoteId"/>
                <el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enable | enums('EnableEnum') | statusFilter">
                            {{scope.row.enable | enums('EnableEnum')}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center"
                                 width="230">
                    <template slot-scope="scope">
                        <el-button v-if="btnEnable.update" :title="$t('table.update')" type="primary"
                                   icon="el-icon-edit" :size="btnSize" circle
                                   @click.stop.safe="btnUpdate(scope.row)"></el-button>
                        <el-button v-if="btnEnable.preorderConfig" title="预约配置" type="primary" icon="el-icon-time"
                                   :size="btnSize" circle @click.stop.safe="btnPreorderConfig(scope.row)"></el-button>
                        <el-button v-if="btnEnable.preauditConfig" title="预审配置" type="primary" icon="el-icon-check"
                                   :size="btnSize" circle @click.stop.safe="btnPreauditConfig(scope.row)"></el-button>
                        <el-button v-if="btnEnable.deliveryConfig" title="交取件方式" type="primary" icon="iconinquirytemplate"
                                   :size="btnSize" circle @click.stop.safe="btnDeliveryConfig(scope.row)"></el-button>
                        <el-badge :value="scope.row.number" style="margin: 10px 13px 11px 10px">
                        <el-button v-if="btnEnable.associateMaterials" title="关联材料" type="primary" icon="iconcaidan1"
                                   :size="btnSize" circle @click.stop.safe="btnItemMaterials(scope.row)"></el-button>
                        </el-badge>
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

            <!-- 事项编辑 -->
            <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeItemDialog">
                <el-form ref="itemDialogForm" class="deyatech-form" :model="item" label-position="right"
                         label-width="100px" :rules="itemRules">
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="事项名称" prop="name" label-width="155px">
                                <el-input v-model.trim="item.name" maxlength="50"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="事项简称" prop="shortName" label-width="155px">
                                <el-input v-model.trim="item.shortName" maxlength="50"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="事项编码" prop="code" label-width="155px">
                                <el-input v-model.trim="item.code" maxlength="50"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="区县编码" prop="countyCode" label-width="155px">
                                <el-input v-model.trim="item.countyCode" maxlength="30"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="是否是第三方事项" prop="remoteEnable" label-width="155px">
                                <el-select v-model="item.remoteEnable" @change="changeDisplayOfRemoteId">
                                    <el-option
                                        v-for = "o in loadEnum('YesNoEnum')"
                                        :label="o.value"
                                        :value="o.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="第三方事项编号" prop="remoteId" label-width="155px" v-if="item.remoteEnable">
                                <el-input v-model.trim="item.remoteId" maxlength="255" :disabled="!item.remoteEnable"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24" v-if="item.remoteEnable">
                        <el-col :span="12">
                            <el-form-item label="所属部门编号" prop="departmentId" label-width="155px">
                                <el-input v-model.trim="item.departmentId" maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="所属部门名称" prop="departmentName" label-width="155px">
                                <el-input v-model.trim="item.departmentName" maxlength="50"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24" v-if="item.remoteEnable">
                        <el-col :span="12">
                            <el-form-item label="实施主体编号" prop="implementOrgId" label-width="155px">
                                <el-input v-model.trim="item.implementOrgId" maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="实施主体名称" prop="implementOrgName" label-width="155px">
                                <el-input v-model.trim="item.implementOrgName" maxlength="50"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24" v-if="item.remoteEnable">
                        <el-col :span="12">
                            <el-form-item label="实施机构编号" prop="dealDeptId" label-width="155px">
                                <el-input v-model.trim="item.dealDeptId" maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="实施机构名称" prop="dealDeptName" label-width="155px">
                                <el-input v-model.trim="item.dealDeptName" maxlength="50"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24" v-if="item.remoteEnable">
                        <el-col :span="12">
                            <el-form-item label="联办机构编号" prop="unionOrgId" label-width="155px">
                                <el-input v-model.trim="item.unionOrgId" maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="联办机构名称" prop="unionOrgName" label-width="155px">
                                <el-input v-model.trim="item.unionOrgName" maxlength="50"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20" :span="24" v-if="!item.remoteEnable">
                        <el-col :span="12">
                            <el-form-item label="所属部门" prop="departmentTreePosition" label-width="155px">
                                <el-cascader :options="departmentCascader"
                                             v-model="item.departmentTreePosition"
                                             :show-all-levels="false"
                                             expand-trigger="click" clearable
                                             change-on-select
                                             @change="departmentChange"></el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="实施主体" prop="implementTreePosition" label-width="155px">
                                <el-cascader :options="departmentCascader"
                                             v-model="item.implementTreePosition"
                                             :show-all-levels="false"
                                             expand-trigger="hover" clearable
                                             change-on-select
                                             @change="implementChange"></el-cascader>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24" v-if="!item.remoteEnable">
                        <el-col :span="12">
                            <el-form-item label="实施机构" prop="dealTreePosition" label-width="155px">
                                <el-cascader :options="departmentCascader"
                                             v-model="item.dealTreePosition"
                                             :show-all-levels="false"
                                             expand-trigger="hover" clearable
                                             change-on-select
                                             @change="dealChange"></el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="联办机构" prop="unionTreePosition" label-width="155px">
                                <el-cascader :options="departmentCascader"
                                             v-model="item.unionTreePosition"
                                             :show-all-levels="false"
                                             expand-trigger="hover" clearable
                                             change-on-select
                                             @change="unionChange"></el-cascader>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="联办机构适用情形" prop="unionOrgApplySituation" label-width="155px">
                                <el-input v-model.trim="item.unionOrgApplySituation" maxlength="100"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="目录名称" prop="itemCatalog" label-width="155px">
                                <el-input v-model.trim="item.itemCatalog" maxlength="100"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="事项类型" prop="itemType" label-width="155px">
                                <el-select v-model="item.itemType" :name="item.itemTypeName" @change="itemTypeChange" clearable>
                                    <el-option
                                        v-for = "o in loadEnum('ItemTypeEnum')"
                                        :label="o.value"
                                        :value="o.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="实施对象" prop="serviceObject" label-width="155px">
                                <el-select v-model="item.serviceObject" @change="serviceObjectChange" clearable>
                                    <el-option
                                        v-for = "o in loadEnum('ServiceObjectEnum')"
                                        :label="o.value"
                                        :value="o.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="实施主体性质" prop="implementOrgType" label-width="155px">
                                <el-select v-model="item.implementOrgType" @change="implementOrgTypeChange" clearable>
                                    <el-option
                                        v-for = "o in loadEnum('ImplementOrgTypeEnum')"
                                        :label="o.value"
                                        :value="o.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="行使层级" prop="execLevel" label-width="155px">
                                <el-select v-model="item.execLevel" @change="execLevelChange" clearable>
                                    <el-option
                                        v-for = "o in loadEnum('ExecLevelEnum')"
                                        :label="o.value"
                                        :value="o.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="权力来源" prop="powerSource" label-width="155px">
                                <el-select v-model="item.powerSource" @change="powerSourceChange" clearable>
                                    <el-option
                                        v-for = "o in loadEnum('PowerSourceEnum')"
                                        :label="o.value"
                                        :value="o.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="办件类型" prop="dealType" label-width="155px">
                                <el-select v-model="item.dealType" @change="dealTypeChange" clearable>
                                    <el-option
                                        v-for = "o in loadEnum('DealTypeEnum')"
                                        :label="o.value"
                                        :value="o.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="通办范围" prop="generalRange" label-width="155px">
                                <el-select v-model="item.generalRange" @change="generalRangeChange" clearable>
                                    <el-option
                                        v-for = "o in loadEnum('GeneralRangeEnum')"
                                        :label="o.value"
                                        :value="o.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="办理形式" prop="mold" label-width="155px">
                                <el-select v-model="item.mold" @change="moldChange" clearable>
                                    <el-option
                                        v-for = "o in loadEnum('AcceptSourceEnum')"
                                        :label="o.value"
                                        :value="o.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="咨询电话" prop="askTel" label-width="155px">
                                <el-input v-model.trim="item.askTel" maxlength="13"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="监督电话" prop="superviseTel" label-width="155px">
                                <el-input v-model.trim="item.superviseTel" maxlength="13"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="是否可以在线申报" prop="isOnlineApply" label-width="155px">
                                <el-select v-model="item.isOnlineApply">
                                    <el-option
                                        v-for = "o in loadEnum('YesNoEnum')"
                                        :label="o.value"
                                        :value="o.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="是否有中介服务" prop="isInterService" label-width="155px">
                                <el-select v-model="item.isInterService">
                                    <el-option
                                        v-for = "o in loadEnum('YesNoEnum')"
                                        :label="o.value"
                                        :value="o.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="数量限制" prop="numLimit" label-width="155px">
                                <el-input v-model.trim="item.numLimit" maxlength="50"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="初审机关" prop="firstTrialDept" label-width="155px">
                                <el-input v-model.trim="item.firstTrialDept" maxlength="50"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="省级初审机关名称" prop="provinceFirsetTrialDept" label-width="155px">
                                <el-input v-model.trim="item.provinceFirsetTrialDept" maxlength="50"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="终审机关" prop="finalTrialDept" label-width="155px">
                                <el-input v-model.trim="item.finalTrialDept" maxlength="50"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="省级终审机关名称" prop="provinceFinalTrialDept" label-width="155px">
                                <el-input v-model.trim="item.provinceFinalTrialDept" maxlength="50"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="中央终审机关名称" prop="centralFinalTrialDept" label-width="155px">
                                <el-input v-model.trim="item.centralFinalTrialDept" maxlength="50"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="转报审批机关" prop="reportApprovalDept" label-width="155px">
                                <el-input v-model.trim="item.reportApprovalDept" maxlength="50"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="省级转报审批机关名称" prop="provinceReportApprovalDept" label-width="155px">
                                <el-input v-model.trim="item.provinceReportApprovalDept" maxlength="50"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="结果名称" prop="resultName" label-width="155px">
                                <el-input v-model.trim="item.resultName" maxlength="80"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="结果样本" prop="resultExample" label-width="155px">
                                <el-upload name="file" class="upload-file"
                                           :action="this.$store.state.common.uploadUrl"
                                           :accept="this.$store.state.common.fileAccepts"
                                           :show-file-list="false"
                                           :on-success="resultExampleUploadSuccess"
                                           :on-error="uploadError">
                                    <el-button >上传</el-button>
                                </el-upload>
                                <a class="el-button el-button--default show-file" :href="downloadUrl + item.resultExample" target="_blank" v-if="item.resultExample">查看</a>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="设定依据" prop="legalBasis" label-width="155px">
                                <el-input type="textarea" v-model.trim="item.legalBasis" :rows="3" maxlength="2000"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="申请条件" prop="applicationCondition" label-width="155px">
                                <el-input type="textarea" v-model.trim="item.applicationCondition" :rows="3" maxlength="2000"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="受理条件" prop="acceptCondition" label-width="155px">
                                <el-input type="textarea" v-model.trim="item.acceptCondition" :rows="3" maxlength="2000"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="受理时间" prop="acceptTime" label-width="155px">
                                <el-input v-model.trim="item.acceptTime" maxlength="200"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="受理地点" prop="acceptPlace" label-width="155px">
                                <el-input v-model.trim="item.acceptPlace" maxlength="200"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="年审或年检" prop="yearReviewInspection" label-width="155px">
                                <el-select v-model="item.yearReviewInspection" @change="yearReviewInspectionChange" clearable>
                                    <el-option
                                        v-for = "o in loadEnum('YearReviewInspectionEnum')"
                                        :label="o.value"
                                        :value="o.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="年审或年检次数" prop="yearReviewInspectionNum" label-width="155px">
                                <el-select v-model="item.yearReviewInspectionNum" @change="yearReviewInspectionNumChange" clearable>
                                    <el-option
                                        v-for = "o in loadEnum('YearReviewInspectionNumEnum')"
                                        :label="o.value"
                                        :value="o.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="是否收费" prop="isCharge" label-width="155px">
                                <el-select v-model="item.isCharge" @change="isChargeChange">
                                    <el-option
                                        v-for = "o in loadEnum('YesNoEnum')"
                                        :label="o.value"
                                        :value="o.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">

                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24" v-if="item.isCharge">
                        <el-col :span="12">
                            <el-form-item label="收费标准" prop="chargeStandard" label-width="155px">
                                <el-input type="textarea"  v-model.trim="item.chargeStandard" :rows="3" maxlength="2000" :disabled="!item.isCharge"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="收费依据" prop="chargeBasis" label-width="155px">
                                <el-input type="textarea" v-model.trim="item.chargeBasis" :rows="3" maxlength="2000" :disabled="!item.isCharge"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="法定办结时限" prop="lawComptime" label-width="155px">
                                <el-input v-model.trim="item.lawComptime" maxlength="50"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="省级法定办结时限" prop="provinceLawComptime" label-width="155px">
                                <el-input v-model.trim="item.provinceLawComptime" maxlength="50"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="承诺办结时限" prop="promiseComptime" label-width="155px">
                                <el-input  v-model.trim="item.promiseComptime" maxlength="50"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="省级承诺办结时限" prop="provincePromiseComptime" label-width="155px">
                                <el-input  v-model.trim="item.provincePromiseComptime" maxlength="50"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="12">
                            <el-form-item label="到现场次数" prop="siteNum" label-width="155px">
                                <el-input v-model.trim="item.siteNum" maxlength="2"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="办理流程" prop="handleWorkflow" label-width="155px">
                                <el-upload name="file" class="upload-file"
                                           :action="this.$store.state.common.uploadUrl"
                                           :accept="this.$store.state.common.imageAccepts"
                                           :show-file-list="false"
                                           :on-success="handleWorkflowUploadSuccess"
                                           :on-error="uploadError">
                                    <el-button >上传</el-button>
                                </el-upload>
                                <a class="el-button el-button--default show-file" :href="downloadUrl + item.handleWorkflow" target="_blank" v-if="item.handleWorkflow">查看</a>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item label="特殊环节" prop="specialSegment" label-width="155px">
                                <el-input type="textarea" v-model.trim="item.specialSegment" :rows="3" maxlength="2000"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" :span="24">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.remark')" prop="remark" label-width="155px">
                                <el-input type="textarea" v-model.trim="item.remark" :rows="3" maxlength="500"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate"
                               :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeItemDialog">{{$t('table.cancel')}}</el-button>
                </span>
            </el-dialog>

            <!-- 预约配置 -->
            <el-dialog :title="'预约配置'" :visible.sync="dialogPreorderConfigVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closePreorderConfigDialog" class="el-dialog-table">
                <el-form ref="preorderConfigDialogForm" class="deyatech-form" :model="preorder"
                         :rules="preorderConfigRules" v-loading="dialogFormLoading">

                    <el-form-item label="可预约天数" :rules="preorderConfigRules.count" prop="days">
                        <el-input-number v-model="days" @change="handleChange" :min="0" :max="100"></el-input-number>
                    </el-form-item>
                    <el-table :data="preorder.preorderConfigList" v-loading.body="listLoading" stripe border :row-style="{height:'40'}" :cell-style="{padding:'0'}"  class="el-form-item-row-style">
                        <el-table-column align="center" label="时间段" prop="timeSlot"/>
                        <el-table-column align="center" label="可预约最大人数" prop="count">
                            <template slot-scope="scope">
                                <el-form-item :prop="'preorderConfigList.' + scope.$index + '.count'"
                                              :rules="preorderConfigRules.count">
                                    <el-input-number v-model="scope.row.count" :min="0" :max="100"></el-input-number>
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" :size="btnSize" @click="doSavePreorderConfig"
                               :loading="submitLoading">{{$t('table.confirm')}}
                    </el-button>
                    <el-button :size="btnSize" @click="closePreorderConfigDialog">{{$t('table.cancel')}}</el-button>
                </div>
            </el-dialog>

            <!-- 预审配置 -->
            <el-dialog :title="'预审配置'" :visible.sync="dialogPreauditConfigVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closePreauditConfigDialog" class="el-dialog-table">
                <el-form ref="preauditConfigDialogForm" class="deyatech-form" :model="preauditConfig"
                         :rules="preauditConfigRules" v-loading="dialogFormLoading">
                    <el-form-item label="预审天数">
                        <el-input-number v-model="preauditConfig.preauditDays" :min="0" :max="100"></el-input-number>
                    </el-form-item>
                    <el-form-item label="预审人员" prop="userIds">
                        <el-select v-model="selectedUserIds" multiple filterable placeholder="请选择">
                            <el-option
                                v-for = "user in userList"
                                :key="user.id"
                                :label="user.name"
                                :value="user.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" :size="btnSize" @click="doSavePreauditConfig"
                               :loading="submitLoading">{{$t('table.confirm')}}
                    </el-button>
                    <el-button :size="btnSize" @click="closePreauditConfigDialog">{{$t('table.cancel')}}</el-button>
                </div>
            </el-dialog>

            <el-dialog title="交取件方式配置" :visible.sync="dialogDeliveryConfigVisible"
                       :close-on-click-modal="closeOnClickModal" @close="closeDeliveryConfigDialog">
                <el-form ref="deliveryConfigDialogForm" class="deyatech-form" :model="itemDelivery" v-loading="dialogFormLoading">
                    <el-form-item label="交件方式：">
                        <el-checkbox-group v-model="itemDelivery.handType">
                            <el-checkbox v-for="item in enums['HandTypeEnum']" :key="item.code" :label="item.code + ''">
                                {{item.value}}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="取件方式：">
                        <el-checkbox-group v-model="itemDelivery.takeType">
                            <el-checkbox v-for="item in enums['TakeTypeEnum']" :key="item.code" :label="item.code + ''">
                                {{item.value}}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" :size="btnSize" @click="doSaveDeliveryConfig"
                               :loading="submitLoading">{{$t('table.confirm')}}
                    </el-button>
                    <el-button :size="btnSize" @click="closeDeliveryConfigDialog">{{$t('table.cancel')}}</el-button>
                </div>
            </el-dialog>

            <!-- 关联材料 -->
            <el-dialog :title="titleMap['associateMaterials']" :visible.sync="dialogItemMaterialsVisible"
                       :close-on-click-modal="closeOnClickModal" @click="closeItemMaterialsDialog">
                <div v-loading="dialogFormLoading">
                    <div class="search">
                        <el-input v-model="materialsListQuery.materialsName"
                                  class="dialog-keywords"
                                  clearable :size="searchSize" placeholder="根据输入查询"></el-input>
                        <el-select v-model="materialsListQuery.materialsVersion"
                                   class="dialog-keywords el-input--small" @change="loadAssociatedMaterials">
                            <el-option
                                v-for = "v in materialsVersionList"
                                :label="v"
                                :value="v">
                            </el-option>
                        </el-select>
                        <el-button type="primary" :size="searchSize" icon="el-icon-search" @click="reloadMaterialsList">{{$t('table.search')}}</el-button>
                    </div>
                    <div class="search">
                        <el-checkbox v-model="materialsListQuery.showRelatedFlag" @change="reloadMaterialsList">只显示已关联材料</el-checkbox>
                    </div>
                    <div>
                        <el-table ref="itemMaterialsTable" :data="materialsList" border @select="selectRowMaterials"
                                  @select-all="selectAllMaterials" @selection-change="handleSelectionChangeItemMaterials">
                            <el-table-column type="selection" width="50" align="center"/>
                            <el-table-column align="center" label="材料名称" prop="materialsName"/>
                            <el-table-column align="center" label="材料来源" prop="materialsFrom"/>
                            <el-table-column align="center" label="材料类型" prop="materialsType">
                                <template slot-scope="scope">
                                    {{scope.row.materialsType | enums('MaterialsTypeEnum')}}
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="材料要求" prop="materialsMode">
                                <template slot-scope="scope">
                                    {{scope.row.materialsMode | enums('MaterialsModeEnum')}}
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="版本" prop="materialsVersion"/>
                            <el-table-column align="center" label="数量" prop="materialsNum" >
                                <template slot-scope="scope">
                                    <el-input-number v-model="scope.row.materialsNum"
                                                     controls-position="right"
                                                     maxlength="2" :min="1" :max="99"
                                                     @change="materialsNumChange"
                                    style="width: 100px;"/>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination class="deyatech-pagination pull-right" background
                                       :current-page.sync="materialsListQuery.page" :page-sizes="this.$store.state.common.pageSize"
                                       :page-size="materialsListQuery.size" :layout="this.$store.state.common.pageLayout" :total="materialsTotal"
                                       @size-change="handleSizeChangeItemMaterials" @current-change="handleCurrentChangeItemMaterials">
                        </el-pagination>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" :size="btnSize" @click="doSaveItemMaterials"
                               :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                    <el-button :size="btnSize" @click="closeItemMaterialsDialog">{{$t('table.cancel')}}</el-button>
                </div>
            </el-dialog>

        </div>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {getStore} from '@/util/store';
    import {
        listByPreorderConfig,
        getByPreorderConfig,
        saveOrUpdate
    } from '../../api/number/preorderConfig';
    import {
        getListByPreorderTime
    } from '../../api/number/preorderTime';
    import {isStartOrEndWithWhiteSpace,isPhone,isMobile} from '@/util/validate';
    import {
        getItemList,
        createOrUpdateItem,
        delItems,
        countItem
    } from '@/api/item/item';
    import {getDepartmentCascader} from '@/api/admin/department';
    import {
        getAllItemMaterials,
        getItemMaterialsList,
        setItemMaterials,
        getMaterialsVersion
    } from '@/api/item/itemMaterials';
    import {getUsersByWindowAndDepartment} from '@/api/admin/user';
    import {
        createItemPreaudit,
        getAllItemPreaudit
    } from '@/api/item/itemPreaudit';
    import {
        getItemDelivery,
        createOrUpdateItemDelivery
    } from "../../api/item/itemDelivery";

    export default {
        name: 'item',
        data() {
            const validateSiteNum = (rule, value, callback) => {
                if (!/^[1-9][0-9]*$/.test(value)) {
                    callback(new Error('请输入 1 到 99 的数字'));
                    return;
                }
                callback();
            };
            const validateTel = (rule, value, callback) => {
                if (value) {
                    let msg = '';
                    if (rule.field === 'askTel') {
                        msg = '咨询电话';
                    } else if (rule.field === 'superviseTel') {
                        msg = '监督电话';
                    }
                    if (!isPhone(value) && !isMobile(value)) {
                        callback(new Error(msg + '不正确'));
                        return;
                    }
                }
                callback();
            };
            const validateWhiteSpace = (rule, value, callback) => {
                let oldValue = '';
                let msg = '';
                if (rule.field === 'name') {
                    oldValue = this.itemTmp.name;
                    msg = '事项名称';
                } else if (rule.field === 'shortName') {
                    oldValue = this.itemTmp.shortName;
                    msg = '事项简称';
                } else if (rule.field === 'code') {
                    oldValue = this.itemTmp.code;
                    msg = '事项编码';
                }
                if (isStartOrEndWithWhiteSpace(value)) {
                    callback(new Error(msg + this.$t("errorMsg.blankSpace")));
                    return;
                }
                // 值被修改的情况
                if (oldValue && oldValue.trim() != value.trim()) {
                    let query = {field: rule.field, value: value};
                    countItem(query).then(res => {
                        if (res.data > 0) {
                            callback(new Error(msg + '已存在'));
                        } else {
                            callback();
                        }

                    }).catch(() => {
                        callback(new Error(msg + '检查请求出错'))
                    });
                } else {
                    callback();
                }
                callback();
            };
            const isInteger = (rule, value, callback) => {
                if (rule.field == "days") {
                    value = this.days;
                }
                if (!value && value != 0) {
                    return callback(new Error('输入不可以为空'));
                }
                setTimeout(() => {
                    if (!Number(value)) {
                        callback(new Error('请输入正整数'));
                    } else {
                        const re = /^[0-9]*[1-9][0-9]*$/;
                        const rsCheck = re.test(value);
                        if (!rsCheck) {
                            callback(new Error('请输入正整数'));
                        } else if (value > 10000) {
                            callback(new Error('超出范围(0-10000)，请重新输入'));
                        } else {
                            callback();
                        }
                    }
                }, 0);
            };
            const isSelected = (rule, value, callback) => {
                if (this.selectedUserIds && this.selectedUserIds.length > 0) {
                    callback();
                } else {
                    callback(new Error(this.$t("table.pleaseSelect") + '预审用户'))
                }
            };
            return {
                //this.$store.state.common.downloadUrl
                downloadUrl: '',
                heightSet: "0",
                padding: 0,
                itemList: undefined,
                total: undefined,
                listLoading: true,
                listQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    name: undefined
                },
                days: 0,
                item: {
                    id: undefined,
                    name: undefined,
                    shortName: undefined,
                    code: undefined,
                    departmentId: undefined,
                    departmentName: undefined,
                    countyCode: undefined,
                    remoteEnable: undefined,
                    remoteId: undefined,
                    itemType: undefined,
                    itemTypeName: undefined,
                    itemCatalog: undefined,
                    serviceObject: undefined,
                    serviceObjectName: undefined,
                    implementOrgType: undefined,
                    implementOrgTypeName: undefined,
                    implementOrgId: undefined,
                    implementOrgName: undefined,
                    dealDeptId: undefined,
                    dealDeptName: undefined,
                    unionOrgId: undefined,
                    unionOrgName: undefined,
                    unionOrgApplySituation: undefined,
                    execLevel: undefined,
                    execLevelName: undefined,
                    powerSource: undefined,
                    powerSourceName: undefined,
                    dealType: undefined,
                    dealTypeName: undefined,
                    generalRange: undefined,
                    generalRangeName: undefined,
                    mold: undefined,
                    moldName: undefined,
                    askTel: undefined,
                    superviseTel: undefined,
                    isOnlineApply: undefined,
                    isInterService: undefined,
                    numLimit: undefined,
                    firstTrialDept: undefined,
                    provinceFirsetTrialDept: undefined,
                    finalTrialDept: undefined,
                    provinceFinalTrialDept: undefined,
                    centralFinalTrialDept: undefined,
                    reportApprovalDept: undefined,
                    provinceReportApprovalDept: undefined,
                    resultExample: undefined,
                    resultName: undefined,
                    legalBasis: undefined,
                    acceptCondition: undefined,
                    applicationCondition: undefined,
                    acceptTime: undefined,
                    acceptPlace: undefined,
                    yearReviewInspection: undefined,
                    yearReviewInspectionName: undefined,
                    yearReviewInspectionNum: undefined,
                    yearReviewInspectionNumName: undefined,
                    isCharge: undefined,
                    chargeStandard: undefined,
                    chargeBasis: undefined,
                    lawComptime: undefined,
                    provinceLawComptime: undefined,
                    promiseComptime: undefined,
                    provincePromiseComptime: undefined,
                    siteNum: undefined,
                    specialSegment: undefined,
                    handleWorkflow: undefined,
                    departmentTreePosition: undefined,
                    implementTreePosition: undefined,
                    dealTreePosition: undefined,
                    unionTreePosition: undefined
                },
                itemTmp: undefined,
                itemRules: {
                    name: [
                        {required: true, whiteSpace: true, message: this.$t("table.pleaseInput") + '事项名称'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'},
                        {validator: validateWhiteSpace, trigger: 'blur'}
                    ],
                    shortName: [
                        {required: true, whiteSpace: true, message: this.$t("table.pleaseInput") + '事项简称'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'},
                        {validator: validateWhiteSpace, trigger: 'blur'}
                    ],
                    code: [
                        {required: true, whiteSpace: true, message: this.$t("table.pleaseInput") + '事项编码'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'},
                        {validator: validateWhiteSpace, trigger: 'blur'}
                    ],
                    remoteEnable: [
                        {required: true, message: this.$t("table.pleaseInput") + '是否第三方'}
                    ],
                    remoteId: [
                        {required: false, whiteSpace: true, message: this.$t("table.pleaseInput") + '第三方事项'},
                        {min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur'}
                    ],
                    askTel: [
                        {validator: validateTel, trigger: 'change'}
                    ],
                    superviseTel: [
                        {validator: validateTel, trigger: 'change'}
                    ],
                    siteNum: [
                        {required: true, message: this.$t("table.pleaseInput") + '到现场次数'},
                        {validator: validateSiteNum, trigger: 'change'}
                    ],
                    isCharge: [
                        {required: true, message: this.$t("table.pleaseSelect") + '是否收费'}
                    ],
                    isOnlineApply: [
                        {required: true, message: this.$t("table.pleaseSelect") + '是否可以在线申报'}
                    ],
                    isInterService: [
                        {required: true, message: this.$t("table.pleaseSelect") + '是否有中介服务'}
                    ],
                    serviceObject: [
                        {required: true, message: this.$t("table.pleaseSelect") + '实施对象'}
                    ],
                    remark: [
                        {min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur'}
                    ]
                },
                selectedRows: [],
                dialogVisible: false,
                dialogTitle: undefined,
                submitLoading: false,
                yesEnum: undefined,
                noEnum: undefined,
                dialogPreorderConfigVisible: false,
                preorderConfig: {
                    id: undefined,
                    itemId: undefined,
                    timeId: undefined,
                    count: undefined,
                    days: undefined
                },
                preorderConfigRules: {
                    count: [
                        {validator: isInteger, trigger: 'blur'}
                    ],
                    days: [
                        {validator: isInteger, trigger: 'blur'}
                    ]
                },
                preorder: {
                    preorderConfigList: undefined
                },
                preorderConfigVo: {
                    count: undefined,
                    days: undefined,
                    timeId: undefined,
                    timeSlot:undefined,
                    id: undefined
                },
                dialogFormLoading: undefined,
                itemIds: [],
                timeSlot: undefined,
                counts: undefined,
                preorderConfigId: undefined,
                preorder1: undefined,
                departmentCascader: [],
                materialsListQuery: {
                    page: this.$store.state.common.page,
                    size: this.$store.state.common.size,
                    itemId: undefined,
                    materialsName: undefined,
                    materialsVersion: undefined,
                    showRelatedFlag: undefined
                },
                currentItemRow: undefined,
                dialogItemMaterialsVisible: undefined,
                // 最终选中保存的信息
                selectAllMaterialsId: [],
                selectAllMaterialsNum: [],
                showRelatedFlag: undefined,
                materialsList: [],
                materialsTotal: undefined,
                selectedItemMaterials: undefined,
                downloadHandleWorkflow: undefined,
                downloadResultExample: undefined,
                materialsVersionList: [],
                dialogPreauditConfigVisible: false,
                preauditConfig: {
                    itemId: undefined,
                    userIds: undefined,
                    preauditDays: 1
                },
                preauditConfigRules: {
                    userIds: [
                        {validator: isSelected, message: this.$t("table.pleaseSelect") + '预审用户', trigger: 'change'}
                    ]
                },
                userList: [],
                selectedUserIds: [],
                dialogDeliveryConfigVisible: false,
                itemDelivery: {
                    id: undefined,
                    itemId: undefined,
                    handType: undefined,
                    takeType: undefined
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
                    create: this.permission.item_create,
                    update: this.permission.item_update,
                    delete: this.permission.item_delete,
                    preorderConfig: this.permission.item_preorder_config,
                    preauditConfig: this.permission.item_preaudit_config,
                    associateMaterials: this.permission.item_associate_materials,
                    deliveryConfig: this.permission.item_delivery_config
                };
            }
        },
        created() {
            this.reloadList();
            this.getPreorderTime();
            this.getDepartmentCascader();
        },
        methods: {
            handleSizeChangeItemMaterials(val) {
                this.materialsListQuery.size = val;
                this.loadMaterialsList().then(() => {
                    this.checkRelatedMaterialsRows();
                });
            },
            closeItemMaterialsDialog() {
                this.dialogItemMaterialsVisible = false;
                this.submitLoading = false;
            },
            doSaveItemMaterials() {
                this.submitLoading = true;
                console.log('提交数据');
                console.dir(this.selectAllMaterialsNum);
                setItemMaterials(this.currentItemRow.id, this.selectAllMaterialsNum).then(() => {
                    this.closeItemMaterialsDialog();
                    this.$message.success(this.$t("table.associateSuccess"));
                    this.reloadList();
                }).catch(() => {
                    this.submitLoading = false;
                })
            },
            handleSelectionChangeItemMaterials(rows) {
                this.selectedItemMaterials = rows;
            },
            materialsNumChange() {
                for (let material of this.materialsList) {
                    let i = this.selectAllMaterialsId.indexOf(material.id);
                    if (i > 0) {
                        this.selectAllMaterialsNum[i] = material.id + '_' + material.materialsNum;
                    }
                }
                console.log('change');
                console.dir(this.selectAllMaterialsId);
                console.dir(this.selectAllMaterialsNum);
            },
            // materialsNumKeyup() {
            //     for (let material of this.materialsList) {
            //         material.materialsNum = material.materialsNum.replace(/[^\.\d]/g,'');
            //     }
            // },
            selectAllMaterials(selection) {
                if (selection.length > 0) {
                    for (let material of this.materialsList) {
                        if (this.selectAllMaterialsId.indexOf(material.id) < 0) {
                            this.selectAllMaterialsId.push(material.id);
                            this.selectAllMaterialsNum.push(material.id + '_' + material.materialsNum);
                        }
                    }
                } else {
                    for (let material of this.materialsList) {
                        let i = this.selectAllMaterialsId.indexOf(material.id);
                        if (i >= 0) {
                            this.selectAllMaterialsId.splice(i, 1);
                            this.selectAllMaterialsNum.splice(i, 1);
                        }
                    }
                }
                console.log('all');
                console.dir(this.selectAllMaterialsId);
                console.dir(this.selectAllMaterialsNum);
            },
            selectRowMaterials(selection, row) {
                let i = this.selectAllMaterialsId.indexOf(row.id);
                if (i < 0) {
                    this.selectAllMaterialsId.push(row.id);
                    this.selectAllMaterialsNum.push(row.id + '_' + row.materialsNum);
                } else {
                    this.selectAllMaterialsId.splice(i, 1);
                    this.selectAllMaterialsNum.splice(i, 1);
                }
                console.log('select');
                console.dir(this.selectAllMaterialsId);
                console.dir(this.selectAllMaterialsNum);
            },
            checkRelatedMaterialsRows() {
                this.$nextTick(() => {
                    if (this.selectAllMaterialsId && this.selectAllMaterialsId.length > 0) {
                        for (let row of this.materialsList) {
                            if (this.selectAllMaterialsId.includes(row.id)) {
                                this.$refs['itemMaterialsTable'].toggleRowSelection(row, true)
                                let i = this.selectAllMaterialsId.indexOf(row.id);
                                let idNum = this.selectAllMaterialsNum[i].split('_');
                                row.materialsNum = idNum[1];
                            }
                        }
                    }
                });
            },
            loadMaterialsList() {
                return new Promise((resolve, reject) => {
                    this.dialogFormLoading = true;
                    getItemMaterialsList(this.materialsListQuery).then(response => {
                        this.dialogFormLoading = false;
                        this.materialsList = response.data.records;
                        this.materialsTotal = response.data.total;
                        resolve();
                    }).catch(err => {
                        reject(err);
                    })
                });
            },
            handleCurrentChangeItemMaterials(page) {
                this.materialsListQuery.page = page;
                this.loadMaterialsList().then(() => {
                    this.checkRelatedMaterialsRows();
                });
            },
            reloadMaterialsList() {
                this.handleCurrentChangeItemMaterials(1)
            },
            loadAllItemMaterials(query) {
                return new Promise((resolve, reject) => {
                    // 事项材料关联表 全部数据
                    getAllItemMaterials(query).then(response => {
                        resolve(response.data)
                    }).catch(err => {
                        reject(err)
                    })
                });
            },
            loadAssociatedMaterials(flag) {
                this.selectAllMaterialsId = [];
                this.selectAllMaterialsNum = [];
                this.loadAllItemMaterials(this.materialsListQuery).then(res => {
                    if (res && res.length > 0) {
                        for (let itemMaterials of res) {
                            // 保存所有已关联数据
                            this.selectAllMaterialsId.push(itemMaterials.materialsId)
                            this.selectAllMaterialsNum.push(itemMaterials.materialsId + '_' + itemMaterials.materialsNum);
                        }
                        console.dir(this.selectAllMaterialsId);
                        console.dir(this.selectAllMaterialsNum);
                        if (flag === 'init') {
                            this.materialsListQuery.showRelatedFlag = true;
                        }
                    } else {
                        if (flag === 'init') {
                            this.materialsListQuery.showRelatedFlag = false;
                        }
                    }
                    this.reloadMaterialsList();
                });
            },
            // 点击关联材料按钮
            btnItemMaterials(row) {
                // 选中的事项行
                this.currentItemRow = row;
                this.materialsListQuery.itemId = row.id;
                this.materialsListQuery.materialsName = undefined;
                this.materialsListQuery.materialsVersion = undefined;
                // 显示事项关联材料
                this.dialogItemMaterialsVisible = true;
                this.dialogFormLoading = false;
                this.selectAllMaterialsId = [];
                this.selectAllMaterialsNum = [];
                // 加载 事项材料关联表 全部数据
                this.loadAssociatedMaterials('init');
                // 加载事项材料的版本
                this.loadMaterialsVersionList().then(res => {
                    if (res) {
                        // 版本列表
                        this.materialsVersionList = res;
                        // 最新版本选中
                        this.materialsListQuery.materialsVersion = res[0];
                    }
                });
            },
            loadMaterialsVersionList() {
                return new Promise((resolve, reject) => {
                    getMaterialsVersion({"itemId" : this.currentItemRow.id}).then(response => {
                        resolve(response.data);
                    }).catch(err => {
                        reject(err);
                    })
                });
            },
            getUrl(url) {
                return window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + this.downloadUrl + url;
            },
            handleWorkflowUploadSuccess(response) {
                if (response.status === 200 && response.data.state === 'SUCCESS') {
                    this.item.handleWorkflow = response.data.url;
                    this.downloadHandleWorkflow = this.getUrl(response.data.url);
                    this.$forceUpdate();
                    this.$message.success('上传成功！');
                } else {
                    this.$message.error(response.message);
                }
            },
            resultExampleUploadSuccess(response) {
                if (response.status === 200 && response.data.state === 'SUCCESS') {
                    this.item.resultExample = response.data.url;
                    this.downloadResultExample = this.getUrl(response.data.url);
                    this.$forceUpdate();
                    this.$message.success('上传成功！');
                } else {
                    this.$message.error(response.message);
                }
            },
            uploadError() {
                this.$message.error("上传失败");
            },
            unionChange() {
                var v = this.item.unionTreePosition;
                if (v.length > 0) {
                    this.item.unionOrgId = v[v.length - 1];
                    this.item.unionOrgName = this.getDepartmentName(this.item.unionOrgId, this.departmentCascader);
                } else {
                    this.item.unionOrgId = undefined;
                    this.item.unionOrgName = undefined;
                }
            },
            dealChange() {
                var v = this.item.dealTreePosition;
                if (v.length > 0) {
                    this.item.dealDeptId = v[v.length - 1];
                    this.item.dealDeptName = this.getDepartmentName(this.item.dealDeptId, this.departmentCascader);
                } else {
                    this.item.dealDeptId = undefined;
                    this.item.dealDeptName = undefined;
                }
            },
            implementChange() {
                var v = this.item.implementTreePosition;
                if (v.length > 0) {
                    this.item.implementOrgId = v[v.length - 1];
                    this.item.implementOrgName = this.getDepartmentName(this.item.implementOrgId, this.departmentCascader);
                } else {
                    this.item.implementOrgId = undefined;
                    this.item.implementOrgName = undefined;
                }
            },
            departmentChange() {
                var v = this.item.departmentTreePosition;
                if (v.length > 0) {
                    this.item.departmentId = v[v.length - 1];
                    this.item.departmentName = this.getDepartmentName(this.item.departmentId, this.departmentCascader);
                } else {
                    this.item.departmentId = undefined;
                    this.item.departmentName = undefined;
                }
            },
            getDepartmentName(departmentId, childrenDepartment) {
                for (var i = 0; i < childrenDepartment.length; i++) {
                    var elment = childrenDepartment[i];
                    if (departmentId === elment.value) {
                        return elment.label;
                    } else {
                        if (elment.children) {
                            var name = this.getDepartmentName(departmentId, elment.children);
                            if (name) return name;
                        }
                    }
                }
                return undefined;
            },
            isChargeChange(){
                if (!this.item.isCharge) {
                    this.item.chargeStandard = '';
                    this.item.chargeBasis = '';
                }
            },
            yearReviewInspectionNumChange(){
                this.item.yearReviewInspectionNumName = this.getEnumName(this.item.yearReviewInspectionNum, 'YearReviewInspectionNumEnum');
            },
            yearReviewInspectionChange(){
                this.item.yearReviewInspectionName = this.getEnumName(this.item.yearReviewInspection, 'YearReviewInspectionEnum');
            },
            moldChange(){
                this.item.moldName = this.getEnumName(this.item.mold, 'AcceptSourceEnum');
            },
            generalRangeChange(){
                this.item.generalRangeName = this.getEnumName(this.item.generalRange, 'GeneralRangeEnum');
            },
            dealTypeChange(){
                this.item.dealTypeName = this.getEnumName(this.item.dealType, 'DealTypeEnum');
            },
            powerSourceChange(){
                this.item.powerSourceName = this.getEnumName(this.item.powerSource, 'PowerSourceEnum');
            },
            execLevelChange(){
                this.item.execLevelName = this.getEnumName(this.item.execLevel, 'ExecLevelEnum');
            },
            implementOrgTypeChange() {
                this.item.implementOrgTypeName = this.getEnumName(this.item.implementOrgType, 'ImplementOrgTypeEnum');
            },
            serviceObjectChange() {
                this.item.serviceObjectName = this.getEnumName(this.item.serviceObject, 'ServiceObjectEnum');
            },
            itemTypeChange() {
                this.item.itemTypeName = this.getEnumName(this.item.itemType, 'ItemTypeEnum');
            },
            getEnumName(code, name) {
                var enumArray = this.loadEnum(name);
                if (enumArray) {
                    for(var i = 0; i < enumArray.length; i++) {
                        if (code === enumArray[i].code) {
                            return enumArray[i].value;
                        }
                    }
                }
                return '';
            },
            getDepartmentCascader() {
                this.submitLoading = true;
                getDepartmentCascader().then(response => {
                    this.submitLoading = false;
                    this.departmentCascader = response.data;
                })
            },
            getPreorderTime(){
                getListByPreorderTime().then(response => {
                    this.preorder.preorderConfigList = response.data.reverse();
                    this.preorder1 = response.data;
                })
            },
            handleChange(value) {
                this.days = value
            },
            btnSearch() {
                this.listQuery.page = 1;
                this.reloadList();
            },
            changeDisplayOfRemoteId() {
                this.itemRules.remoteId[0].required = this.item.remoteEnable ? true : false;
                if (!this.item.remoteEnable)
                    this.item.remoteId = '';
            },
            loadEnum(name) {
                return getStore({name: 'enums'})[name]
            },
            resetSearch() {
                this.listQuery.name = undefined;
            },
            reloadList() {
                this.listLoading = true;
                this.itemList = undefined;
                this.total = undefined;
                getItemList(this.listQuery).then(response => {
                    this.listLoading = false;
                    this.itemList = response.data.records;
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
                this.itemTmp = {
                    name: '',
                    shortName: '',
                    code: ''
                };
                this.resetItem();
                this.dialogTitle = 'create';
                this.dialogVisible = true;
            },
            btnUpdate(row) {
                this.resetItem();
                if (row.id) {
                    this.item = deepClone(row);
                } else {
                    this.item = deepClone(this.selectedRows[0]);
                }
                this.itemTmp = {
                    name: this.item.name,
                    shortName: this.item.shortName,
                    code: this.item.code
                };
                // 所属部门
                if (this.item.departmentTreePosition) {
                    this.item.departmentTreePosition = this.item.departmentTreePosition.substr(1).split('&')
                } else {
                    this.item.departmentTreePosition = [];
                }
                if (this.item.departmentId) {
                    this.item.departmentTreePosition.push(this.item.departmentId);
                }
                // 实施主体
                if (this.item.implementTreePosition) {
                    this.item.implementTreePosition = this.item.implementTreePosition.substr(1).split('&')
                } else {
                    this.item.implementTreePosition = [];
                }
                if (this.item.implementOrgId) {
                    this.item.implementTreePosition.push(this.item.implementOrgId);
                }
                // 实施机构
                if (this.item.dealTreePosition) {
                    this.item.dealTreePosition = this.item.dealTreePosition.substr(1).split('&')
                } else {
                    this.item.dealTreePosition = [];
                }
                if (this.item.dealDeptId) {
                    this.item.dealTreePosition.push(this.item.dealDeptId);
                }
                // 联办机构
                if (this.item.unionTreePosition) {
                    this.item.unionTreePosition = this.item.unionTreePosition.substr(1).split('&')
                } else {
                    this.item.unionTreePosition = [];
                }
                if (this.item.unionOrgId) {
                    this.item.unionTreePosition.push(this.item.unionOrgId);
                }
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
                this.$refs['itemDialogForm'].validate(valid => {
                    if (valid) {
                        this.submitLoading = true;
                        createOrUpdateItem(this.item).then(() => {
                            this.resetItemDialogAndList();
                            this.$message.success(this.$t("table.createSuccess"));
                        })
                    } else {
                        return false;
                    }
                });
            },
            doUpdate() {
                this.$refs['itemDialogForm'].validate(valid => {
                    if (valid) {
                        this.submitLoading = true;
                        createOrUpdateItem(this.item).then(() => {
                            this.resetItemDialogAndList();
                            this.$message.success(this.$t("table.updateSuccess"));
                        })
                    } else {
                        return false;
                    }
                })
            },
            doDelete(ids) {
                this.listLoading = true;
                delItems(ids).then(() => {
                    this.reloadList();
                    this.$message.success(this.$t("table.deleteSuccess"));
                })
            },
            resetItem() {
                this.item = {
                    id: undefined,
                    name: undefined,
                    shortName: undefined,
                    code: undefined,
                    remoteEnable: 0,
                    remoteId: '',
                    isOnlineApply: 0,
                    isInterService: 0,
                    isCharge: 0
                }
            },
            resetItemDialogAndList() {
                this.closeItemDialog();
                this.submitLoading = false;
                this.reloadList();
            },
            closeItemDialog() {
                this.dialogVisible = false;
                this.resetItem();
                this.$refs['itemDialogForm'].resetFields();
            },
            btnPreorderConfig(row) {
                this.dialogPreorderConfigVisible = true;
                this.dialogFormLoading = true;
                this.preorderConfig.itemId = row.id;
                this.itemIds = [];
                this.itemIds.push(row.id);
                getByPreorderConfig(this.preorderConfig).then(response => {
                    this.dialogFormLoading = false;
                    this.listLoading = false;
                    if (response.data.days != 0) {
                        this.preorderConfigId = response.data.id;
                    }else{
                        this.preorderConfigId = undefined;
                    }
                    this.days = response.data.days;
                    let arr = response.data.timeId.split(",");
                    let arr2 = response.data.count.split(",");
                    let timeSlot = this.preorder1;
                    let timeSlotNew = [];
                    let timeIdNew = [];
                    let countNew=new Array(timeSlot.length);
                    for (let selectedRow of timeSlot) {
                        timeSlotNew.push(selectedRow.id);
                        timeIdNew.push(selectedRow.timeSlot);
                    }
                    let timeSlotArr = timeSlotNew;
                    let timeIdArr = arr;
                    for (let i = 0; i < timeIdArr.length; i++) {
                        for (let j = 0; j < timeSlotArr.length; j++) {
                            if(timeSlotArr[j] === timeIdArr[i]){
                                countNew[j]=arr2[i]
                            }
                        }
                    }
                    let key = ['timeId', 'count','timeSlot','days'];
                    this.preorder.preorderConfigList = timeSlotNew.map(function (item, index) {
                        let obj = {};
                        obj[key[0]] = timeSlotNew[index];
                        obj[key[1]] = countNew[index];
                        obj[key[2]] = timeIdNew[index];
                        obj[key[3]] = 0;
                        return obj;
                    });
                })
            },
            btnPreorderConfigBatch() {
                this.dialogPreorderConfigVisible = true;
                this.dialogFormLoading = true;
                this.itemIds = [];
                for (let selectedRow of this.selectedRows) {
                    this.itemIds.push(selectedRow.id);
                }
                // 只选择一个
                if (this.itemIds.length == 1) {
                    this.preorderConfig.itemId = this.itemIds[0];
                }
                listByPreorderConfig(this.preorderConfig).then(response => {
                    this.dialogFormLoading = false;
                    this.listLoading = false;
                    this.preorder.preorderConfigList = response.data;
                })
            },
            closePreorderConfigDialog() {
                this.dialogPreorderConfigVisible = false;
                this.resetPreorderConfig();
                this.$refs['preorderConfigDialogForm'].resetFields();
            },
            resetPreorderConfig() {
                this.preorderConfig = {
                    id: undefined,
                    itemId: undefined,
                    timeId: undefined,
                    count: undefined,
                    days: undefined
                }
            },
            doSavePreorderConfig() {
                let list = this.preorder.preorderConfigList;
                let arr = [];
                let arr1 = [];
                let arr2 = [];
                for (let i in list) {
                    arr.push(list[i].timeId);
                    arr1.push(list[i].count);
                    arr2.push(list[i].timeSlot);
                }
                this.preorderConfigVo.timeId = arr.join(',');
                this.preorderConfigVo.timeSlot = arr2.join(',');
                this.preorderConfigVo.count = arr1.join(',');
                this.preorderConfigVo.days = this.days;
                this.preorderConfigVo.id = this.preorderConfigId;
                this.preorderConfigVo.itemIds = this.itemIds.join(',');
                this.$refs['preorderConfigDialogForm'].validate(valid => {
                    if(valid) {
                        this.submitLoading = true;
                        saveOrUpdate(this.preorderConfigVo).then(() => {
                            this.closePreorderConfigDialog();
                            this.$message.success(this.$t("table.updateSuccess"));
                            this.submitLoading = false;
                        }).catch(() => {
                            this.submitLoading = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
            btnPreauditConfig(row) {
                this.preauditConfig.itemId = row.id;
                this.dialogPreauditConfigVisible = true;
                this.dialogFormLoading = true;
                const query = {itemId : row.id}
                getAllItemPreaudit(query).then(response => {
                    if (response.data && response.data.length > 0) {
                        this.preauditConfig.preauditDays = response.data[0].preauditDays;
                        for (let itempPreaudit of response.data) {
                            this.selectedUserIds.push(itempPreaudit.userId);
                        }
                    }
                })
                getUsersByWindowAndDepartment().then(response => {
                    this.dialogFormLoading = false;
                    this.userList = response.data;
                })
            },
            closePreauditConfigDialog() {
                this.dialogPreauditConfigVisible = false;
                this.resetPreauditConfig();
                this.selectedUserIds = [];
                this.$refs['preauditConfigDialogForm'].resetFields();
            },
            resetPreauditConfig() {
                this.preauditConfig = {
                    itemId: undefined,
                    userIds: undefined,
                    preauditDays: 1
                }
            },
            doSavePreauditConfig() {
                this.$refs['preauditConfigDialogForm'].validate(valid => {
                    if (valid) {
                        this.submitLoading = true;
                        this.preauditConfig.userIds = this.selectedUserIds.join(",");
                        createItemPreaudit(this.preauditConfig).then(() => {
                            this.submitLoading = false;
                            this.closePreauditConfigDialog();
                            this.$message.success(this.$t("table.createSuccess"));
                        }).catch(() => {
                            this.submitLoading = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
            btnDeliveryConfig(row) {
                this.dialogDeliveryConfigVisible = true;
                this.dialogFormLoading = true;
                this.itemDelivery.itemId = row.id;
                this.itemDelivery.handType = [];
                this.itemDelivery.takeType = [];
                getItemDelivery({itemId: row.id}).then(response => {
                    this.dialogFormLoading = false;
                    if (response.data && response.data.id) {
                        this.itemDelivery = response.data;
                        this.itemDelivery.handType = this.itemDelivery.handType.split(',');
                        this.itemDelivery.takeType = this.itemDelivery.takeType.split(',');
                    }
                })
            },
            closeDeliveryConfigDialog() {
                this.dialogDeliveryConfigVisible = false;
                this.resetDeliveryConfig();
                this.$refs['deliveryConfigDialogForm'].resetFields();
            },
            resetDeliveryConfig() {
                this.itemDelivery = {
                    id: undefined,
                    itemId: undefined,
                    handType: undefined,
                    takeType: undefined
                }
            },
            doSaveDeliveryConfig() {
                this.$refs['deliveryConfigDialogForm'].validate(valid => {
                    if (valid) {
                        this.submitLoading = true;
                        this.itemDelivery.handType = this.itemDelivery.handType.join(',');
                        this.itemDelivery.takeType = this.itemDelivery.takeType.join(',');
                        createOrUpdateItemDelivery(this.itemDelivery).then(() => {
                            this.submitLoading = false;
                            this.closeDeliveryConfigDialog();
                            this.$message.success(this.$t("table.createSuccess"));
                        }).catch(() => {
                            this.submitLoading = false;
                        })
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>
<style>
    .upload-file {
        display: inline-block;
    }
    .show-file {
        margin-left: 10px;
    }
    .search{
        margin-bottom: 20px;
    }
    .dialog-keywords {
        width: 180px;
        display: inline-block;
        margin-right: 10px;
    }
</style>
