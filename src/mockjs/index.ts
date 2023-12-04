// @ts-ignore
import Mock from'mockjs';
import user from './user';

Mock.mock(/\/file\/upload/,'post',(req: any,res: any) =>{
    return user.getUpload(req,res)
}); 

export default Mock;