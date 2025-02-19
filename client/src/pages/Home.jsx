import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import { Button } from 'flowbite-react';
import MiniPostCard from '../components/MiniPostCard';

export default function Home() {
  const [recentPosts, setRecentPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [mostViewedPosts, setMostViewedPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const recentRes = await fetch('/api/post/getPosts?limit=5&sort=desc');
        const recentData = await recentRes.json();
        setRecentPosts(recentData.posts);

        // ✅ Fetch 10 Trending Posts (Most Liked)
        const trendingRes = await fetch('/api/post/getPosts?limit=10&sort=most-liked');
        const trendingData = await trendingRes.json();
        setTrendingPosts(trendingData.posts);

        // ✅ Fetch 10 Most Viewed Posts
        const mostViewedRes = await fetch('/api/post/getPosts?limit=10&sort=most-viewed');
        const mostViewedData = await mostViewedRes.json();
        setMostViewedPosts(mostViewedData.posts);
      } catch (error) {
        console.error("🔥 Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="p-5 w-full max-w-full overflow-hidden flex flex-col md:flex-row gap-8">
      {/* Main Content (Recent Posts) - 70% width */}
      <div className="w-full md:w-[70%] max-w-full p-5 rounded-lg bg-white dark:bg-gray-800">
        <h2 className="text-3xl font-semibold mb-6">Recent Posts</h2>
        {recentPosts.length > 0 ? (
          recentPosts.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <p className="text-gray-500 text-center">No recent posts yet.</p>
        )}

        {/* Show More Button - Below Articles */}
        <div className="flex justify-center mt-10">
          <Button gradientDuoTone="purpleToPink" as={Link} to="/search" className="px-10 py-3 text-lg">
            Show More Posts
          </Button>
        </div>
      </div>

      {/* Right Sidebar (Trending & Most Viewed Posts) */}
      <div className="w-full md:w-[30%] max-w-full space-y-8 mt-14">
        {/* 🔥 Trending Posts Section */}
        <div className="p-5 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-300 dark:border-gray-600 mt-5">
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-300 pb-2 text-center">
            🔥 Trending Posts
          </h2>
          <div className="space-y-4">
            {trendingPosts.length > 0 ? (
              trendingPosts.map((post) => <MiniPostCard key={post._id} post={post} />)
            ) : (
              <p className="text-gray-500 text-center">No trending posts yet.</p>
            )}
          </div>
        </div>

        {/* 👁️ Most Viewed Posts Section */}
        <div className="p-5 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-300 dark:border-gray-600 mt-5">
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-300 pb-2 text-center">
            👁️ Most Viewed Posts
          </h2>
          <div className="space-y-4">
            {mostViewedPosts.length > 0 ? (
              mostViewedPosts.map((post) => <MiniPostCard key={post._id} post={post} />)
            ) : (
              <p className="text-gray-500 text-center">No most viewed posts yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
