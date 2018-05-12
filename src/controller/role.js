const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * 页面路由
   * @return {Promise} []
   */
  __before() {
    this.assign({
      title: '角色管理',
      titlememo: '添加修改删除角色',
      navone: '首页',
      navtwo: '系统管理',
      navthree: '角色管理'
    });
  }

  //  默认页面
  indexAction() {
    //  auto render template file index_index.html
    return this.display('list.html');
  }

  //  角色首页
  listAction() {
    return this.display();
  }

  //  编辑角色
  editAction() {
    return this.display();
  }

  //  获取总数
  async getcountAction() {
    const data = this.get();
    const name = data.name;

    const result = await this.model('role').getcount(name);
    return this.json({
      status: 1,
      msg: '查询成功',
      count: result
    });
  }

  //  获取分页列表
  async getlistAction() {
    const data = this.get();
    const name = think.isEmpty(data.name) ? '' : data.name;
    const state = think.isEmpty(data.state) ? 0 : data.state;
    // let index = data.index + 1;        // 错误结果：11
    const index = think.isEmpty(data.index) ? 1 : parseInt(data.index) + 1;
    const size = think.isEmpty(data.size) ? 100 : parseInt(data.size);

    const result = await this.model('role').getlist(name, index, size,state);
    return this.json({
      status: 1,
      msg: '查询成功',
      dt: result.data
    });
  }

  //  获取某角色的信息及其权限信息
  async getAction() {
    const data = this.get();
    const id = data.id;

    const roles = await this.model('role').findOne(id);
    const rights = await this.model('right').getlist(id);
    // console.log(rights);
    return this.json({
      status: 1,
      msg: '查询成功',
      role: roles,
      right: rights
    });
  }

  //  根据名称获取角色信息
  async getbynameAction() {
    const roles = await this.model('role').findOneByName(this.get('name'));
    return this.json({
      status: 1,
      msg: '查询成功',
      role: roles
    });
  }

  //  新增角色信息
  async addAction() {
    //  获取前端get请求参数
    const data = this.get();

    //  定义角色信息
    const roles = {
      ID: think.uuid(),
      NAME: data.name,
      MEMO: data.memo,
      STATE: data.state,
      CTIME: think.datetime()
    };

    // 模块的MID数组
    const mids = think.isEmpty(data.mids) ? null : data.mids.split(',');
    const result = await this.model('role').addOne(roles, mids);

    if (result) {
      return this.json({
        status: 1,
        msg: '新增成功'
      });
    } else {
      return this.json({
        status: 0,
        msg: '新增失败'
      });
    }
  }

  //  更新角色信息
  async updateAction() {
    //  获取前端get请求参数
    const data = this.get();

    //  定义角色信息
    const roles = {
      ID: data.id,
      NAME: data.name,
      MEMO: data.memo,
      STATE: data.state,
      CTIME: think.datetime(),
      MTIME: think.datetime()
    };

    // 模块的MID数组
    const mids = think.isEmpty(data.mids) ? null : data.mids.split(',');
    const result = await this.model('role').updateOne(roles, mids);

    if (result) {
      return this.json({
        status: 1,
        msg: '修改成功'
      });
    }
  }

  async deleteAction() {
    // 获取前端get请求参数
    const data = this.get();
    // 查询角色是否已被用户使用
    const haveUsed = await this.model('user').where({ RID: ['IN', data.ids] }).distinct('RID').select();

    if (think.isEmpty(haveUsed)) {
      const delRight = await this.model('right').where({ RID: ['IN', data.ids] }).delete();
      if (delRight) {
        const delRole = await this.model('role').where({ ID: ['IN', data.ids] }).delete();
        return this.json({
          status: 1,
          msg: '删除成功'
        });
      }
    } else {
      let haveUsedNames = [];
      for (let id of haveUsed) {
        const haveUsedName = await this.model('role').findOne(id.RID);
        haveUsedNames.push(haveUsedName.NAME);
      }
      return this.json({
        status: 0,
        msg: '无法删除',
        names: haveUsedNames.toLocaleString()
      });
    }
  }
};

