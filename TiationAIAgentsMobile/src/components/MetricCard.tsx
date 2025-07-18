import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, shadows } from '../theme/colors';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  style?: ViewStyle;
  onPress?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
  trendDirection,
  style,
  onPress,
}) => {
  const getTrendColor = () => {
    switch (trendDirection) {
      case 'up':
        return colors.accent.green;
      case 'down':
        return colors.accent.red;
      default:
        return colors.text.secondary;
    }
  };

  const getTrendIcon = () => {
    switch (trendDirection) {
      case 'up':
        return 'trending-up';
      case 'down':
        return 'trending-down';
      default:
        return 'trending-flat';
    }
  };

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      } else if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`;
      }
      return val.toString();
    }
    return val;
  };

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent style={[styles.container, style]} onPress={onPress}>
      <LinearGradient
        colors={colors.gradient.card}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
              <Icon name={icon} size={24} color={color} />
            </View>
            {trend && (
              <View style={styles.trendContainer}>
                <Icon
                  name={getTrendIcon()}
                  size={16}
                  color={getTrendColor()}
                />
                <Text style={[styles.trendText, { color: getTrendColor() }]}>
                  {trend}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.body}>
            <Text style={styles.value}>{formatValue(value)}</Text>
            <Text style={styles.title}>{title}</Text>
          </View>
        </View>
      </LinearGradient>
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
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
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  body: {
    flex: 1,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },
});
