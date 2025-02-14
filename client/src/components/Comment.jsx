import moment from 'moment';
import { useEffect, useState } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Button, Textarea } from 'flowbite-react';
import { set } from 'mongoose';

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
        const res = await fetch(`/api/user/get/${comment.userId}`, {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`, // ✅ Ensure token is passed
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

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editedContent,
        }),
      });
      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  
  return (
    <div className="flex flex-col p-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800">
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
  
    {/* ✅ Comment Content with Auto-Wrapping */}
    <p className="text-gray-700 dark:text-gray-300 break-words whitespace-pre-wrap border-l-4 border-teal-500 pl-2 py-1">
      {comment.content}
    </p>
  
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
              onClick={handleEdit}
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
