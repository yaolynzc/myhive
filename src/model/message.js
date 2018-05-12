module.exports = class extends think.Model {
  getlist(where) {
    return this.alias('a').where(where).select();
  }
  set(state, where) {
    return this.alias('a').where(where).update(state);
  }
};
