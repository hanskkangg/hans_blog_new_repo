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
import { useState, useRef, useMemo } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const [headerImage, setHeaderImage] = useState(null);
  const [headerUploadProgress, setHeaderUploadProgress] = useState(null);
  const [headerUploadError, setHeaderUploadError] = useState(null);
  const [content, setContent] = useState(""); // 🔥 Separate state for editor content
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    media: [],
    headerImage: "",
  });
  const [publishError, setPublishError] = useState(null);
  const quillRef = useRef(null);
  const navigate = useNavigate();

  // 🔥 Prevent unnecessary re-renders
  const quillModules = useMemo(() => ({
    toolbar: {
      container: [
        ['bold', 'italic', 'underline'],
        [{ 'header': '1' }, { 'header': '2' }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image', 'video'], // Include Image & Video Buttons
      ],
      handlers: {
        image: () => imageHandler(),
        video: () => imageHandler(),
      },
    },
  }), []);


  // 🔥 Handle Header Image Upload
  const handleHeaderImageUpload = async (file) => {
    if (!file) return;
    try {
      const url = await uploadToFirebase(file, true);
      setHeaderImage(url);
      setFormData((prevData) => ({ ...prevData, headerImage: url }));
    } catch (error) {
      console.error("Error uploading header image: ", error);
    }
  };

  // 🔥 Handle Image/Video Upload in Quill Editor
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*, video/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      try {
        const url = await uploadToFirebase(file);

        // Insert Image/Video into Editor
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        quill.insertEmbed(range.index, file.type.startsWith('image') ? 'image' : 'video', url);

        // Store in formData
        setFormData((prevData) => ({
          ...prevData,
          media: [...prevData.media, { url, type: file.type.startsWith('image') ? 'image' : 'video' }],
        }));
      } catch (error) {
        console.error("Error uploading file: ", error);
      }
    };
  };
  const uploadToFirebase = async (file, isHeader = false) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = `${Date.now()}-${file.name}`; // Unique filename
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (isHeader) {
            setHeaderUploadProgress(progress.toFixed(0));
          }
        },
        (error) => {
          if (isHeader) {
            setHeaderUploadError('Header image upload failed');
            setHeaderUploadProgress(null);
          }
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };
  

  // 🔥 Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalData = {
      ...formData,
      content, // 🔥 Ensure content is included from state
    };

    try {
      const res = await fetch('/api/post/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });
      if (!res.ok) throw new Error("Failed to publish");
      navigate(`/post/${(await res.json()).slug}`);
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        {/* 🔥 Title Input */}
        <TextInput
          type='text'
          placeholder='Title'
          required
          id='title'
          className='flex-1'
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        {/* 🔥 Category Selection */}
        <Select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        >
          <option value=''>Select a category</option>
          <option value='javascript'>JavaScript</option>
          <option value='reactjs'>React.js</option>
          <option value='nextjs'>Next.js</option>
        </Select>

        {/* 🔥 Header Image Upload */}
        <div className='border-4 border-teal-500 border-dotted p-3'>
          <FileInput
            type='file'
            accept='image/*'
            onChange={(e) => handleHeaderImageUpload(e.target.files[0])}
          />
          {headerUploadProgress && (
            <div className='w-16 h-16 mt-2'>
              <CircularProgressbar value={headerUploadProgress} text={`${headerUploadProgress}%`} />
            </div>
          )}
          {headerImage && (
            <img src={headerImage} alt='Header' className='w-full h-40 object-cover mt-2' />
          )}
          {headerUploadError && <Alert color='failure'>{headerUploadError}</Alert>}
        </div>

        {/* 🔥 Rich Text Editor with Image Upload */}
        <ReactQuill
          key="quill-editor"
          ref={quillRef}
          theme='snow'
          placeholder='Write your content...'
          className='h-72 mb-12'
          value={content}
          onChange={setContent} // 🔥 Avoid re-rendering
          modules={quillModules}
        />

        {/* 🔥 Submit Button */}
        <Button type='submit' gradientDuoTone='purpleToPink'>
          Publish
        </Button>

        {publishError && <Alert className='mt-5' color='failure'>{publishError}</Alert>}
      </form>
    </div>
  );
}
