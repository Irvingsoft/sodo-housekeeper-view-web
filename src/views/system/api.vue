<template>
  <basic-container>
    <el-form :inline="true" class="demo-form-inline">
      <el-row>
        <el-col :xs="24" :sm="12" :md="6">
          <el-form-item label="关键字">
            <el-input v-model="pageRequest.content" placeholder="请输入关键字" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-form-item label="客户端">
            <el-select v-model="pageRequest.clientId" placeholder="请选择客户端">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="client in clientList" :label="client.name" :value="client.clientId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-form-item label="方法">
            <el-select v-model="pageRequest.method" placeholder="请选择方法">
              <el-option label="全部" value=""></el-option>
              <el-option label="GET" value="GET"></el-option>
              <el-option label="POST" value="POST"></el-option>
              <el-option label="PUT" value="PUT"></el-option>
              <el-option label="PATCH" value="PATCH"></el-option>
              <el-option label="DELETE" value="DELETE"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-col span="18">
            <el-form-item>
              <el-button type="primary" @click="searchChange">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col span="2" offset="4">
            <el-form-item>
              <i v-if="status.fold" class="el-icon-arrow-left foldIcon" @click="foldStatusChange(false)"></i>
              <i v-if="!status.fold" class="el-icon-arrow-down foldIcon" @click="foldStatusChange(true)"></i>
            </el-form-item>
          </el-col>
        </el-col>
      </el-row>
      <el-collapse-transition>
        <el-row v-if="!status.fold">
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="启用" class="foldItemFirst">
              <el-radio-group v-model="pageRequest.inUse">
                <el-radio label>全部</el-radio>
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="认证" class="foldItem">
              <el-radio-group v-model="pageRequest.auth">
                <el-radio label>全部</el-radio>
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="日志" class="foldItem">
              <el-radio-group v-model="pageRequest.log">
                <el-radio label>全部</el-radio>
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <el-form-item label="限流" class="foldItem">
              <el-radio-group v-model="pageRequest.requestLimit">
                <el-radio label>全部</el-radio>
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
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @on-load="onLoad">
      <template slot="menuLeft">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.api_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot="method" slot-scope="scope">
        <el-tag>
          {{ scope.row.method }}
        </el-tag>
      </template>
      <template slot="inUse" slot-scope="scope">
        <svg v-if="scope.row.inUse" class="icon" aria-hidden="true">
          <use xlink:href="#icon-true"></use>
        </svg>
        <svg v-else class="icon" aria-hidden="true">
          <use xlink:href="#icon-false"></use>
        </svg>
      </template>
      <template slot="auth" slot-scope="scope">
        <svg v-if="scope.row.auth" class="icon" aria-hidden="true">
          <use xlink:href="#icon-true"></use>
        </svg>
        <svg v-else class="icon" aria-hidden="true">
          <use xlink:href="#icon-false"></use>
        </svg>
      </template>
      <template slot="log" slot-scope="scope">
        <svg v-if="scope.row.log" class="icon" aria-hidden="true">
          <use xlink:href="#icon-true"></use>
        </svg>
        <svg v-else class="icon" aria-hidden="true">
          <use xlink:href="#icon-false"></use>
        </svg>
      </template>
      <template slot="requestLimit" slot-scope="scope">
        <svg v-if="scope.row.requestLimit" class="icon" aria-hidden="true">
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
import {getDetail, listOauthClientBaseUse, remove} from "@/api/system/client";
import {mapGetters} from "vuex";
import {
  deleteOauthApi,
  getOauthApiInfoDetail,
  insertOauthApi,
  pageOauthApiInfo,
  updateOauthApi
} from "@/api/system/api";
import func from "@/util/func";
import api from "@/views/monitor/log/api";

