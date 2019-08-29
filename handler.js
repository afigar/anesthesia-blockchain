'use strict';
const driver = require('bigchaindb-driver');
const serverless = require('serverless-http');
const express = require('express');
const app = express();
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');

const alice = new driver.Ed25519Keypair();
const conn = new driver.Connection('http://test-bigchaindb.for-our.info:9984/api/v1/');

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

// parse application/json
app.use(bodyParser.json());

app.get('/help/', (req, res) => {
    res.send(req.body) ;
    res.status(200).end();
});
app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.post('/api/v1/', async (req, res) => {
//app.use(function (req, res, next) {
  //console.log(req.body) // populated!
  // auxmessage = { 'message': JSON.stringify(req.body) }
  //console.log(auxmessage)
  //res.send(addslashes(JSON.stringify(req.body)));
  const tx = driver.Transaction.makeCreateTransaction(
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
        res.send( 'Transaction', retrievedTx.id, 'successfully posted.'	)
      },function(err){
        console.log(err)
      });
      //context.done(null, "Todo salio bien");
      res.send("Todo bien: ",retrievedTx.id)
      res.status(200).end();
      //next()
});

//app.listen(3000);
//module.exports.generic = serverless(app);
//exports.handler = serverless(app);
module.exports.generic = serverless(app);