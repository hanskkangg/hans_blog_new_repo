import { Link } from 'react-router-dom';

export default function PostCardSearch({ post }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 flex gap-4 p-4 transition-transform duration-200 hover:scale-105">
      
      {/* Vertically Centered Header Image with Responsive Size on the Left */}
      <Link 
        to={`/post/${post.slug}`} 
        className="flex items-center justify-center flex-shrink-0"
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

      {/* Post Content (Responsive & Mobile-Friendly) */}
      <div className="flex flex-col justify-between flex-grow">
        
        {/* Author & Date (Small Text, Centered on Mobile) */}
        <div className="text-xs text-gray-500 dark:text-gray-400 flex justify-between mb-1">
          <span>{post.author || 'Unknown'}</span>
          <span>{new Date(post.updatedAt).toLocaleDateString()}</span>
        </div>

        {/* Clickable Full or Truncated Title */}
        <Link to={`/post/${post.slug}`} className="block">
          <h3 
            className="text-lg font-semibold hover:text-teal-500 transition-colors duration-200 line-clamp-4"
            style={{ display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
            title={post.title}
          >
            {post.title}
          </h3>
        </Link>

        {/* Body Content - Only Visible on Larger Screens */}
        <p className="hidden md:block text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-3">
          {post.content.replace(/<[^>]+>/g, '').slice(0, 150)}...
        </p>

        {/* Footer: Stats with Icons and "Continue Reading" Button */}
        <div className="flex justify-between items-center text-xs text-gray-500 mt-3">
          
          {/* Stats: Icons with Counts */}
          <div className="flex items-center space-x-2">
            <span>👁️ {post.views || 0}</span>
            <span>❤️ {post.likesCount || 0}</span>
            <span>💬 {post.commentsCount || 0}</span>
          </div>

          {/* "Continue Reading" Button - Only on Larger Screens */}
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
