import { Link } from 'react-router-dom';

export default function MiniPostCard({ post }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-300 dark:border-gray-600 last:border-none">
      {/* Left: Thumbnail Image */}
      <div className="w-16 h-16 flex-shrink-0 border border-gray-300 dark:border-gray-600 rounded-md">
        <img
          src={post.headerImage || "/default-placeholder.jpg"}
          onError={(e) => (e.target.src = "/default-placeholder.jpg")}
          alt={post.title}
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      {/* Right: Post Info */}
      <div className="flex-1 overflow-hidden">
        {/* Title (Truncated if too long) */}
        <Link
          to={`/post/${post.slug}`}
          className="block font-semibold text-sm truncate hover:text-indigo-500"
          style={{ maxWidth: '100%' }} // Ensure it fits within the border
        >
          {post.title}
        </Link>

        {/* Author & Date */}
        <div className="text-xs text-gray-500 truncate">
          {post.author || "Unknown"} • {new Date(post.updatedAt).toLocaleDateString()}
        </div>

        {/* Post Stats */}
        <div className="flex items-center text-xs text-gray-500 mt-1">
          <span>👁️ {post.views || 0}</span>
          <span className="ml-2">❤️ {post.likesCount || 0}</span>
          <span className="ml-2">💬 {post.commentsCount || 0}</span>
        </div>
      </div>
    </div>
  );
}
