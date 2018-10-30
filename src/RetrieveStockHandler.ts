import {Callback, Context, Handler} from 'aws-lambda'
import {DocumentClient} from 'aws-sdk/lib/dynamodb/document_client'
import * as AWS from 'aws-sdk'
import * as YahooApi from './YahooApi'
import GetItemInput = DocumentClient.GetItemInput
import PutItemInput = DocumentClient.PutItemInput

interface HttpResponse {
  statusCode: number
  body: string
}

const documentClient = new AWS.DynamoDB.DocumentClient({
  region: 'ap-southeast-2'
})

export const getStockData: Handler = async (event: any, context: Context, callback: Callback) => {
  const params: GetItemInput = {
    TableName: 'StockTable',
    Key: {symbol: event.symbol}
  }
  const cachedResult = (await documentClient.get(params).promise()).Item

  let liveResult = undefined
  if (!cachedResult) {
    liveResult = await YahooApi.getStockHistory(event.symbol)
    await documentClient.put(<PutItemInput> {
      TableName: 'StockTable',
      Item: liveResult
    }).promise()
  }

  const response: HttpResponse = {
    statusCode: 200,
    body: JSON.stringify(cachedResult || liveResult)
  }

  callback(undefined, response)
}
