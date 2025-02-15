import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';

import { Button } from 'flowbite-react'; // ✅ Import Button component


export default function Home() {
  const [recentPosts, setRecentPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // ✅ Fetch recent posts
        const recentRes = await fetch('/api/post/getPosts?limit=5&sort=desc');
        const recentData = await recentRes.json();

        // ✅ Fetch trending posts (most liked)
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
    <div>
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto '>
        <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to my Blog</h1>
        <p className='text-gray-500 text-xs sm:text-sm'>
          Here you'll find a variety of articles and tutorials on topics such as
          web development, software engineering, and programming languages.
        </p>
        <Link
          to='/search'
          className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'
        >
          View all posts
        </Link>
      </div>

      {/* 🔥 Call to Action Section */}
      <div className='p-3 bg-amber-100 dark:bg-slate-700'>
        <CallToAction />
      </div>

      {/* 🔥 Two-Column Layout: Recent Posts (Left) & Trending Posts (Right) */}
      <div className='max-w-6xl mx-auto p-3 py-7 grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* ✅ Left Column: Recent Posts (1 per row) */}
        <div>
          <h2 className='text-2xl font-semibold mb-4 text-center md:text-left'>Recent Posts</h2>
          <div className='flex flex-col gap-6'>
            {recentPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </div>

        {/* ✅ Right Column: Trending Posts (Most Liked) */}
        <div>
          <h2 className='text-2xl font-semibold mb-4 text-center md:text-left'>🔥 Trending Posts</h2>
          <div className='flex flex-col gap-6'>
            {trendingPosts.map((post) => (
              <PostCard key={post._id} post={post} /> // ✅ Same format as Recent Posts
            ))}
          </div>
        </div>
      </div>

      {/* 🔥 Show More Button */}
      <div className='flex justify-center mt-10'>
        <Button gradientDuoTone="purpleToPink" as={Link} to="/search">
          Show More Posts
        </Button>
      </div>
    </div>
  );
}