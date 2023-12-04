<template>
  <lay-container fluid="true" style="padding: 10px">
    <lay-row :space="10">
      <lay-col :md="24">
        <lay-card>
          <lay-form style="margin-top: 20px">
            <lay-row>
              <lay-col :md="6">
                <lay-form-item label="账号：" label-width="50">
                  <lay-input
                    v-model="searchAccount"
                    style="width: 90%"
                  ></lay-input>
                </lay-form-item>
              </lay-col>
              <lay-col :md="6">
                <lay-form-item label="邮箱：" label-width="50">
                  <lay-input
                    v-model="searchEmail"
                    style="width: 90%"
                  ></lay-input>
                </lay-form-item>
              </lay-col>
              <lay-col :md="6">
                <lay-form-item label-width="0">
                  <lay-button type="primary" @click="toSearch" disabled="true">查询</lay-button>
                  <lay-button @click="toReset" disabled="true">重置</lay-button>
                </lay-form-item>
              </lay-col>
            </lay-row>
          </lay-form>
        </lay-card>
      </lay-col>
      <lay-col :md="24">
        <lay-card>
          <lay-table
            :page="page"
            :columns="columns"
            :dataSource="dataSource"
            :default-toolbar="defaultToolbar"
            v-model:selectedKeys="selectedKeys"
            @row="rowClick"
            @change="change"
          >
            <template v-slot:toolbar>
              <lay-button size="sm" type="primary" @click="changeVisible11('新增')" >
                <lay-icon class="layui-icon-addition"></lay-icon>
            新增</lay-button>
            
              <lay-button size="sm" @click="deleteRow()">删除</lay-button>
            </template>
            <template v-slot:accountName="{ data }">
              {{ data.accountName }}
            </template>
            <template v-slot:password="{ data }">
              {{ data.password }}
            </template>
            <template v-slot:footer>
            </template>
          </lay-table>
        </lay-card>
      </lay-col>
    </lay-row>
    <lay-layer v-model="visible11" :title="title" :area="['500px', '550px']">
      <div style="padding: 20px">
        <lay-form :model="userPassword" ref="layFormRef11" required>
          <lay-form-item label="账号名称" prop="accountName">
            <lay-input v-model="userPassword.accountName" placeholder="例如：1158902181@qq.com"></lay-input>
          </lay-form-item>
           <lay-form-item label="账号密码" prop="password">
            <lay-input v-model="userPassword.password"></lay-input>
          </lay-form-item>
          <lay-form-item label="网址" prop="address">
            <lay-input v-model="userPassword.address" placeholder="例如：www.qq.com"></lay-input>
          </lay-form-item>
          <lay-form-item label="网站用途" prop="passwordScene">
            <lay-input v-model="userPassword.passwordScene" placeholder="例如：登陆QQ"></lay-input>
          </lay-form-item>
           <lay-form-item label="账号归属人" prop="username">
            <lay-input v-model="userPassword.username" placeholder="例如：谢其勇"></lay-input>
          </lay-form-item>
        </lay-form>
        <div style="width: 100%; text-align: center">
          <lay-button size="sm" type="primary" @click="toSubmit"
            >保存</lay-button
          >
          <lay-button size="sm" @click="toCancel">取消</lay-button>
        </div>
      </div>
    </lay-layer>
  </lay-container>
</template>

<script lang="ts">

import { useRouter } from 'vue-router'
import { useUserStore } from '../../../store/user'
import { ref, watch } from 'vue'
import { layer } from '@layui/layer-vue'
import { passwordList,savePassword,deletePassword } from '../../../api/module/user'
import { onMounted } from 'vue'
export default {
  
  async mounted() {
    // 在页面加载时执行的代码
    await this.getPasswordList();
  },
  setup() {
    const dataSource = ref([]);
    const getPasswordList = () => {
    passwordList(limit, current)
    .then(response => {
      const { data } = response;
      if (data.code === "00000") {
        dataSource.value = data.data.list
        total = data.data.total
      } else {
        // 进行加载失败时的操作
        console.log("数据加载失败");
      }
    })
    .catch(error => {
      // 处理发生的错误
      console.error("获取密码列表时出错：", error);
    });
    };

    const selectedKeys = ref([]);
    const checkbox = ref(true)
    const defaultToolbar = ref(true)
    console.log(dataSource)
    
    var total = 10
    const limit = "10"
    const current = "1"
    const page = ref({ total: total, limit: limit, current: current })

    const columns = [
      {
        title: '复选',
        width: '50px',
        type: 'checkbox',
        fixed: 'left'
      },
      {
        title: '账号名称',
        width: '200px',
        customSlot: 'accountName',
        key: 'accountName'
      },
      {
        title: '密码',
        width: '180px',
        customSlot: 'password',
        key: 'password'
      },
      {
        title: '归属人',
        width: '180px',
        key: 'username'
      },
      {
        title: '使用场景',
        width: '180px',
        key: 'passwordScene'
      },
      {
        title: '平台网址',
        key: 'address',
        ellipsisTooltip: true
      },
      {
        title: '操作',
        width: '180px',
        customSlot: 'operator',
        key: 'operator',
        fixed: 'right'
      }
    ]

    
    
    const deleteRow = function(){
      if(selectedKeys.value.length === 0){
        layer.msg("请选择删除项", { icon: 0, time: 1000 })
        return;
      }
      deletePassword(selectedKeys.value)
          .then(response => {
            const { data } = response;
          if (data.code === "00000") {
              location.reload();
              layer.msg('删除成功', { icon: 1, time: 1000 })
          } else {
            // 进行加载失败时的操作
              layer.msg(data.message, { icon: 2, time: 2000 })
          }
        })
    }
    const rowClick = function (data: any) {
       
    }

    const rowDoubleClick = function (data: any) {}

    const change = function ({ current, limit }: any) {
        passwordList(limit, current)
          .then(response => {
            const { data } = response;
          if (data.code === "00000") {
              dataSource.value = data.data.list
          } else {
            // 进行加载失败时的操作
            console.log("数据加载失败");
          }
        })
    .catch(error => {
      // 处理发生的错误
      console.error("获取密码列表时出错：", error);
    });
      
    }
  
    const searchAccount = ref('')
    const searchEmail = ref('')
    function toReset() {
      searchAccount.value = ''
      searchEmail.value = ''
    }
    
   // 搜索
  function toSearch() {
      console.log(searchAccount)
  }
    return {
      deleteRow,
      toCancel,
      toSubmit,
      userPassword,
      title,
      visible11,
      changeVisible11,
      getPasswordList,
      columns,
      dataSource,
      selectedKeys,
      checkbox,
      defaultToolbar,
      page,
      rowClick,
      rowDoubleClick,
      change,
      toReset,
      toSearch,
      searchAccount,
      searchEmail
    }
  }
}
// 主体逻辑
const userPassword = ref<any>({
  accountName:"",
  password:"",
  address:"",
  passwordScene:""
})
const layFormRef11 = ref()
const visible11 = ref(false)
const title = ref('新增用户密码')
const changeVisible11 = () => {
  visible11.value = !visible11.value
}

// 提交
const toSubmit = function toSubmit() {
  savePassword(userPassword.value)
          .then(response => {
            const { data } = response;
          if (data.code === "00000") {
              location.reload();
              layer.msg('保存成功！', { icon: 1, time: 1000 })
          } else {
            // 进行加载失败时的操作
              layer.msg(data.message, { icon: 2, time: 2000 })
          }
        })
  
  visible11.value = false
}

// 取消
const toCancel = function toCancel() {
  visible11.value = false
}

</script>
