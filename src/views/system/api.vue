<template>
  <basic-container>
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
import {getDetail, remove} from "@/api/system/client";
import {mapGetters} from "vuex";
import {insertOauthApi, pageOauthApiInfo, updateOauthApi} from "@/api/system/api";
import func from "@/util/func";

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
      form: {},
      query: {},
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
        use: "",
        auth: ""
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
            search: true,
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
            search: true,
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
            sortable: true,
            width: 95,
            align: "center",
            rules: [{required: true, validator: validateRequestLimitNum, trigger: 'blur'}]
          },
          {
            label: "限流时间",
            prop: "limitPeriod",
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
    rowSave(row, done, loading) {
      insertOauthApi(row).then(() => {
        done();
        this.onLoad(this.page);
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
          return remove(this.ids);
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
        getDetail(this.form.id).then(res => {
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
</style>
