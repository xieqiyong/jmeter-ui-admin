<template>
  <lay-container fluid="true" class="file-box">
    <lay-card>
      <lay-form style="margin-top: 10px">
        <lay-row>
          <lay-col :md="5">
            <lay-form-item label="脚本名称" label-width="80">
              <lay-input
                v-model="searchQuery.flieName"
                placeholder="请输入"
                size="sm"
                :allow-clear="true"
                style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label-width="20">
              <lay-button
                style="margin-left: 20px"
                type="normal"
                size="sm"
                @click="toSearch"
              >
                查询
              </lay-button>
              <lay-button size="sm" @click="toReset"> 重置 </lay-button>
            </lay-form-item>
          </lay-col>
        </lay-row>
      </lay-form>
    </lay-card>
    <!-- table -->
    <div class="table-box">
      <lay-table
        :even="true"
        :resize="true"
        :autoColsWidth="true"
        :page="page"
        :columns="columns"
        :height="'100%'"
        :loading="loading"
        :default-toolbar="false"
        :data-source="dataSource"
        v-model:selected-keys="selectedKeys"
        @change="change"
        @sortChange="sortChange"
      >
        <template #fileIndex="{ row }">
          <a
            style="color: #1677ff"
            href="https://foruda.gitee.com/avatar/1677022544584087390/4835367_jmysy_1578975358.png"
            target="_blank"
            >{{ row.fileIndex }}</a
          >
        </template>

        <template v-slot:toolbar>
          <lay-button size="sm" type="primary" @click="toImport">
            <lay-icon class="layui-icon-upload-drag"></lay-icon>
            上传
          </lay-button>
          <lay-button size="sm" @click="toRemove">
            <lay-icon class="layui-icon-delete"></lay-icon>
            删除
          </lay-button>
        </template>
        <template v-slot:operator="{ row }">
          <lay-button
            size="xs"
            border="green"
            border-style="dashed"
            @click="toDownload(row)"
            >下载</lay-button
          >
          <lay-popconfirm
            content="确定要删除此文件吗?"
            @confirm="confirm"
            @cancel="cancel"
          >
            <lay-button size="xs" border="red" border-style="dashed"
              >删除</lay-button
            >
          </lay-popconfirm>
        </template>
      </lay-table>
    </div>

    <lay-layer
      v-model="visibleImport"
      title="上传脚本文件"
      :area="['380px', '380px']"
    >
      <lay-upload
        :beforeUpload="bupload"
        style="margin: 60px"
        :headers="getHeader()"
        url="http://127.0.0.1:8085/api/v1/script/upload"
        :drag="true"
        @done="uploadRet"
        @error="uploadErr"
      >
      </lay-upload>
    </lay-layer>
  </lay-container>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { layer } from '@layui/layui-vue'
import { onMounted } from 'vue';
import { getScriptLists,deleteScript } from '../../api/module/user'
import { useUserStore } from "../../store/user";

const userInfoStore = useUserStore()
const getHeader = () => {
    return { token: userInfoStore.token}
}

// 上传校验
const bupload = (result: {size: number, name: string}) => {
    if(result.size >= 10485760){
        layer.msg("上传文件大小不能超过10MB", { time: 1000, icon: 2})
        return false;
    }
    const parts = result.name.split('.');
    var fileExt = parts[parts.length - 1];
    if(fileExt !== "jmx"){
        layer.msg("只能上传后缀为jmx的文件", { time: 1000, icon: 2})
        return false;
    }
}
const uploadRet = (result: {data : string}) => {
    if(result.data === ""){
        layer.msg("请等待", { time: 1000, icon: 0 })
        return;
    }
    const code = JSON.parse(result.data)
    if(code.code === "00000"){
        layer.msg("上传成功", { time: 1000, icon: 1 })
        visibleImport.value =false;
        loadDataSource(page.current, page.limit)
    }else{
        layer.msg(code.message, { time: 1000, icon: 2 })
    }
}
const uploadErr = (result: {data : string}) => {
    console.log(result)
}
const searchQuery = ref({
  fileIndex: '',
  flieName: '',
  uploadUser: ''
})

