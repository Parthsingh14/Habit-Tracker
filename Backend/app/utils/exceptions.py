"""
Application-level exceptions.

Raised from services/repositories and translated into a consistent JSON
error shape by the handlers registered in main.py:

    { "error": true, "message": "...", "statusCode": 404 }
"""


class AppException(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class NotFoundException(AppException):
    def __init__(self, message: str = "Resource not found"):
        super().__init__(message, status_code=404)


class ValidationException(AppException):
    def __init__(self, message: str = "Invalid request"):
        super().__init__(message, status_code=422)


class ConflictException(AppException):
    def __init__(self, message: str = "Conflicting state"):
        super().__init__(message, status_code=409)
