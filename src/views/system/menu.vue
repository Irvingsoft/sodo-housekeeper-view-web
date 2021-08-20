<template>
  <basic-container>
    <el-tabs v-model="menuRequest.clientId" @tab-click="handleSwitch">
      <el-tab-pane v-for="client in clientList" :name="client.clientId" class="tab-pane">
        <template #label>
          <el-tooltip class="item" effect="dark" :content="client.description" placement="top">
            <span>{{ client.name }}</span>
          </el-tooltip>
        </template>
        <el-form :inline="true" label-width="60px">
          <el-row>
            <el-col :xs="24" :sm="12" :md="5">
              <el-form-item label="关键字">
                <el-input v-model="menuRequest.content" placeholder="请输入关键字" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="5">
              <el-form-item>
                <el-button type="primary" @click="searchChange">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <avue-crud :option="option"
                   :table-loading="loading"
                   :data="data"
                   :ref="client.clientId"
                   v-model="form"
                   :permission="permissionList"
                   :before-open="beforeOpen"
                   @row-del="rowDel"
                   @row-update="rowUpdate"
                   @row-save="rowSave"
                   @selection-change="selectionChange"
                   @refresh-change="onLoad">
          <template slot="menuLeft">
            <el-button type="primary"
                       size="small"
                       icon="el-icon-plus"
                       v-if="permission.menu_add"
                       @click="handleNew">新增
            </el-button>
            <el-button type="danger"
                       size="small"
                       icon="el-icon-delete"
                       v-if="permission.menu_delete"
                       plain
                       @click="handleDelete">删 除
            </el-button>
          </template>
          <!--      // TODO    v-if="userInfo.authority.includes('admin')"-->
          <template slot-scope="{row}" slot="menu">
            <el-button
              type="text"
              icon="el-icon-circle-plus-outline"
              size="small"
              @click.stop="handleAdd(row)">
              新增子项
            </el-button>
          </template>
          <template slot-scope="{row}" slot="icon">
            <i :class="row.icon"></i>
          </template>
        </avue-crud>
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
import {listMenu, tree, insertMenu, deleteMenu, updateMenu, getMenu, deleteMenuList} from "@/api/system/menu";
import {mapGetters} from "vuex";
import iconList from "@/config/iconList";
import {listOauthClientBaseUse} from "@/api/system/client";
import func from "@/util/func";

