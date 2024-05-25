# urls.py
from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from apps.task_board.views import prompt, create_task, create_message, accept_command, decline_command

urlpatterns = [
    path("board/list/", board_list, name="board_list"),
    path("board/client/<str:address>/", client_list, name="client_list"),
    path("board/executor/<str:address>/", executor_list, name="executor_list"),
    path("task/create/", create_task, name="process_task"),
    path("task/update/", update_task, name="process_task"),
    path("task/take/", set_executor, name="set_executor"),
]
