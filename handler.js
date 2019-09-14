'use strict';
const serverless = require('serverless-http');
const express = require('express');
const app = express();
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
AWS.config.update({region: 'us-east-1'});
const sns = new AWS.SNS()
const TOPIC_ARN = 'arn:aws:sns:us-east-1:212507307353:IntelliChain';

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
  const auxmessage = { 'message': req.body }
  console.log(auxmessage)
  var params = {
    Message: addslashes(JSON.stringify(req.body)), 
    TopicArn: 'arn:aws:sns:us-east-1:212507307353:IntelliChain'
  };
  var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'})
  await publishTextPromise.publish(params).promise().then(
    function(data) {
      console.log("Message" + params.Message +"send sent to the topic"+ params.TopicArn);
      console.log("MessageID is " + data.MessageId);
    }).catch(
      function(err) {
      console.error(err, err.stack);
      console.log("Error") ;
    });
res.send("Success!")
res.status(200).end();
});

app.post('/api/v2', async (event) => {
    if (!event.body) {
        return Promise.resolve({statusCode: 400, body: 'invalid'});
    }
    try {
    await sns.publish({
      Message: addslashes(JSON.stringify(event.body)),
      TopicArn: TOPIC_ARN
    })
      .promise();
    return ({ statusCode: 204, body: '' });
  }
  catch (err) {
    console.log(err);
    return { statusCode: 200, body: 'sns-error' };
  }
});

module.exports.generic = serverless(app);