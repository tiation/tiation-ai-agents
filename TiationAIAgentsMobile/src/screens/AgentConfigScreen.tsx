import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, TextInput, Switch, Button, Divider, Portal, Dialog } from 'react-native-paper';
import { theme } from '../styles/theme';
import { AgentConfiguration } from '../types/Agent';
import LinearGradient from 'react-native-linear-gradient';

interface AgentConfigScreenProps {
  initialConfig?: AgentConfiguration;
  onSave?: (config: AgentConfiguration) => void;
}

const AgentConfigScreen: React.FC<AgentConfigScreenProps> = ({ initialConfig, onSave }) => {
  const [config, setConfig] = useState<AgentConfiguration>(initialConfig || {
    maxConcurrentTasks: 1,
    timeout: 5000,
    retryAttempts: 3,
    allowedActions: [],
  });

  const [showActionDialog, setShowActionDialog] = useState(false);
  const [newAction, setNewAction] = useState('');

  const handleSave = () => {
    onSave?.(config);
  };

  const addAction = () => {
    if (newAction.trim()) {
      setConfig(prev => ({
        ...prev,
        allowedActions: [...prev.allowedActions, newAction.trim()]
      }));
      setNewAction('');
      setShowActionDialog(false);
    }
  };

  const removeAction = (action: string) => {
    setConfig(prev => ({
      ...prev,
      allowedActions: prev.allowedActions.filter(a => a !== action)
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.backgroundVariant]}
        style={styles.gradientBackground}
      >
        <Card style={styles.card}>
          <Card.Title title="Basic Settings" />
          <Card.Content>
            <TextInput
              label="Max Concurrent Tasks"
              value={String(config.maxConcurrentTasks)}
              onChangeText={(value) => setConfig(prev => ({ ...prev, maxConcurrentTasks: parseInt(value) || 1 }))}
              keyboardType="numeric"
              style={styles.input}
            />
            
            <TextInput
              label="Timeout (seconds)"
              value={String(config.timeout / 1000)}
              onChangeText={(value) => setConfig(prev => ({ ...prev, timeout: (parseInt(value) || 5) * 1000 }))}
              keyboardType="numeric"
              style={styles.input}
            />
            
            <TextInput
              label="Retry Attempts"
              value={String(config.retryAttempts)}
              onChangeText={(value) => setConfig(prev => ({ ...prev, retryAttempts: parseInt(value) || 3 }))}
              keyboardType="numeric"
              style={styles.input}
            />
          </Card.Content>
        </Card>

        <Card style={[styles.card, styles.actionsCard]}>
          <Card.Title title="Allowed Actions" />
          <Card.Content>
            {config.allowedActions.map((action, index) => (
              <View key={index} style={styles.actionItem}>
                <Text>{action}</Text>
                <Button
                  icon="close"
                  mode="text"
                  onPress={() => removeAction(action)}
                  textColor={theme.colors.error}
                >
                  Remove
                </Button>
              </View>
            ))}
            <Button
              icon="plus"
              mode="outlined"
              onPress={() => setShowActionDialog(true)}
              style={styles.addButton}
            >
              Add Action
            </Button>
          </Card.Content>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.saveButton}
          >
            Save Configuration
          </Button>
        </View>

        <Portal>
          <Dialog visible={showActionDialog} onDismiss={() => setShowActionDialog(false)}>
            <Dialog.Title>Add New Action</Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Action Name"
                value={newAction}
                onChangeText={setNewAction}
                style={styles.dialogInput}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShowActionDialog(false)}>Cancel</Button>
              <Button onPress={addAction}>Add</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
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
  card: {
    marginBottom: 16,
    backgroundColor: theme.colors.surface,
  },
  input: {
    marginBottom: 16,
    backgroundColor: theme.colors.surface,
  },
  actionsCard: {
    marginTop: 8,
  },
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.backdrop,
  },
  addButton: {
    marginTop: 16,
  },
  buttonContainer: {
    marginTop: 24,
  },
  saveButton: {
    padding: 8,
  },
  dialogInput: {
    backgroundColor: theme.colors.surface,
  },
});

export default AgentConfigScreen;

export default AgentConfigScreen;
