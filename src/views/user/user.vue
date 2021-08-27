<template>
  <basic-container>
    <el-tabs v-model="userRequest.clientId" @tab-click="handleSwitch">
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
                <el-input v-model="userRequest.content" placeholder="请输入关键字" clearable></el-input>
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
                   :data="data.records"
                   :page="data"
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
            <el-button type="danger"
                       size="small"
                       icon="el-icon-delete"
                       plain
                       v-if="permission.user_delete"
                       @click="handleDelete">删 除
            </el-button>
            <el-button type="info"
                       size="small"
                       plain
                       icon="el-icon-user"
                       @click="handleGrant">角色配置
            </el-button>
            <el-button type="primary"
                       size="small"
                       plain
                       v-if="permission.user_reset"
                       icon="el-icon-refresh"
                       @click="handleReset">密码重置
            </el-button>
            <el-button type="success"
                       size="small"
                       plain
                       icon="el-icon-upload2"
                       @click="handleImport">导入
            </el-button>
            <el-button type="warning"
                       size="small"
                       plain
                       icon="el-icon-download"
                       @click="handleExport">导出
            </el-button>
          </template>
          <template slot="status" slot-scope="{row}">
            <el-tag type="success" effect="dark" v-if="row.status === 0">
              正常
            </el-tag>
            <el-tag type="warning" effect="dark" v-else-if="row.status === 1">
              审核
            </el-tag>
            <el-tag type="error" effect="dark" v-else-if="row.status === 2">
              冻结
            </el-tag>
            <el-tag type="info" effect="dark" v-else-if="row.status === -1">
              注销
            </el-tag>
          </template>
        </avue-crud>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="用户角色配置"
               append-to-body
               :visible.sync="roleBox"
               width="345px">
      <el-tree :data="roleGrantList"
               show-checkbox
               default-expand-all
               node-key="id"
               ref="treeRole"
               :default-checked-keys="roleTreeObj"
               :props="props">
      </el-tree>
      <span slot="footer" class="dialog-footer">
            <el-button @click="roleBox = false">取 消</el-button>
            <el-button type="primary"
                       @click="submitRole">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="用户数据导入"
               append-to-body
               :visible.sync="excelBox"
               width="555px">
      <avue-form :option="excelOption" v-model="excelForm" :upload-after="uploadAfter">
        <template slot="excelTemplate">
          <el-button type="primary" @click="handleTemplate()">
            点击下载<i class="el-icon-download el-icon--right"></i>
          </el-button>
        </template>
      </avue-form>
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  remove,
  update,
  add,
  resetPassword
} from "@/api/system/user";
import {mapGetters} from "vuex";
import {getToken} from '@/util/auth';
import {treeRole} from "@/api/user/role";
import {listOauthClientBaseUse} from "@/api/system/client";
import {
  deleteUser,
  deleteUserList,
  getUserInfoDetail,
  grant,
  insertUser,
  pageUserBaseDetail,
  updateUser
} from "@/api/user/user";
import gender from "@/const/gender";
import userStatus from "@/const/userStatus";

