import {Callback, Context, Handler} from 'aws-lambda'
import * as YahooApi from './YahooApi'
import {get, save} from './persistence/StockHistory'

interface HttpResponse {
  statusCode: number
  body: string
}


export const getStockData: Handler = async (event: any, context: Context, callback: Callback) => {
  const cachedResult = await get(event.symbol)

  let liveResult = undefined
  if (!cachedResult) {
    liveResult = await YahooApi.getStockHistory(event.symbol)
    await save(liveResult)
  }

  const response: HttpResponse = {
    statusCode: 200,
    body: JSON.stringify(cachedResult || liveResult)
  }

  callback(undefined, response)
}
