import { Link } from 'react-router-dom';

export default function PostCardSearch({ post }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden flex gap-4 p-4 transition-transform duration-200 hover:scale-105">
      
      {/* Clickable Header Image (Moderate Size) */}
      <Link to={`/post/${post.slug}`} className="w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0">
        <img
          src={post.headerImage || "/default-placeholder.jpg"}
          onError={(e) => (e.target.src = "/default-placeholder.jpg")}
          alt={post.title}
          className="w-full h-full object-cover rounded-md transition-transform duration-300 hover:scale-105"
        />
      </Link>

      {/* Post Content (Balanced Font & Spacing) */}
      <div className="flex flex-col justify-between flex-grow">
        
        {/* Author & Date */}
        <div className="text-xs text-gray-500 dark:text-gray-400 flex justify-between mb-1">
          <span>{post.author || 'Unknown'}</span>
          <span>{new Date(post.updatedAt).toLocaleDateString()}</span>
        </div>

        {/* Clickable Title */}
        <Link to={`/post/${post.slug}`} className="block">
          <h3 className="text-xl font-semibold hover:text-teal-500 transition-colors duration-200 line-clamp-2">
            {post.title}
          </h3>
        </Link>

        {/* Short Preview */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
          {post.content.replace(/<[^>]+>/g, '').slice(0, 150)}...
        </p>

        {/* Footer: Stats & Continue Reading */}
        <div className="flex justify-between items-center text-xs text-gray-500 mt-3">
          
          {/* Left: Stats */}
          <div className="flex items-center space-x-3">
            <span>👁️ {post.views || 0}</span>
            <span>❤️ {post.likesCount || 0}</span>
            <span>💬 {post.commentsCount || 0}</span>
          </div>

          {/* Right: Read More */}
          <Link to={`/post/${post.slug}`} className="text-teal-500 font-medium text-sm hover:underline">
            Read More →
          </Link>
        </div>
      </div>
    </div>
  );
}
