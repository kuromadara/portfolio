import Link from "next/link";
import { useState } from 'react';

const Navigation = () => {
    const [navbar, setNavbar] = useState(false);

    return (
        <nav className="bg-gray-800 text-white py-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    <Link href="/">
                        <a className="text-2xl font-bold">
                            &#128512; My Portfolio
                        </a>
                    </Link>
                </div>
                <div className="md:flex md:items-center">
                    <button
                        className="md:hidden block p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                        onClick={() => setNavbar(!navbar)}
                    >
                        {navbar ? (
                            <svg
                                className="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        )}
                    </button>
                    <div
                        className={`md:flex md:items-center ${navbar ? 'block' : 'hidden'}`}
                    >
                        <ul className="md:flex md:space-x-4">
                            <li>
                                <Link href="/">
                                    <a className="hover:text-gray-400">Home</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/about-us">
                                    <a className="hover:text-gray-400">About Me</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/projects">
                                    <a className="hover:text-gray-400">Projects</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact-us">
                                    <a className="hover:text-gray-400">Contacts</a>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navigation;
