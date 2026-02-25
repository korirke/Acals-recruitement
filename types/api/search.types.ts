export interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'service' | 'page' | 'testimonial';
  category?: string;
  score?: number;
  highlights?: string[];
  metadata?: {
    slug?: string;
    imageUrl?: string;
    pageKey?: string;
    company?: string;
    avatar?: string;
  };
}

export interface SearchResponse {
  success: boolean;
  query: string;
  results: SearchResult[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  searchType: 'mysql' | 'fuse' | 'hybrid';
  responseTime: number;
  suggestions?: string[];
}

export interface SearchFilters {
  type: 'all' | 'services' | 'pages' | 'testimonials';
  category?: string;
  sortBy: 'relevance' | 'date' | 'title';
}