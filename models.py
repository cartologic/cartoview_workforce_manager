# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib.gis.db import models
from django.conf import settings
from django.db.models import signals
from cartoview.app_manager.models import AppInstance
User = settings.AUTH_USER_MODEL
from jsonfield import JSONField
class Project(AppInstance):
    #project_name = models.CharField(max_length=200)
    #project_description = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    mapid= models.IntegerField(default=0,blank=True, null=True)
    Project_config = JSONField(blank=True, null=True)
    workers = models.ManyToManyField(User,related_name='%(class)s_requests_workers',through='ProjectWorkers')
    dispatchers = models.ManyToManyField(User,related_name='%(class)s_requests_dispatchers',through='ProjectDispatchers')
    #app_instance = models.OneToOneField(AppInstance,on_delete=models.CASCADE)
    

class ProjectDispatchers(models.Model):
     dispatcher = models.ForeignKey(User, on_delete=models.CASCADE)
     project = models.ForeignKey(Project, on_delete=models.CASCADE)
    

class ProjectWorkers(models.Model):
     worker = models.ForeignKey(User, on_delete=models.CASCADE)
     project = models.ForeignKey(Project, on_delete=models.CASCADE)
    
class Task(models.Model):
    title = models.CharField(max_length=200)
    short_description = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, related_name='%(class)s_requests_created_by', on_delete=models.CASCADE)
    assigned_to = models.ForeignKey(User, related_name='%(class)s_requests_assigned_to', on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    due_date = models.DateTimeField(null=True, blank=True)
    work_order=models.TextField(default=0,blank=True, null=True)
    group= models.TextField(blank=True, null=True)
    x=models.DecimalField(blank=True, null=True ,max_digits=19, decimal_places=10)
    y=models.DecimalField(blank=True, null=True,max_digits=19, decimal_places=10)
    extent= models.TextField(blank=True, null=True)
   
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

    history = HistoricalRecords(excluded_fields=['priority','extent','x','y','work_order','due_date','created_by','created_at','title','description','short_description','updated_at'])
class Comment(models.Model):
            commenter = models.ForeignKey(User, related_name='%(class)s_requests_commenter', on_delete=models.CASCADE)
            comment = models.TextField(blank=True, null=True)
            task =models.ForeignKey(Task, on_delete=models.CASCADE)
            created_at = models.DateTimeField(auto_now_add=True)
            
class Attachment(models.Model):
    task =models.ForeignKey(Task, on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='%(class)s_requests_user', on_delete=models.CASCADE)
    image = models.FileField()
    
def appinstance_post_save(instance, *args, **kwargs):
    if not isinstance(instance, AppInstance):
        return True
signals.post_save.connect(appinstance_post_save,sender=Project)
