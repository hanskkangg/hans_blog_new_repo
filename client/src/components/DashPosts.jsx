import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log(" Fetching posts...");
        const res = await fetch(
          `/api/post/getposts${currentUser.isAdmin ? '' : `?userId=${currentUser._id}`}`,
          { cache: "no-store" }
        );
        const data = await res.json();

        if (res.ok) {
          setUserPosts(data.posts.map(post => ({
            ...post,
            views: post.views || 0,
            commentsCount: post.commentsCount || 0,
          })));
        } else {
          console.error(" API Error:", data.message);
        }
      } catch (error) {
        console.error("Fetch Error:", error.message);
      }
    };

    fetchPosts();
  }, []);
  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
        const url = currentUser.isAdmin
            ? `/api/post/getposts?startIndex=${startIndex}`
            : `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`;

        console.log("Fetching more posts from:", url);

        const res = await fetch(url, { cache: "no-store" });
        const data = await res.json();

        if (res.ok) {
            setUserPosts((prev) => [...prev, ...data.posts]);
            console.log("Fetched posts:", data.posts);

            // Hide the "Show More" button if fewer than expected posts are returned
            if (data.posts.length < 9) {
                setShowMore(false);
                console.log("No more posts to load, hiding the button.");
            }
        } else {
            console.error("Error fetching more posts:", data.message);
        }
    } catch (error) {
        console.log("Fetch Error:", error.message);
    }
};


  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        { method: 'DELETE' }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='table-auto overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Views</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
              <Table.HeadCell>Comments</Table.HeadCell> 
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>

            <Table.Body className='divide-y'>
              {userPosts.length > 0 &&
                userPosts.map((post) => (
                  <Table.Row key={post._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>

                    <Table.Cell>
                      <Link to={post.slug ? `/post/${post.slug}` : '#'}>
                        <img
                          src={post.headerImage || "/default-placeholder.jpg"}
                          
                           loading="lazy"
                          onError={(e) => (e.target.src = "/default-placeholder.jpg")}
                          alt={post.title}
                          className='w-20 h-10 object-cover bg-gray-500 rounded-md'
                        />
                      </Link>
                    </Table.Cell>

                    <Table.Cell>
                      <Link className='font-medium text-gray-900 dark:text-white' to={`/post/${post.slug}`}>
                        {post.title}
                      </Link>
                    </Table.Cell>

                    <Table.Cell>{post.category}</Table.Cell>
                    <Table.Cell className='text-center'>👁️ {post.views || 0}</Table.Cell>
                    <Table.Cell>❤️ {post.likesCount || 0}</Table.Cell>

                    <Table.Cell>💬 {post.commentsCount !== undefined ? post.commentsCount : 0}</Table.Cell>

                    <Table.Cell>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setPostIdToDelete(post._id);
                        }}
                        className='font-medium text-red-500 hover:underline cursor-pointer'
                      >
                        Delete
                      </span>
                    </Table.Cell>

                    <Table.Cell>
                      <Link className='text-teal-500 hover:underline' to={`/update-post/${post._id}`}>
                        Edit
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>

          {showMore && (
            <button
              onClick={handleShowMore}
              className='w-full text-teal-500 self-center text-sm py-7'
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no posts yet!</p>
      )}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this post?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeletePost}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
