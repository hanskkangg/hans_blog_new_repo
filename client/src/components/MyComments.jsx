import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'; // ✅ Import Link for navigation
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function MyComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getUserComments/${currentUser._id}`, {
          headers: { Authorization: `Bearer ${currentUser?.token}` },
        });
        const data = await res.json();

        if (res.ok) {
          const sortedComments = data.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setComments(sortedComments);
          if (data.comments.length < 9) setShowMore(false);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser) {
      fetchComments();
    }
  }, [currentUser]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(`/api/comment/getUserComments/${currentUser._id}?startIndex=${startIndex}`, {
        headers: { Authorization: `Bearer ${currentUser?.token}` },
      });
      const data = await res.json();

      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) setShowMore(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${currentUser?.token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete));
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3">
      {comments.length > 0 ? (
        <>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Your Comments</h2>

          <Table hoverable className="shadow-md mt-4">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Number of likes</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>

            <Table.Body className="divide-y">
              {comments.map((comment) => (
                <Table.Row key={comment._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{new Date(comment.updatedAt).toLocaleDateString()}</Table.Cell>

                  <Table.Cell className="max-w-xs">
                    <div className="whitespace-normal break-words overflow-hidden text-ellipsis p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
                      {comment.content}
                    </div>
                  </Table.Cell>

                  <Table.Cell>{comment.numberOfLikes}</Table.Cell>

                  <Table.Cell>
  {comment.postId ? (
    <Link
      to={`/post/${comment.postId.slug || comment.postId._id}`} 
      className="text-teal-500 hover:underline"
    >
      {comment.postId.title}
    </Link>
  ) : (
    "Unknown Post"
  )}
</Table.Cell>


                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setCommentIdToDelete(comment._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          {showMore && (
            <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You haven't made any comments yet!</p>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">Are you sure you want to delete this comment?</h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteComment}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
