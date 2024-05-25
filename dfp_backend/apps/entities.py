from dataclasses import dataclass
from datetime import datetime

from common.entities import BaseEntity


@dataclass
class TaskEntity(BaseEntity):
    id: int
    requester_address: str
    executor_address: str
    task_description: str
    deadline: datetime
    created_at: datetime
    bonus_date: datetime = None


@dataclass
class CreateTaskEntity(BaseEntity):
    requester_address: str
    task_description: str
    deadline: datetime
    bonus_date: datetime = None


@dataclass
class UpdateTaskEntity(BaseEntity):
    id: int
    requester_address: str
    task_description: str
    bonus_date: datetime
    deadline: datetime
