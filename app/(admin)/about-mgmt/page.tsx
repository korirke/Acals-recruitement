import { Metadata } from 'next';
import { AboutPageEditor } from './AboutPageEditor';

export const metadata: Metadata = {
  title: 'About Page Editor - Fortune Admin',
  description: 'Manage About page content',
};

export default function AdminAboutPage() {
  return <AboutPageEditor />;
}
