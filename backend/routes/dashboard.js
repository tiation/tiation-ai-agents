const express = require('express');
const { query, validationResult } = require('express-validator');
const Agent = require('../models/Agent');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/dashboard
// @desc    Get dashboard overview data
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's agents
    const agents = await Agent.find({ owner: userId });
    
    // Calculate basic stats
    const totalAgents = agents.length;
    const activeAgents = agents.filter(agent => agent.status === 'active').length;
    const deployedAgents = agents.filter(agent => agent.deployment.isDeployed).length;
    
    // Calculate total interactions
    const totalInteractions = agents.reduce((sum, agent) => sum + agent.performance.totalInteractions, 0);
    const monthlyInteractions = agents.reduce((sum, agent) => sum + agent.performance.monthlyInteractions, 0);
    
    // Calculate success rate
    const totalSuccessful = agents.reduce((sum, agent) => sum + agent.performance.successfulResponses, 0);
    const successRate = totalInteractions > 0 ? (totalSuccessful / totalInteractions) * 100 : 0;
    
    // Calculate average satisfaction
    const totalSatisfaction = agents.reduce((sum, agent) => sum + agent.performance.satisfactionScore, 0);
    const averageSatisfaction = totalAgents > 0 ? totalSatisfaction / totalAgents : 0;
    
    // Calculate average response time
    const totalResponseTime = agents.reduce((sum, agent) => sum + agent.performance.averageResponseTime, 0);
    const averageResponseTime = totalAgents > 0 ? totalResponseTime / totalAgents : 0;
    
    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentAgents = agents.filter(agent => 
      agent.createdAt >= thirtyDaysAgo
    ).length;
    
    // Get most active agents
    const mostActiveAgents = agents
      .sort((a, b) => b.performance.totalInteractions - a.performance.totalInteractions)
      .slice(0, 5)
      .map(agent => ({
        _id: agent._id,
        name: agent.name,
        type: agent.type,
        status: agent.status,
        interactions: agent.performance.totalInteractions,
        successRate: agent.successRate,
        satisfactionScore: agent.performance.satisfactionScore,
        lastInteraction: agent.performance.lastInteraction
      }));
    
    // Get subscription usage
    const subscriptionLimits = {
      free: { agentsCreated: 3, monthlyApiCalls: 1000, storageUsed: 100 },
      pro: { agentsCreated: 50, monthlyApiCalls: 50000, storageUsed: 1000 },
      enterprise: { agentsCreated: -1, monthlyApiCalls: -1, storageUsed: -1 }
    };
    
    const userLimits = subscriptionLimits[req.user.subscription.tier];
    const usagePercentage = {
      agents: userLimits.agentsCreated === -1 ? 0 : (req.user.usage.agentsCreated / userLimits.agentsCreated) * 100,
      apiCalls: userLimits.monthlyApiCalls === -1 ? 0 : (req.user.usage.monthlyApiCalls / userLimits.monthlyApiCalls) * 100,
      storage: userLimits.storageUsed === -1 ? 0 : (req.user.usage.storageUsed / userLimits.storageUsed) * 100
    };
    
    // Get activity timeline (last 7 days)
    const activityTimeline = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const dayInteractions = agents.reduce((sum, agent) => {
        const dayConversations = agent.analytics.conversations.filter(
          conv => conv.startTime >= dayStart && conv.startTime <= dayEnd
        );
        return sum + dayConversations.length;
      }, 0);
      
      activityTimeline.push({
        date: dayStart.toISOString().split('T')[0],
        interactions: dayInteractions
      });
    }
    
    const dashboardData = {
      overview: {
        totalAgents,
        activeAgents,
        deployedAgents,
        totalInteractions,
        monthlyInteractions,
        successRate: Math.round(successRate * 100) / 100,
        averageSatisfaction: Math.round(averageSatisfaction * 100) / 100,
        averageResponseTime: Math.round(averageResponseTime),
        recentAgents
      },
      usage: {
        current: req.user.usage,
        limits: userLimits,
        percentage: usagePercentage,
        subscription: req.user.subscription
      },
      mostActiveAgents,
      activityTimeline,
      quickStats: {
        agentsThisMonth: recentAgents,
        interactionsToday: activityTimeline[6]?.interactions || 0,
        averageRating: Math.round(averageSatisfaction * 10) / 10,
        responseTime: `${Math.round(averageResponseTime)}ms`
      }
    };

    res.json(dashboardData);

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      error: 'Failed to fetch dashboard data',
      message: 'Internal server error while fetching dashboard data'
    });
  }
});

