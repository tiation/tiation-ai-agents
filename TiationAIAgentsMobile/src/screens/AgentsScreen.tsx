/**
 * Agents Screen - Tiation AI Agents
 * Manage and monitor AI agents with enterprise controls
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  Switch,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, shadows } from '../theme/colors';

interface Agent {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'error' | 'paused';
  description: string;
  lastActivity: string;
  tasksCompleted: number;
  uptime: number;
  memoryUsage: number;
  cpuUsage: number;
  version: string;
  subscriptionTier: 'starter' | 'professional' | 'enterprise';
}

export const AgentsScreen: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: '1',
      name: 'Data Processor Alpha',
      type: 'Data Analysis',
      status: 'active',
      description: 'Advanced data processing and analysis agent',
      lastActivity: '2 minutes ago',
      tasksCompleted: 1247,
      uptime: 99.7,
      memoryUsage: 68,
      cpuUsage: 45,
      version: '2.1.0',
      subscriptionTier: 'enterprise',
    },
    {
      id: '2',
      name: 'Email Automation Beta',
      type: 'Marketing',
      status: 'active',
      description: 'Intelligent email marketing automation',
      lastActivity: '1 minute ago',
      tasksCompleted: 892,
      uptime: 98.5,
      memoryUsage: 42,
      cpuUsage: 32,
      version: '1.8.3',
      subscriptionTier: 'professional',
    },
    {
      id: '3',
      name: 'Report Generator Gamma',
      type: 'Reporting',
      status: 'paused',
      description: 'Automated report generation and formatting',
      lastActivity: '15 minutes ago',
      tasksCompleted: 456,
      uptime: 95.2,
      memoryUsage: 28,
      cpuUsage: 0,
      version: '1.5.2',
      subscriptionTier: 'starter',
    },
    {
      id: '4',
      name: 'Customer Support Delta',
      type: 'Support',
      status: 'error',
      description: 'AI-powered customer support assistant',
      lastActivity: '3 hours ago',
      tasksCompleted: 234,
      uptime: 87.3,
      memoryUsage: 85,
      cpuUsage: 90,
      version: '1.2.1',
      subscriptionTier: 'professional',
    },
  ]);

  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'error' | 'paused'>('all');

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'active':
        return colors.accent.green;
      case 'inactive':
        return colors.text.secondary;
      case 'error':
        return colors.accent.red;
      case 'paused':
        return colors.accent.yellow;
      default:
        return colors.text.secondary;
    }
  };

  const getStatusIcon = (status: Agent['status']) => {
    switch (status) {
      case 'active':
        return 'play-circle-filled';
      case 'inactive':
        return 'stop-circle';
      case 'error':
        return 'error';
      case 'paused':
        return 'pause-circle-filled';
      default:
        return 'help';
    }
  };

  const getTierColor = (tier: Agent['subscriptionTier']) => {
    switch (tier) {
      case 'starter':
        return colors.accent.cyan;
      case 'professional':
        return colors.accent.yellow;
      case 'enterprise':
        return colors.accent.magenta;
      default:
        return colors.text.secondary;
    }
  };

  const handleAgentAction = (agent: Agent, action: 'start' | 'stop' | 'restart' | 'delete') => {
    Alert.alert(
      `${action.charAt(0).toUpperCase() + action.slice(1)} Agent`,
      `Are you sure you want to ${action} "${agent.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            // Handle agent action
            console.log(`${action} agent:`, agent.id);
            // Update agent status based on action
            setAgents(prevAgents =>
              prevAgents.map(a =>
                a.id === agent.id
                  ? {
                      ...a,
                      status: action === 'start' ? 'active' : action === 'stop' ? 'inactive' : a.status,
                    }
                  : a
              )
            );
          },
        },
      ]
    );
  };

  const filteredAgents = agents.filter(agent => 
    filter === 'all' || agent.status === filter
  );

  const renderAgentCard = ({ item: agent }: { item: Agent }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedAgent(agent);
        setShowDetails(true);
      }}
    >
      <LinearGradient
        colors={colors.gradient.card}
        style={styles.agentCard}
      >
        <View style={styles.agentHeader}>
          <View style={styles.agentInfo}>
            <Text style={styles.agentName}>{agent.name}</Text>
            <Text style={styles.agentType}>{agent.type}</Text>
          </View>
          <View style={styles.agentStatus}>
            <Icon
              name={getStatusIcon(agent.status)}
              size={24}
              color={getStatusColor(agent.status)}
            />
            <Text style={[styles.statusText, { color: getStatusColor(agent.status) }]}>
              {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
            </Text>
          </View>
        </View>

        <Text style={styles.agentDescription}>{agent.description}</Text>

        <View style={styles.agentMetrics}>
          <View style={styles.metric}>
            <Icon name="assignment-turned-in" size={16} color={colors.accent.cyan} />
            <Text style={styles.metricValue}>{agent.tasksCompleted}</Text>
            <Text style={styles.metricLabel}>Tasks</Text>
          </View>
          <View style={styles.metric}>
            <Icon name="trending-up" size={16} color={colors.accent.green} />
            <Text style={styles.metricValue}>{agent.uptime}%</Text>
            <Text style={styles.metricLabel}>Uptime</Text>
          </View>
          <View style={styles.metric}>
            <Icon name="memory" size={16} color={colors.accent.yellow} />
            <Text style={styles.metricValue}>{agent.memoryUsage}%</Text>
            <Text style={styles.metricLabel}>Memory</Text>
          </View>
          <View style={styles.metric}>
            <Icon name="speed" size={16} color={colors.accent.magenta} />
            <Text style={styles.metricValue}>{agent.cpuUsage}%</Text>
            <Text style={styles.metricLabel}>CPU</Text>
          </View>
        </View>

        <View style={styles.agentFooter}>
          <View style={styles.tierBadge}>
            <Text style={[styles.tierText, { color: getTierColor(agent.subscriptionTier) }]}>
              {agent.subscriptionTier.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.lastActivity}>{agent.lastActivity}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderAgentDetails = () => (
    <Modal
      visible={showDetails}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowDetails(false)}
    >
      <View style={styles.modalOverlay}>
        <LinearGradient
          colors={colors.gradient.card}
          style={styles.detailsModal}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedAgent?.name}</Text>
            <TouchableOpacity onPress={() => setShowDetails(false)}>
              <Icon name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.detailsContent}>
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Status</Text>
              <View style={styles.statusRow}>
                <Icon
                  name={getStatusIcon(selectedAgent?.status || 'inactive')}
                  size={24}
                  color={getStatusColor(selectedAgent?.status || 'inactive')}
                />
                <Text style={[styles.statusText, { color: getStatusColor(selectedAgent?.status || 'inactive') }]}>
                  {selectedAgent?.status?.charAt(0).toUpperCase() + selectedAgent?.status?.slice(1)}
                </Text>
              </View>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Performance Metrics</Text>
              <View style={styles.metricsGrid}>
                <View style={styles.metricBox}>
                  <Text style={styles.metricBoxValue}>{selectedAgent?.tasksCompleted}</Text>
                  <Text style={styles.metricBoxLabel}>Tasks Completed</Text>
                </View>
                <View style={styles.metricBox}>
                  <Text style={styles.metricBoxValue}>{selectedAgent?.uptime}%</Text>
                  <Text style={styles.metricBoxLabel}>Uptime</Text>
                </View>
                <View style={styles.metricBox}>
                  <Text style={styles.metricBoxValue}>{selectedAgent?.memoryUsage}%</Text>
                  <Text style={styles.metricBoxLabel}>Memory Usage</Text>
                </View>
                <View style={styles.metricBox}>
                  <Text style={styles.metricBoxValue}>{selectedAgent?.cpuUsage}%</Text>
                  <Text style={styles.metricBoxLabel}>CPU Usage</Text>
                </View>
              </View>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Controls</Text>
              <View style={styles.controlsRow}>
                <TouchableOpacity
                  style={[styles.controlButton, { backgroundColor: colors.accent.green }]}
                  onPress={() => handleAgentAction(selectedAgent!, 'start')}
                >
                  <Icon name="play-arrow" size={20} color={colors.text.primary} />
                  <Text style={styles.controlButtonText}>Start</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.controlButton, { backgroundColor: colors.accent.yellow }]}
                  onPress={() => handleAgentAction(selectedAgent!, 'stop')}
                >
                  <Icon name="stop" size={20} color={colors.text.primary} />
                  <Text style={styles.controlButtonText}>Stop</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.controlButton, { backgroundColor: colors.accent.cyan }]}
                  onPress={() => handleAgentAction(selectedAgent!, 'restart')}
                >
                  <Icon name="refresh" size={20} color={colors.text.primary} />
                  <Text style={styles.controlButtonText}>Restart</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.controlButton, { backgroundColor: colors.accent.red }]}
                  onPress={() => handleAgentAction(selectedAgent!, 'delete')}
                >
                  <Icon name="delete" size={20} color={colors.text.primary} />
                  <Text style={styles.controlButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Information</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Version:</Text>
                <Text style={styles.infoValue}>{selectedAgent?.version}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Type:</Text>
                <Text style={styles.infoValue}>{selectedAgent?.type}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Subscription:</Text>
                <Text style={[styles.infoValue, { color: getTierColor(selectedAgent?.subscriptionTier || 'starter') }]}>
                  {selectedAgent?.subscriptionTier?.toUpperCase()}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Last Activity:</Text>
                <Text style={styles.infoValue}>{selectedAgent?.lastActivity}</Text>
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
    </Modal>
  );

  return (
    <LinearGradient
      colors={colors.gradient.background}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>AI Agents</Text>
        <Text style={styles.subtitle}>Manage your enterprise automation</Text>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['all', 'active', 'inactive', 'error', 'paused'].map((filterOption) => (
            <TouchableOpacity
              key={filterOption}
              style={[
                styles.filterButton,
                filter === filterOption && styles.filterButtonActive,
              ]}
              onPress={() => setFilter(filterOption as any)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filter === filterOption && styles.filterButtonTextActive,
                ]}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredAgents}
        renderItem={renderAgentCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.agentsList}
        showsVerticalScrollIndicator={false}
      />

      {renderAgentDetails()}

      <TouchableOpacity style={styles.fab}>
        <LinearGradient
          colors={[colors.accent.cyan, colors.accent.magenta]}
          style={styles.fabGradient}
        >
          <Icon name="add" size={24} color={colors.text.primary} />
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  filterButtonActive: {
    backgroundColor: colors.accent.cyan,
    borderColor: colors.accent.cyan,
  },
  filterButtonText: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: colors.text.primary,
  },
  agentsList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  agentCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border.primary,
    ...shadows.neon,
  },
  agentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  agentType: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  agentStatus: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  agentDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  agentMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metric: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  agentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  tierText: {
    fontSize: 10,
    fontWeight: '600',
  },
  lastActivity: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    borderRadius: 28,
    elevation: 8,
    ...shadows.neon,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsModal: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
  },
  detailsContent: {
    padding: 20,
  },
  detailSection: {
    marginBottom: 24,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricBox: {
    width: '48%',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  metricBoxValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  metricBoxLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  controlButtonText: {
    color: colors.text.primary,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
  },
});
