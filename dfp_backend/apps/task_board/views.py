from django.http import JsonResponse, HttpResponse
from django.shortcuts import render

from apps.entities import CreateTaskEntity, UpdateTaskEntity
from apps.task_board.services import TaskService


# Create your views here.


def board_list(request):
    if request.method == "GET":
        tasks = TaskService.list_tasks()
        return JsonResponse({"items": [task.asdict() for task in tasks]})
    return HttpResponse(status=405)


def client_list(request, address: str):
    if request.method == "GET":
        tasks = TaskService.client_list(address=address)
        return JsonResponse({"items": [task.asdict() for task in tasks]})
    return HttpResponse(status=405)


def executor_list(request, address: str):
    if request.method == "GET":
        tasks = TaskService.executor_list(address=address)
        return JsonResponse({"items": [task.asdict() for task in tasks]})
    return HttpResponse(status=405)


def create_task(request):
    if request.method == "POST":
        task_to_create = CreateTaskEntity(
            requester_address=request.POST.get("requester_address"),
            task_description=request.POST.get("task_description"),
            deadline=request.POST.get("deadline"),
            bonus_date=request.POST.get("bonus_date"),
        )

        task = TaskService.create_task(task_to_create=task_to_create)
        return JsonResponse(status=200, data={"items": [task.asdict()]})
    return HttpResponse(status=405)


def update_task(request):
    if request.method == "POST":
        task_to_update = UpdateTaskEntity(
            id=request.POST.get("id"),
            requester_address=request.POST.get("requester_address"),
            task_description=request.POST.get("task_description"),
            deadline=request.POST.get("deadline"),
            bonus_date=request.POST.get("bonus_date"),
        )

        task = TaskService.update_task(task_to_update=task_to_update)
        return JsonResponse(status=200, data={"items": [task.asdict()]})

    return HttpResponse(status=405)


def set_executor(request):
    if request.method == "POST":
        TaskService.set_executor(task_id=request.POST.get("id"), executor_address=request.POST.get("executor_address"))

    return HttpResponse(status=405)
