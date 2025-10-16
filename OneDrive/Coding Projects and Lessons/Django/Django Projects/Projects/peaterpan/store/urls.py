from django.urls import path
from . import views
app_name = "store"

urlpatterns = [
    path("items/", views.show_products_list, name="show_products_list"), 
    path("item/<int:num>/", views.show_product_details, name="show_product_details"),
    path("item/add/", views.add_product, name="add_product"),
    path("cart/", views.show_cart, name="show_cart"),
    path("item/<int:product_id>/edit/", views.update_product, name="update_product"),
    path("transactions/", views.show_transactions, name="show_transactions"),
    path("selleritems/<int:id>/", views.show_products_of_seller, name="show_products_of_seller")
] 