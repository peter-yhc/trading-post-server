import {Callback, Context, Handler} from 'aws-lambda'
import {DocumentClient} from 'aws-sdk/lib/dynamodb/document_client'
import * as AWS from 'aws-sdk'
import GetItemInput = DocumentClient.GetItemInput

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
    Key: {stockId: event.symbol}
  }
  const result = await documentClient.get(params).promise()

  const response: HttpResponse = {
    statusCode: 200,
    body: JSON.stringify(result)
  }

  callback(undefined, response)
}