export default {
  data() {
    let validateButtonType = (rule, value, callback) => {
      if (this.form.menuType === 2 && func.isEmpty(this.form.buttonType)) {
        callback(new Error('请选择按钮功能'));
      } else {
        callback();
      }
    };
    return {
      form: {},
      loading: true,
      selectionList: [],
      menuRequest: {
        clientId: "",
        content: "",
      },
      option: {
        tip: false,
        tree: true,
        border: true,
        selection: true,
        viewBtn: true,
        addBtn: false,
        menuWidth: 300,
        column: [
          {
            label: "菜单名称",
            prop: "name",
            width: 180,
            rules: [
              {
                required: true,
                message: "请输入菜单名称",
                trigger: "blur"
              }
            ]
          },
          {
            label: "路由地址",
            prop: "path",
            width: 200,
            rules: [
              {
                required: true,
                message: "请输入路由地址",
                trigger: "blur"
              }
            ]
          },
          {
            label: "上级菜单",
            prop: "parentId",
            type: "tree",
            hide: true,
            clearable: true,
            props: {
              label: "name",
              value: "menuId"
            },
            dicData: [],
          },
          {
            label: "菜单图标",
            prop: "icon",
            type: "icon",
            align: "center",
            slot: true,
            iconList: iconList,
            rules: [
              {
                required: true,
                message: "请输入菜单图标",
                trigger: "click"
              }
            ]
          },
          {
            label: "菜单代码",
            prop: "code",
            width: 150,
            rules: [
              {
                required: true,
                message: "请输入菜单编号",
                trigger: "blur"
              }
            ]
          },
          {
            label: "菜单类型",
            prop: "menuType",
            type: "radio",
            dicData: [
              {
                label: "菜单",
                value: 1
              },
              {
                label: "按钮",
                value: 2
              }
            ],
            hide: true,
            rules: [
              {
                required: true,
                message: "请选择菜单类型",
                trigger: "blur"
              }
            ]
          },
          {
            label: "按钮功能",
            prop: "buttonType",
            type: "radio",
            dicData: [
              {
                label: "工具栏",
                value: 1
              },
              {
                label: "操作栏",
                value: 2
              },
              {
                label: "工具操作栏",
                value: 3
              }
            ],
            hide: true,
            rules: [
              {
                validator: validateButtonType,
                trigger: "blur"
              }
            ]
          },
          {
            label: "菜单排序",
            prop: "sort",
            type: "number",
            rules: [
              {
                required: true,
                message: "请输入菜单排序",
                trigger: "blur"
              }
            ]
          },
          {
            label: "新窗口",
            prop: "newWindow",
            type: "radio",
            dicData: [
              {
                label: "否",
                value: false
              },
              {
                label: "是",
                value: true
              },
            ],
            hide: true
          },
          {
            label: "菜单备注",
            prop: "description",
            span: 24,
            minRows: 6,
            hide: true
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
    ...mapGetters(["userInfo", "permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.menu_add, false),
        viewBtn: this.vaildData(this.permission.menu_view, false),
        delBtn: this.vaildData(this.permission.menu_delete, false),
        editBtn: this.vaildData(this.permission.menu_edit, false)
      };
    },
    selectionMenuIdList() {
      let menuIdList = [];
      this.selectionList.forEach(menu => menuIdList.push(menu.menuId))
      return menuIdList;
    }
  },
  created() {
    this.listOauthClientBaseUse();
  },
  methods: {
    onLoad() {
      this.loading = true;
      listMenu(this.menuRequest).then(res => {
        this.data = res.data.data;
        this.loading = false;
        this.tree();
      });
    },
    listOauthClientBaseUse() {
      listOauthClientBaseUse().then(res => {
        this.clientList = res.data.data;
        this.menuRequest.clientId = this.clientList[0].clientId
        this.onLoad();
      })
    },
    tree() {
      tree(this.menuRequest.clientId).then(res => {
        this.findObject(this.option.column, "parentId").dicData = res.data.data;
      })
    },
    handleSwitch(tab, event) {
      this.menuRequest.clientId = tab.name;
      this.menuRequest.content = "";
      this.onLoad();
    },
    handleAdd(row) {
      this.$refs[this.menuRequest.clientId][0].value.parentId = row.menuId;
      this.$refs[this.menuRequest.clientId][0].option.column.filter(item => {
        if (item.prop === "parentId") {
          item.value = row.menuId;
          item.clearable = false;
          item.addDisabled = true;
        }
      });
      this.$refs[this.menuRequest.clientId][0].rowAdd();
    },
    handleNew() {
      this.form = {};
      this.$refs[this.menuRequest.clientId][0].option.column.filter(item => {
        item.value = "";
        if (item.prop === "parentId") {
          item.clearable = true;
          item.addDisabled = false;
        }
      });
      this.$refs[this.menuRequest.clientId][0].rowAdd();
    },
    rowSave(row, done, loading) {
      row.clientId = this.menuRequest.clientId;
      insertMenu(row).then(() => {
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
      if (row.menuId === row.parentId) {
        this.$message({
          type: "error",
          message: "父菜单不能为本身!"
        });
        loading();
        return;
      }
      updateMenu(row).then(() => {
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
          return deleteMenu(row.menuId);
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
    handleDelete() {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return deleteMenuList(this.selectionMenuIdList);
        })
        .then(() => {
          this.onLoad();
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.$refs.crud.toggleSelection();
        });
    },
    beforeOpen(done, type) {
      if (["edit", "view"].includes(type)) {
        getMenu(this.form.menuId).then(res => {
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
