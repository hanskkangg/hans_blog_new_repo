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
import { useSelector } from 'react-redux';


export default function CreatePost() {
  
  const [file, setFile] = useState(null);
  const [headerImage, setHeaderImage] = useState("");
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [content, setContent] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    media: [],
    headerImage: "",
  });
  const [publishError, setPublishError] = useState(null);
  const quillRef = useRef(null);
  const navigate = useNavigate();

  // Get currentUser from Redux store
  const { currentUser } = useSelector((state) => state.user);
  console.log("Current User:", currentUser);

  // Define Quill Modules with Custom YouTube Video Handler
  const quillModules = useMemo(() => ({
    toolbar: {
      container: [
        ['bold', 'italic', 'underline'],
        [{ 'header': '1' }, { 'header': '2' }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image', 'video'], 
      ],
      handlers: {
        image: () => imageHandler(),
        video: () => videoHandler(),
      },
    },
  }), []);
//  Custom Video Handler for YouTube
const videoHandler = () => {
  const quill = quillRef.current.getEditor();
  const url = prompt("Enter a YouTube video URL:");

  if (url) {
      const videoId = extractYouTubeVideoId(url);
      if (videoId) {
          const embedUrl = `https://www.youtube.com/embed/${videoId}`;
          const range = quill.getSelection();

          // Insert video with custom styles for larger display
          quill.clipboard.dangerouslyPasteHTML(
              range.index,
              `<iframe 
                  src="${embedUrl}" 
                  frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen
                  style="width:100%; height:500px; max-width:900px; border-radius:8px; margin: 20px auto; display: block;"
              ></iframe>`
          );
      } else {
          alert("Invalid YouTube URL. Please enter a valid link.");
      }
  }
};


  // Function to Extract YouTube Video ID
  const extractYouTubeVideoId = (url) => {
    const match = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  };

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
        
        // Ensure header image state and formData are updated
        setHeaderImage(downloadURL);
        setFormData((prevData) => ({
          ...prevData,
          headerImage: downloadURL, // Save in form data
        }));

        console.log(" Header Image Uploaded & Updated:", downloadURL);
      }
    );
  };

  //  Handle Image Upload in Quill Editor
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
        console.error(" Image Upload Failed:", error);
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

    if (!currentUser || !currentUser.token) {
        setPublishError(" You must be logged in to create a post!");
        return;
    }

    const finalData = {
        title: formData.title,
        content: content || "<p>Default content</p>",
        category: formData.category || "uncategorized",
        headerImage: headerImage || "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png", 
        slug: formData.title.trim().toLowerCase().replace(/\s+/g, "-"),
    };

    console.log("📨 Sending payload:", finalData);
    console.log("🔍 Current User Token:", currentUser.token);

    try {
        const res = await fetch('/api/post/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}`,
            },
            body: JSON.stringify(finalData),
        });

        const responseData = await res.json();
        console.log("Server Response:", responseData);

        if (!res.ok) {
            console.error(" Server responded with error:", responseData.message);
            throw new Error(responseData.message || "Failed to publish");
        }

        navigate(`/post/${responseData.slug}`);
    } catch (error) {
        console.error(" Publish Error:", error.message);
        setPublishError(error.message);
    }
};


  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>

      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        {/*  Title Input */}
        <TextInput
          type='text'
          placeholder='Title'
          required
          id='title'
          className='flex-1'
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        {/* Category Selection */}
        <Select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        >
          <option value='uncategorized'>Select a category</option>
          <option value='NHL'>NHL</option>
          <option value='PWHL'>PWHL</option>
          <option value='Kang you believe it?'>Kang you believe it? </option>
          <option value='Kangs trade hops'>Kang's trade hops</option>
          <option value='Hop to the Future: Rookies'>Hop to the Future: Rookies</option>
          <option value='Kang in the crease '>Kang in the crease</option>
        </Select>
        {/* Header Image Upload */}
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
    onLoad={() => console.log("Header Image Loaded:", headerImage)}
  />
)}


          {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
        </div>

        {/* Rich Text Editor with YouTube Video Support */}
        <ReactQuill
          ref={quillRef}
          theme='snow'
          placeholder='Write your content...'
          className='h-72 mb-12'
          value={content}
          onChange={setContent}
          modules={quillModules}
        />

        {/* Submit Button */}
        <Button type='submit' gradientDuoTone='purpleToPink'>
          Publish
        </Button>

        {publishError && <Alert className='mt-5' color='failure'>{publishError}</Alert>}
      </form>
    </div>
  );
}
