module.exports = class extends think.Model {
    getlist(where){
        return this.alias('a').join({
        table:'scope',
        join:'left',
        as:'b',
        on:['ID','TID']
        }).where(where).select();
    }
};