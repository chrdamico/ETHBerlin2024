import json

from django.http import JsonResponse, HttpResponse

from apps.entities import CreateTaskEntity, UpdateTaskEntity
from apps.task_board.services import TaskService


# Create your views here.


def board_list(request):
    if request.method == "GET":
        tasks = TaskService.list_tasks()
        return JsonResponse({"items": tasks})
    return HttpResponse(status=405)


def client_list(request, address: str):
    if request.method == "GET":
        tasks = TaskService.client_list(address=address)
        return JsonResponse({"items": tasks})
    return HttpResponse(status=405)


def executor_list(request, address: str):
    if request.method == "GET":
        tasks = TaskService.executor_list(address=address)
        return JsonResponse({"items": tasks})
    return HttpResponse(status=405)


def create_task(request):
    if request.method == "POST":
        task_to_create = CreateTaskEntity(**json.loads(request.body))

        task = TaskService.create_task(task_to_create=task_to_create)
        return JsonResponse(status=200, data={"items": [task]})
    return HttpResponse(status=405)


def update_task(request):
    if request.method == "POST":
        task_to_update = UpdateTaskEntity(**json.loads(request.body))

        task = TaskService.update_task(task_to_update=task_to_update)
        return JsonResponse(status=200, data={"items": [task]})

    return HttpResponse(status=405)


def set_executor(request):
    if request.method == "POST":
        task = TaskService.set_executor(**json.loads(request.body))
        return JsonResponse(status=200, data={"items": [task]})

    return HttpResponse(status=405)
