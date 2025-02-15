import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/post/${post.slug}`} className="block">
        <img
          src={post.headerImage || "/default-placeholder.jpg"}
          alt={post.title}
          className="w-full h-40 object-cover"
        />
      </Link>

      <div className="p-4">
        <Link to={`/post/${post.slug}`} className="block">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white hover:underline">
            {post.title}
          </h2>
        </Link>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          By <span className="font-medium">{post.author || "Unknown"}</span> • {new Date(post.createdAt).toLocaleDateString()}
        </p>

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
          {post.content.replace(/<[^>]*>?/gm, '').slice(0, 100)}...
        </p>

        <div className="mt-3 flex items-center justify-between text-gray-500 dark:text-gray-400 text-sm">
          <p>👁️ {post.views || 0} views</p>
          <p>💬 {post.commentsCount || 0} comments</p>
          <p>❤️ {post.likesCount || 0} likes</p>
        </div>
      </div>
    </div>
  );
}
