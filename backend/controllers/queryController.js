const DBConnection = require('../models/DBConnection');
const Query = require('../models/Query');
const { buildSqlAgent } = require('../services/sqlAgentService');
const { enforceReadOnly } = require('../utils/sqlSafety');

// @desc    Execute a natural language query with streamed (SSE) response
// @route   POST /api/query
exports.executeQuery = async (req, res, next) => {
  let dataSource;
  const sendEvent = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);

  try {
    const { connectionId, question } = req.body;

    const connection = await DBConnection.findOne({ _id: connectionId, user: req.user.id }).select('+password');
    if (!connection) {
      return res.status(404).json({ success: false, message: 'Database connection not found' });
    }

    const credentials = connection.getDecryptedCredentials();
    const { agentExecutor, dataSource: ds } = await buildSqlAgent(credentials);
    dataSource = ds;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    let generatedSQL = null;

    const eventStream = await agentExecutor.streamEvents({ input: question }, { version: 'v2' });

    for await (const event of eventStream) {
      if (event.event === 'on_tool_start') {
        sendEvent({ type: 'status', message: `Using tool: ${event.name}` });
      }

      if (event.event === 'on_tool_end' && event.name === 'query-sql') {
        const input = event.data?.input?.input ?? event.data?.input;
        generatedSQL = typeof input === 'string' ? input : JSON.stringify(input);
        sendEvent({ type: 'sql', content: generatedSQL });
      }

      if (event.event === 'on_chat_model_stream') {
        const token = event.data?.chunk?.content;
        if (token) sendEvent({ type: 'token', content: token });
      }
    }

    if (generatedSQL) {
      try {
        enforceReadOnly(generatedSQL);
      } catch (err) {
        sendEvent({ type: 'error', message: err.message });
      }
    }

    await Query.create({
      user: req.user.id,
      connection: connectionId,
      question,
      generatedSQL: generatedSQL || 'N/A',
    });

    sendEvent({ type: 'done' });
    res.end();
  } catch (error) {
    sendEvent({ type: 'error', message: error.message });
    res.end();
  } finally {
    if (dataSource) await dataSource.destroy();
  }
};