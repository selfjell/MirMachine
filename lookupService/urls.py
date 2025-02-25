from django.urls import path
from .views import get_job, PostJob, get_tree, get_families, get_included_families, \
    get_results, download_results, check_if_new_client, check_if_user_can_post
from .consumers import MonitorConsumer

urlpatterns = [
    path('jobs/', PostJob.as_view()),
    path('job/<str:_id>', get_job),
    path('tree/', get_tree),
    path('families/', get_families),
    path('relations/', get_included_families),
    path('result/<str:_id>', get_results),
    path('download/<str:_id>', download_results),
    path('cookiePrompt/', check_if_new_client),
    path('userCanPost/', check_if_user_can_post)
]

websocket_patterns = [
    path('ws/job/<str:species>', MonitorConsumer.as_asgi())
]