import {Callback, Context, Handler} from 'aws-lambda'
import * as YahooApi from './YahooApi'
import {get, insertClosingPrice, save, scanSymbols} from './persistence/StockHistory'
import * as AWS from 'aws-sdk'

interface HttpResponse {
  statusCode: number
  body: string
}

export const getStockData: Handler = async (event: any, context: Context, callback: Callback) => {
  const symbol = event.queryStringParameters.symbol.toUpperCase()

  const cachedResult = await get(symbol)
  let result = cachedResult || await getLiveData(symbol)

  const response: HttpResponse = {
    statusCode: 200,
    body: JSON.stringify(cachedResult || result)
  }
  callback(undefined, response)
}

async function getLiveData(symbol) {
  const liveResult = await YahooApi.getStockHistory(symbol)
  await save(liveResult)
  return liveResult
}

export const invokeUpdateClosingBalances: Handler = async (event: any, context: Context, callback: Callback) => {
  const symbols = await scanSymbols()

  const lambda = new AWS.Lambda({region: 'ap-southeast-2'})
  await Promise.all(symbols.map(symbol => {
      return lambda.invoke({
        FunctionName: 'tps-dev-updateClosingBalance',
        Payload: JSON.stringify({symbol}),
        InvocationType: 'Event'
      }).promise()
    })
  )

  callback(undefined, {body: 'Initiating update of closing balances.'})
}

export const updateClosingBalance: Handler = async (event: any, context: Context, callback: Callback) => {
  const closingPrice = await YahooApi.getLatestClosingPrice(event.symbol)
  await insertClosingPrice(closingPrice)

  callback(undefined, closingPrice)
}
