class Config(object):
    """Base config, uses staging database server."""
    TESTING         = False
    HOST_ADDRESS    = '0.0.0.0'
    PORT            = '5050'
    CACHE_TYPE      = "SimpleCache"
    CACHE_DEFAULT_TIMEOUT = 5000
    BEARER_TOKEN = 'AAAAAAAAAAAAAAAAAAAAAJynYwEAAAAAotrE1Q5Q%2FeqS%2BWOmUpXoLt9WkpE%3D1GuC7RziAHetzDjQ3vas7EPjHpw4QDGKeV2qDQy1FiiYP2O9Hv'
    GCS_DEVELOPER_KEY = 'AIzaSyC08hubwPeZ3klZROaXqip5r03kgueUJqo'
    GCS_CX = 'f2a6427427851e6d6'
class ProductionConfig(Config):
    """Uses production environment."""

    
class DevelopmentConfig(Config):
    DEBUG            = True
    """Uses development environment."""
    
class TestingConfig(Config):
    """Uses test environment."""
    DEBUG           = True
    TESTING         = True
