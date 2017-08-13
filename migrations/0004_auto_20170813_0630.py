# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cartoview_workforce_manager', '0003_project_mapid'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='extent',
            field=models.TextField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='task',
            name='x',
            field=models.DecimalField(null=True, max_digits=19, decimal_places=10, blank=True),
        ),
        migrations.AddField(
            model_name='task',
            name='y',
            field=models.DecimalField(null=True, max_digits=19, decimal_places=10, blank=True),
        ),
    ]
