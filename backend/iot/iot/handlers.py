from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist
import logging

def custom_exception_handler(exc, context):
    # Let DRF handle common exceptions first
    response = exception_handler(exc, context)

    if isinstance(exc, ObjectDoesNotExist):
        return Response({"error": "The requested object was not found."}, status=status.HTTP_404_NOT_FOUND)

    if response is None:
        # Log unhandled exceptions
        logging.exception("Unhandled exception occurred", exc_info=exc)
        return Response(
            {"error": "Internal server error. Please contact support."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return response
