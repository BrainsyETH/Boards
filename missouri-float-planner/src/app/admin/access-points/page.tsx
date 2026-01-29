'use client';

// src/app/admin/access-points/page.tsx
// Admin page for managing access point images

import { useState } from 'react';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
  MapPin,
  Image as ImageIcon,
  Check,
  X,
  ChevronDown,
  Search,
  ExternalLink
} from 'lucide-react';

interface River {
  id: string;
  name: string;
  slug: string;
}

interface AccessPointAdmin {
  id: string;
  name: string;
  riverMile: number;
  type: string;
  imageUrl: string | null;
  riverId: string;
}

interface ImageItem {
  id: string;
  name: string;
  url: string;
  category: string;
  isSystem: boolean;
}

const EDDY_PLACEHOLDER = 'https://q5skne5bn5nbyxfw.public.blob.vercel-storage.com/Eddy_Otter/Eddy%20the%20otter%20with%20a%20flag.png';

export default function AdminAccessPointsPage() {
  const queryClient = useQueryClient();
  const [selectedRiver, setSelectedRiver] = useState<string | null>(null);
  const [editingPoint, setEditingPoint] = useState<string | null>(null);
  const [imagePickerOpen, setImagePickerOpen] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch rivers
  const { data: rivers, isLoading: riversLoading } = useQuery<River[]>({
    queryKey: ['admin-rivers'],
    queryFn: async () => {
      const response = await fetch('/api/rivers');
      if (!response.ok) throw new Error('Failed to fetch rivers');
      const data = await response.json();
      return data.rivers || [];
    },
  });

  // Fetch access points for selected river
  const { data: accessPoints, isLoading: accessPointsLoading } = useQuery<AccessPointAdmin[]>({
    queryKey: ['admin-access-points', selectedRiver],
    queryFn: async () => {
      if (!selectedRiver) return [];
      const river = rivers?.find(r => r.id === selectedRiver);
      if (!river) return [];

      const response = await fetch(`/api/rivers/${river.slug}/access-points`);
      if (!response.ok) throw new Error('Failed to fetch access points');
      const data = await response.json();
      return data.accessPoints || [];
    },
    enabled: !!selectedRiver && !!rivers,
  });

  // Fetch images for picker
  const { data: imagesData } = useQuery<{ images: ImageItem[] }>({
    queryKey: ['admin-images'],
    queryFn: async () => {
      const response = await fetch('/api/admin/images');
      if (!response.ok) throw new Error('Failed to fetch images');
      return response.json();
    },
  });

  // Update access point image
  const updateImageMutation = useMutation({
    mutationFn: async ({ id, imageUrl }: { id: string; imageUrl: string | null }) => {
      const response = await fetch(`/api/admin/access-points/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: imageUrl || '' }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-access-points', selectedRiver] });
      setImagePickerOpen(null);
    },
  });

  const filteredAccessPoints = accessPoints?.filter(ap =>
    ap.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const images = imagesData?.images || [];

  return (
    <AdminLayout
      title="Access Points"
      description="Manage images for access points"
    >
      <div className="p-6">
        {/* River Selector */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-4 mb-6">
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Select River
          </label>
          {riversLoading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <div className="relative">
              <select
                value={selectedRiver || ''}
                onChange={(e) => {
                  setSelectedRiver(e.target.value || null);
                  setSearchTerm('');
                }}
                className="w-full md:w-80 px-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Choose a river...</option>
                {rivers?.map(river => (
                  <option key={river.id} value={river.id}>{river.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
            </div>
          )}
        </div>

        {/* Access Points List */}
        {selectedRiver && (
          <>
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search access points..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-80 pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {accessPointsLoading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : filteredAccessPoints.length === 0 ? (
              <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-12 text-center">
                <MapPin className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                <p className="text-neutral-400">
                  {searchTerm ? 'No access points match your search.' : 'No access points found for this river.'}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredAccessPoints.map((point) => (
                  <div
                    key={point.id}
                    className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden"
                  >
                    {/* Image Preview */}
                    <div className="aspect-video relative bg-neutral-700">
                      {point.imageUrl ? (
                        <Image
                          src={point.imageUrl}
                          alt={point.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500">
                          <Image
                            src={EDDY_PLACEHOLDER}
                            alt="No image"
                            width={80}
                            height={80}
                            className="opacity-30 mb-2"
                          />
                          <span className="text-xs">No image</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-white truncate">{point.name}</h3>
                      <p className="text-sm text-neutral-400">
                        Mile {point.riverMile.toFixed(1)} • {point.type.replace('_', ' ')}
                      </p>

                      {/* Actions */}
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => setImagePickerOpen(point.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded-lg transition-colors"
                        >
                          <ImageIcon className="w-4 h-4" />
                          {point.imageUrl ? 'Change' : 'Add'} Image
                        </button>
                        {point.imageUrl && (
                          <button
                            onClick={() => updateImageMutation.mutate({ id: point.id, imageUrl: null })}
                            className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm rounded-lg transition-colors"
                            title="Remove image"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {!selectedRiver && (
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-12 text-center">
            <MapPin className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400">Select a river to manage access point images.</p>
          </div>
        )}

        {/* Image Picker Modal */}
        {imagePickerOpen && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setImagePickerOpen(null)}
          >
            <div
              className="bg-neutral-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-neutral-700">
                <div>
                  <h3 className="font-semibold text-white">Select Image</h3>
                  <p className="text-sm text-neutral-400">
                    Choose an image from your library or enter a URL
                  </p>
                </div>
                <button
                  onClick={() => setImagePickerOpen(null)}
                  className="p-2 hover:bg-neutral-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-neutral-300" />
                </button>
              </div>

              {/* Custom URL Input */}
              <div className="p-4 border-b border-neutral-700">
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Or enter image URL directly:
                </label>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const url = formData.get('customUrl') as string;
                    if (url && imagePickerOpen) {
                      updateImageMutation.mutate({ id: imagePickerOpen, imageUrl: url });
                    }
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="url"
                    name="customUrl"
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-4 py-2 bg-neutral-900 border border-neutral-600 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="submit"
                    disabled={updateImageMutation.isPending}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    {updateImageMutation.isPending ? 'Saving...' : 'Use URL'}
                  </button>
                </form>
              </div>

              {/* Image Grid */}
              <div className="flex-1 overflow-y-auto p-4">
                <p className="text-sm text-neutral-400 mb-3">Or select from library:</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                  {images.map((image) => (
                    <button
                      key={image.id}
                      onClick={() => {
                        if (imagePickerOpen) {
                          updateImageMutation.mutate({ id: imagePickerOpen, imageUrl: image.url });
                        }
                      }}
                      disabled={updateImageMutation.isPending}
                      className="aspect-square relative bg-neutral-700 rounded-lg overflow-hidden hover:ring-2 hover:ring-primary-500 transition-all disabled:opacity-50"
                    >
                      <Image
                        src={image.url}
                        alt={image.name}
                        fill
                        className="object-contain p-1"
                        sizes="100px"
                      />
                      {image.isSystem && (
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-primary-600 text-white text-[10px] rounded">
                          System
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {images.length === 0 && (
                  <div className="text-center py-8 text-neutral-500">
                    <p>No images in library.</p>
                    <a
                      href="/admin/images"
                      className="text-primary-400 hover:underline inline-flex items-center gap-1 mt-2"
                    >
                      Upload images <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
