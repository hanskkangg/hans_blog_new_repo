import { Sidebar } from 'flowbite-react';
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
  HiPencilAlt,
} from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

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
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {currentUser && currentUser.isAdmin && (
            <Sidebar.Item as={Link} to="/dashboard?tab=dash" icon={HiChartPie} active={tab === 'dash' || !tab}>
              Dashboard
            </Sidebar.Item>
          )}

          <Sidebar.Item as={Link} to="/dashboard?tab=profile" icon={HiUser} active={tab === 'profile'}>
            Profile
          </Sidebar.Item>

          {currentUser.isAdmin ? (
            <>
              <Sidebar.Item as={Link} to="/dashboard?tab=posts" icon={HiDocumentText} active={tab === 'posts'}>
                Posts
              </Sidebar.Item>

              <Sidebar.Item as={Link} to="/dashboard?tab=users" icon={HiOutlineUserGroup} active={tab === 'users'}>
                Users
              </Sidebar.Item>

              <Sidebar.Item as={Link} to="/dashboard?tab=comments" icon={HiAnnotation} active={tab === 'comments'}>
                All Comments
              </Sidebar.Item>

              {/* CREATE POST BUTTON FOR ADMIN ONLY */}
              <Sidebar.Item
                as={Link}
                to="/create-post"
                icon={HiPencilAlt}
                className="text-green-600 font-semibold hover:bg-green-200 dark:text-green-300 dark:hover:bg-green-700"
              >
                Create Post
              </Sidebar.Item>
            </>
          ) : (
            <Sidebar.Item as={Link} to="/dashboard?tab=mycomments" icon={HiAnnotation} active={tab === 'mycomments'}>
              My Comments
            </Sidebar.Item>
          )}

          <Sidebar.Item
            icon={HiArrowSmRight}
            className="text-red-700 hover:bg-red-300 dark:text-red-700 dark:hover:bg-red-300 cursor-pointer"
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
