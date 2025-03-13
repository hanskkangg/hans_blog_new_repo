import { useEffect, useState } from 'react';
import MiniPostCard from './MiniPostCard'; 

export default function StickySidebar() {
  const [trendingPosts, setTrendingPosts] = useState([]);

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        const res = await fetch('/api/post/getPosts?limit=5&sort=most-liked');
        const data = await res.json();
        setTrendingPosts(data.posts);
      } catch (error) {
        console.error("Error fetching trending posts:", error);
      }
    };

    fetchTrendingPosts();
  }, []);

  return (
    <div className="w-80 hidden md:block fixed right-5 top-20 h-[90vh]">
      <div className="border border-gray-300 dark:border-gray-600 p-5 rounded-lg shadow-md h-full bg-white dark:bg-gray-800 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-300 pb-2 text-center">
          🔥 Trending Posts
        </h2>
        {trendingPosts.length > 0 ? (
          trendingPosts.map((post) => <MiniPostCard key={post._id} post={post} />)
        ) : (
          <p className="text-gray-500 text-center">No trending posts yet.</p>
        )}
      </div>
    </div>
  );
}
