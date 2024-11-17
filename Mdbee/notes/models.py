# notes/models.py

from django.db import models
from django.contrib.auth.models import User

class Note(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    audio_file = models.FileField(upload_to='audio/', null=True, blank=True)

    def __str__(self):
        return self.title
