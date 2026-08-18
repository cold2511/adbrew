from datetime import datetime

from .errors import TodoValidationError

MAX_DESCRIPTION_LENGTH = 500


def parse_create_payload(data):
    if not isinstance(data, dict):
        raise TodoValidationError({'detail': 'Request body must be a JSON object.'})

    raw_description = data.get('description', data.get('todo'))
    if raw_description is None:
        raise TodoValidationError({'description': 'This field is required.'})
    if not isinstance(raw_description, str):
        raise TodoValidationError({'description': 'This field must be a string.'})

    description = raw_description.strip()
    if not description:
        raise TodoValidationError({'description': 'This field may not be blank.'})
    if len(description) > MAX_DESCRIPTION_LENGTH:
        raise TodoValidationError({
            'description': (
                f'Ensure this field has no more than {MAX_DESCRIPTION_LENGTH} characters.'
            )
        })

    return description


def serialize_todo(document):
    created_at = document.get('created_at')
    return {
        'id': str(document['_id']),
        'description': document.get('description', ''),
        'created_at': _format_created_at(created_at),
    }


def _format_created_at(created_at):
    if not isinstance(created_at, datetime):
        return None
    if created_at.tzinfo is None:
        return created_at.isoformat() + 'Z'
    return created_at.isoformat()
