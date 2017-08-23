/**
 * http://www.jikexueyuan.com/course/2301_3.html?ss=2
 */
const redis = require('redis');

const config = {
    redis: 'redis://user:password@localhost:6379'//如果没设置密码就是redis://localhost:6379
};

const redisCilent = redis.createClient(config.redis);
client.auth('xxx');

redisCilent.on("error", function (err) {
    console.log("Error " + err);
});

const REDIS_PERSON_PREFIX = 'PERSON_';

module.exports = {
    getById: function(req, res, next, id){
        this.getByIdFromRedis(id, (err, v) => {
            if(err){
                return next(err);
            }

            if(v){
                //从redis中读到结果，用json返回
                res.json(v);
            }else{
                this.getByIdFromMongoDB(id, (err, v) => {
                    if(err){
                        return next(err);
                    }
                    if(v){
                        //从mongodb中读到结果
                        res.json(v);
                    }else{
                        res.send('not found');
                    }
                });
            }
        });
    },

    getByIdFromMongoDB: function(id, cb){
        Person.findOne({_id: id}).exec(function(err, v){
            if(v){
                //将mongodb中读到的记录存储到redis缓存中
                const key = REDIS_PERSON_PREFIX + id;
                redisCilent.set(key, JSON.stringify(v));
            }
            cb(err, v);
        });
    },

    getByIdFromRedis: function(id, cb){
        const key = REDIS_PERSON_PREFIX + id;
        redis.get(key, function(err, v){
            if(err){
                cb(err, null);
            }else{
                try{
                    v = JSON.parse(v);
                    cb(null, v);
                }catch(e){
                    cb(e, null);
                }
            }
        });
    }
};
