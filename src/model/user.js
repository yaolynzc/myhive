module.exports = class extends think.Model {
    //  返回特定记录
    findOne(uid){
        return this.alias('a').where({ID:uid}).find();
    }

    //  获取用户总数
    getcount(uid){
        return this.alias('a').where({ID:['like','%'+uid+'%']}).order('CTIME ASC').count('*');
    }

    //  获取用户列表
    getlist(index,size,uid){
        // return this.alias('a').page(index,size).where(where).order('CTIME ASC').countSelect();
        return this.alias('a').join({
            table:'role',
            join:'left',
            as:'b',
            on:['a.RID','b.ID']
        }).page(index,size).where({
            'a.ID':['like','%'+uid+'%']
        }).field('a.*,b.NAME as RNAME').order('a.CTIME DESC').countSelect();
    }

    //  删除特定记录
    deleteOne(uid){
        return this.model('user').where({ID:uid}).delete();     //  此处不能用alias('a')
    }

    //  新增特定记录
    addOne(users){
        return this.model('user').add(users);
    }

    //  修改特定记录
    updateOne(uid,users){
        return this.alias('a').where({ID:uid}).update(users);
    }

};