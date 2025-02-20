import { AiFillGoogleCircle } from 'react-icons/ai';
import { Button } from 'flowbite-react';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';

import { signInSuccess } from '../redux/user/userSlice';

import { useNavigate } from 'react-router-dom';

export default function OAuth() {
  const auth = getAuth(app);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: resultsFromGoogle.user.displayName,
            email: resultsFromGoogle.user.email,
            googlePhotoUrl: resultsFromGoogle.user.photoURL,
        }),
      })
  const data = await res.json()
  if (res.ok){
      dispatch(signInSuccess(data))
      navigate('/')
  }
    } catch (error) {
      console.log(error);              // ✅ Moved error logging inside the catch block
    }
  };

  return (
    <button
    onClick={handleGoogleClick}
    className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-black text-black bg-white rounded-md 
               hover:bg-gray-100 transition duration-300 ease-in-out"
  >
      <AiFillGoogleCircle className="w-6 h-6" />
      Continue with Google
    </button>
  );
}
