#!/usr/bin/env python3
"""
Tiation AI Agents - Liberation System Integration
Enterprise integration module for connecting AI agents with the Liberation System.
"""

import asyncio
import json
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from datetime import datetime

import aiohttp
import websockets

from utils.logger import setup_logger
from core.config import Config


@dataclass
class LiberationSystemConfig:
    """Configuration for Liberation System integration."""
    base_url: str = "http://localhost:3000"
    api_key: str = ""
    mesh_node_id: str = ""
    auto_resource_distribution: bool = True
    truth_validation_enabled: bool = True
    secure_communication: bool = True


@dataclass
class ResourceDistributionTask:
    """Task for resource distribution through Liberation System."""
    task_id: str
    resource_type: str
    source_node: str
    target_nodes: List[str]
    priority: int
    metadata: Dict[str, Any]
    created_at: datetime
    status: str = "pending"


@dataclass
class TruthValidationRequest:
    """Request for truth validation through Liberation System."""
    request_id: str
    data: Dict[str, Any]
    source_agent: str
    validation_type: str
    confidence_threshold: float
    created_at: datetime


class LiberationSystemIntegration:
    """Integration module for Liberation System connectivity."""
    
    def __init__(self, config: LiberationSystemConfig):
        """Initialize Liberation System integration.
        
        Args:
            config: Liberation System configuration
        """
        self.config = config
        self.logger = setup_logger(__name__)
        self.session: Optional[aiohttp.ClientSession] = None
        self.websocket: Optional[websockets.WebSocketServerProtocol] = None
