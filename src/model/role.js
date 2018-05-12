module.exports = class extends think.Model {
  //  获取角色总数
  getcount(name) {
    return this.model('role').where({ NAME: ['like', '%' + name + '%'] }).order('CTIME ASC').count('*');
  }

  //  获取角色列表
  getlist(name, index, size, state) {
    // console.log(index + '-' + size);
    return this.model('role').page(index, size).where({
      NAME: ['like', '%' + name + '%'],
      STATE:{'>=':state}
    }).order('CTIME DESC').countSelect();
  }

  //  获取某角色信息
  findOne(id) {
    return this.alias('a').where({ ID: id }).find();
  }

  //  根据名称获取角色信息
  findOneByName(name) {
    return this.alias('a').where({ NAME: name }).find();
  }

  //  新增某角色信息
  async addOne(roles, mids) {
    //  增加角色信息
    let roleinfo = await this.model('role').add(roles);
    // console.log(roleinfo);

    //  如果权限不为空值或null，增加权限信息
    if (!think.isEmpty(mids)) {
      var rights = [];
      //  为该角色设置权限（模块）
      for (let i in mids) {
        let right = {
          ID: think.uuid(),
          RID: roles.ID,
          MID: mids[i],
          CTIME: think.datetime()
        }
        rights.push(right);
      }
      // 一次添加角色的所有MID到权限表中
      this.model('right').addMany(rights);
    }
    return true;
  }

  // 编辑某角色
  async updateOne(roles,mids){
    //  增加角色信息(覆盖)
    await this.model('role').where({ID:roles.ID}).delete();
    await this.model('role').add(roles);
    
    if (!think.isEmpty(mids)) {
      // 先清空现有权限
      var result = await this.model('right').where({RID:roles.ID}).delete();
      console.log(result);
      // 再增加新的权限
      var rights = [];
      //  为该角色设置权限（模块）
      for (let i in mids) {
        let right = {
          ID: think.uuid(),
          RID: roles.ID,
          MID: mids[i],
          CTIME: think.datetime()
        }
        rights.push(right);
      }
      // 一次添加角色的所有MID到权限表中
      this.model('right').addMany(rights);
    }
    return true;
  }
};