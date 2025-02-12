import { Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill, { Quill } from 'react-quill'; // ✅ Import Quill
import 'react-quill/dist/quill.snow.css';
import { forwardRef, useRef, useState } from 'react';
import ImageUploader from 'quill-image-uploader';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';

import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


// ✅ Register the image uploader module
Quill.register('modules/imageUploader', ImageUploader);

// ✅ Toolbar Configuration
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image', 'video'],
    ['clean'],
  ],
  imageUploader: {
    upload: async (file) => {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const res = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        return data.url; // Ensure your API returns the uploaded image URL
      } catch (err) {
        console.error('Upload failed:', err);
        return 'https://via.placeholder.com/150'; // Fallback image
      }
    },
  },
};

// ✅ Wrap ReactQuill with forwardRef
const CustomQuill = forwardRef((props, ref) => (
  <ReactQuill ref={ref} {...props} />
));

export default function CreatePost() {
  
  const [file, setFile] = useState(null);

  const [imageUploadProgress, setImageUploadProgress] = useState(null);

  const [imageUploadError, setImageUploadError] = useState(null);
  
  const [formData, setFormData] = useState({});

  const quillRef = useRef(null);
  const [content, setContent] = useState(''); // ✅ Add content state


  
  const handleUpdloadImage = async () => {
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
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );

    } catch (error) {
      setImageUploadError('Image upload failed');
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>

      <form className='flex flex-col gap-4'>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput type='text' placeholder='Title' required id='title' className='flex-1' />
          <Select>
            <option value='uncategorized'>Select a category</option>
            <option value='javascript'>JavaScript</option>
            <option value='reactjs'>React.js</option>
            <option value='nextjs'>Next.js</option>
          </Select>
        </div>

        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput type='file' accept='image/*' 
            onChange={(e) => setFile(e.target.files[0])} />
          <Button type='button' gradientDuoTone='purpleToBlue' size='sm' outline 
            onClick={handleUpdloadImage}
            disabled={imageUploadProgress}>
           
           {imageUploadProgress ? (
              <div className='w-16 h-16'>
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              'Upload Image'
            )}         
              
              </Button>
        </div>

        {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt='upload'
            className='w-full h-72 object-cover'
          />
        )}
        
        <CustomQuill
          ref={quillRef}
          theme='snow'
          modules={modules}
          placeholder='Write something...'
          className='h-72 mb-12'
          value={content} // ✅ Controlled value
          onChange={setContent} // ✅ Update content on change
          required
        />

        <Button type='submit' gradientDuoTone='purpleToPink'>
          Publish
        </Button>
      </form>
    </div>
  );
}
