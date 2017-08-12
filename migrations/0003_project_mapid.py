# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cartoview_workforce_manager', '0002_task_group'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='mapid',
            field=models.IntegerField(default=0, null=True, blank=True),
        ),
    ]
