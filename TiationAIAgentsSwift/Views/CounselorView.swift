import SwiftUI

// MARK: - Main Counselor View
struct CounselorView: View {
    @StateObject private var viewModel = CounselorViewModel()
    @State private var messageText = ""
    @State private var showingExerciseSheet = false
    @State private var selectedExercise: CBTExercise?
    @State private var showingMoodTracker = false
    
    var body: some View {
        NavigationView {
            ZStack {
                TiationColors.gradientBackground
                    .ignoresSafeArea()
                
                VStack(spacing: 0) {
                    // Header with mood tracking
                    counselorHeader
                    
                    // Chat messages
                    ScrollViewReader { proxy in
                        ScrollView {
                            LazyVStack(spacing: 16) {
                                ForEach(viewModel.messages) { message in
                                    MessageBubble(message: message)
                                }
                            }
                            .padding()
                        }
                        .onChange(of: viewModel.messages.count) { _ in
                            withAnimation {
                                proxy.scrollTo(viewModel.messages.last?.id, anchor: .bottom)
                            }
                        }
                    }
                    
                    // Exercise suggestions
                    if !viewModel.suggestedExercises.isEmpty {
                        exerciseSuggestions
                    }
                    
                    // Input area
                    messageInputArea
                }
            }
            .navigationBarHidden(true)
            .sheet(isPresented: $showingExerciseSheet) {
                if let exercise = selectedExercise {
                    CBTExerciseSheet(exercise: exercise, completion: viewModel.completeExercise)
                }
            }
            .sheet(isPresented: $showingMoodTracker) {
                MoodTrackerSheet(currentMood: viewModel.currentMood) { mood in
                    viewModel.updateMood(mood)
                }
            }
        }
    }
    
    // MARK: - UI Components
    
    private var counselorHeader: some View {
        VStack(spacing: 8) {
            HStack {
                Text("🧘‍♀️ AI Counselor")
                    .font(.title)
                    .fontWeight(.bold)
                    .foregroundColor(TiationColors.textPrimary)
                
                Spacer()
                
                Button(action: { showingMoodTracker = true }) {
                    MoodIndicator(mood: viewModel.currentMood)
                }
            }
            .padding(.horizontal)
            
            Text("Safe space for reflection and growth")
                .font(.subheadline)
                .foregroundColor(TiationColors.textSecondary)
                .padding(.bottom)
        }
        .padding(.top)
        .background(
            TiationColors.gradientCard
                .overlay(
                    Rectangle()
                        .fill(LinearGradient(
                            colors: [TiationColors.primaryCyan.opacity(0.2), TiationColors.primaryMagenta.opacity(0.2)],
                            startPoint: .leading,
                            endPoint: .trailing
                        ))
                )
        )
    }
    
    private var exerciseSuggestions: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                ForEach(viewModel.suggestedExercises) { exercise in
                    ExerciseCard(exercise: exercise)
                        .onTapGesture {
                            selectedExercise = exercise
                            showingExerciseSheet = true
                        }
                }
            }
            .padding()
        }
        .background(TiationColors.backgroundCard)
    }
    
    private var messageInputArea: some View {
        VStack(spacing: 0) {
            Divider()
                .background(TiationColors.borderTertiary)
            
            HStack(spacing: 12) {
                TextField("Share your thoughts...", text: $messageText)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .foregroundColor(TiationColors.textPrimary)
                    .accentColor(TiationColors.primaryCyan)
                    .padding(.vertical, 8)
                
                Button(action: sendMessage) {
                    Image(systemName: "arrow.up.circle.fill")
                        .font(.title2)
                        .foregroundColor(messageText.isEmpty ? TiationColors.textSecondary : TiationColors.primaryCyan)
                }
            }
            .padding()
            .background(TiationColors.backgroundCard)
        }
    }
    
    // MARK: - Actions
    
    private func sendMessage() {
        guard !messageText.isEmpty else { return }
        viewModel.sendMessage(messageText)
        messageText = ""
    }
}

// MARK: - Message Types and Models
struct Message: Identifiable {
    let id = UUID()
    let text: String
    let isUser: Bool
    let timestamp = Date()
    var sentiment: MessageSentiment = .neutral
}

enum MessageSentiment {
    case positive, negative, neutral
    
