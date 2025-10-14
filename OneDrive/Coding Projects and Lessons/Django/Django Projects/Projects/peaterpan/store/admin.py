from django.contrib import admin
from .models import ProductType, Product, Transaction
from django.contrib import messages

# enables adding product type straight from product table
class ProductInline(admin.TabularInline):  
    model = Product

class ProductTypeAdmin(admin.ModelAdmin):
    model = ProductType
    search_fields = ('name', )
    list_display = ('id', 'name', 'description')  # Shows these readably
    ordering = ('name',)  # Orders ProductType alphabetically by name

    # got help from ChatGPT
    # fulfills: "determined by developers and cannot be modified by regular users"
    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser  # or some custom group check
    def has_add_permission(self, request):
        return request.user.is_superuser
    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser

class ProductAdmin(admin.ModelAdmin):
    model = Product
    search_fields = ('name', )
    list_display = ('id', 'name', 'product_type', 'owner', 'description', 'price', 'stock', 'status')  # Shows these readably
    ordering = ('name',)  # Orders Product alphabetically by name
    list_filter = ('product_type', 'owner', 'status')

    def save_model(self, request, obj, form, change):
        # Adjust status based on stock
        if obj.stock <= 0:
            obj.status = 'out_of_stock'
        elif obj.stock >= 1:
            obj.status = 'available'
        super().save_model(request, obj, form, change)

class TransactionAdmin(admin.ModelAdmin):
    model = Transaction
    search_fields = ('buyer', 'product' )
    list_display = ('buyer', 'product', 'amount', 'status', 'created_on')
    list_filter = ('buyer', 'product', 'status', 'created_on')

    def save_model(self, request, obj, form, change):
        if obj.amount <= obj.product.stock and obj.buyer != obj.product.owner:
            obj.product.stock -= obj.amount
            obj.product.save()
            super().save_model(request, obj, form, change)
        else:
            if obj.amount > obj.product.stock:
                messages.set_level(request, messages.ERROR)
                messages.error(request, "Transaction not saved: Amount exceeds stock.")
            if obj.buyer == obj.product.owner:
                messages.set_level(request, messages.ERROR)
                messages.error(request, "Transaction not saved: Buyer is same as owner.")

# models registered here.
admin.site.register(ProductType, ProductTypeAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(Transaction, TransactionAdmin)