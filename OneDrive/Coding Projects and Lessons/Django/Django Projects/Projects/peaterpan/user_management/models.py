from django.db import models
from django.contrib.auth.models import User
import uuid

class Profile(models.Model):
    USER_TYPE_CHOICES = (
        ('buyer', 'Buyer'),
        ('seller', 'Seller'),
    )
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    display_name = models.CharField(max_length=63)
    email_address = models.EmailField(max_length=200)
    user_type = models.CharField(max_length=6, choices=USER_TYPE_CHOICES, default='buyer')

    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    # New fields for verification
    verified = models.BooleanField(default=False)  # status of verification
    business_doc = models.FileField(upload_to='business_docs/', null=True, blank=True)  # upload document
    naver_map_link = models.URLField(max_length=500, null=True, blank=True)  # Naver map URL

    seller_id = models.UUIDField(default=None, null=True, blank=True, unique=True, editable=False)

    def __str__(self):
        return self.user.get_full_name() or self.user.username
