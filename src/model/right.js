module.exports = class extends think.Model {
  //  根据某角色ID获取其权限模块
  getlist(rid){
    return this.alias('a').where({
      RID:rid
    }).field('a.MID').select();
  }
};