/**
 * Analytics Screen - Tiation AI Agents
 * Revenue tracking and performance analytics for enterprise monetization
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { colors, shadows } from '../theme/colors';

const { width } = Dimensions.get('window');

export const AnalyticsScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'users' | 'agents' | 'tasks'>('revenue');

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  // Sample analytics data
  const analyticsData = {
    revenue: {
      total: 47560,
      growth: 23.5,
      trend: 'up',
      chartData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            data: [12400, 15800, 18200, 22100, 28500, 35600],
            strokeWidth: 3,
            color: (opacity = 1) => `rgba(0, 217, 255, ${opacity})`,
          },
        ],
      },
    },
    users: {
      total: 1247,
      growth: 18.2,
      trend: 'up',
      chartData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            data: [856, 932, 1028, 1156, 1203, 1247],
            strokeWidth: 3,
            color: (opacity = 1) => `rgba(0, 255, 136, ${opacity})`,
          },
        ],
      },
    },
    agents: {
      total: 89,
      growth: 31.4,
      trend: 'up',
      chartData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            data: [45, 52, 61, 69, 78, 89],
            strokeWidth: 3,
            color: (opacity = 1) => `rgba(255, 229, 0, ${opacity})`,
          },
        ],
      },
    },
    tasks: {
      total: 15647,
      growth: 45.8,
      trend: 'up',
      chartData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            data: [8200, 9800, 11200, 12800, 14100, 15647],
            strokeWidth: 3,
            color: (opacity = 1) => `rgba(255, 0, 128, ${opacity})`,
          },
        ],
      },
    },
  };

  const subscriptionData = [
    {
      name: 'Enterprise',
      count: 45,
      color: colors.accent.magenta,
      legendFontColor: colors.text.primary,
      legendFontSize: 12,
    },
    {
      name: 'Professional',
      count: 128,
      color: colors.accent.yellow,
      legendFontColor: colors.text.primary,
      legendFontSize: 12,
    },
    {
      name: 'Starter',
      count: 234,
      color: colors.accent.cyan,
      legendFontColor: colors.text.primary,
      legendFontSize: 12,
    },
  ];

  const performanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [78, 85, 92, 88, 95, 89, 87],
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

  const getCurrentData = () => {
    return analyticsData[selectedMetric];
  };

  const renderKPICard = (title: string, value: string | number, growth: number, icon: string, color: string) => (
    <LinearGradient
      colors={colors.gradient.card}
      style={styles.kpiCard}
    >
      <View style={styles.kpiHeader}>
        <Icon name={icon} size={24} color={color} />
        <View style={[styles.growthBadge, { backgroundColor: growth > 0 ? colors.accent.green : colors.accent.red }]}>
          <Icon name={growth > 0 ? 'trending-up' : 'trending-down'} size={12} color={colors.text.primary} />
          <Text style={styles.growthText}>{Math.abs(growth)}%</Text>
        </View>
      </View>
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={styles.kpiTitle}>{title}</Text>
    </LinearGradient>
  );

  const renderPeriodButton = (period: string, label: string) => (
    <TouchableOpacity
      style={[
        styles.periodButton,
        selectedPeriod === period && styles.periodButtonActive,
      ]}
      onPress={() => setSelectedPeriod(period as any)}
    >
      <Text
        style={[
          styles.periodButtonText,
          selectedPeriod === period && styles.periodButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderMetricButton = (metric: string, label: string, color: string) => (
    <TouchableOpacity
      style={[
        styles.metricButton,
        selectedMetric === metric && { backgroundColor: color },
      ]}
      onPress={() => setSelectedMetric(metric as any)}
    >
      <Text
        style={[
          styles.metricButtonText,
          selectedMetric === metric && styles.metricButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
          <Text style={styles.subtitle}>Enterprise monetization insights</Text>
        </View>

        {/* Period Selection */}
        <View style={styles.periodContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {renderPeriodButton('week', 'Week')}
            {renderPeriodButton('month', 'Month')}
            {renderPeriodButton('quarter', 'Quarter')}
            {renderPeriodButton('year', 'Year')}
          </ScrollView>
        </View>

        {/* KPI Cards */}
        <View style={styles.kpiContainer}>
          {renderKPICard('Revenue', `$${analyticsData.revenue.total.toLocaleString()}`, analyticsData.revenue.growth, 'attach-money', colors.accent.cyan)}
          {renderKPICard('Active Users', analyticsData.users.total, analyticsData.users.growth, 'group', colors.accent.green)}
          {renderKPICard('AI Agents', analyticsData.agents.total, analyticsData.agents.growth, 'smart-toy', colors.accent.yellow)}
          {renderKPICard('Tasks Completed', analyticsData.tasks.total.toLocaleString(), analyticsData.tasks.growth, 'assignment-turned-in', colors.accent.magenta)}
        </View>

        {/* Metric Selection */}
        <View style={styles.metricContainer}>
          <Text style={styles.sectionTitle}>Performance Trends</Text>
          <View style={styles.metricButtons}>
            {renderMetricButton('revenue', 'Revenue', colors.accent.cyan)}
            {renderMetricButton('users', 'Users', colors.accent.green)}
            {renderMetricButton('agents', 'Agents', colors.accent.yellow)}
            {renderMetricButton('tasks', 'Tasks', colors.accent.magenta)}
          </View>
        </View>

        {/* Main Chart */}
        <View style={styles.chartContainer}>
          <LinearGradient
            colors={colors.gradient.card}
            style={styles.chartCard}
          >
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>
                {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Trend
              </Text>
              <TouchableOpacity style={styles.chartButton}>
                <Icon name="fullscreen" size={20} color={colors.accent.cyan} />
              </TouchableOpacity>
            </View>
            <LineChart
              data={getCurrentData().chartData}
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

        {/* Subscription Distribution */}
        <View style={styles.chartContainer}>
          <LinearGradient
            colors={colors.gradient.card}
            style={styles.chartCard}
          >
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Subscription Tiers</Text>
              <TouchableOpacity style={styles.chartButton}>
                <Icon name="pie-chart" size={20} color={colors.accent.cyan} />
              </TouchableOpacity>
            </View>
            <PieChart
              data={subscriptionData}
              width={width - 60}
              height={220}
              chartConfig={chartConfig}
              accessor="count"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </LinearGradient>
        </View>

        {/* Performance Metrics */}
        <View style={styles.chartContainer}>
          <LinearGradient
            colors={colors.gradient.card}
            style={styles.chartCard}
          >
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Weekly Performance</Text>
              <TouchableOpacity style={styles.chartButton}>
                <Icon name="bar-chart" size={20} color={colors.accent.cyan} />
              </TouchableOpacity>
            </View>
            <BarChart
              data={performanceData}
              width={width - 60}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              yAxisLabel=""
              yAxisSuffix="%"
              withInnerLines={false}
              showBarTops={false}
              fromZero={true}
            />
          </LinearGradient>
        </View>

        {/* Revenue Insights */}
        <View style={styles.insightsContainer}>
          <Text style={styles.sectionTitle}>Revenue Insights</Text>
          <LinearGradient
            colors={colors.gradient.card}
            style={styles.insightsCard}
          >
            <View style={styles.insightRow}>
              <View style={styles.insightItem}>
                <Text style={styles.insightLabel}>MRR</Text>
                <Text style={styles.insightValue}>$22,415</Text>
                <View style={styles.insightBadge}>
                  <Icon name="trending-up" size={12} color={colors.text.primary} />
                  <Text style={styles.insightBadgeText}>+15%</Text>
                </View>
              </View>
              <View style={styles.insightItem}>
                <Text style={styles.insightLabel}>ARR</Text>
                <Text style={styles.insightValue}>$268,980</Text>
                <View style={styles.insightBadge}>
                  <Icon name="trending-up" size={12} color={colors.text.primary} />
                  <Text style={styles.insightBadgeText}>+23%</Text>
                </View>
              </View>
            </View>
            <View style={styles.insightRow}>
              <View style={styles.insightItem}>
                <Text style={styles.insightLabel}>ARPU</Text>
                <Text style={styles.insightValue}>$188</Text>
                <View style={styles.insightBadge}>
                  <Icon name="trending-up" size={12} color={colors.text.primary} />
                  <Text style={styles.insightBadgeText}>+8%</Text>
                </View>
              </View>
              <View style={styles.insightItem}>
                <Text style={styles.insightLabel}>Churn</Text>
                <Text style={styles.insightValue}>2.4%</Text>
                <View style={[styles.insightBadge, { backgroundColor: colors.accent.green }]}>
                  <Icon name="trending-down" size={12} color={colors.text.primary} />
                  <Text style={styles.insightBadgeText}>-1.2%</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Key Metrics Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>Performance Summary</Text>
          <LinearGradient
            colors={colors.gradient.card}
            style={styles.summaryCard}
          >
            <View style={styles.summaryRow}>
              <Icon name="trending-up" size={24} color={colors.accent.green} />
              <Text style={styles.summaryText}>Revenue up 23.5% this month</Text>
            </View>
            <View style={styles.summaryRow}>
              <Icon name="group-add" size={24} color={colors.accent.cyan} />
              <Text style={styles.summaryText}>89 new users acquired</Text>
            </View>
            <View style={styles.summaryRow}>
              <Icon name="smart-toy" size={24} color={colors.accent.yellow} />
              <Text style={styles.summaryText}>31% increase in AI agent deployment</Text>
            </View>
            <View style={styles.summaryRow}>
              <Icon name="star" size={24} color={colors.accent.magenta} />
              <Text style={styles.summaryText}>97% customer satisfaction rate</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
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
  periodContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  periodButtonActive: {
    backgroundColor: colors.accent.cyan,
    borderColor: colors.accent.cyan,
  },
  periodButtonText: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: '500',
  },
  periodButtonTextActive: {
    color: colors.text.primary,
  },
  kpiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  kpiCard: {
    width: (width - 60) / 2,
    borderRadius: 16,
    padding: 16,
    marginRight: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border.primary,
    ...shadows.neon,
  },
  kpiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  growthText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 2,
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  kpiTitle: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  metricContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  metricButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metricButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  metricButtonText: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: '500',
  },
  metricButtonTextActive: {
    color: colors.text.primary,
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
    fontSize: 16,
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
  insightsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  insightsCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border.primary,
    ...shadows.neon,
  },
  insightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  insightItem: {
    flex: 1,
    alignItems: 'center',
  },
  insightLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  insightValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  insightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: colors.accent.cyan,
  },
  insightBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 2,
  },
  summaryContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  summaryCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border.primary,
    ...shadows.neon,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 14,
    color: colors.text.primary,
    marginLeft: 12,
    flex: 1,
  },
  bottomPadding: {
    height: 100,
  },
});
