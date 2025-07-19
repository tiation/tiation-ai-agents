import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Surface, Avatar, Chip } from 'react-native-paper';
import { theme } from '../styles/theme';
import { Agent, AgentStatus } from '../types/Agent';
import LinearGradient from 'react-native-linear-gradient';

interface AgentDetailScreenProps {
  agent?: Agent;
}

const AgentDetailScreen: React.FC<AgentDetailScreenProps> = ({ agent }) => {
  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case AgentStatus.Active:
        return theme.colors.success;
      case AgentStatus.Error:
        return theme.colors.error;
      case AgentStatus.Processing:
        return theme.colors.warning;
      default:
        return theme.colors.disabled;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.backgroundVariant]}
        style={styles.gradientBackground}
      >
        {/* Header Section */}
        <Surface style={styles.headerSection}>
          <Avatar.Icon size={80} icon="robot" style={styles.avatar} />
          <View style={styles.headerInfo}>
            <Text style={styles.title}>{agent?.name || 'Agent Name'}</Text>
            <Chip
              mode="outlined"
              style={[styles.statusChip, { borderColor: getStatusColor(agent?.status || AgentStatus.Inactive) }]}
              textStyle={{ color: getStatusColor(agent?.status || AgentStatus.Inactive) }}
            >
              {agent?.status || AgentStatus.Inactive}
            </Chip>
          </View>
        </Surface>

        {/* Metrics Section */}
        <Card style={styles.metricsCard}>
          <Card.Title title="Performance Metrics" />
          <Card.Content style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{agent?.metrics.completedTasks || 0}</Text>
              <Text style={styles.metricLabel}>Tasks Completed</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{`${(agent?.metrics.successRate || 0) * 100}%`}</Text>
              <Text style={styles.metricLabel}>Success Rate</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{`${((agent?.metrics.averageResponseTime || 0) / 1000).toFixed(2)}s`}</Text>
              <Text style={styles.metricLabel}>Avg Response Time</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{`${((agent?.metrics.uptime || 0) / 3600000).toFixed(1)}h`}</Text>
              <Text style={styles.metricLabel}>Uptime</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Configuration Section */}
        <Card style={styles.configCard}>
          <Card.Title title="Configuration" />
          <Card.Content>
            <View style={styles.configItem}>
              <Text style={styles.configLabel}>Max Concurrent Tasks</Text>
              <Text style={styles.configValue}>{agent?.configuration.maxConcurrentTasks || 1}</Text>
            </View>
            <View style={styles.configItem}>
              <Text style={styles.configLabel}>Timeout</Text>
              <Text style={styles.configValue}>{`${((agent?.configuration.timeout || 0) / 1000).toFixed(0)}s`}</Text>
            </View>
            <View style={styles.configItem}>
              <Text style={styles.configLabel}>Retry Attempts</Text>
              <Text style={styles.configValue}>{agent?.configuration.retryAttempts || 3}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            style={styles.actionButton}
            icon="restart"
            onPress={() => {}}
          >
            Restart Agent
          </Button>
          <Button
            mode="outlined"
            style={styles.actionButton}
            icon="cog"
            onPress={() => {}}
          >
            Configure
          </Button>
        </View>
      </LinearGradient>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  gradientBackground: {
    padding: 16,
    minHeight: '100%',
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
  },
  avatar: {
    backgroundColor: theme.colors.primary,
  },
  headerInfo: {
    marginLeft: 16,
    flex: 1,
  },
  title: {
    fontSize: 24,
    color: theme.colors.primary,
    marginBottom: 8,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  metricsCard: {
    marginBottom: 16,
    backgroundColor: theme.colors.surface,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricItem: {
    width: '48%',
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundVariant,
    borderRadius: 8,
  },
  metricValue: {
    fontSize: 20,
    color: theme.colors.primary,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: theme.colors.text,
    opacity: 0.7,
  },
  configCard: {
    marginBottom: 16,
    backgroundColor: theme.colors.surface,
  },
  configItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.backdrop,
  },
  configLabel: {
    color: theme.colors.text,
    fontSize: 16,
  },
  configValue: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default AgentDetailScreen;
