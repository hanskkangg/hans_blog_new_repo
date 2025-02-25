import { Link } from 'react-router-dom';

import "@fontsource/roboto"; 
import "@fontsource/arvo"; 

export default function PostCardSearch({ post }) {
  return (
    <div className="PostCardSearch relative bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 flex gap-4 p-4 transition-transform duration-200 hover:scale-105 transition-colors">
      
      {/* Header Image with Dark Mode Support */}
      <Link 
        to={`/post/${post.slug}`} 
        className="flex items-center justify-center flex-shrink-0 relative"
      >
        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-40 md:h-40 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden">
          <img
            src={post.headerImage || "/default-placeholder.jpg"}
            onError={(e) => (e.target.src = "/default-placeholder.jpg")}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>

      {/* Post Content (Dark Mode) */}
      <div className="flex flex-col justify-between flex-grow">
        
        {/* Author & Date */}
        <div className="text-xs text-gray-500 dark:text-gray-400 flex justify-between mb-1">
          <span>{post?.author || "Unknown Author"}</span>
          <span>{new Date(post.updatedAt).toLocaleDateString()}</span>
        </div>

        {/* Title with Dark Mode */}
        <Link to={`/post/${post.slug}`} className="block">
          <h3 
            className="text-2xl hover:text-teal-500 transition-colors duration-200 line-clamp-4 text-gray-900 dark:text-gray-200"
            style={{ display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
            title={post.title}
          >
            {post.title}
          </h3>
        </Link>
        
        <div className='mt-2'></div>

        {/* Body Content */}
        <p className="hidden md:block text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-3">
          {post.content.replace(/<[^>]+>/g, '').slice(0, 150)}...
        </p>

        {/* Footer with Dark Mode Support */}
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-3">
          
          {/* Stats Icons with Counts */}
          <div className="flex items-center space-x-2 text-sm">
            <span>👁️ {post.views || 0}</span>
            <span>❤️ {post.likesCount || 0}</span>
            <span>💬 {post.commentsCount || 0}</span>

            {/* Category Badge Next to Comment Icon */}
          
          {/* Category with Simple Underline */}
          <Link to={`/search?category=${post.category}`}>
            <span className="text-[12px]  text-gray-500 dark:text-gray-400 underline">
              {post.category}
            </span>
          </Link>
          </div>

          {/* "Continue Reading" Button */}
          <Link 
            to={`/post/${post.slug}`} 
            className="hidden md:inline-block text-teal-500 font-medium text-sm hover:underline"
          >
            Continue Reading →
          </Link>
        </div>
      </div>
    </div>
  );
}
