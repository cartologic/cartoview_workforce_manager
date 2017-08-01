# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib.gis.db import models
from django.conf import settings
from django.contrib.auth import get_user_model
from jsonfield import JSONField
from cartoview.app_manager.models import AppInstance
User = settings.AUTH_USER_MODEL

class Project(models.Model):
    project_name = models.CharField(max_length=200)
    project_description = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    config = JSONField()
    app_instance = models.OneToOneField(
        AppInstance,
        on_delete=models.CASCADE,

    )

class Task(models.Model):
    task_title = models.CharField(max_length=200)
    task_short_description = models.CharField(max_length=200)
    task_description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, related_name='%(class)s_requests_created_by', on_delete=models.CASCADE)
    assigned_to = models.ForeignKey(User, related_name='%(class)s_requests_assigned_to', on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    due_date = models.DateTimeField(null=True, blank=True)
    PRIORITY_CHOICES = (
        (0, 'critical'),
        (1, 'high'),
        (2, 'medium'),
        (3, 'low'),
        (4,'very low')
    )
    STATUS_CHOICES = (
        (1, 'open'),
        (2, 'reopened'),
        (3, 'closed'),
        (4, 'duplicate'),
        (5, 'resolved')
    )
    priority = models.IntegerField(
        choices=PRIORITY_CHOICES,
        default=3,
    )
    status = models.IntegerField(
        
        choices=STATUS_CHOICES,
        default=1,
    )
