#!/usr/bin/env python3
"""
Tiation AI Agents - Agent Manager
Core agent management and orchestration functionality.
"""

import asyncio
import uuid
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from datetime import datetime
from enum import Enum

from utils.logger import setup_logger
from core.config import Config


class AgentStatus(Enum):
    """Agent status enumeration."""
    ACTIVE = "active"
    IDLE = "idle"
    ERROR = "error"
    OFFLINE = "offline"


@dataclass
class Agent:
    """Agent data structure."""
    id: str
    name: str
    type: str
    status: AgentStatus
    capabilities: List[str]
    config: Dict[str, Any]
    created_at: datetime
    last_activity: datetime
    tasks_completed: int = 0
    tasks_failed: int = 0
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert agent to dictionary."""
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "status": self.status.value,
            "capabilities": self.capabilities,
            "config": self.config,
            "created_at": self.created_at.isoformat(),
            "last_activity": self.last_activity.isoformat(),
            "tasks_completed": self.tasks_completed,
            "tasks_failed": self.tasks_failed
        }


class AgentManager:
    """Agent manager for orchestrating AI agents."""
    
    def __init__(self, config: Config):
        """Initialize agent manager.
        
        Args:
            config: Application configuration
        """
        self.config = config
        self.logger = setup_logger(__name__)
        self.agents: Dict[str, Agent] = {}
        self.initialized = False
    
    async def initialize(self):
        """Initialize the agent manager."""
        self.logger.info("Initializing Agent Manager...")
        
        # Create some default agents
        await self._create_default_agents()
        
        self.initialized = True
        self.logger.info("Agent Manager initialized successfully")
    
    async def _create_default_agents(self):
        """Create default agents for demonstration."""
        default_agents = [
            {
                "name": "Document Analyzer",
                "type": "nlp",
                "capabilities": ["document_analysis", "text_extraction", "summarization"],
                "config": {"model": "gpt-3.5-turbo", "temperature": 0.7}
            },
            {
                "name": "Workflow Automator",
                "type": "automation",
                "capabilities": ["workflow_creation", "task_scheduling", "process_automation"],
                "config": {"max_concurrent_tasks": 5}
            },
            {
                "name": "Data Analyst",
                "type": "analytics",
                "capabilities": ["data_analysis", "predictive_modeling", "visualization"],
                "config": {"analysis_engine": "pandas", "visualization_library": "matplotlib"}
            },
            {
                "name": "Security Monitor",
                "type": "security",
                "capabilities": ["threat_detection", "vulnerability_scanning", "compliance_checking"],
                "config": {"scan_interval": 3600, "alert_threshold": 0.8}
            }
        ]
        
        for agent_config in default_agents:
            agent = Agent(
                id=str(uuid.uuid4()),
                name=agent_config["name"],
                type=agent_config["type"],
                status=AgentStatus.ACTIVE,
                capabilities=agent_config["capabilities"],
                config=agent_config["config"],
                created_at=datetime.now(),
                last_activity=datetime.now()
            )
            
            self.agents[agent.id] = agent
            self.logger.info(f"Created default agent: {agent.name} ({agent.id})")
    
    async def start_agent(self, agent_id: str):
        """Start an agent.
        
        Args:
            agent_id: Agent ID
        """
        if agent_id not in self.agents:
            raise ValueError(f"Agent not found: {agent_id}")
        
        agent = self.agents[agent_id]
        agent.status = AgentStatus.ACTIVE
        agent.last_activity = datetime.now()
        
        self.logger.info(f"Started agent: {agent.name} ({agent_id})")
    
    async def stop_agent(self, agent_id: str):
        """Stop an agent.
        
        Args:
            agent_id: Agent ID
        """
        if agent_id not in self.agents:
            raise ValueError(f"Agent not found: {agent_id}")
        
        agent = self.agents[agent_id]
        agent.status = AgentStatus.OFFLINE
        agent.last_activity = datetime.now()
        
        self.logger.info(f"Stopped agent: {agent.name} ({agent_id})")
    
    async def restart_agent(self, agent_id: str):
        """Restart an agent.
        
        Args:
            agent_id: Agent ID
        """
        await self.stop_agent(agent_id)
        await asyncio.sleep(1)  # Brief pause
        await self.start_agent(agent_id)
        
        self.logger.info(f"Restarted agent: {agent_id}")
    
    async def get_agent(self, agent_id: str) -> Optional[Agent]:
        """Get agent by ID.
        
        Args:
            agent_id: Agent ID
            
        Returns:
            Agent if found, None otherwise
        """
        return self.agents.get(agent_id)
    
    async def get_all_agents(self) -> List[Agent]:
        """Get all agents.
        
        Returns:
            List of all agents
        """
        return list(self.agents.values())
    
    async def get_agents_by_type(self, agent_type: str) -> List[Agent]:
        """Get agents by type.
        
        Args:
            agent_type: Agent type
            
        Returns:
            List of agents of specified type
        """
        return [agent for agent in self.agents.values() if agent.type == agent_type]
    
    async def get_agents_by_status(self, status: AgentStatus) -> List[Agent]:
        """Get agents by status.
        
        Args:
            status: Agent status
            
        Returns:
            List of agents with specified status
        """
        return [agent for agent in self.agents.values() if agent.status == status]
    
    async def update_agent_activity(self, agent_id: str, task_completed: bool = True):
        """Update agent activity.
        
        Args:
            agent_id: Agent ID
            task_completed: Whether task was completed successfully
        """
        if agent_id not in self.agents:
            return
        
        agent = self.agents[agent_id]
        agent.last_activity = datetime.now()
        
        if task_completed:
            agent.tasks_completed += 1
        else:
            agent.tasks_failed += 1
    
    async def get_agent_metrics(self, agent_id: str) -> Dict[str, Any]:
        """Get agent performance metrics.
        
        Args:
            agent_id: Agent ID
            
        Returns:
            Agent metrics dictionary
        """
        if agent_id not in self.agents:
            return {}
        
        agent = self.agents[agent_id]
        total_tasks = agent.tasks_completed + agent.tasks_failed
        success_rate = (agent.tasks_completed / total_tasks) if total_tasks > 0 else 0
        
        return {
            "cpu_usage": 45.2,  # Mock data
            "memory_usage": 62.8,  # Mock data
            "tasks_completed": agent.tasks_completed,
            "tasks_failed": agent.tasks_failed,
            "success_rate": success_rate,
            "uptime": (datetime.now() - agent.created_at).total_seconds(),
            "last_activity": agent.last_activity,
            "performance_score": min(success_rate * 100, 100)
        }
    
    async def shutdown(self):
        """Shutdown the agent manager."""
        self.logger.info("Shutting down Agent Manager...")
        
        # Stop all agents
        for agent_id in list(self.agents.keys()):
            await self.stop_agent(agent_id)
        
        self.initialized = False
        self.logger.info("Agent Manager shut down")
