from django.contrib import admin

from apps.task_board.models import Task


# Register your models here.
@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("id", "requester_address", "executor_address", "deadline", "bonus_date", "created_at")
    search_fields = ("requester_address", "executor_address")
    list_filter = ("created_at", "requester_address", "executor_address")
