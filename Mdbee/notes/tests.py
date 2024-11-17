# notes/tests.py

from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User

class UserAuthTests(APITestCase):
    def setUp(self):
        self.register_url = '/register/'
        self.login_url = '/login/'
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpassword'
        }

    def test_register_user(self):
        response = self.client.post(self.register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('token', response.data)  # Check if token is returned

        # Verify that the user is created
        user_exists = User.objects.filter(username=self.user_data['username']).exists()
        self.assertTrue(user_exists)

    def test_login_user(self):
        # First, register the user
        self.client.post(self.register_url, self.user_data)

        # Now, attempt to log in
        login_data = {
            'username': self.user_data['username'],
            'password': self.user_data['password']
        }
        response = self.client.post(self.login_url, login_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)  # Check if token is returned

    def test_login_invalid_user(self):
        # Attempt to log in with invalid credentials
        login_data = {
            'username': 'invaliduser',
            'password': 'wrongpassword'
        }
        response = self.client.post(self.login_url, login_data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_register_existing_user(self):
        # First, register the user
        self.client.post(self.register_url, self.user_data)

        # Attempt to register the same user again
        response = self.client.post(self.register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
