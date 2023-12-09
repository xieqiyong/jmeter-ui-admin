<template>
  <lay-tab type="card" v-model="current3">
    <lay-tab-item title="场景列表" id="1">
      <div style="padding:20px">
          <lay-container fluid="true" class="file-box">
              <lay-card>
                <lay-form style="margin-top: 10px">
                  <lay-row>
                    <lay-col :md="5">
                      <lay-form-item label="场景名称" label-width="80">
                        <lay-input
                          v-model="searchQuery.fileName"
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

                  <template v-slot:toolbar>
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
          </lay-container>
      </div>
    </lay-tab-item>
    <lay-tab-item title="新增场景" id="2">
      <div style="padding:20px">
          <div>
            <lay-card>
              <p class="top-title">新增压测场景</p>
              <p class="describe">
                请分步配置压测场景
              </p>
            </lay-card>
            <lay-container :fluid="true" style="padding: 10px; padding-top: 0px">
              <lay-card style="padding: 40px">
                <lay-step :active="active" current-status="primary" center>
                  <lay-step-item title="第一步" content="填写场景基本信息">
                    <template #pace>
                      <lay-icon type="layui-icon-ok"></lay-icon>
                    </template>
                  </lay-step-item>
                  <lay-step-item title="第二步" content="确认转账信息"></lay-step-item>
                  <lay-step-item title="第三步" content="转账成功"></lay-step-item>
                </lay-step>

                <div class="step-form">
                  <lay-notice-bar
                    v-show="active < 2"
                    leftIcon="layui-icon-help-circle"
                    rightIcon="layui-icon-close"
                    :text="
                      active < 1
                        ? '请确认您填写的信息无误哦'
                        : '确认转账后，资金将直接打入对方账户，无法退回'
                    "
                    background="#ecf5ff"
                  ></lay-notice-bar>
                  <div style="height: 20px"></div>

                  <lay-form
                    v-show="active != 2"
                    :model="formValue"
                    label-width="120"
                    :pane="active == 1"
                  >
                    <lay-form-item label="付款账户" prop="account" required>
                      <lay-input
                        :allow-clear="true"
                        v-model="formValue.account"
                      ></lay-input>
                    </lay-form-item>
                    <lay-form-item label="收款账户" prop="payee" required>
                      <lay-row :span="24">
                        <lay-col md="6">
                          <lay-select
                            :allow-clear="true"
                            style="width: 100%; display: inline-block"
                            v-model="formValue.payType"
                            placeholder="请选择"
                          >
                            <lay-select-option value="zhifubao" label="支付宝">
                            </lay-select-option>
                            <lay-select-option value="weixin" label="微信">
                            </lay-select-option>
                          </lay-select>
                        </lay-col>
                        <lay-col md="18">
                          <lay-input
                            style="width: 100%; display: inline-block"
                            v-model="formValue.payee"
                          >
                          </lay-input>
                        </lay-col>
                      </lay-row>
                    </lay-form-item>
                    <lay-form-item label="收款人姓名" prop="payeeName" required>
                      <lay-input
                        :allow-clear="true"
                        v-model="formValue.payeeName"
                      ></lay-input>
                    </lay-form-item>
                    <lay-form-item label="转账金额" prop="amount" required>
                      <lay-input :allow-clear="true" v-model="formValue.amount">
                        <template #prefix> ￥</template>
                      </lay-input>
                    </lay-form-item>
                    <lay-form-item
                      v-show="active == 1"
                      label="支付密码"
                      prop="password"
                      required
                    >
                      <lay-input
                        :allow-clear="true"
                        type="password"
                        v-model="formValue.password"
                      >
                      </lay-input>
                    </lay-form-item>
                  </lay-form>
                  <div v-if="active == 2" class="option-result">
                    <div style="width: 100%; height: 210px; text-align: center">
                      <img
                        src="../../assets/common/success.png"
                        alt=""
                        style="width: 80px; height: 80px"
                      />
                      <div
                        style="
                          font-size: 20px;
                          color: #101662;
                          font-weight: 600;
                          margin-top: 15px;
                        "
                      >
                        操作成功
                      </div>
                      <div style="font-size: 12px; color: #ccc; margin-top: 5px">
                        预计两小时内到账
                      </div>

                      <div style="font-size: 10px; color: #ccc; margin-top: 15px">
                        <lay-button size="sm" type="normal" @click="next">
                          在转一笔
                        </lay-button>
                        <lay-button size="sm"> 查看账单 </lay-button>
                      </div>
                    </div>

                    <lay-row>
                      <lay-col md="4" class="title">付款账户</lay-col>
                      <lay-col md="20" class="content borderR">
                        {{ formValue.account }}
                      </lay-col>
                    </lay-row>
                    <lay-row>
                      <lay-col md="4" class="title">收款账户</lay-col>
                      <lay-col md="20" class="content borderR">
                        {{ formValue.payee }}
                      </lay-col>
                    </lay-row>
                    <lay-row>
                      <lay-col md="4" class="title">收款人姓名</lay-col>
                      <lay-col md="20" class="content borderR">
                        {{ formValue.payeeName }}
                      </lay-col>
                    </lay-row>
                    <lay-row>
                      <lay-col md="4" class="title borderB">转账金额</lay-col>
                      <lay-col md="20" class="content borderR borderB">
                        <span style="font-size: 18px">
                          {{ formValue.amount }} &nbsp;</span
                        >元
                      </lay-col>
                    </lay-row>
                  </div>
                  <lay-row style="margin-top: 0px" v-if="active < 2">
                    <div style="display: inline-block; width: 120px"></div>
                    <lay-button
                      type="primary"
                      :style="{
                        marginRight: '15px',
                        marginLeft: active < 1 ? '15px' : '0px'
                      }"
                      size="sm"
                      @click="next"
                    >
                      下一步
                    </lay-button>
                    <lay-button size="sm" v-show="active > 0" @click="previous">
                      上一步
                    </lay-button>
                  </lay-row>
                </div>
              </lay-card>
            </lay-container>
          </div>
      </div>
    </lay-tab-item>
  </lay-tab>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import { layer } from '@layui/layui-vue'
