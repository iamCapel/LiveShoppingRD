from datetime import datetime
import hashlib
import os
import uuid

from fastapi import FastAPI, Depends, HTTPException, Header, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy import (Column, DateTime, ForeignKey, Integer, String,
                        create_engine)
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from starlette.config import Config
from starlette.requests import Request
from starlette.responses import RedirectResponse

# Cargar configuración desde .env
config = Config('.env')
BASE_URL = config('BASE_URL', default='http://localhost:8000')
FRONTEND_URL = config('FRONTEND_URL', default='http://localhost:5173')

app = FastAPI()

# CORS para que la app web pueda comunicarse desde cualquier origen
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


DATABASE_URL = "sqlite:///./data.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)
Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)  # seller | buyer
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Session(Base):
    __tablename__ = "sessions"

    token = Column(String, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")


Base.metadata.create_all(bind=engine)


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def verify_password(password: str, hashed: str) -> bool:
    return hash_password(password) == hashed


def create_token() -> str:
    return uuid.uuid4().hex


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_user_by_token(token: str, db):
    session = db.query(Session).filter(Session.token == token).first()
    return session.user if session else None


def create_session_for_user(user, db):
    token = create_token()
    session = Session(token=token, user_id=user.id)
    db.add(session)
    db.commit()
    return token


def get_or_create_oauth_user(email: str, name: str, user_type: str, db):
    # Si ya existe un usuario con ese email, retornarlo
    user = db.query(User).filter(User.email == email.lower()).first()
    if user:
        return user

    # Generar username único a partir del email
    base_username = email.split('@')[0]
    username = base_username
    suffix = 1
    while db.query(User).filter(User.username == username).first():
        username = f"{base_username}{suffix}"
        suffix += 1

    user = User(
        email=email.lower(),
        username=username,
        name=name,
        type=user_type,
        hashed_password=hash_password(uuid.uuid4().hex),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


class AuthResponse(BaseModel):
    id: int
    email: EmailStr
    username: str
    name: str
    type: str
    token: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    username: str
    name: str
    # Tipo de usuario (seller | buyer). Se usa "buyer" por defecto si no se envía.
    type: str = "buyer"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


@app.get("/")
def read_root():
    return {"message": "Backend LiveShoppingRD listo"}




@app.post("/api/register", response_model=AuthResponse)
def register(data: RegisterRequest, db=Depends(get_db)):
    existing = db.query(User).filter((User.email == data.email) | (User.username == data.username)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email o usuario ya utilizado")

    user = User(
        email=data.email.lower(),
        username=data.username,
        name=data.name,
        type=getattr(data, 'type', 'buyer'),
        hashed_password=hash_password(data.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_token()
    session = Session(token=token, user_id=user.id)
    db.add(session)
    db.commit()

    return AuthResponse(
        id=user.id,
        email=user.email,
        username=user.username,
        name=user.name,
        type=user.type,
        token=token,
    )


@app.post("/api/login", response_model=AuthResponse)
def login(data: LoginRequest, db=Depends(get_db)):
    user = db.query(User).filter(User.email == data.email.lower()).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    token = create_token()
    session = Session(token=token, user_id=user.id)
    db.add(session)
    db.commit()

    return AuthResponse(
        id=user.id,
        email=user.email,
        username=user.username,
        name=user.name,
        type=user.type,
        token=token,
    )


@app.get("/api/me", response_model=AuthResponse)
def me(authorization: str = Header(None), db=Depends(get_db)):
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="No autorizado")

    token = authorization.split(" ", 1)[1].strip()
    user = get_user_by_token(token, db)
    if not user:
        raise HTTPException(status_code=401, detail="Token inválido")

    return AuthResponse(
        id=user.id,
        email=user.email,
        username=user.username,
        name=user.name,
        type=user.type,
        token=token,
    )


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    await websocket.send_text("WebSocket conectado")
    await websocket.close()
