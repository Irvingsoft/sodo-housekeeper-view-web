<template>
  <basic-container>
    <el-form :inline="true" label-width="60px">
      <el-row>
        <el-col :md="6" :sm="12" :xs="24">
          <el-form-item label="关键字">
            <el-input v-model="pageRequest.content" clearable placeholder="请输入关键字"></el-input>
          </el-form-item>
        </el-col>
        <el-col :md="12" :sm="12" :xs="0">&nbsp;</el-col>
        <el-col :md="6" :sm="12" :xs="24">
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
          <el-col :md="6" :sm="12" :xs="24">
            <el-form-item class="foldItemFirst" label="启用">
              <el-radio-group v-model="pageRequest.inUse">
                <el-radio label="">全部</el-radio>
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :md="6" :sm="12" :xs="24">
            <el-form-item class="foldItem" label="注册">
              <el-radio-group v-model="pageRequest.register">
                <el-radio label="">全部</el-radio>
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :md="6" :sm="12" :xs="24">
            <el-form-item class="foldItem" label="Captcha" label-width="60px">
              <el-radio-group v-model="pageRequest.captcha">
                <el-radio label="">全部</el-radio>
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :md="6" :sm="12" :xs="24">
            <el-form-item class="foldItem" label="签名" label-width="60px">
              <el-radio-group v-model="pageRequest.signature">
                <el-radio label="">全部</el-radio>
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-collapse-transition>
    </el-form>
    <avue-crud v-model="form"
               :before-open="beforeOpen"
               :data="data.records"
               :option="option"
               :page="data"
               :permission="permissionList"
               :table-loading="loading"
               @row-del="rowDel"
               @row-update="rowUpdate"
               @row-save="rowSave"
               @current-change="currentChange"
               @size-change="sizeChange"
               @on-load="onLoad"
               @refresh-change="onLoad">
      <template slot="inUse" slot-scope="{row}">
        <svg v-if="row.inUse" aria-hidden="true" class="icon">
          <use xlink:href="#icon-true"></use>
        </svg>
        <svg v-else aria-hidden="true" class="icon">
          <use xlink:href="#icon-false"></use>
        </svg>
      </template>
      <template slot="register" slot-scope="{row}">
        <svg v-if="row.register" aria-hidden="true" class="icon">
          <use xlink:href="#icon-true"></use>
        </svg>
        <svg v-else aria-hidden="true" class="icon">
          <use xlink:href="#icon-false"></use>
        </svg>
      </template>
      <template slot="captcha" slot-scope="{row}">
        <svg v-if="row.captcha" aria-hidden="true" class="icon">
          <use xlink:href="#icon-true"></use>
        </svg>
        <svg v-else aria-hidden="true" class="icon">
          <use xlink:href="#icon-false"></use>
        </svg>
      </template>
      <template slot="signature" slot-scope="{row}">
        <svg v-if="row.signature" aria-hidden="true" class="icon">
          <use xlink:href="#icon-true"></use>
        </svg>
        <svg v-else aria-hidden="true" class="icon">
          <use xlink:href="#icon-false"></use>
        </svg>
      </template>
      <template slot="concurrentLogin" slot-scope="{row}">
        <svg v-if="row.concurrentLogin" aria-hidden="true" class="icon">
          <use xlink:href="#icon-true"></use>
        </svg>
        <svg v-else aria-hidden="true" class="icon">
          <use xlink:href="#icon-false"></use>
        </svg>
      </template>
      <template slot="shareToken" slot-scope="{row}">
        <svg v-if="row.shareToken" aria-hidden="true" class="icon">
          <use xlink:href="#icon-true"></use>
        </svg>
        <svg v-else aria-hidden="true" class="icon">
          <use xlink:href="#icon-false"></use>
        </svg>
      </template>
      <template slot="userStatus" slot-scope="{row}">
        <el-tag v-if="row.userStatus === 0" effect="dark" type="success">
          正常
        </el-tag>
        <el-tag v-else-if="row.userStatus === 1" effect="dark" type="warning">
          审核
        </el-tag>
        <el-tag v-else-if="row.userStatus === 2" effect="dark" type="error">
          冻结
        </el-tag>
        <el-tag v-else-if="row.userStatus === -1" effect="dark" type="info">
          注销
        </el-tag>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import {
  deleteOauthClient,
  getOauthClientInfoDetail,
  insertOauthClient,
  pageOauthClientInfo,
  updateOauthClient
} from "@/api/system/client";
import {mapGetters} from "vuex";
import {listOauthApiBaseUse} from "@/api/system/api";
import userStatus from "@/const/userStatus"

