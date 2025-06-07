import { DynamoDBDocumentClient, QueryCommand,ScanCommand,GetCommand,DeleteCommand,UpdateCommand} from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

async function createLoan(txn,borrower, rlusdAmount,xrpAmount) {
    let newLoan = {
        txn: {S : String(txn)},
        borrower: {S : String(borrower)},
        rlusdAmount: {N : String(rlusdAmount)},
        xrpAmount: {N : String(xrpAmount)},
        interest: {N : "0"},
        totaldebt: {N : String(rlusdAmount)},
        status:{S : "active"}
    }
    const params = {
        TableName:"loanDB",
        Item: newLoan
    }
    try {
        const command = new PutItemCommand(params);
        const response = await client.send(command);
        return response;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
}

async function scanAll() {
    const params = {
        TableName: "loanDB"
    };

    try {
        const command = new ScanCommand(params);
        const response = await docClient.send(command);
        return response.Items;
    } catch (error) {
        console.error("Error scanning table:", error);
        throw error;
    }
}

async function updateInterest(txn) {
  const getParams = {
    TableName: 'loanDB',
    Key: { txn }
  }
  const getRes = await docClient.send(new GetCommand(getParams))
  const item = getRes.Item
  if (!item) {
    throw new Error(`Loan with txn=${txn} not found`)
  }

  const oldInterest   = Number(item.interest)
  const oldTotalDebt  = Number(item.totaldebt)

  const delta = oldTotalDebt * (0.05 / 365)

  const newInterest  = oldInterest  + delta
  const newTotalDebt = oldTotalDebt + delta

  const updateParams = {
    TableName: 'loanDB',
    Key: { txn },
    UpdateExpression: 'SET interest = :i, totaldebt = :d',
    ExpressionAttributeValues: {
      ':i': newInterest,
      ':d': newTotalDebt
    },
    ReturnValues: 'UPDATED_NEW'
  }
  const updateRes = await docClient.send(new UpdateCommand(updateParams))

  return updateRes.Attributes
}

async function updateStatus(txn, newStatus) {
  try {
    const params = {
      TableName: "loanDB",
      Key: { txn },
      UpdateExpression: "SET #st = :s",
      ExpressionAttributeNames: {
        "#st": "status"
      },
      ExpressionAttributeValues: {
        ":s": newStatus
      },
      ReturnValues: "UPDATED_NEW"
    };
    const result = await docClient.send(new UpdateCommand(params));
    return result.Attributes;  // 返回更新后的字段
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
}

export { createLoan,scanAll,updateInterest,updateStatus }