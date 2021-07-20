<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import {getSignaturePublicKey, insertSignatureKey} from "@/api/auth";
import {JSEncrypt} from 'jsencrypt'
import {uuid} from "@/util/util";
import auth from "@/store/modules/auth";

export default {
  name: "app",
  data() {
    return {
      publicKey: {
        id: "",
        content: "",
        signatureKey: "",
      },
    };
  },
  watch: {},
  created() {
    this.getSignaturePublicKey();
    // this.insertSignatureKey();
  },
  methods: {
    getSignaturePublicKey() {
      getSignaturePublicKey().then(res => {
        this.publicKey = res.data.data;
        if (res.data.code === 200) {
          this.insertSignatureKey();
        }
      })
    },
    insertSignatureKey() {
      this.publicKey.signatureKey = uuid();
      this.$store.dispatch("InsertSignatureKey", this.publicKey)
    }
  },
  computed: {}
};
</script>
<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
