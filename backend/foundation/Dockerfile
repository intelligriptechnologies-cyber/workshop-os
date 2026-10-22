FROM python:3.13-slim@sha256:cf50a4f6ac4f026458b08d5222023d700ac806410dff5e9ca8728fa44f2b850f
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /workspace
COPY requirements.lock /workspace/requirements.lock
RUN pip install --no-cache-dir -r requirements.lock
COPY .generated/candidate/ /workspace/
COPY foundation.py /workspace/foundation.py
COPY tests/ /workspace/foundation_tests/
RUN useradd --uid 10001 --create-home foundation
USER 10001
CMD ["uvicorn", "foundation:app", "--host", "0.0.0.0", "--port", "8000", "--no-access-log"]
