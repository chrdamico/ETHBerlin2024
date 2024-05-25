from django.db import models


class Task(models.Model):
    requester_address = models.CharField(max_length=40)
    executor_address = models.CharField(
        max_length=40, null=True, blank=True, default=None
    )
    task_description = models.TextField()
    bonus_date = models.DateTimeField(null=True, blank=True, default=None)
    deadline = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
