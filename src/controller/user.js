const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * 页面路由
   * @return {Promise} []
   */
  async __before() {
    this.assign({
      title: '用户管理',
      titlememo: '添加修改删除用户',
      navone: '首页',
      navtwo: '系统管理',
      navthree: '用户管理'
    });
  }

  //  默认页面
  indexAction() {
    return this.display('list.html');
  }

  //  用户首页
  listAction() {
    return this.display();
  }

  //  用户编辑
  editAction() {
    return this.display();
  }

  //  修改密码
  pwdAction() {
    return this.display();
  }

  /**
   * ajax数据请求路由
   * @return {JSON}
   */

  //  用户登录
  async loginAction() {
    let data = this.get();
    let md5pass = await think.md5(data.pwd);
    let uid = await data.uid;

    //  从用户表查询用户信息
    let result = await this.model("user").findOne(uid);

    let info = {
      suid: uid,
      spwd: md5pass,
      srid: result.RID,
      suname: result.NAME
    };

    if (uid === result.ID && md5pass === result.PWD) {
      await this.session("userInfo", info);
      return this.json({
        status: 1,
        msg: "登录成功！"
      });
    } else {
      return this.json({
        status: 0,
        msg: "用户名或密码错误！"
      });
    }
  }

  //  用户登录初始化左侧功能菜单
  async getnavAction() {
    let user = await this.session("userInfo");
    if (user == null) {
      return this.json({
        status: 0,
        msg: "用户未登录！"
      });
    } else {
      // let uid = user.suid;
      let rid = user.srid;

      let result = await this.model('right').join({
        table: 'module',
        join: 'left',
        as: 'b',
        on: ['MID', 'ID']
      }).where({ RID: rid, 'b.STATE': 1 }).order('b.ID ASC').select();   //此处如果不根据module.ID排序会导致菜单初始化错误

      return this.json({
        status: 1,
        msg: '查询成功！',
        uname: user.suname,
        dt: result
      })
    }
  }

  //  用户退出
  async logoutAction() {
    await this.session("userInfo", null);
    return this.json({
      status: 1,
      msg: '退出成功！'
    })
  }

  // 获取用户信息
  async getAction() {
    let uid = this.get('id');
    let result = await this.model('user').findOne(uid);

    return this.json({
      status: 1,
      msg: '查询成功！',
      dt: result
    })
  }

  // 获取用户总数
  async getcountAction() {
    let data = this.get();
    let uid = data.uid;

    let result = await this.model('user').getcount(uid);
    return this.json({
      status: 1,
      msg: '查询成功！',
      count: result
    })
  }

  //  获取用户列表
  async getlistAction() {
    let data = this.get();
    let uid = data.uid;
    // let index = data.index + 1;        // 错误结果：11
    let index = parseInt(data.index) + 1;
    let size = data.size;

    let result = await this.model('user').getlist(index, size, uid);
    return this.json({
      status: 1,
      msg: '查询成功！',
      dt: result.data
    })
  }

  //  删除用户信息
  async deleteAction() {
    let data = this.get();
    let userinfo = await this.session('userInfo');
    var ids = data.ids.split(',');
    let failinfo = "";
    let successinfo = "";
    let message = "";

    for (var i in ids) {
      var id = ids[i];
      let user = await this.model('user').findOne(id);
      if (user.ID == userinfo.suid) {
        failinfo += id + "不能删除自己！";
      } else {
        let result = await this.model('user').deleteOne(id);
        if (i == 0) {
          successinfo += "用户：" + id;
        } else {
          successinfo += "," + id;
        }
      }
    }

    if (failinfo) {
      message = failinfo;
    } else {
      message = successinfo + " 删除成功！";
    }

    return this.json({
      status: 1,
      msg: message
    });
  }

  //  新增用户信息
  async addAction() {
    let data = this.get();
    var users = {
      ID: data.id,
      PWD: think.md5(data.pwd),
      NAME: data.name,
      TEL: data.tel,
      EMAIL: data.email,
      RID: data.roleid,
      STATE: data.state,
      CTIME: think.datetime()
    }

    let result = await this.model('user').addOne(users);
    return this.json({
      status: 1,
      msg: '添加成功！'
    })
  }

  //  修改用户信息
  async updateAction() {
    let data = this.get();
    var users = {
      NAME: data.name,
      TEL: data.tel,
      EMAIL: data.email,
      RID: data.roleid,
      STATE: data.state
    }

    let result = await this.model('user').updateOne(data.id, users);
    return this.json({
      status: 1,
      msg: '修改成功！'
    })
  }

  //  修改用户密码
  async updatepwdAction() {
    let data = this.get();
    let md5pass = think.md5(data.pwd);
    var users = {
      PWD: md5pass
    }
    let result = await this.model('user').updateOne(data.id, users);
    return this.json({
      status: 1,
      msg: '修改成功！'
    })
  }

}