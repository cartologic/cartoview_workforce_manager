# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib.gis.db import models
from django.conf import settings
from django.db.models import signals
from cartoview.app_manager.models import AppInstance
from geonode.base.models import ResourceBase
User = settings.AUTH_USER_MODEL
from geonode.people.models import Profile
from jsonfield import JSONField
from geonode.contrib.geosites.models import post_save_resource, post_delete_resource
from django.conf import settings

class Project(AppInstance):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    mapid= models.IntegerField(default=0,blank=True, null=True)
    Project_config = JSONField(blank=True, null=True) 
    priority = JSONField(blank=True, null=True) 
    status = JSONField(blank=True, null=True) 
    assigned_to= JSONField(blank=True, null=True) 
    Description=JSONField(blank=True, null=True) 
    due_date=JSONField(blank=True, null=True) 
    work_order=JSONField(blank=True, null=True) 
    Category = JSONField(blank=True, null=True) 
    workers = models.ManyToManyField(User,related_name='%(class)s_requests_workers',through='ProjectWorkers')
    dispatchers = models.ManyToManyField(User,related_name='%(class)s_requests_dispatchers',through='ProjectDispatchers')
    permissions = JSONField(blank=True, null=True) 
    logo = JSONField(blank=True, null=True)

class ProjectDispatchers(models.Model):
     dispatcher = models.ForeignKey(Profile, on_delete=models.CASCADE)
     project = models.ForeignKey(Project, on_delete=models.CASCADE)
    

class ProjectWorkers(models.Model):
     worker = models.ForeignKey(Profile, on_delete=models.CASCADE)
     project = models.ForeignKey(Project, on_delete=models.CASCADE)
    
class Task(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, related_name='%(class)s_requests_created_by', on_delete=models.CASCADE)
    assigned_to = models.ForeignKey(User, related_name='%(class)s_requests_assigned_to', on_delete=models.CASCADE,null=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    due_date = models.DateTimeField(null=True, blank=True)
    work_order=models.TextField(default=0,blank=True, null=True)
    Category= models.TextField(blank=True, null=True)
    x=models.DecimalField(blank=True, null=True ,max_digits=19, decimal_places=10)
    y=models.DecimalField(blank=True, null=True,max_digits=19, decimal_places=10)
    extent= models.TextField(blank=True, null=True)   
    priority = models.TextField(blank=True, null=True)
    status = models.TextField(blank=True, null=True)

class Comment(models.Model):
            commenter = models.ForeignKey(User, related_name='%(class)s_requests_commenter', on_delete=models.CASCADE)
            comment = models.TextField(blank=True, null=True)
            task =models.ForeignKey(Task, on_delete=models.CASCADE)
            created_at = models.DateTimeField(auto_now_add=True)
            
class Attachment(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='%(class)s_requests_user', on_delete=models.CASCADE)
    image = models.FileField()

class History(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    text = models.TextField(default=0,blank=True, null=True)

def appinstance_post_save(instance, *args, **kwargs):
    if not isinstance(instance, AppInstance):
        return True
signals.post_save.connect(appinstance_post_save,sender=Project)

if  'geonode.contrib.geosites' in settings.INSTALLED_APPS:
        signals.post_save.connect(post_save_resource, sender=Project)
        signals.post_delete.connect(post_delete_resource, sender=Project)