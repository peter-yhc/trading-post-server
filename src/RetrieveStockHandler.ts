import {Callback, Context, Handler} from 'aws-lambda'
import * as YahooApi from './YahooApi'
import {get, save, scanSymbols} from './persistence/StockHistory'
import * as AWS from 'aws-sdk'

interface HttpResponse {
  statusCode: number
  body: string
}

export const getStockData: Handler = async (event: any, context: Context, callback: Callback) => {
  const cachedResult = await get(event.symbol.toUpperCase())
  let result = cachedResult || await getLiveData(event.symbol)

  const response: HttpResponse = {
    statusCode: 200,
    body: JSON.stringify(cachedResult || result)
  }

  callback(undefined, response)
}

export const invokeUpdateClosingBalances: Handler = async (event: any, context: Context, callback: Callback) => {
  const symbols = await scanSymbols()

  const lambda = new AWS.Lambda({region: 'ap-southeast-2'})
  await Promise.all(symbols.map(symbol => {
      lambda.invoke({
        FunctionName: 'updateClosingBalance',
        Payload: {symbol},
        InvocationType: 'Event'
      }).promise()
    })
  )

  callback(undefined)
}

export const updateClosingBalance: Handler = async (event: any, context: Context, callback: Callback) => {
  console.log(event)

  callback(undefined)
}

async function getLiveData(symbol) {
  const liveResult = await YahooApi.getStockHistory(symbol)
  await save(liveResult)
  return liveResult
}
