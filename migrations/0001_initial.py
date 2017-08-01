# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import jsonfield.fields
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('project_name', models.CharField(max_length=200)),
                ('project_description', models.CharField(max_length=200)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('config', jsonfield.fields.JSONField(default=dict)),
                ('created_by', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('task_title', models.CharField(max_length=200)),
                ('task_short_description', models.CharField(max_length=200)),
                ('task_description', models.TextField(null=True, blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('due_date', models.DateTimeField(null=True, blank=True)),
                ('priority', models.CharField(default=3, max_length=2, choices=[(0, 'critical'), (1, 'high'), (2, 'medium'), (3, 'low'), (4, 'very low')])),
                ('status', models.CharField(default=3, max_length=2, choices=[(1, 'open'), (2, 'reopened'), (3, 'closed'), (4, 'duplicate'), (5, 'resolved')])),
                ('assigned_to', models.ForeignKey(related_name='task_requests_assigned_to', to=settings.AUTH_USER_MODEL)),
                ('created_by', models.ForeignKey(related_name='task_requests_created_by', to=settings.AUTH_USER_MODEL)),
                ('project', models.ForeignKey(to='cartoview_tasks_manager.Project')),
            ],
        ),
    ]
