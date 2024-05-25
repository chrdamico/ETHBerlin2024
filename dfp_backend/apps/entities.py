from dataclasses import dataclass
from datetime import datetime

from common.entities import BaseEntity


@dataclass
class CreateTaskEntity(BaseEntity):
    chain_task_id: int
    requester_address: str
    chain_task_id: int
    task_description: str
    task_title: str
    price: float
    deadline: datetime
    bonus_date: datetime = None


@dataclass
class UpdateTaskEntity(BaseEntity):
    id: int
    requester_address: str
    task_description: str
    bonus_date: datetime
    deadline: datetime
    task_title: str
    price: float
