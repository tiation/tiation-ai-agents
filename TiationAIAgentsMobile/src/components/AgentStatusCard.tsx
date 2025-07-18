import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, shadows } from '../theme/colors';
import { Agent } from '../store/slices/dashboardSlice';

interface AgentStatusCardProps {
  agent: Agent;
  style?: ViewStyle;
  onPress?: () => void;
}

const { width } = Dimensions.get('window');

export const AgentStatusCard: React.FC<AgentStatusCardProps> = ({
  agent,
  style,
  onPress,
}) => {
  const getStatusColor = () => {
    switch (agent.status) {
      case 'running':
        return colors.accent.green;
      case 'warning':
        return colors.accent.yellow;
      case 'error':
        return colors.accent.red;
      case 'stopped':
        return colors.text.tertiary;
      default:
        return colors.text.secondary;
    }
  };

  const getStatusIcon = () => {
    switch (agent.status) {
      case 'running':
        return 'play-circle-filled';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'stopped':
        return 'stop-circle';
      default:
        return 'help';
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent style={[styles.container, style]} onPress={onPress}>
      <LinearGradient
        colors={colors.gradient.card}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.name}>{agent.name}</Text>
              <Text style={styles.type}>{agent.type}</Text>
            </View>
            <View style={styles.statusContainer}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
              <Icon
                name={getStatusIcon()}
                size={20}
                color={getStatusColor()}
              />
            </View>
          </View>

          {/* Description */}
          <Text style={styles.description}>{agent.description}</Text>

          {/* Metrics */}
          <View style={styles.metricsContainer}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Uptime</Text>
              <Text style={styles.metricValue}>{formatUptime(agent.uptime)}</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Tasks</Text>
              <Text style={styles.metricValue}>{agent.tasksCompleted}</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>CPU</Text>
              <Text style={styles.metricValue}>{agent.cpuUsage}%</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Memory</Text>
              <Text style={styles.metricValue}>{agent.memoryUsage}%</Text>
            </View>
          </View>

          {/* Progress bars */}
          <View style={styles.progressContainer}>
            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>CPU Usage</Text>
              <View style={styles.progressBar}>
                <LinearGradient
                  colors={[colors.accent.cyan, colors.accent.magenta]}
                  style={[styles.progressFill, { width: `${agent.cpuUsage}%` }]}
                />
              </View>
              <Text style={styles.progressValue}>{agent.cpuUsage}%</Text>
            </View>
            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>Memory Usage</Text>
              <View style={styles.progressBar}>
                <LinearGradient
                  colors={[colors.accent.green, colors.accent.yellow]}
                  style={[styles.progressFill, { width: `${agent.memoryUsage}%` }]}
                />
              </View>
              <Text style={styles.progressValue}>{agent.memoryUsage}%</Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.lastActivity}>
              Last activity: {agent.lastActivity}
            </Text>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="more-vert" size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border.tertiary,
    ...shadows.neon,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  type: {
    fontSize: 14,
    color: colors.accent.cyan,
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  description: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressItem: {
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 6,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.background.tertiary,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressValue: {
    fontSize: 12,
    color: colors.text.primary,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastActivity: {
    fontSize: 12,
    color: colors.text.tertiary,
    flex: 1,
  },
  actionButton: {
    padding: 8,
  },
});
