from django.db import models


class Task(models.Model):
    requester_address = models.CharField(max_length=40)
    executor_address = models.CharField(max_length=40, null=True, blank=True, default=None)
    chain_task_id = models.IntegerField()
    task_title = models.CharField(max_length=120)
    task_description = models.TextField()
    price = models.FloatField()
    bonus_date = models.DateTimeField(null=True, blank=True, default=None)
    deadline = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
