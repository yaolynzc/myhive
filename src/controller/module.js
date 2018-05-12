const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * index action
   * @return {Promise} []
   */

  indexAction(){
    //auto render template file index_index.html
    return this.display();
  }

  //  获取用户模块
  async getAction(){
    let data = this.get();
    let id = data.id;
    if(!id){
      return this.json({
        status:0,
        msg:'参数id未指定！'
      })
    }else{
      let result = await this.model('module').get({ID:id});
      return this.json({
        status:1,
        msg:'查询成功！',
        dt:result
      })
    }
  }

  //  获取所有角色模块
  async getlistAction(){
    let data = this.get();
    let index = data.index;
    let size = data.size;
    let state = think.isEmpty(data.state) ? 0: data.state;
    console.log(state);
    let result = await this.model('module').getlist(index,size,state);
    return this.json({
      status:1,
      msg:'查询成功',
      dt:result.data
    })
  }
  
}