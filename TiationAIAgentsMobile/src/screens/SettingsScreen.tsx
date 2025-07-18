/**
 * Settings Screen - Tiation AI Agents
 * Account management, subscription settings, and enterprise features
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, shadows } from '../theme/colors';

interface UserProfile {
  name: string;
  email: string;
  company: string;
  role: string;
  subscriptionTier: 'starter' | 'professional' | 'enterprise';
  subscriptionStatus: 'active' | 'expired' | 'cancelled';
  billingCycle: 'monthly' | 'annual';
  nextBillingDate: string;
  currentUsage: {
    agents: number;
    maxAgents: number;
    tasks: number;
    storage: number;
    maxStorage: number;
  };
}

export const SettingsScreen: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john.doe@company.com',
    company: 'Enterprise Corp',
    role: 'AI Operations Manager',
    subscriptionTier: 'professional',
    subscriptionStatus: 'active',
    billingCycle: 'monthly',
    nextBillingDate: '2024-02-15',
    currentUsage: {
      agents: 8,
      maxAgents: 10,
      tasks: 1247,
      storage: 35,
      maxStorage: 50,
    },
  });

  const [settings, setSettings] = useState({
    notifications: {
      pushNotifications: true,
      emailAlerts: true,
      slackIntegration: false,
      smsAlerts: false,
      weeklyReports: true,
      systemMaintenance: true,
    },
    security: {
      twoFactorAuth: true,
      biometricLogin: true,
      sessionTimeout: 30,
      auditLogs: true,
    },
    preferences: {
      darkMode: true,
      language: 'English',
      timezone: 'UTC-5',
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',
    },
    privacy: {
      analyticsSharing: true,
      crashReporting: true,
      performanceData: true,
      usageStatistics: false,
    },
  });

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState<UserProfile | null>(null);

  const subscriptionTiers = [
    {
      name: 'Starter',
      price: '$99/month',
      features: ['Up to 3 AI agents', 'Basic monitoring', 'Email support', '5GB storage'],
      color: colors.accent.cyan,
      recommended: false,
    },
    {
      name: 'Professional',
      price: '$299/month',
      features: ['Up to 10 AI agents', 'Advanced analytics', 'Priority support', '50GB storage'],
      color: colors.accent.yellow,
      recommended: true,
    },
    {
      name: 'Enterprise',
      price: '$999/month',
      features: ['Unlimited AI agents', 'White-label solution', '24/7 support', 'Unlimited storage'],
      color: colors.accent.magenta,
      recommended: false,
    },
  ];

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const handleUpgrade = (tier: string) => {
    Alert.alert(
      'Upgrade Subscription',
      `Are you sure you want to upgrade to ${tier}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Upgrade',
          onPress: () => {
            // Handle upgrade logic
            console.log(`Upgrading to ${tier}`);
            setShowUpgradeModal(false);
          },
        },
      ]
    );
  };

  const handleProfileSave = () => {
    if (editingProfile) {
      setUserProfile(editingProfile);
      setShowProfileModal(false);
      setEditingProfile(null);
    }
  };

  const getTierColor = (tier: string) => {
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

  const renderSettingItem = (title: string, subtitle: string, value: boolean, onToggle: () => void, icon: string) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Icon name={icon} size={24} color={colors.accent.cyan} />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.border.primary, true: colors.accent.cyan }}
        thumbColor={value ? colors.text.primary : colors.text.secondary}
      />
    </View>
  );

  const renderSettingSection = (title: string, children: React.ReactNode) => (
    <View style={styles.settingSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <LinearGradient
        colors={colors.gradient.card}
        style={styles.settingCard}
      >
        {children}
      </LinearGradient>
    </View>
  );

  const renderProfileModal = () => (
    <Modal
      visible={showProfileModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowProfileModal(false)}
    >
      <View style={styles.modalOverlay}>
        <LinearGradient
          colors={colors.gradient.card}
          style={styles.profileModal}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={() => setShowProfileModal(false)}>
              <Icon name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={editingProfile?.name || ''}
                onChangeText={(text) => setEditingProfile(prev => ({ ...prev!, name: text }))}
                placeholder="Enter your name"
                placeholderTextColor={colors.text.secondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={editingProfile?.email || ''}
                onChangeText={(text) => setEditingProfile(prev => ({ ...prev!, email: text }))}
                placeholder="Enter your email"
                placeholderTextColor={colors.text.secondary}
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Company</Text>
              <TextInput
                style={styles.input}
                value={editingProfile?.company || ''}
                onChangeText={(text) => setEditingProfile(prev => ({ ...prev!, company: text }))}
                placeholder="Enter your company"
                placeholderTextColor={colors.text.secondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Role</Text>
              <TextInput
                style={styles.input}
                value={editingProfile?.role || ''}
                onChangeText={(text) => setEditingProfile(prev => ({ ...prev!, role: text }))}
                placeholder="Enter your role"
                placeholderTextColor={colors.text.secondary}
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleProfileSave}>
              <LinearGradient
                colors={[colors.accent.cyan, colors.accent.magenta]}
                style={styles.saveButtonGradient}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </LinearGradient>
      </View>
    </Modal>
  );

  const renderUpgradeModal = () => (
    <Modal
      visible={showUpgradeModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowUpgradeModal(false)}
    >
      <View style={styles.modalOverlay}>
        <LinearGradient
          colors={colors.gradient.card}
          style={styles.upgradeModal}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Upgrade Subscription</Text>
            <TouchableOpacity onPress={() => setShowUpgradeModal(false)}>
              <Icon name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {subscriptionTiers.map((tier, index) => (
              <TouchableOpacity
                key={index}
                style={styles.tierCard}
                onPress={() => handleUpgrade(tier.name)}
              >
                <LinearGradient
                  colors={colors.gradient.card}
                  style={[styles.tierCardGradient, { borderColor: tier.color }]}
                >
                  {tier.recommended && (
                    <View style={styles.recommendedBadge}>
                      <Text style={styles.recommendedText}>RECOMMENDED</Text>
                    </View>
                  )}
                  <Text style={[styles.tierName, { color: tier.color }]}>{tier.name}</Text>
                  <Text style={styles.tierPrice}>{tier.price}</Text>
                  <View style={styles.tierFeatures}>
                    {tier.features.map((feature, idx) => (
                      <View key={idx} style={styles.featureRow}>
                        <Icon name="check" size={16} color={colors.accent.green} />
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
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
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Manage your account and preferences</Text>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <LinearGradient
            colors={colors.gradient.card}
            style={styles.profileCard}
          >
            <View style={styles.profileHeader}>
              <View style={styles.profileAvatar}>
                <Icon name="person" size={32} color={colors.text.primary} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{userProfile.name}</Text>
                <Text style={styles.profileEmail}>{userProfile.email}</Text>
                <Text style={styles.profileCompany}>{userProfile.company}</Text>
                <View style={styles.subscriptionBadge}>
                  <Text style={[styles.subscriptionText, { color: getTierColor(userProfile.subscriptionTier) }]}>
                    {userProfile.subscriptionTier.toUpperCase()}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  setEditingProfile(userProfile);
                  setShowProfileModal(true);
                }}
              >
                <Icon name="edit" size={20} color={colors.accent.cyan} />
              </TouchableOpacity>
            </View>

            <View style={styles.usageSection}>
              <Text style={styles.usageTitle}>Current Usage</Text>
              <View style={styles.usageGrid}>
                <View style={styles.usageItem}>
                  <Text style={styles.usageLabel}>Agents</Text>
                  <Text style={styles.usageValue}>
                    {userProfile.currentUsage.agents}/{userProfile.currentUsage.maxAgents}
                  </Text>
                </View>
                <View style={styles.usageItem}>
                  <Text style={styles.usageLabel}>Tasks</Text>
                  <Text style={styles.usageValue}>{userProfile.currentUsage.tasks}</Text>
                </View>
                <View style={styles.usageItem}>
                  <Text style={styles.usageLabel}>Storage</Text>
                  <Text style={styles.usageValue}>
                    {userProfile.currentUsage.storage}GB/{userProfile.currentUsage.maxStorage}GB
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={() => setShowUpgradeModal(true)}
            >
              <LinearGradient
                colors={[colors.accent.cyan, colors.accent.magenta]}
                style={styles.upgradeButtonGradient}
              >
                <Icon name="upgrade" size={20} color={colors.text.primary} />
                <Text style={styles.upgradeButtonText}>Upgrade Plan</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Notifications */}
        {renderSettingSection('Notifications', (
          <>
            {renderSettingItem(
              'Push Notifications',
              'Receive push notifications for important updates',
              settings.notifications.pushNotifications,
              () => handleSettingChange('notifications', 'pushNotifications', !settings.notifications.pushNotifications),
              'notifications'
            )}
            {renderSettingItem(
              'Email Alerts',
              'Get email notifications for system events',
              settings.notifications.emailAlerts,
              () => handleSettingChange('notifications', 'emailAlerts', !settings.notifications.emailAlerts),
              'email'
            )}
            {renderSettingItem(
              'Weekly Reports',
              'Receive weekly performance reports',
              settings.notifications.weeklyReports,
              () => handleSettingChange('notifications', 'weeklyReports', !settings.notifications.weeklyReports),
              'assessment'
            )}
          </>
        ))}

        {/* Security */}
        {renderSettingSection('Security', (
          <>
            {renderSettingItem(
              'Two-Factor Authentication',
              'Add an extra layer of security to your account',
              settings.security.twoFactorAuth,
              () => handleSettingChange('security', 'twoFactorAuth', !settings.security.twoFactorAuth),
              'security'
            )}
            {renderSettingItem(
              'Biometric Login',
              'Use fingerprint or face recognition to login',
              settings.security.biometricLogin,
              () => handleSettingChange('security', 'biometricLogin', !settings.security.biometricLogin),
              'fingerprint'
            )}
            {renderSettingItem(
              'Audit Logs',
              'Keep detailed logs of all account activities',
              settings.security.auditLogs,
              () => handleSettingChange('security', 'auditLogs', !settings.security.auditLogs),
              'history'
            )}
          </>
        ))}

        {/* Preferences */}
        {renderSettingSection('Preferences', (
          <>
            {renderSettingItem(
              'Dark Mode',
              'Use dark theme across the application',
              settings.preferences.darkMode,
              () => handleSettingChange('preferences', 'darkMode', !settings.preferences.darkMode),
              'brightness-6'
            )}
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Icon name="language" size={24} color={colors.accent.cyan} />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Language</Text>
                  <Text style={styles.settingSubtitle}>Choose your preferred language</Text>
                </View>
              </View>
              <Text style={styles.settingValue}>{settings.preferences.language}</Text>
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Icon name="access-time" size={24} color={colors.accent.cyan} />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Timezone</Text>
                  <Text style={styles.settingSubtitle}>Set your local timezone</Text>
                </View>
              </View>
              <Text style={styles.settingValue}>{settings.preferences.timezone}</Text>
            </View>
          </>
        ))}

        {/* Privacy */}
        {renderSettingSection('Privacy', (
          <>
            {renderSettingItem(
              'Analytics Sharing',
              'Share anonymous usage data to improve the app',
              settings.privacy.analyticsSharing,
              () => handleSettingChange('privacy', 'analyticsSharing', !settings.privacy.analyticsSharing),
              'analytics'
            )}
            {renderSettingItem(
              'Crash Reporting',
              'Automatically send crash reports to help us fix issues',
              settings.privacy.crashReporting,
              () => handleSettingChange('privacy', 'crashReporting', !settings.privacy.crashReporting),
              'bug-report'
            )}
          </>
        ))}

        {/* Support */}
        {renderSettingSection('Support', (
          <View style={styles.supportSection}>
            <TouchableOpacity style={styles.supportItem}>
              <Icon name="help" size={24} color={colors.accent.cyan} />
              <Text style={styles.supportText}>Help Center</Text>
              <Icon name="chevron-right" size={20} color={colors.text.secondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.supportItem}>
              <Icon name="chat" size={24} color={colors.accent.cyan} />
              <Text style={styles.supportText}>Contact Support</Text>
              <Icon name="chevron-right" size={20} color={colors.text.secondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.supportItem}>
              <Icon name="feedback" size={24} color={colors.accent.cyan} />
              <Text style={styles.supportText}>Send Feedback</Text>
              <Icon name="chevron-right" size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>
        ))}

        {/* About */}
        <View style={styles.aboutSection}>
          <LinearGradient
            colors={colors.gradient.card}
            style={styles.aboutCard}
          >
            <Text style={styles.aboutTitle}>Tiation AI Agents</Text>
            <Text style={styles.aboutVersion}>Version 1.0.0</Text>
            <Text style={styles.aboutDescription}>
              Enterprise AI Automation Platform - Streamline your business processes with intelligent agents
            </Text>
            <View style={styles.aboutLinks}>
              <TouchableOpacity style={styles.aboutLink}>
                <Text style={styles.aboutLinkText}>Privacy Policy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.aboutLink}>
                <Text style={styles.aboutLinkText}>Terms of Service</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.aboutLink}>
                <Text style={styles.aboutLinkText}>Open Source Licenses</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton}>
          <LinearGradient
            colors={[colors.accent.red, colors.accent.magenta]}
            style={styles.logoutButtonGradient}
          >
            <Icon name="logout" size={20} color={colors.text.primary} />
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {renderProfileModal()}
      {renderUpgradeModal()}
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
  profileSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  profileCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border.primary,
    ...shadows.neon,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: colors.accent.cyan,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  profileCompany: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  subscriptionBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  subscriptionText: {
    fontSize: 10,
    fontWeight: '600',
  },
  editButton: {
    padding: 8,
  },
  usageSection: {
    marginBottom: 20,
  },
  usageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  usageGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  usageItem: {
    alignItems: 'center',
    flex: 1,
  },
  usageLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  usageValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  upgradeButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  upgradeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  upgradeButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  settingSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  settingCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border.primary,
    ...shadows.neon,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  settingValue: {
    fontSize: 14,
    color: colors.accent.cyan,
    fontWeight: '500',
  },
  supportSection: {
    paddingVertical: 0,
  },
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  supportText: {
    fontSize: 16,
    color: colors.text.primary,
    marginLeft: 12,
    flex: 1,
  },
  aboutSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  aboutCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border.primary,
    ...shadows.neon,
    alignItems: 'center',
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  aboutVersion: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 12,
  },
  aboutDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  aboutLinks: {
    alignItems: 'center',
  },
  aboutLink: {
    marginBottom: 8,
  },
  aboutLinkText: {
    fontSize: 14,
    color: colors.accent.cyan,
    fontWeight: '500',
  },
  logoutButton: {
    marginHorizontal: 20,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  logoutButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  logoutButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileModal: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  upgradeModal: {
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
  modalContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background.secondary,
    borderColor: colors.border.primary,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.text.primary,
    fontSize: 16,
  },
  saveButton: {
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 20,
  },
  saveButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  tierCard: {
    marginBottom: 16,
  },
  tierCardGradient: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    position: 'relative',
  },
  recommendedBadge: {
    position: 'absolute',
    top: -8,
    right: 20,
    backgroundColor: colors.accent.green,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.text.primary,
  },
  tierName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  tierPrice: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  tierFeatures: {
    marginTop: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: colors.text.primary,
    marginLeft: 8,
  },
  bottomPadding: {
    height: 100,
  },
});
