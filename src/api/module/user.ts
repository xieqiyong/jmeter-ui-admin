import { isDate } from '.pnpm/@vue+shared@3.3.4/node_modules/@vue/shared';
import Http from '../http';

export const login = function(loginForm: any) {
    return Http.post('/api/v1/user/login', loginForm)
}

export const menu = function() {
    return Http.get('/api/v1/user/menu') 
}

export const permission = function() {
    return Http.get('/api/v1/user/permission') 
}

export const getUserInfo = function() {
    return Http.get('/api/v1/user/info') 
}

// 获取列表信息
export const passwordList = function(pageSize: string, pageNum: string) {
    return Http.get('/api/v1/user/password/list?pageSize='+pageSize+"&pageNum="+pageNum);
}

// 保存用户信息
export const savePassword = function(userPassword: any) {
    return Http.post('/api/v1/user/password/save', userPassword);
}

// 删除信息
export const deletePassword = function(ids: object) {
    return Http.post('/api/v1/user/password/delete?ids='+ids);
}

// 获取压测信息
export const getRpsData = function(stressId: string, startTime: string|number, endTime: string){
    return Http.get("/api/v1/data/getRps?stressId="+stressId+"&startTime="+startTime+"&endTime="+endTime)
}

export const getScriptLists = function(filename:string){
    return Http.get("/api/v1/script/list?filename="+filename)
}

export const deleteScript = function(ids: object){
    return Http.post("/api/v1/script/delete?ids="+ids)
}