    var color: Color {
        switch self {
        case .positive:
            return TiationColors.accentGreen
        case .negative:
            return TiationColors.accentRed
        case .neutral:
            return TiationColors.textSecondary
        }
    }
}

// MARK: - Message Bubble Component
struct MessageBubble: View {
    let message: Message
    
    var body: some View {
        HStack {
            if message.isUser {
                Spacer()
            }
            
            VStack(alignment: message.isUser ? .trailing : .leading, spacing: 4) {
                Text(message.text)
                    .padding(12)
                    .background(
                        RoundedRectangle(cornerRadius: 16)
                            .fill(message.isUser ? TiationColors.primaryCyan.opacity(0.2) : TiationColors.backgroundCard)
                    )
                    .foregroundColor(TiationColors.textPrimary)
                
                Text(formatTimestamp(message.timestamp))
                    .font(.caption2)
                    .foregroundColor(TiationColors.textSecondary)
            }
            
            if !message.isUser {
                Spacer()
            }
        }
    }
    
    private func formatTimestamp(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.timeStyle = .short
        return formatter.string(from: date)
    }
}

// MARK: - CBT Exercise Types
struct CBTExercise: Identifiable {
    let id = UUID()
    let title: String
    let description: String
    let type: ExerciseType
    var steps: [String]
    var userResponses: [String] = []
}

enum ExerciseType {
    case thoughtRecord
    case behavioralActivation
    case gratitudeJournal
    case mindfulness
    case emotionalAwareness
    
    var icon: String {
        switch self {
        case .thoughtRecord:
            return "doc.text"
        case .behavioralActivation:
            return "figure.walk"
        case .gratitudeJournal:
            return "heart"
        case .mindfulness:
            return "leaf"
        case .emotionalAwareness:
            return "brain.head.profile"
        }
    }
    
    var color: Color {
        switch self {
        case .thoughtRecord:
            return TiationColors.primaryCyan
        case .behavioralActivation:
            return TiationColors.accentGreen
        case .gratitudeJournal:
            return TiationColors.primaryMagenta
        case .mindfulness:
            return TiationColors.accentYellow
        case .emotionalAwareness:
            return TiationColors.chartSecondary
        }
    }
}

// MARK: - Exercise Card Component
struct ExerciseCard: View {
    let exercise: CBTExercise
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: exercise.type.icon)
                    .font(.title3)
                    .foregroundColor(exercise.type.color)
                
                Text(exercise.title)
                    .font(.headline)
                    .foregroundColor(TiationColors.textPrimary)
            }
            
            Text(exercise.description)
                .font(.caption)
                .foregroundColor(TiationColors.textSecondary)
                .lineLimit(2)
        }
        .padding()
        .frame(width: 200)
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(TiationColors.gradientCard)
                .overlay(
                    RoundedRectangle(cornerRadius: 16)
                        .stroke(exercise.type.color.opacity(0.3), lineWidth: 1)
                )
        )
        .tiationNeonShadow(color: exercise.type.color)
    }
}

// MARK: - Mood Tracking
enum Mood: String, CaseIterable {
    case great = "😊"
    case good = "🙂"
    case neutral = "😐"
    case sad = "😢"
    case anxious = "😰"
    
    var description: String {
        switch self {
        case .great:
            return "Great"
        case .good:
            return "Good"
        case .neutral:
            return "Neutral"
        case .sad:
            return "Sad"
        case .anxious:
            return "Anxious"
        }
    }
    
    var color: Color {
        switch self {
        case .great:
            return TiationColors.accentGreen
        case .good:
            return TiationColors.primaryCyan
        case .neutral:
            return TiationColors.textSecondary
        case .sad:
            return TiationColors.accentYellow
        case .anxious:
            return TiationColors.accentRed
        }
    }
}

struct MoodIndicator: View {
    let mood: Mood
    
    var body: some View {
        HStack(spacing: 4) {
            Text(mood.rawValue)
                .font(.title3)
            Text(mood.description)
                .font(.caption)
                .foregroundColor(TiationColors.textSecondary)
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 6)
        .background(
            Capsule()
                .fill(mood.color.opacity(0.2))
                .overlay(
                    Capsule()
                        .stroke(mood.color.opacity(0.3), lineWidth: 1)
                )
        )
    }
}

