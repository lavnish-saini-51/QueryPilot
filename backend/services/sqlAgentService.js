const { DataSource } = require('typeorm');
const { SqlDatabase } = require('@langchain/classic/sql_db');
const { SqlToolkit } = require('@langchain/classic/agents/toolkits/sql');
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { AgentExecutor, createToolCallingAgent } = require('@langchain/classic/agents');

/**
 * Builds a read-only-safe LangChain SQL Agent for a given MySQL connection.
 * Uses native tool-calling (not legacy ReAct text parsing) to avoid
 * schema hallucination and output parsing failures.
 */
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
    model: 'gemini-3.5-flash',
    temperature: 0,
  });

  const toolkit = new SqlToolkit(db, llm);
  const tools = toolkit.getTools();

  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `You are an agent designed to interact with a MySQL database.
Given an input question, you MUST first call the tool to list tables, then call the tool to inspect the schema of the relevant tables BEFORE writing any SQL query.
NEVER assume or invent table or column names — only use names confirmed by the schema tool.
Only write SELECT queries. Never write DROP, DELETE, TRUNCATE, ALTER, UPDATE, or INSERT statements.
Limit results to at most 10 rows unless the user specifies otherwise.
After executing the query, explain the result in plain English.`,
    ],
    ['placeholder', '{chat_history}'],
    ['human', '{input}'],
    ['placeholder', '{agent_scratchpad}'],
  ]);

  const agent = createToolCallingAgent({ llm, tools, prompt });
  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    returnIntermediateSteps: true,
  });

  return { agentExecutor, dataSource };
};

module.exports = { buildSqlAgent };