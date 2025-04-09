import { Link } from 'react-router-dom';

export default function RecentPostCard({ post }) {
  return (
    <div className="RecentPostCard bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-5 transition-transform transform hover:scale-105 transition-colors duration-300">
      
      {/* Image Thumbnail */}
      <Link to={`/post/${post.slug}`} className="block w-full h-[250px] overflow-hidden rounded-md mb-3">
        <img
          src={post.headerImage || "/default-placeholder.jpg"}
          
  loading="lazy"
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </Link>

      {/* Author & Date */}
      <div className="text-[12px] text-black dark:text-gray-300 flex items-center justify-start gap-1 mb-2">
        <span className="font-medium">{post.author || 'Unknown Author'}</span>
        <span className="text-gray-400 dark:text-gray-500">●</span>
        <span>{new Date(post.updatedAt).toLocaleDateString()}</span>
      </div>

      {/* Title */}
      <Link to={`/post/${post.slug}`} className="block">
        <h3 className="text-base font-normal text-gray-900 dark:text-white line-clamp-2 mb-2">
          {post.title}
        </h3>
      </Link>

      {/* Body Content */}
      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mb-3">
        {post.content.replace(/<[^>]+>/g, '')}
      </p>

      {/* Category & Views with Dark Mode */}
      <div className="mb-1">
          <Link to={`/search?category=${post.category}`}>
            <span className="text-[12px] text-gray-500 dark:text-gray-400 underline">
              {post.category}
            </span>
          </Link>
      </div>

      {/* Footer: Continue Reading & Stats */}
      <div className="flex justify-between items-center gap-2 mt-2">
        <Link
          to={`/post/${post.slug}`}
          className="text-teal-500 text-[12px] hover:underline"
        >
          Continue Reading →
        </Link>

        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 text-[12px]">
          <span>👁️ {post.views || 0}</span>
          <span>❤️ {post.likesCount || 0}</span>
          <span>💬 {post.commentsCount || 0}</span>
        </div>
      </div>
    </div>
  );
}
