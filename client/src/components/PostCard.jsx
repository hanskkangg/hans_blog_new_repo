import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return (
    <div className="border p-4 rounded-md shadow-md">
      <Link to={`/post/${post.slug}`} className="block">
        <img
          src={post.headerImage || "/default-placeholder.jpg"}
          alt={post.title}
          className="w-full h-40 object-cover rounded-md"
        />
        <h2 className="text-xl font-semibold mt-2">{post.title}</h2>
      </Link>

      <p className="text-sm text-gray-600">{new Date(post.createdAt).toLocaleDateString()}</p>

      {/* ✅ Add Likes and Comments Count */}
      <div className="flex justify-between items-center mt-2 text-gray-700">
        <p>👁️ {post.views || 0} views</p>
        <p>💬 {post.commentsCount || 0} comments</p>
        <p>❤️ {post.likesCount || 0} likes</p>  {/* ✅ Ensure likesCount is displayed */}
      </div>
    </div>
  );
}
