# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cartoview_workforce_manager', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='work_order',
            field=models.IntegerField(default=1, null=True, blank=True),
        ),
    ]
