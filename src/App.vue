<template>
  <div id="app" style="height: 100vh;">
    <el-container>
      <el-header height="100px"><b>Qing Ting Management System</b>
        <el-menu mode="horizontal" :default-active="activePath" @select="handleSelect" router background-color="#B3C0D1">
          <el-menu-item index="/table">Music Manager</el-menu-item>
          <el-menu-item index="/content">User Manager</el-menu-item>
          <el-menu-item index="/page-config">Page Manager</el-menu-item>
        </el-menu>
      </el-header>
      <el-container>
        <el-main>
          <div>
            <router-view/>
          </div>
        </el-main>
      </el-container>
      <el-footer>Simple Design</el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {}
  },
  methods: {
    handleSelect (key, keyPath) {
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  },
  computed: {
    activePath () {
      let currentPath = this.$route.path
      if (currentPath.indexOf('/table') !== -1) {
        return '/table'
      } else if (currentPath.indexOf('/content') !== -1) {
        return '/content'
      } else if (currentPath.indexOf('/page-config') !== -1) {
        return '/page-config'
      }
      return '/table'
    }
  }
}
</script>

<style>
.el-header {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  padding: 0px;
  line-height: 39px;
}

.el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
}

div > .el-container {
  padding: 2px;
  height: 100%;
}

.el-menu {
  width: 100%;
}

.el-menu--horizontal > .el-menu-item:not(.is-disabled):focus, .el-menu--horizontal > .el-menu-item:not(.is-disabled):hover {
  background-color: #9fafbf;
}

.el-menu--horizontal>.el-menu-item.is-active {
  border-bottom: 3px solid #409EFF;
  font-weight: 600;
}
</style>
