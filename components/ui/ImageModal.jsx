import React from 'react';

export default function ImageModal({ open, onClose, glbUrl, title, sketchfabUrl }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        {sketchfabUrl ? (
          <iframe
            src={sketchfabUrl}
            title="3D Model"
            width="100%"
            height="300"
            frameBorder="0"
            allow="autoplay; fullscreen; vr"
            allowFullScreen
            className="rounded mb-4"
          />
        ) : glbUrl ? (
          <p className="text-sm text-gray-600 mb-4">GLB Model: {glbUrl}</p>
        ) : null}
        <button
          onClick={onClose}
          className="mt-2 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}
