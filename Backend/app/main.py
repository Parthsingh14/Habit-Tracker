"""
Personal Tracker API entrypoint.

Wires together the MongoDB lifecycle, CORS, routers, and a consistent
error-response shape. Business logic intentionally does NOT live here -
see app/services for that.
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes import notes, sleep, tasks, tracker
from app.core.config import get_settings
from app.database.connection import close_mongo_connection, connect_to_mongo
from app.utils.exceptions import AppException

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()


app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Consistent error responses -------------------------------------------
# Every error from this API (client or server) comes back as:
#   { "error": true, "message": "...", "statusCode": <int> }
# so the frontend only needs one error-handling code path.

@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": True, "message": exc.message, "statusCode": exc.status_code},
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    first_error = exc.errors()[0] if exc.errors() else {}
    field = ".".join(str(loc) for loc in first_error.get("loc", []) if loc != "body")
    message = first_error.get("msg", "Invalid request")
    full_message = f"{field}: {message}" if field else message
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"error": True, "message": full_message, "statusCode": 422},
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"error": True, "message": "An unexpected error occurred", "statusCode": 500},
    )


# --- Routers ----------------------------------------------------------------
app.include_router(tasks.router)
app.include_router(tracker.router)
app.include_router(sleep.router)
app.include_router(notes.router)


@app.get("/api/health", tags=["health"])
async def health_check():
    return {"status": "ok"}
