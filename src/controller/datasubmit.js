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

  async getlistAction() {
    // let data = this.get();
    // let tid = data.tid;
    const result = await this.model('datasubmit').getlist();

    return this.json({
      status: 1,
      msg: '查询成功！',
      dt: result
    });
  }
};
