# Update your worker.py task functions to handle the new fields

# For task_text_to_video:
@celery_app.task(bind=True)
def task_text_to_video(self, content, language="english", renderer="remotion"):
    """
    Generate text to video
    New parameter: renderer (default: "remotion")
    """
    # Your existing code here
    # Just add renderer parameter, you don't need to use it if your backend doesn't support it yet
    pass

# For task_code_to_video:
@celery_app.task(bind=True)
def task_code_to_video(self, content, language="english", renderer="remotion", code_language="python"):
    """
    Generate code to video
    New parameters: 
    - renderer (default: "remotion")
    - code_language (default: "python")
    """
    # Your existing code here
    pass

# For task_query_to_video - NO CHANGES NEEDED:
@celery_app.task(bind=True)
def task_query_to_video(self, content, language="english"):
    """
    Generate query to animated video
    No changes needed for this one
    """
    # Your existing code here
    pass
