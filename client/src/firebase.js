import {initializeApp} from 'firebase/app';
import { getAuth } from '@firebase/auth';
import 'firebase/auth';

console.log(process.env);

const app=initializeApp({
    apiKey: process.env.REACT_APP_API_KEY.replace(/\\n/g, '\n'),
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDERID,
  appId: process.env.REACT_APP_ID
})

export const auth=getAuth(app);
export default app;