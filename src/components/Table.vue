<template>
  <div>
    <el-row>
      <el-button type="info" plain v-on:click="showTable(1, 10)">
        <span>{{ msg }}</span>
      </el-button>
    </el-row>
    <el-dialog title="Song List" :visible.sync="dialogTableVisible" width="80%">
      <el-table :data="gridData" border max-height="580" height="580">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column property="songName" label="歌曲" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column property="singer" label="歌手" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column property="songLink" label="歌曲链接" width="300" show-overflow-tooltip></el-table-column>
        <el-table-column property="lyricLink" label="歌词链接" width="300" show-overflow-tooltip></el-table-column>
        <el-table-column property="playedNum" label="播放数" width="100"></el-table-column>
        <el-table-column property="collectedNum" label="收藏数" ></el-table-column>
        <el-table-column property="createTime" label="添加时间" width="180"></el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination small layout="prev, pager, next" :total="this.total" @current-change="changePage" :current-page="this.currentPage" :page-size="this.pageSize"></el-pagination>
      <el-dialog title="Song Detail" :visible.sync="innerDialogVisible" width="65%" append-to-body top="30vh" :close-on-click-modal="false">
        <el-form :label-position="labelPosition" label-width="80px" :model="detailFormLabel">
          <el-form-item label="歌曲">
            <el-input v-model="detailFormLabel.songName"></el-input>
          </el-form-item>
          <el-form-item label="歌手">
            <el-input v-model="detailFormLabel.singer"></el-input>
          </el-form-item>
          <el-form-item label="歌曲链接">
            <el-input v-model="detailFormLabel.songLink"></el-input>
          </el-form-item>
          <el-form-item label="歌词链接">
            <el-input v-model="detailFormLabel.lyricLink"></el-input>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import qs from 'qs'

export default {
  name: 'Table',
  data: function () {
    return {
      msg: '打开表格',
      gridData: [],
      dialogTableVisible: false,
      total: 50,
      currentPage: 1,
      pageSize: 10,
      innerDialogVisible: false,
      labelPosition: 'right',
      detailFormLabel: {
        songName: '',
        singer: '',
        songLink: '',
        lyricLink: ''
      }
    }
  },
  methods: {
    handleEdit (index, row) {
      this.detailFormLabel = row
      this.innerDialogVisible = true
    },
    handleDelete (index, row) {
      this.$message({
        showClose: true,
        message: '暂不支持删除操作',
        type: 'warning'
      })
    },
    showTable (pageNo, pageSize) {
      this.dialogTableVisible = true
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        target: '.el-table'
      })
      this.$axios({
        method: 'post',
        url: 'http://localhost:58080/musicLink/getMusicLinkList',
        transformRequest: [
          function (data) {
            return qs.stringify(data)
          }
        ],
        data: {
          pageNo: pageNo,
          pageSize: pageSize,
          topType: 2
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
    changePage (currentPage) {
      this.showTable(currentPage, this.pageSize)
    }
  }
}
</script>

<style scoped>
.el-dialog__header {
  background-color: #ddfff5;
}
.el-dialog__body {
  background-color: #ddfff5;
}

.el-table th, .el-table tr {
  background-color: #ddfff5;
}

.el-pagination button:disabled {
  background-color: #ddfff5;
}

.el-dialog, .el-pager li {
  background-color: #ddfff5;
}

.el-pagination .btn-next, .el-pagination .btn-prev {
  background-color: #ddfff5;
}

.el-table {
  background-color: #ddfff5;
}
</style>
