# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('cartoview_workforce_manager', '0002_auto_20170802_0404'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='dispatchers',
            field=models.ManyToManyField(related_name='project_requests_dispatchers', to=settings.AUTH_USER_MODEL),
        ),
    ]
