module.exports = class extends think.Model {
    //  获取任务数据列表
    getlist() {
        return this.alias('a').join({
            table: 'task',
            join: 'inner',
            as: 'b',
            on: ['TID', 'ID']
        }).field('a.*').select();
    }
};
