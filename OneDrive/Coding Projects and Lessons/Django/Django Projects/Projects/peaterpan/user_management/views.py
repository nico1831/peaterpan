from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect
from django.contrib import messages
from django.contrib.auth.models import User
from .models import Profile
from django.shortcuts import redirect
import uuid

def login_view(request):
    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse('store:show_products_list'))   
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            if hasattr(user, 'profile'):
                if user.profile.user_type == 'seller':
                    return HttpResponseRedirect(reverse('store:show_products_of_seller', args=[user.profile.id]))
                elif user.profile.user_type == 'buyer':
                    return HttpResponseRedirect(reverse('store:show_products_list'))
    return render(request, "user_management/login.html")

def logout_view(request):
    logout(request)
    return render(request, "user_management/login.html")

def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        display_name = request.POST["display_name"]
        email = request.POST["email"]
        user_type = request.POST["user_type"]

        business_doc = request.FILES.get("business_doc")
        naver_map_link = request.POST.get("naver_map_link")

        try:
            # Create User
            user = User.objects.create_user(username=username, password=password, email=email)
            user.save()

            # Create associated Profile
            profile = Profile.objects.create(
                user=user,
                display_name=display_name,
                email_address=email,
                user_type=user_type
            )

            # If seller, save business doc and Naver map link too
            if user_type == "seller":
                if business_doc:
                    profile.business_doc = business_doc
                if naver_map_link:
                    profile.naver_map_link = naver_map_link

                profile.save()

        except Exception as e:
            messages.error(request, "Username already taken or error occurred.")
            return render(request, "user_management/register.html")

        login(request, user)
        if user.profile.user_type == 'seller':
            # Redirect sellers to their seller-specific page
            return HttpResponseRedirect(reverse('store:show_products_of_seller', args=[user.profile.id]))
        elif user.profile.user_type == 'buyer':
            # Redirect buyers to the general products list page
            return HttpResponseRedirect(reverse('store:show_products_list'))
        else:
            # Optionally handle other user types or fallback
            return HttpResponseRedirect(reverse('store:some_default_page'))
 
    else:
        return render(request, "user_management/register.html")