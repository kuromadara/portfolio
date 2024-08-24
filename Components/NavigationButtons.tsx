import Link from "next/link";

const NavigationButtons = () => {
  return (
    <div className="bg-gray-800 py-8">
      <div className="container mx-auto px-4 flex justify-center">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-4">
          <Link href="/">
            <button
              className="
                bg-gray-700 
                hover:bg-gray-600 
                text-white 
                font-bold 
                py-3 
                px-6 
                rounded-lg 
                shadow-md 
                transition-colors 
                duration-300 
                ease-in-out
              "
            >
              Home
            </button>
          </Link>
          <Link href="/about-us">
            <button
              className="
                bg-gray-700 
                hover:bg-gray-600 
                text-white 
                font-bold 
                py-3 
                px-6 
                rounded-lg 
                shadow-md 
                transition-colors 
                duration-300 
                ease-in-out
              "
            >
              About Me
            </button>
          </Link>
          <Link href="/projects">
            <button
              className="
                bg-gray-700 
                hover:bg-gray-600 
                text-white 
                font-bold 
                py-3 
                px-6 
                rounded-lg 
                shadow-md 
                transition-colors 
                duration-300 
                ease-in-out
              "
            >
              Projects
            </button>
          </Link>
          <Link href="/contact-us">
            <button
              className="
                bg-gray-700 
                hover:bg-gray-600 
                text-white 
                font-bold 
                py-3 
                px-6 
                rounded-lg 
                shadow-md 
                transition-colors 
                duration-300 
                ease-in-out
              "
            >
              Contact Me
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavigationButtons;
