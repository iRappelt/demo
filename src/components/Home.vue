<template>
  <el-button type="info" plain v-on:click="goPage">
    <span>{{ msg }}</span>
  </el-button>
</template>

<script>
export default {
  data: function () {
    return {
      msg: 'Account Manage'
    }
  },
  name: 'Home',
  methods: {
    goPage () {
      this.$router.push({
        path: '/content/home/account'
      })
    }
  }
}
</script>

<style scoped>

</style>
