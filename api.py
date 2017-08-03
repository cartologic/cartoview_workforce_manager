from tastypie.resources import ModelResource, ALL, ALL_WITH_RELATIONS
from tastypie.authorization import Authorization
from tastypie.authentication import BasicAuthentication
from .models import Task, Project
from tastypie import fields
from django.core.urlresolvers import reverse
from tastypie.utils import trailing_slash
from django.conf.urls import url
from django.contrib.auth import get_user_model
from pprint import pprint
from geonode.people.models import Profile
User = get_user_model()
from .customAuth import CustomAuthorization
class UserResource(ModelResource):
    class Meta:
        queryset = User.objects.all()
        authorization = Authorization()
        authentication = BasicAuthentication()
        resource_name = 'user'
        filtering = {
            'username': ALL
        }


class ProjectResource(ModelResource):
    created_by = fields.ForeignKey(UserResource, 'created_by')
    # dispatchers = fields.ToManyField(UserResource, 'dispatchers', full=True)

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
        bundle.data['tasks_uri'] = reverse('api_get_tasks_for_project', kwargs=kwargs)
        return bundle
    def dehydrate_user(self, bundle):
        bundle.data['user'] = {'username':bundle.obj.created_by.username}
        return bundle.data['user']

    def hydrate(self, bundle):
        bundle.obj.created_by = bundle.request.user
        return bundle

    class Meta:
        filtering = {
            'created_by': ALL_WITH_RELATIONS,
            'name': ALL,
            'id': ALL
        }
        queryset = Project.objects.all()
        resource_name = 'project'
        authorization = Authorization()
        authentication = BasicAuthentication()
        allowed_methods = ['get', 'post', 'put', 'delete']




class TaskResource(ModelResource):
    created_by = fields.ForeignKey(UserResource, 'created_by')
    assigned_to = fields.ForeignKey(UserResource, 'assigned_to')
    project = fields.ForeignKey(ProjectResource, 'project', full=True)

    def hydrate_created_by(self, bundle):
        bundle.obj.created_by = bundle.request.user
        return bundle
    class Meta:
        filtering = {
            'created_by': ALL_WITH_RELATIONS,
            'assigned_to': ALL_WITH_RELATIONS,
            'project': ["exact", ALL_WITH_RELATIONS ],
            'status': ALL,
            'priority': ALL,
            'description' : ALL
        }

        queryset = Task.objects.all()
        resource_name = 'task'
        authorization = CustomAuthorization()
        authentication = BasicAuthentication()
        allowed_methods = ['get', 'post', 'put', 'delete']
