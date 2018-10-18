import * as handler from './handler'
import * as AWS from 'aws-sdk'
import * as config from 'config'
import {PutItemInput} from 'aws-sdk/clients/dynamodb'
import {Context, AttributeValue} from 'aws-lambda'

const dynamo = new AWS.DynamoDB({
    region: config.get('Dynamo.region'),
    endpoint: config.get('Dynamo.endpoint')
})

test('checks dynamodb', async (done) => {
    const params: PutItemInput = {TableName: 'StockTable', Item: {symbol: <AttributeValue>'AMZN'}}
    await dynamo.putItem(params)

    handler.getStockData({symbol: 'AMZN'}, <Context> {}, () => {
        console.log()
        done()
    })
})
