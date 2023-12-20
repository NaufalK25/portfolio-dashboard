export const programmingLanguage = ['JavaScript', 'TypeScript', 'PHP'];
export const frontEnd = ['HTML5', 'CSS3', 'Bootstrap', 'Tailwind CSS', 'React'];
export const backEnd = [
  'Node.js',
  'Express',
  'NestJS',
  'CodeIgniter',
  'Laravel'
];
export const database = ['MySQL', 'PostgreSQL', 'MongoDB'];
export const other = ['Git', 'Postman', 'GraphQL', 'Vite', 'Webpack'];

export const allowedStacks = [
  ...programmingLanguage,
  ...frontEnd,
  ...backEnd,
  ...database,
  ...other
] as const;
