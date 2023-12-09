import { defineStore } from 'pinia'
import { menu, permission, getUserInfo } from "../api/module/user";

export const useUserStore = defineStore({
  id: 'user',
  state: () => {
    return {
      token: '',
      userInfo: {},
      permissions: [],
      menus: [],
    }
  },
  actions: {
    async loadMenus(){
      const { data } = await menu();
      this.menus = data.data;
    },
    async loadPermissions(){
      const { data } = await permission();
      this.permissions = data.data;
    },
    async loadUserInfo(){
      const { data } = await getUserInfo();
      this.userInfo = data.data;
    }
  },
  persist: {
    storage: localStorage,
    paths: ['token', 'userInfo', 'permissions', 'menus' ],
  }
})