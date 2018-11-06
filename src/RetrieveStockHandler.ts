import {Callback, Context, Handler} from 'aws-lambda'
import * as YahooApi from './YahooApi'
import {get, save} from './persistence/StockHistory'

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

async function getLiveData(symbol) {
  const liveResult = await YahooApi.getStockHistory(symbol)
  await save(liveResult)
  return liveResult
}
