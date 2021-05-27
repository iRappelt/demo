<template>
  <div>
    <el-button-group style="float: left;margin-bottom: 5px;">
      <el-button class="my-but" icon="el-icon-edit" size="small" @click="addData">Add</el-button>
      <el-button class="my-but-danger" icon="el-icon-delete" size="small" @click="deleteSelectedData" :loading="deleteLoading">Delete</el-button>
    </el-button-group>
    <el-table :data="gridData" border max-height="600px" height="600px" class="myTable" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column type="index" label="Index" width="70"></el-table-column>
      <el-table-column property="carouselId" label="CarouselId" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column property="description" label="Description" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column property="songIds" label="SongIds" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column property="picLinks" label="PicLinks" show-overflow-tooltip></el-table-column>
      <el-table-column property="createTime" label="CreateTime" width="200" show-overflow-tooltip></el-table-column>
      <el-table-column property="updateTime" label="UpdateTime" width="200" show-overflow-tooltip></el-table-column>
      <el-table-column label="Operation" width="180" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="my-pager" small layout="prev, pager, next" :total="this.total" @current-change="changePage" :current-page="this.currentPage" :page-size="this.pageSize"></el-pagination>
    <el-dialog title="Edit Top" :visible.sync="editDialogVisible" width="65%" top="20vh" :close-on-click-modal="true">
      <el-form :label-position="editLabelPosition" label-width="100px" :model="editCarouselForm" :rules="rules" ref="editCarouselForm" status-icon>
        <el-form-item label="Description" prop="description">
          <el-input v-model="editCarouselForm.description"></el-input>
        </el-form-item>
        <el-form-item label="SongIds" prop="songIds">
          <el-input v-model="editCarouselForm.songIds"></el-input>
        </el-form-item>
        <el-form-item label="PicLinks" prop="picLinks">
          <el-input v-model="editCarouselForm.picLinks"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" style="width: 85px;float: left">Submit</el-button>
          <el-button @click="resetForm" style="width: 85px;float: left">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="Add Top" :visible.sync="addDialogVisible" width="65%" top="20vh" :close-on-click-modal="true">
      <el-form :label-position="addLabelPosition" label-width="100px" :model="addCarouselForm" :rules="rules" ref="addCarouselForm" status-icon>
        <el-form-item label="Description" prop="description">
          <el-input v-model="addCarouselForm.description"></el-input>
        </el-form-item>
        <el-form-item label="SongIds" prop="songIds">
          <el-input v-model="addCarouselForm.songIds"></el-input>
        </el-form-item>
        <el-form-item label="PicLinks" prop="picLinks">
          <el-input v-model="addCarouselForm.picLinks"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitAddForm" style="width: 85px;float: left">Submit</el-button>
          <el-button @click="resetAddForm" style="width: 85px;float: left">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import qs from 'qs'

