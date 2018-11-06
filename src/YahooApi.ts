const axios = require('axios')
const moment = require('moment')

interface YahooStockData {
  symbol: string,
  currency: string,
  exchange: string,
  dailyClose: number,
  history: {
    dates: Date,
    closingPrices: number
  },
  fetchedAt: Date
}

export async function getStockHistory(symbol): Promise<YahooStockData> {
  const endingPeriod = Math.round(new Date().getTime() / 1000)
  const startingPeriod = 0
  const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${startingPeriod}&period2=${endingPeriod}&interval=1d`)
  const data = response.data.chart.result[0]
  const closingData = data.indicators.quote[0].close

  return <YahooStockData> {
    symbol: data.meta.symbol,
    currency: data.meta.currency,
    exchange: data.meta.exchangeName,
    dailyClose: closingData ? closingData[closingData.length - 1].toFixed(2) : 0,
    history: {
      dates: data.timestamp,
      closingPrices: closingData
    },
    fetchedAt: moment().format('YYYY-MM-DD')
  }
}
