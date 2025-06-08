import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand
} from '@aws-sdk/lib-dynamodb'
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'

const client = new DynamoDBClient()
const docClient = DynamoDBDocumentClient.from(client)

/**
 * 创建或存入流动性提供者（LP）的初始额度
 */
async function createLP(userAddress, amount) {
  const newLP = {
    address: { S: String(userAddress) },
    amount: { N: String(amount) }
  }
  const params = {
    TableName: 'lpDB',
    Item: newLP
  }
  try {
    const command = new PutItemCommand(params)
    return await client.send(command)
  } catch (error) {
    console.error('Error creating LP:', error)
    throw error
  }
}

/**
 * 检查给定地址的 LP 记录是否已存在
 * @returns {Promise<boolean>}
 */
async function checkIfExists(userAddress) {
  try {
    const params = {
      TableName: 'lpDB',
      Key: { address: userAddress }
    }
    const { Item } = await docClient.send(new GetCommand(params))
    return !!Item
  } catch (error) {
    console.error('Error checking LP existence:', error)
    throw error
  }
}

/**
 * 获取给定地址的 LP 存量（amount）
 * @returns {Promise<number>} 如果不存在，返回 0
 */
async function getUserAmount(userAddress) {
  try {
    const params = {
      TableName: 'lpDB',
      Key: { address: userAddress }
    }
    const { Item } = await docClient.send(new GetCommand(params))
    if (!Item) return 0
    // DynamoDBDocumentClient 会将 N 转成字符串，因此要转为 number
    return Number(Item.amount);
  } catch (error) {
    console.error('Error fetching LP amount:', error)
    throw error
  }
}

/**
 * 更新给定地址的 LP 存量
 * @param {string} userAddress 
 * @param {number} newAmount 要设定的新存量
 * @returns {Promise<object>} 更新后的属性
 */
async function updateAmount(userAddress,newAmount) {
  try {
    const params = {
      TableName: 'lpDB',
      Key: { address: userAddress },
      UpdateExpression: 'SET amount = :amt',
      ExpressionAttributeValues: {
        ':amt': newAmount
      },
      ReturnValues: 'UPDATED_NEW'
    }
    const { Attributes } = await docClient.send(new UpdateCommand(params))
    return Attributes
  } catch (error) {
    console.error('Error updating LP amount:', error)
    throw error
  }
}

export { createLP, checkIfExists, getUserAmount, updateAmount }