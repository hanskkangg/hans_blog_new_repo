import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';

export default function Header() {
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

  
    const handleSignout = async () => {
      try {
        const res = await fetch('/api/user/signout', {
          method: 'POST',
        });
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
        } else {
          dispatch(signoutSuccess());
        }
      } catch (error) {
        console.log(error.message);
      }
    };
  


  return (
    <Navbar className="border-b-2 shadow-md bg-white dark:bg-gray-900 px-4">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          Hans
        </span>
        Blog
      </Link>

      {/* ✅ Search Bar */}
      <form className="hidden lg:flex items-center">
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="focus:ring-2 focus:ring-indigo-400"
        />
      </form>

      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>

      <div className="flex gap-4 items-center md:order-2">
      <Button
  className="w-12 h-12 hidden sm:inline flex items-center justify-center" // ✅ Adjust button size
  color="gray"
  pill
  onClick={() => dispatch(toggleTheme())}
>
  {theme === 'light' ? (
    <FaSun className="text-3xl text-yellow-400" />  // ✅ Increased size & color
  ) : (
    <FaMoon className="text-3xl text-indigo-400" /> // ✅ Increased size & color
  )}
</Button>

        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="user"
                img={currentUser.profilePicture || '/default-avatar.png'}
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm font-semibold">@{currentUser.username}</span>
              <span className="block text-sm text-gray-500 truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to="/dashboard?tab=profile">
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone="purpleToBlue" outline>
              Sign In
            </Button>
          </Link>
        )}

        <Navbar.Toggle />
      </div>

      {/* ✅ Visible on Large Screens */}
      <div className="hidden lg:flex gap-4 items-center">
        <Link
          to="/"
          className={`px-4 py-2 rounded-lg ${
            path === '/' ? 'text-indigo-600 font-semibold' : 'text-gray-700 dark:text-gray-300'
          } hover:bg-indigo-500 hover:text-white transition duration-300`}
        >
          Home
        </Link>
        <Link
          to="/about"
          className={`px-4 py-2 rounded-lg ${
            path === '/about' ? 'text-indigo-600 font-semibold' : 'text-gray-700 dark:text-gray-300'
          } hover:bg-indigo-500 hover:text-white transition duration-300`}
        >
          About
        </Link>
        <Link
          to="/projects"
          className={`px-4 py-2 rounded-lg ${
            path === '/projects' ? 'text-indigo-600 font-semibold' : 'text-gray-700 dark:text-gray-300'
          } hover:bg-pink-500 hover:text-white transition duration-300`}
        >
          Projects
        </Link>
      </div>

      {/* ✅ Navbar Collapse for Small Screens */}
      <Navbar.Collapse className="lg:hidden">
        <Navbar.Link active={path === '/'} as="div">
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/about'} as="div">
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/projects'} as="div">
          <Link to="/projects">Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
