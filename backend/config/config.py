class Config(object):
    """Base config, uses staging database server."""
    TESTING         = False
    HOST_ADDRESS    = '0.0.0.0'
    PORT            = '5050'
    CACHE_TYPE      = "SimpleCache"
    CACHE_DEFAULT_TIMEOUT = 5000
    
class ProductionConfig(Config):
    """Uses production environment."""

    
class DevelopmentConfig(Config):
    DEBUG            = True
    """Uses development environment."""
    
class TestingConfig(Config):
    """Uses test environment."""
    DEBUG           = True
    TESTING         = True
