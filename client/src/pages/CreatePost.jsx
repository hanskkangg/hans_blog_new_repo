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
  const [file, setFile] = useState(null);
  const [headerImage, setHeaderImage] = useState(""); // ✅ For previewing image
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
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

  const handleHeaderImageUpload = async () => {
    if (!file) {
      setImageUploadError('Please select an image');
      return;
    }
    
  setImageUploadError(null);
  const storage = getStorage(app);
  const fileName = `${Date.now()}-${file.name}`;
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
    async () => {
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      setImageUploadProgress(null);
      setImageUploadError(null);
      
      // ✅ Ensure header image state and formData are updated
      setHeaderImage(downloadURL);
      setFormData((prevData) => ({
        ...prevData,
        headerImage: downloadURL, // ✅ Save in form data
      }));

      console.log("✅ Header Image Uploaded & Updated:", downloadURL);
    }
  );
};
  

  // 🔥 Handle Image Upload in Quill Editor
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
        setFormData((prevData) => ({ ...prevData, content: quill.root.innerHTML }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const finalData = {
      ...formData,
      headerImage: headerImage || formData.headerImage, // ✅ Ensure updated image is used
      content,
    };
  
    console.log("📨 Sending payload:", finalData);
  
    try {
      const res = await fetch('/api/post/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });
  
      const responseData = await res.json();
      console.log("✅ Server Response:", responseData);
  
      if (!res.ok) throw new Error(responseData.error || "Failed to publish");
  
      navigate(`/post/${responseData.slug}`);
    } catch (error) {
      console.error("🔥 Publish Error:", error.message);
      setPublishError(error.message);
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
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button type='button' onClick={handleHeaderImageUpload} disabled={imageUploadProgress}>Upload Image</Button>

          {imageUploadProgress && (
            <div className='w-16 h-16 mt-2'>
              <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress}%`} />
            </div>
          )}

{headerImage && (
  <img 
    src={headerImage} 
    alt="Header" 
    className="w-full h-40 object-cover mt-2" 
    onLoad={() => console.log("✅ Header Image Loaded:", headerImage)}
  />
)}


          {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
        </div>

        {/* 🔥 Rich Text Editor with Image Upload */}
        <ReactQuill
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
