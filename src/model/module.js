module.exports = class extends think.Model {
  get(where) {
    return this.alias('a').where(where).select();
  }

  getlist(index, size, state) {
    // console.log(index + '/' + size);
    return this.model('module').where({
      STATE:{'>=':state}
    }).page(index, size).order('ID ASC').countSelect();
  }
};
