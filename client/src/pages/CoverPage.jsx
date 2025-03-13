import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

export default function CoverPage() {
  const videoRef = useRef(null);
  const hoverVideoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [textHovered, setTextHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.innerWidth <= 768) {
      navigate('/home');
    }
  }, [navigate]);

  useEffect(() => {
    if (hoverVideoRef.current) {
      if (isHovered) {
        hoverVideoRef.current.play();
      } else {
        hoverVideoRef.current.pause();
        hoverVideoRef.current.currentTime = 0;
      }
    }
  }, [isHovered]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: 'black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Fullscreen Video with Left and Right Margins */}
      <video
        ref={hoverVideoRef}
        src="./bg7.mp4"
        muted
        style={{
          position: 'absolute',
          top: '0',
          left: '50px',
          width: 'calc(100% - 100px)',
          height: '100%',
          zIndex: 0,
          objectFit: 'fill',
          backgroundColor: 'black',
        }}
      ></video>

      {/* Centered Responsive Button */}
      <div style={{ position: 'relative', zIndex: 30 }}>
        <Link to="/home">
          <button
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: '800',
              fontSize: '4vw', 
              minFontSize: '40px',
              maxFontSize: '80px',
              color: 'white',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              paddingBottom: '60vh'
            }}
            onMouseEnter={() => {
              setTextHovered(true);
              setIsHovered(true);
            }}
            onMouseLeave={() => {
              setTextHovered(false);
              setIsHovered(false);
            }}
          >
            {textHovered ? 'CLICK.' : 'HERE,'}
          </button>
        </Link>
      </div>

      {/* Invisible but Interactive Enter Button */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20,
          transform: 'translate(-10px, 50px)',
          opacity: 0,
          pointerEvents: 'auto',
        }}
      >
        <Link to="/home">
          <button
            style={{
              padding: '20px 50px',
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              borderRadius: '16px',
              transition: 'background-color 0.3s',
              opacity: 0,
              pointerEvents: 'auto',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Enter
          </button>
        </Link>
      </div>
    </div>
  );
}
