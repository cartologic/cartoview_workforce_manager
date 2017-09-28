# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
from django.conf import settings
import jsonfield.fields


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('app_manager', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Attachment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('image', models.FileField(upload_to=b'')),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('comment', models.TextField(null=True, blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('commenter', models.ForeignKey(related_name='comment_requests_commenter', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='History',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('text', models.TextField(default=0, null=True, blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Project',
            fields=[
                ('appinstance_ptr', models.OneToOneField(parent_link=True, auto_created=True, primary_key=True, serialize=False, to='app_manager.AppInstance')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('mapid', models.IntegerField(default=0, null=True, blank=True)),
                ('Project_config', jsonfield.fields.JSONField(null=True, blank=True)),
                ('priority', jsonfield.fields.JSONField(null=True, blank=True)),
                ('status', jsonfield.fields.JSONField(null=True, blank=True)),
                ('assigned_to', jsonfield.fields.JSONField(null=True, blank=True)),
                ('Description', jsonfield.fields.JSONField(null=True, blank=True)),
                ('due_date', jsonfield.fields.JSONField(null=True, blank=True)),
                ('work_order', jsonfield.fields.JSONField(null=True, blank=True)),
                ('Category', jsonfield.fields.JSONField(null=True, blank=True)),
                ('permissions', jsonfield.fields.JSONField(null=True, blank=True)),
                ('logo', jsonfield.fields.JSONField(null=True, blank=True)),
                ('created_by', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
            bases=('app_manager.appinstance',),
        ),
        migrations.CreateModel(
            name='ProjectDispatchers',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('dispatcher', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
                ('project', models.ForeignKey(to='cartoview_workforce_manager.Project')),
            ],
        ),
        migrations.CreateModel(
            name='ProjectWorkers',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('project', models.ForeignKey(to='cartoview_workforce_manager.Project')),
                ('worker', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField(null=True, blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('due_date', models.DateTimeField(null=True, blank=True)),
                ('work_order', models.TextField(default=0, null=True, blank=True)),
                ('Category', models.TextField(null=True, blank=True)),
                ('x', models.DecimalField(null=True, max_digits=19, decimal_places=10, blank=True)),
                ('y', models.DecimalField(null=True, max_digits=19, decimal_places=10, blank=True)),
                ('extent', models.TextField(null=True, blank=True)),
                ('priority', models.TextField(null=True, blank=True)),
                ('status', models.TextField(null=True, blank=True)),
                ('assigned_to', models.ForeignKey(related_name='task_requests_assigned_to', to=settings.AUTH_USER_MODEL, null=True)),
                ('created_by', models.ForeignKey(related_name='task_requests_created_by', to=settings.AUTH_USER_MODEL)),
                ('project', models.ForeignKey(to='cartoview_workforce_manager.Project')),
            ],
        ),
        migrations.AddField(
            model_name='project',
            name='dispatchers',
            field=models.ManyToManyField(related_name='project_requests_dispatchers', through='cartoview_workforce_manager.ProjectDispatchers', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='project',
            name='workers',
            field=models.ManyToManyField(related_name='project_requests_workers', through='cartoview_workforce_manager.ProjectWorkers', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='history',
            name='task',
            field=models.ForeignKey(to='cartoview_workforce_manager.Task'),
        ),
        migrations.AddField(
            model_name='comment',
            name='task',
            field=models.ForeignKey(to='cartoview_workforce_manager.Task'),
        ),
        migrations.AddField(
            model_name='attachment',
            name='task',
            field=models.ForeignKey(to='cartoview_workforce_manager.Task'),
        ),
        migrations.AddField(
            model_name='attachment',
            name='user',
            field=models.ForeignKey(related_name='attachment_requests_user', to=settings.AUTH_USER_MODEL),
        ),
    ]
