# this file is excuted from cartoview.app_manager.settings using exec_file
import os, sys
# import cartoview_workforce_manager
#
# app_folder = os.path.dirname(cartoview_workforce_manager.__file__)
INSTALLED_APPS += ('field_history',)

MIDDLEWARE_CLASSES += ('field_history.middleware.FieldHistoryMiddleware',)
