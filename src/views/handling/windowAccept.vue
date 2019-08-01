<template>
    <basic-container v-loading.lock="progressing">
        <el-row :gutter="20">
            <!--左侧-->
            <el-col :span="8">
                <el-row>
                    <el-col :span="24">
                        <el-button
                                   v-if="btnEnable.query" type="primary"
                                   @click="searchCurrentAcceptData" style="margin-right: 20px"
                                   :size="searchSize">查询窗口正在呼叫的业务</el-button>
                        <span>窗口</span>
                        <span v-text="(windowVo.name ? ' - ' + windowVo.name: '')" style="color: blue;"></span>
                        <span style="margin-left: 20px">业务受理</span>
                        <span v-text="(callVo.orderNo ? ' - ' + callVo.orderNo : '')" style="color: blue;"></span>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <el-tabs value="1">
                            <el-tab-pane label="呼叫号查询" name="1">
                                <el-form :inline="true">
                                    <el-form-item>
                                        <el-input ref="viewFocus" v-model.trim="query.orderNo" placeholder="请输入呼叫号" :size="searchSize" maxlength="10" style="width:260px" clearable=""></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button v-if="btnEnable.query" :size="searchSize" type="primary" icon="el-icon-search"  @click="searchOrderNoAcceptData" :disabled="!query.orderNo">查询</el-button>
                                    </el-form-item>
                                </el-form>
                            </el-tab-pane>
                            <el-tab-pane label="预审号查询" name="2">
                                <el-form :inline="true">
                                    <el-form-item>
                                        <el-input v-model.trim="query.workNo" placeholder="请输入预审号" :size="searchSize" maxlength="30" style="width:260px" clearable=""></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button v-if="btnEnable.query" :size="searchSize" type="primary" icon="el-icon-search"  @click="searchWorkNoAcceptData" :disabled="!query.workNo">查询</el-button>
                                    </el-form-item>
                                </el-form>
                            </el-tab-pane>
                            <el-tab-pane label="快递单号查询" name="3">
                                <el-form :inline="true">
                                    <el-form-item>
                                        <el-input v-model.trim="query.expressNo" placeholder="请输入快递单号" :size="searchSize" maxlength="30" style="width:260px" clearable=""></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button v-if="btnEnable.query" :size="searchSize" type="primary" icon="el-icon-search"  @click="searchExpressNoAcceptData" :disabled="!query.expressNo">查询</el-button>
                                    </el-form-item>
                                </el-form>
                            </el-tab-pane>
                        </el-tabs>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <el-collapse value="1" accordion>
                            <el-collapse-item :title="'窗口办理事项受理'" name="1">
                                <el-tabs v-model="serviceObject" @tab-click="serviceObjectChange">
                                    <el-tab-pane label="自然人" name="1" :disabled="naturalLegalDisabled" style="padding-bottom: 0;">
                                        <el-form ref="naturalPersonForm" :model="naturalPerson" :rules="naturalPersonRules" label-width="0px">
                                            <el-row v-show="categoryItemShowFlag">
                                                <el-col :span="12">
                                                    <el-form-item prop="selectedCategoryArray" :rules="categoryItemShowFlag ? naturalPersonRules.selectedCategoryArray : []">
                                                        <el-cascader v-model.trim="naturalPerson.selectedCategoryArray"
                                                                     :options="categoryList"
                                                                     @change="categoryChange"
                                                                     class="filter-item"
                                                                     :show-all-levels="true" clearable
                                                                     filterable
                                                                     expand-trigger="hover"
                                                                     :change-on-select="true"
                                                                     placeholder="请选择自然人分类" style="width:100%;">
                                                        </el-cascader>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="12" style="padding-left: 4px;">
                                                    <el-form-item prop="selectedItem" :rules="categoryItemShowFlag ? naturalPersonRules.selectedItem : []">
                                                        <el-select v-model.trim="naturalPerson.selectedItem"
                                                                   value-key="id"
                                                                   @change="itemChange"
                                                                   placeholder="请选择自然人事项"
                                                                   filterable
                                                                   style="width:100%;">
                                                            <el-option v-for="item in itemList"
                                                                       :label="item.name + ' ' + item.code"
                                                                       :value="item">
                                                            </el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row>
                                                <el-col :span="10">
                                                    <el-form-item prop="idcardNo">
                                                        <el-input v-model.trim="naturalPerson.idcardNo"
                                                                  placeholder="请输入自然人身份证号"
                                                                  maxlength="18"
                                                                  @keyup.native="toUpperCase"/>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="7" style="padding-left: 4px; padding-right: 4px">
                                                    <el-form-item prop="name">
                                                        <el-input v-model.trim="naturalPerson.name"
                                                                  placeholder="请输入自然人姓名"
                                                                  maxlength="20"/>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="7">
                                                    <el-form-item prop="phone">
                                                        <el-input v-model.trim="naturalPerson.phone"
                                                                  placeholder="请输入自然人手机号"
                                                                  maxlength="11"/>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                        </el-form>
                                    </el-tab-pane>

                                    <el-tab-pane label="法人" name="2" :disabled="naturalLegalDisabled">
                                        <el-form ref="legalPersonForm" :model="legalPerson" :rules="legalPersonRules" label-width="0px">
                                            <el-row v-show="categoryItemShowFlag">
                                                <el-col :span="12">
                                                    <el-form-item prop="selectedCategoryArray" :rules="categoryItemShowFlag ? legalPersonRules.selectedCategoryArray : []">
                                                        <el-cascader v-model.trim="legalPerson.selectedCategoryArray"
                                                                     :options="categoryList"
                                                                     @change="categoryChange"
                                                                     class="filter-item"
                                                                     :show-all-levels="true" clearable
                                                                     filterable
                                                                     expand-trigger="hover"
                                                                     :change-on-select="true"
                                                                     placeholder="请选择法人分类" style="width:100%;">
                                                        </el-cascader>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="12" style="padding-left: 4px;">
                                                    <el-form-item prop="selectedItem" :rules="categoryItemShowFlag ? legalPersonRules.selectedItem : []">
                                                        <el-select v-model.trim="legalPerson.selectedItem"
                                                                   value-key="id"
                                                                   @change="itemChange"
                                                                   placeholder="请选择法人事项"
                                                                   filterable
                                                                   style="width:100%;">
                                                            <el-option v-for="item in itemList"
                                                                       :label="item.name + ' ' + item.code"
                                                                       :value="item">
                                                            </el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row>
                                                <el-col :span="10">
                                                    <el-form-item prop="idcardNo">
                                                        <el-input v-model.trim="legalPerson.idcardNo"
                                                                  placeholder="请输入法人身份证号"
                                                                  maxlength="18"
                                                                  @keyup.native="toUpperCase"/>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="7" style="padding-left: 4px; padding-right: 4px">
                                                    <el-form-item prop="name">
                                                        <el-input v-model.trim="legalPerson.name"
                                                                  placeholder="请输入法人姓名"
                                                                  maxlength="20"/>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="7">
                                                    <el-form-item prop="phone">
                                                        <el-input v-model.trim="legalPerson.phone"
                                                                  placeholder="请输入法人手机号"
                                                                  maxlength="11"/>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row>
                                                <el-col :span="10">
                                                    <el-form-item prop="companyCode">
                                                        <el-input v-model.trim="legalPerson.companyCode"
                                                                  placeholder="请输入统一社会信用代码"
                                                                  maxlength="18"
                                                                  @keyup.native="toUpperCase"/>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="14" style="padding-left: 4px;">
                                                    <el-form-item prop="companyName">
                                                        <el-input v-model.trim="legalPerson.companyName"
                                                                  placeholder="请输入企业名称"
                                                                  maxlength="100"/>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row>
                                                <el-col :span="24">
                                                    <el-form-item prop="companyAddress">
                                                        <el-input v-model.trim="legalPerson.companyAddress"
                                                                  placeholder="请输入公司地址"
                                                                  maxlength="200"/>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                        </el-form>
                                    </el-tab-pane>
                                </el-tabs>
                            </el-collapse-item>
                        </el-collapse>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <el-tabs type="card" value="1" >
                            <el-tab-pane label="受理信息" name="1">
                                <table cellpadding="10px" style="border: 1px solid #ebeef5; width:100%;" border="1" v-show="callVo && callVo.id">
                                    <tr>
                                        <td class="td-class-1">呼叫号：</td>
                                        <td v-text="callVo.orderNo"></td>
                                    </tr>
                                    <tr>
                                        <td class="td-class-1">办理事项：</td>
                                        <td v-text="itemVo.name"></td>
                                    </tr>
                                    <tr>
                                        <td class="td-class-1">姓名：</td>
                                        <td v-text="identityVo.name"></td>
                                    </tr>
                                    <tr>
                                        <td class="td-class-1">手机：</td>
                                        <td v-text="identityVo.phone"></td>
                                    </tr>
                                    <tr v-if="preauditRecordVo && preauditRecordVo.workNo">
                                        <td class="td-class-1">预审号码：</td>
                                        <td v-text="preauditRecordVo.workNo"></td>
                                    </tr>
                                    <tr v-else>
                                        <td class="td-class-1">预审状态：</td>
                                        <td><span style="color: red;">无预审</span></td>
                                    </tr>
                                    <tr v-if="preauditRecordVo && preauditRecordVo.workNo">
                                        <td class="td-class-1">预审状态：</td>
                                        <td><span style="color: red;">{{preauditRecordVo.status | enums('PreauditStatusEnum')}}</span></td>
                                    </tr>
                                    <tr>
                                        <td class="td-class-1">排号状态：</td>
                                        <td>{{callVo.status | enums('CallStatusEnum')}}</td>
                                    </tr>
                                    <tr v-if="callVo && callVo.remark">
                                        <td class="td-class-1">备注：</td>
                                        <td v-text="callVo.remark"></td>
                                    </tr>
                                    <tr>
                                        <td class="td-class-1">受理窗口：</td>
                                        <td v-text="windowVo.name"></td>
                                    </tr>
                                    <tr v-if="userVo && userVo.name">
                                        <td class="td-class-1">工作人员:</td>
                                        <td v-text="userVo.name"></td>
                                    </tr>
                                    <tr>
                                        <td class="td-class-1">领号时间：</td>
                                        <td v-text="subTime(callVo.createTime)"></td>
                                    </tr>
                                    <tr>
                                        <td class="td-class-1">叫号时间：</td>
                                        <td v-text="subTime(callVo.callTime)"></td>
                                    </tr>
                                    <tr v-if="handlingRecordVo && handlingRecordVo.finishTime">
                                        <td class="td-class-1">完成时间：</td>
                                        <td v-text="subTime(handlingRecordVo.finishTime)"></td>
                                    </tr>
                                </table>
                            </el-tab-pane>
                        </el-tabs>
                    </el-col>
                </el-row>
            </el-col>



            <!--右侧开始-->
            <el-col :span="16">
                <el-tabs type="card" value="1" ><!--@tab-click="handleRightTabClick"-->
                    <el-tab-pane label="所需资料" name="1">
                        <p>勾选收取的材料：</p>
                        <el-table ref="materialsList"
                                  :data="materialsList"
                                  max-height="400"
                                  border
                                  style="width: 100%"
                                  @selection-change="handleMaterialSelectionChange" @cell-click="handleCellChange">
                            <el-table-column type="index" width="50"></el-table-column>
                            <el-table-column type="selection" width="55" v-if="selectionShow"></el-table-column>
                            <el-table-column prop="materialsName" label="材料" width="300">
                                <template slot-scope="scope">
                                    {{scope.row.materialsName}}
                                    <div v-if="scope.row.fileList" style="color:blue">
                                        资料：<a v-for="(file,index) in scope.row.fileList" style="color:blue;margin-right: 6px;"
                                                :href=" preauditRecordVo.aliId ? file.url : (downloadUrl + file.url)"
                                                target="_blank">[{{index + 1}}]</a>
                                    </div>
                                    <div v-else style="color:blue">
                                        资料：<a v-for="(url,index) in getUploadFileList(scope.row.id)" style="color:blue;margin-right: 6px;"
                                                :href="url" target="_blank">[{{index + 1}}]</a>
                                        <span style="color:red; font-weight:bold; cursor:pointer;" @click="deleteUploadFileList(scope.row.id)">&nbsp;X&nbsp;</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="materialsTypeName" label="类型"></el-table-column>
                            <el-table-column prop="materialsSubTypeName" label="子类型"></el-table-column>
                            <el-table-column prop="materialsFrom" label="来源"></el-table-column>
                            <el-table-column prop="materialsNum" label="数量"></el-table-column>
                            <el-table-column prop="materialsModeName" label="要求"></el-table-column>
                            <el-table-column prop="materialsUrl" label="上传资料">
                                <template slot-scope="scope">
                                    <el-upload name="file" class="upload-file" v-if="!scope.row.materialsUrl"
                                               :action="uploadUrl"
                                               :accept="imageAccepts"
                                               :show-file-list="false"
                                               :on-success="handleMaterialsUploadSuccess"
                                               :on-error="uploadError">
                                        <el-button type="primary" :size="searchSize">上传</el-button>
                                    </el-upload>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="事项信息" name="2">
                        <div>
                            <table cellpadding="10px" style="border: 1px solid #ebeef5; width:100%;" border="1">
                                <tr>
                                    <td class="td-class-1">办理事项：</td>
                                    <td v-text="itemVo.name"></td>
                                </tr>
                                <tr>
                                    <td class="td-class-1">实施机构：</td>
                                    <td v-text="itemVo.dealDeptName"></td>
                                </tr>
                                <tr>
                                    <td class="td-class-1">联办机构：</td>
                                    <td v-text="itemVo.unionOrgName"></td>
                                </tr>
                                <tr>
                                    <td class="td-class-1">办件类型：</td>
                                    <td v-text="itemVo.dealTypeName"></td>
                                </tr>
                                <tr>
                                    <td class="td-class-1">承诺时限：</td>
                                    <td v-text="itemVo.promiseComptime"></td>
                                </tr>
                                <tr>
                                    <td class="td-class-1">法定时限：</td>
                                    <td v-text="itemVo.lawComptime"></td>
                                </tr>
                                <tr>
                                    <td class="td-class-1">核准数量：</td>
                                    <td v-text="itemVo.numLimit"></td>
                                </tr>
                                <tr>
                                    <td class="td-class-1">是否收费：</td>
                                    <td>{{itemVo.isCharge | enums('YesNoEnum')}}</td>
                                </tr>
                                <tr>
                                    <td class="td-class-1">收费标准：</td>
                                    <td v-text="itemVo.chargeStandard"></td>
                                </tr>
                                <tr>
                                    <td class="td-class-1">收费依据：</td>
                                    <td v-text="itemVo.chargeBasis"></td>
                                </tr>
                                <tr>
                                    <td class="td-class-1">结果名称：</td>
                                    <td v-text="itemVo.resultName"></td>
                                </tr>
                                <tr>
                                    <td class="td-class-1">联系电话：</td>
                                    <td>{{itemVo.askTel}}</td>
                                </tr>
                                <tr>
                                    <td class="td-class-1">监督电话：</td>
                                    <td>{{itemVo.superviseTel}}</td>
                                </tr>
                                <tr>
                                    <td class="td-class-1">办理条件：</td>
                                    <td>
                                        <div style="white-space:pre-wrap" v-text="itemVo.acceptCondition"></div>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="内部办理流程图" name="3">
                        <img v-if="itemVo.handleWorkflow" :src="downloadUrl + itemVo.handleWorkflow"/>
                    </el-tab-pane>
                </el-tabs>
                <!--
                <ul v-if="hasHandling" style="list-style: none; padding: 0px; margin-top: 10px; margin-bottom: 10px;">
                    <li v-for="r in remarkArray">{{r}}</li>
                </ul>
                -->
                <div style="padding: 0px; margin-top: 10px; margin-bottom: 10px;">
                    <el-input ref="reasonRemark" type="textarea" :rows="3" maxlength="500" placeholder="备注理由" v-model="remark" :readonly="hasHandling"></el-input>
                </div>
                <div style="padding: 0px; margin-top: 10px; margin-bottom: 10px; ">
                    <el-row>
                        <el-col :span="24">
                            交件方式：<el-input v-model="handTypeText" placeholder="请选择交件方式"
                                           readonly icon="edit"
                                           @focus="showHandTypeDialog" style="width: auto; margin-right: 20px"></el-input>
                            取件方式：<el-input v-model="takeTypeText" placeholder="请选择取件方式"
                                           readonly icon="edit"
                                           @focus="showTakeTypeDialog" style="width: auto;"></el-input>
                        </el-col>
                        <!--:disabled="!itemVo.id"-->
                    </el-row>
                </div>
                <div>
                    <div style="display: inline-block" v-if="!hasHandling"><!--没有收件显示-->
                        <el-button type="primary"
                                   @click="pass">确认收件</el-button>

                        <el-button type="primary"
                                   :disabled="!hasPreaudit"
                                   @click="reject">不予受理</el-button><!--有预审才显示-->
                    </div>
                    <div style="display: inline-block" v-else><!--收件完成-->
                        <el-button type="primary"
                                   v-if="this.handlingRecordVo.status == this.handlingStatusProcessing"
                                   @click="ywsld" >打印业务受理单</el-button>

                        <el-button type="primary"
                                   v-if="this.handlingRecordVo.status == this.handlingStatusProcessing"
                                   @click="wlzyd" >打印物料转移单</el-button>

                        <el-button type="primary"
                                   v-if="this.handlingRecordVo.status == this.handlingStatusClose"
                                   @click="ycxgzd" >打印一次性告知单</el-button>
                    </div>

                    <div style="display: inline-block;margin-left: 10px">
                        <el-button type="primary" @click="reset">清空</el-button>
                    </div>
                </div>

            </el-col> <!--右侧结束-->
        </el-row>


        <el-dialog title="修改交件信息" :visible.sync="handTypeDialogVisible" :close-on-click-modal="closeOnClickModal" :show-close="false">
            <el-form ref="handTypeForm" :model="windowHandTypeVo" :rules="windowHandTypeRules" label-width="100px" label-position="right">
                <el-form-item label="交件方式" prop="handType">
                    <el-select v-model="windowHandTypeVo.handType">
                        <el-option v-for="item in getHandTypeList" :key="item.code" :value="item.code" :label="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="信包箱" prop="mailboxId" v-show="windowHandTypeVo.handType == 2" :rules="windowHandTypeVo.handType == 2 ? windowHandTypeRules.mailboxId : []">
                    <el-select v-model="windowHandTypeVo.mailboxId" style="width: 100%">
                        <el-option v-for="item in mailboxList" :key="item.id" :value="item.id" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="快递公司" prop="expressCompany" v-show="windowHandTypeVo.handType == 3" :rules="windowHandTypeVo.handType == 3 ? windowHandTypeRules.expressCompany : []">
                    <el-select v-model.trim="windowHandTypeVo.expressCompany">
                        <el-option v-for="item in expressCompanyList" :key="item.code" :value="item.code" :label="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="快递单号" prop="expressNumber" v-show="windowHandTypeVo.handType == 3" :rules="windowHandTypeVo.handType == 3 ? windowHandTypeRules.expressNumber : []">
                    <el-input v-model.trim="windowHandTypeVo.expressNumber" placeholder="请输入快递单号" maxlength="30" style="width: auto;" clearable></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="resetHandType">重 置</el-button>
                <el-button type="primary" icon="circle-check" @click="saveHandType">确 定</el-button>
            </div>
        </el-dialog>


        <el-dialog title="修改取件信息" :visible.sync="takeTypeDialogVisible" :close-on-click-modal="closeOnClickModal" :show-close="false">
            <el-form ref="takeTypeForm" :model="windowTakeTypeVo" :rules="windowTakeTypeRules" label-width="120px" label-position="right">
                <el-form-item label="取件方式" prop="takeType">
                    <el-select v-model="windowTakeTypeVo.takeType">
                        <el-option v-for="item in takeTypeList" :key="item.code" :value="item.code" :label="item.value"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="信包箱" prop="mailboxId" v-show="windowTakeTypeVo.takeType == 2" :rules="windowTakeTypeVo.takeType == 2 ? windowTakeTypeRules.mailboxId : []">
                    <el-select v-model="windowTakeTypeVo.mailboxId" style="width: 100%">
                        <el-option v-for="item in mailboxList" :key="item.id" :value="item.id" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="取件人姓名" prop="consigneeName" v-show="windowTakeTypeVo.takeType == 2" :rules="windowTakeTypeVo.takeType == 2 ? windowTakeTypeRules.consigneeName : []">
                    <el-input v-model.trim="windowTakeTypeVo.consigneeName" placeholder="请输入取件人姓名" maxlength="20" style="width: auto;" clearable></el-input>
                </el-form-item>
                <el-form-item label="取件人手机号" prop="consigneeMobile" v-show="windowTakeTypeVo.takeType == 2" :rules="windowTakeTypeVo.takeType == 2 ? windowTakeTypeRules.consigneeMobile : []">
                    <el-input v-model.trim="windowTakeTypeVo.consigneeMobile" placeholder="请输入取件人手机号" maxlength="11" style="width: auto;" clearable></el-input>
                </el-form-item>

                <el-form-item label="" v-if="windowTakeTypeVo.takeType == 3">
                    <el-switch v-model="windowTakeTypeVo.selectedVisible"
                               active-text="选择地址" inactive-text="添加地址"
                               @change="selectedVisibleChange"></el-switch>
                </el-form-item>

                <el-form-item label="姓名" prop="name" v-if="windowTakeTypeVo.takeType == 3 && !windowTakeTypeVo.selectedVisible" :rules="windowTakeTypeVo.takeType == 3 && !windowTakeTypeVo.selectedVisible ? windowTakeTypeRules.name : []">
                    <el-input v-model.trim="windowTakeTypeVo.name" placeholder="请输入姓名" maxlength="20" style="width: auto;" clearable></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone" v-if="windowTakeTypeVo.takeType == 3 && !windowTakeTypeVo.selectedVisible" :rules="windowTakeTypeVo.takeType == 3 && !windowTakeTypeVo.selectedVisible ? windowTakeTypeRules.phone : []">
                    <el-input v-model.trim="windowTakeTypeVo.phone" placeholder="请输入手机号" maxlength="11" style="width: auto;" clearable></el-input>
                </el-form-item>
                <el-form-item label="收件地址" prop="address" v-if="windowTakeTypeVo.takeType == 3 && !windowTakeTypeVo.selectedVisible" :rules="windowTakeTypeVo.takeType == 3 && !windowTakeTypeVo.selectedVisible ? windowTakeTypeRules.address : []">
                    <el-input v-model.trim="windowTakeTypeVo.address" placeholder="请输入收件地址" clearable></el-input>
                </el-form-item>

                <el-form-item label="收件地址" prop="addresseeId" v-if="windowTakeTypeVo.takeType == 3 && windowTakeTypeVo.selectedVisible" :rules="windowTakeTypeVo.takeType == 3 && windowTakeTypeVo.selectedVisible ? windowTakeTypeRules.addresseeId : []">
                    <el-card class="box-card">
                        <div v-for="item in memberAddressList" :key="item.id" class="card-item">
                            <el-radio v-model="windowTakeTypeVo.addresseeId" :label="item.id" @change="selectAddressChange">{{item.remark}}</el-radio>
                            <div class="p1">
                                <div class="box-text" v-text="item.name"></div>
                                <div class="box-text" v-text="item.phone"></div>
                                <div class="box-text" v-text="item.postCode"></div>
                                <span v-if="item.defaultAble">默认</span>
                            </div>
                            <p>{{item.address}}</p>
                        </div>
                        <div v-if="!memberAddressList || memberAddressList.length <= 0">没有任何收件地址信息</div>
                    </el-card>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button icon="circle-cross" type="danger" @click="resetTakeType">重 置</el-button>
                <el-button type="primary" icon="circle-check" @click="saveTakeType">确 定</el-button>
            </div>
        </el-dialog>
    </basic-container>
