# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('cartoview_workforce_manager', '0002_auto_20170803_0415'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='dispatchers',
            field=models.ManyToManyField(related_name='amira_dispatchers', to=settings.AUTH_USER_MODEL),
        ),
    ]