export default {
  data() {
    return {
      status: {
        fold: true,
      },
      form: {},
      loading: true,
      pageRequest: {
        pageNum: 1,
        pageSize: 10,
        content: "",
        inUse: "",
        register: "",
        captcha: "",
        signature: "",
      },
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
            editDisabled: true,
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
            label: "令牌秒数",
            prop: "tokenExpire",
            type: "number",
            valueDefault: 3600,
          },
          {
            label: "启用",
            prop: "inUse",
            sortable: true,
            width: 70,
            align: "center",
            type: 'switch',
            value: false,
            dicData: [{
              label: '否',
              value: false
            }, {
              label: '是',
              value: true
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
            type: 'switch',
            value: false,
            dicData: [{
              label: '否',
              value: false
            }, {
              label: '是',
              value: true
            }],
            rules: [{
              required: true,
              message: "请选择是否开启注册",
              trigger: "blur"
            }]
          },
          {
            label: "签名",
            prop: "signature",
            sortable: true,
            width: 70,
            align: "center",
            type: 'switch',
            value: false,
            dicData: [{
              label: '否',
              value: false
            }, {
              label: '是',
              value: true
            }],
            rules: [{
              required: true,
              message: "请选择是否开启接口签名",
              trigger: "blur"
            }]
          },
          {
            label: "并发登录",
            prop: "concurrentLogin",
            sortable: true,
            width: 95,
            align: "center",
            type: 'switch',
            value: false,
            dicData: [{
              label: '否',
              value: false
            }, {
              label: '是',
              value: true
            }],
            rules: [{
              required: true,
              message: "请选择是否开启图形验证码",
              trigger: "blur"
            }]
          },
          {
            label: "共享令牌",
            prop: "shareToken",
            sortable: true,
            width: 95,
            align: "center",
            type: 'switch',
            value: false,
            dicData: [{
              label: '否',
              value: false
            }, {
              label: '是',
              value: true
            }],
            rules: [{
              required: true,
              message: "请选择是否开启图形验证码",
              trigger: "blur"
            }]
          },
          {
            label: "Captcha",
            prop: "captcha",
            sortable: true,
            width: 95,
            align: "center",
            type: 'switch',
            value: false,
            dicData: [{
              label: '否',
              value: false
            }, {
              label: '是',
              value: true
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
            dicData: userStatus,
            rules: [{
              required: true,
              message: "请选择是否开启图形验证码",
              trigger: "blur"
            }]
          },
          {
            label: "接口",
            prop: "apiIdList",
            span: 24,
            showColumn: false,
            dicData: [],
            type: "tree",
            multiple: true,
            props: {
              label: "name",
              value: "apiId"
            },
          },
          {
            label: "Referer",
            prop: "referer",
            width: 200,
          },
          {
            label: "回调地址",
            prop: "redirectUri",
            width: 200,
          },
          {
            label: "备注",
            prop: "description",
            width: 180,
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
      data: [],
      apiList: []
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
  },
  created() {
    this.listOauthApiBaseUse();
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
    listOauthApiBaseUse() {
      listOauthApiBaseUse().then(res => {
        this.findObject(this.option.column, "apiIdList").dicData = res.data.data;
        this.apiList = res.data.data;
      })
    },
    rowSave(row, done, loading) {
      insertOauthClient(row).then(() => {
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
      updateOauthClient(row).then(() => {
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
          return deleteOauthClient(row.clientId);
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
      if (!fold) {
        this.pageRequest.inUse = "";
        this.pageRequest.register = "";
        this.pageRequest.captcha = "";
      }
    },
    searchChange() {
      this.pageRequest.currentPage = 1;
      this.onLoad();
    },
    beforeOpen(done, type) {
      if (["edit", "view"].includes(type)) {
        getOauthClientInfoDetail(this.form.clientId).then(res => {
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
