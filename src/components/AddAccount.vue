<template>
  <div style="width: 30%;margin: 80px auto">
    <el-form :label-position="labelPosition" label-width="100px" :model="detailFormLabel" :rules="rules" ref="detailFormLabel" status-icon>
      <el-form-item label="UserName" prop="userName">
        <el-input v-model="detailFormLabel.userName"></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="userPassword">
        <el-input type="password" v-model="detailFormLabel.userPassword"></el-input>
      </el-form-item>
      <el-form-item label="Avatar" prop="avatarFile">
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          v-model="detailFormLabel.avatarFile">
          <img v-if="detailFormLabel.avatarLink" :src="detailFormLabel.avatarLink" class="avatar" alt="imageUrl">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-progress class="myPro" v-show="processShow === true" type="circle" :percentage="percent" :width="width" :show-text="showText"></el-progress>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('detailFormLabel')" style="width: 85px">Submit</el-button>
        <el-button @click="resetForm('detailFormLabel')" style="width: 85px">Reset</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'AddAccount',
  data: function () {
    return {
      labelPosition: 'left',
      processShow: true,
      modal: false,
      showText: false,
      percent: 0,
      width: 30,
      detailFormLabel: {
        userName: '',
        userPassword: '',
        avatarLink: '',
        avatarFile: null
      },
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
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.processShow = true
          let formData = new FormData()
          formData.append('userName', this.detailFormLabel.userName)
          formData.append('userPassword', this.detailFormLabel.userPassword)
          formData.append('userAvatar', this.detailFormLabel.avatarFile)
          this.$axios.request({
            method: 'post',
            headers: {'Content-Type': 'multipart/form-data'},
            url: 'http://localhost:58080/user/addOrEditUser',
            data: formData,
            onUploadProgress: progressEvent => {
              this.percent = (progressEvent.loaded / progressEvent.total * 100)
            }
          })
            .then((response) => {
              this.percent = 0
              if (response.data.statusCode === 200) {
                this.processShow = false
                this.$message({
                  showClose: true,
                  message: '添加成功',
                  type: 'success'
                })
                this.resetForm('detailFormLabel')
              } else {
                this.processShow = false
                this.$message({
                  showClose: true,
                  message: response.data.statusMsg,
                  type: 'error'
                })
              }
            })
            .catch((error) => {
              this.percent = 0
              this.processShow = false
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
    resetForm (formName) {
      this.detailFormLabel.avatarLink = ''
      this.$refs[formName].resetFields()
    },
    beforeAvatarUpload (file) {
      this.detailFormLabel.avatarFile = file
      this.imagePreview(file)
      return false
    },
    imagePreview: function (file) {
      let self = this
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function (e) {
        self.detailFormLabel.avatarLink = e.target.result
      }
    }
  }
}
</script>

<style scoped>
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
.myPro {
  float: left;
  margin-left: 76px;
  position: absolute;
  top: 142px;
}
</style>
