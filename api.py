from tastypie.resources import ModelResource, ALL, ALL_WITH_RELATIONS
from tastypie.authorization import Authorization
from tastypie.authentication import BasicAuthentication
from .models import Task, Project
from tastypie import fields
from django.core.urlresolvers import reverse
from tastypie.utils import trailing_slash
from django.conf.urls import url
from django.contrib.auth import get_user_model
User = get_user_model()

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
            'user': ALL_WITH_RELATIONS,
            'project_name': ALL,
            'id': ALL
        }
        queryset = Project.objects.all()
        resource_name = 'project'
        authorization = Authorization()
        authentication = BasicAuthentication()
        allowed_methods = ['get', 'post', 'put', 'delete']


    def obj_create(self, bundle, request=None, **kwargs):
        print ("Entered Order Create")
        print(bundle)
        print("self",self)
        bundle.obj.user="/apps/cartoview_tasks_manager/api/v1/user/1001/"
        print(bundle.obj)
        print(bundle.obj.user)
        return super(ProjectResource, self).obj_create(bundle, request=request, **kwargs)


class TaskResource(ModelResource):
    user = fields.ForeignKey(UserResource, 'created_by')
    assigned_to = fields.ForeignKey(UserResource, 'assigned_to')
    project = fields.ForeignKey(ProjectResource, 'project')

    def hydrate(self, bundle):
        bundle.obj.created_by = bundle.request.user
        return bundle

    class Meta:
        filtering = {
            'user': ALL_WITH_RELATIONS,
            'assigned_to': ALL_WITH_RELATIONS,
            'project': ["exact", ],
            'status': ALL,
            'priority': ALL
        }

        queryset = Task.objects.all()
        resource_name = 'task'
        authorization = Authorization()
        authentication = BasicAuthentication()
        allowed_methods = ['get', 'post', 'put', 'delete']
