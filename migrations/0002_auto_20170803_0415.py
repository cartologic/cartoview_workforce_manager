# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('cartoview_workforce_manager', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='dispatchers',
            field=models.ManyToManyField(related_name='dispatchers', to=settings.AUTH_USER_MODEL),
        ),
    ]