export default {
  name: 'Carousel',
  data: function () {
    return {
      gridData: [],
      currentPage: 1,
      pageSize: 10,
      total: 50,
      selectedData: [],
      deleteLoading: false,
      editDialogVisible: false,
      editCarouselForm: {
        description: '',
        songIds: '',
        picLinks: '',
        carouselId: ''
      },
      editLabelPosition: 'left',
      rules: {
        blockA: [
          { required: true, message: 'Please enter the blockA', trigger: 'blur' }
        ],
        blockB: [
          { required: true, message: 'Please enter the blockB', trigger: 'blur' }
        ],
        blockC: [
          { required: true, message: 'Please select the blockC', trigger: 'blur' }
        ],
        blockD: [
          { required: true, message: 'Please select the blockD', trigger: 'blur' }
        ],
        blockE: [
          { required: true, message: 'Please select the blockE', trigger: 'blur' }
        ]
      },
      addDialogVisible: false,
      addLabelPosition: 'left',
      addCarouselForm: {
        description: '',
        songIds: '',
        picLinks: ''
      }
    }
  },
  methods: {
    handleEdit (index, row) {
      this.editCarouselForm.description = row.description
      this.editCarouselForm.songIds = row.songIds
      this.editCarouselForm.picLinks = row.picLinks
      this.editCarouselForm.carouselId = row.carouselId
      this.editDialogVisible = true
    },
    handleDelete (index, row) {
      this.$confirm('您确定要该条数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.selectedData.push(row)
        this.deleteData()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    changePage (currentPage) {
      this.showTable(currentPage, this.pageSize)
    },
    showTable (currentPage, pageSize) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        target: '.el-table'
      })
      this.$axios({
        method: 'post',
        url: 'http://localhost:58080/carousel/getAllCarousel',
        transformRequest: [
          function (data) {
            return qs.stringify(data)
          }
        ],
        data: {
          pageNo: currentPage,
          pageSize: pageSize
        }
      })
        .then((response) => {
          this.gridData = response.data.data.list
          this.total = response.data.data.total
          loading.close()
        })
        .catch((error) => {
          console.log(error)
          loading.close()
        })
    },
    handleSelectionChange (val) {
      this.selectedData = val
    },
    addData () {
      this.addDialogVisible = true
    },
    deleteSelectedData () {
      this.$confirm('您确定要删除选中项吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteLoading = true
        this.deleteData()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteData () {
      let carouselIds = []
      this.selectedData.forEach((value, index) => {
        carouselIds.push(value.carouselId)
      })
      this.$axios({
        method: 'post',
        url: 'http://localhost:58080/carousel/deleteCarousel',
        data: carouselIds
      })
        .then((response) => {
          this.deleteLoading = false
          if (response.data.statusCode === 200) {
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            })
            this.showTable(this.currentPage, this.pageSize)
          } else {
            this.$message({
              showClose: true,
              message: '删除失败',
              type: 'error'
            })
          }
        })
        .catch(() => {
          this.deleteLoading = false
          this.$message({
            showClose: true,
            message: '系统错误',
            type: 'error'
          })
        })
    },
    submitForm () {
      this.$refs.editCarouselForm.validate((valid) => {
        if (valid) {
          let carousel = {
            description: this.editCarouselForm.description,
            songIds: this.editCarouselForm.songIds,
            picLinks: this.editCarouselForm.picLinks,
            carouselId: this.editCarouselForm.carouselId
          }
          this.$axios.request({
            method: 'post',
            url: 'http://localhost:58080/carousel/updateCarousel',
            data: carousel
          })
            .then((response) => {
              if (response.data.statusCode === 200) {
                this.$message({
                  showClose: true,
                  message: '修改成功',
                  type: 'success'
                })
                this.editDialogVisible = false
                this.showTable(this.currentPage, this.pageSize)
              } else {
                this.$message({
                  showClose: true,
                  message: response.data.statusMsg,
                  type: 'error'
                })
              }
            })
            .catch((error) => {
              console.log(error)
              this.$message({
                showClose: true,
                message: '系统异常',
                type: 'error'
              })
            })
        }
      })
    },
    resetForm () {
      this.$refs.editCarouselForm.resetFields()
    },
    submitAddForm () {
      this.$refs.addCarouselForm.validate((valid) => {
        if (valid) {
          let carousel = {
            description: this.addCarouselForm.description,
            songIds: this.addCarouselForm.songIds,
            picLinks: this.addCarouselForm.picLinks,
            carouselId: this.addCarouselForm.carouselId
          }
          this.$axios.request({
            method: 'post',
            url: 'http://localhost:58080/carousel/addCarousel',
            data: carousel
          })
            .then((response) => {
              if (response.data.statusCode === 200) {
                this.$message({
                  showClose: true,
                  message: '新增成功',
                  type: 'success'
                })
                this.addDialogVisible = false
                this.showTable(this.currentPage, this.pageSize)
              } else {
                this.$message({
                  showClose: true,
                  message: response.data.statusMsg,
                  type: 'error'
                })
              }
            })
            .catch((error) => {
              console.log(error)
              this.$message({
                showClose: true,
                message: '系统异常',
                type: 'error'
              })
            })
        }
      })
    },
    resetAddForm () {
      this.$refs.addCarouselForm.resetFields()
    }
  },
  mounted () {
    this.showTable(this.currentPage, this.pageSize)
  }
}
</script>

<style scoped>

</style>
