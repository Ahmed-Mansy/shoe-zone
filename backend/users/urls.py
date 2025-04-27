# users/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView

router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    
    path('users/register/',views.registerUser,name="register"),
    path('activate/<uidb64>/<token>/',views.ActivateAccountView.as_view(),name='activate'),
    path('users/',views.getUsers,name="getUsers"),
    path('users/login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/profile/',views.getUserProfiles,name="getUserProfiles"),

    path('users/crud/', include(router.urls)),
    path('users/user/<int:id>/', views.User_Update_Delete.as_view()),
    path('users/profile/<int:id>/', views.ProfileView.as_view(), name='user_profile'),
]


