import { Platform } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { ENV } from '@/config/env';

WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID = '276328703341-6hcs2f5fvt3i5lif4o2i9h4uqio3gakb.apps.googleusercontent.com';
const CLIENT_SECRET = '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';

export class GoogleAuthService {
  static async signIn() {
    try {
      const redirectUri = AuthSession.makeRedirectUri({
        useProxy: true,
      });

      console.log('Redirect URI:', redirectUri);

      const discovery = {
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenEndpoint: 'https://oauth2.googleapis.com/token',
        revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
      };

      const request = new AuthSession.AuthRequest({
        clientId: CLIENT_ID,
        scopes: ['openid', 'profile', 'email'],
        redirectUri,
        usePKCE: false,
      });

      const result = await request.promptAsync(discovery);

      if (result.type === 'success') {
        const { code } = result.params;
        
        // Exchange code for token
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri,
          }).toString(),
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.access_token) {
          // Get user info
          const userResponse = await fetch(
            `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenData.access_token}`
          );
          const userInfo = await userResponse.json();

          return {
            email: userInfo.email,
            name: userInfo.name,
            profileImage: userInfo.picture,
            id: userInfo.id,
          };
        } else {
          throw new Error('Failed to get access token');
        }
      } else {
        throw new Error('Sign in was cancelled or failed');
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  }

  static async signOut() {
    // No action needed for OAuth
  }

  static async authenticateWithBackend(googleUser: any) {
    try {
      const response = await fetch(`${ENV.API_BASE_URL}/api/app/google-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: googleUser.email,
          name: googleUser.name,
          profileImage: googleUser.profileImage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Authentication failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Backend authentication error:', error);
      throw error;
    }
  }
}