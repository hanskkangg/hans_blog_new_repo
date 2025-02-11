import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { useSelector } from 'react-redux';

export default function Header() {
  const path = useLocation().pathname;
  const { currentUser } = useSelector((state) => state.user);

  return (
    <Navbar fluid={true} rounded={true} className="border-b-2 shadow-md bg-white dark:bg-gray-900">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="self-center whitespace-nowrap text-xl font-bold dark:text-white"
        >
          <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
            Hans
          </span>
          Blog
        </Link>

        {/* Search Bar */}
        <form className="hidden lg:flex items-center relative">
          <TextInput
            type="text"
            placeholder="Search..."
            rightIcon={AiOutlineSearch}
            className="focus:ring-2 focus:ring-indigo-400"
          />
        </form>

        {/* Responsive Search Icon for Small Screens */}
        <Button className="w-10 h-10 lg:hidden" color="gray" pill>
          <AiOutlineSearch className="w-5 h-5" />
        </Button>

        {/* Navigation & Profile Section */}
        <div className="flex items-center gap-4">
          <Navbar.Collapse className="flex gap-4 items-center">
            <Navbar.Link
              as={Link}
              to="/"
              active={path === '/'}
              className="text-gray-600 hover:text-indigo-500 transition duration-300"
            >
              Home
            </Navbar.Link>

            <Navbar.Link
              as={Link}
              to="/about"
              active={path === '/about'}
              className="text-gray-600 hover:text-indigo-500 transition duration-300"
            >
              About
            </Navbar.Link>

            <Navbar.Link
              as={Link}
              to="/projects"
              active={path === '/projects'}
              className="text-gray-600 hover:text-pink-500 transition duration-300 border-b-2 border-transparent hover:border-pink-500"
            >
              Projects
            </Navbar.Link>
          </Navbar.Collapse>

          {/* User Profile or Sign In Button */}
          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  alt="user"
                  img={currentUser.profilePicture || '/default-avatar.png'}
                  rounded
                  className="cursor-pointer"
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
              <Dropdown.Item>Sign out</Dropdown.Item>
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
      </div>
    </Navbar>
  );
}
