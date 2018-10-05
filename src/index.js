const {getStockHistory} = require('./yahoo-api')

module.exports.getStockData = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(await getStockHistory('SQ'))
  }
}