export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        callback();
      }
    };
    return {
      form: {},
      roleBox: false,
      excelBox: false,
      loading: true,
      selectionList: [],
      userRequest: {
        clientId: "",
        content: "",
        pageNum: 1,
        pageSize: 10,
      },
      props: {
        label: "name",
        value: "roleId"
      },
      roleGrantList: [],
      roleTreeObj: [],
      option: {
        height: 'auto',
        calcHeight: 210,
        searchShow: true,
        searchMenuSpan: 6,
        tip: false,
        border: true,
        index: true,
        selection: true,
        viewBtn: true,
        column: [
          {
            label: "ID",
            prop: "userId",
            addDisplay: false,
            editDisplay: false,
            width: 250
          },
          {
            label: "账号",
            prop: "username",
            editDisabled: true,
            rules: [{
              required: true,
              message: "请输入账号",
              trigger: "blur"
            }],
            width: 100
          },
          {
            label: "OpenID",
            prop: "openId",
            hide: true,
            addDisplay: false,
            editDisplay: false,
          },
          {
            label: '密码',
            prop: 'password',
            hide: true,
            editDisplay: false,
            viewDisplay: false,
            rules: [{required: true, validator: validatePass, trigger: 'blur'}]
          },
          {
            label: "用户姓名",
            prop: "name",
            rules: [{
              required: true,
              message: "请输入用户姓名",
              trigger: "blur"
            }]
          },
          {
            label: "昵称",
            prop: "nickname",
          },
          {
            label: "状态",
            prop: "status",
            sortable: true,
            width: 70,
            align: "center",
            type: "radio",
            dicData: userStatus,
          },
          {
            label: "电话",
            prop: "phone",
            rules: [{
              required: true,
              message: "请输入用户昵称",
              trigger: "blur"
            }],
            width: 100
          },
          {
            label: "邮箱",
            prop: "email",
            overHidden: true,
            rules: [{
              required: true,
              message: "请输入用户昵称",
              trigger: "blur"
            }],
            width: 100
          },
          {
            label: "所属角色",
            prop: "roleIdList",
            multiple: true,
            type: "tree",
            dicData: [],
            props: {
              label: "name",
              value: "roleId"
            },
            slot: true,
            checkStrictly: true,
            rules: [{
              required: true,
              message: "请选择所属角色",
              trigger: "click"
            }],
            overHidden: true,
            width: 150,
          },
          {
            label: "性别",
            prop: "gender",
            type: "select",
            align: "center",
            dicData: gender,
            width: 50,
          },
          {
            label: "描述",
            prop: "description",
            span: 24
          },
        ]
      },
      data: [],
      excelForm: {},
      excelOption: {
        submitBtn: false,
        emptyBtn: false,
        column: [
          {
            label: '模板上传',
            prop: 'excelFile',
            type: 'upload',
            drag: true,
            loadText: '模板上传中，请稍等',
            span: 24,
            propsHttp: {
              res: 'data'
            },
            tip: '请上传 .xls,.xlsx 标准格式文件',
            action: "/api/blade-userinfo/import-userinfo"
          },
          {
            label: '模板下载',
            prop: 'excelTemplate',
            formslot: true,
            span: 24,
          }
        ]
      },
      clientList: [],
    };
  },
  computed: {
    ...mapGetters(["userInfo", "permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.user_add, false),
        viewBtn: this.vaildData(this.permission.user_view, false),
        delBtn: this.vaildData(this.permission.user_delete, false),
        editBtn: this.vaildData(this.permission.user_edit, false)
      };
    },
    selectionUserIdList() {
      let userIdList = [];
      this.selectionList.forEach(user => userIdList.push(user.userId))
      return userIdList;
    }
  },
  created() {
    this.listOauthClientBaseUse();
  },
  methods: {
    onLoad() {
      this.loading = true;
      this.pageUserBaseDetail();
    },
    pageUserBaseDetail() {
      pageUserBaseDetail(this.userRequest).then(res => {
        this.data = res.data.data;
        this.loading = false;
        this.treeRole();
      })
    },
    listOauthClientBaseUse() {
      listOauthClientBaseUse().then(res => {
        this.clientList = res.data.data;
        this.userRequest.clientId = this.clientList[0].clientId
        this.onLoad();
      })
    },
    treeRole() {
      treeRole(this.userRequest.clientId).then(res => {
        this.findObject(this.option.column, "roleIdList").dicData = res.data.data;
      })
    },
    handleSwitch(tab, event) {
      this.userRequest.clientId = tab.name;
      this.userRequest.content = "";
      this.onLoad();
    },
    submitRole() {
      let data = {};
      data.userIdList = this.selectionUserIdList;
      data.roleIdList = this.$refs.treeRole.getCheckedKeys();
      grant(data).then(() => {
        this.roleBox = false;
        this.$message({
          type: "success",
          message: "操作成功!"
        });
        this.onLoad();
      });
    },
    rowSave(row, done, loading) {
      row.clientId = this.userRequest.clientId;
      insertUser(row).then(() => {
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
      updateUser(row).then(() => {
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
          return deleteUser(row.userId);
        })
        .then(() => {
          this.onLoad();
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
    },
    searchReset() {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange(params, done) {
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
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
          return deleteUserList(this.selectionUserIdList);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.$refs.crud.toggleSelection();
        });
    },
    handleReset() {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      this.$confirm("确定将选择账号密码重置为123456?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return resetPassword(this.selectionUserIdList);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.$refs.crud.toggleSelection();
        });
    },
    handleGrant() {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      this.roleTreeObj = [];
      if (this.selectionList.length === 1) {
        this.roleTreeObj = this.selectionList[0].roleIdList;
      }
      treeRole(this.userRequest.clientId).then(res => {
        this.roleGrantList = res.data.data;
        this.roleBox = true;
      });
    },
    handleImport() {
      this.excelBox = true;
    },
    uploadAfter(res, done, loading, column) {
      window.console.log(column);
      done();
      this.excelBox = false;
      this.refreshChange();
    },
    handleExport() {
      this.$confirm("是否导出用户数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        window.open(`/api/blade-user/export-user?blade-auth=${getToken()}`);
      });
    },
    handleTemplate() {
      window.open(`/api/blade-user/export-template?blade-auth=${getToken()}`);
    },
    beforeOpen(done, type) {
      if (["edit", "view"].includes(type)) {
        getUserInfoDetail(this.form.userId).then(res => {
          this.form = res.data.data;
        });
      }
      done();
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange() {
      this.onLoad(this.page, this.query);
    },
  }
};
</script>

<style>
.tab-pane {
  padding-top: 20px;
}
</style>