self.connected = False
    
    # Event loop
    loop = asyncio.get_event_loop()

    # Task queues
    self.resource_tasks: List[ResourceDistributionTask] = []
    self.truth_validation_requests: List[TruthValidationRequest] = []

    # Metrics collection
    self.metrics: Dict[str, Any] = {}

    # Integration callbacks
    self.callbacks = {
        "on_connect": None,
        "on_disconnect": None,
        "on_task_received": None,
        "on_validation_received": None
    }

    # Register event listeners
    self.loop.create_task(self._event_listener())

    
    async def initialize(self):
        """Initialize the Liberation System integration."""
        self.logger.info("Initializing Liberation System integration...")
        
        # Create HTTP session
        self.session = aiohttp.ClientSession(
            headers={
                "Authorization": f"Bearer {self.config.api_key}",
                "Content-Type": "application/json"
            }
        )
        
        # Test connection
        try:
            await self._test_connection()
            await self._register_mesh_node()
            await self._start_websocket_listener()
            self.connected = True
            self.logger.info("Liberation System integration initialized successfully")
        except Exception as e:
            self.logger.error(f"Failed to initialize Liberation System integration: {e}")
            raise
    
    async def _test_connection(self):
        """Test connection to Liberation System."""
        try:
            async with self.session.get(f"{self.config.base_url}/api/health") as response:
                if response.status == 200:
                    health_data = await response.json()
                    self.logger.info(f"Liberation System health check passed: {health_data}")
                else:
                    raise Exception(f"Health check failed with status {response.status}")
        except Exception as e:
            self.logger.error(f"Connection test failed: {e}")
            raise
    
    async def _register_mesh_node(self):
        """Register this AI agent system as a mesh node."""
        registration_data = {
            "node_id": self.config.mesh_node_id,
            "node_type": "ai_agents_platform",
            "capabilities": [
                "resource_distribution",
                "truth_validation",
                "process_automation",
                "data_analysis"
            ],
            "metadata": {
                "platform": "Tiation AI Agents",
                "version": "1.0.0",
                "timestamp": datetime.now().isoformat()
            }
        }
        
        try:
            async with self.session.post(
                f"{self.config.base_url}/api/mesh/register",
                json=registration_data
            ) as response:
                if response.status == 201:
                    result = await response.json()
                    self.logger.info(f"Mesh node registered successfully: {result}")
                else:
                    raise Exception(f"Registration failed with status {response.status}")
        except Exception as e:
            self.logger.error(f"Mesh node registration failed: {e}")
            raise
    
    async def _start_websocket_listener(self):
        """Start WebSocket listener for real-time Liberation System updates."""
        try:
            ws_url = f"{self.config.base_url.replace('http', 'ws')}/ws/mesh/{self.config.mesh_node_id}"
            self.websocket = await websockets.connect(ws_url)
            
            # Start listening task
            asyncio.create_task(self._websocket_listener())
            self.logger.info("WebSocket listener started")
        except Exception as e:
            self.logger.error(f"Failed to start WebSocket listener: {e}")
            raise
    
    async def _websocket_listener(self):
        """Listen for WebSocket messages from Liberation System."""
        try:
            async for message in self.websocket:
                data = json.loads(message)
                await self._handle_liberation_message(data)
        except websockets.exceptions.ConnectionClosed:
            self.logger.warning("WebSocket connection closed")
            self.connected = False
        except Exception as e:
            self.logger.error(f"WebSocket listener error: {e}")
    
    async def _handle_liberation_message(self, data: Dict[str, Any]):
        """Handle incoming messages from Liberation System."""
        message_type = data.get("type")
        
        if message_type == "resource_distribution_request":
            await self._handle_resource_distribution_request(data)
        elif message_type == "truth_validation_request":
            await self._handle_truth_validation_request(data)
        elif message_type == "mesh_update":
            await self._handle_mesh_update(data)
        else:
            self.logger.warning(f"Unknown message type: {message_type}")
    
    async def _handle_resource_distribution_request(self, data: Dict[str, Any]):
        """Handle resource distribution request from Liberation System."""
        try:
            task = ResourceDistributionTask(
                task_id=data["task_id"],
                resource_type=data["resource_type"],
                source_node=data["source_node"],
                target_nodes=data["target_nodes"],
                priority=data["priority"],
                metadata=data["metadata"],
                created_at=datetime.fromisoformat(data["created_at"])
            )
            
            self.resource_tasks.append(task)
            self.logger.info(f"Resource distribution task received: {task.task_id}")
            
            # Process task if auto-distribution is enabled
            if self.config.auto_resource_distribution:
                await self._process_resource_distribution_task(task)
                
        except Exception as e:
            self.logger.error(f"Error handling resource distribution request: {e}")
    
    async def _handle_truth_validation_request(self, data: Dict[str, Any]):
        """Handle truth validation request from Liberation System."""
        try:
            request = TruthValidationRequest(
                request_id=data["request_id"],
                data=data["data"],
                source_agent=data["source_agent"],
                validation_type=data["validation_type"],
                confidence_threshold=data["confidence_threshold"],
                created_at=datetime.fromisoformat(data["created_at"])
            )
            
            self.truth_validation_requests.append(request)
            self.logger.info(f"Truth validation request received: {request.request_id}")
            
            # Process request if validation is enabled
            if self.config.truth_validation_enabled:
                await self._process_truth_validation_request(request)
                
        except Exception as e:
            self.logger.error(f"Error handling truth validation request: {e}")
    
    async def _handle_mesh_update(self, data: Dict[str, Any]):
        """Handle mesh network update from Liberation System."""
        update_type = data.get("update_type")
        self.logger.info(f"Mesh update received: {update_type}")
        
        if update_type == "node_joined":
            self.logger.info(f"New node joined mesh: {data['node_id']}")
        elif update_type == "node_left":
            self.logger.info(f"Node left mesh: {data['node_id']}")
        elif update_type == "network_status":
            self.logger.info(f"Network status update: {data['status']}")
    
    async def _process_resource_distribution_task(self, task: ResourceDistributionTask):
        """Process a resource distribution task."""
        try:
            # Simulate resource distribution processing
            self.logger.info(f"Processing resource distribution task: {task.task_id}")
            
            # Update task status
            task.status = "processing"
            
            # Simulate processing time
            await asyncio.sleep(1)
            
            # Mark as completed
            task.status = "completed"
            
            # Send completion notification to Liberation System
            await self._send_task_completion(task)
            
        except Exception as e:
            self.logger.error(f"Error processing resource distribution task: {e}")
            task.status = "failed"
    
    async def _process_truth_validation_request(self, request: TruthValidationRequest):
        """Process a truth validation request."""
        try:
            self.logger.info(f"Processing truth validation request: {request.request_id}")
            
            # Simulate validation processing
            confidence_score = 0.95  # Placeholder
            validation_result = {
                "validated": confidence_score >= request.confidence_threshold,
                "confidence": confidence_score,
                "details": "AI agent validation completed"
            }
            
            # Send validation result to Liberation System
            await self._send_validation_result(request, validation_result)
            
        except Exception as e:
            self.logger.error(f"Error processing truth validation request: {e}")
    
    async def _send_task_completion(self, task: ResourceDistributionTask):
        """Send task completion notification to Liberation System."""
        try:
            completion_data = {
                "task_id": task.task_id,
                "status": task.status,
                "completed_at": datetime.now().isoformat(),
                "node_id": self.config.mesh_node_id
            }
            
            async with self.session.post(
                f"{self.config.base_url}/api/mesh/task/completion",
                json=completion_data
            ) as response:
                if response.status == 200:
                    self.logger.info(f"Task completion sent for {task.task_id}")
                else:
                    self.logger.error(f"Failed to send task completion: {response.status}")
                    
        except Exception as e:
            self.logger.error(f"Error sending task completion: {e}")
    
    async def _send_validation_result(self, request: TruthValidationRequest, result: Dict[str, Any]):
        """Send validation result to Liberation System."""
        try:
            result_data = {
                "request_id": request.request_id,
                "result": result,
                "validated_at": datetime.now().isoformat(),
                "node_id": self.config.mesh_node_id
            }
            
            async with self.session.post(
                f"{self.config.base_url}/api/mesh/validation/result",
                json=result_data
            ) as response:
                if response.status == 200:
                    self.logger.info(f"Validation result sent for {request.request_id}")
                else:
                    self.logger.error(f"Failed to send validation result: {response.status}")
                    
        except Exception as e:
            self.logger.error(f"Error sending validation result: {e}")
    
    async def submit_resource_distribution_request(self, 
                                                  resource_type: str,
                                                  target_nodes: List[str],
                                                  priority: int = 1,
                                                  metadata: Optional[Dict[str, Any]] = None) -> str:
        """Submit a resource distribution request to Liberation System.
        
        Args:
            resource_type: Type of resource to distribute
            target_nodes: List of target node IDs
            priority: Task priority (1-10)
            metadata: Additional metadata
            
        Returns:
            Task ID for the submitted request
        """
        try:
            task_data = {
                "resource_type": resource_type,
                "source_node": self.config.mesh_node_id,
                "target_nodes": target_nodes,
                "priority": priority,
                "metadata": metadata or {},
                "created_at": datetime.now().isoformat()
            }
            
            async with self.session.post(
                f"{self.config.base_url}/api/mesh/resource/distribute",
                json=task_data
            ) as response:
                if response.status == 201:
                    result = await response.json()
                    task_id = result["task_id"]
                    self.logger.info(f"Resource distribution request submitted: {task_id}")
                    return task_id
                else:
                    raise Exception(f"Failed to submit request: {response.status}")
                    
        except Exception as e:
            self.logger.error(f"Error submitting resource distribution request: {e}")
            raise
    
    async def submit_truth_validation_request(self,
                                            data: Dict[str, Any],
                                            validation_type: str,
                                            confidence_threshold: float = 0.8) -> str:
        """Submit a truth validation request to Liberation System.
        
        Args:
            data: Data to validate
            validation_type: Type of validation required
            confidence_threshold: Minimum confidence threshold
            
        Returns:
            Request ID for the submitted validation
        """
        try:
            request_data = {
                "data": data,
                "source_agent": self.config.mesh_node_id,
                "validation_type": validation_type,
                "confidence_threshold": confidence_threshold,
                "created_at": datetime.now().isoformat()
            }
            
            async with self.session.post(
                f"{self.config.base_url}/api/mesh/truth/validate",
                json=request_data
            ) as response:
                if response.status == 201:
                    result = await response.json()
                    request_id = result["request_id"]
                    self.logger.info(f"Truth validation request submitted: {request_id}")
                    return request_id
                else:
                    raise Exception(f"Failed to submit request: {response.status}")
                    
        except Exception as e:
            self.logger.error(f"Error submitting truth validation request: {e}")
            raise
    
    async def get_mesh_status(self) -> Dict[str, Any]:
        """Get current mesh network status."""
        try:
            async with self.session.get(f"{self.config.base_url}/api/mesh/status") as response:
                if response.status == 200:
                    return await response.json()
                else:
                    raise Exception(f"Failed to get mesh status: {response.status}")
        except Exception as e:
            self.logger.error(f"Error getting mesh status: {e}")
            raise
    
    async def shutdown(self):
        """Shutdown the Liberation System integration."""
        self.logger.info("Shutting down Liberation System integration...")
        
        if self.websocket:
            await self.websocket.close()
        
        if self.session:
            await self.session.close()
        
        self.connected = False
        self.logger.info("Liberation System integration shut down")
    
    def is_connected(self) -> bool:
        """Check if connected to Liberation System."""
        return self.connected
    
    def get_pending_tasks(self) -> List[ResourceDistributionTask]:
        """Get list of pending resource distribution tasks."""
        return [task for task in self.resource_tasks if task.status == "pending"]
    
    def get_pending_validations(self) -> List[TruthValidationRequest]:
        """Get list of pending truth validation requests."""
        return self.truth_validation_requests


# Example usage and testing
if __name__ == "__main__":
    async def main():
        # Example configuration
        config = LiberationSystemConfig(
            base_url="http://localhost:3000",
            api_key="your_api_key_here",
            mesh_node_id="ai_agents_001",
            auto_resource_distribution=True,
            truth_validation_enabled=True
        )
        
        # Initialize integration
        integration = LiberationSystemIntegration(config)
        
        try:
            await integration.initialize()
            
            # Example: Submit a resource distribution request
            task_id = await integration.submit_resource_distribution_request(
                resource_type="compute_capacity",
                target_nodes=["node_002", "node_003"],
                priority=5,
                metadata={"cpu_cores": 4, "memory_gb": 8}
            )
            
            # Example: Submit a truth validation request
            validation_id = await integration.submit_truth_validation_request(
                data={"claim": "AI agents are operational", "confidence": 0.95},
                validation_type="operational_status",
                confidence_threshold=0.8
            )
            
            # Get mesh status
            mesh_status = await integration.get_mesh_status()
            print(f"Mesh Status: {mesh_status}")
            
            # Keep running for demonstration
            await asyncio.sleep(60)
            
        finally:
            await integration.shutdown()
    
    asyncio.run(main())
