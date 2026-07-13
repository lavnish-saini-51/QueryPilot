const DBConnection = require('../models/DBConnection');
const Query = require('../models/Query');
const { buildSqlAgent } = require('../services/sqlAgentService');
const { enforceReadOnly } = require('../utils/sqlSafety');

// @desc    Execute a natural language query against a connected MySQL database
// @route   POST /api/query
exports.executeQuery = async (req, res, next) => {
  let dataSource;
  try {
    const { connectionId, question } = req.body;

    const connection = await DBConnection.findOne({ _id: connectionId, user: req.user.id }).select('+password');
    if (!connection) {
      return res.status(404).json({ success: false, message: 'Database connection not found' });
    }

    const credentials = connection.getDecryptedCredentials();

    let agentExecutor;
    ({ agentExecutor, dataSource } = await buildSqlAgent(credentials, 'gemini'));

    let result;
    try {
      result = await agentExecutor.invoke({ input: question });
    } catch (err) {
      const isQuotaError = err.message?.includes('quota') || err.message?.includes('429');
      if (!isQuotaError) throw err;

      const fallback = await buildSqlAgent(credentials, 'mistral');
      result = await fallback.agentExecutor.invoke({ input: question });
    }

    const generatedSQL = extractSQLFromSteps(result.intermediateSteps);

    await Query.create({
      user: req.user.id,
      connection: connectionId,
      question,
      generatedSQL: generatedSQL || 'N/A',
    });

    res.status(200).json({
      success: true,
      data: {
        question,
        sql: generatedSQL,
        explanation: result.output,
      },
    });
  } catch (error) {
    if (error.message?.startsWith('Blocked:')) {
      return res.status(403).json({ success: false, message: error.message });
    }
    next(error);
  } finally {
    if (dataSource) await dataSource.destroy();
  }
};

function extractSQLFromSteps(steps) {
  if (!steps || steps.length === 0) return null;
  const sqlStep = [...steps].reverse().find((step) => step.action?.tool === 'query-sql');
  if (!sqlStep) return null;
  const input = sqlStep.action.toolInput;
  return typeof input === 'string' ? input : input?.input || JSON.stringify(input);
}

// @desc    Get query history for a specific connection
// @route   GET /api/query/history/:connectionId
exports.getQueryHistory = async (req, res, next) => {
  try {
    const history = await Query.find({
      user: req.user.id,
      connection: req.params.connectionId,
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
};