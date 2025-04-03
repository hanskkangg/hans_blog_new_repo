import { Button, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCardSearch from '../components/PostCardSearch';
import MiniPostCard from '../components/MiniPostCard';
import { useSelector } from 'react-redux';

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc', // Default to "Latest"
    category: 'all', // Show all categories by default
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [mostViewedPosts, setMostViewedPosts] = useState([]);
  const { theme } = useSelector((state) => state.theme); // Get the theme from Redux or global state

  const location = useLocation();
  const navigate = useNavigate();

  const categories = [
    'all', 'Web Development', 'Deployment & Automation', 'Troubleshooting & Debugging', 'Personal Projects' , 'Learning Hub'
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


    const fetchSidebarPosts = async () => {
      try {
        const trendingRes = await fetch("/api/post/getPosts?limit=5&sort=most-liked");
        const trendingData = await trendingRes.json();
        setTrendingPosts(trendingData.posts);

        const mostViewedRes = await fetch("/api/post/getPosts?limit=5&sort=most-viewed");
        const mostViewedData = await mostViewedRes.json();
        setMostViewedPosts(mostViewedData.posts);
      } catch (error) {
        console.error("Error fetching sidebar posts:", error);
      }
    };

    fetchPosts();
    fetchSidebarPosts();
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
    <div className="flex flex-col w-full max-w-7xl mx-auto p-6"> {/* Increased max width */}
      
      {/* Search Bar & Sorting */}
      <form 
        onSubmit={handleSubmit} 
        className="flex flex-col sm:flex-row items-center gap-4 bg-gray-100 dark:bg-gray-900 p-4 rounded-lg shadow-md"
      >
        <TextInput
            placeholder="Search posts..."
            id="searchTerm"
            type="text"
            value={sidebarData.searchTerm}
            onChange={handleChange}
            className="flex-1 w-full sm:w-auto"
        />
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
        
    {/*  Custom Button */}
    <button
      type="submit"
      className={`px-6 py-2 rounded-md text-sm font-medium border transition-colors duration-300 w-full sm:w-auto 
        ${theme === 'dark' 
          ? 'bg-gray-800 text-white border-gray-600 hover:bg-white hover:text-black' 
          : 'bg-white text-black border-black hover:bg-black hover:text-white'}`}
    >
      Search
    </button>
</form>

      {/* Categories */}
      <div className="flex flex-wrap gap-6 sm:gap-10 mt-6 justify-center border-t-2 border-b-2 border-gray-300 dark:border-gray-600 py-3">{categories.map((category) => (
    <button
        key={category}
        onClick={() => handleCategoryClick(category)}
        className={`relative px-2 py-1 text-xs sm:px-4 sm:py-2 xl:text-sm sm:text-xs font-semibold transition-all whitespace-nowrap
            ${
              sidebarData.category === category 
                ? 'text-black dark:text-gray-200 underline underline-offset-4 decoration-4 decoration-black dark:decoration-gray-200' 
                : 'text-black dark:text-gray-200 hover:text-black dark:hover:text-gray-300 hover:underline hover:underline-offset-4 hover:decoration-gray hover:decoration-4'
            }`}
    >
        {category.charAt(0).toUpperCase() + category.slice(1)}
    </button>
))}


      </div>

      {/* Main Content & Sidebar */}
      <div className="flex flex-col md:flex-row gap-8 mt-6">
        
        {/* Search Results (70%) */}
        <div className="w-full md:w-[70%]">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
            Search Results
          </h1>
          <div className="space-y-4">
            {loading && <p className='text-lg text-gray-500'>Loading...</p>}
            {!loading && posts.length === 0 && <p className='text-lg text-gray-500'>No posts found.</p>}
            {!loading && posts.map((post) => (
              <PostCardSearch key={post._id} post={post} />
            ))}
            
           {/*  Show More Button */}
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

        {/* Sidebar (30%) */}
        <div className="w-full md:w-[30%] space-y-6">
          <div className="p-5 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 border-b border-gray-300 pb-2 text-center">
            
          Top Liked Posts 
            </h2>
            {trendingPosts.map((post) => (
              <MiniPostCard key={post._id} post={post} />
            ))}
          </div>
          <div className="p-5 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 border-b border-gray-300 pb-2 text-center">
              
          Top Viewed Posts 
            </h2>
            {mostViewedPosts.map((post) => (
              <MiniPostCard key={post._id} post={post} />
            ))}
          </div>

          
      </div>
        
      </div>
    </div>
  );
}