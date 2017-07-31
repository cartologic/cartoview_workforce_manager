from django.conf.urls import patterns, url, include
from django.views.generic import TemplateView
from . import views, APP_NAME
from .api import TaskResource,UserResource,ProjectResource
from tastypie.api import Api

task_resource = TaskResource()
v1_api = Api(api_name='v1')
v1_api.register(TaskResource())
v1_api.register(UserResource())
v1_api.register(ProjectResource())

urlpatterns = patterns('',url(r'^new/$', views.new, name='%s.new' % APP_NAME),
url(r'^(?P<instance_id>\d+)/edit/$',views.edit, name='%s.edit' % APP_NAME),
url(r'^(?P<instance_id>\d+)/view/$',views.view_app, name='%s.view' % APP_NAME),
url(r'^api/', include(v1_api.urls)),

)
