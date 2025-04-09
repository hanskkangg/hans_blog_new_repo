import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { Button } from "flowbite-react";
import MiniPostCard from "../components/MiniPostCard";
import { BsFacebook, BsInstagram, BsGithub, BsLinkedin } from "react-icons/bs";

export default function Home() {
  const [recentPosts, setRecentPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [mostViewedPosts, setMostViewedPosts] = useState([]);
  // loading state 
  const [loading, setLoading] = useState(true); 

  // Hardcoded Profile Data
  const authorProfile = {
    username: "Hans Kang",
    profilePicture: "./pro.png",
    bio: `
      Web Developer | DevOps & SRE | Tech Enthusiast | Loves Coffee & Movies ❤️`,
    pronouns: "he/him",

    linkedin: "https://www.linkedin.com/in/hanskkang/",
    github: "https://github.com/hanskkangg",
    website: "https://www.hanskang.com",
    instagram: "https://www.instagram.com/kkanghhanss/",
    facebook: "https://www.facebook.com/hans.kkang/",
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch Recent Posts
        const recentRes = await fetch("/api/post/getPosts?limit=5&sort=desc");
        if (!recentRes.ok) throw new Error("Failed to fetch recent posts");
        const recentData = await recentRes.json();
        setRecentPosts(recentData.posts || []);

        // Fetch Most Liked Posts (Fan Favorites)
        const trendingRes = await fetch(
          "/api/post/getPosts?limit=10&sort=most-liked"
        );
        if (!trendingRes.ok)
          throw new Error("Failed to fetch most liked posts");
        const trendingData = await trendingRes.json();
        setTrendingPosts(trendingData.posts || []);

        // Fetch Most Viewed Posts (Popular Reads)
        const mostViewedRes = await fetch(
          "/api/post/getPosts?limit=10&sort=most-viewed"
        );
        if (!mostViewedRes.ok)
          throw new Error("Failed to fetch most viewed posts");
        const mostViewedData = await mostViewedRes.json();
        setMostViewedPosts(mostViewedData.posts || []);

      } catch (error) {
        setRecentPosts([]);
        setTrendingPosts([]);
        setMostViewedPosts([]);
      }   finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid border-b-transparent mx-auto mb-4"></div>
          <p className="text-lg text-gray-700 dark:text-white font-medium">
            Loading posts...
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-5 w-full max-w-7xl mx-auto overflow-hidden flex flex-col md:flex-row gap-8">
      {/* <div className="p-5 w-full max-w-full overflow-hidden flex flex-col md:flex-row gap-8">  */}

      {/* Main Content (Recent Posts) - 70% width */}
      <div className="w-full md:w-[70%] max-w-full p-5 rounded-lg bg-white dark:bg-gray-800">
        <h2 className="text-3xl font-semibold mb-6">Recent Posts</h2>
        {recentPosts.length > 0 ? (
          recentPosts.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <p className="text-gray-500 text-center">No recent posts yet.</p>
        )}

        <div className="flex justify-center mt-10">
          <Button
            as={Link}
            to="/search"
            className="px-6 py-2 rounded-md text-sm font-medium border transition-all
                   bg-white text-black border-black hover:bg-black hover:text-white w-full sm:w-auto"
          >
            Show More Posts
          </Button>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full md:w-[30%] max-w-full space-y-8">
        {/* Hardcoded AUTHOR PROFILE SECTION */}
        <div className="p-5 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-300 dark:border-gray-600 text-center">
          <img
            src={authorProfile.profilePicture}
            alt={authorProfile.username}
            loading="lazy"
            className="w-28 h-28 mx-auto rounded-full"
          />
          <h2 className="text-xl font-semibold mt-3">
            {authorProfile.username}{" "}
            <span className="text-gray-500">({authorProfile.pronouns})</span>
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            {authorProfile.bio}
          </p>

          {authorProfile.website && (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <a
                href={authorProfile.website}
                className="text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit My Website
              </a>
            </p>
          )}

          {/* Social Links */}
          <div className="flex justify-center gap-4 mt-4">
            {authorProfile.instagram && (
              <a
                href={authorProfile.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <BsInstagram className="text-2xl text-pink-500" />
              </a>
            )}
            {authorProfile.facebook && (
              <a
                href={authorProfile.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                <BsFacebook className="text-2xl text-blue-500" />
              </a>
            )}
            {authorProfile.github && (
              <a
                href={authorProfile.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <BsGithub className="text-2xl text-gray-700 dark:text-white" />
              </a>
            )}
            {authorProfile.linkedin && (
              <a
                href={authorProfile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <BsLinkedin className="text-2xl text-blue-500 dark:text-blue-500" />
              </a>
            )}
          </div>
        </div>
        {/*  Trending Posts */}
        <div className="p-5 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-300 dark:border-gray-600">
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-300 pb-2 text-center">
            Top Liked Posts
          </h2>
          <div className="space-y-4">
            {trendingPosts.length > 0 ? (
              trendingPosts.map((post) => (
                <MiniPostCard key={post._id} post={post} />
              ))
            ) : (
              <p className="text-gray-500 text-center">
                No trending posts yet.
              </p>
            )}
          </div>
        </div>

        {/* Most Viewed Posts */}
        <div className="p-5 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-300 dark:border-gray-600">
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-300 pb-2 text-center">
            Top Viewed Posts
          </h2>
          <div className="space-y-4">
            {mostViewedPosts.length > 0 ? (
              mostViewedPosts.map((post) => (
                <MiniPostCard key={post._id} post={post} />
              ))
            ) : (
              <p className="text-gray-500 text-center">
                No most viewed posts yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
