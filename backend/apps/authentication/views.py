from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from apps.authentication.serializers import UserSerializer, RegisterUserSerializer

User = get_user_model()

class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.IsAdminUser] # Only admins/research leads can add intern doctor accounts
    serializer_class = RegisterUserSerializer