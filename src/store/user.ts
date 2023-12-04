import { defineStore } from 'pinia'
import { menu, permission } from "../api/module/user";

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
    }
  },
  persist: {
    storage: localStorage,
    paths: ['token', 'userInfo', 'permissions', 'menus' ],
  }
})