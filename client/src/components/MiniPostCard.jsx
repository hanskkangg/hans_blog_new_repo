import { Link } from "react-router-dom";
import "@fontsource/roboto"; // Importing Arvo font
import "@fontsource/arvo"; // Importing Arvo font

export default function MiniPostCard({ post }) {
  return (
    <div
      className="MiniPostCard flex items-center gap-4 py-3 border-b border-gray-300 dark:border-gray-600 last:border-none"  >
      {/* Left: Thumbnail Image */}
      <Link to={`/post/${post.slug}`} className="flex-shrink-0">
        <div className="w-24 h-24 flex-shrink-0 border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
          <img
            src={post.headerImage || "/default-placeholder.jpg"}
            onError={(e) => (e.target.src = "/default-placeholder.jpg")}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>

      {/* Right: Post Info */}
      <div className="flex-1 overflow-hidden">
        {/* Title (Multi-line support) */}
        <Link
          to={`/post/${post.slug}`}
          className="block text-sm leading-tight text-gray-900 dark:text-gray-200 hover:text-indigo-500"
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 4,
            overflow: "hidden",
          }}
        >
          {post.title}
        </Link>

        {/* Empty line for spacing */}
        <div className="my-2"></div>

        {/* Author & Date */}
        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          {post.author || "Unknown"} • {new Date(post.updatedAt).toLocaleDateString()}
        </div>

        {/* Post Stats */}
        <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
          <span>👁️ {post.views || 0}</span>
          <span>❤️ {post.likesCount || 0}</span>
          <span>💬 {post.commentsCount || 0}</span>
        </div>
      </div>
    </div>
  );
}
