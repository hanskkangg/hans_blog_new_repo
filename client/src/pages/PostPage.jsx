import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);


  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setPost(null);  // ✅ Reset state to prevent showing old post
      setError(false);
  
      try {
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok || !data.posts.length) {
          setError(true);
          setLoading(false);
          return;
        }
  
        setPost(data.posts[0]); // ✅ Set new post
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
  
    fetchPost();
  }, [postSlug]); // ✅ Runs every time postSlug changes
  useEffect(() => {
    console.log("🔄 Fetching new post for slug:", postSlug);
    const fetchPost = async () => {
      setLoading(true);
      setPost(null); // ✅ Reset state to prevent showing old post
      setError(false);
  
      try {
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok || !data.posts.length) {
          setError(true);
          setLoading(false);
          return;
        }
  
        console.log("✅ Fetched Post:", data.posts[0]);
        setPost(data.posts[0]); // ✅ Update state with new post
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
  
    fetchPost();
  }, [postSlug]); // ✅ Runs every time postSlug changes
  

  
  if (loading)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    );

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
  key={post?.headerImage}  // ✅ Force re-render when image changes
  src={post?.headerImage || "/default-placeholder.jpg"}
  alt={post?.title}
  className='mt-10 p-3 max-h-[600px] w-full object-cover'
/>

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
        <CommentSection postId={post._id}/>

      <div className='flex flex-col justify-center items-center mb-5'>
        <h1 className='text-xl mt-5'>Recent articles</h1>
        <div className='flex flex-wrap gap-5 mt-5 justify-center'>
        </div>
      </div>
    </main>
  );
}
