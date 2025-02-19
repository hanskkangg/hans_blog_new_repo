import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import { Button } from 'flowbite-react';
import StickySidebar from '../components/StickySidebar';

export default function Home() {
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch('/api/post/getPosts?limit=5&sort=desc');
        const data = await res.json();
        setRecentPosts(data.posts);
      } catch (error) {
        console.error("🔥 Error fetching recent posts:", error);
      }
    };

    fetchRecentPosts();
  }, []);

  return (
    <div className="p-5 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Main Content (Recent Posts) - 75% width */}
      <div className="w-full md:w-[75%] p-5 rounded-lg bg-white dark:bg-gray-800">
        <h2 className="text-3xl font-semibold mb-6"></h2>
        {recentPosts.length > 0 ? (
          recentPosts.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <p className="text-gray-500 text-center">No recent posts yet.</p>
        )}

        {/* Show More Button - Moved Below Articles */}
        <div className="flex justify-center mt-10">
          <Button gradientDuoTone="purpleToPink" as={Link} to="/search" className="px-10 py-3 text-lg">
            Show More Posts
          </Button>
        </div>
      </div>

      {/* Sticky Sidebar (25% width, Right-Aligned & Persistent) */}
      <StickySidebar />
    </div>
  );
}
