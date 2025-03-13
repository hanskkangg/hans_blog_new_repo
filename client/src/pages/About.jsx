import { FaFacebook, FaInstagram, FaGithub } from 'react-icons/fa';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';

export default function AboutAndContact() {
  const { theme } = useSelector((state) => state.theme); // Get the theme from Redux or global state
  const isDarkMode = theme === 'dark';

  const teamMembers = [
    {
      name: 'Min Kang',
      role: 'Content Writer',
      bio: `Min Kang is the creative voice behind much of the storytelling on Hans' Blog. With a natural talent for weaving words into captivating narratives, Min brings fresh insights and a thoughtful perspective to every article.
    
    Min currently resides in Ottawa, where she continues to create stories that inform, inspire, and engage. Connect with her at min.kang@webdev.com or follow her journey on Instagram and LinkedIn.`,
      image: './pr.png',
    },
    {
      name: 'Hans Kang',
      role: 'Web Developer',
      bio: `Hans Kang started Hans' Blog in 2025 as a passion project, blending his love for technology, sports, and storytelling. What began as a humble weekend endeavor has since evolved into a dynamic platform where web development meets engaging narratives.Hans lives in Ottawa with his laptop and an ever-growing collection of tech gadgets. Connect with him at hans.kang@webdev.com or follow his journey on GitHub and Instagram.`,
      image: './pf1.png',
    },
  ];

  const [result, setResult] = useState('');
  const [showModal, setShowModal] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult('Sending....');
    const formData = new FormData(event.target);

    formData.append('access_key', '48a7f388-7dca-4583-a57e-b2192b479294');

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      setShowModal(true);
      setResult('');
      event.target.reset();
  } else {
      console.log('Error', data);
      alert('Error: ' + data.message);
      setResult(data.message);
    }
  };

  return (
    <div
    className={`w-full min-h-screen overflow-y-auto overflow-x-hidden transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-white text-black'
    }`}
  >
      {/* About Hans' Blog - Full Page */}
<div className="w-full min-h-screen flex flex-col md:flex-row">
       {/* Left Side - About Content */}
       <div className="w-full md:w-1/2 flex items-center justify-center bg-white dark:bg-gray-800 text-black dark:text-gray-200 p-10">
       <div className="max-w-lg text-center md:text-left">
            <h1 className="text-5xl font-bold mb-8">Kangaroo On Ice</h1>

            <div className="text-lg flex flex-col gap-6">
              <p>
                Founded in 2025, Kangaroo On Ice is a vibrant online destination for sports and gaming enthusiasts. We dive deep into the worlds of hockey, soccer, and online gaming, offering fresh insights, game analyses, player spotlights, and engaging content that keeps fans and gamers coming back for more.
              </p>
              <p>
                With a growing community of passionate readers, Kangaroo On Ice is more than just a site—it's a hub where sports and gaming lovers connect, share their thoughts, and celebrate what they love most. Our mantra is simple: “Come for the stories, stay for the community.”
              </p>
            </div>
          </div>
        </div>

  {/* Right Side - Spinning Hockey Puck Video (Hidden on Small Screens) */}
  <div className="hidden md:block w-1/2 relative">
          <video
            className="w-full h-full object-cover object-center"
            autoPlay
            loop
            muted
          >
            <source src="/ab1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>
      </div>


     {/* Meet the Team - Full Page with Dark Mode Support */}
<div 
  className={`w-full min-h-screen flex flex-col items-center pt-20 pb-20 transition-colors duration-300 ${
    isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-[rgb(249,245,245)] text-black'
  }`}
>
  <h2 className="text-3xl mb-16">Meet the Team</h2>

  <div className="flex flex-wrap justify-center gap-16 px-20">
    {teamMembers.map((member, index) => (
      <div
        key={index}
        className={`p-8 w-full max-w-xs md:max-w-lg flex flex-col items-center transition-transform transform hover:-translate-y-2 mx-auto ${
          isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-black'
        } rounded-lg shadow-md`}
      >
        <img
          src={member.image}
          alt={member.name}
          className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover mb-6"
        />
        <h3 className="text-2xl mb-4">{member.name}</h3>
        <p className="text-sm text-blue-600 font-medium mb-6">{member.role}</p>
        <p className={`mt-2 text-lg text-center ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {member.bio}
        </p>
      </div>
    ))}
  </div>
</div>



{/* Contact Us Section */}

<div className={`w-full min-h-screen flex flex-col items-center p-10 pt-20 ${isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-white text-black'}`}>

  <div className="max-w-3xl text-center text-lg space-y-12">
    <section className="py-10">
      <h2 className="text-3xl font-semibold mb-6">We'd Love to Hear From You!</h2>
      <p>
        We love getting emails from readers. Please feel free to write to Min Kang at{' '}
        <a href="mailto:hans.kkang@gmail.com" className="text-indigo-600 underline">
          hans.kkang@gmail.com
        </a>.
        If you have a question, you can also contact us below
        
        — the answer may be waiting there for you.
      </p>
    </section>

    <section className="py-10">
      <h2 className="text-3xl font-semibold mb-6">Advertising & Partnerships</h2>
      <p>
        We love working with brands and businesses and are happy to create partnerships of all shapes and sizes.
        Please email{' '}
        <a href="mailto:hans.kkang@gmail.com" className="text-indigo-600 underline">
          hans.kkang@gmail.com
        </a>{' '}
        for our media kit.
      </p>
    </section>
  </div>


     {/* Contact Us Section */}
      <div className="w-full min-h-screen flex flex-col items-center justify-start bg-white dark:bg-gray-900 text-black dark:text-gray-200 p-10 pt-20">
        <h1 className="text-5xl font-bold mb-16 text-center flex justify-center items-center w-full">
        Contact Us
    </h1>
    <form
  onSubmit={onSubmit}
  className="w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto space-y-6"
>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
    <input
      type="text"
      placeholder="Enter your name"
      required
      className="p-5 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 w-full"
      name="name"
    />
    <input
      type="email"
      placeholder="Enter your email"
      required
      className="p-5 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 w-full"
      name="email"
    />
  </div>

  <textarea
    rows="8"
    placeholder="Enter your message"
    required
    className="w-full p-5 outline-none border-[0.5px] border-gray-400 rounded-md bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 mb-6"
    name="message"
  ></textarea>

  <button
    type="submit"
    className="py-4 px-10 bg-black text-white rounded-full hover:bg-gray-800 transition mx-auto flex justify-center dark:bg-gray-800 dark:text-white dark:border-gray-600"
  >
    Submit now
  </button>
</form>



        {/* Social Media Icons */}
        <div className="flex gap-8 mt-16">
          <a
            href="https://www.facebook.com/hans.kkang/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-blue-600 transition-colors text-4xl"
          >
            <FaFacebook />
          </a>
          <a
            href="https://www.instagram.com/kkanghhanss/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-pink-500 transition-colors text-4xl"
          >
            <FaInstagram />
          </a>
          <a
            href="https://github.com/hanskkangg"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-black transition-colors text-4xl"
          >
            <FaGithub />
    </a>
  </div>
</div>


</div>
    {/* Modal for Success Message */}
    {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-8 w-96 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">Message Sent!</h2>
            <p className="text-gray-700 mb-6">Thank you for reaching out. We'll get back to you soon!</p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
