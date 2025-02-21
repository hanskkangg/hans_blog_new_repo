import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { theme } = useSelector((state) => state.theme); // Get theme from redux or global state
  const navigate = useNavigate();
// Validation Rules
const prohibitedWords = [
  'nigger', 'fuck', 'shit', 'bitch', 'asshole', 'racist', 'niger', 'nig3r', 'nigg3r',
  'chink', 'ching', 'bastard', 'damn', 'crap', 'dick', 'pussy', 'cunt', 'twat',
  'bollocks', 'prick', 'wanker', 'douche', 'motherfucker', 'moron', 'motherfuker',
  'hoe','nigga', 'faggot', 'homo', 'tranny','retard', 'cripple', 'spaz', 'mongoloid','whore', 'slut', 'cum', 'jizz', 'fap', 'porn', 'dildo', 'boobs', 
  'tits', 'vagina', 'penis', 'orgy', 'rape', 'molest', 'incest', 'blowjob',
  'kill', 'murder', 'terrorist', 'bomb', 'explode', 'genocide',
 'assassinate', 'stab', 'behead', 'shoot', 'abuse', 'pedophile',
  'hitler', 'nazi','whitepower', 'supremacy', 'zionist', 'jihadi',
  'suicide', 'selfharm','hang', 'overdose', 'depress', 'killself'
];


  // Validation Rules
  const validateForm = () => {
    const { username, email, password } = formData;

 // Prohibited Word Check
 const containsProhibitedWords = (text) => {
  const lowerText = text.toLowerCase();
  return prohibitedWords.some((word) => lowerText.includes(word));
};

if (containsProhibitedWords(username)) {
  return 'Username contains inappropriate content. Please choose a different username.';
}

if (containsProhibitedWords(email)) {
  return 'Email address contains inappropriate content. Please use a valid email address.';
}
        // Username Validation
        const usernameRegex = /^[a-zA-Z0-9._]{4,15}$/;
        if (!usernameRegex.test(username)) {
          return 'Username must be 4-15 characters long and can only contain letters, numbers, underscores, and periods.';
        }

         // Email Validation
  
    // Email Validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email.length < 10) {
        return 'Please enter a valid email address (Email address must be at least 10 characters long)';
    }
    if (email.length > 25) {
        return 'Email address must not exceed 25 characters.';
    }
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address (e.g., name@example.com).';
    }

    // Password Validation
    if (password.length < 8 || password.length > 64) {
      return 'Password must be between 8 and 64 characters.';
    }

    return null; // No validation errors
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('All fields are required. Please ensure no fields are left empty.');
    }


    const validationError = validateForm();
    if (validationError) {
        setLoading(false); // ⬅️ Ensure loading is set to false
        return setErrorMessage(validationError);
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
            setLoading(false); // ⬅️ Reset loading state on error
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) {
        navigate('/sign-in');
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
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

      {/* Right Side: Sign Up Form - 40% of the screen */}
      <div className="w-full md:w-2/5 h-full flex items-center justify-center relative">
        <div className={`max-w-md w-full p-10 md:border-l-2 rounded-none shadow-none 
            ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-black'}`}>
          <div className="mb-8 text-center">
            <Link to="/" className={`font-extrabold text-3xl ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              Hans Blog
            </Link>
            <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Sign up with your email or Google
            </p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div>
              <Label className={theme === 'dark' ? 'text-white' : 'text-black'} value="Your username" />
              <TextInput
                className={`mt-2 placeholder-gray-400 border rounded-lg focus:ring-2 transition-all 
                  ${theme === 'dark' 
                    ? 'bg-gray-700 text-white border-gray-600 focus:ring-gray-500' 
                    : 'bg-white text-black border-gray-300 focus:ring-black'}`}
                type="text"
                placeholder="Username"
                id="username"
                onChange={handleChange}
              />
            </div>
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

            
  {/* ✅ Custom Black and White Button */}
  <button
    type="submit"
    disabled={loading}
    className={`w-full py-3 border rounded-lg transition-colors duration-300 
      bg-white text-black border-black hover:bg-black hover:text-white 
      focus:ring-0 active:ring-0 ${loading ? 'cursor-not-allowed opacity-70' : ''}`}
  >
    {loading ? (
      <div className="flex items-center justify-center">
        <span className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"></span>
        <span className="pl-3">Loading...</span>
      </div>
    ) : (
      'Sign Up'
    )}
  </button>


          </form>

          <div className={`my-4 border-b ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`} />

          <OAuth />

          <div className="flex gap-2 text-sm mt-6 justify-center">
            <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Already have an account?
            </span>
            <Link to="/sign-in" className={`font-semibold hover:underline ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              Sign In
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
