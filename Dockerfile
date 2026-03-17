# Dockerfile para desplegar solo el backend FastAPI
# Esto hará que Railway/Render use este contenedor en lugar de intentar ejecutar el frontend

FROM python:3.12-slim

WORKDIR /app

# Instalar dependencias del backend
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el backend
COPY backend/ ./backend

EXPOSE 8000

# Ejecutar el backend en el puerto 8000
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
