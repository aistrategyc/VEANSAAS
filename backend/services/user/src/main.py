from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from shared.config import settings

app = FastAPI(
    title='User',
    version='0.0.1',
    docs_url='/docs' if settings.DEBUG else None,
    redoc_url='/redoc' if settings.DEBUG else None,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)
