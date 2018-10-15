const handler = require('./handler')
const AWS = require('aws-sdk')
const config = require('config')

const documentClient = new AWS.DynamoDB.DocumentClient({
  region: config.get('Dynamo.region'),
  endpoint: config.get('Dynamo.endpoint')
})

test('checks dynamodb', async (done) => {
  documentClient.put({TableName: 'stocks', Item: {symbol: 'AMZN'}})

  await handler({symbol: 'AMZN'})
})
