<template>
    <button class="wxuploader" @click="click">
      
    </button>
</template>
<script>
export default {
  name: "WxUploader",
  props: {
    attr: {
      type: [Object, Array],
      default: () => {
        return [];
      }
    },
    count: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {};
  },
  methods: {
    click() {
      chooseImage(() => {}, this.count);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$emit("mounted", this.$refs);
    });
  },
  created() {},
  watch: {}
};
</script>
<style scoped>
.wxuploader {
  width: 58px;
  line-height: 58px;
  height: 58px;
  border: 0;
  background: none;
}
</style>
