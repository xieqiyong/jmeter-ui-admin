<template>
  <lay-result v-bind:title="username" describe=""></lay-result>
</template>

<script>
import { useUserStore } from "../../../store/user";

export default {
  
  setup (){
    const userInfoStore = useUserStore()
    const username = "欢迎用户【"+userInfoStore.userInfo.username+"】";

    return{
      username
    }
  }
}
</script>


<style scoped>
.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Optional: Set height to 100% of the viewport height for full page centering */
}
.content {
  text-align: left;
  background: #fafafa;
  border-radius: 4px;
  padding: 20px;
}
</style>