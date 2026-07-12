const { DataSource } = require('typeorm');
const { SqlDatabase } = require('langchain/sql_db');
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { createSqlAgent, SqlToolkit } = require('langchain/agents/toolkits/sql');

// SQL Langchain Agent
const buildSqlAgent = async ({ host, port, username, password, database }) => {
  const dataSource = new DataSource({
    type: 'mysql',
    host,
    port,
    username,
    password,
    database,
  });

  await dataSource.initialize();

  const db = await SqlDatabase.fromDataSourceParams({
    appDataSource: dataSource,
  });

  const llm = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-1.5-flash',
    temperature: 0,
  });

  const toolkit = new SqlToolkit(db, llm);

  const agentExecutor = createSqlAgent(llm, toolkit, {
    topK: 10,
  });

  return { agentExecutor, dataSource };
};

module.exports = { buildSqlAgent };