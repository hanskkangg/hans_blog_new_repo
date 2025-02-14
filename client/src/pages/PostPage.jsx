import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(false);
  
      try {
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        
        if (!res.ok || !data.posts || data.posts.length === 0) {
          setError(true);
          setLoading(false);
          return;
        }
  
        const postData = data.posts[0];
        setPost(postData);
  
        // ✅ Increment view count only if post exists
        if (postData._id) {
          const updateRes = await fetch(`/api/post/increment-views/${postData._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
          });
  
          const updateData = await updateRes.json();
          if (updateRes.ok) {
            setPost((prev) => ({ ...prev, views: updateData.views }));
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
      {/* ✅ Show correct view count */}
    
    <div>
      <h1>{post.title}</h1>
      <p>👁️ {post.views || 0} views</p> {/* ✅ Display the updated views */}
    </div>

      <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className='italic'>
          {post && (post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      
      <div
        className='p-3 max-w-2xl mx-auto w-full post-content'
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      <div className='max-w-4xl mx-auto w-full'>
        <CallToAction />
      </div>
      <CommentSection postId={post?._id} />

      {/* Recent Articles Section */}
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
