import React, { useCallback, useState } from 'react';
import { Upload, X, Camera } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  onRemoveImage: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  selectedImage,
  onRemoveImage,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      
      const files = Array.from(e.dataTransfer.files);
      const imageFile = files.find(file => file.type.startsWith('image/'));
      
      if (imageFile) {
        onImageSelect(imageFile);
      }
    },
    [onImageSelect]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith('image/')) {
        onImageSelect(file);
      }
    },
    [onImageSelect]
  );

  if (selectedImage) {
    const imageUrl = URL.createObjectURL(selectedImage);
    return (
      <div className="relative">
        <div className="relative rounded-xl overflow-hidden bg-white shadow-lg border border-gray-200">
          <img
            src={imageUrl}
            alt="Imagen seleccionada"
            className="w-full h-64 object-cover"
          />
          <button
            onClick={onRemoveImage}
            className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors duration-200 shadow-lg"
          >
            <X size={16} />
          </button>
        </div>
        <div className="mt-4 text-sm text-gray-600 text-center">
          <span className="font-medium">{selectedImage.name}</span>
          <span className="ml-2">({(selectedImage.size / 1024 / 1024).toFixed(2)} MB)</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer
        ${
          isDragOver
            ? 'border-emerald-400 bg-emerald-50 scale-105'
            : 'border-gray-300 hover:border-emerald-300 hover:bg-gray-50'
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id="file-input"
      />
      
      <label htmlFor="file-input" className="cursor-pointer">
        <div className="flex flex-col items-center space-y-4">
          <div className={`
            p-4 rounded-full transition-colors duration-300
            ${isDragOver ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}
          `}>
            {isDragOver ? <Camera size={32} /> : <Upload size={32} />}
          </div>
          
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900">
              {isDragOver ? 'Suelta la imagen aquí' : 'Sube una imagen de tu comida'}
            </p>
            <p className="text-sm text-gray-500">
              Arrastra y suelta o haz clic para seleccionar
            </p>
            <p className="text-xs text-gray-400">
              Formatos soportados: JPG, PNG, WebP (máx. 10MB)
            </p>
          </div>
        </div>
      </label>
    </div>
  );
};