import { onMounted } from 'vue';
import { getScriptLists,deleteScript } from '../../api/module/user'
import { useUserStore } from "../../store/user";
    const model = reactive({
        username: 'admin',
        password: '123456',
        specialty: '1',
        hobby: '1',
        desc: '修复开启 isLazyimg:true 后, 图片懒加载但是图片不存在的报错问题'
    })

    const submitClick = function () {
    layer.msg(`${JSON.stringify(model)}`, () => {})
    }

    const loading1 = ref(true)
    const active = ref(0)
    const next = () => {
      if (active.value++ >= 2) active.value = 0
    }
    const previous = () => {
      if (active.value-- === 0) active.value = 0
    }
    const formValue = reactive({
      account: 'layuivueadmin@layui-vue.com',
      payType: 'zhifubao',
      payee: 'layuivueadmin@layui-test',
      payeeName: 'layuivueAdmin',
      amount: '500',
      password: '123456'
    })

    function toReset1() {
      formValue.account = ''
      formValue.payType = 'zhifubao'
      formValue.payee = ''
      formValue.payeeName = ''
      formValue.amount = ''
      formValue.password = ''
    }

    const submit2 = function () {
      layer.open(`${JSON.stringify(model)}`)
    }


    const current3 = ref("1")
    const userInfoStore = useUserStore()
    const getHeader = () => {
        return { token: userInfoStore.token}
    }

    const visibleImport = ref(false)
    const file1 = ref<any>([])
    function toImport() {
      // layer.msg('导入')
      visibleImport.value = true
    }
    const searchQuery = ref({
      fileIndex: '',
      fileName: '',
      uploadUser: ''
    })

    function toReset() {
      searchQuery.value = {
        fileIndex: '',
        fileName: '',
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
        getScriptLists(searchQuery.value.fileName).then(
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
    
</script>
<style lang="less" scoped>
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




.top-title {
  font-size: 20px;
  font-weight: 500;
  margin-top: 12px;
  margin-bottom: 20px;
}

.describe {
  font-size: 14px;
  margin-bottom: 12px;
}
.step-form {
  width: 100%;
  padding: 20px 150px;
  box-sizing: border-box;

  .layui-row:after,
  .layui-row:before {
    display: none;
  }
}
.option-result {
  width: 100%;
  height: 400px;
  font-size: 14px;

  .title {
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    display: inline-block;
    background: #f7f7f7;
    border-top: 1px solid #e8e8e8;
    border-left: 1px solid #e8e8e8;
  }
  .content {
    height: 40px;
    line-height: 40px;
    padding: 0 3px 0 10px;
    border-top: 1px solid #e8e8e8;
    border-left: 1px solid #e8e8e8;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
  }
  .borderR {
    border-right: 1px solid #e8e8e8;
  }
  .borderB {
    border-bottom: 1px solid #e8e8e8;
  }
}

</style>