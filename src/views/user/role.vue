<template>
  <basic-container>
    <el-tabs v-model="roleRequest.clientId" @tab-click="handleSwitch">
      <el-tab-pane v-for="client in clientList" :name="client.clientId" class="tab-pane">
        <template #label>
          <el-tooltip :content="client.description" class="item" effect="dark" placement="top">
            <span>{{ client.name }}</span>
          </el-tooltip>
        </template>
        <el-form :inline="true" label-width="60px">
          <el-row>
            <el-col :md="6" :sm="12" :xs="24">
              <el-form-item label="关键字">
                <el-input v-model="roleRequest.content" clearable placeholder="请输入关键字"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="6" :sm="12" :xs="24">
              <el-form-item>
                <el-button type="primary" @click="searchChange">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <avue-crud :ref="client.clientId"
                   v-model="form"
                   :before-open="beforeOpen"
                   :data="data"
                   :option="option"
                   :permission="permissionList"
                   :table-loading="loading"
                   @row-del="rowDel"
                   @row-update="rowUpdate"
                   @row-save="rowSave"
                   @selection-change="selectionChange"
                   @refresh-change="onLoad">
          <template slot="menuLeft">
            <el-button v-if="permission.role_add"
                       icon="el-icon-plus"
                       size="small"
                       type="primary"
                       @click="handleNew">新增
            </el-button>
            <el-button v-if="permission.role_delete"
                       icon="el-icon-delete"
                       plain
                       size="small"
                       type="danger"
                       @click="handleDelete">删 除
            </el-button>
            <el-button v-if="permission.role_delete"
                       icon="el-icon-user"
                       plain
                       plain
                       size="small"
                       type="info"
                       @click="handleRole">权限设置
            </el-button>
          </template>
          <template slot="menu" slot-scope="{row}">
            <el-button
              icon="el-icon-circle-plus-outline"
              size="small"
              type="text"
              @click.stop="handleAdd(row)">
              新增子项
            </el-button>
          </template>
        </avue-crud>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :before-close="cancel"
               :visible.sync="box"
               title="角色配置"
               width="20%">
      <el-tree ref="tree"
               :data="list"
               :default-checked-keys="defaultObj"
               :props="props"
               node-key="id"
               show-checkbox>
      </el-tree>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary"
                   @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
import {mapGetters} from "vuex";
import {listOauthClientBaseUse} from "@/api/system/client";
import {deleteRole, deleteRoleList, getRole, grant, insertRole, listRole, treeRole, updateRole} from "@/api/user/role";
import {listGrant, treeMenu} from "@/api/system/menu";

