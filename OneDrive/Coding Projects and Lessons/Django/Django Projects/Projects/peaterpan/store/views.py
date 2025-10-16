from django.shortcuts import render
from .models import ProductType, Product, Transaction, Profile
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from .forms import ProductForm, TransactionForm
from django.shortcuts import redirect
from django.contrib import messages
from django.urls import reverse
from django.utils.html import escape

import folium
from user_management.models import Profile
from django.http import JsonResponse

def show_products_of_seller(request, id):
    user = request.user  # the logged-in user
    
    # if the user is logged in
    if request.user.is_authenticated:
        profile = Profile.objects.get(user=user)  # fetch the user's profile
    else:
        profile = None

    seller_profile = Profile.objects.get(id=id)
    products_of_seller = Product.objects.filter(owner=seller_profile)

    return render(request, "store/products_of_seller.html", {
        "products_of_seller": products_of_seller,
        "profile": profile,
        "seller_profile": seller_profile,
    })

def show_products_list(request):
    sellers = Profile.objects.filter(user_type='seller')

    # Create a map centered in SNU
    m = folium.Map(location=[37.459632748996476, 126.95178707050518], zoom_start=15)

    # Add a marker to the map for each station
    for seller in sellers:
        if seller.latitude is not None and seller.longitude is not None:
            coordinates = (seller.latitude, seller.longitude)
            # Generate URL to seller's products page
            seller_url = reverse("store:show_products_of_seller", args=[seller.id])
            # Create HTML popup with clickable link (escape seller.display_name to avoid injection)
            html = f'<a href="{seller_url}" target="_blank">{escape(seller.display_name)}</a>'
            popup = folium.Popup(html, max_width=300)
            folium.Marker(coordinates, popup=popup).add_to(m)

    map_context = {'map': m._repr_html_()}
    
    user = request.user  # the logged-in user

    # if the user is logged in
    if request.user.is_authenticated:
        profile = Profile.objects.get(user=user)  # fetch the user's profile
        is_users = Product.objects.filter(owner=profile)
        is_not_users = Product.objects.filter(~Q(owner=profile))
    else:
        profile = None
        is_users = None
        is_not_users = Product.objects.all()

    product_types = list(ProductType.objects.all())  # Converts QuerySet to list
    has_null_products = Product.objects.filter(product_type__isnull=True).exists()  # Checks if null product type exists

    # If there are products with no product type, "Others" category is added manually
    if has_null_products:
        product_types.append(ProductType(name="Others", description="Products with no particular product type"))

    return render(request, "store/products_list.html", {
        "users_products_list": is_users,
        "not_users_products_list": is_not_users,
        "user": user,
        "product_type_list": product_types,
        "product_list": Product.objects.all(),
        "null_product_type_list": Product.objects.filter(product_type__isnull=True),
        "profile": profile,
        "map_context": map_context,
    })


def show_product_details(request, num):
    user = request.user  # the logged-in user
    
    # if the user is logged in
    if request.user.is_authenticated:
        profile = Profile.objects.get(user=user)  # fetch the user's profile
    else:
        profile = None

    product_qs = Product.objects.filter(id=num) # returns queryset (for iterating in template)
    product_obj = Product.objects.get(id=num) # returns object (to get one field/attribute of object in template)

    if (request.method == "POST"):
        transaction_form = TransactionForm(request.POST, prefix="transaction")

        if not request.user.is_authenticated:
            return redirect('login') 

        if transaction_form.is_valid():
            transaction = transaction_form.save(commit=False) # Create but don't save yet

            # Prevent overselling
            if transaction.amount > product_obj.stock:
                messages.error(request, "Not enough stock available.")
                return redirect('store:show_product_details', num=num)  
            
            product_obj.stock -= transaction.amount # reduces stock based on quantity bought

            # change status based on stock
            if product_obj.stock <= 0: 
                product_obj.status = 'out_of_stock'
            elif product_obj.stock >= 1:
                product_obj.status = 'available'

            product_obj.save()

            transaction.buyer = profile # Set the desired field value
            transaction.product = product_obj
            transaction.save() # Now save to the database
        return redirect('store:show_cart')

    transaction_form = TransactionForm(prefix="transaction")

    return render(request, "store/product_details.html", {
        "product_qs": product_qs,
        "product_obj": product_obj,
        "profile": profile,
        'buy_product_form': transaction_form,
    })


@login_required(login_url='login')
def add_product(request):
    if (request.method == "POST"): 
        user = request.user  # the logged-in user
        profile = Profile.objects.get(user=user)  # fetch the user's profile
        product_form = ProductForm(request.POST, request.FILES, prefix="product")

        if product_form.is_valid():
            product = product_form.save(commit=False) # Create but don't save yet
            product.owner = profile # Set the desired field value
            if product.stock <= 0: 
                product.status = 'out_of_stock'
            elif product.stock >= 1 and product.status == 'on_sale':
                product.status = 'on_sale'
            elif product.stock >= 1:
                product.status = 'available'
            product.save() # Now save to the database

            return redirect('store:show_products_of_seller', id=profile.id)

        return redirect('store:show_products_list')
    
    product_form = ProductForm(prefix="product")

    return render(request, 'store/add_product.html', {
        'add_product_form': product_form,
    })

@login_required(login_url='login') 
def show_cart(request): 
    user = request.user 
    profile = Profile.objects.get(user=user) 
    transaction = Transaction.objects.filter(buyer=profile).order_by('product__owner__user__username', 'created_on') # filters transactions to what user has bought AND order it by name of seller
    return render(request, 'store/cart.html', {
        'transactions': transaction,
    })

@login_required(login_url='login') 
def update_product(request, product_id): 
    product = Product.objects.get(id=product_id)
    user = request.user  # the logged-in user
    
    # if the user is logged in
    if request.user.is_authenticated:
        profile = Profile.objects.get(user=user)  # fetch the user's profile
    else:
        profile = None

    if (request.method == "POST"): 
        product_form = ProductForm(request.POST, request.FILES, instance=product)

        if product_form.is_valid():
            # change status based on stock
            if product.stock <= 0: 
                product.status = 'out_of_stock'
            elif product.stock >= 1 and product.status == 'on_sale':
                product.status = 'on_sale'
            elif product.stock >= 1:
                product.status = 'available'
            
            product_form.save() # Now save to the database

            return redirect('store:show_products_of_seller', id=profile.id)

        return redirect('store:show_products_list')
    
    else:
        product_form = ProductForm(instance=product)  # Pre-filled with existing values

    return render(request, 'store/update.html', {
        'update_product_form': product_form,
    })

@login_required(login_url='login') 
def show_transactions(request): # show what user has sold
    user = request.user 
    profile = Profile.objects.get(user=user) 
    transactions = Transaction.objects.filter(product__owner=profile).order_by('buyer__user__username', 'created_on') # filters transactions to what user has sold AND order it by name of buyer

    return render(request, 'store/transactions.html', {
        'transactions': transactions,
    })