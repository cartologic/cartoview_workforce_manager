from tastypie.authorization import Authorization
from tastypie.exceptions import Unauthorized


class CustomAuthorization(Authorization):
    def read_list(self, object_list, bundle):
        # This assumes a ``QuerySet`` from ``ModelResource``.
        print(bundle.request.user)
        # return object_list
        return object_list.filter(created_by=bundle.request.user)

    def read_detail(self, object_list, bundle):
        # Is the requested object owned by the user?
        # return bundle.obj.created_by == bundle.request.user
        pass
    def create_list(self, object_list, bundle):
        # Assuming they're auto-assigned to ``user``.
        return object_list

    def create_detail(self, object_list, bundle):
        # return bundle.obj.created_by == bundle.request.user
        pass
    def update_list(self, object_list, bundle):
        allowed = []

        # Since they may not all be saved, iterate over them.
        for obj in object_list:
            if obj.created_by == bundle.request.user:
                allowed.append(obj)

        return allowed

    def update_detail(self, object_list, bundle):
        # return bundle.obj.created_by == bundle.request.user
        pass
    def delete_list(self, object_list, bundle):

        return bundle.obj.created_by == bundle.request.user

    def delete_detail(self, object_list, bundle):
        # return bundle.obj.created_by == bundle.request.user
        pass