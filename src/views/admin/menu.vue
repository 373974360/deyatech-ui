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

    <el-table :data="menuList" v-loading.body="listLoading" stripe border highlight-current-row
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center"/>
      <el-table-tree-column fixed :expand-all="false" child-key="children" levelKey="level" :indent-size="20"
                            parentKey="parentId" prop="name" label="菜单名称" width="200">
        <template slot-scope="scope">
          <span class="link-type" @click='btnUpdate(scope.row)'>{{scope.row.name}}</span>
        </template>
      </el-table-tree-column>
      <el-table-column align="center" label="菜单类型(0:CURD;1:系统菜单;2:业务菜单;)" prop="type"/>
      <el-table-column align="center" label="上级菜单编号" prop="parentId"/>
      <el-table-column align="center" label="树结构中的索引位置" prop="treePosition"/>
      <el-table-column align="center" label="节点图标CSS类名" prop="icon"/>
      <el-table-column align="center" label="路由地址" prop="path"/>
      <el-table-column align="center" label="排序号" prop="sortNo"/>
      <el-table-column align="center" label="权限标识" prop="permission"/>
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
      <el-form ref="menuDialogForm" class="deyatech-form" :model="menu" label-position="right"
               label-width="80px" :rules="menuRules">
        <el-row :gutter="20" :span="24">
          <el-col :span="12">
            <el-form-item :label="$t('table.parent')">
              <el-cascader :options="menuCascader" v-model="menuTreePosition"
                           show-all-levels expand-trigger="hover" clearable
                           change-on-select></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('table.searchName')" prop="name">
              <el-input v-model="menu.name"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" :span="24">
          <el-col :span="12">
            <el-form-item label="菜单类型(0:CURD;1:系统菜单;2:业务菜单;)" prop="type">
              <el-input v-model="menu.type"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="树结构中的索引位置" prop="treePosition">
              <el-input v-model="menu.treePosition"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" :span="24">
          <el-col :span="12">
            <el-form-item label="节点图标CSS类名" prop="icon">
              <el-input v-model="menu.icon"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="路由地址" prop="path">
              <el-input v-model="menu.path"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" :span="24">
          <el-col :span="12">
            <el-form-item label="排序号" prop="sortNo">
              <el-input v-model="menu.sortNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权限标识" prop="permission">
              <el-input v-model="menu.permission"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" :span="24">
          <el-col :span="24">
            <el-form-item :label="$t('table.remark')">
              <el-input type="textarea" v-model="menu.remark" :rows="3"/>
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
  import {createOrUpdateMenu, delMenus, getMenuCascader, getMenuTree} from '@/api/admin/menu';
  import {copyProperties} from '@/util/util';
  import {mapGetters} from 'vuex';

  export default {
    name: 'menu',
    data() {
      return {
        menuList: undefined,
        listLoading: true,
        menu: {
          id: undefined,
          name: undefined,
          type: undefined,
          parentId: undefined,
          treePosition: undefined,
          icon: undefined,
          path: undefined,
          sortNo: undefined,
          permission: undefined
        },
        menuCascader: [],
        dialogVisible: false,
        dialogTitle: undefined,
        submitLoading: false,
        selectedRows: [],
        menuRules: {
          name: [
            {required: true, message: this.$t("table.pleaseInput") + '菜单名称'}
          ],
          type: [
            {required: true, message: this.$t("table.pleaseInput") + '菜单类型(0:CURD;1:系统菜单;2:业务菜单;)'}
          ],
          parentId: [
            {required: true, message: this.$t("table.pleaseInput") + '上级菜单编号'}
          ],
          treePosition: [
            {required: true, message: this.$t("table.pleaseInput") + '树结构中的索引位置'}
          ],
          icon: [
            {required: true, message: this.$t("table.pleaseInput") + '节点图标CSS类名'}
          ],
          path: [
            {required: true, message: this.$t("table.pleaseInput") + '路由地址'}
          ],
          sortNo: [
            {required: true, message: this.$t("table.pleaseInput") + '排序号'}
          ],
          permission: [
            {required: true, message: this.$t("table.pleaseInput") + '权限标识'}
          ]
        }
      }
    },
    created() {
      this.reloadList();
    },
    computed: {
      menuTreePosition: {
        get() {
          if (this.menu.treePosition) {
            return this.menu.treePosition.split('&');
          }
        },
        set(v) {
          if (v.length > 0) {
            this.menu.parentId = v[v.length - 1];
            this.menu.treePosition = v.join('&') + "&" + this.menu.parentId;
          } else {
            this.menu.parentId = 0;
            this.menu.treePosition = undefined;
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
        getMenuTree().then(response => {
          this.menuList = response.data;
          this.listLoading = false;
        })
      },
      getMenuCascader(id) {
        this.submitLoading = true;
        getMenuCascader(id).then(response => {
          this.submitLoading = false;
          this.menuCascader = response.data;
        })
      },
      handleSelectionChange(rows) {
        this.selectedRows = rows;
      },
      btnCreate(row) {
        this.resetMenu();
        if (row.id) {
          if (row.treePosition != null) {
            this.menu.treePosition = row.treePosition + "&" + row.id;
          } else {
            this.menu.treePosition = "&" + row.id;
          }
          this.menu.parentId = row.id;
        } else {
          if (this.selectedRows.length == 1) {
            if (this.selectedRows[0].treePosition != null) {
              this.menu.treePosition = this.selectedRows[0].treePosition + "&" + this.selectedRows[0].id;
            } else {
              this.menu.treePosition = "&" + this.selectedRows[0].id;
            }
            this.menu.parentId = this.selectedRows[0].id;
          }
        }
        this.getMenuCascader(null);
        this.dialogTitle = 'create';
        this.dialogVisible = true;
      },
      btnUpdate(row) {
        this.resetMenu();
        if (row.id) {
          this.menu = copyProperties(this.menu, row);
        } else {
          this.menu = copyProperties(this.menu, this.selectedRows[0]);
        }
        this.getMenuCascader(this.menu.id);
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
        this.$refs['menuDialogForm'].validate(valid => {
          if (valid) {
            this.submitLoading = true;
            createOrUpdateMenu(this.menu).then(response => {
              this.resetMenuDialog();
              this.$message.success(this.$t("table.createSuccess"));
            })
          } else {
            return false;
          }
        })
      },
      doUpdate() {
        this.$refs['menuDialogForm'].validate(valid => {
          if (valid) {
            this.submitLoading = true;
            createOrUpdateMenu(this.menu).then(response => {
              this.resetMenuDialog();
              this.$message.success(this.$t("table.updateSuccess"));
            })
          } else {
            return false;
          }
        })
      },
      doDelete(ids) {
        this.listLoading = true;
        delMenus(ids).then(response => {
          this.reloadList();
          this.$message.success(this.$t("table.deleteSuccess"));
        })
      },
      resetMenu() {
        this.menu = {
          id: undefined,
          name: undefined,
          type: undefined,
          parentId: undefined,
          treePosition: undefined,
          icon: undefined,
          path: undefined,
          sortNo: undefined,
          permission: undefined
        }
      },
      resetMenuDialog() {
        this.dialogVisible = false;
        this.resetMenu();
        this.reloadList();
        this.submitLoading = false;
      }
    }
  }
</script>