const visibleImport = ref(false)
const file1 = ref<any>([])
function toImport() {
  // layer.msg('导入')
  visibleImport.value = true
}
function toReset() {
  searchQuery.value = {
    fileIndex: '',
    flieName: '',
    uploadUser: ''
  }
  page.current = 1
  change(page)
}

function toSearch() {
  page.current = 1
  change(page)
}
function toDownload(row: any) {
  layer.msg('下载成功！')
}

const loading = ref(false)
const selectedKeys = ref([])
const page = reactive({ current: 1, limit: 10, total: 100 })
const columns = ref([
  { title: '选项', width: '55px', type: 'checkbox', fixed: 'left' },
  { title: '脚本名称', width: '120px', key: 'scriptName', sort: 'desc' },
  { title: '文件大小(kb)', width: '80px', key: 'fileSize', sort: 'desc' },
  { title: '字符集', width: '120px', key: 'charsetContent', sort: 'desc' },
  { title: '文件后缀', width: '120px', key: 'fileExt', sort: 'desc' },
  { title: '创建时间', width: '220px', key: 'createTime', sort: 'desc' },
  {
    title: '操作',
    width: '150px',
    customSlot: 'operator',
    key: 'operator',
    fixed: 'right'
  }
])


const dataSource = ref([])

const getScriptList = () => {
    getScriptLists(searchQuery.value.flieName).then(
        response =>{
                const { data } = response;
                if (data.code === "00000") { 
                    dataSource.value =  data.data;
                }else{
                    console.log("数据加载失败");
                }
        }
    )
}
onMounted(() => {
    loadDataSource(page.current, page.limit)
});

const change = (page: any) => {
  loading.value = true
  setTimeout(() => {
    loadDataSource(page.current, page.limit)
    loading.value = false
  }, 1000)
}
const sortChange = (key: any, sort: number) => {
  layer.msg(`字段${key} - 排序${sort}, 你可以利用 sort-change 实现服务端排序`)
}

const loadDataSource = (page: number, pageSize: number) => {
  var startIndex = (page - 1) * pageSize + 1
  var endIndex = page * pageSize
  getScriptList()
}
function toRemove() {
  if (selectedKeys.value.length == 0) {
    layer.msg('您未选择数据，请先选择要删除的数据', { icon: 3, time: 2000 })
    return
  }
  layer.confirm('您将删除所有选中的数据？', {
    title: '提示',
    btn: [
      {
        text: '确定',
        callback: (id: any) => {
          deleteScript(selectedKeys.value).then(
              response => {
                  const { data } = response;
                if (data.code === "00000") {
                    layer.msg('删除成功', { icon: 1, time: 1000 })
                    getScriptList()
                }else{
                    layer.msg('删除失败', { icon: 0, time: 1000 })
                }
              }
          )
          layer.close(id)
        }
      },
      {
        text: '取消',
        callback: (id: any) => {
          layer.close(id)
        }
      }
    ]
  })
}

function confirm() {
  layer.msg('您已成功删除')
}
function cancel() {
  layer.msg('您已取消操作')
}
const beforeUpload = (file: any) => {
  var isOver = false
  return new Promise((resolver) => resolver(true))
}
</script>

<style scoped>
.file-box {
  width: calc(100vw - 220px);
  height: calc(100vh - 110px);
  margin-top: 10px;
  box-sizing: border-box;
  overflow: hidden;
}
.top-search {
  margin-top: 10px;
  padding: 10px;
  height: 40px;
  border-radius: 4px;
  background-color: #fff;
}
.table-box {
  margin-top: 10px;
  padding: 10px;
  height: 700px;
  width: 100%;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: #fff;
}

.search-input {
  display: inline-block;
  width: 98%;
  margin-right: 10px;
}
.table-style {
  margin-top: 10px;
}
.isChecked {
  display: inline-block;
  background-color: #e8f1ff;
  color: red;
}
</style>