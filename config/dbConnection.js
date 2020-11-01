const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://JoS0ares:esfigmomanometro@tcc.sd9zw.gcp.mongodb.net/TCC?retryWrites=true&w=majority";

var db;

MongoClient.connect(uri, (err, client)=>{
    if (err) return console.log('deu erro: ' + err);
    db = client.db('TCC');
});

module.exports.dbConnection = ()=>{
    return db;
}