<template>
  <div>
    <el-button-group style="float: left;margin-bottom: 5px;">
      <el-button class="my-but" icon="el-icon-edit" size="small" @click="addAccount">Add</el-button>
      <el-button class="my-but-danger" icon="el-icon-delete" size="small" @click="deleteSelectedAccount" :loading="deleteLoading">Delete</el-button>
    </el-button-group>
    <el-table :data="gridData" border max-height="630px" height="630px" class="myTable" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column type="index" label="Index" width="70"></el-table-column>
      <el-table-column property="userId" label="UserId" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column property="userName" label="UserName" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column property="userPassword" label="Password" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column property="avatarLink" label="AvatarLink" show-overflow-tooltip></el-table-column>
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
    <el-dialog title="Edit Account" :visible.sync="editDialogVisible" width="35%" top="20vh" :close-on-click-modal="true">
      <el-form :label-position="editLabelPosition" label-width="100px" :model="editAccountForm" :rules="rules" ref="editAccountForm" status-icon>
        <el-form-item label="UserName" prop="userName">
          <el-input v-model="editAccountForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="userPassword">
          <el-input v-model="editAccountForm.userPassword"></el-input>
        </el-form-item>
        <el-form-item label="Avatar" prop="avatarFile">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            v-model="editAccountForm.avatarFile">
            <img v-if="editAccountForm.avatarLink" :src="editAccountForm.avatarLink" class="avatar" alt="imageUrl">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" style="width: 85px;float: left">Submit</el-button>
          <el-button @click="resetForm" style="width: 85px;float: left">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import qs from 'qs'

export default {
  name: 'Account',
  data: function () {
    return {
      gridData: [],
      currentPage: 1,
      pageSize: 10,
      total: 50,
      selectedData: [],
      deleteLoading: false,
      editDialogVisible: false,
      editAccountForm: {
        userId: '',
        userName: '',
        userPassword: '',
        avatarLink: '',
        avatarFile: null
      },
      editLabelPosition: 'left',
      rules: {
        userName: [
          { required: true, message: 'Please enter the User Name', trigger: 'blur' }
        ],
        userPassword: [
          { required: true, message: 'Please enter the Password', trigger: 'blur' }
        ],
        avatarFile: [
          { required: true, message: 'Please select the avatar file', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleEdit (index, row) {
      this.editAccountForm.userId = row.userId
      this.editAccountForm.userName = row.userName
      this.editAccountForm.userPassword = row.userPassword
      this.editAccountForm.avatarLink = row.avatarLink
      this.editDialogVisible = true
    },
    handleDelete (index, row) {
      this.$confirm('您确定要该条数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.selectedData.push(row)
        this.deleteAccount()
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
        url: 'http://localhost:58080/user/getAllUser',
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
    addAccount () {
      this.$router.push({
        path: '/content/home/account/add'
      })
    },
    deleteSelectedAccount () {
      this.$confirm('您确定要删除选中项吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteLoading = true
        this.deleteAccount()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteAccount () {
      let userIds = []
      this.selectedData.forEach((value, index) => {
        userIds.push(value.userId)
      })
      this.$axios({
        method: 'post',
        url: 'http://localhost:58080/user/deleteUser',
        data: userIds
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
      this.$refs.editAccountForm.validate((valid) => {
        if (valid) {
          let formData = new FormData()
          formData.append('userId', this.editAccountForm.userId)
          formData.append('userName', this.editAccountForm.userName)
          formData.append('userPassword', this.editAccountForm.userPassword)
          formData.append('userAvatar', this.editAccountForm.avatarFile)
          this.$axios.request({
            method: 'post',
            headers: {'Content-Type': 'multipart/form-data'},
            url: 'http://localhost:58080/user/addOrEditUser',
            data: formData
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
      this.editAccountForm.userId = ''
      this.editAccountForm.userName = ''
      this.editAccountForm.userPassword = ''
      this.editAccountForm.avatarLink = ''
      this.editAccountForm.avatarFile = null
    },
    beforeAvatarUpload (file) {
      this.editAccountForm.avatarFile = file
      this.imagePreview(file)
      return false
    },
    imagePreview: function (file) {
      let self = this
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function (e) {
        self.editAccountForm.avatarLink = e.target.result
      }
    }
  },
  mounted () {
    this.showTable(this.currentPage, this.pageSize)
  }
}
</script>

<style scoped>
/deep/.el-table th, /deep/.el-table tr {
  background-color: #E9EEF3;
}

/deep/.el-table--border {
  border-top: 1px solid #a5a7aa;
  border-left: none;
}

/deep/.el-table td, /deep/.el-table th.is-leaf {
  border-bottom: 1px solid #a5a7aa;
  border-right: 1px solid #a5a7aa;
}

/deep/.el-table td:first-child, /deep/.el-table th:first-child {
  border-left: 1px solid #a5a7aa;
}

/deep/.el-pagination button:disabled {
  background-color: #E9EEF3;
}

/deep/.my-pager ul li {
  background-color: #E9EEF3;
}

/deep/.el-pagination .btn-next, /deep/.el-pagination .btn-prev {
  background-color: #E9EEF3;
}

/deep/.el-table {
  background-color: #E9EEF3;
}

/deep/.myTable .el-checkbox__inner {
  background-color: #bdb4b4;
}

/deep/.myTable .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  border-color: #61666b;
}

/deep/.myTable .el-checkbox__input.is-focus .el-checkbox__inner {
  border-color: #61666b;
}

/deep/.myTable  .el-checkbox__inner:hover {
  border-color: #61666b;
}

/deep/.my-but-danger{
  background-color: #f39a9a;
  width: 80px;
}

/deep/.my-but{
  background-color: #E9EEF3;
  width: 80px;
}

/deep/.avatar-uploader {
  text-align: left;
}

/deep/.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
/deep/.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
/deep/.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
