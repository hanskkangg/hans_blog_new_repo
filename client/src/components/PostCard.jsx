import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <div className="flex flex-col md:flex-row bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden p-4 mb-5">
      {/* Left: Post Content */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        {/* Author & Date (Same Line) */}
        <div className="flex justify-between text-sm text-gray-500">
          <span className="font-semibold">{post.author || 'Unknown Author'}</span>
          <span>{new Date(post.updatedAt).toLocaleDateString()}</span>
        </div>

        {/* Title (Left-Aligned) */}
        <Link to={`/post/${post.slug}`} className="block text-lg font-bold mt-1 mb-1 text-left">
          {post.title}
        </Link>

        {/* Post Content (Short Preview) */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {post.content.replace(/<[^>]+>/g, '').slice(0, 100)}...
        </p>

        {/* Post Stats */}
        <div className="flex justify-start space-x-4 mt-3 text-gray-500 text-xs">
          <span>👁️ {post.views || 0}</span>
          <span>❤️ {post.likesCount || 0}</span>
          <span>💬 {post.commentsCount || 0}</span>
        </div>
      </div>

      {/* Right: Post Image */}
      <div className="w-32 h-24 md:w-40 md:h-28 flex-shrink-0">
        <img
          src={post.headerImage || "/default-placeholder.jpg"}
          onError={(e) => (e.target.src = "/default-placeholder.jpg")}
          alt={post.title}
          className="w-full h-full object-cover rounded-md"
        />
      </div>
    </div>
  );
}
