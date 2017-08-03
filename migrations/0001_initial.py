# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('app_manager', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Project',
            fields=[
                ('appinstance_ptr', models.OneToOneField(parent_link=True, auto_created=True, primary_key=True, serialize=False, to='app_manager.AppInstance')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_by', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
                ('dispatchers', models.ManyToManyField(related_name='project_requests_dispatchers', to=settings.AUTH_USER_MODEL)),
                ('workers', models.ManyToManyField(related_name='project_requests_workers', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
            bases=('app_manager.appinstance',),
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=200)),
                ('short_description', models.CharField(max_length=200)),
                ('description', models.TextField(null=True, blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('due_date', models.DateTimeField(null=True, blank=True)),
                ('priority', models.IntegerField(default=3, choices=[(0, 'critical'), (1, 'high'), (2, 'medium'), (3, 'low'), (4, 'very low')])),
                ('status', models.IntegerField(default=1, choices=[(1, 'open'), (2, 'reopened'), (3, 'closed'), (4, 'duplicate'), (5, 'resolved')])),
                ('assigned_to', models.ForeignKey(related_name='task_requests_assigned_to', to=settings.AUTH_USER_MODEL)),
                ('created_by', models.ForeignKey(related_name='task_requests_created_by', to=settings.AUTH_USER_MODEL)),
                ('project', models.ForeignKey(to='cartoview_workforce_manager.Project')),
            ],
        ),
    ]
