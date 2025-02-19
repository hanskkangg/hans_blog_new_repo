import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { Button } from "flowbite-react";
import MiniPostCard from "../components/MiniPostCard";
import { BsFacebook, BsInstagram, BsGithub } from "react-icons/bs";

export default function Home() {
  const [recentPosts, setRecentPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [mostViewedPosts, setMostViewedPosts] = useState([]);


   // ✅ Hardcoded Profile Data (No Fetching Needed)
   const authorProfile = {
    username: "Hans Kang",
    profilePicture: "./pro.png", // Change this to your profile image URL
    bio: "Web Developer | Tech Enthusiast | Coffee Lover ☕",
    pronouns: "he/him",
    instagram: "https://www.instagram.com/kkanghhanss/",
    facebook: "https://www.facebook.com/hans.kkang/",
    github: "https://github.com/hanskkangg",
    website: "https://www.hanskang.com",
  };


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const recentRes = await fetch("/api/post/getPosts?limit=5&sort=desc");
        const recentData = await recentRes.json();
        setRecentPosts(recentData.posts);

        const trendingRes = await fetch(
          "/api/post/getPosts?limit=10&sort=most-liked"
        );
        const trendingData = await trendingRes.json();
        setTrendingPosts(trendingData.posts);

        const mostViewedRes = await fetch(
          "/api/post/getPosts?limit=10&sort=most-viewed"
        );
        const mostViewedData = await mostViewedRes.json();
        setMostViewedPosts(mostViewedData.posts);
      } catch (error) {
        console.error("🔥 Error fetching posts:", error);
      }
    };

    const fetchAuthorProfile = async () => {
      try {
        const res = await fetch("/api/user/homeProfile");
        if (res.ok) {
          const data = await res.json();
          setAuthorProfile(data);
        }
      } catch (error) {
        console.error("🔥 Error fetching author profile:", error);
      }
    };

    fetchPosts();
    fetchAuthorProfile();
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

        {/* Show More Button */}
        <div className="flex justify-center mt-10">
          <Button
            gradientDuoTone="purpleToPink"
            as={Link}
            to="/search"
            className="px-10 py-3 text-lg"
          >
            Show More Posts
          </Button>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full md:w-[30%] max-w-full space-y-8">
        {/* ✅ Hardcoded AUTHOR PROFILE SECTION */}
        <div className="p-5 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-300 dark:border-gray-600 text-center">
          <img
            src={authorProfile.profilePicture}
            alt={authorProfile.username}
            className="w-28 h-28 mx-auto rounded-full"
          />
          <h2 className="text-xl font-semibold mt-3">
            {authorProfile.username}{" "}
            <span className="text-gray-500">
              ({authorProfile.pronouns})
            </span>
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
              <a href={authorProfile.instagram} target="_blank" rel="noopener noreferrer">
                <BsInstagram className="text-2xl text-pink-500" />
              </a>
            )}
            {authorProfile.facebook && (
              <a href={authorProfile.facebook} target="_blank" rel="noopener noreferrer">
                <BsFacebook className="text-2xl text-blue-500" />
              </a>
            )}
            {authorProfile.github && (
              <a href={authorProfile.github} target="_blank" rel="noopener noreferrer">
                <BsGithub className="text-2xl text-gray-700 dark:text-white" />
              </a>
            )}
          </div>
        </div>
        {/* 🔥 Trending Posts */}
        <div className="p-5 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-300 dark:border-gray-600">
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-300 pb-2 text-center">
            🔥 Trending Posts
          </h2>
          <div className="space-y-4">
            {trendingPosts.length > 0 ? (
              trendingPosts.map((post) => (
                <MiniPostCard key={post._id} post={post} />
              ))
            ) : (
              <p className="text-gray-500 text-center">No trending posts yet.</p>
            )}
          </div>
        </div>

        {/* 👁️ Most Viewed Posts */}
        <div className="p-5 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-300 dark:border-gray-600">
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-300 pb-2 text-center">
            👁️ Most Viewed Posts
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
