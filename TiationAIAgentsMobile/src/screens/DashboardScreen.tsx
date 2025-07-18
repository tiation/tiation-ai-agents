import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LineChart } from 'react-native-chart-kit';

import { colors, shadows } from '../theme/colors';
import { MetricCard } from '../components/MetricCard';
import { AgentStatusCard } from '../components/AgentStatusCard';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchDashboardData } from '../store/slices/dashboardSlice';

const { width } = Dimensions.get('window');

export const DashboardScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { metrics, agents, loading, error } = useAppSelector(state => state.dashboard);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchDashboardData());
    setRefreshing(false);
  };

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [65, 78, 82, 75, 89, 94, 87],
        strokeWidth: 3,
        color: (opacity = 1) => `rgba(0, 217, 255, ${opacity})`,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: colors.background.primary,
    backgroundGradientFrom: colors.background.primary,
    backgroundGradientTo: colors.background.secondary,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 217, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(176, 176, 176, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.accent.cyan,
    },
    propsForBackgroundLines: {
      stroke: colors.border.tertiary,
      strokeOpacity: 0.3,
    },
  };

  if (loading && !refreshing) {
    return (
      <LinearGradient
        colors={colors.gradient.background}
        style={styles.loadingContainer}
      >
        <Icon name="smart-toy" size={64} color={colors.accent.cyan} />
        <Text style={styles.loadingText}>Loading AI Dashboard...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={colors.gradient.background}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.accent.cyan]}
            progressBackgroundColor={colors.background.secondary}
            tintColor={colors.accent.cyan}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AI Dashboard</Text>
          <Text style={styles.headerSubtitle}>
            Monitor your AI agents in real-time
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.metricsContainer}>
          <MetricCard
            title="Active Agents"
            value={metrics?.activeAgents || 0}
            icon="smart-toy"
            color={colors.accent.cyan}
            trend="+12%"
            trendDirection="up"
          />
          <MetricCard
            title="Tasks Completed"
            value={metrics?.completedTasks || 0}
            icon="check-circle"
            color={colors.accent.green}
            trend="+8%"
            trendDirection="up"
          />
          <MetricCard
            title="System Load"
            value={`${metrics?.systemLoad || 0}%`}
            icon="memory"
            color={colors.accent.yellow}
            trend="-3%"
            trendDirection="down"
          />
          <MetricCard
            title="Errors"
            value={metrics?.errors || 0}
            icon="error"
            color={colors.accent.red}
            trend="0%"
            trendDirection="neutral"
          />
        </View>

        {/* Performance Chart */}
        <View style={styles.chartContainer}>
          <LinearGradient
            colors={colors.gradient.card}
            style={styles.chartCard}
          >
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Performance Metrics</Text>
              <TouchableOpacity style={styles.chartButton}>
                <Icon name="fullscreen" size={20} color={colors.accent.cyan} />
              </TouchableOpacity>
            </View>
            <LineChart
              data={chartData}
              width={width - 60}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              bezier
              withInnerLines={false}
              withOuterLines={false}
              withHorizontalLabels={true}
              withVerticalLabels={true}
              segments={4}
            />
          </LinearGradient>
        </View>

        {/* Agent Status Cards */}
        <View style={styles.agentsContainer}>
          <Text style={styles.sectionTitle}>Agent Status</Text>
          {agents?.map((agent, index) => (
            <AgentStatusCard
              key={agent.id || index}
              agent={agent}
              style={styles.agentCard}
            />
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.activityContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <LinearGradient
            colors={colors.gradient.card}
            style={styles.activityCard}
          >
            <View style={styles.activityItem}>
              <Icon name="play-arrow" size={20} color={colors.accent.green} />
              <Text style={styles.activityText}>
                Agent "DataProcessor" started successfully
              </Text>
              <Text style={styles.activityTime}>2m ago</Text>
            </View>
            <View style={styles.activityItem}>
              <Icon name="check-circle" size={20} color={colors.accent.cyan} />
              <Text style={styles.activityText}>
                Task "Report Generation" completed
              </Text>
              <Text style={styles.activityTime}>5m ago</Text>
            </View>
            <View style={styles.activityItem}>
              <Icon name="warning" size={20} color={colors.accent.yellow} />
              <Text style={styles.activityText}>
                Agent "EmailBot" memory usage high
              </Text>
              <Text style={styles.activityTime}>12m ago</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Add some bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.text.primary,
    fontSize: 18,
    marginTop: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  chartContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  chartCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border.primary,
    ...shadows.neon,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  chartButton: {
    padding: 8,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  agentsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 15,
  },
  agentCard: {
    marginBottom: 12,
  },
  activityContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  activityCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border.primary,
    ...shadows.neon,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  activityText: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 14,
    marginLeft: 12,
  },
  activityTime: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  bottomPadding: {
    height: 100,
  },
});
