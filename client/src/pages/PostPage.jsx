import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';
import { useSelector } from "react-redux"; // ✅ Import Redux Hook

export default function PostPage() {
  const { postSlug } = useParams();
  const { currentUser } = useSelector((state) => state.user); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const hasUserLiked = post?.likes?.includes(currentUser?._id) || false;

  console.log("🔹 Current User:", currentUser);
  console.log("🔹 Current User Token:", currentUser?.token);
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(false);
  
      try {
        let res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        let data = await res.json();
  
        // ❌ If slug doesn't work, try fetching by ID
        if (!res.ok || !data.posts || data.posts.length === 0) {
          console.warn("❌ Slug failed, trying ID...");
          res = await fetch(`/api/post/getposts?id=${postSlug}`);
          data = await res.json();
        }
  
        if (!res.ok || !data.posts || data.posts.length === 0) {
          setError(true);
          setLoading(false);
          return;
        }
  
        const postData = data.posts[0];
        setPost(postData); // ✅ Set post
  
        // ✅ Fetch recent posts excluding the current one
        const recentRes = await fetch(`/api/post/getposts?limit=4&sort=desc`);
        const recentData = await recentRes.json();
  
        if (recentRes.ok) {
          const filteredRecentPosts = recentData.posts.filter(p => p._id !== postData._id).slice(0, 3);
          setRecentPosts(filteredRecentPosts);
        }
  
        // ✅ Increment view count
        if (postData._id) {
          const updateRes = await fetch(`/api/post/increment-views/${postData._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
          });
  
          const updateData = await updateRes.json();
          if (updateRes.ok) {
            setPost(prev => ({ ...prev, views: updateData.views }));
          }
        }
  
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
  
    fetchPost();
  }, [postSlug]);
  
  const handleLike = async () => {
    if (!post || !currentUser) {
      alert("You must be logged in to like posts!");
      return;
    }
  
    if (!currentUser.token) {
      alert("Authentication error: Missing token. Please log in again.");
      return;
    }
  
    try {
      const res = await fetch(`/api/post/like/${post._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`, // ✅ Send Token
        },
        credentials: "include", // ✅ Ensure cookies are sent
      });
  
      const data = await res.json();
      if (res.ok) {
        setPost((prev) => ({
          ...prev,
          likes: data.likedByUser
            ? [...(prev.likes || []), currentUser._id] // ✅ Add like
            : (prev.likes || []).filter(id => id !== currentUser._id), // ✅ Remove like
          likesCount: data.likes, // ✅ Update likes count immediately
        }));
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("🔥 Like Error:", error);
    }
  };
  
  if (loading) return <p>Loading...</p>;
  if (error || !post) return <p>Error loading post or post not found.</p>; // ✅ Handle missing post
  
  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
        {post && post.title}
      </h1>
      <Link
        to={`/search?category=${post && post.category}`}
        className='self-center mt-5'
      >
        <Button color='gray' pill size='xs'>
          {post && post.category}
        </Button>
      </Link>

      <img
  key={post?.headerImage}
  src={post?.headerImage || "/default-placeholder.jpg"}
  alt={post?.title}
  className='mt-10 p-3 max-h-[600px] w-full object-cover'
/>
      <div className="flex justify-between items-center p-3">
        <p>👁️ {post.views || 0} views</p>
        <p>📅 {new Date(post.createdAt).toLocaleDateString()}</p>
        <p>💬 {post.commentsCount || 0} comments</p>
        
        <p>❤️ {post.likesCount || 0} likes</p>

        <Button 
  color={hasUserLiked ? "red" : "pink"} 
  pill 
  size="xs" 
  onClick={handleLike}
>
  {hasUserLiked ? "💔 Unlike" : "❤️ Like"} ({post.likesCount || 0})
</Button>


      </div>
      
      <div
        className='p-3 max-w-2xl mx-auto w-full post-content'
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      <div className='max-w-4xl mx-auto w-full'>
        <CallToAction />
      </div>
      <CommentSection postId={post?._id} />
{/* ✅ Recent Articles Section */}
<div className='flex flex-col justify-center items-center mb-5'>
  <h1 className='text-xl mt-5'>Recent articles</h1>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5 w-full max-w-6xl mx-auto">
    {recentPosts.length > 0 ? (
      recentPosts.map((recentPost) => (
        <PostCard key={recentPost._id} post={recentPost} />
      ))
    ) : (
      <p className='text-gray-500'>No recent articles available.</p>
    )}
  </div>
</div>

    </main>
  );
}
