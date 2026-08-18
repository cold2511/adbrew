import logging
import os

from pymongo import MongoClient
from pymongo.errors import PyMongoError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from todos.documents import parse_create_payload, serialize_todo
from todos.errors import TodoValidationError
from todos.repository import TodoRepository

logger = logging.getLogger(__name__)

mongo_uri = 'mongodb://' + os.environ["MONGO_HOST"] + ':' + os.environ["MONGO_PORT"]
db = MongoClient(mongo_uri, serverSelectionTimeoutMS=3000)['test_db']
todos = TodoRepository(db)


class TodoListView(APIView):
    def get(self, request):
        try:
            documents = todos.list_all()
        except PyMongoError:
            logger.exception('Failed to list todos')
            return Response(
                {'detail': 'Could not load todos. Please try again.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        return Response(
            [serialize_todo(document) for document in documents],
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        try:
            description = parse_create_payload(request.data)
            document = todos.create(description)
        except TodoValidationError as exc:
            return Response(exc.errors, status=status.HTTP_400_BAD_REQUEST)
        except PyMongoError:
            logger.exception('Failed to create todo')
            return Response(
                {'detail': 'Could not save todo. Please try again.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        return Response(serialize_todo(document), status=status.HTTP_201_CREATED)
