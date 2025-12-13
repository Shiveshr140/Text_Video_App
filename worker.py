import os
from celery import Celery
from simple_app import text_to_video, code_to_video, query_to_animated_video_v3

# Redis configuration from your org
REDIS_HOST = 'redis-10936.c264.ap-south-1-1.ec2.redns.redis-cloud.com'
REDIS_PORT = '10936'
REDIS_PASSWORD = 'HXcegHKO8Wg92K27iT6azObk1ayuULPP'
REDIS_DB = '0'  # Using DB 0 as in the Go example (default)

# Build Redis URL with key prefix for namespacing
REDIS_URL = f'redis://:{REDIS_PASSWORD}@{REDIS_HOST}:{REDIS_PORT}/{REDIS_DB}'

# Configure Celery (simplified - no global_keyprefix to avoid backend issues)
celery_app = Celery(
    'manim-tasks',  # App name acts as prefix
    broker=REDIS_URL,
    backend=REDIS_URL
)

# Configure task settings
celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
)

@celery_app.task(bind=True)
def task_text_to_video(self, text, language="english"):
    # Create a unique name so files don't overwrite each other
    output_name = f"text_job_{self.request.id}"
    
    # Run the actual heavy function
    result = text_to_video(text, output_name=output_name, audio_language=language)
    return result

@celery_app.task(bind=True)
def task_code_to_video(self, code, language="english"):
    output_name = f"code_job_{self.request.id}"
    result = code_to_video(code, output_name=output_name, audio_language=language)
    return result

@celery_app.task(bind=True)
def task_query_to_video(self, query, language="english"):
    output_name = f"query_job_{self.request.id}"
    result = query_to_animated_video_v3(query, output_name=output_name, audio_language=language)
    return result
