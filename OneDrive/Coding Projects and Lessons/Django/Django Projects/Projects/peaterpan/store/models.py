from django.db import models
from user_management.models import Profile
from django.core.validators import MinValueValidator

class ProductType(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    # Ensures that product types are displayed by their names (instead of IDs) in admin
    def __str__(self):
        return str(self.name) 
    
    # Orders ProductType alphabetically by name
    class Meta:
        ordering = ['name']  
        verbose_name = "Product Type"
        verbose_name_plural = "Product Types" 

class Product(models.Model):
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('on_sale', 'On sale'),
        ('out_of_stock', 'Out of stock'),
    ]

    name = models.CharField(max_length=255)
    product_type = models.ForeignKey(
        ProductType, 
        on_delete=models.SET_NULL, # When product type is deleted, all its products will have null product type
        null=True,  # Allows for null values
        blank=True,  # Allows for blank values
        related_name="products")
    owner = models.ForeignKey(
        Profile, 
        on_delete=models.CASCADE, 
        null=True,  
        blank=True,  
        related_name="owner")
    description = models.TextField()
    price = models.DecimalField(max_digits=20, decimal_places=2)  
    stock = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Available'
    )
    picture = models.ImageField(upload_to='product_pics/', null=True, blank=True)  # New field for product images

    # Ensures that products are displayed by their names (instead of IDs) in admin
    def __str__(self):
        return str(self.name) 


    # Orders Product alphabetically by name
    class Meta:
        ordering = ['name']  

class Transaction(models.Model):
    STATUS_CHOICES = [
        ('on_cart', 'On cart'),
        ('to_pay', 'To Pay'),
        ('to_ship', 'To Ship'),
        ('to_receive', 'To Receive'),
        ('delivered', 'Delivered'),
    ]

    buyer = models.ForeignKey(
        Profile, 
        on_delete=models.SET_NULL, 
        null=True,  
        blank=True,  
        related_name="buyer")
    product = models.ForeignKey(
        Product, 
        on_delete=models.SET_NULL, 
        null=True,  
        blank=True,  
        related_name="product")
    amount = models.IntegerField(
        validators=[MinValueValidator(1)],
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='on_cart',
    )
    created_on = models.DateTimeField(
        auto_now_add=True,
    )