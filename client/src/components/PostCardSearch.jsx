import { Link } from 'react-router-dom';

import "@fontsource/roboto"; 
import "@fontsource/arvo"; 

export default function PostCardSearch({ post }) {
  return (
    <div className="PostCardSearch relative bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 transition-transform duration-200 hover:scale-105 transition-colors flex flex-row gap-4 items-center">
      
      {/* Image on the Left and Vertically Centered */}
      <Link 
        to={`/post/${post.slug}`} 
        className="flex items-center justify-center flex-shrink-0 w-[80px] h-[80px] sm:w-[200px] sm:h-[200px]"
      >
        <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden">
          <img
            src={post.headerImage || "/default-placeholder.jpg"}
            onError={(e) => (e.target.src = "/default-placeholder.jpg")}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>

      {/* Post Content on the Right */}
      <div className="flex flex-col justify-center flex-grow">
        
        {/* Author & Date (Smaller Text on Mobile) */}
        <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 flex justify-between mb-1">
          <span>{post?.author || "Unknown Author"}</span>
          <span>{new Date(post.updatedAt).toLocaleDateString()}</span>
        </div>

        {/* Title with Smaller Font for Mobile */}
        <Link to={`/post/${post.slug}`} className="block">
          <h3 
            className="text-sm sm:text-2xl hover:text-teal-500 transition-colors duration-200 line-clamp-1 sm:line-clamp-1 text-gray-900 dark:text-gray-200"
            style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
            title={post.title}
          >
            {post.title}
          </h3>
        </Link>
        
        <div className='mt-4'></div>

        {/* Body Content (Shortened for Mobile) */}
        <p className="text-[10px] sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-1 sm:line-clamp-3">
          {post.content.replace(/<[^>]+>/g, '').slice(0, 100)}...
        </p>

        {/* Footer with Stats and Category */}
        <div className="flex flex-wrap justify-between items-center text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-2 gap-2">
          
          {/* Stats Icons with Counts */}
          <div className="flex items-center space-x-2">
            <span>👁️ {post.views || 0}</span>
            <span>❤️ {post.likesCount || 0}</span>
            <span>💬 {post.commentsCount || 0}</span>

            {/* Category with Simple Underline */}
            <Link to={`/search?category=${post.category}`}>
              <span className="text-[10px] sm:text-[12px] text-gray-500 dark:text-gray-400 underline">
                {post.category}
              </span>
            </Link>
          </div>

          {/* "Continue Reading" Button */}
          <Link 
            to={`/post/${post.slug}`} 
            className="text-teal-500 font-medium text-[10px] sm:text-sm hover:underline"
          >
            Continue Reading →
          </Link>
        </div>
      </div>
    </div>
  );
}
