import { Sidebar } from 'flowbite-react';
import { HiUser, HiArrowSmRight } from 'react-icons/hi';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

export default function DashSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const tab = new URLSearchParams(location.search).get('tab');

  const handleSignOut = () => {
    dispatch(signoutSuccess());
    navigate('/sign-in');
  };

  return (
    <Sidebar aria-label="Dashboard Sidebar">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {/* ✅ Profile Item */}
          <Sidebar.Item
            active={tab === 'profile'}
            icon={HiUser}
            label={currentUser?.isAdmin ? 'Admin' : 'User'}
            labelColor="dark"
            as="div"
            onClick={() => navigate('/dashboard?tab=profile')}
          >
            Profile
          </Sidebar.Item>

          {/* ✅ Sign Out Item */}
          <Sidebar.Item
            icon={HiArrowSmRight}
            as="div"
            onClick={handleSignOut}
            className="text-red-500 hover:bg-red-100 dark:hover:bg-red-800 cursor-pointer"
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
