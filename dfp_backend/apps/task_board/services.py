from typing import List

from django.core.exceptions import PermissionDenied

from apps.entities import CreateTaskEntity, UpdateTaskEntity, TaskEntity
from apps.task_board.models import Task


class TaskService:

    @classmethod
    def list_tasks(cls) -> List[TaskEntity]:
        return [TaskEntity.make(task) for task in Task.objects.all().order_by("created_at")]

    @classmethod
    def client_list(cls, address: str) -> List[TaskEntity]:
        return [TaskEntity.make(task) for task in Task.objects.filter(requester_address=address).order_by("created_at")]

    @classmethod
    def executor_list(cls, address: str) -> List[TaskEntity]:
        return [TaskEntity.make(task) for task in Task.objects.filter(executor_address=address).order_by("created_at")]

    @classmethod
    def create_task(cls, task_to_create: CreateTaskEntity) -> TaskEntity:
        task, _ = Task.objects.create(
            requester_address=task_to_create.requester_address,
            task_description=task_to_create.task_description,
            deadline=task_to_create.deadline,
            bonus_date=task_to_create.bonus_date,
        )
        return TaskEntity.make(task)

    @classmethod
    def update_task(cls, task_to_update: UpdateTaskEntity) -> TaskEntity:
        task = Task.objects.get(id=task_to_update.id)
        if task.requester_address != task_to_update.requester_address or task.executor_address:
            raise PermissionDenied()

        task.task_description = task_to_update.task_description
        task.bonus_date = task_to_update.bonus_date
        task.deadline = task_to_update.deadline
        task.save()

        return TaskEntity.make(task)

    @classmethod
    def set_executor(cls, task_id: int, executor_address: str) -> TaskEntity:
        task = Task.objects.get(id=task_id)
        if task.executor_address:
            raise PermissionDenied()

        task.executor_address = executor_address
        task.save()
        return TaskEntity.make(task)
