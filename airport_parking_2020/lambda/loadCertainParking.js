const MongoClient = require('mongodb').MongoClient;
const MONGODB_URI = process.env.MONGODB_URI; // or Atlas connection string


let cachedDb = null;

function connectToDatabase (uri) {
  console.log('=> connect to database');
  if (cachedDb) {
    console.log('=> using cached database instance');
    return Promise.resolve(cachedDb);
  }
  return MongoClient.connect(uri)
    .then(db => {
      cachedDb = db.db('parking');
      return cachedDb;
    });
}


module.exports.handler = (event, context, callback) => {
  let operation = event.httpMethod;
  let proxy = event.pathParameters.proxy;

  context.callbackWaitsForEmptyEventLoop = false;

  
  connectToDatabase(MONGODB_URI)
  .then(db => {
        let data;
        db.collection('condition').find({name : proxy}).toArray(function(err, result){
            data = result;
        });
        db.collection('pay').find({name : proxy}).toArray(function(err, result){
            if(err){
            callback(null,{
              'statusCode':500,
              'headers':{'Access-Control-Allow-Origin':'*'},
              'body':err
            })
          }else{
            let json = {
              'condition' : data,
              'pay':result
            }
            callback(null, {
              'statusCode':200,
              'headers':{'Access-Control-Allow-Origin':'*'},
              'body':JSON.stringify(json)
          })
          }
        })
    	})
};