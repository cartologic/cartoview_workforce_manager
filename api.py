from tastypie.resources import ModelResource, ALL, ALL_WITH_RELATIONS

from tastypie.authorization import Authorization
from tastypie.authentication import BasicAuthentication
from .models import Task, Project
from django.contrib.auth.models import User
from tastypie import fields
from django.core.urlresolvers import reverse
from tastypie.utils import trailing_slash
from django.conf.urls import url


class UserResource(ModelResource):
    class Meta:
        # queryset = User.objects.all()
        authorization = Authorization()
        authentication = BasicAuthentication()
        resource_name = 'user'
        filtering = {
            'username': ALL
        }


class ProjectResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'created_by')

    def get_tasks(self, request, **kwargs):
        if request.method == 'DELETE':
            return TaskResource().delete_list(request, project=kwargs['pk'])
        elif request.method == 'GET':
            return TaskResource().get_list(request, project=kwargs['pk'])

    def prepend_urls(self):
        return [
            url(r'^(?P<resource_name>%s)/(?P<pk>\w[\w/-]*)/tasks%s$' % (self._meta.resource_name, trailing_slash()),
                self.wrap_view('get_tasks'),
                name='api_get_tasks_for_project')
        ]

    def dehydrate(self, bundle):
        kwargs = dict(api_name='v1', resource_name=self._meta.resource_name, pk=bundle.data['id'])
        bundle.data['recipes_uri'] = reverse('api_get_tasks_for_project', kwargs=kwargs)
        return bundle

    class Meta:
        filtering = {
            'user': ALL_WITH_RELATIONS,
            'project_name': ALL,
            'id': ALL
        }
        queryset = Project.objects.all()
        resource_name = 'project'
        authorization = Authorization()
        authentication = BasicAuthentication()
        allowed_methods = ['get', 'post', 'put', 'delete']


class TaskResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'created_by')

    assigned_to = fields.ForeignKey(UserResource, 'assigned_to')
    project = fields.ForeignKey(ProjectResource, 'project')

    class Meta:
        filtering = {
            'user': ALL_WITH_RELATIONS,
            'assigned_to': ALL_WITH_RELATIONS,
            'project': ["exact", ]
        }

        queryset = Task.objects.all()
        resource_name = 'task'
        authorization = Authorization()
        authentication = BasicAuthentication()
        allowed_methods = ['get', 'post', 'put', 'delete']
