import '../styles/globals.css'

import Link from "next/link";

const Navigation = () => {
    return (
        <nav className="bg-body border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900">
            <div className="container flex flex-wrap justify-between items-center mx-auto">
            &#128512;
            <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                <ul className="flex flex-col p-4 mt-4 bg-gray-50 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                    <li >
                        <Link href="/">
                            <a>&#127968;</a>
                        </Link>
                    </li>
                    <li>
                        <Link href="/about-us">
                            <a>&#129412;</a>
                        </Link>
                    </li>
                    <li>
                        <Link href="/contact-us">
                            <a>&#128222;</a>
                        </Link>
                    </li>
                </ul>
            </div>
            </div>
            
        </nav>
    );
}

export default Navigation;