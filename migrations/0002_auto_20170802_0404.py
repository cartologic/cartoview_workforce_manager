# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('cartoview_workforce_manager', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='project',
            old_name='project_description',
            new_name='description',
        ),
        migrations.RenameField(
            model_name='project',
            old_name='project_name',
            new_name='name',
        ),
        migrations.RenameField(
            model_name='task',
            old_name='task_description',
            new_name='description',
        ),
        migrations.RenameField(
            model_name='task',
            old_name='task_short_description',
            new_name='short_description',
        ),
        migrations.RenameField(
            model_name='task',
            old_name='task_title',
            new_name='title',
        ),
        migrations.AddField(
            model_name='project',
            name='workers',
            field=models.ManyToManyField(related_name='project_requests_workers', to=settings.AUTH_USER_MODEL),
        ),
    ]