</template>


<script>
    import {mapGetters} from 'vuex';
    import {deepClone} from '@/util/util';
    import {getCategoryCascader} from "@/api/item/category";
    import {listItemsByCategoryId} from "@/api/item/categoryItem";
    import {getAcceptData, saveAcceptData, getRemoteItemAndMaterialsByRemoteId} from '@/api/handling/windowAccept';
    import {getStore} from '@/util/store';
    import {getItemAndNewestMaterialsByItemId} from '@/api/item/itemMaterials';
    import {cardid,isvalidatemobile,checkSocialCreditCode,isZipCode} from '@/util/validate';
    import {getAllMemberAddress} from '@/api/accept/memberAddress';
    import {getAllReceiveAdress} from '@/api/accept/receiveAdress';
    import {getAllMailbox} from '@/api/accept/mailbox';
    import {enums, parseToInt} from '@/filters/index';

    export default {
        name: 'windowAccept',
        data() {
            const validateIdcardNo = (rule, value, callback) => {
                let resultList = cardid(value);
                if (resultList[0]) {
                    callback(new Error(resultList[1]));
                    return;
                }
                this.loadMemberAddress(value)
                callback();
            };
            const validatePhone = (rule, value, callback) => {
                let resultList = isvalidatemobile(value);
                if (resultList[0]) {
                    callback(new Error(resultList[1]));
                    return;
                }
                callback();
            };
            const validateCompanyCode = (rule, value, callback) => {
                if (!checkSocialCreditCode(value)) {
                    callback(new Error('统一社会信用代码不正确'));
                    return;
                }
                callback();
            };
            return {
                progressing: false,
                // 事项分类列表是否显示
                categoryItemShowFlag: true,
                // 分类列表
                categoryList: [],
                // 事项列表
                itemList: [],
                // 材料版本
                materialsVersion: undefined,
                // 选中的分类编号
                selectedCategoryId: undefined,
                // 选中的事项编号
                selectedItemId: undefined,
                // 选中的材料
                selectedItemMaterials: [],
                remark: undefined,
                remarkArray: undefined,
                workNo: undefined,
                NATURAL: '1',
                LEGAL: '2',
                // 实施对象
                serviceObject: '1', // 2 法人
                // 自然人
                naturalPerson: {
                    selectedCategoryArray: [],
                    selectedItem: undefined,
                    selectedItemId: undefined,
                    idcardNo: undefined,
                    name: undefined,
                    phone: undefined
                },
                // 法人
                legalPerson: {
                    selectedCategoryArray: [],
                    selectedItemId: undefined,
                    companyName: undefined,
                    companyAddress: undefined,
                    companyCode: undefined,
                    idcardNo: undefined,
                    name: undefined,
                    phone: undefined
                },
                query: {
                    // 类型
                    type: undefined,
                    // 数据
                    data: undefined,
                    // 呼叫好
                    orderNo: undefined,
                    // 预审号
                    workNo: undefined,
                    // 快递单号
                    expressNo: undefined
                },
                callVo: {
                    id: undefined,
                    orderNo: undefined,
                    status: undefined,
                    remark: undefined,
                    preauditEnable: undefined,
                    preauditNumber: undefined,
                    createTime: undefined,
                    callTime: undefined
                },
                userVo: {
                    id: undefined,
                    name: undefined
                },
                identityVo: {
                    id: undefined,
                    name: undefined,
                    phone: undefined
                },
                windowVo: {
                    id: undefined,
                    name: undefined
                },
                preauditRecordVo: {
                    id: undefined,
                    aliId: undefined,
                    workNo: undefined,
                    status: undefined,
                    materialsVersion: undefined,
                    status: undefined,
                    memberId: undefined
                },
                handlingRecordVo: {
                    id: undefined,
                    workNo: undefined,
                    detail: undefined,
                    remark: undefined,
                    status: undefined,
                    finishTime: undefined
                },
                itemVo: {
                    id: undefined,
                    name: undefined,
                    remoteEnable: undefined,
                    remoteId: undefined,
                    serviceObject: undefined,
                    unionOrgName: undefined,
                    dealTypeName: undefined,
                    promiseComptime: undefined,
                    lawComptime: undefined,
                    numLimit: undefined,
                    isCharge: undefined,
                    chargeStandard: undefined,
                    chargeBasis: undefined,
                    resultName: undefined,
                    askTel: undefined,
                    superviseTel: undefined,
                    acceptCondition: undefined,
                    applicationCondition: undefined,
                    handleWorkflow: undefined
                },
                materialsList: [],
                uploadMaterialsList: [],
                uploadMaterialsRow: undefined,
                naturalPersonRules: {
                    selectedCategoryArray:[
                        {required: true, message: this.$t("table.pleaseSelect") + '自然人分类'}
                    ],
                    selectedItem:[
                        {required: true, message: this.$t("table.pleaseSelect") + '自然人事项'}
                    ],
                    idcardNo: [
                        {required: true, whiteSpace: true, message: this.$t("table.pleaseInput") + '自然人身份证号'},
                        {validator: validateIdcardNo, trigger: 'blur'}
                    ],
                    name: [
                        {required: true, whiteSpace: true, message: this.$t("table.pleaseInput") + '自然人姓名'}
                    ],
                    phone: [
                        {required: true, whiteSpace: true, message: this.$t("table.pleaseInput") + '自然人手机号'},
                        {validator: validatePhone, trigger: 'blur'}
                    ]
                },
                legalPersonRules: {
                    selectedCategoryArray:[
                        {required: true, message: this.$t("table.pleaseSelect") + '法人分类'}
                    ],
                    selectedItem:[
                        {required: true, message: this.$t("table.pleaseSelect") + '法人事项'}
                    ],
                    idcardNo: [
                        {required: true, whiteSpace: true, message: this.$t("table.pleaseInput") + '法人身份证号'},
                        {validator: validateIdcardNo, trigger: 'blur'}
                    ],
                    name: [
                        {required: true, whiteSpace: true, message: this.$t("table.pleaseInput") + '法人姓名'}
                    ],
                    phone: [
                        {required: true, whiteSpace: true, message: this.$t("table.pleaseInput") + '法人手机号'},
                        {validator: validatePhone, trigger: 'blur'}
                    ],
                    companyCode: [
                        {required: true, whiteSpace: true, message: this.$t("table.pleaseInput") + '统一社会信用代码'},
                        {validator: validateCompanyCode, trigger: 'blur'}
                    ],
                    companyName: [
                        {required: true, whiteSpace: true, message: this.$t("table.pleaseInput") + '企业名称'}
                    ],
                    companyAddress: [
                        {required: true, whiteSpace: true, message: this.$t("table.pleaseInput") + '公司地址'}
                    ]
                },
                handlingStatusProcessing: undefined,
                handlingStatusClose: undefined,
                handTypeList: [],
                takeTypeList: [],
                mailboxList: [],
                memberAddressList: [],
                receiveAdressList: [],
                windowHandTypeVoBack: undefined,
                windowHandTypeVo: {
                    // 交件方式
                    handTypeId: undefined,
                    handType: undefined,
                    // 信包箱
                    handMailboxId: undefined,
                    mailboxId: undefined,
                    // 邮寄
                    handPostId: undefined,
                    expressCompany: undefined,
                    expressNumber: undefined,
                    addresseeId: undefined,
                    // 信包箱邮寄
                    handMailboxPostId: undefined,
                    mailboxDeviceId: undefined,
                    mailboxName: undefined
                },
                windowHandTypeRules: {
                    handType: [
                        {required: true, message: '请选择交件方式', trigger: 'change'}
                    ],
                    mailboxId: [
                        {required: true, message: '请选择信包箱', trigger: 'change'}
                    ],
                    expressCompany: [
                        {required: true, message: '请选择快递公司', trigger: 'change'}
                    ],
                    expressNumber: [
                        {required: true, message: '请输入快递单号', trigger: 'change'}
                    ]
                },
                windowTakeTypeVoBack: undefined,
                windowTakeTypeVo: {
                    // 取件方式
                    takeTypeId: undefined,
                    takeType: undefined,
                    // 信包箱
                    takeMailboxId: undefined,
                    mailboxId: undefined,
                    consigneeName: undefined,
                    consigneeMobile: undefined,
                    // 邮寄
                    takePostId: undefined,
                    expressCompany: undefined,
                    expressNumber: undefined,
                    addresseeId: undefined,
                    // 地址
                    name: undefined,
                    phone: undefined,
                    address: undefined,
                    memberId: undefined, //身份证
                    selectedVisible: undefined
                },
                windowTakeTypeRules: {
                    takeType: [
                        {required: true, message: '请选择取件方式', trigger: 'change'}
                    ],
                    mailboxId: [
                        {required: true, message: '请选择信包箱', trigger: 'change'}
                    ],
                    consigneeName: [
                        {required: true, message: '请输入取件人姓名', trigger: 'change'}
                    ],
                    consigneeMobile: [
                        {required: true, message: '请输入取件人手机号', trigger: 'change'},
                        {validator: validatePhone, trigger: 'change'}
                    ],
                    name: [
                        {required: true, message: '请输入收件人姓名', trigger: 'change'}
                    ],
                    phone: [
                        {required: true, message: '请输入收件人手机号', trigger: 'change'},
                        {validator: validatePhone, trigger: 'change'}
                    ],
                    address: [
                        {required: true, message: '请输入收件地址', trigger: 'change'}
                    ],
                    addresseeId: [
                        {required: true, message: '请选择收件地址', trigger: 'change'}
                    ]
                },
                handTypeDialogVisible: false,
                takeTypeDialogVisible: false,
                takeTypeVo: null,
                handTypeVo: null
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
            getHandTypeList() {
                let list = [];
                // 信包箱交件
                if (this.windowHandTypeVo && this.windowHandTypeVo.handType == 2) {
                    for (let type of this.handTypeList) {
                        if (type.code == 1 || type.code == 3 || type.code == 2) {
                            list.push(type);
                        }
                    }
                    // 信包箱邮寄
                } else if (this.windowHandTypeVo && this.windowHandTypeVo.handType == 5) {
                    for (let type of this.handTypeList) {
                        if (type.code == 1 || type.code == 3 || type.code == 5) {
                            list.push(type);
                        }
                    }
                } else {
                    for (let type of this.handTypeList) {
                        if (type.code == 1 || type.code == 3) {
                            list.push(type);
                        }
                    }
                }
                return list;
            },
            downloadUrl() {
                // return this.$store.state.common.downloadUrl;
                return '';
            },
            uploadUrl() {
                return this.$store.state.common.uploadUrl;
            },
            imageAccepts() {
                return this.$store.state.common.imageAccepts;
            },
            btnEnable() {
                return {
                    query: this.permission.window_accept_manage,
                    pass: this.permission.window_accept_pass,
                    reject: this.permission.window_accept_reject
                };
            },
            // 有没有办件信息
            hasHandling() {
                return ( this.handlingRecordVo && ( this.handlingRecordVo.status == this.handlingStatusProcessing || this.handlingRecordVo.status == this.handlingStatusClose ) ) ? true : false;
            },
            // 有没有预审信息
            hasPreaudit() {
                return this.preauditRecordVo && this.preauditRecordVo.workNo ? true : false;
            },
            // 材料复选框
            selectionShow() {
                // 已收件不显示
                return ( this.handlingRecordVo && ( this.handlingRecordVo.status == this.handlingStatusProcessing || this.handlingRecordVo.status == this.handlingStatusClose ) ) ? false : true;
            },
            // 自然人法人编辑
            naturalLegalDisabled() {
                return ( (this.preauditRecordVo && this.preauditRecordVo.id) || (this.handlingRecordVo && this.handlingRecordVo.id) ) ? true : false;
            },
            expressCompanyList() {
                return getStore({name: 'enums'})['ExpressCompanyEnum'];
            },
            handTypeText() {
                if (this.windowHandTypeVo && this.windowHandTypeVo.handType){
                    return enums(this.windowHandTypeVo.handType, 'HandTypeEnum');
                }
                else {
                    return "";
                }
            },
            takeTypeText() {
                if (this.windowTakeTypeVo && this.windowTakeTypeVo.takeType)
                    return enums(this.windowTakeTypeVo.takeType, 'TakeTypeEnum');
                else
                    return "";
            }
        },
        created() {
            this.handlingStatusProcessing = this.getStatusValue('PROCESSING');
            this.handlingStatusClose = this.getStatusValue('CLOSE');
            this.loadCategory();
            this.loadMailbox();
            this.loadReceiveAdress();
        },
        mounted() {

        },
        methods: {
            selectedVisibleChange() {
                this.$refs['takeTypeForm'].clearValidate();
            },
            getUploadFileList(id) {
                for (let m of this.uploadMaterialsList) {
                    if (id === m.id && m.materialsUrl) {
                        return m.materialsUrl.split(',');
                    }
                }
                return [];
            },
            deleteUploadFileList(id) {
                for (let m of this.uploadMaterialsList) {
                    if (id === m.id) {
                        m.materialsUrl = undefined;
                        break;
                    }
                }
            },
            // 加载分类
            loadCategory() {
                getCategoryCascader().then(response => {
                    this.categoryList = response.data;
                })
            },
            // 分类变更
            categoryChange(value) {
                if (value.length > 0) {
                    // 设置选中的分类编号
                    this.selectedCategoryId = value[value.length - 1];
                    // 根据分类编号和实施对象检索事项
                    this.loadItem(this.selectedCategoryId, this.serviceObject);
                }
            },
            // 加载事项
            loadItem(categoryId, serviceObject) {
                if (!categoryId) return;
                // 根据分类编号和实施对象检索事项，注意：仅仅检索了需要的几个字段
                listItemsByCategoryId({categoryId,serviceObject}).then(response => {
                    this.itemList = response.data;
                });
            },
            // 事项改变
            itemChange(item) {
                // 设置选中的事项编号
                this.selectedItemId = item.id;
                // 远程事项
                if (item.remoteEnable && item.remoteEnable == 1) {
                    this.loadItemAndMaterials(this.selectedItemId, item.remoteId);
                } else {
                    this.loadItemAndMaterials(this.selectedItemId, undefined);
                }
            },
            // 加载事项关联的材料
            loadItemAndMaterials(itemId, remoteId) {
                this.progressing = true;
                // 有远程事项
                if (remoteId) {
                    // 查询远程事项和材料
                    getRemoteItemAndMaterialsByRemoteId({remoteId}).then(response => {
                        this.progressing = false;
                        let rd = response.data;
                        if (response.status == 200 && rd) {
                            // 清除检索结果
                            this.clearQueryResult();
                            // 事项
                            this.itemVo = rd.itemVo;
                            // 事项材料
                            this.materialsList = rd.materialsList;
                            this.uploadMaterialsList = [];
                            // 事项交取件方式
                            if (rd.itemDeliveryVo) {
                                // 交件列表
                                this.handTypeList = this.getTypeList(rd.itemDeliveryVo.handType, 'HandTypeEnum');
                                // 取件列表
                                this.takeTypeList = this.getTypeList(rd.itemDeliveryVo.takeType, 'TakeTypeEnum');
                            }
                        }
                    }, reject => {
                        this.progressing = false;
                    });
                } else {
                    getItemAndNewestMaterialsByItemId({itemId}).then(response => {
                        this.progressing = false;
                        let rd = response.data;
                        if (response.status == 200 && rd) {
                            // 清除检索结果
                            this.clearQueryResult();
                            // 事项
                            this.itemVo = rd.itemVo;
                            // 事项材料版本
                            this.materialsVersion = rd.materialsVersion;
                            // 事项材料
                            this.materialsList = rd.materialsList;
                            this.uploadMaterialsList = [];
                            // 事项交取件方式
                            if (rd.itemDeliveryVo) {
                                // 交件列表
                                this.handTypeList = this.getTypeList(rd.itemDeliveryVo.handType, 'HandTypeEnum');
                                // 取件列表
                                this.takeTypeList = this.getTypeList(rd.itemDeliveryVo.takeType, 'TakeTypeEnum');
                            }
                        }
                    }, reject => {
                        this.progressing = false;
                    });
                }
            },
            // 实施对象变更
            serviceObjectChange() {
                let selectedCategoryArray = undefined;
                if (this.naturalPerson.selectedCategoryArray && this.naturalPerson.selectedCategoryArray.length > 0)
                    selectedCategoryArray = this.naturalPerson.selectedCategoryArray;
                if (this.legalPerson.selectedCategoryArray && this.legalPerson.selectedCategoryArray.length > 0)
                    selectedCategoryArray = this.legalPerson.selectedCategoryArray;

                // 清除自然人信息
                this.$refs['naturalPersonForm'].resetFields();
                // 清除法人信息
                this.$refs['legalPersonForm'].resetFields();

                // 保留已经选择的分类，已经选中的分类编号不动
                if (this.serviceObject === this.NATURAL) {
                    this.naturalPerson.selectedCategoryArray = selectedCategoryArray;
                }
                if (this.serviceObject === this.LEGAL) {
                    this.legalPerson.selectedCategoryArray = selectedCategoryArray;
                }
                // 清除事项下拉框
                this.itemList = [];
                // 清除选中的事项编号
                this.selectedItemId = undefined;
                // 清除选中事项的材料版本
                this.materialsVersion = undefined;
                // 显示分类和事项下拉框
                this.categoryItemShowFlag = true;
                // 清除检索结果
                this.clearQueryResult();
                // 根据分类编号和实施对象检索事项
                this.loadItem(this.selectedCategoryId, this.serviceObject);
            },
            // 清除检索结果
            clearQueryResult() {
                this.remark = undefined;
                this.deleteValue(this.callVo);
                this.deleteValue(this.userVo);
                this.deleteValue(this.identityVo);
                this.deleteValue(this.windowVo);
                this.deleteValue(this.preauditRecordVo);
                this.deleteValue(this.handlingRecordVo);
                this.deleteValue(this.itemVo);
                this.materialsList = [];
                this.uploadMaterialsList = [];
                this.handTypeList = [];
                this.takeTypeList = [];
                this.windowHandTypeVoBack = undefined;
                this.deleteValue(this.windowHandTypeVo);
                this.windowTakeTypeVoBack = undefined;
                this.deleteValue(this.windowTakeTypeVo);
                this.memberAddressList = [];
            },
            // 删除对象的值
            deleteValue(obj) {
                Object.keys(obj).forEach(key => obj[key] = undefined);
            },
            // 根据当前的受理查询
            searchCurrentAcceptData() {
                this.searchAcceptData('current', '');
            },
            // 根据呼叫号码查询
            searchOrderNoAcceptData() {
                this.query.workNo = undefined;
                this.query.expressNo = undefined;
                this.searchAcceptData('orderNo', this.query.orderNo);
            },
            // 根据预审号码查询
            searchWorkNoAcceptData() {
                this.query.orderNo = undefined;
                this.query.expressNo = undefined;
                this.searchAcceptData('workNo', this.query.workNo);
            },
            // 根据快递单号码查询
            searchExpressNoAcceptData() {
                this.query.orderNo = undefined;
                this.query.workNo = undefined;
                this.searchAcceptData('expressNo', this.query.expressNo);
            },
            // 根据条件查询
            searchAcceptData(type,data) {
                this.progressing = true;
                this.query.type = type;
                this.query.data = data;
                let q = {type, data};
                getAcceptData(q).then(response => {
                    this.setSearchData(response);
                }, reject => {
                    let orderNo = this.query.orderNo;
                    let workNo = this.query.workNo;
                    let expressNo = this.query.expressNo;
                    this.reset();
                    this.query.orderNo = orderNo;
                    this.query.workNo = workNo;
                    this.query.expressNo = expressNo;
                    this.progressing = false;
                });
            },
            // 设置页面数据
            setSearchData(response) {
                this.progressing = false;
                if (response.status == 200 && response.data) {
                    this.$nextTick(() => {
                        this.$refs.viewFocus.focus();
                    });
                    // 清除自然人信息
                    this.$refs['naturalPersonForm'].resetFields();
                    // 清除法人信息
                    this.$refs['legalPersonForm'].resetFields();
                    this.clearQueryResult();
                    let rd = response.data;
                    console.log('返回数据');
                    console.dir(rd);
                    if (rd.callVo && rd.callVo.id) {
                        this.callVo = rd.callVo;
                        this.query.orderNo = this.callVo.orderNo;
                        this.query.workNo = this.callVo.preauditNumber;
                    }
                    if (rd.userVo && rd.userVo.id) this.userVo = rd.userVo;
                    if (rd.identityVo && rd.identityVo.id)  this.identityVo = rd.identityVo;
                    if (rd.windowVo && rd.windowVo.id)  this.windowVo = rd.windowVo;
                    if (rd.preauditRecordVo && rd.preauditRecordVo.id) this.preauditRecordVo = rd.preauditRecordVo;
                    if (rd.handlingRecordVo && rd.handlingRecordVo.id) this.handlingRecordVo = rd.handlingRecordVo;
                    if (rd.itemVo && rd.itemVo.id) this.itemVo = rd.itemVo;
                    if (rd.itemDeliveryVo) {
                        this.handTypeList = this.getTypeList(rd.itemDeliveryVo.handType, 'HandTypeEnum');
                        this.takeTypeList = this.getTypeList(rd.itemDeliveryVo.takeType, 'TakeTypeEnum');
                    }
                    if (rd.windowHandTypeVo) {
                        this.windowHandTypeVo = rd.windowHandTypeVo;
                        this.windowHandTypeVoBack = deepClone(this.windowHandTypeVo);
                    }
                    if (rd.windowTakeTypeVo) {
                        this.windowTakeTypeVo = rd.windowTakeTypeVo;
                        this.windowTakeTypeVoBack = deepClone(this.windowTakeTypeVo);
                    }
                    if (rd.memberAddressList) this.memberAddressList = rd.memberAddressList;

                    let hasDetail = false;
                    if (this.preauditRecordVo.workNo) {
                        this.workNo = this.preauditRecordVo.workNo;
                        if (rd.aliNaturalLegalInfo) {
                            this.setDetail(rd.aliNaturalLegalInfo);
                            hasDetail = true;
                        }
                    }
                    if (this.handlingRecordVo.id) {
                        this.setDetail(this.handlingRecordVo.detail);
                        hasDetail = true;
                        this.workNo = this.handlingRecordVo.workNo;
                        this.remark = this.handlingRecordVo.remark;
                        if (this.remark) {
                            this.remarkArray = this.remark.split(/\r?\n/);
                        }
                    }
                    this.materialsVersion = rd.materialsVersion;
                    this.materialsList = rd.materialsList;
                    this.uploadMaterialsList = [];
                    // 不显示分类和事项
                    this.categoryItemShowFlag = false;
                    if (!hasDetail) {
                        // 实施对象
                        this.serviceObject = this.itemVo.serviceObject.toString();
                    }
                } else {
                    let orderNo = this.query.orderNo;
                    let workNo = this.query.workNo;
                    let expressNo = this.query.expressNo;
                    this.reset();
                    this.query.orderNo = orderNo;
                    this.query.workNo = workNo;
                    this.query.expressNo = expressNo;
                    this.categoryItemShowFlag = true;
                }

            },
            getTypeList(type, name) {
                if (!type) return [];
                let list = [];
                let typeArray = type.split(',');
                let enumArray = getStore({name: 'enums'})[name];
                for(let i = 0; i < enumArray.length; i++) {
                    for (let j = 0; j < typeArray.length; j++) {
                        if (enumArray[i].code == Number(typeArray[j]) && enumArray[i].code != 4) {
                            list.push(enumArray[i]);
                            break;
                        }
                    }
                }
                return list;
            },
            // 设置自然人法人信息
            setDetail(v) {
                if (!v) return;
                let detail = JSON.parse(v);
                // 实施对象
                this.serviceObject = detail.serviceObject.toString();
                if (this.serviceObject === this.NATURAL) {
                    this.naturalPerson.idcardNo = detail.idcardNo;
                    this.naturalPerson.name = detail.name;
                    this.naturalPerson.phone = detail.phone;
                }
                if (this.serviceObject === this.LEGAL) {
                    this.legalPerson.idcardNo = detail.idcardNo;
                    this.legalPerson.name = detail.name;
                    this.legalPerson.phone = detail.phone;
                    this.legalPerson.companyCode = detail.companyCode;
                    this.legalPerson.companyName = detail.companyName;
                    this.legalPerson.companyAddress = detail.companyAddress;
                }
            },
            // 确认收件
            pass() {
                let len = this.selectedItemMaterials.length;
                let msg = '';
                if (len > 0) {
                    msg = '确认已经收件（' + len + '项），是否确认并交由部门处理？'
                } else {
                    msg = '您没有勾选收件！！，是否确定直接提交部门处理？';
                }
                this.submitAcceptData(msg, this.handlingStatusProcessing);
            },
            // 不予受理
            reject() {
                if (!this.remark) {
                    this.$message.error('请填写不予受理的理由！');
                    this.$refs.reasonRemark.focus();
                    return;
                }
                let len = this.selectedItemMaterials.length;
                let msg = '';
                if (len > 0) {
                    msg = '确认已经退还材料（' + len + '项），确认不予受理吗？'
                } else {
                    msg = '您没有勾选退还材料！！，确定不予受理吗？';
                }
                this.submitAcceptData(msg, this.handlingStatusClose);
            },
            // 保存数据
            submitAcceptData(msg, status) {
                // 验证结果
                let isValidOk = true;
                let validMsg = "";
                // 提交的数据
                let data = {};
                // 详情
                let detail = {};
                // 实施对象
                detail.serviceObject = this.serviceObject;
                // 自然人
                if (this.serviceObject === this.NATURAL) {
                    this.$refs['naturalPersonForm'].validate(valid => {
                        isValidOk = isValidOk & valid;
                        if (!valid) {
                            if (validMsg) validMsg += "， ";
                            validMsg += "自然人信息有误";
                            // this.$message.error("自然人信息有误");
                        }
                    });
                    detail.idcardNo = this.naturalPerson.idcardNo;
                    detail.name = this.naturalPerson.name;
                    detail.phone = this.naturalPerson.phone;
                }
                // 法人
                if (this.serviceObject === this.LEGAL) {
                    this.$refs['legalPersonForm'].validate(valid => {
                        isValidOk = isValidOk & valid;
                        if (!valid) {
                            if (validMsg) validMsg += "， ";
                            validMsg += "法人信息有误";
                            // this.$message.error("法人信息有误");
                        }
                    });
                    detail.idcardNo = this.legalPerson.idcardNo;
                    detail.name = this.legalPerson.name;
                    detail.phone = this.legalPerson.phone;
                    detail.companyCode = this.legalPerson.companyCode;
                    detail.companyName = this.legalPerson.companyName;
                    detail.companyAddress = this.legalPerson.companyAddress;
                }
                // 交件
                if(!this.windowHandTypeVo ||
                   !this.windowHandTypeVo.handType) {
                    isValidOk = isValidOk & false;
                    if (validMsg) validMsg += "， ";
                    validMsg += "交件方式有误";
                } else {
                    if (this.windowHandTypeVo.handType == 2) {
                        if (!this.windowHandTypeVo.mailboxId) {
                            isValidOk = isValidOk & false;
                            if (validMsg) validMsg += "， ";
                            validMsg += "交件方式有误";
                        }
                    } else if (this.windowHandTypeVo.handType == 3) {
                        if (!this.windowHandTypeVo.expressCompany ||
                            !this.windowHandTypeVo.expressNumber) {
                            isValidOk = isValidOk & false;
                            if (validMsg) validMsg += "， ";
                            validMsg += "交件方式有误";
                        }
                    }
                }
                // 取件
                if (!this.windowTakeTypeVo ||
                    !this.windowTakeTypeVo.takeType) {
                    isValidOk = isValidOk & false;
                    if (validMsg) validMsg += "， ";
                    validMsg += "取件方式有误";
                } else {
                    if (this.windowTakeTypeVo.takeType == 2) {
                        if (!this.windowTakeTypeVo.mailboxId) {
                            isValidOk = isValidOk & false;
                            if (validMsg) validMsg += "， ";
                            validMsg += "取件方式有误";
                        }
                    } else if (this.windowTakeTypeVo.handType == 3) {
                        if (this.windowTakeTypeVo.selectedVisible) {
                            if (!this.windowTakeTypeVo.addresseeId) {
                                isValidOk = isValidOk & false;
                                if (validMsg) validMsg += "， ";
                                validMsg += "取件方式有误";
                            }
                        } else {
                            if (!this.windowTakeTypeVo.name ||
                                !this.windowTakeTypeVo.phone ||
                                !this.windowTakeTypeVo.address) {
                                isValidOk = isValidOk & false;
                                if (validMsg) validMsg += "， ";
                                validMsg += "取件方式有误";
                            }
                        }
                    }
                }
                if (!isValidOk) {
                    this.$message.error(validMsg);
                    return;
                }
                // 受理详情(自然人，法人)
                data.detailJson = JSON.stringify(detail);
                // 交件
                data.windowHandTypeJson = JSON.stringify(this.windowHandTypeVo);
                // 取件
                if (!this.windowTakeTypeVo.selectedVisible) {
                    this.windowTakeTypeVo.addresseeId = undefined;
                }
                data.windowTakeTypeJson = JSON.stringify(this.windowTakeTypeVo);
                // 检索类型
                data.type = this.query.type;
                // 检索条件
                data.data = this.query.data;

                // 分类和事项下拉列表显示时
                if (this.categoryItemShowFlag) {
                    // 事项编号
                    data.itemId = this.selectedItemId;
                } else {
                    // 事项编号
                    data.itemId = this.itemVo.id;
                }
                if (this.query.orderNo) {
                    data.callFlag = 'yes';
                } else {
                    data.callFlag = 'no';
                }
                // 有预审
                if (this.callVo.preauditNumber) {
                    data.workNo = this.preauditRecordVo.workNo;
                    data.materialsVersion = this.preauditRecordVo.materialsVersion;
                } else {
                    data.workNo = undefined;
                    // 远程事项没有版本
                    if (this.itemVo.remoteEnable && this.itemVo.remoteId) {
                        data.materialsVersion = 0;
                    } else {
                        data.materialsVersion = this.materialsVersion.toString();
                    }
                }
                // 办件状态
                data.status = status;
                // 选择的材料
                let materialsIds = [];
                for (const m of this.selectedItemMaterials) {
                    let materialsUrl = '';
                    for (const um of this.uploadMaterialsList) {
                        if (m.id === um.id) {
                            materialsUrl = um.materialsUrl;
                            break;
                        }
                    }
                    materialsIds.push(m.id + '_' + materialsUrl);
                }
                data.materialsIds = materialsIds.join(' ');
                // 审批意见
                data.remark = this.remark;
                console.log('提交数据');
                console.dir(data);
                this.$confirm(msg, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.progressing = true;
                    saveAcceptData(data).then(response => {
                        // 设置返回数据
                        this.setSearchData(response);
                        if (response.status == 200 && response.data) {
                            this.$message.success(this.$t("table.submitSuccess"));
                        }
                    }, reject => {
                        this.progressing = false;
                    });
                }).catch(() => {
                    this.progressing = false;
                    this.$message({type: 'info', message: '已取消提交'});
                });
            },
            getStatusValue(value) {
                let enumArray = getStore({name: 'enums'})['HandlingStatusEnum'];
                for(let i = 0; i < enumArray.length; i++) {
                    if (enumArray[i].var === value) {
                        return enumArray[i].code;
                    }
                }
            },
            // 清空
            reset() {
                // 呼叫号
                this.query.orderNo = undefined;
                // 预审号
                this.query.workNo = undefined;
                // 快递单号
                this.query.expressNo = undefined;
                this.query.type = undefined;
                this.query.data = undefined;
                // 清除检索结果
                this.clearQueryResult();
                // 清除自然人信息
                this.$refs['naturalPersonForm'].resetFields();
                // 清除法人信息
                this.$refs['legalPersonForm'].resetFields();
                // 显示分类和事项下拉框
                this.categoryItemShowFlag = true;
                // 交件
                this.windowHandTypeVoBack = undefined;
                this.deleteValue(this.windowHandTypeVo);
                // 取件
                this.windowTakeTypeVoBack = undefined;
                this.deleteValue(this.windowTakeTypeVo);
            },
            subTime(value) {
                if (value) {
                    return value.substring(0, value.length - 3);
                } else {
                    return value;
                }
            },
            // 资料选择
            handleMaterialSelectionChange(rows) {
                this.selectedItemMaterials = rows;
            },
            // 业务受理单-打印页面
            ywsld() {
                window.open('print/ywsld.html?workNo=' + this.workNo);
            },
            // 物料转移单-打印页面
            wlzyd() {
                window.open('print/wlzyd.html?workNo=' + this.workNo);
            },
            // 一次性告知单-打印页面
            ycxgzd() {
                window.open('print/ycxgzd.html?workNo=' + this.workNo);
            },
            toUpperCase() {
                if (this.naturalPerson.idcardNo) {
                    this.naturalPerson.idcardNo = this.naturalPerson.idcardNo.toUpperCase();
                }
                if (this.legalPerson.idcardNo) {
                    this.legalPerson.idcardNo = this.legalPerson.idcardNo.toUpperCase();
                }
                if (this.legalPerson.companyCode) {
                    this.legalPerson.companyCode = this.legalPerson.companyCode.toUpperCase();
                }
            },
            loadMailbox() {
                getAllMailbox().then(response => {
                    if (response.status == 200 && response.data) {
                        this.mailboxList = response.data;
                    }
                });
            },
            loadReceiveAdress() {
                getAllReceiveAdress().then(response => {
                    if (response.status == 200 && response.data) {
                        this.receiveAdressList = response.data;
                    }
                });
            },
            loadMemberAddress(idcardNo) {
                this.windowTakeTypeVo.memberId = idcardNo;
                let q = {};
                q.memberId = idcardNo;
                getAllMemberAddress(q).then(response => {
                    if (response.status == 200 && response.data) {
                        this.memberAddressList = response.data;
                    }
                });
            },
            showHandTypeDialog() {
                this.handTypeDialogVisible = true;
            },
            resetHandType() {
                if (this.windowHandTypeVoBack)
                    this.windowHandTypeVo = deepClone(this.windowHandTypeVoBack);
                else
                    this.deleteValue(this.windowHandTypeVo);
            },
            saveHandType() {
                this.$refs['handTypeForm'].validate(valid => {
                    if (!valid) {
                        this.$message.error("交件方式有误");
                    } else {
                        this.handTypeDialogVisible = false;
                    }
                });
            },
            showTakeTypeDialog() {
                this.takeTypeDialogVisible = true;
            },
            resetTakeType() {
                if (this.windowTakeTypeVoBack)
                    this.windowTakeTypeVo = deepClone(this.windowTakeTypeVoBack);
                else
                    this.deleteValue(this.windowTakeTypeVo);
            },
            saveTakeType() {
                this.$refs['takeTypeForm'].validate(valid => {
                    if (!valid) {
                        this.$message.error("取件方式有误");
                    } else {
                        this.takeTypeDialogVisible = false;
                    }
                });
            },
            selectAddressChange() {
                for(let addr of this.memberAddressList) {
                    if (this.windowTakeTypeVo.addresseeId == addr.id) {
                        this.windowTakeTypeVo.name = addr.name;
                        this.windowTakeTypeVo.phone = addr.phone;
                        this.windowTakeTypeVo.address = addr.address;
                        break;
                    }
                }
            },
            handleCellChange(row) {
                this.uploadMaterialsRow = row;
            },
            handleMaterialsUploadSuccess(response) {
                let id = this.uploadMaterialsRow.id;
                if (response.status === 200 && response.data.state === 'SUCCESS') {
                    this.setUploadMaterials(id, response.data.url);
                    // this.$forceUpdate();
                    this.$message.success('上传成功！');
                } else {
                    this.$message.error(response.message);
                }
                this.uploadMaterialsRow = undefined;
            },
            uploadError() {
                this.uploadMaterialsRow = undefined;
                this.$message.error("上传失败");
            },
            setUploadMaterials(id, url) {
                let hasId = false;
                for (let upload of this.uploadMaterialsList) {
                    if (id === upload.id) {
                        hasId = true;
                        let materialsUrl = upload.materialsUrl;
                        if (materialsUrl) {
                            materialsUrl += ',' + url;
                        } else {
                            materialsUrl = url;
                        }
                        upload.materialsUrl = materialsUrl;
                        break;
                    }
                }
                if (!hasId) {
                    let m = {};
                    m.id = id;
                    m.materialsUrl = url;
                    this.uploadMaterialsList.push(m);
                }
            }
        }
    }
