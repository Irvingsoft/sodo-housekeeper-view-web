<template>
  <basic-container>
    <el-form :inline="true" class="demo-form-inline">
      <el-row>
        <el-col :xs="24" :sm="12" :md="5">
          <el-form-item label="关键字">
            <el-input v-model="pageRequest.content" placeholder="请输入关键字" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="4" :offset="15">
          <el-col :span="20">
            <el-form-item>
              <el-button type="primary" @click="searchChange">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <i v-if="status.fold" class="el-icon-arrow-left foldIcon" @click="foldStatusChange(false)"></i>
              <i v-if="!status.fold" class="el-icon-arrow-down foldIcon" @click="foldStatusChange(true)"></i>
            </el-form-item>
          </el-col>
        </el-col>
      </el-row>
      <el-collapse-transition>
        <el-row v-if="!status.fold">
          <el-col :xs="24" :sm="12" :md="5">
            <el-form-item label="启用" class="foldItemFirst">
              <el-radio-group v-model="pageRequest.inUse">
                <el-radio label="">全部</el-radio>
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="5">
            <el-form-item label="注册" class="foldItem">
              <el-radio-group v-model="pageRequest.register">
                <el-radio label="">全部</el-radio>
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="7">
            <el-form-item label="Captcha" class="foldItem">
              <el-radio-group v-model="pageRequest.captcha">
                <el-radio label="">全部</el-radio>
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-collapse-transition>
    </el-form>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data.records"
               :page="data"
               @row-del="rowDel"
               v-model="form"
               :permission="permissionList"
               @row-update="rowUpdate"
               @row-save="rowSave"
               :before-open="beforeOpen"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @on-load="onLoad">
      <template slot="inUse" slot-scope="scope">
        <svg v-if="scope.row.inUse" class="icon" aria-hidden="true">
          <use xlink:href="#icon-true"></use>
        </svg>
        <svg v-else class="icon" aria-hidden="true">
          <use xlink:href="#icon-false"></use>
        </svg>
      </template>
      <template slot="register" slot-scope="scope">
        <svg v-if="scope.row.register" class="icon" aria-hidden="true">
          <use xlink:href="#icon-true"></use>
        </svg>
        <svg v-else class="icon" aria-hidden="true">
          <use xlink:href="#icon-false"></use>
        </svg>
      </template>
      <template slot="captcha" slot-scope="scope">
        <svg v-if="scope.row.captcha" class="icon" aria-hidden="true">
          <use xlink:href="#icon-true"></use>
        </svg>
        <svg v-else class="icon" aria-hidden="true">
          <use xlink:href="#icon-false"></use>
        </svg>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import {getDetail, add, update, remove, pageOauthClientInfo} from "@/api/system/client";
import {mapGetters} from "vuex";

export default {
  data() {
    return {
      status: {
        fold: true,
      },
      form: {},
      query: {},
      loading: true,
      pageRequest: {
        pageNum: 1,
        pageSize: 10,
        content: "",
        inUse: "",
        register: "",
        captcha: "",
      },
      selectionList: [],
      option: {
        height: 'auto',
        calcHeight: 210,
        searchShow: true,
        searchMenuSpan: 6,
        tip: false,
        border: true,
        index: true,
        viewBtn: true,
        selection: false,
        column: [
          {
            label: "ID",
            prop: "clientId",
            rules: [{
              required: true,
              message: "请输入客户端id",
              trigger: "blur"
            }]
          },
          {
            label: "密钥",
            prop: "clientSecret",
            rules: [{
              required: true,
              message: "请输入客户端密钥",
              trigger: "blur"
            }]
          },
          {
            label: "名称",
            prop: "name",
            width: 150,
            rules: [{
              required: true,
              message: "请输入授权名称",
              trigger: "blur"
            }]
          },
          {
            label: "启用",
            prop: "inUse",
            sortable: true,
            width: 70,
            align: "center",
            type: "radio",
            dicData: [{
              label: '是',
              value: true
            }, {
              label: '否',
              value: false
            }],
            rules: [{
              required: true,
              message: "请选择是否启用客户端",
              trigger: "blur"
            }]
          },
          {
            label: "注册",
            prop: "register",
            sortable: true,
            width: 70,
            align: "center",
            type: "radio",
            dicData: [{
              label: '是',
              value: true
            }, {
              label: '否',
              value: false
            }],
            rules: [{
              required: true,
              message: "请选择是否开启注册",
              trigger: "blur"
            }]
          },
          {
            label: "Captcha",
            prop: "captcha",
            sortable: true,
            width: 95,
            align: "center",
            type: "radio",
            dicData: [{
              label: '是',
              value: true
            }, {
              label: '否',
              value: false
            }],
            rules: [{
              required: true,
              message: "请选择是否开启图形验证码",
              trigger: "blur"
            }]
          },
          {
            label: "用户初态",
            prop: "userStatus",
            sortable: true,
            width: 105,
            align: "center",
            type: "radio",
            dicData: [{
              label: '正常',
              value: 0
            }, {
              label: '审核',
              value: 1
            }, {
              label: '冻结',
              value: 2
            }, {
              label: '注销',
              value: -1
            }],
            rules: [{
              required: true,
              message: "请选择是否开启图形验证码",
              trigger: "blur"
            }]
          },
          {
            label: "令牌秒数",
            prop: "tokenExpire",
            type: "number",
            valueDefault: 3600,
            rules: [{
              required: true,
              message: "请输入令牌过期秒数",
              trigger: "blur"
            }]
          },
          {
            label: "回调地址",
            prop: "redirectUri",
          },
          {
            label: "备注",
            prop: "description",
            width: 180,
            span: 24,
          },
          {
            label: "创建时间",
            prop: "createAt",
            editDisabled: true,
            addDisabled: true,
            sortable: true,
            width: 130,
            align: "center",
          },
          {
            label: "更新时间",
            prop: "updateAt",
            editDisabled: true,
            addDisabled: true,
            sortable: true,
            width: 130,
            align: "center",
          },
        ]
      },
      data: []
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.client_add),
        viewBtn: this.vaildData(this.permission.client_view),
        delBtn: this.vaildData(this.permission.client_delete),
        editBtn: this.vaildData(this.permission.client_edit)
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(",");
    }
  },
  methods: {
    onLoad() {
      this.loading = true;
      this.pageOauthClientInfo();
    },
    pageOauthClientInfo() {
      pageOauthClientInfo(this.pageRequest).then(res => {
        if (res.data.code === 200) {
          this.data = res.data.data;
          this.loading = false;
        }
      })
    },
    rowSave(row, done, loading) {
      add(row).then(() => {
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
      update(row).then(() => {
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
          return remove(row.id);
        })
        .then(() => {
          this.onLoad();
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
    },
    foldStatusChange(fold) {
      this.status.fold = fold;
      if (fold) {
        this.pageRequest.inUse = "";
        this.pageRequest.register = "";
        this.pageRequest.captcha = "";
      }
    },
    searchChange(params, done) {
      this.query = params;
      this.pageRequest.currentPage = 1;
      this.onLoad();
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
          return remove(this.ids);
        })
        .then(() => {
          this.onLoad(this.pageRequest);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.$refs.crud.toggleSelection();
        });
    },
    beforeOpen(done, type) {
      if (["edit", "view"].includes(type)) {
        getDetail(this.form.id).then(res => {
          this.form = res.data.data;
        });
      }
      done();
    },
    currentChange(currentPage) {
      this.pageRequest.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.pageRequest.pageSize = pageSize;
    },
  }
};
</script>

<style>
</style>
