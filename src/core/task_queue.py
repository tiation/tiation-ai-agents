#!/usr/bin/env python3
"""
Tiation AI Agents - Task Queue System
Asynchronous task processing and queue management.
"""

import asyncio
import uuid
from datetime import datetime
from enum import Enum
from typing import Dict, Any, Optional, List, Callable
from dataclasses import dataclass, field

from utils.logger import setup_logger


class TaskStatus(Enum):
    """Task status enumeration."""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class TaskType(Enum):
    """Task type enumeration."""
    TEXT_ANALYSIS = "text_analysis"
    DOCUMENT_PROCESSING = "document_processing"
    WORKFLOW_GENERATION = "workflow_generation"
    DATA_ANALYSIS = "data_analysis"
    SECURITY_AUDIT = "security_audit"
    CUSTOM = "custom"


class TaskPriority(Enum):
    """Task priority enumeration."""
    LOW = 1
    NORMAL = 2
    HIGH = 3
    CRITICAL = 4


@dataclass
class Task:
    """Task data structure."""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    type: TaskType = TaskType.CUSTOM
    priority: TaskPriority = TaskPriority.NORMAL
    status: TaskStatus = TaskStatus.PENDING
    agent_id: Optional[str] = None
    payload: Dict[str, Any] = field(default_factory=dict)
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    created_at: datetime = field(default_factory=datetime.now)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    timeout: Optional[int] = None
    retries: int = 0
    max_retries: int = 3
    metadata: Dict[str, Any] = field(default_factory=dict)


