
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import admin
from .models import Task,Project,ProjectDispatchers,ProjectWorkers,Attachment


admin.site.register(ProjectDispatchers)
admin.site.register(ProjectWorkers)
admin.site.register(Attachment)
