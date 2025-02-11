import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useState } from 'react';

export default function Header() {
  const path = useLocation().pathname;
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null); // Replace with actual auth logic
  const [theme, setTheme] = useState('light'); // Light/Dark mode toggle
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  const handleSignout = () => {
    setCurrentUser(null); // Replace with actual signout logic
    navigate('/');
  };

  return (
    <Navbar className='border-b-2 shadow-sm bg-white dark:bg-gray-900'>
      <div className='container mx-auto flex items-center justify-between'>
        {/* Left Section (Logo) */}
        <Link
          to='/'
          className='text-sm sm:text-xl font-semibold dark:text-white'
        >
          <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
            Hans
          </span>
          Blog
        </Link>

        {/* Center Section (Search) */}
        <form onSubmit={handleSubmit} className='flex items-center gap-2'>
          <TextInput
            type='text'
            placeholder='Search...'
            rightIcon={AiOutlineSearch}
            className='hidden lg:inline'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            className='w-10 h-10 lg:hidden'
            color='gray'
            pill
            onClick={handleSubmit}
          >
            <AiOutlineSearch />
          </Button>
        </form>

        {/* Right Section (User Menu and Theme Toggle) */}
        <div className='flex items-center gap-4'>
          <Button
            className='w-10 h-10 hidden sm:inline'
            color='gray'
            pill
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? <FaSun /> : <FaMoon />}
          </Button>

          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  alt='user'
                  img={currentUser?.profilePicture || '/default-avatar.png'}
                  rounded
                />
              }
            >
              <Dropdown.Header>
                <span className='block text-sm'>@{currentUser?.username}</span>
                <span className='block text-sm font-medium truncate'>
                  {currentUser?.email}
                </span>
              </Dropdown.Header>
              <Link to='/dashboard?tab=profile'>
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
            </Dropdown>
          ) : (
            <Link to='/sign-in'>
              <Button gradientDuoTone='purpleToBlue' outline>
                Sign In
              </Button>
            </Link>
          )}

          <Navbar.Toggle />
        </div>
      </div>

      <Navbar.Collapse className='lg:flex lg:gap-6 lg:justify-center lg:items-center'>
        <Navbar.Link
          as={Link}
          to='/'
          className={`text-sm font-medium ${
            path === '/'
              ? 'text-indigo-500 border-b-2 border-indigo-500'
              : 'text-gray-600 dark:text-gray-300'
          }`}
        >
          Home
        </Navbar.Link>

        <Navbar.Link
          as={Link}
          to='/about'
          className={`text-sm font-medium ${
            path === '/about'
              ? 'text-indigo-500 border-b-2 border-indigo-500'
              : 'text-gray-600 dark:text-gray-300'
          }`}
        >
          About
        </Navbar.Link>

        <Navbar.Link
          as={Link}
          to='/projects'
          className={`text-sm font-medium ${
            path === '/projects'
              ? 'text-indigo-500 border-b-2 border-indigo-500'
              : 'text-gray-600 dark:text-gray-300'
          }`}
        >
          Projects
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
