import SwiftUI

struct AgentConfigurationView: View {
    @Environment(\.colorScheme) var colorScheme
    @Environment(\.dismiss) var dismiss
    @StateObject private var viewModel = AgentConfigurationViewModel()
    @State private var showingActionSheet = false
    @State private var newAction = ""
    
    var body: some View {
        ZStack {
            // Background with dark neon theme
            LinearGradient(
                gradient: Gradient(colors: [
                    Color(TiationColors.backgroundPrimary),
                    Color(TiationColors.backgroundSecondary)
                ]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()
            
            ScrollView {
                VStack(spacing: 20) {
                    // Basic Settings Card
                    VStack(alignment: .leading, spacing: 16) {
                        Text("Basic Settings")
                            .font(.headline)
                            .foregroundColor(Color(TiationColors.primaryText))
                        
                        ConfigurationTextField(title: "Max Concurrent Tasks",
                                             value: Binding(
                                                get: { String(viewModel.configurations["maxConcurrentTasks"] as? Int ?? 1) },
                                                set: { viewModel.configurations["maxConcurrentTasks"] = Int($0) ?? 1 }
                                             ))
                        
                        ConfigurationTextField(title: "Timeout (seconds)",
                                             value: Binding(
                                                get: { String((viewModel.configurations["timeout"] as? Double ?? 5.0)) },
                                                set: { viewModel.configurations["timeout"] = Double($0) ?? 5.0 }
                                             ))
                        
                        ConfigurationTextField(title: "Retry Attempts",
                                             value: Binding(
                                                get: { String(viewModel.configurations["retryAttempts"] as? Int ?? 3) },
                                                set: { viewModel.configurations["retryAttempts"] = Int($0) ?? 3 }
                                             ))
                    }
                    .padding()
                    .background(Color(TiationColors.surface))
                    .cornerRadius(12)
                    
                    // Allowed Actions Card
                    VStack(alignment: .leading, spacing: 16) {
                        Text("Allowed Actions")
                            .font(.headline)
                            .foregroundColor(Color(TiationColors.primaryText))
                        
                        ForEach(viewModel.allowedActions, id: \.self) { action in
                            HStack {
                                Text(action)
                                    .foregroundColor(Color(TiationColors.primaryText))
                                Spacer()
                                Button(action: { viewModel.removeAction(action) }) {
                                    Image(systemName: "trash")
                                        .foregroundColor(Color(TiationColors.error))
                                }
                            }
                            .padding(.vertical, 8)
                            Divider()
                        }
                        
                        Button(action: { showingActionSheet = true }) {
                            HStack {
                                Image(systemName: "plus.circle.fill")
                                Text("Add Action")
                            }
                        }
                        .buttonStyle(.borderedProminent)
                    }
                    .padding()
                    .background(Color(TiationColors.surface))
                    .cornerRadius(12)
                    
                    // Save Button
                    Button(action: {
                        viewModel.saveConfigurations()
                        dismiss()
                    }) {
                        Text("Save Configuration")
                            .frame(maxWidth: .infinity)
                            .padding()
                    }
                    .buttonStyle(.borderedProminent)
                    .padding(.top, 32)
                }
                .padding()
            }
        }
        .sheet(isPresented: $showingActionSheet) {
            AddActionView(isPresented: $showingActionSheet,
                         action: $newAction,
                         onSave: { viewModel.addAction(newAction) })
        }
    }
}

struct ConfigurationTextField: View {
    let title: String
    @Binding var value: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(.subheadline)
                .foregroundColor(Color(TiationColors.secondaryText))
            TextField(title, text: $value)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .keyboardType(.numberPad)
        }
    }
}

struct AddActionView: View {
    @Binding var isPresented: Bool
    @Binding var action: String
    let onSave: () -> Void
    
    var body: some View {
        NavigationView {
            Form {
                TextField("Action Name", text: $action)
            }
            .navigationTitle("Add New Action")
            .navigationBarItems(
                leading: Button("Cancel") { isPresented = false },
                trailing: Button("Save") {
                    onSave()
                    isPresented = false
                }
                .disabled(action.isEmpty)
            )
        }
    }
}

#Preview {
    AgentConfigurationView()
}
