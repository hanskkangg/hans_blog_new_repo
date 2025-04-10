import { Link } from 'react-router-dom';

import "@fontsource/roboto"; 
import "@fontsource/arvo"; 

export default function PostCardSearch({ post }) {
  return (
    <>
      <div className="PostCardSearch relative bg-white dark:bg-gray-800 rounded-md sm:rounded-lg shadow-md sm:border border-gray-200 dark:border-gray-700 p-2 sm:p-4 transition-transform duration-200 hover:scale-105 transition-colors flex flex-row gap-2 sm:gap-4 items-center w-full max-w-full overflow-x-hidden">
        
        {/* Image on the Left and Vertically Centered */}
        <Link 
          to={`/post/${post.slug}`} 
          className="flex items-center justify-center flex-shrink-0 w-[80px] h-[80px] sm:w-[200px] sm:h-[200px]"
        >
          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden">
            <img
              src={post.headerImage || "/default-placeholder.jpg"}
              
  loading="lazy"
              onError={(e) => (e.target.src = "/default-placeholder.jpg")}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>

        {/* Post Content on the Right */}
        <div className="flex flex-col justify-center flex-grow w-full max-w-full">
          
          {/* Author & Date (Smaller Text on Mobile) */}
          <div className="text-[8px] sm:text-xs text-gray-500 dark:text-gray-400 flex justify-between mb-1 w-full">
            <span>{post?.author || "Unknown Author"}</span>
            <span>{new Date(post.updatedAt).toLocaleDateString()}</span>
          </div>

          {/* Title with Maximum of Two Lines */}
    {/* Title with Different Styles for Small and Large Screens */}
<Link to={`/post/${post.slug}`} className="block w-full">
    <h3 
        className="text-sm sm:text-2xl leading-tight text-gray-900 dark:text-gray-200 hover:text-indigo-500 transition-colors overflow-hidden text-ellipsis line-clamp-3"
        title={post.title}
    >
        {post.title}
    </h3>
</Link>

          <div className='mt-2'></div>
          
          {/* Body Content (Smaller Font, 2 Lines on Small Screens, 3 Lines on Large Screens) */}
          <p className="text-[8px] sm:text-xs text-gray-600 dark:text-gray-400 line-clamp-1 sm:line-clamp-3 w-full max-w-full">
            {post.content.replace(/<[^>]+>/g, '').slice(0, 200)}...
          </p>

          <div className='mt-2'></div>

          {/* Footer with Stats and Category */}
          <div className="flex flex-wrap justify-between items-center text-[8px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1 gap-1 sm:gap-2 w-full max-w-full">
            
            {/* Stats Icons with Counts */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <span>👁️ {post.views || 0}</span>
              <span>❤️ {post.likesCount || 0}</span>
              <span>💬 {post.commentsCount || 0}</span>

              {/* Category with Simple Underline */}
              <Link to={`/search?category=${post.category}`}>
                <span className="text-[8px] sm:text-[10px] text-gray-500 dark:text-gray-400 underline">
                  {post.category}
                </span>
              </Link>
            </div>

            {/* "Continue Reading" Button */}
            <Link 
              to={`/post/${post.slug}`} 
              className="text-teal-500 font-medium text-[8px] sm:text-xs hover:underline"
            >
              Continue Reading →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
