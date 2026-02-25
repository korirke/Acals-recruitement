/**
 * Testimonial API Types
 */

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string | null;
  results?: string[];
  service?: string | null;
  category?: string | null;
  isActive: boolean;
  isFeatured: boolean;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface TestimonialFilters {
  featured?: boolean;
  service?: string;
  category?: string;
  limit?: number;
}

//TO BE UPDATED - to match
export interface CreateTestimonialDto {
  name: string;
  role: string;
  company: string;
  content: string;
  rating?: number;
  avatar: string;
  results: string[];
  service?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  position: number;
}

export interface UpdateTestimonialDto extends Partial<CreateTestimonialDto> {
  id?: string;
}

export interface UpdateTestimonialsDto {
  testimonials: UpdateTestimonialDto[];
}

export interface TestimonialFilters {
  service?: string;
  featured?: boolean;
  active?: boolean;
}