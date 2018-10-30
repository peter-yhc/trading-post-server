const mockDynamo = {get: jest.fn(), put: jest.fn()}
const mockYahooApi = jest.genMockFromModule('./yahoo-api') as any

import {DocumentClient} from 'aws-sdk/lib/dynamodb/document_client'
import * as handler from './handler'
import {Context} from 'aws-lambda'
import GetItemInput = DocumentClient.GetItemInput

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: function DocumentClient() {
      return mockDynamo
    }
  }
}))

jest.mock('./yahoo-api', () => mockYahooApi)

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
      stockId: 'AMZN'
    }
  })
})

test('grabs new realtime data if it is not cached in database', async () => {
  mockDynamo.get.mockReturnValue({promise: () => Promise.resolve({Items: []})})

  await handler.getStockData({symbol: 'AMZN'}, < Context > {}, () => {
  })

  expect(mockDynamo.get).toBeCalled()
  expect(mockYahooApi.getStockHistory).toBeCalled()
})
