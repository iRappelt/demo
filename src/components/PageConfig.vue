<template>
  <div>
    <el-tabs type="border-card" @tab-click="tabClick">
      <el-tab-pane label="Top Config">
        <top></top>
      </el-tab-pane>
      <el-tab-pane label="Carousel Config">
        <carousel></carousel>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Top from './Top'
import Carousel from './Carousel'
export default {
  name: 'PageConfig',
  components: {
    top: Top,
    carousel: Carousel
  },
  data () {
    return {
      activeName: 'second'
    }
  },
  methods: {
    tabClick (tab, event) {
    }
  }
}
</script>

<style scoped>

</style>
