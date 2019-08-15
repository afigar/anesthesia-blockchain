'use strict';
var bodyParser = require('body-parser')
const driver = require('bigchaindb-driver')
const alice = new driver.Ed25519Keypair()
const conn = new driver.Connection('https://test.bigchaindb.com/api/v1/')

function addslashes(string) {
  return string.replace(/\\/g, '\\\\').
      replace(/\u0008/g, '\\b').
      replace(/\t/g, '\\t').
      replace(/\n/g, '\\n').
      replace(/\f/g, '\\f').
      replace(/\r/g, '\\r').
      replace(/'/g, '\\\'').
      replace(/"/g, '\\"');
}

module.exports.hello = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };

  module.exports.intellijson = async event => {
    const tx = driver.Transaction.makeCreateTransaction(
      { message: addslashes(JSON.stringify(req.body)) },
      {
        datetime: new Date().toString(),
        location: 'Maternity',
        or: 'q10',
        device: {
            model: 'Philips Intellivue MP40',
            id: '1234asbdfsg',
        }
      },
      [ driver.Transaction.makeOutput(
          driver.Transaction.makeEd25519Condition(alice.publicKey))],
      alice.publicKey)
      const txSigned = driver.Transaction.signTransaction(tx, alice.privateKey)
      //console.log(txSigned)
      conn.postTransactionCommit(txSigned).then(function(retrievedTx){
        console.log('Transaction', retrievedTx.id, 'successfully posted.')	
        },function(err){
        console.log(err)
        });
      res.status(200).end()
      next() }
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'Go Serverless v1.0! Your function executed successfully!',
          input: event,
        },
        null,
        2
      ),
    };
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
