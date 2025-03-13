  import { Alert, Button, Modal, ModalBody, TextInput } from 'flowbite-react';
  import { useEffect, useRef, useState } from 'react';
  import { useSelector } from 'react-redux';
  import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
  } from 'firebase/storage';
  import { app } from '../firebase';
  import { CircularProgressbar } from 'react-circular-progressbar';
  import 'react-circular-progressbar/dist/styles.css';
  import {
    updateStart,
    updateSuccess,
    updateFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signoutSuccess,
    resetError

  } from '../redux/user/userSlice';
  import { useDispatch } from 'react-redux';
  import { HiOutlineExclamationCircle } from 'react-icons/hi';
  import { Link } from 'react-router-dom';

  export default function DashProfile() {

    const { currentUser, error, loading } = useSelector((state) => state.user);
    const { theme } = useSelector((state) => state.theme);
    const isDarkMode = theme === 'dark';
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({});
    const filePickerRef = useRef();
    const dispatch = useDispatch();
    // Initialize formData with current username when the component loads or when currentUser changes
useEffect(() => {
  if (currentUser) {
      setFormData((prevData) => ({
          ...prevData,
          username: prevData.username ?? currentUser.username,
      }));
  }
}, [currentUser]);

    useEffect(() => {
      if (!currentUser || !currentUser._id) {
        console.warn(" No user ID found, skipping fetch.");
        return;
      }
    
      fetch(`/api/user/get/${currentUser._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`, // Include the token
        },
        credentials: "include", // Ensure cookies are sent if needed
      })
        .then(async (res) => {
          if (!res.ok) {
            const errorText = await res.text(); // Read response as text
            throw new Error(`API Error ${res.status}: ${errorText}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log("User Data Fetched:", data);
        })
        .catch((error) => {
          console.error("Fetch Error:", error.message);
        });
    }, [currentUser]);
    

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setImageFile(file);
        setImageFileUrl(URL.createObjectURL(file));
      }
    };
    useEffect(() => {
      if (imageFile) {
        uploadImage();
      }
    }, [imageFile]);

    useEffect(() => {
      dispatch(resetError()); // Clear errors when visiting profile page
    }, [dispatch]);
    const uploadImage = async () => {
      setImageFileUploading(true);
      setImageFileUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + imageFile.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      
      uploadTask.on(
          'state_changed',
          (snapshot) => {
              const progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setImageFileUploadProgress(progress.toFixed(0));
          },
          (error) => {
              setImageFileUploadError(
                  'Could not upload image'
              );
              setImageFileUploadProgress(null);
              setImageFile(null);
              setImageFileUrl(null);
              setImageFileUploading(false);
          },
          () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  setImageFileUrl(downloadURL);
                  // Always retain username and other formData fields
                  setFormData((prevData) => ({
                      ...prevData,
                      profilePicture: downloadURL,
                      username: prevData.username || currentUser.username,
                  }));
                  setImageFileUploading(false);
              });
          }
      );
  };
  

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    };
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      if (Object.keys(formData).length === 0) {
        setUpdateUserError("No changes detected. Please modify your profile information before submitting.");
        return;
      }


      if (!formData.username) {
        setUpdateUserError("Username is required. Please enter a valid username.");
        return;
      }


    
      if (imageFileUploading) {
        setUpdateUserError("Image upload in progress. Please wait until the upload is complete before submitting.");
        return;
      }
    
      try {
        dispatch(updateStart());
    
        const updatedData = { ...formData };
        
        if (!updatedData.password) {
          delete updatedData.password; // Remove empty password
        }
    
        const res = await fetch(`/api/user/update/${currentUser._id}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}` 
          },
          credentials: "include",
          body: JSON.stringify({
            ...updatedData,
            profilePicture: imageFileUrl || currentUser.profilePicture,
          }),
        });
    
        const data = await res.json();
    
    
        if (!res.ok) {
          if (data.message && data.message.includes('E11000 duplicate key error')) {
            setUpdateUserError("The username is already in use. Please choose a different username.");
          } else {
            throw new Error(data.message || "An error occurred while updating the profile. Please try again.");
          }
          return;
        }
    
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User profile has been updated successfully.");
        setUpdateUserError(null);
      } catch (error) {
        console.error("Fetch Error:", error);
        dispatch(updateFailure(error.message));
      }
    };
    

    
    
    
    const handleDeleteUser = async () => {
      setShowModal(false);
      try {
        dispatch(deleteUserStart());
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (!res.ok) {
          dispatch(deleteUserFailure(data.message));
        } else {
          dispatch(deleteUserSuccess(data));
        }
      } catch (error) {
        dispatch(deleteUserFailure(error.message));
      }
    };

    
    const handleSignout = async () => {
      try {
        const res = await fetch('/api/user/signout', {
          method: 'POST',
        });
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
        } else {
          dispatch(signoutSuccess());
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    return (
      <div
        className={`flex h-screen transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-white text-black'
        }`}
      >
        <div className="hidden md:block w-4/6 h-full relative">
        <video className="w-full h-full object-cover object-center" autoPlay loop muted>
          <source src="/pf1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      
      <div className="w-full md:w-4/6 p-10 flex flex-col justify-center">
        <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input
            type='file'
            accept='image/*'
            onChange={handleImageChange}
            ref={filePickerRef}
            hidden
          />
          <div
            className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
            onClick={() => filePickerRef.current.click()}
          >
            {imageFileUploadProgress && (
              <CircularProgressbar
                value={imageFileUploadProgress || 0}
                text={`${imageFileUploadProgress}%`}
                strokeWidth={3}
                styles={{
                  root: {
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  },
                  path: {
                    stroke: `rgba(34, 197, 94, ${imageFileUploadProgress / 100})`, 
                    strokeLinecap: 'round',
                    transition: 'stroke-dashoffset 0.5s ease 0s',
                },
                text: {
                    fill: '#22c55e', 
                    fontSize: '12px',
                    fontWeight: 'bold',
                },
                trail: {
                    stroke: '#d1fae5', 
                },
                }}
              />
            )}
    <img
    src={
      imageFileUrl || // Show new uploaded image
      currentUser?.profilePicture?.trim() || // Show stored profile picture
      'https://cdn-icons-png.flaticon.com/512/3607/3607444.png' // Default avatar
    }
    alt="user"
    className={`rounded-full w-full h-full object-cover  ${
      imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'
    }`}
  />


          </div>
          {imageFileUploadError && (
            <Alert color='failure'>{imageFileUploadError}</Alert>
          )}


<TextInput
    type='text'
    id='username'
    placeholder='Username'
    value={formData.username ?? ''} // Allow true empty state
    onChange={handleChange}
/>

          <TextInput
        
            type='email'
            id='email'
            placeholder='email'
            defaultValue={currentUser.email}
            onChange={handleChange}
            disabled
          />
          <TextInput
      
            type='password'
            id='password'
            placeholder='password'
            onChange={handleChange}
          />

  <Button type='submit' className='bg-black text-white hover:bg-gray-800 border-none' disabled={loading || imageFileUploading}>
              {loading ? 'Loading...' : 'Update'}
            </Button>

            
            {currentUser.isAdmin && (
              <Link to={'/create-post'}>
                <Button type='button' className='bg-black text-white hover:bg-gray-800 border-none w-full'>
                  Create a post
                </Button>
              </Link>
            )}
          </form>




        <div className='text-red-500 flex justify-between mt-5'>
          <span onClick={() => setShowModal(true)} className='cursor-pointer'>
            Delete Account
          </span>
          <span onClick={handleSignout} className='cursor-pointer'>
            Sign Out
          </span>
        </div>
        {updateUserSuccess && (
          <Alert color='success' className='mt-5'>
            {updateUserSuccess}
          </Alert>
        )}
        {updateUserError && (
          <Alert color='failure' className='mt-5'>
            {updateUserError}
          </Alert>
        )}
        {error && (
          <Alert color='failure' className='mt-5'>
            {error}
          </Alert>
        )}
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          popup
          size='md'
        >
          <Modal.Header />
          <Modal.Body>
            <div className='text-center'>
              <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
              <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                Are you sure you want to delete your account? This action cannot be undone.
              </h3>
              <div className='flex justify-center gap-4'>
                <Button color='failure' onClick={handleDeleteUser}>
                Yes, Delete Account
                </Button>
                <Button color='gray' onClick={() => setShowModal(false)}>
                No, Keep Account
                </Button>
              </div>

              
            </div>

            
          </Modal.Body>
        </Modal>
      </div>

      <div className="w-1/6 h-full relative hidden md:block ">
        <video className="hidden md:block w-full h-full object-cover object-right" autoPlay loop muted>
          <source src="/pf1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    
      </div>
    );
  }
