import { useState } from 'react';
import Link from 'next/link';
import DarkModeToggle from './DarkModeToggle';

const Navigation = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<nav className="fixed top-0 left-0 right-0 z-50 glass-panel">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex">
						<Link href="/">
							<a className="flex-shrink-0 flex items-center group">
								<span className="text-2xl font-heading font-bold gradient-text group-hover:scale-105 transition-transform">
									Portfolio
								</span>
							</a>
						</Link>
					</div>
					<div className="hidden sm:ml-6 sm:flex sm:space-x-1 items-center">
						<ScrollLink href="#home">Home</ScrollLink>
						<ScrollLink href="#experience">Experience</ScrollLink>
						<ScrollLink href="#education">Education</ScrollLink>
						<ScrollLink href="#skills">Skills</ScrollLink>
						<ScrollLink href="#achievements">Work</ScrollLink>
						<ScrollLink href="#projects">Projects</ScrollLink>
						<ScrollLink href="#contact">Contact</ScrollLink>
						<div className="ml-4">
							<DarkModeToggle />
						</div>
					</div>
					<div className="-mr-2 flex items-center sm:hidden">
						<button
							onClick={() => setIsOpen(!isOpen)}
							className="inline-flex items-center justify-center p-2 rounded-xl text-foreground-muted hover:text-primary transition-all duration-200"
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
				<div className="sm:hidden glass-panel border-t border-glass-border">
					<div className="pt-2 pb-3 space-y-1 px-4">
						<MobileScrollLink href="#home">Home</MobileScrollLink>
						<MobileScrollLink href="#experience">Experience</MobileScrollLink>
						<MobileScrollLink href="#education">Education</MobileScrollLink>
						<MobileScrollLink href="#skills">Skills</MobileScrollLink>
						<MobileScrollLink href="#achievements">Work</MobileScrollLink>
						<MobileScrollLink href="#projects">Projects</MobileScrollLink>
						<MobileScrollLink href="#contact">Contact</MobileScrollLink>
					</div>
				</div>
			)}
		</nav>
	);
};

const ScrollLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
	<a 
		href={href}
		className="relative px-4 py-2 text-foreground-muted hover:text-primary font-medium transition-all duration-200 rounded-lg hover:bg-glass group cursor-pointer"
		onClick={(e) => {
			e.preventDefault();
			document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
		}}
	>
		{children}
		<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
	</a>
);

const MobileScrollLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
	<a 
		href={href}
		className="block px-4 py-3 text-foreground-muted hover:text-primary hover:bg-glass font-medium transition-all duration-200 rounded-lg cursor-pointer"
		onClick={(e) => {
			e.preventDefault();
			document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
		}}
	>
		{children}
	</a>
);

export default Navigation;