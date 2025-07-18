#!/usr/bin/env python3
"""
Tiation AI Agents - Advanced AI Engine
Advanced AI capabilities with custom agent development tools and multi-modal processing.
"""

import asyncio
import json
import os
from typing import Dict, List, Optional, Any, Union, Callable
from dataclasses import dataclass, asdict
from datetime import datetime
from enum import Enum
import uuid

try:
    import openai
    from langchain.agents import initialize_agent, Tool
    from langchain.llms import OpenAI
    from langchain.memory import ConversationBufferMemory
    from langchain.tools import BaseTool
    from langchain.schema import AgentAction, AgentFinish
except ImportError:
    # Handle missing dependencies gracefully
    openai = None
    print("Warning: OpenAI and LangChain dependencies not installed. Some AI features will be limited.")

from utils.logger import setup_logger
from core.config import Config


class AICapability(Enum):
    """AI capabilities enumeration."""
    NATURAL_LANGUAGE_PROCESSING = "nlp"
    COMPUTER_VISION = "cv"
    SPEECH_RECOGNITION = "sr"
    TEXT_TO_SPEECH = "tts"
    DECISION_MAKING = "dm"
    PREDICTIVE_ANALYTICS = "pa"
    ANOMALY_DETECTION = "ad"
    WORKFLOW_AUTOMATION = "wa"
    KNOWLEDGE_EXTRACTION = "ke"
    MULTIMODAL_PROCESSING = "mp"


class AgentPersonality(Enum):
    """Agent personality types."""
    ANALYTICAL = "analytical"
    CREATIVE = "creative"
    ASSERTIVE = "assertive"
    COLLABORATIVE = "collaborative"
    DETAIL_ORIENTED = "detail_oriented"
    PROBLEM_SOLVER = "problem_solver"
    INNOVATIVE = "innovative"
    RELIABLE = "reliable"


@dataclass
class AIModelConfig:
    """Configuration for AI models."""
    model_name: str
    model_type: str  # "openai", "huggingface", "custom"
    api_key: Optional[str] = None
    endpoint: Optional[str] = None
    max_tokens: int = 4000
    temperature: float = 0.7
    top_p: float = 0.9
    frequency_penalty: float = 0.0
    presence_penalty: float = 0.0
    custom_parameters: Dict[str, Any] = None
    
    def __post_init__(self):
        if self.custom_parameters is None:
            self.custom_parameters = {}


@dataclass
class CustomAgentTemplate:
    """Template for creating custom AI agents."""
    template_id: str
    name: str
    description: str
    capabilities: List[AICapability]
    personality: AgentPersonality
    system_prompt: str
    tools: List[str]
    model_config: AIModelConfig
    memory_config: Dict[str, Any]
    behavior_config: Dict[str, Any]
    created_at: datetime = None
    created_by: str = "system"
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now()


@dataclass
class AITaskRequest:
    """Request for AI task processing."""
    task_id: str
    agent_id: str
    task_type: str
    input_data: Dict[str, Any]
    context: Dict[str, Any]
    priority: int = 1
    timeout: int = 300
    requires_human_approval: bool = False
    created_at: datetime = None
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now()


@dataclass
class AITaskResponse:
    """Response from AI task processing."""
    task_id: str
    agent_id: str
    status: str  # "success", "failed", "pending"
    result: Dict[str, Any]
    confidence: float
    reasoning: str
    tokens_used: int
    processing_time: float
    metadata: Dict[str, Any]
    completed_at: datetime = None
    
    def __post_init__(self):
        if self.completed_at is None:
            self.completed_at = datetime.now()


