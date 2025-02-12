import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const [headerImage, setHeaderImage] = useState(null);
  const [bodyContent, setBodyContent] = useState('');
  const [formData, setFormData] = useState({ bodyImages: [] });
  const [publishError, setPublishError] = useState(null);

  const navigate = useNavigate();
  const handleUploadImages = async (files) => {
    if (!files || files.length === 0) {
      console.error("No files selected.");
      return;
    }
  
    const storage = getStorage(app);
    let uploadedImages = [];
  
    for (let file of files) {
      if (!file) continue; // Ensure file is valid
  
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      await new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          null,
          (error) => reject(error),
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            uploadedImages.push(downloadURL);
            resolve();
          }
        );
      });
    }
  
    setFormData({ ...formData, bodyImages: [...formData.bodyImages, ...uploadedImages] });
  
    // Insert images into ReactQuill
    let newContent = bodyContent;
    uploadedImages.forEach((url) => {
      newContent += `<img src="${url}" alt="Uploaded Image" style="max-width: 100%; margin: 10px 0;" />`;
    });
  
    setBodyContent(newContent);
  };
  

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/post/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, content: bodyContent }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      navigate(`/post/${data.slug}`);
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        {/* Title & Category */}
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput
            type='text'
            placeholder='Title'
            required
            id='title'
            className='flex-1'
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <Select
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value='uncategorized'>Select a category</option>
            <option value='javascript'>JavaScript</option>
            <option value='reactjs'>React.js</option>
            <option value='nextjs'>Next.js</option>
          </Select>
        </div>

        {/* Header Image Upload */}
        <div className='flex gap-4 items-center border-4 border-teal-500 border-dotted p-3'>
          <FileInput
            type='file'
            accept='image/*'
            onChange={(e) => {
              const file = e.target.files[0];
              handleUploadImages([file]); // Upload as header image
            }}
          />
          <Button type='button' outline>
            Upload Header Image
          </Button>
        </div>
        {formData.headerImage && <img src={formData.headerImage} className='w-full h-72 object-cover' />}

        {/* Body Content Editor */}
        <ReactQuill
          theme='snow'
          placeholder='Write something...'
          className='h-72 mb-12'
          value={bodyContent}
          onChange={(value) => setBodyContent(value)}
        />

        {/* Body Image Upload */}
        <div className='flex gap-4 items-center border-4 border-teal-500 border-dotted p-3'>
          <FileInput
            type='file'
            accept='image/*'
            multiple
            onChange={(e) => handleUploadImages(e.target.files)}
          />
          <Button type='button' outline>
            Upload Images to Body
          </Button>
        </div>

        {/* Publish Button */}
        <Button type='submit' gradientDuoTone='purpleToPink'>
          Publish
        </Button>
        {publishError && <Alert color='failure'>{publishError}</Alert>}
      </form>
    </div>
  );
}
