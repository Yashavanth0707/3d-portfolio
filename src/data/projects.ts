import type { Project } from '@/types/portfolio.types';

export const projects: Project[] = [
  {
    id: 'ai-dashboard',
    title: 'AI Analytics Dashboard',
    description: 'Real-time ML-powered analytics platform with predictive insights',
    longDescription:
      'A comprehensive analytics dashboard that leverages machine learning to provide predictive insights, anomaly detection, and automated reporting. Built with a focus on performance and real-time data visualization.',
    image: '/images/projects/ai-dashboard.jpg',
    tags: ['React', 'Python', 'TensorFlow', 'D3.js', 'PostgreSQL'],
    link: 'https://example.com',
    github: 'https://github.com/example',
    color: '#a855f7',
  },
  {
    id: 'ecommerce-platform',
    title: 'Modern E-Commerce',
    description: 'Next-gen shopping experience with AR product previews',
    longDescription:
      'A full-featured e-commerce platform with AR product visualization, real-time inventory management, and AI-powered product recommendations. Includes a headless CMS for easy content management.',
    image: '/images/projects/ecommerce.jpg',
    tags: ['Next.js', 'Stripe', 'Three.js', 'Prisma', 'Redis'],
    link: 'https://example.com',
    github: 'https://github.com/example',
    color: '#22d3ee',
  },
  {
    id: 'realtime-chat',
    title: 'Real-time Chat Platform',
    description: 'WebSocket-based messaging with E2E encryption',
    longDescription:
      'A secure real-time messaging application featuring end-to-end encryption, file sharing, voice messages, and video calls. Built with scalability in mind using WebSocket connections and Redis pub/sub.',
    image: '/images/projects/chat.jpg',
    tags: ['React', 'Node.js', 'Socket.io', 'WebRTC', 'MongoDB'],
    link: 'https://example.com',
    github: 'https://github.com/example',
    color: '#f472b6',
  },
  {
    id: '3d-product-viewer',
    title: '3D Product Viewer',
    description: 'Interactive 3D product showcase with customization',
    longDescription:
      'An immersive 3D product visualization tool allowing customers to interact with products, customize colors and materials, and view products from any angle. Optimized for web performance.',
    image: '/images/projects/3d-viewer.jpg',
    tags: ['Three.js', 'React', 'GLTF', 'WebGL', 'Blender'],
    link: 'https://example.com',
    github: 'https://github.com/example',
    color: '#fbbf24',
  },
  {
    id: 'task-management',
    title: 'Collaborative Task Manager',
    description: 'Team project management with real-time updates',
    longDescription:
      'A collaborative project management tool with real-time updates, Kanban boards, Gantt charts, time tracking, and team communication features. Integrates with popular tools like Slack and GitHub.',
    image: '/images/projects/tasks.jpg',
    tags: ['Vue.js', 'GraphQL', 'Node.js', 'PostgreSQL', 'Docker'],
    link: 'https://example.com',
    github: 'https://github.com/example',
    color: '#34d399',
  },
];
