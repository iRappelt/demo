<template>
  <div>
    <el-row>
      <el-col>
        <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
          <!--面包屑列表-->
          <el-breadcrumb-item
            v-for='(item,index) in breadList'
            :key='index'
            @click.native="breadcrumbClick(item.path)"
            v-if='item.name' style="cursor: pointer">
            {{ item.name }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <router-view/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Content',
  data () {
    return {
      breadList: [
        {
          name: 'Home',
          path: '/content/home'
        }
      ] // 面包屑列表数据
    }
  },
  watch: {
    // 监听路由的变化
    $route () {
      this.getBreadcrumb()
    }
  },
  methods: {
    getBreadcrumb () {
      let that = this
      let breadNumber = typeof (this.$route.meta.breadNumber) !== 'undefined' ? this.$route.meta.breadNumber : 1
      // 获取当前页面的名字和路由，并组合成新的对象
      let newBread = {name: this.$route.name, path: this.$route.fullPath}
      let vuexBreadList = that.breadList // 默认初始化面包屑数据
      if (breadNumber !== 1) {
        // 当前面包屑breadNumber大于1时才会从vuex中获取值
        vuexBreadList = JSON.parse(this.$cookies.get('vuexBreadList')) // 获取breadList数组
      }
      if (breadNumber < vuexBreadList.length) {
        // "回退"面包屑----判断条件：当前路由breadNumber小于vuexBreadList的长度
        vuexBreadList.splice(breadNumber - vuexBreadList.length, vuexBreadList.length - breadNumber)
      }
      if (breadNumber > vuexBreadList.length) {
        // 添加面包屑----判断条件：当前路由breadNumber大于vuexBreadList的长度
        vuexBreadList.push(newBread)
      }
      // 处理完数据后，将最终的数据更新为新的面包屑数组
      that.breadList = vuexBreadList
      // 处理完数据后，将最终的数据更新到vuex（用于页面刷新）
      this.$cookies.set('vuexBreadList', JSON.stringify(vuexBreadList), 0)
    },
    breadcrumbClick (path) {
      this.$router.push({
        path: path
      })
    }
  },
  mounted () {
    this.getBreadcrumb()
  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 10px;
}
</style>
