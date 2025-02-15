import { Button, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';

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

      {/* ✅ Search Filters (One Line) */}
      <form 
        onSubmit={handleSubmit} 
        className='flex flex-col sm:flex-row items-center gap-4 bg-gray-100 dark:bg-gray-900 p-4 rounded-lg shadow-md'
      >
        {/* Search Bar */}
        <TextInput
          placeholder='Search posts...'
          id='searchTerm'
          type='text'
          value={sidebarData.searchTerm}
          onChange={handleChange}
          className='flex-1 w-full sm:w-auto'
        />

        {/* Sort By */}
        <Select 
          id='sort' 
          value={sidebarData.sort} 
          onChange={handleChange} 
          className='w-full sm:w-auto'
        >
          <option value='desc'>Latest</option>
          <option value='asc'>Oldest</option>
          <option value='most-viewed'>Most Viewed</option>
          <option value='most-liked'>Most Liked</option>
        </Select>

        {/* Category */}
        <Select 
          id='category' 
          value={sidebarData.category} 
          onChange={handleChange} 
          className='w-full sm:w-auto'
        >
          <option value='all'>All Categories</option>
          <option value='javascript'>JavaScript</option>
          <option value='reactjs'>React.js</option>
          <option value='nextjs'>Next.js</option>
        </Select>

        <Button type='submit' gradientDuoTone='purpleToPink' className='w-full sm:w-auto'>
          Search
        </Button>
      </form>

      {/* ✅ Posts Section */}
      <div className='w-full mt-6'>
        <h1 className='text-2xl font-semibold text-gray-800 dark:text-white mb-4'>
          Search Results
        </h1>

        {/* ✅ Display One Post Per Line */}
        <div className='space-y-6'>
          {loading && <p className='text-lg text-gray-500'>Loading...</p>}
          {!loading && posts.length === 0 && <p className='text-lg text-gray-500'>No posts found.</p>}
          {!loading &&
            posts.map((post) => (
              <div key={post._id} className="w-full">
                <PostCard post={{ ...post, likesCount: post.likesCount || 0 }} />
              </div>
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