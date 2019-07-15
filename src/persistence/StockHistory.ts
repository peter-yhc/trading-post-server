import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import GetItemInput = DocumentClient.GetItemInput;
import PutItemOutput = DocumentClient.PutItemOutput;
import UpdateItemOutput = DocumentClient.UpdateItemOutput;

const documentClient = new AWS.DynamoDB.DocumentClient({
  region: 'ap-southeast-2',
});

const get = async (symbol): Promise<any> => {
  const params: GetItemInput = {
    TableName: 'StockTable',
    Key: { symbol },
  };
  return (await documentClient.get(params).promise()).Item;
};

const save = async (result): Promise<PutItemOutput> =>
  await documentClient
    .put({
      TableName: 'StockTable',
      Item: result,
    })
    .promise();

const insertClosingPrice = async (priceData): Promise<UpdateItemOutput> => {
  try {
    return await documentClient
      .update({
        TableName: 'StockTable',
        Key: { symbol: priceData.symbol.toUpperCase() },
        UpdateExpression:
          'set #history.#dates = list_append (#history.#dates, :newDateArray), #history.#closing = list_append(#history.#closing, :newClosingArray)',
        ConditionExpression: 'not contains (#history.#dates, :newDate)',
        ExpressionAttributeNames: {
          '#history': 'history',
          '#dates': 'dates',
          '#closing': 'closingPrices',
        },
        ExpressionAttributeValues: {
          ':newDateArray': [priceData.date],
          ':newClosingArray': [priceData.closingPrice],
          ':newDate': priceData.date,
        },
        ReturnValues: 'UPDATED_NEW',
      })
      .promise();
  } catch (e) {
    console.log('ERROR');
    console.log(e);
  }
};

const scanSymbols = async (): Promise<string[]> => {
  const stocks = await documentClient
    .scan({
      TableName: 'StockTable',
    })
    .promise();

  return stocks.Items.map(stock => stock.symbol);
};

export { get, save, scanSymbols, insertClosingPrice };
