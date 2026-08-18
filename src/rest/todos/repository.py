from datetime import datetime


class TodoRepository:
    """Persistence for todo documents. Uses the assignment's Mongo `db` handle."""

    COLLECTION_NAME = 'todos'

    def __init__(self, db):
        self._collection = db[self.COLLECTION_NAME]

    def list_all(self):
        return list(self._collection.find().sort('created_at', 1))

    def create(self, description):
        document = {
            'description': description,
            'created_at': datetime.utcnow(),
        }
        result = self._collection.insert_one(document)
        document['_id'] = result.inserted_id
        return document
