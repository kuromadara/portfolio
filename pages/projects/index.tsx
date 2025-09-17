import { Fragment } from "react";
import Head from "next/head";
import ProjectItem from "../../Components/ProjectItem/ProjectItem";
import sanityClient from '../../lib/sanity';
import { GetStaticProps } from 'next';

interface Project {
  _id: string;
  title: string;
  image: string;
  description: string;
  detail: string;
  link: string;
}

interface ProjectsPageProps {
  projects: Project[];
}

export const getStaticProps: GetStaticProps<ProjectsPageProps> = async () => {
  try {
    console.log("Sanity client config:", sanityClient.config());
    
    const projects = await sanityClient.fetch(`
      *[_type == "project"] {
        _id,
        title,
        "image": image.asset->url,
        description,
        detail,
        link
      }
    `);

    console.log("Fetched projects:", projects);
    console.log("Number of projects:", projects.length);

    return {
      props: {
        projects: projects || [],
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return {
      props: {
        projects: [],
      },
      revalidate: 60,
    };
  }
};

function ProjectsPage({ projects }: ProjectsPageProps) {
  return (
    <Fragment>
      <Head>
        <title>Dayananda's Projects</title>
        <meta name="description" content="Explore Dayananda's portfolio projects" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-background-light via-primary-50 to-secondary-500/5 dark:from-background-dark dark:via-surface-dark dark:to-secondary-500/5 pt-16">
        {/* Hero Section */}
        <div className="py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20 animate-fade-in">
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium mb-4">
                  💼 My Work
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
                <span className="gradient-text">Featured Projects</span>
              </h1>
              <p className="text-xl text-muted-light dark:text-muted-dark mb-8 max-w-3xl mx-auto leading-relaxed">
                Explore the diverse range of projects I've crafted with passion and precision
              </p>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {projects.map((project, index) => (
                <div 
                  key={project._id} 
                  className="group animate-slide-up hover-glow"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="glass rounded-2xl overflow-hidden h-full">
                    {project.image && (
                      <div className="relative overflow-hidden">
                        <img 
                          src={project.image} 
                          alt={project.title}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-muted-light dark:text-muted-dark mb-4 line-clamp-3">
                        {project.description}
                      </p>
                      {project.detail && (
                        <p className="text-sm text-muted-light dark:text-muted-dark mb-4">
                          {project.detail}
                        </p>
                      )}
                      {project.link && (
                        <a 
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
                        >
                          View Project
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {projects.length === 0 && (
              <div className="text-center py-20 animate-fade-in">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl">
                  🚀
                </div>
                <h3 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4">
                  Projects Coming Soon
                </h3>
                <p className="text-muted-light dark:text-muted-dark max-w-md mx-auto">
                  I'm currently working on some exciting projects. Check back soon to see my latest work!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default ProjectsPage;

// empty comit