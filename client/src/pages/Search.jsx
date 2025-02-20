import { Button, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCardSearch from '../components/PostCardSearch';

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc', // ✅ Default to "Latest"
    category: 'all', // ✅ Show all categories by default
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const categories = [
    'all', 'javascript', 'reactjs', 'nextjs', 'nodejs', 'mongodb'
  ];

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const sortFromUrl = urlParams.get('sort');
    const categoryFromUrl = urlParams.get('category');

    setSidebarData({
      searchTerm: searchTermFromUrl || '',
      sort: sortFromUrl || 'desc',
      category: categoryFromUrl || 'all',
    });

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/post/getposts?${searchQuery}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      setPosts(data.posts);
      setLoading(false);
      setShowMore(data.posts.length === 9);
    };

    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    setSidebarData({ ...sidebarData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('category', sidebarData.category);
    navigate(`/search?${urlParams.toString()}`);
  };

  const handleCategoryClick = (category) => {
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('category', category);
    navigate(`/search?${urlParams.toString()}`);
  };

  const handleShowMore = async () => {
    const startIndex = posts.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const res = await fetch(`/api/post/getposts?${urlParams.toString()}`);
    if (!res.ok) return;
    const data = await res.json();
    setPosts([...posts, ...data.posts]);
    setShowMore(data.posts.length === 9);
  };

  return (
    <div className='flex flex-col w-full max-w-4xl mx-auto p-6'>
{/* ✅ Search Bar & Sorting */} 
<form 
    onSubmit={handleSubmit} 
    className="flex flex-col sm:flex-row items-center gap-4 bg-gray-100 dark:bg-gray-900 p-4 rounded-lg shadow-md"
>
    {/* Search Bar */}
    <TextInput
        placeholder="Search posts..."
        id="searchTerm"
        type="text"
        value={sidebarData.searchTerm}
        onChange={handleChange}
        className="flex-1 w-full sm:w-auto"
    />

    {/* Sort By */}
    <select 
        id="sort" 
        value={sidebarData.sort} 
        onChange={handleChange} 
        className="w-full sm:w-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-2 rounded-md"
    >
        <option value="desc">Latest</option>
        <option value="asc">Oldest</option>
        <option value="most-viewed">Most Viewed</option>
        <option value="most-liked">Most Liked</option>
    </select>

    {/* ✅ Updated Search Button */}
    <Button 
        type="submit" 
        className={`px-6 py-2 rounded-md text-sm font-medium border transition-all
          bg-white text-black border-black hover:bg-black hover:text-white w-full sm:w-auto
        `}
    >
        Search
    </Button>

    </form>

    {/* ✅ Category Filters (Responsive Design with Flex Wrapping) */}
<div className="flex flex-wrap gap-6 sm:gap-10 mt-6 justify-center border-t-2 border-b-2 border-gray-300 dark:border-gray-600 py-3">
    {categories.map((category) => (
        <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={` 
                relative px-2 py-1 sm:px-4 sm:py-2 text-base sm:text-lg font-semibold transition-all 
                text-black dark:text-white whitespace-nowrap
                ${sidebarData.category === category 
                    ? 'underline underline-offset-4 decoration-4 decoration-black' 
                    : 'hover:underline hover:underline-offset-4 hover:decoration-gray-500 hover:decoration-4'}
            `}
        >
            {category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
    ))}
</div>





      {/* ✅ Posts Section */}
      <div className='w-full mt-6'>
        <h1 className='text-2xl font-semibold text-gray-800 dark:text-white mb-4'>
          Search Results
        </h1>

        {/* ✅ Display One Post Per Line */}
        <div className='space-y-4'>
          {loading && <p className='text-lg text-gray-500'>Loading...</p>}
          {!loading && posts.length === 0 && <p className='text-lg text-gray-500'>No posts found.</p>}
          {!loading &&
            posts.map((post) => (
              <PostCardSearch key={post._id} post={{ ...post, likesCount: post.likesCount || 0 }} />
            ))
          }
        </div>

        {/* ✅ Show More Button */}
        {showMore && (
          <button
            onClick={handleShowMore}
            className='mt-6 w-full text-teal-500 text-lg hover:underline p-3'
          >
            Show More
          </button>
        )}
      </div>
    </div>
  );
}
