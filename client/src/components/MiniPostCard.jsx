import { Link } from "react-router-dom";
import "@fontsource/roboto"; 
import "@fontsource/arvo"; 

export default function MiniPostCard({ post }) {
  return (
    <div
      className="MiniPostCard flex items-center gap-4 py-3 border-b border-gray-200 dark:border-gray-600 last:border-none transition-colors duration-300"
    >
      {/* Thumbnail Image */}
      <Link to={`/post/${post.slug}`} className="flex-shrink-0">
        <div className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden">
          <img
            src={post.headerImage || "/default-placeholder.jpg"}
            onError={(e) => (e.target.src = "/default-placeholder.jpg")}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>

      {/* Post Info */}
      <div className="flex-1 overflow-hidden">
        

        {/* Title with Dark Mode Support */}
        <Link
          to={`/post/${post.slug}`}
          className="block text-sm leading-tight text-gray-900 dark:text-gray-200 hover:text-indigo-500 transition-colors"
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 4,
            overflow: "hidden",
          }}
        >
          {post.title}
        </Link>

        {/* Spacing */}
        <div className="my-2"></div>

        {/* Author & Date with Dark Mode */}
        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          {post.author || "Unknown"} • {new Date(post.updatedAt).toLocaleDateString()}
        </div>

        {/* Post Stats with Dark Mode */}
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1 space-x-2">
          <span>👁️ {post.views || 0}</span>
          <span>❤️ {post.likesCount || 0}</span>
          <span>💬 {post.commentsCount || 0}</span>
          
        {/* Category Above the Title */}
        <div className="mb-1">
          <Link to={`/search?category=${post.category}`}>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 underline">
              {post.category}
            </span>
          </Link>
        </div>

        </div>
      </div>
    </div>
  );
}
