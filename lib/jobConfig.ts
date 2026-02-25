export const jobConfiguration: JobConfiguration = {
  categories: [
    'Engineering',
    'Design',
    'Marketing',
    'Sales',
    'Product Management',
    'Customer Support',
    'Human Resources',
    'Finance & Accounting',
    'Operations',
    'Data Science',
    'Quality Assurance',
    'Legal',
    'Business Development',
    'Content & Writing',
    'Healthcare',
    'Education',
  ],
  
  jobTypes: [
    'Full-time',
    'Part-time',
    'Contract',
    'Internship',
    'Freelance',
    'Temporary',
  ],
  
  experienceLevels: [
    'Entry Level (0-2 years)',
    'Mid Level (2-5 years)',
    'Senior Level (5-10 years)',
    'Lead/Principal (10+ years)',
    'Executive',
  ],
  
  locations: [
    'Remote',
    'San Francisco, CA',
    'New York, NY',
    'Los Angeles, CA',
    'Chicago, IL',
    'Austin, TX',
    'Seattle, WA',
    'Boston, MA',
    'Denver, CO',
    'Miami, FL',
    'Portland, OR',
    'Atlanta, GA',
  ],
  
  salaryTypes: [
    { value: 'range', label: 'Salary Range' },
    { value: 'specific', label: 'Specific Amount' },
    { value: 'negotiable', label: 'Negotiable' },
    { value: 'not-disclosed', label: 'Not Disclosed' },
  ],
};


export interface JobConfiguration {
  categories: string[];
  jobTypes: string[];
  experienceLevels: string[];
  locations: string[];
  salaryTypes: Array<{
    value: string;
    label: string;
  }>;
}

// import { JobConfiguration } from '@/types/jobs';
