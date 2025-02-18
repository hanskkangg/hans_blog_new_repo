import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import { Button } from 'flowbite-react';

export default function Home() {
  const [recentPosts, setRecentPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const recentRes = await fetch('/api/post/getPosts?limit=5&sort=desc');
        const recentData = await recentRes.json();
        const trendingRes = await fetch('/api/post/getPosts?limit=5&sort=most-liked');
        const trendingData = await trendingRes.json();

        setRecentPosts(recentData.posts);
        setTrendingPosts(trendingData.posts);
      } catch (error) {
        console.error("🔥 Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="p-5 max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Welcome to My Blog</h1>
        <p className="text-gray-500">
          Explore articles on web development, software engineering, and programming.
        </p>
        <Link to="/search" className="text-teal-500 font-bold hover:underline">
          View all posts
        </Link>
      </div>

      {/* Call to Action */}
      <div className="p-3 my-8 bg-amber-100 dark:bg-slate-700 rounded-lg border border-gray-300 dark:border-gray-600">
        <CallToAction />
      </div>

      {/* Recent & Trending Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <div className="border border-gray-300 dark:border-gray-600 p-5 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 border-b border-gray-300 pb-2">Recent Posts</h2>
          {recentPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>

        {/* Trending Posts */}
        <div className="border border-gray-300 dark:border-gray-600 p-5 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 border-b border-gray-300 pb-2">🔥 Trending Posts</h2>
          {trendingPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>

      {/* Show More Button */}
      <div className="flex justify-center mt-10">
        <Button gradientDuoTone="purpleToPink" as={Link} to="/search">
          Show More Posts
        </Button>
      </div>
    </div>
  );
}
