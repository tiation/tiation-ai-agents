const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Agent name is required'],
    trim: true,
    maxlength: [100, 'Agent name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Agent owner is required']
  },
  type: {
    type: String,
    enum: ['chatbot', 'task_automation', 'data_analysis', 'content_generation', 'customer_service', 'sales', 'custom'],
    default: 'custom'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'training', 'error', 'archived'],
    default: 'inactive'
  },
  configuration: {
    model: {
      type: String,
      enum: ['gpt-4', 'gpt-3.5-turbo', 'claude-3-sonnet', 'claude-3-haiku', 'custom'],
      default: 'gpt-3.5-turbo'
    },
    temperature: {
      type: Number,
      min: 0,
      max: 2,
      default: 0.7
    },
    maxTokens: {
      type: Number,
      min: 1,
      max: 4000,
      default: 1000
    },
    systemPrompt: {
      type: String,
      maxlength: [2000, 'System prompt cannot exceed 2000 characters']
    },
    knowledgeBase: [{
      type: {
        type: String,
        enum: ['text', 'document', 'url', 'api'],
        required: true
      },
      content: {
        type: String,
        required: true
      },
      metadata: {
        title: String,
        source: String,
        lastUpdated: Date
      }
    }],
    integrations: [{
      service: {
        type: String,
        enum: ['slack', 'discord', 'teams', 'webhook', 'zapier', 'custom'],
        required: true
      },
      config: {
        type: mongoose.Schema.Types.Mixed,
        required: true
      },
      isActive: {
        type: Boolean,
        default: true
      }
    }],
    triggers: [{
      type: {
        type: String,
        enum: ['keyword', 'schedule', 'webhook', 'manual'],
        required: true
      },
      value: {
        type: String,
        required: true
      },
      isActive: {
        type: Boolean,
        default: true
      }
    }]
  },
  performance: {
    totalInteractions: {
      type: Number,
      default: 0
    },
    successfulResponses: {
      type: Number,
      default: 0
    },
    averageResponseTime: {
      type: Number,
      default: 0 // in milliseconds
    },
    satisfactionScore: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    lastInteraction: Date,
    monthlyInteractions: {
      type: Number,
      default: 0
    },
    lastMonthlyReset: {
      type: Date,
      default: Date.now
    }
  },
  training: {
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed', 'failed'],
      default: 'not_started'
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    trainingData: [{
      input: String,
      expectedOutput: String,
      actualOutput: String,
      feedback: {
        type: String,
        enum: ['positive', 'negative', 'neutral']
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }],
    lastTrained: Date
  },
  deployment: {
    isDeployed: {
      type: Boolean,
      default: false
    },
    deploymentUrl: String,
    apiKey: {
      type: String,
      unique: true,
      sparse: true
    },
    allowedDomains: [String],
    rateLimiting: {
      enabled: {
        type: Boolean,
        default: true
      },
      requestsPerMinute: {
        type: Number,
        default: 60
      },
      requestsPerHour: {
        type: Number,
        default: 1000
      }
    }
  },
  analytics: {
    conversations: [{
      sessionId: String,
      startTime: Date,
      endTime: Date,
      messageCount: Number,
      userSatisfaction: Number,
      tags: [String]
    }],
    popularQueries: [{
      query: String,
      count: Number,
      lastAsked: Date
    }],
    errorLogs: [{
      error: String,
      timestamp: Date,
      context: mongoose.Schema.Types.Mixed
    }]
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  version: {
    type: String,
    default: '1.0.0'
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for success rate
agentSchema.virtual('successRate').get(function() {
  if (this.performance.totalInteractions === 0) return 0;
  return (this.performance.successfulResponses / this.performance.totalInteractions) * 100;
});

// Virtual for agent URL
agentSchema.virtual('agentUrl').get(function() {
  return `${process.env.FRONTEND_URL}/agents/${this._id}`;
});

// Pre-save middleware to generate API key
agentSchema.pre('save', function(next) {
  if (this.isNew && !this.deployment.apiKey) {
    this.deployment.apiKey = require('crypto').randomBytes(32).toString('hex');
  }
  this.lastModified = new Date();
  next();
});

// Method to update performance metrics
agentSchema.methods.updatePerformance = function(responseTime, isSuccessful, satisfaction) {
  this.performance.totalInteractions += 1;
  this.performance.monthlyInteractions += 1;
  
  if (isSuccessful) {
    this.performance.successfulResponses += 1;
  }
  
  // Update average response time
  const totalTime = this.performance.averageResponseTime * (this.performance.totalInteractions - 1);
  this.performance.averageResponseTime = (totalTime + responseTime) / this.performance.totalInteractions;
  
  // Update satisfaction score
  if (satisfaction) {
    const totalSatisfaction = this.performance.satisfactionScore * (this.performance.totalInteractions - 1);
    this.performance.satisfactionScore = (totalSatisfaction + satisfaction) / this.performance.totalInteractions;
  }
  
  this.performance.lastInteraction = new Date();
  
  return this.save();
};

// Method to reset monthly metrics
agentSchema.methods.resetMonthlyMetrics = function() {
  const now = new Date();
  const lastReset = new Date(this.performance.lastMonthlyReset);
  
  // Reset if it's been more than 30 days
  if (now - lastReset > 30 * 24 * 60 * 60 * 1000) {
    this.performance.monthlyInteractions = 0;
    this.performance.lastMonthlyReset = now;
    return this.save();
  }
};

// Method to log conversation
agentSchema.methods.logConversation = function(sessionId, messageCount, userSatisfaction, tags) {
  this.analytics.conversations.push({
    sessionId,
    startTime: new Date(),
    endTime: new Date(),
    messageCount,
    userSatisfaction,
    tags
  });
  
  // Keep only last 1000 conversations
  if (this.analytics.conversations.length > 1000) {
    this.analytics.conversations = this.analytics.conversations.slice(-1000);
  }
  
  return this.save();
};

// Method to add training data
agentSchema.methods.addTrainingData = function(input, expectedOutput, actualOutput, feedback) {
  this.training.trainingData.push({
    input,
    expectedOutput,
    actualOutput,
    feedback,
    timestamp: new Date()
  });
  
  // Keep only last 1000 training examples
  if (this.training.trainingData.length > 1000) {
    this.training.trainingData = this.training.trainingData.slice(-1000);
  }
  
  return this.save();
};

// Indexes for efficient queries
agentSchema.index({ owner: 1, status: 1 });
agentSchema.index({ type: 1, isPublic: 1 });
agentSchema.index({ 'deployment.apiKey': 1 });
agentSchema.index({ tags: 1 });
agentSchema.index({ createdAt: -1 });
agentSchema.index({ 'performance.lastInteraction': -1 });

module.exports = mongoose.model('Agent', agentSchema);
