import {Handler} from 'aws-lambda'

interface HelloResponse {
    statusCode: number;
    body: string;
}

const getStockData: Handler = (event, context, callback) => {
    const response: HelloResponse = {
        statusCode: 200,
        body: JSON.stringify({
            message: Math.floor(Math.random() * 10)
        })
    }
    console.log(response)
    callback(undefined, response)
}

export {getStockData}


//
// const documentClient = new AWS.DynamoDB.DocumentClient({
//     region: config.get('Dynamo.region'),
//     endpoint: config.get('Dynamo.endpoint')
// })
//
//
// const getStockData = async (event) => {
//
//     await documentClient.get({
//         TableName: 'stocks',
//         Key: {symbol: event.symbol}
//     }).promise()
//
//     return {
//         statusCode: 200,
//         body: JSON.stringify(await getStockHistory('SQ'))
//     }
// }

