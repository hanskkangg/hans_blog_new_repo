import { Link } from 'react-router-dom';

import "@fontsource/roboto"; // Importing Arvo font
import "@fontsource/arvo"; // Importing Arvo font

export default function PostCard({ post }) {
  return (
    <div className="PostCard bg-white dark:bg-gray-800 rounded-lg shadow-md mb-8 overflow-hidden" 
   >
      {/* Clickable Header Image */}
      <Link to={`/post/${post.slug}`} className="block w-full h-[300px] md:h-[400px] lg:h-[450px]">
        <img
          src={post.headerImage || "/default-placeholder.jpg"}
          onError={(e) => (e.target.src = "/default-placeholder.jpg")}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </Link>

      {/* Post Content */}
      <div className="p-6">
        {/* Author & Date */}
        <div className="text-sm text-gray-500 flex justify-between items-center mb-2">
  <span className="font-medium">{post.author || 'Unknown Author'}</span>
  <span>{new Date(post.updatedAt).toLocaleDateString()}</span>
</div>



        {/* Clickable Title */}
        <Link to={`/post/${post.slug}`} className="block">
          <h3 className="text-2xl font-semibold mb-3 hover:text-teal-500 transition-colors duration-200">
            {post.title}
          </h3>
        </Link>

        {/* Body Content (Short Preview) */}
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {post.content.replace(/<[^>]+>/g, '').slice(0, 200)}...
        </p>

        {/* Footer: Continue Reading & Stats */}
        <div className="flex justify-between items-center">
          {/* Left: Continue Reading Button */}
          <Link
            to={`/post/${post.slug}`}
            className="text-teal-500  hover:underline"
          >
            Continue Reading →
          </Link>

          {/* Right: Post Stats */}
          <div className="flex items-center space-x-4 text-gray-500 text-sm">
            <span>👁️ {post.views || 0}</span>
            <span>❤️ {post.likesCount || 0}</span>
            <span>💬 {post.commentsCount || 0}</span> {/* ✅ Display Comments Count */}
          </div>
        </div>
      </div>
    </div>
  );
}
