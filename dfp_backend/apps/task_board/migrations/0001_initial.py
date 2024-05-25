# Generated by Django 5.0.6 on 2024-05-25 13:37

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Task",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("requester_address", models.CharField(max_length=40)),
                (
                    "executor_address",
                    models.CharField(
                        blank=True, default=None, max_length=40, null=True
                    ),
                ),
                ("task_description", models.TextField()),
                (
                    "bonus_date",
                    models.DateTimeField(blank=True, default=None, null=True),
                ),
                ("deadline", models.DateTimeField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]