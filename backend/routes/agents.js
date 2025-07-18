const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Agent = require('../models/Agent');
const User = require('../models/User');
const { authenticateToken, checkLimit, verifyApiKey, logApiUsage } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateAgent = [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Agent name is required and must be less than 100 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  body('type').optional().isIn(['chatbot', 'task_automation', 'data_analysis', 'content_generation', 'customer_service', 'sales', 'custom']),
  body('configuration.model').optional().isIn(['gpt-4', 'gpt-3.5-turbo', 'claude-3-sonnet', 'claude-3-haiku', 'custom']),
  body('configuration.temperature').optional().isFloat({ min: 0, max: 2 }),
  body('configuration.maxTokens').optional().isInt({ min: 1, max: 4000 }),
  body('configuration.systemPrompt').optional().trim().isLength({ max: 2000 })
];

// @route   GET /api/agents
// @desc    Get all agents for the authenticated user
// @access  Private
router.get('/', authenticateToken, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['active', 'inactive', 'training', 'error', 'archived']),
  query('type').optional().isIn(['chatbot', 'task_automation', 'data_analysis', 'content_generation', 'customer_service', 'sales', 'custom']),
  query('search').optional().trim().isLength({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Please check your query parameters',
        details: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query = { owner: req.user._id };
    
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    if (req.query.type) {
      query.type = req.query.type;
    }
    
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } }
      ];
    }

    // Get agents with pagination
    const agents = await Agent.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('owner', 'firstName lastName email');

    // Get total count for pagination
    const totalAgents = await Agent.countDocuments(query);
    const totalPages = Math.ceil(totalAgents / limit);

    res.json({
      agents,
      pagination: {
        currentPage: page,
        totalPages,
        totalAgents,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Get agents error:', error);
    res.status(500).json({
      error: 'Failed to fetch agents',
      message: 'Internal server error while fetching agents'
    });
  }
});

// @route   GET /api/agents/:id
// @desc    Get a specific agent by ID
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const agent = await Agent.findOne({
      _id: req.params.id,
      owner: req.user._id
    }).populate('owner', 'firstName lastName email');

    if (!agent) {
      return res.status(404).json({
        error: 'Agent not found',
        message: 'Agent not found or you do not have access to it'
      });
    }

    res.json({ agent });

  } catch (error) {
    console.error('Get agent error:', error);
    res.status(500).json({
      error: 'Failed to fetch agent',
      message: 'Internal server error while fetching agent'
    });
  }
});

// @route   POST /api/agents
// @desc    Create a new agent
// @access  Private
router.post('/', authenticateToken, checkLimit('agentsCreated'), validateAgent, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Please check your input data',
        details: errors.array()
      });
    }

    const agentData = {
      ...req.body,
      owner: req.user._id
    };

    const agent = new Agent(agentData);
    await agent.save();

    // Update user's agent count
    req.user.usage.agentsCreated += 1;
    await req.user.save();

    // Populate owner info
    await agent.populate('owner', 'firstName lastName email');

    res.status(201).json({
      message: 'Agent created successfully',
      agent
    });

  } catch (error) {
    console.error('Create agent error:', error);
    res.status(500).json({
      error: 'Failed to create agent',
      message: 'Internal server error while creating agent'
    });
  }
});

// @route   PUT /api/agents/:id
// @desc    Update an agent
// @access  Private
router.put('/:id', authenticateToken, validateAgent, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Please check your input data',
        details: errors.array()
      });
    }

    const allowedUpdates = [
      'name', 'description', 'type', 'configuration', 'tags'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const agent = await Agent.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      updates,
      { new: true, runValidators: true }
    ).populate('owner', 'firstName lastName email');

    if (!agent) {
      return res.status(404).json({
        error: 'Agent not found',
        message: 'Agent not found or you do not have access to it'
      });
    }

    res.json({
      message: 'Agent updated successfully',
      agent
    });

  } catch (error) {
    console.error('Update agent error:', error);
    res.status(500).json({
      error: 'Failed to update agent',
      message: 'Internal server error while updating agent'
    });
  }
});

// @route   DELETE /api/agents/:id
// @desc    Delete an agent
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const agent = await Agent.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!agent) {
      return res.status(404).json({
        error: 'Agent not found',
        message: 'Agent not found or you do not have access to it'
      });
    }

    // Update user's agent count
    if (req.user.usage.agentsCreated > 0) {
      req.user.usage.agentsCreated -= 1;
      await req.user.save();
    }

    res.json({
      message: 'Agent deleted successfully'
    });

  } catch (error) {
    console.error('Delete agent error:', error);
    res.status(500).json({
      error: 'Failed to delete agent',
      message: 'Internal server error while deleting agent'
    });
  }
});

// @route   POST /api/agents/:id/deploy
// @desc    Deploy/undeploy an agent
// @access  Private
router.post('/:id/deploy', authenticateToken, async (req, res) => {
  try {
    const { isDeployed } = req.body;

    const agent = await Agent.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!agent) {
      return res.status(404).json({
        error: 'Agent not found',
        message: 'Agent not found or you do not have access to it'
      });
    }

    // Update deployment status
    agent.deployment.isDeployed = isDeployed;
    
    if (isDeployed) {
      agent.status = 'active';
      agent.deployment.deploymentUrl = `${process.env.FRONTEND_URL}/api/agents/${agent._id}/chat`;
    } else {
      agent.status = 'inactive';
      agent.deployment.deploymentUrl = null;
    }

    await agent.save();

    res.json({
      message: `Agent ${isDeployed ? 'deployed' : 'undeployed'} successfully`,
      agent: {
        _id: agent._id,
        name: agent.name,
        status: agent.status,
        deployment: agent.deployment
      }
    });

  } catch (error) {
    console.error('Deploy agent error:', error);
    res.status(500).json({
      error: 'Failed to deploy agent',
      message: 'Internal server error while deploying agent'
    });
  }
});