// MARK: - Exercise Sheet
struct CBTExerciseSheet: View {
    let exercise: CBTExercise
    let completion: (CBTExercise) -> Void
    @Environment(\.presentationMode) var presentationMode
    @State private var responses: [String]
    
    init(exercise: CBTExercise, completion: @escaping (CBTExercise) -> Void) {
        self.exercise = exercise
        self.completion = completion
        _responses = State(initialValue: Array(repeating: "", count: exercise.steps.count))
    }
    
    var body: some View {
        NavigationView {
            ZStack {
                TiationColors.gradientBackground
                    .ignoresSafeArea()
                
                ScrollView {
                    VStack(alignment: .leading, spacing: 20) {
                        ForEach(Array(exercise.steps.enumerated()), id: \.offset) { index, step in
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Step \(index + 1)")
                                    .font(.headline)
                                    .foregroundColor(exercise.type.color)
                                
                                Text(step)
                                    .font(.body)
                                    .foregroundColor(TiationColors.textPrimary)
                                
                                TextEditor(text: $responses[index])
                                    .frame(height: 100)
                                    .padding(8)
                                    .background(TiationColors.backgroundCard)
                                    .cornerRadius(8)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 8)
                                            .stroke(TiationColors.borderTertiary, lineWidth: 1)
                                    )
                            }
                        }
                        
                        Button(action: completeExercise) {
                            Text("Complete Exercise")
                                .font(.headline)
                                .foregroundColor(TiationColors.backgroundPrimary)
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(exercise.type.color)
                                .cornerRadius(12)
                                .tiationNeonShadow(color: exercise.type.color)
                        }
                        .padding(.top)
                    }
                    .padding()
                }
            }
            .navigationTitle(exercise.title)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Close") {
                        presentationMode.wrappedValue.dismiss()
                    }
                }
            }
        }
    }
    
    private func completeExercise() {
        var updatedExercise = exercise
        updatedExercise.userResponses = responses
        completion(updatedExercise)
        presentationMode.wrappedValue.dismiss()
    }
}

// MARK: - Mood Tracker Sheet
struct MoodTrackerSheet: View {
    let currentMood: Mood
    let completion: (Mood) -> Void
    @Environment(\.presentationMode) var presentationMode
    
    var body: some View {
        NavigationView {
            ZStack {
                TiationColors.gradientBackground
                    .ignoresSafeArea()
                
                VStack(spacing: 20) {
                    Text("How are you feeling?")
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(TiationColors.textPrimary)
                    
                    LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 16) {
                        ForEach(Mood.allCases, id: \.self) { mood in
                            Button(action: { selectMood(mood) }) {
                                VStack(spacing: 8) {
                                    Text(mood.rawValue)
                                        .font(.system(size: 40))
                                    
                                    Text(mood.description)
                                        .font(.headline)
                                        .foregroundColor(TiationColors.textPrimary)
                                }
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(
                                    RoundedRectangle(cornerRadius: 16)
                                        .fill(mood == currentMood ? mood.color.opacity(0.3) : TiationColors.backgroundCard)
                                        .overlay(
                                            RoundedRectangle(cornerRadius: 16)
                                                .stroke(mood.color.opacity(0.3), lineWidth: 1)
                                        )
                                )
                                .tiationNeonShadow(color: mood.color)
                            }
                        }
                    }
                    .padding()
                }
            }
            .navigationTitle("Mood Tracker")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Close") {
                        presentationMode.wrappedValue.dismiss()
                    }
                }
            }
        }
    }
    
    private func selectMood(_ mood: Mood) {
        completion(mood)
        presentationMode.wrappedValue.dismiss()
    }
}

// MARK: - View Model
class CounselorViewModel: ObservableObject {
    @Published var messages: [Message] = []
    @Published var suggestedExercises: [CBTExercise] = []
    @Published var currentMood: Mood = .neutral
    
    private let welcomeMessage = "Hello! I'm your AI counselor, here to support you on your journey. How are you feeling today?"
    
