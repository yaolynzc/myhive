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
  messAction(){
    return this.display();
  }
  viewAction(){
    return this.display();
  }

  //  获取消息列表
  async getlistAction(){
    let data = this.get();
    let user = await this.session("userInfo");
    let uid = data.uid;
    let state = data.state;

    if(!uid){
      uid = user.suid;
    }
    if(!state){
      return this.json({
        status:0,
        msg:'未指定state参数！'
      })
    }else{
      let result = await this.model('message').getlist({RID:uid,STATE:state});
      return this.json({
        status:1,
        msg:'查询成功！',
        dt:result
      })
    }
  }

  //  设置消息状态（0：未读 1：已读）
  async setAction(){
    let data = this.get();
    let id = data.id;
    let hr = data.hr;

    if(!id){
      return this.json({
        status:0,
        msg:'参数id未指定！'
      })
    }else{
      let result = await this.model('message').set({STATE:hr},{ID:id});
      return this.json({
        status:1,
        msg:'设置成功！'
      })
    }
  }
}