// @route   GET /api/dashboard/analytics
// @desc    Get detailed analytics data
// @access  Private
router.get('/analytics', authenticateToken, [
  query('period').optional().isIn(['7d', '30d', '90d', '1y']).withMessage('Period must be 7d, 30d, 90d, or 1y'),
  query('metric').optional().isIn(['interactions', 'satisfaction', 'response_time', 'success_rate']).withMessage('Invalid metric')
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

    const period = req.query.period || '30d';
    const metric = req.query.metric || 'interactions';
    
    // Calculate date range
    const now = new Date();
    const daysBack = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    }[period];
    
    const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    
    // Get user's agents
    const agents = await Agent.find({ owner: req.user._id });
    
    // Generate time series data
    const timeSeriesData = [];
    const interval = period === '7d' ? 1 : period === '30d' ? 1 : period === '90d' ? 3 : 7; // days
    
    for (let i = 0; i < daysBack; i += interval) {
      const date = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000));
      const nextDate = new Date(date.getTime() + (interval * 24 * 60 * 60 * 1000));
      
      let value = 0;
      
      if (metric === 'interactions') {
        value = agents.reduce((sum, agent) => {
          const conversations = agent.analytics.conversations.filter(
            conv => conv.startTime >= date && conv.startTime < nextDate
          );
          return sum + conversations.length;
        }, 0);
      } else if (metric === 'satisfaction') {
        const satisfactionScores = agents.reduce((scores, agent) => {
          const conversations = agent.analytics.conversations.filter(
            conv => conv.startTime >= date && conv.startTime < nextDate && conv.userSatisfaction
          );
          return scores.concat(conversations.map(conv => conv.userSatisfaction));
        }, []);
        
        value = satisfactionScores.length > 0 
          ? satisfactionScores.reduce((sum, score) => sum + score, 0) / satisfactionScores.length
          : 0;
      } else if (metric === 'response_time') {
        // This would need more detailed logging in a real app
        value = agents.reduce((sum, agent) => sum + agent.performance.averageResponseTime, 0) / agents.length || 0;
      } else if (metric === 'success_rate') {
        const totalInteractions = agents.reduce((sum, agent) => sum + agent.performance.totalInteractions, 0);
        const successfulResponses = agents.reduce((sum, agent) => sum + agent.performance.successfulResponses, 0);
        value = totalInteractions > 0 ? (successfulResponses / totalInteractions) * 100 : 0;
      }
      
      timeSeriesData.push({
        date: date.toISOString().split('T')[0],
        value: Math.round(value * 100) / 100
      });
    }
    
    // Get comparison data (previous period)
    const previousPeriodStart = new Date(startDate.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    const previousPeriodEnd = startDate;
    
    const currentPeriodTotal = timeSeriesData.reduce((sum, point) => sum + point.value, 0);
    const previousPeriodTotal = agents.reduce((sum, agent) => {
      const conversations = agent.analytics.conversations.filter(
        conv => conv.startTime >= previousPeriodStart && conv.startTime < previousPeriodEnd
      );
      return sum + conversations.length;
    }, 0);
    
    const percentageChange = previousPeriodTotal > 0 
      ? ((currentPeriodTotal - previousPeriodTotal) / previousPeriodTotal) * 100
      : 0;
    
    // Get top performing agents for this period
    const topAgents = agents
      .map(agent => {
        const periodConversations = agent.analytics.conversations.filter(
          conv => conv.startTime >= startDate && conv.startTime <= now
        );
        
        return {
          _id: agent._id,
          name: agent.name,
          type: agent.type,
          interactions: periodConversations.length,
          satisfaction: periodConversations.length > 0 
            ? periodConversations.reduce((sum, conv) => sum + (conv.userSatisfaction || 0), 0) / periodConversations.length
            : 0,
          successRate: agent.successRate
        };
      })
      .sort((a, b) => b.interactions - a.interactions)
      .slice(0, 5);
    
    const analyticsData = {
      period,
      metric,
      timeSeriesData,
      summary: {
        total: currentPeriodTotal,
        average: timeSeriesData.length > 0 ? currentPeriodTotal / timeSeriesData.length : 0,
        percentageChange: Math.round(percentageChange * 100) / 100,
        trend: percentageChange > 0 ? 'up' : percentageChange < 0 ? 'down' : 'stable'
      },
      topAgents,
      insights: [
        {
          type: 'performance',
          message: percentageChange > 10 
            ? `Great job! Your ${metric} improved by ${Math.round(percentageChange)}% this period.`
            : percentageChange < -10 
            ? `Your ${metric} decreased by ${Math.abs(Math.round(percentageChange))}% this period. Consider reviewing your agents.`
            : `Your ${metric} remained stable this period.`
        },
        {
          type: 'usage',
          message: topAgents.length > 0 
            ? `Your most active agent "${topAgents[0].name}" had ${topAgents[0].interactions} interactions.`
            : 'No agent activity recorded for this period.'
        }
      ]
    };

    res.json(analyticsData);

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      error: 'Failed to fetch analytics data',
      message: 'Internal server error while fetching analytics data'
    });
  }
});

