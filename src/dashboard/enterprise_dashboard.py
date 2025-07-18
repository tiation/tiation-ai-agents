#!/usr/bin/env python3
"""
Tiation AI Agents - Enterprise Dashboard
Real-time monitoring and control interface for AI agents with dark neon theme.
"""

import asyncio
import json
from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from enum import Enum

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from fastapi.requests import Request
import uvicorn

from core.agent_manager import AgentManager
from core.metrics import MetricsCollector
from utils.logger import setup_logger


class AgentStatus(Enum):
    """Agent status enumeration."""
    ACTIVE = "active"
    IDLE = "idle"
    ERROR = "error"
    OFFLINE = "offline"


@dataclass
class AgentMetrics:
    """Agent performance metrics."""
    agent_id: str
    name: str
    status: AgentStatus
    cpu_usage: float
    memory_usage: float
    tasks_completed: int
    tasks_failed: int
    uptime: int
    last_activity: datetime
    performance_score: float
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        data = asdict(self)
        data['status'] = self.status.value
        data['last_activity'] = self.last_activity.isoformat()
        return data


@dataclass
class SystemMetrics:
    """System-wide metrics."""
    total_agents: int
    active_agents: int
    idle_agents: int
    error_agents: int
    offline_agents: int
    total_tasks: int
    completed_tasks: int
    failed_tasks: int
    system_load: float
    memory_usage: float
    uptime: int
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        return asdict(self)


