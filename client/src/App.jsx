import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import SignUp from './pages/SignUp';
import Header from './components/Header';
import Footer from './components/Footer';
import CreatePost from './pages/CreatePost';
import PrivateRoute from './components/PrivateRoute';
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute';
import UpdatePost from './pages/UpdatePost';
import PostPage from './pages/PostPage';
import ScrollToTop from './components/ScrollToTop';
import Search from './pages/Search';
import CoverPage from './pages/CoverPage';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Show Cover Page at "/" */}
        <Route path="/" element={<CoverPage />} />
        
        {/* Main Pages */}
        <Route path="/home" element={<><Header /><Home /><Footer /></>} />
        <Route path="/about" element={<><Header /><About /><Footer /></>} />
        <Route path="/sign-in" element={<><Header /><SignIn /><Footer /></>} />
        <Route path="/sign-up" element={<><Header /><SignUp /><Footer /></>} />
        <Route path="/search" element={<><Header /><Search /><Footer /></>} />
        
        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<><Header /><Dashboard /><Footer /></>} />
        </Route>
        
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/create-post" element={<><Header /><CreatePost /><Footer /></>} />
          <Route path="/update-post/:postId" element={<><Header /><UpdatePost /><Footer /></>} />
        </Route>
        
        <Route path="/projects" element={<><Header /><Projects /><Footer /></>} />
        <Route path="/post/:postSlug" element={<><Header /><PostPage /><Footer /></>} />
      </Routes>
    </BrowserRouter>
  );
}
