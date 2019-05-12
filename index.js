var express    = require('express')
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

var app = express()

// parse application/json
app.use(bodyParser.json())

app.use(function (req, res, next) {
  //console.log(req.body) // populated!
  // auxmessage = { 'message': JSON.stringify(req.body) }
  //console.log(auxmessage)
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
  next()
})

app.listen(3000);