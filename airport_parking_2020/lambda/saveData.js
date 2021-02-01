var request = require('request');
var convert = require('xml-js');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const MONGODB_URI = process.env.MONGODB_URI; // or Atlas connection string
let cachedDb = null;

var service_key = '%2Bsjo5YZ5yUmsPnmqL8EY2DoNkNxNY%2Fn6fEgghhG8zsvw2pVDPBANrAr8MAJNQtYesL6tZtITX06tHL5EmvMxIw%3D%3D';

var cond_url = 'http://openapi.airport.co.kr/service/rest/AirportParkingCongestion/airportParkingCongestionRT';



function connectToDatabase(uri) {
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
  context.callbackWaitsForEmptyEventLoop = false;
  let proxy = event.air;
  var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + service_key; /* Service Key*/
  queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
  queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /* */
  queryParams += '&' + encodeURIComponent('schAirportCode') + '=' + encodeURIComponent(proxy);

  request({
    url: cond_url + queryParams,
    method: 'GET'
  }, function(error, response, body) {
    if (error) {
      callback(null, {
        'statusCode': 500,
        'headers': { 'Access-Control-Allow-Origin': '*' }
      })
    }
    var result = body;
    var xmlToJson = convert.xml2json(result, { compact: true, spaces: 4 });
    var xmlToJson = JSON.parse(xmlToJson);
    let data;
    if(xmlToJson['response']['body']['items']['item'].length == null){
      data = [xmlToJson['response']['body']['items']['item']];
    }else{
      data = xmlToJson['response']['body']['items']['item'];
    }
    let con_data = {
      "name": proxy,
      "item": data
    };
    connectToDatabase(MONGODB_URI)
      .then(db => {
        db.collection('condition').update({ "name": proxy }, con_data, { upsert: true });
        console.log(`condition completed`);
        callback(null, {
          "statusCode": 200,
          "headers": { 'Access-Control-Allow-Origin': '*' },
          "body": con_data
        })
      })

  })

};
