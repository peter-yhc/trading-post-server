import * as AWS from 'aws-sdk'
import {DocumentClient} from 'aws-sdk/lib/dynamodb/document_client'
import GetItemInput = DocumentClient.GetItemInput
import PutItemInput = DocumentClient.PutItemInput
import ScanInput = DocumentClient.ScanInput

const documentClient = new AWS.DynamoDB.DocumentClient({
  region: 'ap-southeast-2'
})

const get = async (symbol) => {
  const params: GetItemInput = {
    TableName: 'StockTable',
    Key: {symbol}
  }
  return (await documentClient.get(params).promise()).Item
}

const save = async (result) => {
  await documentClient.put(<PutItemInput> {
    TableName: 'StockTable',
    Item: result
  }).promise()
}

const scanSymbols = async () => {
  const stocks = await documentClient.scan(<ScanInput> {
    TableName: 'StockTable'
  }).promise()

  const symbols = stocks.Items.map(stock => stock.symbol)
  return symbols
}

export {
  get,
  save,
  scanSymbols
}