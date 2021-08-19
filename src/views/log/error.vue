<template>
  <basic-container>
    <el-tabs v-model="logRequest.clientId" @tab-click="handleSwitch">
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
                <el-input v-model="logRequest.content" placeholder="请输入关键字" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="5">
              <el-form-item label="服务">
                <el-select v-model="logRequest.serviceId" placeholder="请选择服务">
                  <el-option label="全部" value=""></el-option>
                  <el-option v-for="service in serviceList" :label="service.label" :value="service.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="5">
              <el-form-item label="方法">
                <el-select v-model="logRequest.requestMethod" placeholder="请选择方法">
                  <el-option label="全部" value=""></el-option>
                  <el-option v-for="requestMethod in requestMethodList" :label="requestMethod.label"
                             :value="requestMethod.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="5" :offset="4">
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
            <el-row v-if="!status.fold" :inline="true">
              <el-col :xs="24" :sm="12" :md="5">
                <el-form-item label="用户 ID">
                  <el-input v-model="logRequest.userId" placeholder="请输入用户 ID" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="5">
                <el-form-item label="请求 ID">
                  <el-input v-model="logRequest.requestId" placeholder="请输入请求 ID" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="9">
                <el-form-item>
                  <template #label>
                    时间
                  </template>
                  <el-date-picker
                    v-model="logRequest.createInterval"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-transition>
        </el-form>
        <avue-crud :option="option"
                   :data="data.records"
                   ref="crud"
                   v-model="form"
                   :permission="permissionList"
                   :before-open="beforeOpen"
                   :page="data"
                   @current-change="currentChange"
                   @size-change="sizeChange"
                   @refresh-change="onLoad">
          <template slot="env" slot-scope="{row}">
            <el-tag>
              {{ row.env }}
            </el-tag>
          </template>
          <template slot="requestMethod" slot-scope="{row}">
            <el-tag type="success">
              {{ row.requestMethod }}
            </el-tag>
          </template>
          <template slot="message" slot-scope="{row}">
            <avue-text-ellipsis :text="row.message" :height="40" :width="280">
              <small slot="more">...</small>
            </avue-text-ellipsis>
          </template>
        </avue-crud>
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
import requestMethod from "@/const/requestMethod"
import service from "@/const/service"
import responseStatus from "@/const/responseStatus";
import {mapGetters} from "vuex";
import {listOauthClientBaseUse} from "@/api/system/client";
import {getLogErrorInfoDetail, pageLogErrorBaseDetail} from "@/api/log/error";

export default {
  data() {
    return {
      status: {
        fold: true
      },
      form: {},
      requestMethodList: requestMethod,
      responseStatusList: responseStatus,
      logRequest: {
        clientId: "",
        serviceId: "",
        userId: "",
        requestId: "",
        requestMethod: "",
        createBegin: "",
        createEnd: "",
        createInterval: [],
        content: "",
        pageNum: 1,
        pageSize: 10
      },
      serviceList: service,
      option: {
        height: 'auto',
        calcHeight: 210,
        searchShow: true,
        searchMenuSpan: 6,
        tip: false,
        border: true,
        index: true,
        viewBtn: true,
        editBtn: false,
        addBtn: false,
        delBtn: false,
        menuWidth: 120,
        dialogType: 'drawer',
        column: [
          {
            label: "服务 ID",
            prop: "serviceId",
            width: 100
          },
          {
            label: "服务 Host",
            prop: "serviceHost",
            width: 140
          },
          {
            label: "服务 IP",
            prop: "serviceIp",
            width: 130
          },
          {
            label: "软件环境",
            prop: "env",
            align: "center",
            width: 70,
          },
          {
            label: "用户 ID",
            prop: "userId",
            width: 150,
          },
          {
            label: "用户 IP",
            prop: "userIp",
            width: 130
          },
          {
            label: "系统",
            prop: "systemName",
            hide: true
          },
          {
            label: "浏览器",
            prop: "browserName",
            hide: true
          },
          {
            label: "请求 ID",
            prop: "requestId",
            hide: true,
            span: 24,
          },
          {
            label: "请求方法",
            prop: "requestMethod",
            align: "center",
            width: 85,
          },
          {
            label: "请求路径",
            prop: "requestUrl",
            hide: true,
            span: 24,
          },
          {
            label: "请求体",
            prop: "requestBody",
            hide: true,
            span: 24,
          },
          {
            label: "类名",
            prop: "className",
            hide: true
          },
          {
            label: "方法名",
            prop: "methodName",
            hide: true
          },
          {
            label: "异常",
            prop: "exceptionName",
            width: 300,
            span: 24,
          },
          {
            label: "消息",
            prop: "message",
            width: 300,
            span: 24,
          },
          {
            label: "文件",
            prop: "fileName",
            hide: true,
          },
          {
            label: "行数",
            prop: "lineNum",
            hide: true,
          },
          {
            label: "参数",
            prop: "params",
            hide: true,
            span: 24,
          },
          {
            label: "堆栈跟踪",
            prop: "stackTrace",
            hide: true,
            span: 24,
          },
          {
            label: "时间",
            prop: "createAt",
            width: 130,
          }
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
        viewBtn: this.vaildData(this.permission.log_error_view, false)
      };
    }
  },
  created() {
    this.listOauthClientBaseUse();
  },
  methods: {
    onLoad() {
      this.loading = true;
      this.pageLogErrorBaseDetail()
    },
    pageLogErrorBaseDetail() {
      this.logRequest.createBegin = this.logRequest.createInterval[0];
      this.logRequest.createEnd = this.logRequest.createInterval[1];
      pageLogErrorBaseDetail(this.logRequest).then(res => {
        this.data = res.data.data;
        this.loading = false;
      });
    },
    listOauthClientBaseUse() {
      listOauthClientBaseUse().then(res => {
        this.clientList = res.data.data;
        this.logRequest.clientId = this.clientList[0].clientId
        this.onLoad();
      })
    },
    handleSwitch(tab, event) {
      this.logRequest.clientId = tab.name;
      this.logRequest.serviceId = "";
      this.logRequest.userId = "";
      this.logRequest.requestId = "";
      this.logRequest.requestMethod = "";
      this.logRequest.createBegin = "";
      this.logRequest.createEnd = "";
      this.logRequest.createInterval = [];
      this.logRequest.content = "";
      this.logRequest.pageNum = 1;
      this.logRequest.pageSize = 10;
      this.onLoad();
    },
    foldStatusChange(fold) {
      this.status.fold = fold;
      if (fold) {
        this.logRequest.userId = "";
        this.logRequest.requestId = "";
        this.logRequest.createBegin = "";
        this.logRequest.createEnd = "";
        this.logRequest.createInterval = [];
      }
    },
    searchChange() {
      this.logRequest.pageNum = 1;
      this.onLoad();
    },
    beforeOpen(done, type) {
      if (["edit", "view"].includes(type)) {
        getLogErrorInfoDetail(this.form.id).then(res => {
          this.form = res.data.data;
        });
      }
      done();
    },
    currentChange(currentPage) {
      this.logRequest.pageNum = currentPage;
      this.onLoad();
    },
    sizeChange(pageSize) {
      this.logRequest.pageSize = pageSize;
      this.onLoad();
    },
  }
};
</script>

<style>
.tab-pane {
  padding-top: 20px;
}
</style>
