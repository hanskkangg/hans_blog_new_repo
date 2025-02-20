import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsTwitter, BsGithub } from 'react-icons/bs';

export default function FooterCom() {
  return (
    <Footer container className="border-t-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-6">
      <div className="w-full max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          {/* ✅ Blog Title */}
          <Link to="/" className="flex items-center space-x-2 mb-4 md:mb-0">
            <span className="text-2xl font-bold text-black dark:text-white">
              Hans
            </span>
            <span className="text-xl font-light text-gray-600 dark:text-gray-300">
              Blog
            </span>
          </Link>

          {/* ✅ Footer Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <Footer.Title title="About" className="text-black dark:text-white" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://hanskang.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
                >
                  Hans Kang's Website
                </Footer.Link>
                <Footer.Link
                  href="/about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
                >
                  Hans Personal Blog
                </Footer.Link>
              </Footer.LinkGroup>
            </div>

            <div>
              <Footer.Title title="Follow Us" className="text-black dark:text-white" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://github.com/hanskkangg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
                >
                  Github
                </Footer.Link>
                <Footer.Link
                  href="#"
                  className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
                >
                  Discord
                </Footer.Link>
              </Footer.LinkGroup>
            </div>

            <div>
              <Footer.Title title="Legal" className="text-black dark:text-white" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="#"
                  className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
                >
                  Privacy Policy
                </Footer.Link>
                <Footer.Link
                  href="#"
                  className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
                >
                  Terms & Conditions
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>

        <Footer.Divider className="my-6 border-gray-200 dark:border-gray-700" />

        {/* ✅ Footer Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <Footer.Copyright
            href="#"
            by="Hans Blog"
            year={new Date().getFullYear()}
            className="text-gray-500 dark:text-gray-400"
          />
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition">
              <BsFacebook size={20} />
            </a>
            <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition">
              <BsInstagram size={20} />
            </a>
            <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition">
              <BsTwitter size={20} />
            </a>
            <a
              href="https://github.com/hanskkangg"
              className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
            >
              <BsGithub size={20} />
            </a>
          </div>
        </div>
      </div>
    </Footer>
  );
}
