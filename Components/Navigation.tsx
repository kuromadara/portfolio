import { useState } from 'react';
import Link from 'next/link';
import DarkModeToggle from './DarkModeToggle';

const Navigation = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<nav className="bg-white dark:bg-gray-800 shadow-md">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex">
						<Link href="/">
							<a className="flex-shrink-0 flex items-center">
								<span className="text-2xl font-bold text-primary">Portfolio</span>
							</a>
						</Link>
					</div>
					<div className="hidden sm:ml-6 sm:flex sm:space-x-8">
						<NavLink href="/">Home</NavLink>
						<NavLink href="/about-us">About</NavLink>
						<NavLink href="/projects">Projects</NavLink>
						<NavLink href="/contact-us">Contact</NavLink>
						<DarkModeToggle />
					</div>
					<div className="-mr-2 flex items-center sm:hidden">
						<button
							onClick={() => setIsOpen(!isOpen)}
							className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
						>
							<span className="sr-only">Open main menu</span>
							{isOpen ? (
								<svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							) : (
								<svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
								</svg>
							)}
						</button>
					</div>
				</div>
			</div>
			{isOpen && (
				<div className="sm:hidden">
					<div className="pt-2 pb-3 space-y-1">
						<MobileNavLink href="/">Home</MobileNavLink>
						<MobileNavLink href="/about-us">About</MobileNavLink>
						<MobileNavLink href="/projects">Projects</MobileNavLink>
						<MobileNavLink href="/contact-us">Contact</MobileNavLink>
					</div>
				</div>
			)}
		</nav>
	);
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
	<Link href={href}>
		<a className="border-transparent text-gray-500 hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
			{children}
		</a>
	</Link>
);

const MobileNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
	<Link href={href}>
		<a className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-primary hover:text-primary block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
			{children}
		</a>
	</Link>
);

export default Navigation;
