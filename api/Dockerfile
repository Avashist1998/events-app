FROM python:3.8-slim

WORKDIR /code

COPY . /code/

# ENV SQLALCHEMY_DATABASE_URL "sqlite:////code/sql_app.db"
ENV PORT 3000
ENV MODE "prod"
ENV DEBUG "False"
ENV DOMAIN "events-app-api.avashist.com"

RUN pip install --no-cache-dir --upgrade pip && pip install --no-cache-dir -r requirements.txt

ENV PYTHONPATH "/code:${PYTHONPATH}"
EXPOSE 3000

CMD ["python3", "main.py"]