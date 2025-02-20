import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill all the fields'));
    }
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('/home');
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-10"
      >
        <source src="/sign.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* SignIn Form */}
      <div className="relative z-20 max-w-md w-full bg-white p-8 rounded-2xl shadow-2xl">
        <div className="mb-8 text-center">
          <Link to="/" className="font-extrabold text-3xl text-black">
            Hans Blog
          </Link>
          <p className="text-sm mt-2 text-gray-500">
            Sign in with your email or Google
          </p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div>
            <Label className="text-black" value="Your email" />
            <TextInput
              className="mt-2 text-black placeholder-gray-400 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
              type="email"
              placeholder="name@company.com"
              id="email"
              onChange={handleChange}
            />
          </div>
          <div>
            <Label className="text-black" value="Your password" />
            <TextInput
              className="mt-2 text-black placeholder-gray-400 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
              type="password"
              placeholder="Password"
              id="password"
              onChange={handleChange}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black border border-black rounded-lg py-3 hover:bg-black hover:text-white transition-all"
          >
            {loading ? (
              <>
                <Spinner size="sm" />
                <span className="pl-3">Loading...</span>
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <div className="my-4 border-b border-gray-300" />

        <OAuth />

        <div className="flex gap-2 text-sm mt-6 justify-center">
          <span className="text-gray-500">Don't have an account?</span>
          <Link to="/sign-up" className="text-black font-semibold hover:underline">
            Sign Up
          </Link>
        </div>

        {errorMessage && (
          <Alert className="mt-6" color="failure">
            {errorMessage}
          </Alert>
        )}
      </div>
    </div>
  );
}