// @route   POST /api/agents/:id/train
// @desc    Train an agent with new data
// @access  Private
router.post('/:id/train', authenticateToken, [
  body('trainingData').isArray({ min: 1 }).withMessage('Training data must be a non-empty array'),
  body('trainingData.*.input').notEmpty().withMessage('Training input is required'),
  body('trainingData.*.expectedOutput').notEmpty().withMessage('Expected output is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Please check your training data',
        details: errors.array()
      });
    }

    const agent = await Agent.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!agent) {
      return res.status(404).json({
        error: 'Agent not found',
        message: 'Agent not found or you do not have access to it'
      });
    }

    const { trainingData } = req.body;

    // Add training data
    trainingData.forEach(data => {
      agent.addTrainingData(data.input, data.expectedOutput, null, 'neutral');
    });

    // Update training status
    agent.training.status = 'in_progress';
    agent.training.progress = 0;
    agent.training.lastTrained = new Date();
    
    await agent.save();

    // In a real app, you'd trigger actual training here
    // For now, we'll simulate it
    setTimeout(async () => {
      try {
        agent.training.status = 'completed';
        agent.training.progress = 100;
        await agent.save();
      } catch (error) {
        console.error('Training completion error:', error);
      }
    }, 5000);

    res.json({
      message: 'Training started successfully',
      training: {
        status: agent.training.status,
        progress: agent.training.progress,
        dataCount: trainingData.length
      }
    });

  } catch (error) {
    console.error('Train agent error:', error);
    res.status(500).json({
      error: 'Failed to train agent',
      message: 'Internal server error while training agent'
    });
  }
});

// @route   GET /api/agents/:id/analytics
// @desc    Get agent analytics
// @access  Private
router.get('/:id/analytics', authenticateToken, async (req, res) => {
  try {
    const agent = await Agent.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!agent) {
      return res.status(404).json({
        error: 'Agent not found',
        message: 'Agent not found or you do not have access to it'
      });
    }

    const analytics = {
      performance: agent.performance,
      training: {
        status: agent.training.status,
        progress: agent.training.progress,
        dataCount: agent.training.trainingData.length,
        lastTrained: agent.training.lastTrained
      },
      deployment: {
        isDeployed: agent.deployment.isDeployed,
        apiKey: agent.deployment.apiKey ? '***' + agent.deployment.apiKey.slice(-4) : null
      },
      conversationCount: agent.analytics.conversations.length,
      popularQueries: agent.analytics.popularQueries.slice(0, 10),
      errorCount: agent.analytics.errorLogs.length,
      successRate: agent.successRate
    };

    res.json({ analytics });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      error: 'Failed to fetch analytics',
      message: 'Internal server error while fetching analytics'
    });
  }
});

// @route   POST /api/agents/:id/chat
// @desc    Chat with an agent (public API for deployed agents)
// @access  API Key Required
router.post('/:id/chat', verifyApiKey, logApiUsage, [
  body('message').trim().notEmpty().withMessage('Message is required'),
  body('sessionId').optional().isString().withMessage('Session ID must be a string'),
  body('context').optional().isObject().withMessage('Context must be an object')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Please check your input data',
        details: errors.array()
      });
    }

    const { message, sessionId, context } = req.body;
    const agent = req.agent;

    // Check if agent matches the ID in the URL
    if (agent._id.toString() !== req.params.id) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'API key does not match the requested agent'
      });
    }

    // In a real app, this would integrate with OpenAI, Claude, etc.
    // For now, we'll return a mock response
    const response = {
      message: `Hello! I'm ${agent.name}. You said: "${message}". This is a mock response from the agent.`,
      sessionId: sessionId || require('crypto').randomUUID(),
      timestamp: new Date().toISOString(),
      agent: {
        name: agent.name,
        type: agent.type
      }
    };

    // Log the conversation
    await agent.logConversation(response.sessionId, 1, 5, ['chat']);

    res.json(response);

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Chat failed',
      message: 'Internal server error during chat'
    });
  }
});

// @route   GET /api/agents/public
// @desc    Get public agents (for marketplace)
// @access  Public
router.get('/public', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('type').optional().isIn(['chatbot', 'task_automation', 'data_analysis', 'content_generation', 'customer_service', 'sales', 'custom']),
  query('search').optional().trim().isLength({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Please check your query parameters',
        details: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query for public agents
    const query = { 
      isPublic: true,
      status: 'active',
      'deployment.isDeployed': true
    };
    
    if (req.query.type) {
      query.type = req.query.type;
    }
    
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } }
      ];
    }

    const agents = await Agent.find(query)
      .select('name description type tags performance.satisfactionScore performance.totalInteractions createdAt')
      .sort({ 'performance.satisfactionScore': -1, 'performance.totalInteractions': -1 })
      .skip(skip)
      .limit(limit)
      .populate('owner', 'firstName lastName');

    const totalAgents = await Agent.countDocuments(query);
    const totalPages = Math.ceil(totalAgents / limit);

    res.json({
      agents,
      pagination: {
        currentPage: page,
        totalPages,
        totalAgents,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Get public agents error:', error);
    res.status(500).json({
      error: 'Failed to fetch public agents',
      message: 'Internal server error while fetching public agents'
    });
  }
});

module.exports = router;
