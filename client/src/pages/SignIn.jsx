import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
  resetError,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  // Get theme from redux or global state
  const { theme } = useSelector((state) => state.theme); 
  const dispatch = useDispatch();
  const navigate = useNavigate();


  useEffect(() => {
    // Clear the error message when the component mounts
    dispatch(resetError());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('All fields are required. Please ensure no fields are left empty.'));
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
    <div className={`flex h-screen w-full transition-all ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Left Side: Video Background - 60% of the screen */}
      <div className="w-3/5 h-full relative hidden md:block">
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/sign.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Right Side: Sign In Form - 40% of the screen */}
      <div className="w-full md:w-2/5 h-full flex items-center justify-center relative">
        <div className={`max-w-md w-full p-10 md:border-l-2 rounded-none shadow-none 
            ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-black'}`}>
            
          <div className="mb-8 text-center">
            <Link to="/" className={`font-extrabold text-3xl ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              Hans Blog
            </Link>
            <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Sign in with your email or Google
            </p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div>
              <Label className={theme === 'dark' ? 'text-white' : 'text-black'} value="Your email" />
              <TextInput
                className={`mt-2 placeholder-gray-400 border rounded-lg focus:ring-2 transition-all 
                  ${theme === 'dark' 
                    ? 'bg-gray-700 text-white border-gray-600 focus:ring-gray-500' 
                    : 'bg-white text-black border-gray-300 focus:ring-black'}`}
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label className={theme === 'dark' ? 'text-white' : 'text-black'} value="Your password" />
              <TextInput
                className={`mt-2 placeholder-gray-400 border rounded-lg focus:ring-2 transition-all 
                  ${theme === 'dark' 
                    ? 'bg-gray-700 text-white border-gray-600 focus:ring-gray-500' 
                    : 'bg-white text-black border-gray-300 focus:ring-black'}`}
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
            </div>

           {/* Custom Button */}
  <button
    type="submit"
    disabled={loading}
    className={`w-full py-3 border rounded-lg transition-colors duration-300 
      ${theme === 'dark' 
        ? 'bg-gray-500 text-white border-gray-600 hover:bg-gray-600' 
        : 'bg-white text-black border-black hover:bg-black hover:text-white'}`}
  >
    {loading ? (
      <div className="flex items-center justify-center">
        <Spinner size="sm" />
        <span className="pl-3">Loading...</span>
      </div>
    ) : (
      'Sign In'
    )}
  </button>
          </form>

          <div className={`my-4 border-b ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`} />

          <OAuth />

          <div className="flex gap-2 text-sm mt-6 justify-center">
            <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Don't have an account?
            </span>
            <Link to="/sign-up" className={`font-semibold hover:underline ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
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
    </div>
  );
}
