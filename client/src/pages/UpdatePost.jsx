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
  const [file, setFile] = useState(null);
  const [headerImage, setHeaderImage] = useState(""); // ✅ For previewing image
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [content, setContent] = useState(""); // ✅ Add content state
  const { postId } = useParams();
  const { currentUser } = useSelector((state) => state.user);

  const quillRef = useRef(null);
  const navigate = useNavigate();

  console.log("🟢 postId from URL:", postId);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log("🟢 Fetching post with postId:", postId);
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();

        if (!res.ok) {
          console.log("🚨 API Error:", data.message);
          setPublishError(data.message);
          return;
        }

        if (data.posts.length > 0) {
          const postData = data.posts[0];

          console.log("🟢 Post Data Fetched:", postData);

          // ✅ Set state
          setFormData({ ...postData, _id: postId });
          setContent(postData.content);
          setHeaderImage(postData.headerImage); // ✅ Set current header image
        } else {
          console.log("🚨 No post found!");
        }
      } catch (error) {
        console.log("🔥 Fetch Error:", error.message);
      }
    };

    if (postId) fetchPost();
  }, [postId]);

  // ✅ Handle Header Image Upload with Preview & Progress Bar
  const handleUploadImage = async () => {
    try {
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
            setHeaderImage(downloadURL); // ✅ Update preview
            setFormData({ ...formData, headerImage: downloadURL }); // ✅ Save in form data
          });
        }
      );
    } catch (error) {
      setImageUploadError('Image upload failed');
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  // ✅ Handle Image Upload in Quill Editor
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      try {
        const url = await uploadToFirebase(file);

        // Insert image into Quill editor
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        quill.insertEmbed(range.index, 'image', url);

        // Store in content state
        setContent(quill.root.innerHTML);
      } catch (error) {
        console.error("🔥 Image Upload Failed:", error);
      }
    };
  };

  const uploadToFirebase = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = `${Date.now()}-${file.name}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        null,
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  // ✅ Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🟢 Submitting Form Data:", formData);

    if (!formData._id) {
      setPublishError("🚨 Post ID is missing!");
      console.log("🚨 formData._id is missing!", formData);
      return;
    }

    try {
      const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, content }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.log("🚨 API Response Error:", data);
        setPublishError(data.message);
        return;
      }

      console.log("✅ Post Updated:", data);
      navigate(`/post/${data.slug}`);
    } catch (error) {
      console.log("🔥 Submit Error:", error);
      setPublishError('Something went wrong');
    }
  };

  const quillModules = useMemo(() => ({
    toolbar: {
      container: [
        ['bold', 'italic', 'underline'],
        [{ header: '1' }, { header: '2' }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'], // ✅ Enable image uploads
      ],
      handlers: {
        image: imageHandler, // ✅ Custom image upload function
      },
    },
  }), []);

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Update post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <TextInput
          type='text'
          placeholder='Title'
          required
          id='title'
          className='flex-1'
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          value={formData.title}
        />
        <Select
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          value={formData.category}
        >
          <option value='uncategorized'>Select a category</option>
          <option value='javascript'>JavaScript</option>
          <option value='reactjs'>React.js</option>
          <option value='nextjs'>Next.js</option>
        </Select>

        <FileInput type='file' accept='image/*' onChange={(e) => setFile(e.target.files[0])} />
        <Button type='button' gradientDuoTone='purpleToBlue' size='sm' outline onClick={handleUploadImage}>
          Upload Image
        </Button>

        {imageUploadProgress && <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress}%`} />}
        {headerImage && <img src={headerImage} alt="Updated Header" className="w-full h-40 object-cover mt-2" />}

        <ReactQuill ref={quillRef} theme='snow' value={content} placeholder='Edit your content...' modules={quillModules} onChange={setContent} />

        <Button type='submit' gradientDuoTone='purpleToPink'>Update post</Button>
        {publishError && <Alert color='failure'>{publishError}</Alert>}
      </form>
    </div>
  );
}
