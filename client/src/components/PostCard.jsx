import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <div className='flex items-center border border-teal-500 hover:border-2 rounded-lg p-3 transition-all'>
      {/* Left Section - Image */}
      <div className='w-24 h-16 flex-shrink-0'>
        <Link to={`/post/${post.slug}`}>
          <img
            src={post.headerImage || "/default-placeholder.jpg"}
            onError={(e) => (e.target.src = "/default-placeholder.jpg")}
            alt={post.title}
            className='w-full h-full object-cover rounded-md'
          />
        </Link>
      </div>

      {/* Right Section - Title & Content */}
      <div className='flex-1 px-3'>
        <Link to={`/post/${post.slug}`} className='text-md font-semibold hover:underline'>
          {post.title}
        </Link>
        <p className='text-sm text-gray-600 line-clamp-1'>
          {post.content.replace(/<[^>]+>/g, '').slice(0, 80)}...
        </p>
      </div>

      {/* Stats - Views, Date, Comments, Likes */}
      <div className='flex items-center gap-4 text-gray-500 text-xs'>
        <span>👁️ {post.views || 0}</span>
        <span>📅 {new Date(post.createdAt).toLocaleDateString()}</span>
        <span>💬 {post.commentsCount || 0}</span>
        <p>❤️ {post.likes?.length || 0} likes</p>

      </div>
    </div>
  );
}
