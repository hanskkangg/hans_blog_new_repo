import moment from 'moment';
import { useEffect, useState } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Button, Textarea, Badge } from 'flowbite-react';
import { Award } from 'lucide-react';

export default function Comment({ comment, onLike, onEdit, onDelete }) {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (!comment.userId) {
      console.warn("🚨 No userId found for comment:", comment);
      return;
    }

    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/get/${comment.userId._id || comment.userId}`, {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        });
        

        if (!res.ok) {
          throw new Error(`Failed to fetch user: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.log("🔥 Fetch Error:", error.message);
      }
    };

    getUser();
  }, [comment]);

  // ✅ Enable Editing Mode
  const handleEditClick = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  // ✅ Save Edited Comment
  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.token}` // ✅ Ensure Token is Sent
        },
        body: JSON.stringify({
          content: editedContent,
        }),
      });

      if (res.ok) {
        const updatedComment = await res.json();
        setIsEditing(false);
        onEdit(comment._id, updatedComment.content); // ✅ Notify parent to update state
      } else {
        const errorData = await res.json();
        console.log("❌ Error updating comment:", errorData);
      }
    } catch (error) {
      console.log("🔥 Fetch Error:", error.message);
    }
  };
  return (
    <div
    className={`relative flex flex-col p-4 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800 
    ${comment.isMostLiked ? 'border-2 border-gray-400' : 'border border-gray-300 dark:border-gray-700'}`}
>
      <div className="flex items-center mb-2">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={user.profilePicture}
          alt={user.username}
        />
        <div className="ml-3">
          <span className="font-bold text-sm">{user.username || "Anonymous"}</span>
          <span className="text-gray-500 text-xs block">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
      </div>


{comment.isMostLiked && (
    <div className="absolute top-2 right-2 flex items-center gap-2 z-10 bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-md border border-gray-300">
        <Award className="text-black dark:text-white w-4 h-4" />
        <span className="text-xs text-gray-700 dark:text-gray-200 font-medium">
            Top Comments
        </span>
    </div>
)}


      {/* ✅ Show Textarea when Editing, Otherwise Show Comment Text */}
      {isEditing ? (
        <>
          <Textarea
            rows="2"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          />
          <div className="flex gap-2 mt-2">
            <Button color="success" onClick={handleSave}>
              Save
            </Button>
            <Button color="gray" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </>
      ) : (
        <p className="text-gray-700 dark:text-gray-300 break-words whitespace-pre-wrap  pl-2 py-1">
          {comment.content}
        </p>
      )}

      {/* ✅ Actions: Like, Edit, Delete */}
      <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 mt-2 max-w-fit gap-2">
        <button
          type="button"
          onClick={() => onLike(comment._id)}
          className={`text-gray-400 hover:text-blue-500 ${
            currentUser && comment.likes.includes(currentUser._id) ? "!text-blue-500" : ""
          }`}
        >
          <FaThumbsUp className="text-sm" />
        </button>
        <p className="text-gray-400">
          {comment.numberOfLikes > 0 &&
            comment.numberOfLikes +
              " " +
              (comment.numberOfLikes === 1 ? "like" : "likes")}
        </p>

        {currentUser &&
          (currentUser._id === comment.userId || currentUser.isAdmin) && (
            <>
              <button
                type="button"
                onClick={handleEditClick} // ✅ Enable editing mode
                className="text-gray-400 hover:text-blue-500"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(comment._id)}
                className="text-gray-400 hover:text-red-500"
              >
                Delete
              </button>
            </>
          )}
      </div>
    </div>
  );
}
