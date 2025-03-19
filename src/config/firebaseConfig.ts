import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyAt5BMekm5vQbCgiuM7ED2Mdi48MOHEAQc',
  authDomain: 'techiegenie-25ed2.firebaseapp.com',
  projectId: 'techiegenie-25ed2',
  storageBucket: 'techiegenie-25ed2.appspot.com',
  messagingSenderId: '155026685991',
  appId: '1:155026685991:web:294e4a3e789db3b5a34e02',
  measurementId: 'G-W441MXH711'
};

// https://console.cloud.google.com/auth/clients/create?inv=1&invt=AbsdkQ&project=techiegenie-454216
const googlClientId = '499284150598-3mgdlrk7cctfmibq7gc1sd4h3v5otg16.apps.googleusercontent.com'

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const analytics = getAnalytics(app);

export { auth, googlClientId };