class EnterpriseDashboard:
    """Enterprise dashboard for AI agents monitoring and control."""
    
    def __init__(self, agent_manager: AgentManager, host: str = "0.0.0.0", port: int = 8080):
        """Initialize the enterprise dashboard.
        
        Args:
            agent_manager: Agent manager instance
            host: Dashboard host address
            port: Dashboard port
        """
        self.agent_manager = agent_manager
        self.host = host
        self.port = port
        self.logger = setup_logger(__name__)
        self.metrics_collector = MetricsCollector()
        
        # WebSocket connections
        self.connections: List[WebSocket] = []
        
        # Initialize FastAPI app
        self.app = FastAPI(
            title="Tiation AI Agents - Enterprise Dashboard",
            description="Real-time monitoring and control interface for AI agents",
            version="1.0.0"
        )
        
        # Setup routes
        self._setup_routes()
        self._setup_websocket()
        
        # Mount static files
        self.app.mount("/static", StaticFiles(directory="static"), name="static")
        self.templates = Jinja2Templates(directory="templates")
        
        # Start metrics collection
        self.metrics_task = None
    
    def _setup_routes(self):
        """Setup HTTP routes."""
        
        @self.app.get("/", response_class=HTMLResponse)
        async def dashboard_home(request: Request):
            """Main dashboard page."""
            return self.templates.TemplateResponse("dashboard.html", {
                "request": request,
                "title": "Tiation AI Agents - Enterprise Dashboard"
            })
        
        @self.app.get("/api/metrics")
        async def get_metrics():
            """Get current system metrics."""
            try:
                system_metrics = await self._collect_system_metrics()
                agent_metrics = await self._collect_agent_metrics()
                
                return {
                    "system": system_metrics.to_dict(),
                    "agents": [agent.to_dict() for agent in agent_metrics],
                    "timestamp": datetime.now().isoformat()
                }
            except Exception as e:
                self.logger.error(f"Error collecting metrics: {e}")
                raise HTTPException(status_code=500, detail="Internal server error")
        
        @self.app.get("/api/agents")
        async def get_agents():
            """Get all agents information."""
            try:
                agents = await self.agent_manager.get_all_agents()
                return {
                    "agents": [agent.to_dict() for agent in agents],
                    "count": len(agents)
                }
            except Exception as e:
                self.logger.error(f"Error getting agents: {e}")
                raise HTTPException(status_code=500, detail="Internal server error")
        
        @self.app.post("/api/agents/{agent_id}/start")
        async def start_agent(agent_id: str):
            """Start an agent."""
            try:
                await self.agent_manager.start_agent(agent_id)
                return {"message": f"Agent {agent_id} started successfully"}
            except Exception as e:
                self.logger.error(f"Error starting agent {agent_id}: {e}")
                raise HTTPException(status_code=500, detail=str(e))
        
        @self.app.post("/api/agents/{agent_id}/stop")
        async def stop_agent(agent_id: str):
            """Stop an agent."""
            try:
                await self.agent_manager.stop_agent(agent_id)
                return {"message": f"Agent {agent_id} stopped successfully"}
            except Exception as e:
                self.logger.error(f"Error stopping agent {agent_id}: {e}")
                raise HTTPException(status_code=500, detail=str(e))
        
        @self.app.post("/api/agents/{agent_id}/restart")
        async def restart_agent(agent_id: str):
            """Restart an agent."""
            try:
                await self.agent_manager.restart_agent(agent_id)
                return {"message": f"Agent {agent_id} restarted successfully"}
            except Exception as e:
                self.logger.error(f"Error restarting agent {agent_id}: {e}")
                raise HTTPException(status_code=500, detail=str(e))
    
    def _setup_websocket(self):
        """Setup WebSocket for real-time updates."""
        
        @self.app.websocket("/ws")
        async def websocket_endpoint(websocket: WebSocket):
            """WebSocket endpoint for real-time updates."""
            await websocket.accept()
            self.connections.append(websocket)
            
            try:
                while True:
                    # Keep connection alive
                    await websocket.receive_text()
            except WebSocketDisconnect:
                self.connections.remove(websocket)
            except Exception as e:
                self.logger.error(f"WebSocket error: {e}")
                if websocket in self.connections:
                    self.connections.remove(websocket)
    
    async def _collect_system_metrics(self) -> SystemMetrics:
        """Collect system-wide metrics."""
        agents = await self.agent_manager.get_all_agents()
        
        # Count agents by status
        active_count = sum(1 for agent in agents if agent.status == AgentStatus.ACTIVE)
        idle_count = sum(1 for agent in agents if agent.status == AgentStatus.IDLE)
        error_count = sum(1 for agent in agents if agent.status == AgentStatus.ERROR)
        offline_count = sum(1 for agent in agents if agent.status == AgentStatus.OFFLINE)
        
        # Get system metrics
        system_info = await self.metrics_collector.get_system_metrics()
        
        return SystemMetrics(
            total_agents=len(agents),
            active_agents=active_count,
            idle_agents=idle_count,
            error_agents=error_count,
            offline_agents=offline_count,
            total_tasks=sum(agent.tasks_completed + agent.tasks_failed for agent in agents),
            completed_tasks=sum(agent.tasks_completed for agent in agents),
            failed_tasks=sum(agent.tasks_failed for agent in agents),
            system_load=system_info.get('cpu_percent', 0),
            memory_usage=system_info.get('memory_percent', 0),
            uptime=system_info.get('uptime', 0)
        )
    
    async def _collect_agent_metrics(self) -> List[AgentMetrics]:
        """Collect metrics for all agents."""
        agents = await self.agent_manager.get_all_agents()
        metrics = []
        
        for agent in agents:
            agent_metrics = await self.metrics_collector.get_agent_metrics(agent.id)
            
            metrics.append(AgentMetrics(
                agent_id=agent.id,
                name=agent.name,
                status=agent.status,
                cpu_usage=agent_metrics.get('cpu_usage', 0),
                memory_usage=agent_metrics.get('memory_usage', 0),
                tasks_completed=agent_metrics.get('tasks_completed', 0),
                tasks_failed=agent_metrics.get('tasks_failed', 0),
                uptime=agent_metrics.get('uptime', 0),
                last_activity=agent_metrics.get('last_activity', datetime.now()),
                performance_score=agent_metrics.get('performance_score', 0)
            ))
        
        return metrics
    
    async def broadcast_metrics(self):
        """Broadcast metrics to all connected WebSocket clients."""
        if not self.connections:
            return
        
        try:
            system_metrics = await self._collect_system_metrics()
            agent_metrics = await self._collect_agent_metrics()
            
            data = {
                "type": "metrics_update",
                "data": {
                    "system": system_metrics.to_dict(),
                    "agents": [agent.to_dict() for agent in agent_metrics],
                    "timestamp": datetime.now().isoformat()
                }
            }
            
            # Send to all connected clients
            disconnected = []
            for connection in self.connections:
                try:
                    await connection.send_text(json.dumps(data))
                except Exception as e:
                    self.logger.error(f"Error sending to WebSocket: {e}")
                    disconnected.append(connection)
            
            # Remove disconnected clients
            for connection in disconnected:
                self.connections.remove(connection)
                
        except Exception as e:
            self.logger.error(f"Error broadcasting metrics: {e}")
    
    async def _metrics_loop(self):
        """Continuous metrics collection and broadcasting."""
        while True:
            try:
                await self.broadcast_metrics()
                await asyncio.sleep(5)  # Update every 5 seconds
            except Exception as e:
                self.logger.error(f"Error in metrics loop: {e}")
                await asyncio.sleep(10)  # Wait longer on error
    
    async def start(self):
        """Start the dashboard server."""
        self.logger.info(f"Starting Enterprise Dashboard on {self.host}:{self.port}")
        
        # Start metrics collection task
        self.metrics_task = asyncio.create_task(self._metrics_loop())
        
        # Start the server
        config = uvicorn.Config(
            self.app,
            host=self.host,
            port=self.port,
            log_level="info"
        )
        server = uvicorn.Server(config)
        await server.serve()
    
    async def stop(self):
        """Stop the dashboard server."""
        if self.metrics_task:
            self.metrics_task.cancel()
        
        self.logger.info("Enterprise Dashboard stopped")


if __name__ == "__main__":
    # Example usage
    async def main():
        from core.agent_manager import AgentManager
        from core.config import Config
        
        config = Config()
        agent_manager = AgentManager(config)
        dashboard = EnterpriseDashboard(agent_manager)
        
        await dashboard.start()
    
    asyncio.run(main())
