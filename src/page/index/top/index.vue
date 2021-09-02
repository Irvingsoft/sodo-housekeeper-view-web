<template>
  <div class="avue-top">
    <div class="top-bar__left">
      <div v-if="showCollapse"
           :class="[{ 'avue-breadcrumb--active': isCollapse }]"
           class="avue-breadcrumb">
        <i class="icon-navicon"
           @click="setCollapse"></i>
      </div>
    </div>
    <div class="top-bar__title">
      <div v-if="showMenu"
           class="top-bar__item top-bar__item--show">
        <top-menu></top-menu>
      </div>
      <span v-if="showSearch"
            class="top-bar__item">
        <top-search></top-search>
      </span>
    </div>
    <div class="top-bar__right">
      <el-tooltip v-if="showColor"
                  :content="$t('navbar.color')"
                  effect="dark"
                  placement="bottom">
        <div class="top-bar__item">
          <top-color></top-color>
        </div>
      </el-tooltip>
      <el-tooltip v-if="showDebug"
                  :content="logsFlag?$t('navbar.bug'):logsLen+$t('navbar.bugs')"
                  effect="dark"
                  placement="bottom">
        <div class="top-bar__item">
          <top-logs></top-logs>
        </div>
      </el-tooltip>
      <el-tooltip v-if="showLock"
                  :content="$t('navbar.lock')"
                  effect="dark"
                  placement="bottom">
        <div class="top-bar__item">
          <top-lock></top-lock>
        </div>
      </el-tooltip>
      <el-tooltip v-if="showTheme"
                  :content="$t('navbar.theme')"
                  effect="dark"
                  placement="bottom">
        <div class="top-bar__item top-bar__item--show">
          <top-theme></top-theme>
        </div>
      </el-tooltip>
      <el-tooltip :content="$t('navbar.language')"
                  effect="dark"
                  placement="bottom">
        <div class="top-bar__item top-bar__item--show">
          <top-lang></top-lang>
        </div>
      </el-tooltip>
      <el-tooltip v-if="showFullScreen"
                  :content="isFullScreen?$t('navbar.fullScreenF'):$t('navbar.fullScreen')"
                  effect="dark"
                  placement="bottom">
        <div class="top-bar__item">
          <i :class="isFullScreen?'icon-tuichuquanping':'icon-quanping'"
             @click="handleScreen"></i>
        </div>
      </el-tooltip>
      <img :src="userInfo.avatarUrl"
           class="top-bar__img">
      <el-dropdown>
        <span class="el-dropdown-link">
          {{ userInfo.nickname }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <router-link to="/">{{ $t('navbar.dashboard') }}</router-link>
          </el-dropdown-item>
          <el-dropdown-item>
            <router-link to="/info/index">{{ $t('navbar.userinfo') }}</router-link>
          </el-dropdown-item>
          <el-dropdown-item divided
                            @click.native="logout">{{ $t('navbar.logOut') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import {mapGetters, mapState} from "vuex";
import {fullscreenToggel, listenfullscreen} from "@/util/util";
import topLock from "./top-lock";
import topMenu from "./top-menu";
import topSearch from "./top-search";
import topTheme from "./top-theme";
import topLogs from "./top-logs";
import topColor from "./top-color";
import topLang from "./top-lang";

export default {
  components: {
    topLock,
    topMenu,
    topSearch,
    topTheme,
    topLogs,
    topColor,
    topLang
  },
  name: "top",
  data() {
    return {};
  },
  filters: {},
  created() {
  },
  mounted() {
    listenfullscreen(this.setScreen);
  },
  computed: {
    ...mapState({
      showDebug: state => state.common.showDebug,
      showTheme: state => state.common.showTheme,
      showLock: state => state.common.showLock,
      showFullScreen: state => state.common.showFullScreen,
      showCollapse: state => state.common.showCollapse,
      showSearch: state => state.common.showSearch,
      showMenu: state => state.common.showMenu,
      showColor: state => state.common.showColor
    }),
    ...mapGetters([
      "userInfo",
      "isFullScreen",
      "tagWel",
      "tagList",
      "isCollapse",
      "tag",
      "logsLen",
      "logsFlag"
    ])
  },
  methods: {
    handleScreen() {
      fullscreenToggel();
    },
    setCollapse() {
      this.$store.commit("SET_COLLAPSE");
    },
    setScreen() {
      this.$store.commit("SET_FULLSCREEN");
    },
    logout() {
      this.$confirm(this.$t("logoutTip"), this.$t("tip"), {
        confirmButtonText: this.$t("submitText"),
        cancelButtonText: this.$t("cancelText"),
        type: "warning"
      }).then(() => {
        this.$store.dispatch("LogOut").then(() => {
          this.$router.push({path: "/login"});
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
