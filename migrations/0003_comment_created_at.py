# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cartoview_workforce_manager', '0002_auto_20170810_0156'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='created_at',
            field=models.DateTimeField( auto_now_add=True),
            preserve_default=False,
        ),
    ]
