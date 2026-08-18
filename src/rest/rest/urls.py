from django.urls import path
from .views import TodoListView

urlpatterns = [
    path('todos/', TodoListView.as_view(), name='todo-list'),

    path('todos', TodoListView.as_view(), name='todo-list-no-slash'),
]
