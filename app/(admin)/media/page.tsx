import { Metadata } from 'next';
import MediaLibraryPage from './MediaLibraryPage';

export const metadata: Metadata = {
  title: 'Media Library - Fortune Admin',
  description: 'Manage your media files',
};

export default function Page() {
  return <MediaLibraryPage />;
}
