#!/usr/bin/env python3
"""
Tiation AI Agents - Logging Utility
Centralized logging configuration for the AI agents platform.
"""

import os
import sys
from loguru import logger
from typing import Optional


def setup_logger(name: str, log_level: str = "INFO", log_file: Optional[str] = None) -> logger:
    """Setup logger with consistent formatting and output.
    
    Args:
        name: Logger name
        log_level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        log_file: Optional log file path
        
    Returns:
        Configured logger instance
    """
    # Remove default logger
    logger.remove()
    
    # Create logs directory if it doesn't exist
    if log_file:
        os.makedirs(os.path.dirname(log_file), exist_ok=True)
    
    # Format for console output
    console_format = (
        "<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
        "<level>{level: <8}</level> | "
        "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> | "
        "<level>{message}</level>"
    )
    
    # Format for file output
    file_format = (
        "{time:YYYY-MM-DD HH:mm:ss} | "
        "{level: <8} | "
        "{name}:{function}:{line} | "
        "{message}"
    )
    
    # Add console handler
    logger.add(
        sys.stdout,
        format=console_format,
        level=log_level,
        colorize=True,
        backtrace=True,
        diagnose=True
    )
    
    # Add file handler if specified
    if log_file:
        logger.add(
            log_file,
            format=file_format,
            level=log_level,
            rotation="10 MB",
            retention="30 days",
            compression="zip",
            backtrace=True,
            diagnose=True
        )
    
    # Configure logger name
    logger.configure(extra={"name": name})
    
    return logger


# Default logger instance
default_logger = setup_logger("tiation_ai_agents", "INFO", "logs/tiation_ai_agents.log")
