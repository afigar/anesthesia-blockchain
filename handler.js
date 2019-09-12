'use strict';
//const driver = require('bigchaindb-driver');
const serverless = require('serverless-http');
const express = require('express');
const app = express();
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
AWS.config.update({region: 'us-east-1'});

//const alice = new driver.Ed25519Keypair();
//const conn = new driver.Connection('http://test-bigchaindb.for-our.info:9984/api/v1/');


function addslashes(string) {
  return string.replace(/\\/g, '\\\\').
      replace(/\u0008/g, '\\b').
      replace(/\t/g, '\\t').
      replace(/\n/g, '\\n').
      replace(/\f/g, '\\f').
      replace(/\r/g, '\\r').
      replace(/'/g, '\\\'').
      replace(/"/g, '\\"');
};

app.use(bodyParser.urlencoded({
  extended: false
}));

// parse application/json
// app.use(bodyParser.json());

app.get('/help/', (req, res) => {
    res.send(req.body) ;
    res.status(200).end();
});
app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.post('/post/data', function(req, res) {
  console.log('receiving data...');
  console.log('body is ',req.body);
  res.setHeader('Content-Type', 'text/plain')
  res.write('you posted:\n')
  res.end(JSON.stringify(req.body, null, 2))
});

app.post('/api/v1/', async (req, res) => {
//app.use(function (req, res, next) {
  //console.log(req.body) // populated!
  const auxmessage = { 'message': req.body }
  console.log(auxmessage)
  //res.send(addslashes(JSON.stringify(req.body)));
  var params = {
    Message: addslashes(JSON.stringify(req.body)), /* required */
    TopicArn: 'arn:aws:sns:us-east-1:212507307353:IntelliChain'
  };
  var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
  publishTextPromise.then(
    function(data) {
      console.log("Message" + params.Message +"send sent to the topic"+ params.TopicArn);
      console.log("MessageID is " + data.MessageId);
    }).catch(
      function(err) {
      console.error(err, err.stack);
    });
  /*const tx = driver.Transaction.makeCreateTransaction(
    {
      datetime: new Date().toString(),
      location: 'Maternity',
      or: 'q11',
      device: {
          model: 'Philips Intellivue MP40',
          id: '1234asbdfsg',
      }
    }  ,
    { datetime: new Date().toString(),
      location: 'Maternity',
      or: 'q11',
      device: {
          model: 'Philips Intellivue MP40',
          id: '1234asbdfsg',
      },
      message: addslashes(JSON.stringify(req.body))
    },
    [ driver.Transaction.makeOutput(
        driver.Transaction.makeEd25519Condition(alice.publicKey))],
    alice.publicKey)
      const txSigned = driver.Transaction.signTransaction(tx, alice.privateKey)
      //console.log(txSigned)
      await conn.postTransactionCommit(txSigned).then(function(retrievedTx){
        //console.log('Transaction', retrievedTx.id, 'successfully posted.')
        //res.send( 'Transaction', retrievedTx.id, 'successfully posted.'	)
      },function(err){
        console.log(err)
      }); */
      //context.done(null, "Todo salio bien");
      res.send("Todo bien: ")
      res.status(200).end();
      //next()
});

//app.listen(3000);
module.exports.generic = serverless(app);