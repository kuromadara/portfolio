import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">&copy; 2023 Dayananda Dowarah. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <Link href="/">
              <a className="text-sm hover:text-gray-300">Home</a>
            </Link>
            <Link href="/about-us">
              <a className="text-sm hover:text-gray-300">About</a>
            </Link>
            <Link href="/projects">
              <a className="text-sm hover:text-gray-300">Projects</a>
            </Link>
            <Link href="/contact-us">
              <a className="text-sm hover:text-gray-300">Contact</a>
            </Link>
          </div>
          <div className="mt-4 md:mt-0">
            <a href="https://github.com/kuromadara" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-gray-300">
              GitHub
            </a>
            <a href="https://linkedin.com/in/dayd" target="_blank" rel="noopener noreferrer" className="ml-4 text-sm hover:text-gray-300">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
