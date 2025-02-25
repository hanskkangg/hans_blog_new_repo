import { Link } from 'react-router-dom';

// Importing Poppins and Roboto fonts
import "@fontsource/poppins"; // Default weight (400)
import "@fontsource/roboto"; // Importing Roboto font

export default function PostCard({ post }) {
  return (
    <div className="PostCard bg-white dark:bg-gray-900 rounded-lg shadow-md mb-8 overflow-hidden font-poppins transition-colors duration-300">
      
      {/* Clickable Header Image with Responsive Height */}
      <Link 
        to={`/post/${post.slug}`} 
        className="block w-full h-[200px] md:h-[250px] lg:h-[450px]"
      >
        <img
          src={post.headerImage || "/default-placeholder.jpg"}
          onError={(e) => (e.target.src = "/default-placeholder.jpg")}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </Link>

      {/* Post Content with Gaps */}
      <div className="p-4 flex flex-col gap-3">
        
        {/* Author & Date on the Same Line with Dot Separator */}
        <div className="text-[10px] md:text-xs text-black dark:text-gray-300 flex items-center justify-center gap-1">
          <span className="font-medium">{post.author || 'Unknown Author'}</span>
          <span className="text-gray-400 dark:text-gray-500">●</span>
          <span>{new Date(post.updatedAt).toLocaleDateString()}</span>
        </div>

        {/* Clickable Title Centered with Larger Font and Roboto */}
        <Link to={`/post/${post.slug}`} className="block">
          <h3 className="text-xl md:text-3xl font-normal hover:text-teal-500 transition-colors duration-200 text-center break-words font-roboto text-gray-900 dark:text-white">
            {post.title}
          </h3>
        </Link>

        <div className='hidden sm:mt-2 sm:block'></div>

        {/* Body Content (3 Lines Preview on Small Screens, 2 Lines on Larger Screens) */}
        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 line-clamp-3 md:line-clamp-2 mb-3">
          {post.content.replace(/<[^>]+>/g, '')}
        </p>

        {/* Footer: Continue Reading & Stats with Gap */}
        <div className="flex justify-between items-center gap-2">
          
          {/* Continue Reading Button */}
          <Link
            to={`/post/${post.slug}`}
            className="text-teal-500 text-xs md:text-sm hover:underline"
          >
            Continue Reading →
          </Link>

          {/* Post Stats */}
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 text-[10px] md:text-xs">
            <span>👁️ {post.views || 0}</span>
            <span>❤️ {post.likesCount || 0}</span>
            <span>💬 {post.commentsCount || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
