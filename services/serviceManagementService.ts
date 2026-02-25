// // src/services/serviceManagementService.ts
// /**
//  * 🛠️ Service Management Service
//  * Handles CRUD operations for services
//  */

// import { api } from '@/lib/apiClient';
// import { ENDPOINTS } from '@/lib/endpoints';
// import type { Service, ServiceUpdatePayload, ImageUploadResponse } from '@/types';

// export const serviceManagementService = {
//   /**
//    * Get all services
//    */
//   async getServices(): Promise<Service[]> {
//     try {
//       const response = await api.get<Service[]>(ENDPOINTS.PUBLIC.SERVICES);
      
//       if (response.success && Array.isArray(response.data)) {
//         return response.data.sort((a, b) => a.position - b.position);
//       }
      
//       return [];
//     } catch (error) {
//       console.error('Failed to fetch services:', error);
//       throw error;
//     }
//   },

//   /**
//    * Update multiple services
//    */
//   async updateServices(payload: ServiceUpdatePayload): Promise<boolean> {
//     try {
//       const response = await api.put(ENDPOINTS.ADMIN.SERVICES, payload);
//       return response.success;
//     } catch (error) {
//       console.error('Failed to update services:', error);
//       throw error;
//     }
//   },

//   /**
//    * Delete a service
//    */
//   async deleteService(id: string): Promise<boolean> {
//     try {
//       const response = await api.delete(`${ENDPOINTS.ADMIN.SERVICES}/${id}`);
//       return response.success;
//     } catch (error) {
//       console.error('Failed to delete service:', error);
//       throw error;
//     }
//   },

//   /**
//    * Upload service image
//    */
//   async uploadImage(file: File): Promise<string> {
//     try {
//       const formData = new FormData();
//       formData.append('file', file);

//       const response = await api.post<ImageUploadResponse>(
//         '/upload',
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       if (response.success && response.data?.url) {
//         return response.data.url;
//       }

//       throw new Error('Upload failed');
//     } catch (error) {
//       console.error('Failed to upload image:', error);
//       throw error;
//     }
//   },
// };
