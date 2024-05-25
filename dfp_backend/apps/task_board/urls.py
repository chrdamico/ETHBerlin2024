# urls.py
from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from apps.task_board.views import (
    create_task,
    board_list,
    client_list,
    executor_list,
    update_task,
    set_executor,
)

urlpatterns = [
    path("board/list/", board_list, name="board_list"),
    path("board/client/<str:address>/", client_list, name="client_list"),
    path("board/executor/<str:address>/", executor_list, name="executor_list"),
    path("task/create/", csrf_exempt(create_task), name="process_task"),
    path("task/update/", csrf_exempt(update_task), name="process_task"),
    path("task/take/", csrf_exempt(set_executor), name="set_executor"),
]