    init() {
        // Add welcome message
        messages.append(Message(text: welcomeMessage, isUser: false))
        
        // Add initial exercises
        suggestedExercises = [
            CBTExercise(
                title: "Thought Record",
                description: "Identify and challenge negative thought patterns",
                type: .thoughtRecord,
                steps: [
                    "What's the situation?",
                    "What are your thoughts?",
                    "What emotions do you feel?",
                    "What evidence supports these thoughts?",
                    "What evidence challenges these thoughts?",
                    "What's a more balanced perspective?"
                ]
            ),
            CBTExercise(
                title: "Gratitude Journal",
                description: "Focus on positive aspects of your life",
                type: .gratitudeJournal,
                steps: [
                    "List three things you're grateful for today",
                    "Why do these things matter to you?",
                    "How do they make you feel?"
                ]
            ),
            CBTExercise(
                title: "Mindful Moment",
                description: "Practice present-moment awareness",
                type: .mindfulness,
                steps: [
                    "Find a quiet space",
                    "Focus on your breath",
                    "Notice your thoughts without judgment",
                    "How do you feel now?"
                ]
            )
        ]
    }
    
    func sendMessage(_ text: String) {
        // Add user message
        let userMessage = Message(text: text, isUser: true)
        messages.append(userMessage)
        
        // Process message and generate response
        processMessage(text)
    }
    
    private func processMessage(_ text: String) {
        // Simple response generation based on keywords
        // In a real app, this would use more sophisticated NLP and AI
        let lowercased = text.lowercased()
        
        let response: String
        if lowercased.contains("anxious") || lowercased.contains("anxiety") {
            response = "I hear that you're feeling anxious. Let's try a mindfulness exercise to help ground you. Would you like to try that?"
            suggestExercise(type: .mindfulness)
        } else if lowercased.contains("sad") || lowercased.contains("depressed") {
            response = "I'm sorry you're feeling down. Sometimes focusing on gratitude can help shift our perspective. Would you like to try a gratitude exercise?"
            suggestExercise(type: .gratitudeJournal)
        } else if lowercased.contains("negative") || lowercased.contains("thoughts") {
            response = "It sounds like you're dealing with some challenging thoughts. Would you like to work through them using a thought record?"
            suggestExercise(type: .thoughtRecord)
        } else {
            response = "Thank you for sharing. Could you tell me more about how that makes you feel?"
        }
        
        // Add AI response with slight delay for natural feel
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            self.messages.append(Message(text: response, isUser: false))
        }
    }
    
    private func suggestExercise(type: ExerciseType) {
        if let exercise = suggestedExercises.first(where: { $0.type == type }) {
            // Move the exercise to the front of the list
            suggestedExercises.removeAll { $0.type == type }
            suggestedExercises.insert(exercise, at: 0)
        }
    }
    
    func completeExercise(_ exercise: CBTExercise) {
        let response: String
        switch exercise.type {
        case .thoughtRecord:
            response = "Great work on challenging those thoughts! Remember, our thoughts aren't always facts, and it's helpful to look at situations from multiple perspectives."
        case .gratitudeJournal:
            response = "Wonderful job on practicing gratitude! Focusing on the positive aspects of our lives can help build resilience and improve our mood."
        case .mindfulness:
            response = "Excellent mindfulness practice! Taking time to be present can help reduce stress and anxiety. How do you feel after this exercise?"
        case .behavioralActivation:
            response = "Well done on taking action! Engaging in activities, even when we don't feel like it, can help improve our mood."
        case .emotionalAwareness:
            response = "Great job on increasing your emotional awareness! Understanding our emotions is the first step to managing them effectively."
        }
        
        messages.append(Message(text: response, isUser: false))
    }
    
    func updateMood(_ mood: Mood) {
        currentMood = mood
        
        let response: String
        switch mood {
        case .great:
            response = "I'm so glad you're feeling great! What's contributed to your positive mood today?"
        case .good:
            response = "That's good to hear! Would you like to explore what's going well for you?"
        case .neutral:
            response = "Sometimes a neutral mood can be a good time for reflection. Would you like to try a mindfulness exercise?"
        case .sad:
            response = "I'm sorry you're feeling sad. Would you like to talk about what's troubling you? We could also try some exercises that might help lift your mood."
        case .anxious:
            response = "I understand anxiety can be challenging. Would you like to try some calming exercises or talk about what's causing your anxiety?"
        }
        
        messages.append(Message(text: response, isUser: false))
    }
}

#Preview {
    CounselorView()
}
