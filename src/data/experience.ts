import type { Experience } from '@/types/portfolio.types';

export const experiences: Experience[] = [
  {
    id: 'exp-1',
    title: 'Senior Frontend Developer',
    company: 'Tech Innovations Inc.',
    location: 'San Francisco, CA',
    startDate: '2022-03',
    endDate: null,
    description: [
      'Lead development of customer-facing web applications using React and Next.js',
      'Implemented 3D product visualization features using Three.js',
      'Mentored junior developers and established coding standards',
      'Reduced bundle size by 40% through code splitting and lazy loading',
    ],
    technologies: ['React', 'Next.js', 'Three.js', 'TypeScript', 'GraphQL'],
  },
  {
    id: 'exp-2',
    title: 'Full Stack Developer',
    company: 'Digital Solutions Co.',
    location: 'New York, NY',
    startDate: '2020-06',
    endDate: '2022-02',
    description: [
      'Built and maintained multiple client projects using React and Node.js',
      'Designed and implemented RESTful APIs and GraphQL schemas',
      'Integrated third-party services and payment gateways',
      'Collaborated with design team to implement pixel-perfect UIs',
    ],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
  },
  {
    id: 'exp-3',
    title: 'Junior Web Developer',
    company: 'StartUp Labs',
    location: 'Austin, TX',
    startDate: '2018-09',
    endDate: '2020-05',
    description: [
      'Developed responsive web applications using modern JavaScript frameworks',
      'Participated in agile development processes and code reviews',
      'Created interactive data visualizations using D3.js',
      'Contributed to open-source projects and internal tools',
    ],
    technologies: ['JavaScript', 'Vue.js', 'D3.js', 'MongoDB', 'Git'],
  },
  {
    id: 'exp-4',
    title: 'Web Development Intern',
    company: 'Creative Agency',
    location: 'Remote',
    startDate: '2018-01',
    endDate: '2018-08',
    description: [
      'Assisted in building client websites using HTML, CSS, and JavaScript',
      'Learned modern development practices and version control',
      'Created responsive email templates and landing pages',
    ],
    technologies: ['HTML', 'CSS', 'JavaScript', 'WordPress', 'Sass'],
  },
];
