<template>
  <div>
    <el-button-group style="float: left;margin-bottom: 5px;">
      <el-button class="my-but" icon="el-icon-edit" size="small" @click="addData">Add</el-button>
      <el-button class="my-but-danger" icon="el-icon-delete" size="small" @click="deleteSelectedData" :loading="deleteLoading">Delete</el-button>
    </el-button-group>
    <el-table :data="gridData" border max-height="600px" height="600px" class="myTable" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column type="index" label="Index" width="70"></el-table-column>
      <el-table-column property="chartsId" label="ChartsId" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column property="blockA" label="BlockA" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column property="blockB" label="BlockB" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column property="blockC" label="BlockC" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column property="blockD" label="BlockD" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column property="blockE" label="BlockE" show-overflow-tooltip></el-table-column>
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
      <el-form :label-position="editLabelPosition" label-width="100px" :model="editTopForm" :rules="rules" ref="editTopForm" status-icon>
        <el-form-item label="BlockA" prop="blockA">
          <el-input v-model="editTopForm.blockA"></el-input>
        </el-form-item>
        <el-form-item label="BlockB" prop="blockB">
          <el-input v-model="editTopForm.blockB"></el-input>
        </el-form-item>
        <el-form-item label="BlockC" prop="blockC">
          <el-input v-model="editTopForm.blockC"></el-input>
        </el-form-item>
        <el-form-item label="BlockD" prop="blockD">
          <el-input v-model="editTopForm.blockD"></el-input>
        </el-form-item>
        <el-form-item label="BlockE" prop="blockE">
          <el-input v-model="editTopForm.blockE"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" style="width: 85px;float: left">Submit</el-button>
          <el-button @click="resetForm" style="width: 85px;float: left">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="Add Top" :visible.sync="addDialogVisible" width="65%" top="20vh" :close-on-click-modal="true">
      <el-form :label-position="addLabelPosition" label-width="100px" :model="addTopForm" :rules="rules" ref="addTopForm" status-icon>
        <el-form-item label="BlockA" prop="blockA">
          <el-input v-model="addTopForm.blockA"></el-input>
        </el-form-item>
        <el-form-item label="BlockB" prop="blockB">
          <el-input v-model="addTopForm.blockB"></el-input>
        </el-form-item>
        <el-form-item label="BlockC" prop="blockC">
          <el-input v-model="addTopForm.blockC"></el-input>
        </el-form-item>
        <el-form-item label="BlockD" prop="blockD">
          <el-input v-model="addTopForm.blockD"></el-input>
        </el-form-item>
        <el-form-item label="BlockE" prop="blockE">
          <el-input v-model="addTopForm.blockE"></el-input>
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
  name: 'Top',
  data: function () {
    return {
      gridData: [],
      currentPage: 1,
      pageSize: 10,
      total: 50,
      selectedData: [],
      deleteLoading: false,
      editDialogVisible: false,
      editTopForm: {
        blockA: '',
        blockB: '',
        blockC: '',
        blockD: '',
        blockE: '',
        chartsId: ''
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
      addTopForm: {
        blockA: '',
        blockB: '',
        blockC: '',
        blockD: '',
        blockE: ''
      }
    }
  },
  methods: {
    handleEdit (index, row) {
      this.editTopForm.blockA = row.blockA
      this.editTopForm.blockB = row.blockB
      this.editTopForm.blockC = row.blockC
      this.editTopForm.blockD = row.blockD
      this.editTopForm.blockE = row.blockE
      this.editTopForm.chartsId = row.chartsId
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
        url: 'http://localhost:58080/charts/getAllCharts',
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
      let chartsIds = []
      this.selectedData.forEach((value, index) => {
        chartsIds.push(value.chartsId)
      })
      this.$axios({
        method: 'post',
        url: 'http://localhost:58080/charts/deleteTop',
        data: chartsIds
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
      this.$refs.editTopForm.validate((valid) => {
        if (valid) {
          let charts = {
            blockA: this.editTopForm.blockA,
            blockB: this.editTopForm.blockB,
            blockC: this.editTopForm.blockC,
            blockD: this.editTopForm.blockD,
            blockE: this.editTopForm.blockE
          }
          this.$axios.request({
            method: 'post',
            url: 'http://localhost:58080/charts/updateTop',
            data: charts
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
      this.$refs.editTopForm.resetFields()
    },
    submitAddForm () {
      this.$refs.addTopForm.validate((valid) => {
        if (valid) {
          let charts = {
            blockA: this.addTopForm.blockA,
            blockB: this.addTopForm.blockB,
            blockC: this.addTopForm.blockC,
            blockD: this.addTopForm.blockD,
            blockE: this.addTopForm.blockE
          }
          this.$axios.request({
            method: 'post',
            url: 'http://localhost:58080/charts/addTop',
            data: charts
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
      this.$refs.addTopForm.resetFields()
    }
  },
  mounted () {
    this.showTable(this.currentPage, this.pageSize)
  }
}
</script>

<style scoped>

</style>
