#FROM node:20-alpine AS frontend-builder
#
#WORKDIR /app
#COPY ./client/ ./
#RUN npm install
#RUN npm run build

FROM python:3.12-slim AS backend

WORKDIR /app

COPY server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY server/app.py .
COPY server/init_db.py .
COPY server/constants.py .
COPY server/database/ ./database/
COPY server/data/.gitkeep ./data/
COPY server/routers/ ./routers/
COPY server/utils/ ./utils/

#COPY --from=frontend-builder /app/build/ ./frontend/

EXPOSE 8005

CMD ["sh", "-c", "gunicorn -k uvicorn.workers.UvicornWorker app:app --bind 0.0.0.0:$SERVER_PORT --workers $SERVER_WORKERS"]


### docker build -t food_tracker .
### docker run -p 8005:8005 --env-file .env -v food_tracker_data_volume:/app/data --name food_tracker-container food_tracker
