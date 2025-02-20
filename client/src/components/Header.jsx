import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';
import { useEffect, useState } from 'react';

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) console.log(data.message);
      else dispatch(signoutSuccess());
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <Navbar className="border-b-2 shadow-md bg-white dark:bg-gray-900 px-6 py-4 flex items-center justify-between">
      {/* Blog Title */}
      <Link to="/" className="flex items-center space-x-2">
        <span className="text-2xl font-bold text-black dark:text-white">
          Hans
        </span>
        <span className="text-xl font-light text-gray-600 dark:text-gray-300">
          Blog
        </span>
      </Link>
      {/* ✅ Centered Navigation Links */}
      <div className="hidden md:flex items-center gap-10 text-white">
    <Link
        to="/home"
        className={`hover:text-gray-300 transition ${
            path === "/home" ? "text-white font-semibold border-b-2 border-white" : "text-gray-500"
        }`}
    >
        Home
    </Link>

    <Link
        to="/search"
        className={`hover:text-gray-300 transition ${
            path === "/search" ? "text-white font-semibold border-b-2 border-white" : "text-gray-500"
        }`}
    >
        Posts
    </Link>

    <Link
        to="/about"
        className={`hover:text-gray-300 transition ${
            path === "/about" ? "text-white font-semibold border-b-2 border-white" : "text-gray-500"
        }`}
    >
        About Me
    </Link>
</div>

      {/* ✅ Centered Search Bar - Compact */}
      <form onSubmit={handleSubmit} className="hidden md:flex w-full max-w-xs lg:max-w-sm">
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="w-full px-3 py-1.5 rounded-lg border-gray-300 dark:border-gray-600
                     focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>

      {/* ✅ Icons, User Profile, Theme Toggle */}
      <div className="flex items-center gap-4 flex-shrink-0">
        {/* Theme Toggle */}
        <Button
          className="w-10 h-10 flex items-center justify-center p-0"
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === 'light' ? (
            <FaSun className="text-xl text-yellow-400" />
          ) : (
            <FaMoon className="text-xl text-indigo-400" />
          )}
        </Button>

        {/* User Profile Dropdown */}
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="user"
                img={currentUser?.profilePicture?.trim() || 'https://cdn-icons-png.flaticon.com/512/3607/3607444.png'}
                rounded
                className="w-10 h-10"
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm font-semibold">{currentUser.username}</span>
              <span className="block text-sm text-gray-500 truncate">{currentUser.email}</span>
            </Dropdown.Header>
            <Link to="/dashboard?tab=profile">
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
          <button 
              className="px-4 py-1 text-xs md:px-6 md:py-2 md:text-sm font-semibold border transition-all
                         bg-white text-black border-black rounded-md
                         hover:bg-black hover:text-white"
          >
              Sign In
          </button>
      </Link>
      
      
      
        )}
      </div>

      {/* ✅ Navbar Collapse for Small Screens */}
      <Navbar.Toggle className="md:hidden" />

      {/* ✅ Dropdown Menu for Mobile */}
      <Navbar.Collapse className="lg:hidden">
      <Navbar.Link active={path === "/home"} as="div">
        <Link to="/home">Home</Link>
    </Navbar.Link>
        <Navbar.Link active={path === "/search"} as="div">
          <Link to="/search">Posts</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as="div">
          <Link to="/about">About Me</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
