class TodoValidationError(Exception):
    """Raised when a create/update payload fails field checks."""

    def __init__(self, errors):
        super().__init__('Invalid todo payload')
        self.errors = errors
