import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'quill-image-uploader';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useEffect, useState, useRef, useMemo } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function UpdatePost() {
  const { postId } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [headerImage, setHeaderImage] = useState('');
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [publishError, setPublishError] = useState(null);
  const quillRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'uncategorized',
    content: '',
    headerImage: '',
    _id: '',


    
  });
  useEffect(() => {
    if (!postId) {
        console.error("🚨 Post ID is missing in the URL!");
        setPublishError("🚨 Post ID is missing!");
        return;
    }

    const fetchPost = async () => {
        try {

            const res = await fetch(`/api/post/getpost/${postId}`);
            if (!res.ok) {
                const errorText = await res.text();
                console.error("🚨 API Error Response:", errorText);
                throw new Error(`🚨 API Error: ${errorText}`);
            }

            const data = await res.json();
            console.log("✅ Post Data Fetched:", data);

            if (!data.post) {
                throw new Error("🚨 Post not found!");
            }

            // ✅ Pre-fill the form with existing post data
            setFormData({
                title: data.post?.title || "",
                category: data.post?.category || "uncategorized",
                content: data.post?.content || "",
                headerImage: data.post?.headerImage || "",
                _id: data.post?._id || postId,
                author: data.post?.userId?.username || "Unknown Author",
            });

            // ✅ Ensure the header image is displayed
            setHeaderImage(data.post?.headerImage || "");

        } catch (error) {
            console.error("🔥 Fetch Error:", error.message);
            setPublishError(error.message);
        }
    };

    fetchPost();
}, [postId]);


  
  
  
  const handleUploadImage = async () => {
    if (!file) {
      setImageUploadError('Please select an image');
      return;
    }

    setImageUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + '-' + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageUploadError('Image upload failed');
        setImageUploadProgress(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUploadProgress(null);
          setImageUploadError(null);
          setHeaderImage(downloadURL);
          setFormData((prevData) => ({ ...prevData, headerImage: downloadURL }));
        });
      }
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🟢 Checking Form Data Before Submission:", formData);
  
    if (!formData._id || formData._id === "") {
      console.error("🚨 Post ID is missing! Retrying update...");
      setFormData((prev) => ({
        ...prev,
        _id: postId,  // ✅ Force reassigning postId
      }));
      return;
    }
    
  
    try {
      console.log("🔹 Sending update request with ID:", formData._id);
  
      const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify(formData),
      });
  
      console.log("🔹 Response Status:", res.status);
  
      const data = await res.json();
      console.log("✅ Post Updated:", data);
  
      if (data.error) {
        setPublishError(data.error);
        return;
      }
  
      navigate(`/post/${data.slug}`);
    } catch (error) {
      console.error("🔥 Submit Error:", error);
      setPublishError(error.message);
    }
  };
  
  

  const quillModules = useMemo(() => ({
    toolbar: {
      container: [
        ['bold', 'italic', 'underline'],
        [{ header: '1' }, { header: '2' }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image', 'video'],
      ],
    },
  }), []);

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <Select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
          <option value="uncategorized">Select a category</option>
          <option value="javascript">JavaScript</option>
          <option value="reactjs">React.js</option>
          <option value="nextjs">Next.js</option>
        </Select>

        <FileInput type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
        <Button type="button" onClick={handleUploadImage} disabled={imageUploadProgress}>
          Upload Image
        </Button>
        {headerImage && <img src={headerImage} alt="Updated Header" className="w-full h-40 object-cover mt-2" />}

        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={formData.content}
          onChange={(value) => setFormData({ ...formData, content: value })}
          modules={quillModules}
        />

        <Button type="submit">Update Post</Button>
        {publishError && <Alert color="failure">{publishError}</Alert>}
      </form>
    </div>
  );
}
