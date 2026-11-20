/** Everything shown on the dev side lives here — edit text, not JSX. */

export const profile = {
  name: 'Dayananda Dowarah',
  role: 'Senior Full Stack Engineer',
  location: 'Guwahati, India',
  intro:
    'Senior full-stack engineer with 4+ years building scalable SaaS, government and marketplace platforms — backend architecture, REST APIs, RBAC and workflow systems, and the cloud-native infrastructure that runs them, owned end to end from development to deployment.',
  email: 'dowarah.dayananda35@gmail.com',
  github: 'https://github.com/kuromadara',
  linkedin: 'https://www.linkedin.com/in/dayadowa/',
  resume: '/static/docs/Dayananda_Dowarah_CV.pdf',
}

/** The three-up strip under the hero (the "Now" cell comes from experience[0]). */
export const facts = {
  experience: '4+ years · full stack',
  focus: 'FastAPI · Next.js · AWS',
}

export interface Job {
  role: string
  company: string
  period: string
  current?: boolean
  points: string[]
  stack: string[]
}

export const experience: Job[] = [
  {
    role: 'Senior Full Stack Engineer',
    company: 'Kose App LLC',
    period: 'Jan 2026 — Present',
    current: true,
    points: [
      'Architecting a real-estate marketplace for property listings and transactional workflows',
      'FastAPI microservices and MLS ingestion pipelines (SimplyRETS, Trestle)',
      'Multi-role RBAC for clients, agents and admins on AWS Cognito',
      'AWS Lambda ingestion pipelines with DynamoDB storage',
      'Next.js dashboards and Flutter mobile apps',
    ],
    stack: ['FastAPI', 'AWS Lambda', 'Cognito', 'DynamoDB', 'Next.js', 'Flutter'],
  },
  {
    role: 'Senior Full Stack Engineer (Contract)',
    company: 'Directorate of Land Records & Surveys, Govt. of Assam',
    period: 'Feb 2025 — Dec 2025',
    points: [
      'ILRMS workflow dashboards and scrutiny systems',
      'RBAC with multi-level approval hierarchies',
      'Flask APIs and optimised PostgreSQL datasets',
    ],
    stack: ['Flask', 'PostgreSQL', 'JavaScript'],
  },
  {
    role: 'Full Stack Engineer',
    company: 'Web.com (India) Pvt. Ltd.',
    period: 'Nov 2021 — Feb 2025',
    points: [
      'Built SaaS platforms on Laravel',
      'REST APIs and JWT-based authentication',
      'Improved application performance by ~40%',
      'Docker deployments and CI/CD pipelines',
    ],
    stack: ['Laravel', 'PHP', 'MySQL', 'Docker', 'CI/CD'],
  },
  {
    role: 'Research Intern',
    company: 'IASST, Guwahati',
    period: '2020 — 2021',
    points: [
      'Deep learning for cervical cancer detection (MobileNet v2)',
      'Django-based diagnostic application',
      'Medical image processing and analysis',
    ],
    stack: ['Python', 'Django', 'TensorFlow'],
  },
]

export const featured = [
  {
    title: 'Kose Real Estate Platform',
    blurb: 'MLS-integrated property marketplace with agent and referral workflows, on FastAPI and AWS serverless.',
    meta: 'Marketplace',
  },
  {
    title: 'ILRMS Assam',
    blurb: 'Government land-records workflow system with scrutiny dashboards and multi-level RBAC approvals.',
    meta: 'GovTech',
  },
  {
    title: 'Koan Platform',
    blurb: 'API-driven SaaS backend with a Flutter front end.',
    meta: 'SaaS',
  },
]

export const skills: { group: string; items: string[] }[] = [
  { group: 'Languages', items: ['JavaScript', 'PHP', 'Python', 'Dart', 'SQL'] },
  { group: 'Backend', items: ['FastAPI', 'Flask', 'Laravel', 'Express.js'] },
  { group: 'Frontend & mobile', items: ['React', 'Next.js', 'Tailwind CSS', 'Flutter'] },
  { group: 'Databases', items: ['PostgreSQL', 'MySQL', 'DynamoDB'] },
  { group: 'Cloud & DevOps', items: ['AWS Cognito', 'Lambda', 'EC2', 'S3', 'CodeCommit', 'Docker', 'CI/CD', 'Linux', 'Nginx'] },
  { group: 'Architecture', items: ['REST APIs', 'RBAC', 'Workflow systems', 'Distributed systems'] },
]

export const education = [
  { degree: 'MCA — Master of Computer Applications', school: 'Cotton University, Guwahati', year: '2021' },
  { degree: 'BCA — Bachelor of Computer Applications', school: 'Dibrugarh University, Assam', year: '2019' },
]
