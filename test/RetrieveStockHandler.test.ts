const mockDynamo = {get: jest.fn(), put: jest.fn()}
const mockYahooApi = jest.genMockFromModule('./YahooApi') as any

import {DocumentClient} from 'aws-sdk/lib/dynamodb/document_client'
import * as handler from '../src/RetrieveStockHandler'
import {Context} from 'aws-lambda'
import GetItemInput = DocumentClient.GetItemInput

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: function DocumentClient() {
      return mockDynamo
    }
  }
}))

jest.mock('./YahooApi', () => mockYahooApi)

test('checks dynamodb to see if stock is cached ', async () => {
  mockDynamo.get.mockReturnValue({
    promise: () => Promise.resolve({
      Item: {}
    })
  })

  await handler.getStockData({symbol: 'AMZN'}, <Context> {}, () => {
  })

  expect(mockDynamo.get).toBeCalledWith(<GetItemInput> {
    TableName: 'StockTable',
    Key: {
      symbol: 'AMZN'
    }
  })
})

test('grabs new real time data and saves if it is not cached in database', async (done) => {
  mockDynamo.get.mockReturnValue({promise: () => Promise.resolve({Item: null})})
  mockYahooApi.getStockHistory.mockReturnValue({symbol: 'AMZN'})
  mockDynamo.put.mockImplementation(data => {
    console.log(data)
    expect(data.Item.symbol).toBe('AMZN')
    return {promise: () => Promise.resolve(done())}
  })

  await handler.getStockData({symbol: 'AMZN'}, < Context > {}, () => {
  })

  expect(mockDynamo.get).toBeCalled()
  expect(mockYahooApi.getStockHistory).toBeCalled()
})
