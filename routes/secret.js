var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');
var crypto = require('crypto'),
    algorithm = 'aes256',
    password = 'asaadsaad';

let decrypt = (text) => {
    var decipher = crypto.createDecipher(algorithm,password)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}

let queryDB = () => {
    var db = mongo.db("mongodb://localhost:27017/homework7", {native_parser:true});
    db.bind('homework7');
    return new Promise((resolve, reject) => {
        db.homework7.find().toArray((err, items) => {
            if(err) reject(err);
            else {
                db.close();
                var decryptItems = items.map(item =>{
                    return {message: decrypt(item.message)};
                });
                resolve(decryptItems);
            }
        });
    })
};

router.get('/', (req, res, next) => {
    queryDB().then(items => res.render('secret', {items: items}))
        .catch(err => render('error', {message:'Find db failed', error: err}));
});


module.exports = router;