class TaskQueue:
    """Asynchronous task queue manager."""
    
    def __init__(self, max_workers: int = 10):
        """Initialize task queue.
        
        Args:
            max_workers: Maximum number of concurrent workers
        """
        self.logger = setup_logger(__name__)
        self.max_workers = max_workers
        self.tasks: Dict[str, Task] = {}
        self.pending_queue: asyncio.Queue = asyncio.Queue()
        self.processing_tasks: Dict[str, asyncio.Task] = {}
        self.task_handlers: Dict[TaskType, Callable] = {}
        self.workers: List[asyncio.Task] = []
        self.running = False
        self.stats = {
            "total_tasks": 0,
            "completed_tasks": 0,
            "failed_tasks": 0,
            "cancelled_tasks": 0
        }
    
    async def start(self):
        """Start the task queue workers."""
        if self.running:
            return
        
        self.running = True
        self.logger.info(f"Starting task queue with {self.max_workers} workers")
        
        # Start worker tasks
        for i in range(self.max_workers):
            worker = asyncio.create_task(self._worker(f"worker-{i}"))
            self.workers.append(worker)
    
    async def stop(self):
        """Stop the task queue workers."""
        if not self.running:
            return
        
        self.running = False
        self.logger.info("Stopping task queue workers")
        
        # Cancel all workers
        for worker in self.workers:
            worker.cancel()
        
        # Wait for workers to finish
        await asyncio.gather(*self.workers, return_exceptions=True)
        self.workers.clear()
        
        # Cancel processing tasks
        for task in self.processing_tasks.values():
            task.cancel()
        
        await asyncio.gather(*self.processing_tasks.values(), return_exceptions=True)
        self.processing_tasks.clear()
    
    def register_handler(self, task_type: TaskType, handler: Callable):
        """Register a task handler.
        
        Args:
            task_type: Type of task to handle
            handler: Handler function
        """
        self.task_handlers[task_type] = handler
        self.logger.info(f"Registered handler for task type: {task_type.value}")
    
    async def submit_task(self, task: Task) -> str:
        """Submit a task to the queue.
        
        Args:
            task: Task to submit
            
        Returns:
            Task ID
        """
        self.tasks[task.id] = task
        await self.pending_queue.put(task)
        self.stats["total_tasks"] += 1
        
        self.logger.info(
            f"Task submitted: {task.id} (type: {task.type.value}, priority: {task.priority.value})"
        )
        return task.id
    
    async def get_task(self, task_id: str) -> Optional[Task]:
        """Get a task by ID.
        
        Args:
            task_id: Task ID
            
        Returns:
            Task if found, None otherwise
        """
        return self.tasks.get(task_id)
    
    async def get_tasks_by_status(self, status: TaskStatus) -> List[Task]:
        """Get tasks by status.
        
        Args:
            status: Task status
            
        Returns:
            List of tasks with the specified status
        """
        return [task for task in self.tasks.values() if task.status == status]
    
    async def get_tasks_by_agent(self, agent_id: str) -> List[Task]:
        """Get tasks by agent ID.
        
        Args:
            agent_id: Agent ID
            
        Returns:
            List of tasks assigned to the agent
        """
        return [task for task in self.tasks.values() if task.agent_id == agent_id]
    
    async def cancel_task(self, task_id: str) -> bool:
        """Cancel a task.
        
        Args:
            task_id: Task ID
            
        Returns:
            True if task was cancelled, False otherwise
        """
        task = self.tasks.get(task_id)
        if not task:
            return False
        
        if task.status == TaskStatus.PROCESSING:
            # Cancel the processing task
            processing_task = self.processing_tasks.get(task_id)
            if processing_task:
                processing_task.cancel()
                del self.processing_tasks[task_id]
        
        task.status = TaskStatus.CANCELLED
        task.completed_at = datetime.now()
        self.stats["cancelled_tasks"] += 1
        
        self.logger.info(f"Task cancelled: {task_id}")
        return True
    
    async def get_queue_stats(self) -> Dict[str, Any]:
        """Get queue statistics.
        
        Returns:
            Dictionary of queue statistics
        """
        pending_count = sum(1 for task in self.tasks.values() if task.status == TaskStatus.PENDING)
        processing_count = len(self.processing_tasks)
        
        return {
            "total_tasks": self.stats["total_tasks"],
            "completed_tasks": self.stats["completed_tasks"],
            "failed_tasks": self.stats["failed_tasks"],
            "cancelled_tasks": self.stats["cancelled_tasks"],
            "pending_tasks": pending_count,
            "processing_tasks": processing_count,
            "queue_size": self.pending_queue.qsize(),
            "active_workers": len(self.workers),
            "running": self.running
        }
    
    async def _worker(self, worker_id: str):
        """Worker task that processes tasks from the queue.
        
        Args:
            worker_id: Worker identifier
        """
        self.logger.info(f"Worker {worker_id} started")
        
        while self.running:
            try:
                # Get task from queue with timeout
                task = await asyncio.wait_for(self.pending_queue.get(), timeout=1.0)
                
                # Process the task
                await self._process_task(task, worker_id)
                
            except asyncio.TimeoutError:
                # No task available, continue
                continue
            except Exception as e:
                self.logger.error(f"Worker {worker_id} error: {e}")
        
        self.logger.info(f"Worker {worker_id} stopped")
    
    async def _process_task(self, task: Task, worker_id: str):
        """Process a single task.
        
        Args:
            task: Task to process
            worker_id: Worker identifier
        """
        try:
            # Update task status
            task.status = TaskStatus.PROCESSING
            task.started_at = datetime.now()
            
            self.logger.info(f"Processing task {task.id} with worker {worker_id}")
            
            # Get handler for task type
            handler = self.task_handlers.get(task.type)
            if not handler:
                raise ValueError(f"No handler registered for task type: {task.type.value}")
            
            # Create processing task with timeout
            processing_task = asyncio.create_task(handler(task))
            self.processing_tasks[task.id] = processing_task
            
            # Wait for task completion or timeout
            if task.timeout:
                result = await asyncio.wait_for(processing_task, timeout=task.timeout)
            else:
                result = await processing_task
            
            # Update task with result
            task.result = result
            task.status = TaskStatus.COMPLETED
            task.completed_at = datetime.now()
            self.stats["completed_tasks"] += 1
            
            self.logger.info(f"Task {task.id} completed successfully")
            
        except asyncio.CancelledError:
            task.status = TaskStatus.CANCELLED
            task.completed_at = datetime.now()
            self.stats["cancelled_tasks"] += 1
            self.logger.info(f"Task {task.id} was cancelled")
            
        except Exception as e:
            task.error = str(e)
            task.retries += 1
            
            if task.retries <= task.max_retries:
                # Retry the task
                task.status = TaskStatus.PENDING
                task.started_at = None
                await self.pending_queue.put(task)
                self.logger.warning(f"Task {task.id} failed, retrying ({task.retries}/{task.max_retries}): {e}")
            else:
                # Max retries reached
                task.status = TaskStatus.FAILED
                task.completed_at = datetime.now()
                self.stats["failed_tasks"] += 1
                self.logger.error(f"Task {task.id} failed after {task.retries} retries: {e}")
        
        finally:
            # Clean up processing task
            if task.id in self.processing_tasks:
                del self.processing_tasks[task.id]