export default {
  data() {
    return {
      form: {},
      loading: true,
      box: false,
      props: {
        label: "name",
        value: "menuId"
      },
      list: [],
      defaultObj: [],
      selectionList: [],
      roleRequest: {
        clientId: "",
        content: "",
      },
      option: {
        tip: false,
        tree: true,
        border: true,
        index: true,
        selection: true,
        viewBtn: true,
        addBtn: false,
        menuWidth: 300,
        calcHeight: 210,
        column: [
          {
            label: "名称",
            prop: "name",
            width: 180,
            rules: [
              {
                required: true,
                message: "请输入角色名称",
                trigger: "blur"
              }
            ]
          },
          {
            label: "代码",
            prop: "code",
            width: 150,
            rules: [
              {
                required: true,
                message: "请输入角色别名",
                trigger: "blur"
              }
            ]
          },
          {
            label: "描述",
            prop: "description",
            width: 180,
          },
          {
            label: "上级角色",
            prop: "parentId",
            type: "tree",
            hide: true,
            clearable: true,
            props: {
              label: "name",
              value: "roleId"
            },
            dicData: [],
          },
          {
            label: "排序",
            prop: "sort",
            type: "number",
            rules: [
              {
                required: true,
                message: "请输入角色排序",
                trigger: "blur"
              }
            ]
          },
          {
            label: "创建时间",
            prop: "createAt",
            editDisplay: false,
            addDisplay: false,
            sortable: true,
            width: 130,
            align: "center",
          },
          {
            label: "更新时间",
            prop: "updateAt",
            editDisplay: false,
            addDisplay: false,
            sortable: true,
            width: 130,
            align: "center",
          },
        ]
      },
      data: [],
      clientList: [],
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.role_add, false),
        viewBtn: this.vaildData(this.permission.role_view, false),
        delBtn: this.vaildData(this.permission.role_delete, false),
        editBtn: this.vaildData(this.permission.role_edit, false)
      };
    },
    selectionRoleIdList() {
      let roleIdList = [];
      this.selectionList.forEach(role => roleIdList.push(role.roleId))
      return roleIdList;
    },
  },
  created() {
    this.listOauthClientBaseUse();
  },
  methods: {
    onLoad() {
      this.loading = true;
      listRole(this.roleRequest).then(res => {
        this.data = res.data.data;
        this.loading = false;
        this.treeRole();
      })
    },
    listOauthClientBaseUse() {
      listOauthClientBaseUse().then(res => {
        this.clientList = res.data.data;
        this.roleRequest.clientId = this.clientList[0].clientId
        this.onLoad();
      })
    },
    treeRole() {
      treeRole(this.roleRequest.clientId).then(res => {
        this.findObject(this.option.column, "parentId").dicData = res.data.data;
      })
    },
    handleSwitch(tab, event) {
      this.roleRequest.clientId = tab.name;
      this.roleRequest.content = "";
      this.onLoad();
    },
    handleAdd(row) {
      this.$refs[this.roleRequest.clientId][0].value.parentId = row.roleId;
      this.$refs[this.roleRequest.clientId][0].option.column.filter(item => {
        if (item.prop === "parentId") {
          item.value = row.roleId;
          item.clearable = false;
          item.addDisabled = true;
        }
      });
      this.$refs[this.roleRequest.clientId][0].rowAdd();
    },
    handleNew() {
      this.form = {};
      this.$refs[this.roleRequest.clientId][0].option.column.filter(item => {
        item.value = "";
        if (item.prop === "parentId") {
          item.clearable = true;
          item.addDisabled = false;
        }
      });
      this.$refs[this.roleRequest.clientId][0].rowAdd();
    },
    submit() {
      let data = {};
      data.roleIdList = this.selectionRoleIdList;
      data.menuIdList = this.$refs.tree.getCheckedKeys();
      grant(data).then(() => {
        this.box = false;
        this.$message({
          type: "success",
          message: "操作成功!"
        });
        this.onLoad();
      });
    },
    cancel() {
      this.box = false;
      this.$refs[this.roleRequest.clientId][0].toggleSelection();
    },
    rowSave(row, done, loading) {
      row.clientId = this.roleRequest.clientId;
      insertRole(row).then(() => {
        done();
        this.onLoad();
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      }, error => {
        window.console.log(error);
        loading();
      });
    },
    rowUpdate(row, index, done, loading) {
      if (row.roleId === row.parentId) {
        this.$message({
          type: "error",
          message: "父角色不能为本身!"
        });
        loading();
        return;
      }
      updateRole(row).then(() => {
        done();
        this.onLoad();
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      }, error => {
        window.console.log(error);
        loading();
      });
    },
    rowDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return deleteRole(row.roleId);
        })
        .then(() => {
          this.onLoad();
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
    },
    searchChange() {
      this.onLoad();
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    handleRole() {
      if (this.selectionList.length !== 1) {
        this.$message.warning("只能选择一条数据");
        return;
      }
      this.defaultObj = [];
      treeMenu(this.roleRequest.clientId)
        .then(res => {
          this.list = res.data.data;
          return listGrant(this.selectionRoleIdList);
        })
        .then(res => {
          this.defaultObj = res.data.data;
          this.box = true;
        });
    },
    handleDelete() {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return deleteRoleList(this.selectionRoleIdList);
      }).then(() => {
        this.onLoad();
        this.$message({
          type: "success",
          message: "操作成功!"
        });
        this.$refs[this.roleRequest.clientId][0].toggleSelection();
      }).catch(() => {
        this.$refs[this.roleRequest.clientId][0].toggleSelection();
      });
    },
    beforeOpen(done, type) {
      if (["edit", "view"].includes(type)) {
        getRole(this.form.roleId).then(res => {
          this.form = res.data.data;
        });
      }
      done();
    },
  }
};
</script>

<style>
.tab-pane {
  padding-top: 20px;
}
</style>
