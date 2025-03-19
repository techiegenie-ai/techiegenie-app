// src/features/auth/googleAuth.ts
import { googlClientId, auth } from '@/config/firebaseConfig';
import { openUrl } from '@tauri-apps/plugin-opener';
import { GoogleAuthProvider, signInWithCredential, AuthCredential } from 'firebase/auth';

/**
 * Configuration options for Google OAuth flow
 */
interface GoogleAuthConfig {
  responseType: string;
  clientId: string;
  redirectUri: string;
  scope: string;
  prompt: string;
}

/**
 * Constructs the Google OAuth consent URL with provided parameters
 * @param port - The local server port for redirect URI
 * @returns The constructed OAuth URL string
 */
const buildConsentUrl = (port: string): string => {
  const config: GoogleAuthConfig = {
    responseType: 'token',
    clientId: googlClientId,
    redirectUri: `http://localhost:${port}`,
    scope: 'email profile openid',
    prompt: 'consent'
  };

  const params = new URLSearchParams({
    'response_type': config.responseType,
    'client_id': config.clientId,
    'redirect_uri': config.redirectUri,
    'scope': config.scope,
    'prompt': config.prompt
  });

  return `https://accounts.google.com/o/oauth2/auth?${params.toString()}`;
};

/**
 * Opens the browser to Google's OAuth consent screen
 * @param port - The local server port for redirect URI
 * @returns Promise that resolves when the URL is opened
 * @throws {Error} If browser fails to open
 */
const openBrowserToConsent = async (port: string): Promise<void> => {
  const consentUrl = buildConsentUrl(port);
  await openUrl(consentUrl);
};

/**
 * Initiates Google Sign-In flow by opening the consent screen
 * @param port - The local server port for redirect URI
 * @returns Promise that resolves when the browser opens
 * @throws {Error} If browser fails to open or port is invalid
 * @example
 * ```typescript
 * await openGoogleSignIn('8080');
 * ```
 */
export const openGoogleSignIn = async (port: string): Promise<void> => {
  if (!port || isNaN(Number(port))) {
    throw new Error('Invalid port number provided');
  }

  try {
    await openBrowserToConsent(port);
  } catch (error) {
    console.error('Failed to open Google consent screen:', error);
    throw error;
  }
};

/**
 * Processes Google Sign-In callback and authenticates with Firebase
 * @param payload - The redirect URL containing the access token
 * @returns Promise that resolves when authentication is complete
 * @throws {Error} If token extraction or authentication fails
 * @example
 * ```typescript
 * await googleSignIn('http://localhost:8080#access_token=xyz');
 * ```
 */
export const googleSignIn = async (payload: string): Promise<void> => {
  try {
    const url = new URL(payload);
    const params = new URLSearchParams(url.hash.substring(1));
    const accessToken = params.get('access_token');

    if (!accessToken) {
      throw new Error('No access token found in callback URL');
    }

    const credential: AuthCredential = GoogleAuthProvider.credential(null, accessToken);
    
    await signInWithCredential(auth, credential);
  } catch (error) {
    console.error('Google Sign-In failed:', {
      message: (error as Error).message,
      payload
    });
    throw error;
  }
};