export default {
  data() {
    let validateRequestLimitNum = (rule, value, callback) => {
      if (this.form.requestLimit === true && func.isEmpty(this.form.limitNum)) {
        callback(new Error('请输入限流限制请求次数'));
      } else {
        callback();
      }
    };
    let validateRequestLimitPeriod = (rule, value, callback) => {
      if (this.form.requestLimit === true && func.isEmpty(this.form.limitPeriod)) {
        callback(new Error('请输入限流限制请求时间'));
      } else {
        callback();
      }
    };
    return {
      status: {
        fold: true,
      },
      form: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      pageRequest: {
        pageNum: 1,
        pageSize: 10,
        clientId: "",
        content: "",
        method: "",
        inUse: "",
        auth: "",
        log: "",
        requestLimit: "",
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
        selection: true,
        column: [
          {
            label: "名称",
            prop: "name",
            width: 150,
            rules: [{
              required: true,
              message: "请输入接口名称",
              trigger: "blur"
            }]
          },
          {
            label: "方法",
            prop: "method",
            sortable: true,
            width: 80,
            align: "center",
            type: "select",
            dicData: [
              {
                label: "GET",
                value: "GET"
              },
              {
                label: "POST",
                value: "POST"
              },
              {
                label: "PUT",
                value: "PUT"
              },
              {
                label: "PATCH",
                value: "PATCH"
              },
              {
                label: "DELETE",
                value: "DELETE"
              }
            ],
            rules: [{
              required: true,
              message: "请输入接口请求方法",
              trigger: "blur"
            }]
          },
          {
            label: "路径",
            prop: "path",
            width: 180,
            rules: [{
              required: true,
              message: "请输入接口路径",
              trigger: "blur"
            }]
          },
          {
            label: "备注",
            prop: "description",
            width: 180,
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
              message: "请选择是否启用接口",
              trigger: "blur"
            }]
          },
          {
            label: "认证",
            prop: "auth",
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
              message: "请选择是否需要认证",
              trigger: "blur"
            }]
          },
          {
            label: "日志",
            prop: "log",
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
              message: "请选择是否开启日志",
              trigger: "blur"
            }]
          },
          {
            label: "限流",
            prop: "requestLimit",
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
              message: "请选择是否开启限流",
              trigger: "blur"
            }]
          }, {
            label: "限流次数",
            prop: "limitNum",
            type: "number",
            sortable: true,
            width: 95,
            align: "center",
            rules: [{required: true, validator: validateRequestLimitNum, trigger: 'blur'}]
          },
          {
            label: "限流时间",
            prop: "limitPeriod",
            type: "number",
            sortable: true,
            width: 95,
            align: "center",
            rules: [{required: true, validator: validateRequestLimitPeriod, trigger: 'blur'}]
          },
          {
            label: "日请求量",
            prop: "requestDay",
            editDisabled: true,
            addDisabled: true,
            sortable: true,
            width: 95,
            align: "center",
          },
          {
            label: "周请求量",
            prop: "requestWeek",
            editDisabled: true,
            addDisabled: true,
            sortable: true,
            width: 95,
            align: "center",
          },
          {
            label: "月请求量",
            prop: "requestMonth",
            editDisabled: true,
            addDisabled: true,
            sortable: true,
            width: 95,
            align: "center",
          },
          {
            label: "总请求量",
            prop: "requestAll",
            editDisabled: true,
            addDisabled: true,
            sortable: true,
            width: 95,
            align: "center",
          },
          {
            label: "客户端",
            prop: "clientIdList",
            span: 24,
            showColumn: false,
            dicData: [],
            type: "tree",
            multiple: true,
            props: {
              label: "name",
              value: "clientId"
            },
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
      clientList: []
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
    selectionApiIdList() {
      let apiIdList = [];
      this.selectionList.forEach(oauthApi => {
          apiIdList.push(oauthApi.apiId)
        }
      )
      return apiIdList;
    }
  },
  created() {
    this.listOauthClientBaseUse();
  },
  methods: {
    async onLoad() {
      this.loading = true;
      await this.pageOauthApiInfo();
      this.loading = false;
    },
    pageOauthApiInfo() {
      pageOauthApiInfo(this.pageRequest).then(res => {
        if (res.data.code === 200) {
          this.data = res.data.data;
        }
      })
    },
    listOauthClientBaseUse() {
      listOauthClientBaseUse().then(res => {
        this.findObject(this.option.column, "clientIdList").dicData = res.data.data;
        this.clientList = res.data.data;
      })
    },
    rowSave(row, done, loading) {
      insertOauthApi(row).then(() => {
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
      updateOauthApi(row).then(() => {
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
          this.onLoad(this.page);
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
        this.pageRequest.auth = "";
        this.pageRequest.log = "";
        this.pageRequest.requestLimit = "";
      }
    },
    searchChange(done) {
      this.pageRequest.pageNum = 1;
      this.pageOauthApiInfo();
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
          return deleteOauthApi(this.selectionApiIdList);
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
    beforeOpen(done, type) {
      if (["edit", "view"].includes(type)) {
        getOauthApiInfoDetail(this.form.apiId).then(res => {
          this.form = res.data.data;
        });
      }
      done();
    },
    currentChange(currentPage) {
      this.pageRequest.pageNum = currentPage;
    },
    sizeChange(pageSize) {
      this.pageRequest.pageSize = pageSize;
    },
  }
};
</script>

<style>
.icon {
  width: 1.3em;
  height: 1.3em;
}

.foldItemFirst {
  margin-right: 80px;
}

.foldItemFirst, .foldItem {
  width: 250px;
}

.foldIcon {
  font-size: 18px;
}
</style>
