#!/usr/bin/env python3
"""
Tiation AI Agents - Configuration Module
Central configuration management for the AI agents platform.
"""

import os
from typing import Optional, Dict, Any
from pydantic import BaseSettings, Field
from pydantic_settings import BaseSettings


class Config(BaseSettings):
    """Application configuration."""
    
    # Application settings
    app_name: str = Field(default="Tiation AI Agents", env="APP_NAME")
    app_version: str = Field(default="1.0.0", env="APP_VERSION")
    debug: bool = Field(default=False, env="DEBUG")
    
    # Server settings
    host: str = Field(default="0.0.0.0", env="HOST")
    port: int = Field(default=8080, env="PORT")
    
    # Database settings
    database_url: str = Field(default="sqlite:///./tiation_ai_agents.db", env="DATABASE_URL")
    
    # Redis settings
    redis_url: str = Field(default="redis://localhost:6379", env="REDIS_URL")
    
    # AI Model settings
    openai_api_key: Optional[str] = Field(default=None, env="OPENAI_API_KEY")
    openai_model: str = Field(default="gpt-3.5-turbo", env="OPENAI_MODEL")
    
    # Liberation System integration
    liberation_system_url: str = Field(default="http://localhost:3000", env="LIBERATION_SYSTEM_URL")
    liberation_system_api_key: Optional[str] = Field(default=None, env="LIBERATION_SYSTEM_API_KEY")
    liberation_mesh_node_id: str = Field(default="ai_agents_001", env="LIBERATION_MESH_NODE_ID")
    
    # Terminal Workflows settings
    terminal_workflows_enabled: bool = Field(default=True, env="TERMINAL_WORKFLOWS_ENABLED")
    
    # Enterprise Dashboard settings
    enterprise_dashboard_enabled: bool = Field(default=True, env="ENTERPRISE_DASHBOARD_ENABLED")
    
    # Security settings
    secret_key: str = Field(default="your-secret-key-change-in-production", env="SECRET_KEY")
    access_token_expire_minutes: int = Field(default=30, env="ACCESS_TOKEN_EXPIRE_MINUTES")
    
    # Logging settings
    log_level: str = Field(default="INFO", env="LOG_LEVEL")
    log_file: str = Field(default="logs/tiation_ai_agents.log", env="LOG_FILE")
    
    # Environment settings
    environment: str = Field(default="development", env="ENVIRONMENT")
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
    
    def __init__(self, config_path: Optional[str] = None):
        """Initialize configuration.
        
        Args:
            config_path: Path to configuration file
        """
        if config_path and os.path.exists(config_path):
            super().__init__(_env_file=config_path)
        else:
            super().__init__()
    
    @property
    def is_production(self) -> bool:
        """Check if running in production environment."""
        return self.environment.lower() == "production"
    
    @property
    def is_development(self) -> bool:
        """Check if running in development environment."""
        return self.environment.lower() == "development"
    
    def get_database_config(self) -> Dict[str, Any]:
        """Get database configuration."""
        return {
            "url": self.database_url,
            "echo": self.debug and not self.is_production
        }
    
    def get_redis_config(self) -> Dict[str, str]:
        """Get Redis configuration."""
        return {
            "url": self.redis_url
        }
    
    def get_ai_config(self) -> Dict[str, Any]:
        """Get AI model configuration."""
        return {
            "openai_api_key": self.openai_api_key,
            "openai_model": self.openai_model
        }
    
    def get_liberation_config(self) -> Dict[str, Any]:
        """Get Liberation System configuration."""
        return {
            "base_url": self.liberation_system_url,
            "api_key": self.liberation_system_api_key,
            "mesh_node_id": self.liberation_mesh_node_id
        }


# Global configuration instance
config = Config()
