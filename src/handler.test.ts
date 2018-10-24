const mockDynamo = {get: jest.fn(), put: jest.fn()}

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

test('checks dynamodb to see if stock is cached ', async () => {
  mockDynamo.get.mockReturnValue({promise: () => Promise.resolve()})

  await handler.getStockData({symbol: 'AMZN'}, <Context> {}, () => {
  })

  expect(mockDynamo.get).toBeCalledWith(<GetItemInput> {
    TableName: 'StockTable',
    Key: {
      stockId: 'AMZN'
    }
  })
})
