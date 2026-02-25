import { 
  Shield, 
  Users, 
  TrendingUp, 
  Clock, 
  Globe, 
  Zap, 
  Monitor, 
  Calculator,
  Target,
  Award,
  Search,
  Building,
  Phone,
  Mail,
  Star,
  CheckCircle,
  ArrowRight,
  Plus,
  Trash2,
  Edit3,
  Save,
  ArrowUp,
  ArrowDown,
  Eye,
  Menu,
  GripVertical,
  Quote,
  Play,
  ChevronRight,
  ChevronDown,
  Download,
  Upload,
  // Social Media Icons
  Linkedin,
  X,
  Facebook,
  Instagram,
  Youtube,
  Github,
  MessageCircle,
  Send,
  Share2,
  Link,
  ExternalLink,
  LucideIcon
} from 'lucide-react';

export interface IconOption {
  name: string;
  component: LucideIcon;
  category: string;
}

export const iconRegistry: IconOption[] = [
  // Business & Services
  { name: 'Shield', component: Shield, category: 'Business' },
  { name: 'Users', component: Users, category: 'Business' },
  { name: 'TrendingUp', component: TrendingUp, category: 'Business' },
  { name: 'Clock', component: Clock, category: 'Business' },
  { name: 'Globe', component: Globe, category: 'Business' },
  { name: 'Zap', component: Zap, category: 'Business' },
  { name: 'Monitor', component: Monitor, category: 'Business' },
  { name: 'Calculator', component: Calculator, category: 'Business' },
  { name: 'Target', component: Target, category: 'Business' },
  { name: 'Award', component: Award, category: 'Business' },
  { name: 'Search', component: Search, category: 'Business' },
  { name: 'Building', component: Building, category: 'Business' },

  // Communication
  { name: 'Phone', component: Phone, category: 'Communication' },
  { name: 'Mail', component: Mail, category: 'Communication' },
  { name: 'Star', component: Star, category: 'Communication' },
  { name: 'Quote', component: Quote, category: 'Communication' },

  // Social Media
  { name: 'Linkedin', component: Linkedin, category: 'Social' },
  { name: 'X', component: X, category: 'Social' },
  { name: 'Twitter', component: X, category: 'Social' },
  { name: 'Facebook', component: Facebook, category: 'Social' },
  { name: 'Instagram', component: Instagram, category: 'Social' },
  { name: 'Youtube', component: Youtube, category: 'Social' },
  { name: 'Github', component: Github, category: 'Social' },
  { name: 'MessageCircle', component: MessageCircle, category: 'Social' },
  { name: 'Send', component: Send, category: 'Social' },
  { name: 'Share2', component: Share2, category: 'Social' },
  { name: 'Link', component: Link, category: 'Social' },
  { name: 'ExternalLink', component: ExternalLink, category: 'Social' },

  // Interface
  { name: 'CheckCircle', component: CheckCircle, category: 'Interface' },
  { name: 'ArrowRight', component: ArrowRight, category: 'Interface' },
  { name: 'Plus', component: Plus, category: 'Interface' },
  { name: 'Trash2', component: Trash2, category: 'Interface' },
  { name: 'Edit3', component: Edit3, category: 'Interface' },
  { name: 'Save', component: Save, category: 'Interface' },
  { name: 'ArrowUp', component: ArrowUp, category: 'Interface' },
  { name: 'ArrowDown', component: ArrowDown, category: 'Interface' },
  { name: 'Eye', component: Eye, category: 'Interface' },
  { name: 'Menu', component: Menu, category: 'Interface' },
  { name: 'GripVertical', component: GripVertical, category: 'Interface' },
  { name: 'Play', component: Play, category: 'Interface' },
  { name: 'ChevronRight', component: ChevronRight, category: 'Interface' },
  { name: 'ChevronDown', component: ChevronDown, category: 'Interface' },
  { name: 'Download', component: Download, category: 'Interface' },
  { name: 'Upload', component: Upload, category: 'Interface' },
];

export const getIconComponent = (iconName: string): LucideIcon => {
  const icon = iconRegistry.find(icon => icon.name === iconName);
  return icon?.component || Shield;
};

export const getIconsByCategory = () => {
  return iconRegistry.reduce((acc, icon) => {
    if (!acc[icon.category]) {
      acc[icon.category] = [];
    }
    acc[icon.category].push(icon);
    return acc;
  }, {} as Record<string, IconOption[]>);
};