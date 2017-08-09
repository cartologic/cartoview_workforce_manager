# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cartoview_workforce_manager', '0003_auto_20170809_0843'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='work_order',
            field=models.TextField(default=0, null=True, blank=True),
        ),
    ]
