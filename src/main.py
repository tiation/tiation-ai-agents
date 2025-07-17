#!/usr/bin/env python3
"""
Tiation AI Agents - Enterprise AI Automation Platform
Main application entry point for autonomous AI agents focused on business process automation.
"""

import asyncio
import logging
from typing import Dict, List, Optional

from core.agent_manager import AgentManager
from core.config import Config
from automation.process_automation import ProcessAutomation
from utils.logger import setup_logger


class TiationAIAgents:
    """Main application class for the Tiation AI Agents platform."""
    
    def __init__(self, config_path: Optional[str] = None):
        """Initialize the Tiation AI Agents platform.
        
        Args:
            config_path: Path to configuration file
        """
        self.config = Config(config_path)
        self.logger = setup_logger(__name__)
        self.agent_manager = AgentManager(self.config)
        self.process_automation = ProcessAutomation(self.config)
        
    async def start(self):
        """Start the AI agents platform."""
        self.logger.info("Starting Tiation AI Agents platform...")
        
        try:
            # Initialize agent manager
            await self.agent_manager.initialize()
            
            # Start process automation
            await self.process_automation.start()
            
            self.logger.info("Tiation AI Agents platform started successfully")
            
        except Exception as e:
            self.logger.error(f"Failed to start platform: {e}")
            raise
    
    async def stop(self):
        """Stop the AI agents platform."""
        self.logger.info("Stopping Tiation AI Agents platform...")
        
        await self.process_automation.stop()
        await self.agent_manager.shutdown()
        
        self.logger.info("Tiation AI Agents platform stopped")
    
    async def run(self):
        """Run the main application loop."""
        try:
            await self.start()
            # Keep the application running
            while True:
                await asyncio.sleep(1)
        except KeyboardInterrupt:
            self.logger.info("Received shutdown signal")
        finally:
            await self.stop()


async def main():
    """Main entry point."""
    app = TiationAIAgents()
    await app.run()


if __name__ == "__main__":
    asyncio.run(main())
