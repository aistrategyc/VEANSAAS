import logging
import logging.config
from pathlib import Path
from typing import Dict


class ColorFormatter(logging.Formatter):
    COLORS = {
        'DEBUG': '\033[36m',
        'INFO': '\033[32m',
        'WARNING': '\033[33m',
        'ERROR': '\033[31m',
        'CRITICAL': '\033[1;31m',
    }
    RESET = '\033[0m'

    def format(self, record):
        level_color = self.COLORS.get(record.levelname, '')
        message = super().format(record)
        return f'{level_color}{message}{self.RESET}'


def configure_logging():
    LOG_CONFIG: Dict = {
        'level': 'DEBUG',
        'console_format': '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        'file_format': '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        'datefmt': '%Y-%m-%d %H:%M:%S',
        'log_dir': 'logs',
        'log_file': 'app.log',
        'max_size_mb': 10,
        'backup_count': 5,
    }

    log_dir = Path(LOG_CONFIG['log_dir'])
    log_dir.mkdir(exist_ok=True)
    log_file = log_dir / LOG_CONFIG['log_file']

    logging_config: Dict = {
        'version': 1,
        'disable_existing_loggers': False,
        'formatters': {
            'colored': {
                '()': ColorFormatter,
                'fmt': LOG_CONFIG['console_format'],
                'datefmt': LOG_CONFIG['datefmt'],
            },
            'file': {
                'fmt': LOG_CONFIG['file_format'],
                'datefmt': LOG_CONFIG['datefmt'],
            },
            'access': {
                'fmt': '%(asctime)s - %(client_addr)s - "%(request_line)s" %(status_code)s',
                'datefmt': LOG_CONFIG['datefmt'],
            },
        },
        'handlers': {
            'console': {
                'class': 'logging.StreamHandler',
                'formatter': 'colored',
                'stream': 'ext://sys.stdout',
            },
            'file': {
                'class': 'logging.handlers.RotatingFileHandler',
                'formatter': 'file',
                'filename': str(log_file),
                'maxBytes': LOG_CONFIG['max_size_mb'] * 1024 * 1024,
                'backupCount': LOG_CONFIG['backup_count'],
                'encoding': 'utf8',
            },
            'access_console': {
                'class': 'logging.StreamHandler',
                'formatter': 'access',
                'stream': 'ext://sys.stdout',
            },
        },
        'loggers': {
            '': {
                'handlers': ['console', 'file'],
                'level': LOG_CONFIG['level'],
            },
            'uvicorn': {
                'handlers': ['console'],
                'level': 'INFO',
                'propagate': False,
            },
            'uvicorn.error': {
                'level': 'INFO',
            },
            'uvicorn.access': {
                'handlers': ['access_console'],
                'level': 'INFO',
                'propagate': False,
            },
        },
    }

    logging.config.dictConfig(logging_config)
    logger = logging.getLogger(__name__)
    return logger


logger = configure_logging()
