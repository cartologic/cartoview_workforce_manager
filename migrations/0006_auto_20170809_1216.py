# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cartoview_workforce_manager', '0005_attachment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='attachment',
            name='image',
            field=models.FileField(upload_to=b''),
        ),
    ]