// @route   GET /api/dashboard/activity
// @desc    Get recent activity feed
// @access  Private
router.get('/activity', authenticateToken, [
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
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

    const limit = parseInt(req.query.limit) || 20;
    
    // Get user's agents
    const agents = await Agent.find({ owner: req.user._id }).select('name type createdAt updatedAt status performance analytics');
    
    // Collect all activities
    const activities = [];
    
    // Agent creation activities
    agents.forEach(agent => {
      activities.push({
        type: 'agent_created',
        message: `Agent "${agent.name}" was created`,
        timestamp: agent.createdAt,
        agent: {
          _id: agent._id,
          name: agent.name,
          type: agent.type
        }
      });
    });
    
    // Recent conversations
    agents.forEach(agent => {
      agent.analytics.conversations.forEach(conv => {
        activities.push({
          type: 'conversation',
          message: `New conversation with "${agent.name}"`,
          timestamp: conv.startTime,
          agent: {
            _id: agent._id,
            name: agent.name,
            type: agent.type
          },
          details: {
            messageCount: conv.messageCount,
            satisfaction: conv.userSatisfaction
          }
        });
      });
    });
    
    // Recent training activities
    agents.forEach(agent => {
      if (agent.training.lastTrained) {
        activities.push({
          type: 'training_completed',
          message: `Training completed for "${agent.name}"`,
          timestamp: agent.training.lastTrained,
          agent: {
            _id: agent._id,
            name: agent.name,
            type: agent.type
          },
          details: {
            status: agent.training.status,
            progress: agent.training.progress
          }
        });
      }
    });
    
    // Sort by timestamp and limit
    const recentActivities = activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit)
      .map(activity => ({
        ...activity,
        timestamp: activity.timestamp.toISOString(),
        timeAgo: getTimeAgo(activity.timestamp)
      }));
    
    res.json({
      activities: recentActivities,
      total: activities.length
    });

  } catch (error) {
    console.error('Activity feed error:', error);
    res.status(500).json({
      error: 'Failed to fetch activity feed',
      message: 'Internal server error while fetching activity feed'
    });
  }
});

// Helper function to calculate time ago
function getTimeAgo(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}

module.exports = router;
