
# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from .models import Task,Project

admin.site.register(Task)
admin.site.register(Project)
