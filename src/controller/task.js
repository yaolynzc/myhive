const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction() {
    // auto render template file index_index.html
    return this.display();
  }
  outAction() {
    return this.display();
  }

  async getlistAction() {
    const data = this.get();
    const level = data.level;
    const result = await this.model('task').getlist({ LEVEL: level });
    // console.log(result);
    return this.json({
      status: 1,
      msg: '查询成功！',
      dt: result
    });
  }
};