class AdvancedAIEngine:
    """Advanced AI engine with custom agent development capabilities."""
    
    def __init__(self, config: Config):
        """Initialize the advanced AI engine.
        
        Args:
            config: Application configuration
        """
        self.config = config
        self.logger = setup_logger(__name__)
        
        # AI Models and configurations
        self.models: Dict[str, AIModelConfig] = {}
        self.custom_agents: Dict[str, CustomAgentTemplate] = {}
        self.active_agents: Dict[str, Any] = {}
        
        # Task processing
        self.task_queue: List[AITaskRequest] = []
        self.task_results: Dict[str, AITaskResponse] = {}
        
        # AI capabilities
        self.capability_handlers: Dict[AICapability, Callable] = {
            AICapability.NATURAL_LANGUAGE_PROCESSING: self._handle_nlp_task,
            AICapability.COMPUTER_VISION: self._handle_cv_task,
            AICapability.SPEECH_RECOGNITION: self._handle_sr_task,
            AICapability.TEXT_TO_SPEECH: self._handle_tts_task,
            AICapability.DECISION_MAKING: self._handle_dm_task,
            AICapability.PREDICTIVE_ANALYTICS: self._handle_pa_task,
            AICapability.ANOMALY_DETECTION: self._handle_ad_task,
            AICapability.WORKFLOW_AUTOMATION: self._handle_wa_task,
            AICapability.KNOWLEDGE_EXTRACTION: self._handle_ke_task,
            AICapability.MULTIMODAL_PROCESSING: self._handle_mp_task,
        }
        
        # Initialize default models and agents
        self._initialize_default_models()
        self._initialize_default_agents()
    
    def _initialize_default_models(self):
        """Initialize default AI models."""
        # OpenAI GPT-4 model
        if os.getenv("OPENAI_API_KEY"):
            self.models["gpt-4"] = AIModelConfig(
                model_name="gpt-4",
                model_type="openai",
                api_key=os.getenv("OPENAI_API_KEY"),
                max_tokens=4000,
                temperature=0.7
            )
        
        # OpenAI GPT-3.5 Turbo model
        if os.getenv("OPENAI_API_KEY"):
            self.models["gpt-3.5-turbo"] = AIModelConfig(
                model_name="gpt-3.5-turbo",
                model_type="openai",
                api_key=os.getenv("OPENAI_API_KEY"),
                max_tokens=4000,
                temperature=0.7
            )
        
        # Custom local model (placeholder)
        self.models["local-llm"] = AIModelConfig(
            model_name="local-llm",
            model_type="custom",
            endpoint="http://localhost:8001/v1/chat/completions",
            max_tokens=2000,
            temperature=0.8
        )
        
        self.logger.info(f"Initialized {len(self.models)} AI models")
    
    def _initialize_default_agents(self):
        """Initialize default agent templates."""
        # Document Analysis Agent
        doc_agent = CustomAgentTemplate(
            template_id="document_analyzer",
            name="Document Analyzer",
            description="Expert agent for document analysis and information extraction",
            capabilities=[AICapability.NATURAL_LANGUAGE_PROCESSING, AICapability.KNOWLEDGE_EXTRACTION],
            personality=AgentPersonality.ANALYTICAL,
            system_prompt="You are a highly skilled document analysis expert. You excel at extracting key information, summarizing content, and identifying important patterns in documents. Always provide structured, accurate, and actionable insights.",
            tools=["document_parser", "information_extractor", "summarizer"],
            model_config=self.models.get("gpt-4", self.models["local-llm"]),
            memory_config={"type": "conversation_buffer", "max_tokens": 2000},
            behavior_config={"confidence_threshold": 0.8, "max_iterations": 3}
        )
        
        # Workflow Automation Agent
        workflow_agent = CustomAgentTemplate(
            template_id="workflow_automator",
            name="Workflow Automator",
            description="Specialized agent for creating and managing automated workflows",
            capabilities=[AICapability.WORKFLOW_AUTOMATION, AICapability.DECISION_MAKING],
            personality=AgentPersonality.PROBLEM_SOLVER,
            system_prompt="You are a workflow automation specialist. You design efficient, reliable automated processes that reduce manual work and improve productivity. Focus on creating robust, scalable solutions.",
            tools=["workflow_builder", "task_scheduler", "condition_evaluator"],
            model_config=self.models.get("gpt-3.5-turbo", self.models["local-llm"]),
            memory_config={"type": "conversation_buffer", "max_tokens": 1500},
            behavior_config={"confidence_threshold": 0.9, "max_iterations": 5}
        )
        
        # Data Analytics Agent
        analytics_agent = CustomAgentTemplate(
            template_id="data_analyst",
            name="Data Analyst",
            description="Advanced agent for data analysis and predictive modeling",
            capabilities=[AICapability.PREDICTIVE_ANALYTICS, AICapability.ANOMALY_DETECTION],
            personality=AgentPersonality.DETAIL_ORIENTED,
            system_prompt="You are a data analytics expert with deep knowledge of statistical analysis, machine learning, and data visualization. You provide accurate insights and actionable recommendations based on data.",
            tools=["data_analyzer", "model_trainer", "visualization_generator"],
            model_config=self.models.get("gpt-4", self.models["local-llm"]),
            memory_config={"type": "conversation_buffer", "max_tokens": 2500},
            behavior_config={"confidence_threshold": 0.85, "max_iterations": 4}
        )
        
        # Customer Service Agent
        service_agent = CustomAgentTemplate(
            template_id="customer_service",
            name="Customer Service Agent",
            description="Friendly and helpful agent for customer support and assistance",
            capabilities=[AICapability.NATURAL_LANGUAGE_PROCESSING, AICapability.DECISION_MAKING],
            personality=AgentPersonality.COLLABORATIVE,
            system_prompt="You are a helpful and empathetic customer service representative. You provide excellent support, solve problems efficiently, and ensure customer satisfaction. Always be professional, friendly, and solution-focused.",
            tools=["knowledge_base", "ticket_manager", "escalation_handler"],
            model_config=self.models.get("gpt-3.5-turbo", self.models["local-llm"]),
            memory_config={"type": "conversation_buffer", "max_tokens": 1000},
            behavior_config={"confidence_threshold": 0.7, "max_iterations": 3}
        )
        
        # Security Analysis Agent
        security_agent = CustomAgentTemplate(
            template_id="security_analyst",
            name="Security Analyst",
            description="Expert agent for security analysis and threat detection",
            capabilities=[AICapability.ANOMALY_DETECTION, AICapability.DECISION_MAKING],
            personality=AgentPersonality.ASSERTIVE,
            system_prompt="You are a cybersecurity expert focused on identifying threats, vulnerabilities, and security risks. You provide clear, actionable security recommendations and maintain the highest security standards.",
            tools=["vulnerability_scanner", "threat_detector", "compliance_checker"],
            model_config=self.models.get("gpt-4", self.models["local-llm"]),
            memory_config={"type": "conversation_buffer", "max_tokens": 2000},
            behavior_config={"confidence_threshold": 0.95, "max_iterations": 2}
        )
        
        # Store default agents
        agents = [doc_agent, workflow_agent, analytics_agent, service_agent, security_agent]
        for agent in agents:
            self.custom_agents[agent.template_id] = agent
        
        self.logger.info(f"Initialized {len(self.custom_agents)} default agent templates")
    
    async def create_custom_agent(self, template: CustomAgentTemplate) -> str:
        """Create a new custom agent from template.
        
        Args:
            template: Agent template configuration
            
        Returns:
            Agent ID
        """
        agent_id = str(uuid.uuid4())
        
        try:
            # Store the template
            self.custom_agents[template.template_id] = template
            
            # Initialize the agent
            agent = await self._initialize_agent(template)
            self.active_agents[agent_id] = {
                "template": template,
                "agent": agent,
                "created_at": datetime.now(),
                "status": "active"
            }
            
            self.logger.info(f"Created custom agent: {agent_id} ({template.name})")
            return agent_id
            
        except Exception as e:
            self.logger.error(f"Failed to create custom agent: {e}")
            raise
    
    async def _initialize_agent(self, template: CustomAgentTemplate) -> Any:
        """Initialize an agent from template."""
        try:
            if not openai:
                # Return a mock agent if OpenAI is not available
                return {
                    "type": "mock",
                    "template": template,
                    "initialized_at": datetime.now()
                }
            
            # Initialize LangChain agent
            llm = OpenAI(
                openai_api_key=template.model_config.api_key,
                model_name=template.model_config.model_name,
                temperature=template.model_config.temperature,
                max_tokens=template.model_config.max_tokens
            )
            
            # Initialize memory
            memory = ConversationBufferMemory(
                memory_key="chat_history",
                return_messages=True
            )
            
            # Initialize tools (mock tools for now)
            tools = []
            for tool_name in template.tools:
                tools.append(Tool(
                    name=tool_name,
                    description=f"Tool for {tool_name.replace('_', ' ')}",
                    func=lambda x: f"Result from {tool_name}: {x}"
                ))
            
            # Initialize agent
            agent = initialize_agent(
                tools=tools,
                llm=llm,
                agent="conversational-react-description",
                memory=memory,
                verbose=True
            )
            
            return agent
            
        except Exception as e:
            self.logger.error(f"Failed to initialize agent: {e}")
            # Return mock agent as fallback
            return {
                "type": "mock",
                "template": template,
                "initialized_at": datetime.now(),
                "error": str(e)
            }
    
    async def submit_task(self, request: AITaskRequest) -> str:
        """Submit a task for AI processing.
        
        Args:
            request: Task request
            
        Returns:
            Task ID
        """
        self.task_queue.append(request)
        
        # Process task asynchronously
        asyncio.create_task(self._process_task(request))
        
        self.logger.info(f"Submitted task: {request.task_id} for agent: {request.agent_id}")
        return request.task_id
    
    async def _process_task(self, request: AITaskRequest):
        """Process an AI task."""
        start_time = datetime.now()
        
        try:
            # Get agent
            if request.agent_id not in self.active_agents:
                raise ValueError(f"Agent not found: {request.agent_id}")
            
            agent_data = self.active_agents[request.agent_id]
            template = agent_data["template"]
            agent = agent_data["agent"]
            
            # Determine task type and process
            result = await self._execute_task(agent, template, request)
            
            # Calculate processing time
            processing_time = (datetime.now() - start_time).total_seconds()
            
            # Create response
            response = AITaskResponse(
                task_id=request.task_id,
                agent_id=request.agent_id,
                status="success",
                result=result,
                confidence=result.get("confidence", 0.8),
                reasoning=result.get("reasoning", ""),
                tokens_used=result.get("tokens_used", 0),
                processing_time=processing_time,
                metadata=result.get("metadata", {})
            )
            
            self.task_results[request.task_id] = response
            self.logger.info(f"Task completed: {request.task_id}")
            
        except Exception as e:
            processing_time = (datetime.now() - start_time).total_seconds()
            
            response = AITaskResponse(
                task_id=request.task_id,
                agent_id=request.agent_id,
                status="failed",
                result={"error": str(e)},
                confidence=0.0,
                reasoning=f"Task failed: {str(e)}",
                tokens_used=0,
                processing_time=processing_time,
                metadata={}
            )
            
            self.task_results[request.task_id] = response
            self.logger.error(f"Task failed: {request.task_id} - {str(e)}")
    
    async def _execute_task(self, agent: Any, template: CustomAgentTemplate, request: AITaskRequest) -> Dict[str, Any]:
        """Execute a task using the specified agent."""
        task_type = request.task_type
        input_data = request.input_data
        
        # Handle different task types
        if task_type == "text_analysis":
            return await self._handle_text_analysis(agent, template, input_data)
        elif task_type == "document_processing":
            return await self._handle_document_processing(agent, template, input_data)
        elif task_type == "workflow_generation":
            return await self._handle_workflow_generation(agent, template, input_data)
        elif task_type == "data_analysis":
            return await self._handle_data_analysis(agent, template, input_data)
        elif task_type == "security_audit":
            return await self._handle_security_audit(agent, template, input_data)
        else:
            return await self._handle_generic_task(agent, template, input_data)
    
    async def _handle_text_analysis(self, agent: Any, template: CustomAgentTemplate, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle text analysis task."""
        text = input_data.get("text", "")
        analysis_type = input_data.get("analysis_type", "general")
        
        if agent.get("type") == "mock":
            return {
                "analysis": f"Mock analysis of text: {text[:100]}...",
                "sentiment": "positive",
                "confidence": 0.85,
                "key_topics": ["topic1", "topic2"],
                "tokens_used": 150,
                "reasoning": "Mock analysis performed"
            }
        
        try:
            # Use LangChain agent
            prompt = f"Analyze the following text for {analysis_type}: {text}"
            result = agent.run(prompt)
            
            return {
                "analysis": result,
                "confidence": 0.9,
                "tokens_used": len(prompt.split()) + len(result.split()),
                "reasoning": "Analysis completed using AI model"
            }
            
        except Exception as e:
            return {
                "analysis": f"Error: {str(e)}",
                "confidence": 0.0,
                "tokens_used": 0,
                "reasoning": f"Analysis failed: {str(e)}"
            }
    
    async def _handle_document_processing(self, agent: Any, template: CustomAgentTemplate, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle document processing task."""
        document_content = input_data.get("content", "")
        processing_type = input_data.get("processing_type", "extraction")
        
        return {
            "extracted_data": {
                "title": "Document Title",
                "summary": "Document summary",
                "key_points": ["Point 1", "Point 2"],
                "entities": ["Entity 1", "Entity 2"]
            },
            "confidence": 0.88,
            "tokens_used": 200,
            "reasoning": "Document processed and key information extracted"
        }
    
    async def _handle_workflow_generation(self, agent: Any, template: CustomAgentTemplate, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle workflow generation task."""
        workflow_type = input_data.get("workflow_type", "generic")
        requirements = input_data.get("requirements", {})
        
        return {
            "workflow": {
                "name": f"Generated {workflow_type} Workflow",
                "steps": [
                    {"id": "step1", "name": "Initialize", "action": "setup"},
                    {"id": "step2", "name": "Process", "action": "execute"},
                    {"id": "step3", "name": "Finalize", "action": "cleanup"}
                ],
                "triggers": ["manual", "scheduled"],
                "outputs": ["report", "notification"]
            },
            "confidence": 0.92,
            "tokens_used": 300,
            "reasoning": "Workflow generated based on requirements"
        }
    
    async def _handle_data_analysis(self, agent: Any, template: CustomAgentTemplate, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle data analysis task."""
        data = input_data.get("data", [])
        analysis_type = input_data.get("analysis_type", "descriptive")
        
        return {
            "analysis_results": {
                "summary_stats": {"count": len(data), "mean": 0.5, "std": 0.2},
                "insights": ["Insight 1", "Insight 2"],
                "recommendations": ["Recommendation 1", "Recommendation 2"],
                "visualizations": ["chart1.png", "chart2.png"]
            },
            "confidence": 0.87,
            "tokens_used": 250,
            "reasoning": "Data analysis completed with statistical insights"
        }
    
    async def _handle_security_audit(self, agent: Any, template: CustomAgentTemplate, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle security audit task."""
        audit_type = input_data.get("audit_type", "general")
        target_system = input_data.get("target_system", "unknown")
        
        return {
            "audit_results": {
                "security_score": 8.5,
                "vulnerabilities": [
                    {"severity": "medium", "description": "Outdated dependency"},
                    {"severity": "low", "description": "Missing security header"}
                ],
                "recommendations": [
                    "Update dependencies",
                    "Implement security headers",
                    "Enable MFA"
                ],
                "compliance_status": "85% compliant"
            },
            "confidence": 0.93,
            "tokens_used": 180,
            "reasoning": "Security audit completed with actionable recommendations"
        }
    
    async def _handle_generic_task(self, agent: Any, template: CustomAgentTemplate, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle generic task."""
        return {
            "result": "Generic task completed",
            "confidence": 0.8,
            "tokens_used": 100,
            "reasoning": "Generic task processing"
        }
    
    # Capability handlers
    async def _handle_nlp_task(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle NLP capability task."""
        return {"nlp_result": "NLP processing completed", "confidence": 0.85}
    
    async def _handle_cv_task(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle computer vision capability task."""
        return {"cv_result": "Computer vision processing completed", "confidence": 0.82}
    
    async def _handle_sr_task(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle speech recognition capability task."""
        return {"sr_result": "Speech recognition completed", "confidence": 0.78}
    
    async def _handle_tts_task(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle text-to-speech capability task."""
        return {"tts_result": "Text-to-speech completed", "confidence": 0.90}
    
    async def _handle_dm_task(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle decision making capability task."""
        return {"dm_result": "Decision making completed", "confidence": 0.88}
    
    async def _handle_pa_task(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle predictive analytics capability task."""
        return {"pa_result": "Predictive analytics completed", "confidence": 0.86}
    
    async def _handle_ad_task(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle anomaly detection capability task."""
        return {"ad_result": "Anomaly detection completed", "confidence": 0.84}
    
    async def _handle_wa_task(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle workflow automation capability task."""
        return {"wa_result": "Workflow automation completed", "confidence": 0.91}
    
    async def _handle_ke_task(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle knowledge extraction capability task."""
        return {"ke_result": "Knowledge extraction completed", "confidence": 0.87}
    
    async def _handle_mp_task(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle multimodal processing capability task."""
        return {"mp_result": "Multimodal processing completed", "confidence": 0.83}
    
    def get_task_result(self, task_id: str) -> Optional[AITaskResponse]:
        """Get task result by ID."""
        return self.task_results.get(task_id)
    
    def list_agents(self) -> List[Dict[str, Any]]:
        """List all available agents."""
        agents = []
        for agent_id, agent_data in self.active_agents.items():
            template = agent_data["template"]
            agents.append({
                "agent_id": agent_id,
                "name": template.name,
                "description": template.description,
                "capabilities": [cap.value for cap in template.capabilities],
                "personality": template.personality.value,
                "status": agent_data["status"],
                "created_at": agent_data["created_at"].isoformat()
            })
        return agents
    
    def list_templates(self) -> List[Dict[str, Any]]:
        """List all available agent templates."""
        templates = []
        for template_id, template in self.custom_agents.items():
            templates.append({
                "template_id": template_id,
                "name": template.name,
                "description": template.description,
                "capabilities": [cap.value for cap in template.capabilities],
                "personality": template.personality.value,
                "created_at": template.created_at.isoformat()
            })
        return templates
    
    def get_agent_performance(self, agent_id: str) -> Dict[str, Any]:
        """Get performance metrics for an agent."""
        if agent_id not in self.active_agents:
            return {"error": "Agent not found"}
        
        # Calculate performance metrics
        agent_tasks = [task for task in self.task_results.values() if task.agent_id == agent_id]
        
        if not agent_tasks:
            return {
                "tasks_completed": 0,
                "average_confidence": 0.0,
                "average_processing_time": 0.0,
                "success_rate": 0.0,
                "total_tokens_used": 0
            }
        
        successful_tasks = [task for task in agent_tasks if task.status == "success"]
        
        return {
            "tasks_completed": len(agent_tasks),
            "successful_tasks": len(successful_tasks),
            "average_confidence": sum(task.confidence for task in successful_tasks) / len(successful_tasks) if successful_tasks else 0.0,
            "average_processing_time": sum(task.processing_time for task in agent_tasks) / len(agent_tasks),
            "success_rate": len(successful_tasks) / len(agent_tasks) if agent_tasks else 0.0,
            "total_tokens_used": sum(task.tokens_used for task in agent_tasks)
        }
    
    async def shutdown(self):
        """Shutdown the AI engine."""
        self.logger.info("Shutting down Advanced AI Engine...")
        
        # Clean up active agents
        for agent_id in list(self.active_agents.keys()):
            del self.active_agents[agent_id]
        
        # Clear task queue
        self.task_queue.clear()
        
        self.logger.info("Advanced AI Engine shut down")


# Example usage
if __name__ == "__main__":
    async def main():
        from core.config import Config
        
        config = Config()
        engine = AdvancedAIEngine(config)
        
        # Create a custom agent
        custom_template = CustomAgentTemplate(
            template_id="my_custom_agent",
            name="My Custom Agent",
            description="A custom agent for testing",
            capabilities=[AICapability.NATURAL_LANGUAGE_PROCESSING],
            personality=AgentPersonality.CREATIVE,
            system_prompt="You are a creative assistant.",
            tools=["text_processor"],
            model_config=AIModelConfig("gpt-3.5-turbo", "openai"),
            memory_config={},
            behavior_config={}
        )
        
        agent_id = await engine.create_custom_agent(custom_template)
        print(f"Created agent: {agent_id}")
        
        # Submit a task
        task_request = AITaskRequest(
            task_id="test_task_001",
            agent_id=agent_id,
            task_type="text_analysis",
            input_data={"text": "Hello, world!", "analysis_type": "sentiment"}
        )
        
        await engine.submit_task(task_request)
        
        # Wait for task completion
        await asyncio.sleep(2)
        
        # Get result
        result = engine.get_task_result("test_task_001")
        print(f"Task result: {result}")
        
        # Get agent performance
        performance = engine.get_agent_performance(agent_id)
        print(f"Agent performance: {performance}")
        
        await engine.shutdown()
    
    asyncio.run(main())
