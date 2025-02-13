import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <div className='group relative w-full border border-teal-500 hover:border-2 h-[450px] overflow-hidden rounded-lg transition-all flex flex-col justify-between'>
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.headerImage}
          alt='post cover'
          className='h-[250px] w-full object-cover group-hover:h-[150px] transition-all duration-300'
        />
      </Link>
      <div className='p-4 flex flex-col gap-2 flex-grow'>
        <p className='text-lg font-semibold line-clamp-2'>{post.title}</p>
        <span className='italic text-sm text-gray-600'>{post.category}</span>
      </div>
      <div className="p-4 mt-auto">
        <Link
          to={`/post/${post.slug}`}
          className='block border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md w-full'
        >
          Read article
        </Link>
      </div>
    </div>
  );
}
