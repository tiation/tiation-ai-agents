#!/usr/bin/env python3
"""
Tiation AI Agents - Metrics Collector
System and agent metrics collection and monitoring.
"""

import psutil
import time
from typing import Dict, Any, Optional
from datetime import datetime

from utils.logger import setup_logger


class MetricsCollector:
    """Collects system and agent metrics."""
    
    def __init__(self):
        """Initialize metrics collector."""
        self.logger = setup_logger(__name__)
        self.start_time = time.time()
    
    async def get_system_metrics(self) -> Dict[str, Any]:
        """Get system-wide metrics.
        
        Returns:
            Dictionary of system metrics
        """
        try:
            # CPU metrics
            cpu_percent = psutil.cpu_percent(interval=1)
            cpu_count = psutil.cpu_count()
            cpu_freq = psutil.cpu_freq()
            
            # Memory metrics
            memory = psutil.virtual_memory()
            memory_percent = memory.percent
            memory_available = memory.available
            memory_total = memory.total
            
            # Disk metrics
            disk = psutil.disk_usage('/')
            disk_percent = (disk.used / disk.total) * 100
            disk_free = disk.free
            disk_total = disk.total
            
            # Network metrics (basic)
            network = psutil.net_io_counters()
            network_sent = network.bytes_sent
            network_recv = network.bytes_recv
            
            # System uptime
            uptime = time.time() - self.start_time
            
            return {
                "cpu_percent": cpu_percent,
                "cpu_count": cpu_count,
                "cpu_freq": cpu_freq.current if cpu_freq else 0,
                "memory_percent": memory_percent,
                "memory_available": memory_available,
                "memory_total": memory_total,
                "disk_percent": disk_percent,
                "disk_free": disk_free,
                "disk_total": disk_total,
                "network_sent": network_sent,
                "network_recv": network_recv,
                "uptime": uptime,
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            self.logger.error(f"Error collecting system metrics: {e}")
            return {
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
    
    async def get_agent_metrics(self, agent_id: str) -> Dict[str, Any]:
        """Get metrics for a specific agent.
        
        Args:
            agent_id: Agent ID
            
        Returns:
            Dictionary of agent metrics
        """
        try:
            # Mock agent-specific metrics
            # In a real implementation, this would collect actual agent metrics
            import random
            
            return {
                "agent_id": agent_id,
                "cpu_usage": random.uniform(20, 80),
                "memory_usage": random.uniform(30, 90),
                "tasks_completed": random.randint(100, 1000),
                "tasks_failed": random.randint(0, 50),
                "uptime": random.randint(3600, 86400),
                "last_activity": datetime.now(),
                "performance_score": random.uniform(0.7, 1.0),
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            self.logger.error(f"Error collecting agent metrics for {agent_id}: {e}")
            return {
                "agent_id": agent_id,
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
    
    async def get_performance_metrics(self) -> Dict[str, Any]:
        """Get performance metrics.
        
        Returns:
            Dictionary of performance metrics
        """
        try:
            # Process metrics
            process = psutil.Process()
            process_memory = process.memory_info()
            process_cpu = process.cpu_percent()
            
            # Load average (Unix only)
            try:
                load_avg = psutil.getloadavg()
            except (AttributeError, OSError):
                load_avg = (0, 0, 0)
            
            return {
                "process_memory_rss": process_memory.rss,
                "process_memory_vms": process_memory.vms,
                "process_cpu_percent": process_cpu,
                "load_avg_1m": load_avg[0],
                "load_avg_5m": load_avg[1],
                "load_avg_15m": load_avg[2],
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            self.logger.error(f"Error collecting performance metrics: {e}")
            return {
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
    
    async def get_health_status(self) -> Dict[str, Any]:
        """Get system health status.
        
        Returns:
            Dictionary of health metrics
        """
        try:
            system_metrics = await self.get_system_metrics()
            
            # Determine health status based on metrics
            health_score = 100
            issues = []
            
            # Check CPU usage
            if system_metrics.get("cpu_percent", 0) > 80:
                health_score -= 20
                issues.append("High CPU usage")
            
            # Check memory usage
            if system_metrics.get("memory_percent", 0) > 85:
                health_score -= 25
                issues.append("High memory usage")
            
            # Check disk usage
            if system_metrics.get("disk_percent", 0) > 90:
                health_score -= 30
                issues.append("High disk usage")
            
            # Determine overall status
            if health_score >= 80:
                status = "healthy"
            elif health_score >= 60:
                status = "warning"
            else:
                status = "critical"
            
            return {
                "status": status,
                "health_score": max(health_score, 0),
                "issues": issues,
                "metrics": system_metrics,
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            self.logger.error(f"Error collecting health status: {e}")
            return {
                "status": "error",
                "health_score": 0,
                "issues": [f"Metrics collection error: {str(e)}"],
                "timestamp": datetime.now().isoformat()
            }
