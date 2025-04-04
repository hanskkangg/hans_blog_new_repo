import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams,useNavigate } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import RecentPostCard from '../components/RecentPostCard';
import { useSelector } from "react-redux"; 
import { Modal } from 'flowbite-react';
import { BsInstagram, BsFacebook, BsGithub, BsLinkedin } from 'react-icons/bs';


import { HiOutlineExclamationCircle } from 'react-icons/hi'; 

export default function PostPage() {
  const { postSlug } = useParams();
  const { currentUser } = useSelector((state) => state.user); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const hasUserLiked = post?.likes?.includes(currentUser?._id) || false;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();
  const isAuthor = post?.userId === currentUser?._id;
  const isAdmin = currentUser?.isAdmin;

  console.log("🔹 Current User:", currentUser);
  console.log("🔹 Current User Token:", currentUser?.token);
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(false);
  
      try {
        let res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        let data = await res.json();
  
        // If slug doesn't work, try fetching by ID
        if (!res.ok || !data.posts || data.posts.length === 0) {
          console.warn(" Slug failed, trying ID...");
          res = await fetch(`/api/post/getposts?id=${postSlug}`);
          data = await res.json();
        }
  
        if (!res.ok || !data.posts || data.posts.length === 0) {
          setError(true);
          setLoading(false);
          return;
        }
  
        const postData = data.posts[0];
        setPost(postData); 
  
        // Fetch recent posts excluding the current one
        const recentRes = await fetch(`/api/post/getposts?limit=4&sort=desc`);
        const recentData = await recentRes.json();
  
        if (recentRes.ok) {
          const filteredRecentPosts = recentData.posts.filter(p => p._id !== postData._id).slice(0, 3);
          setRecentPosts(filteredRecentPosts);
        }
  
        // Increment view count
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
          Authorization: `Bearer ${currentUser.token}`, 
        },
        credentials: "include", 
      });
  
      const data = await res.json();
      if (res.ok) {
        setPost((prev) => ({
          ...prev,
          likes: data.likedByUser
            ? [...(prev.likes || []), currentUser._id] 
            : (prev.likes || []).filter(id => id !== currentUser._id), 
          likesCount: data.likes,
        }));
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Like Error:", error);
    }
  };
  const handleDeletePost = async () => {
    if (!post?._id) {
      console.error("postId is missing!");
      return;
    }
  
    try {
      const token = currentUser?.token;
      if (!token) {
        throw new Error("Unauthorized! Token is missing.");
      }
  
      console.log(` Deleting Post ID: ${post._id}`);
  
      const res = await fetch(
        `/api/post/deletepost/${post._id}/${currentUser._id}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );
  
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Unauthorized request!");
      }
  
      console.log("Post deleted successfully!");
      navigate("/home");
    } catch (error) {
      console.error("Error deleting post:", error.message);
    }
  };
  
  if (loading) return <p>Loading...</p>;
  if (error || !post) return <p>Error loading post or post not found.</p>;
  


  return (<main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen overflow-x-hidden bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200">
  
    {/* Top Section: Edit & Delete Buttons - Left */}
    <div className="flex justify-between items-center p-3 w-full">
      {(currentUser && (isAuthor || isAdmin)) && (
        <div className="flex gap-3"><Button onClick={() => navigate(`/update-post/${post._id}`)}>
        ✏️ Edit
      </Button>
      
          <Button color="red" onClick={() => setShowDeleteModal(true)}>🗑 Delete</Button>
        </div>
      )}
    </div>
  
    {/* Title */}
    <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl break-words">
      {post && post.title}
    </h1>
  
    {/* Author & Date */}
    <div className="text-center text-gray-500 dark:text-gray-400 text-sm mt-2 flex flex-wrap justify-center items-center gap-4 max-w-full">
      
      <span>By <span className="font-medium">{post?.author || "Unknown Author"}</span></span>

  <span>• {new Date(post.createdAt).toLocaleDateString()}</span>
</div>

  
    {/* Views, Comments, and Likes - Below Author & Date */}
    <div className="text-center text-gray-500 dark:text-gray-400 text-sm mt-2 flex flex-wrap justify-center items-center gap-4 max-w-full">
      <span>👁️ {post.views || 0} Views</span>
      <span>💬 {post.commentsCount || 0} Comments</span>
      <span>❤️ {post.likesCount || 0} Likes</span>
    </div>
  
    {/* Category Button */}
    <Link to={`/search?category=${post && post.category}`} className="self-center mt-3">
      <Button color="gray" pill size="xs">{post && post.category}</Button>
    </Link>
  
    {/* Post Image with Proper Scaling & No Overflow */}
    <div className="w-full flex flex-col items-center mt-5">
      <img
        key={post?.headerImage}
        src={post?.headerImage || "/default-placeholder.jpg"}
        alt={post?.title}
        className="w-full max-w-full h-auto max-h-[500px] object-contain rounded-lg mt-4"
      />
    </div>
  
    {/* Post Content */}
    <div
      className="p-3 max-w-4xl mx-auto w-full post-content break-words"
      dangerouslySetInnerHTML={{ __html: post && post.content }}
    ></div>
  
    {/* Centered Author Section with Dark Mode Support */}
    <div className="p-5 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-2xl mx-auto mt-10 flex flex-col items-center text-center">
      {/* Profile Image - Centered */}
      <img
        src="/pro.png"
        alt="Hans Kang"
        className="w-24 h-24 rounded-full"
      />
  
      {/* Author Info - Centered */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Hans Kang <span className="text-gray-500 dark:text-gray-400">(he/him)</span>
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
        Web Developer | DevOps & SRE | Tech Enthusiast | Loves Coffee & Movies ❤️
        </p>
  
        {/* Website Link with Dark Mode Support */}
        <p className="text-sm mt-2">
          <a
            href="https://www.hanskang.com"
            className="text-blue-500 dark:text-blue-400 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit My Website
          </a>
        </p>
  
        {/* Social Links */}
        <div className="flex gap-4 mt-2 justify-center">
          <a href="https://www.instagram.com/kkanghhanss/" target="_blank" rel="noopener noreferrer">
            <BsInstagram className="text-2xl text-pink-500 dark:text-pink-400" />
          </a>
          <a href="https://www.facebook.com/hans.kkang/" target="_blank" rel="noopener noreferrer">
            <BsFacebook className="text-2xl text-blue-500 dark:text-blue-400" />
          </a>
          <a href="https://github.com/hanskkangg" target="_blank" rel="noopener noreferrer">
            <BsGithub className="text-2xl text-gray-700 dark:text-gray-300" />
          </a>
          <a href="https://www.linkedin.com/in/hanskkang" target="_blank" rel="noopener noreferrer">
            <BsLinkedin className="text-2xl text-blue-500 dark:text-blue-500" />
          </a>



        </div>
      </div>
    </div>
  
   {/*  Like Button with Round Styling & Number on the Left */}
<div className="flex flex-col justify-center items-center mt-10 gap-3">
  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{post.likesCount || 0}</span>
  <Button
    color={hasUserLiked ? "red" : "pink"}
    className="w-12 h-12 flex items-center justify-center rounded-full text-xl border border-gray-300 dark:border-gray-600 transition-transform transform hover:scale-110 hover:shadow-lg"
    onClick={handleLike}
  >
    {hasUserLiked ? "👎" : "❤️"}
  </Button>

  {/* Show message if the user has already liked the post */}
  {hasUserLiked && (
    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
      ❤️ You've liked this post!
    </p>
  )}
</div>

  
    {/*  Comment Section */}
    <CommentSection postId={post?._id} />
  {/* Recent Articles Section with Unique Design */}
<div className="flex flex-col justify-center items-center mb-5 w-full">
  <h1 className="text-xl mt-5">Recent Articles</h1>
  
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5 w-full max-w-4xl mx-auto">
    {recentPosts.length > 0 ? (
      recentPosts.slice(0, 3).map((recentPost) => (
        <RecentPostCard key={recentPost._id} post={recentPost} />
      ))
    ) : (
      <p className="text-gray-500 dark:text-gray-400">No recent articles available.</p>
    )}
  </div>
</div>

  
    {/*  Delete Confirmation Modal */}
    <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} popup size="md">
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 mb-4 mx-auto" />
          <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-300">Are you sure you want to delete this post?</h3>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={handleDeletePost}>Yes, delete</Button>
            <Button color="gray" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  </main>
  
  
  );
}
