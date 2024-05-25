from typing import List

from django.core.exceptions import PermissionDenied
from django.forms import model_to_dict

from apps.entities import CreateTaskEntity, UpdateTaskEntity
from apps.task_board.models import Task


class TaskService:

    @classmethod
    def list_tasks(cls) -> List[dict]:
        return [model_to_dict(task) for task in Task.objects.all().order_by("created_at")]

    @classmethod
    def client_list(cls, address: str) -> List[dict]:
        return [model_to_dict(task) for task in Task.objects.filter(requester_address=address).order_by("created_at")]

    @classmethod
    def executor_list(cls, address: str) -> List[dict]:
        return [model_to_dict(task) for task in Task.objects.filter(executor_address=address).order_by("created_at")]

    @classmethod
    def create_task(cls, task_to_create: CreateTaskEntity) -> dict:
        task = Task.objects.create(
            requester_address=task_to_create.requester_address,
            task_description=task_to_create.task_description,
            task_title=task_to_create.task_title,
            price=task_to_create.price,
            deadline=task_to_create.deadline,
            bonus_date=task_to_create.bonus_date,
        )
        return model_to_dict(task)

    @classmethod
    def update_task(cls, task_to_update: UpdateTaskEntity) -> dict:
        task = Task.objects.get(id=task_to_update.id)
        if task.requester_address != task_to_update.requester_address or task.executor_address:
            raise PermissionDenied()

        task.task_description = task_to_update.task_description
        task.bonus_date = task_to_update.bonus_date
        task.deadline = task_to_update.deadline
        task.price = task_to_update.price
        task.task_title = task_to_update.task_title
        task.save()

        return model_to_dict(task)

    @classmethod
    def set_executor(cls, task_id: int, executor_address: str) -> dict:
        task = Task.objects.get(id=task_id)
        if task.executor_address:
            raise PermissionDenied()

        task.executor_address = executor_address
        task.save()
        return model_to_dict(task)
