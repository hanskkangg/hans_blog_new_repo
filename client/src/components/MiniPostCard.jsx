import { Link } from "react-router-dom";

export default function MiniPostCard({ post }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-300 dark:border-gray-600 last:border-none">
      {/* Left: Thumbnail Image */}
      <div className="w-20 h-20 flex-shrink-0 border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
        <img
          src={post.headerImage || "/default-placeholder.jpg"}
          onError={(e) => (e.target.src = "/default-placeholder.jpg")}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right: Post Info */}
      <div className="flex-1 overflow-hidden">
        {/* Title (Multi-line support) */}
        <Link
          to={`/post/${post.slug}`}
          className="block font-bold text-lg leading-tight text-gray-900 dark:text-gray-200 hover:text-indigo-500"
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3, // Allows up to 3 lines before truncation
            overflow: "hidden",
          }}
        >
          {post.title}
        </Link>

        {/* Author & Date */}
        <div className="text-md text-gray-600 dark:text-gray-400 font-medium mt-1">
          {post.author || "Unknown"} • {new Date(post.updatedAt).toLocaleDateString()}
        </div>

        {/* Post Stats */}
        <div className="flex items-center text-md text-gray-500 mt-2">
          <span>👁️ {post.views || 0}</span>
          <span className="ml-3">❤️ {post.likesCount || 0}</span>
          <span className="ml-3">💬 {post.commentsCount || 0}</span>
        </div>
      </div>
    </div>
  );
}
