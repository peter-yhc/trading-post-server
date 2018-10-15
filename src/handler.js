const AWS = require('aws-sdk')
const {getStockHistory} = require('./yahoo-api')
const config = require('config')

const documentClient = new AWS.DynamoDB.DocumentClient({
  region: config.get('Dynamo.region'),
  endpoint: config.get('Dynamo.endpoint')
})


const getStockData = async (event) => {

  await documentClient.get({
    TableName: 'stocks',
    Key: {symbol: event.symbol}
  }).promise()

  return {
    statusCode: 200,
    body: JSON.stringify(await getStockHistory('SQ'))
  }
}

module.exports = getStockData
