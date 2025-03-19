import { googlClientId } from '@/config/firebaseConfig';
import { openUrl } from '@tauri-apps/plugin-opener';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '@/config/firebaseConfig';




const openBrowserToConsent = (port: string) => {
  // Must allow localhost as redirect_uri for CLIENT_ID on GCP: https://console.cloud.google.com/apis/credentials
  return openUrl('https://accounts.google.com/o/oauth2/auth?' +
    'response_type=token&' +
    `client_id=${googlClientId}&` +
    `redirect_uri=http%3A//localhost:${port}&` +
    'scope=email%20profile%20openid&' +
    'prompt=consent'
  );
};

export const openGoogleSignIn = (port: string) => {
  return new Promise((resolve, reject) => {
    openBrowserToConsent(port).then(resolve).catch(reject);
  });
};

export const googleSignIn = (payload: string) => {
  const url = new URL(payload);
  // Get `access_token` from redirect_uri param
  const access_token = new URLSearchParams(url.hash.substring(1)).get('access_token');

  if (!access_token) return;

  const credential = GoogleAuthProvider.credential(null, access_token);

  signInWithCredential(auth, credential)
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
    });
};