</script>


<style rel="stylesheet/scss" lang="scss">

    .td-class-1 {
        background-color: #fafafa;
        width: 120px;
        text-align: right;
        padding-right: 4px;
    }
    .card-header {
        .card-item {
            border: none;
            margin: 0;
            width: 80%;
            float: left;
        }
        .el-button {
            float: right;
        }
    }

    .card-item {
        padding: 8px;
        margin: 8px 0;
        font-size: 14px;
        border: 1px solid #d0d0d0;
        height: 80px;
        .el-radio {
            height: 64px;
            line-height: 64px;
            text-align: center;
            width: 10%;
            float: left;
        }
        p {
            margin: 0;
            height: 32px;
            line-height: 32px;
            width: 88%;
            float: left;
        }
        .p1 {
            font-size: 16px;
            span {
                padding: 3px 6px;
                color: #dd1100;
                font-size: 14px;
                font-weight: normal;
                border: 1px solid #dd1100;
                border-radius: 3px;
            }
        }
    }

    .clearfix:before, .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

    .box-card {
        width: 100%;
        .el-card__body {
            padding: 0;
        }
        .card-body {
            padding: 12px;
        }
    }
    .box-text {
        display: inline-block;
        margin-right: 20px;
    }
    .upload-file {
        display: inline-block;
    }
</style>
