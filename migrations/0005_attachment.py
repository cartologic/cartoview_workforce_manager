# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('cartoview_workforce_manager', '0004_auto_20170809_0843'),
    ]

    operations = [
        migrations.CreateModel(
            name='Attachment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('image', models.FileField(upload_to='/images/')),
                ('task', models.ForeignKey(to='cartoview_workforce_manager.Task')),
                ('user', models.ForeignKey(related_name='attachment_requests_user', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
