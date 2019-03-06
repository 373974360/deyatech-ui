<template>
  <basic-container>
    <div class="deyatech-container pull-auto">
      <div class="deyatech-menu">
        <div class="deyatech-menu_left">
          <el-button type="primary" :size="btnSize" @click="btnCreate" :disabled="selectedRows.length > 1">
            {{$t('table.create')}}
          </el-button>
          <el-button type="primary" :size="btnSize" @click="btnUpdate" :disabled="selectedRows.length != 1">
            {{$t('table.update')}}
          </el-button>
          <el-button type="danger" :size="btnSize" @click="btnDelete" :disabled="selectedRows.length < 1">
            {{$t('table.delete')}}
          </el-button>
        </div>
        <div class="deyatech-menu_right">
          <!--<el-button type="primary" icon="el-icon-edit" :size="btnSize" circle @click="btnUpdate"></el-button>
          <el-button type="danger" icon="el-icon-delete" :size="btnSize" circle @click="btnDelete"></el-button>-->
          <el-button icon="el-icon-refresh" :size="btnSize" circle @click="reloadList"></el-button>
        </div>
      </div>
    </div>

    <el-table :data="deptList" v-loading.body="listLoading" stripe border highlight-current-row
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center"/>
      <el-table-tree-column fixed :expand-all="false" child-key="children" levelKey="level" :indent-size="20"
                            parentKey="parentId" prop="name" label="部门名称" width="200">
        <template slot-scope="scope">
          <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
        </template>
      </el-table-tree-column>
      <el-table-column align="center" label="部门名称简称" prop="shortName"/>
      <el-table-column align="center" label="部门编码" prop="deptCode"/>
      <el-table-column align="center" label="上级部门编号" prop="parentId"/>
      <el-table-column align="center" label="树结构中的索引位置" prop="treePosition"/>
      <el-table-column align="center" label="排序号" prop="sortNo"/>
      <el-table-column prop="enable" :label="$t('table.enable')" align="center" width="90">
        <template slot-scope="scope">
          <el-tag :type="scope.row.enable | enums('Enable') | statusFilter">
            {{scope.row.enable | enums('Enable')}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="enable" class-name="status-col" :label="$t('table.operation')" align="center" width="150">
        <template slot-scope="scope">
          <el-button :title="$t('table.create')" type="primary" icon="el-icon-plus" :size="btnSize" circle
                     @click.stop.safe="btnCreate(scope.row)"></el-button>
          <el-button :title="$t('table.update')" type="primary" icon="el-icon-edit" :size="btnSize" circle
                     @click.stop.safe="btnUpdate(scope.row)"></el-button>
          <el-button :title="$t('table.delete')" type="danger" icon="el-icon-delete" :size="btnSize" circle
                     @click.stop.safe="btnDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogVisible"
               :close-on-click-modal="closeOnClickModal">
      <el-form ref="deptDialogForm" class="deyatech-form" :model="dept" label-position="right"
               label-width="80px" :rules="deptRules">
        <el-row :gutter="20" :span="24">
          <el-col :span="12">
            <el-form-item :label="$t('table.parent')">
              <el-cascader :options="deptCascader" v-model="deptTreePosition"
                           show-all-levels expand-trigger="hover" clearable
                           change-on-select></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('table.searchName')" prop="name">
              <el-input v-model="dept.name"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" :span="24">
          <el-col :span="12">
            <el-form-item label="部门名称简称" prop="shortName">
              <el-input v-model="dept.shortName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门编码" prop="deptCode">
              <el-input v-model="dept.deptCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20" :span="24">
          <el-col :span="12">
            <el-form-item label="树结构中的索引位置" prop="treePosition">
              <el-input v-model="dept.treePosition"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序号" prop="sortNo">
              <el-input v-model="dept.sortNo"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" :span="24">
          <el-col :span="24">
            <el-form-item :label="$t('table.remark')">
              <el-input type="textarea" v-model="dept.remark" :rows="3"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button v-if="dialogTitle=='create'" type="primary" :size="btnSize" @click="doCreate"
                           :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                <el-button v-else type="primary" :size="btnSize" @click="doUpdate" :loading="submitLoading">{{$t('table.confirm')}}</el-button>
                <el-button :size="btnSize" @click="dialogVisible = false">{{$t('table.cancel')}}</el-button>
            </span>
    </el-dialog>
  </basic-container>
</template>

<script>
  import {createOrUpdateDept, delDepts, getDeptCascader, getDeptTree} from '@/api/admin/dept';
  import {copyProperties} from '@/util/util';
  import {mapGetters} from 'vuex';

  export default {
    name: 'dept',
    data() {
      return {
        deptList: undefined,
        listLoading: true,
        dept: {
          id: undefined,
          name: undefined,
          shortName: undefined,
          deptCode: undefined,
          parentId: undefined,
          treePosition: undefined,
          sortNo: undefined
        },
        deptCascader: [],
        dialogVisible: false,
        dialogTitle: undefined,
        submitLoading: false,
        selectedRows: [],
        deptRules: {
          name: [
            {required: true, message: this.$t("table.pleaseInput") + '部门名称'}
          ],
          shortName: [
            {required: true, message: this.$t("table.pleaseInput") + '部门名称简称'}
          ],
          deptCode: [
            {required: true, message: this.$t("table.pleaseInput") + '部门编码'}
          ],
          parentId: [
            {required: true, message: this.$t("table.pleaseInput") + '上级部门编号'}
          ],
          treePosition: [
            {required: true, message: this.$t("table.pleaseInput") + '树结构中的索引位置'}
          ],
          sortNo: [
            {required: true, message: this.$t("table.pleaseInput") + '排序号'}
          ]
        }
      }
    },
    created() {
      this.reloadList();
    },
    computed: {
      deptTreePosition: {
        get() {
          if (this.dept.treePosition) {
            return this.dept.treePosition.split('&');
          }
        },
        set(v) {
          if (v.length > 0) {
            this.dept.parentId = v[v.length - 1];
            this.dept.treePosition = v.join('&') + "&" + this.dept.parentId;
          } else {
            this.dept.parentId = 0;
            this.dept.treePosition = undefined;
          }
        }
      },
      ...mapGetters([
        'titleMap',
        'enums',
        'closeOnClickModal',
        'searchSize',
        'btnSize'
      ])
    },
    methods: {
      reloadList() {
        this.listLoading = true;
        getDeptTree().then(response => {
          this.deptList = response.data;
          this.listLoading = false;
        })
      },
      getDeptCascader(id) {
        this.submitLoading = true;
        getDeptCascader(id).then(response => {
          this.submitLoading = false;
          this.deptCascader = response.data;
        })
      },
      handleSelectionChange(rows) {
        this.selectedRows = rows;
      },
      btnCreate(row) {
        this.resetDept();
        if (row.id) {
          if (row.treePosition != null) {
            this.dept.treePosition = row.treePosition + "&" + row.id;
          } else {
            this.dept.treePosition = "&" + row.id;
          }
          this.dept.parentId = row.id;
        } else {
          if (this.selectedRows.length == 1) {
            if (this.selectedRows[0].treePosition != null) {
              this.dept.treePosition = this.selectedRows[0].treePosition + "&" + this.selectedRows[0].id;
            } else {
              this.dept.treePosition = "&" + this.selectedRows[0].id;
            }
            this.dept.parentId = this.selectedRows[0].id;
          }
        }
        this.getDeptCascader(null);
        this.dialogTitle = 'create';
        this.dialogVisible = true;
      },
      btnUpdate(row) {
        this.resetDept();
        if (row.id) {
          this.dept = copyProperties(this.dept, row);
        } else {
          this.dept = copyProperties(this.dept, this.selectedRows[0]);
        }
        this.getDeptCascader(this.dept.id);
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
        this.$refs['deptDialogForm'].validate(valid => {
          if (valid) {
            this.submitLoading = true;
            createOrUpdateDept(this.dept).then(response => {
              this.resetDeptDialog();
              this.$message.success(this.$t("table.createSuccess"));
            })
          } else {
            return false;
          }
        })
      },
      doUpdate() {
        this.$refs['deptDialogForm'].validate(valid => {
          if (valid) {
            this.submitLoading = true;
            createOrUpdateDept(this.dept).then(response => {
              this.resetDeptDialog();
              this.$message.success(this.$t("table.updateSuccess"));
            })
          } else {
            return false;
          }
        })
      },
      doDelete(ids) {
        this.listLoading = true;
        delDepts(ids).then(response => {
          this.reloadList();
          this.$message.success(this.$t("table.deleteSuccess"));
        })
      },
      resetDept() {
        this.dept = {
          id: undefined,
          name: undefined,
          shortName: undefined,
          deptCode: undefined,
          parentId: undefined,
          treePosition: undefined,
          sortNo: undefined
        }
      },
      resetDeptDialog() {
        this.dialogVisible = false;
        this.resetDept();
        this.reloadList();
        this.submitLoading = false;
      }
    }
  }
</script>


