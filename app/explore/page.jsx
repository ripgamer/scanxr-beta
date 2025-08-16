'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FaQrcode, FaVrCardboard } from 'react-icons/fa'; // QR + AR icons

export default function MasonryGallery() {
  const router = useRouter();
  const [hovered, setHovered] = useState(null);
  const [images, setImages] = useState([]);

  // 🔹 Dummy Data (for now)
  useEffect(() => {
    // In future, replace this with fetch from backend:
    /*
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setImages(data))
      .catch(err => console.error(err));
    */
    setImages([
      {
        id: 1,
        title: 'Cool 3D Chair',
        imageUrl: 'https://picsum.photos/800/600?random=1',
        arUrl: '/ar/chair', // for AR view
        qrUrl: 'https://scanxr.com/post/1'
      },
      {
        id: 2,
        title: 'Futuristic Car',
        imageUrl: 'https://picsum.photos/640/480?random=2',
        arUrl: '/ar/car',
        qrUrl: 'https://scanxr.com/post/2'
      },
      {
        id: 3,
        title: 'Modern House',
        imageUrl: 'https://picsum.photos/1280/720?random=3',
        arUrl: '/ar/house',
        qrUrl: 'https://scanxr.com/post/3'
      }
    ]);
  }, []);

  const handleImageClick = (id) => {
    // Navigate to single post page
    router.push(`/post/${id}`);
  };

  const handleQrClick = (qrUrl) => {
    // For now, open QR in a new tab (later show modal with QR image)
    window.open(qrUrl, '_blank');
  };

  const handleArClick = (arUrl) => {
    // Navigate to AR view (WebAR / 3D scene)
    router.push(arUrl);
  };

  return (
    <div className="min-h-screen px-4 py-20 md:px-6">
      <div className="columns-1 gap-4 space-y-4 sm:columns-2 md:columns-3 lg:columns-4">
        {images.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 ease-in-out cursor-pointer"
          >
            {/* Image */}
            <motion.img
              src={post.imageUrl}
              alt={post.title}
              className={`w-full rounded-lg object-cover transition-all duration-300 ease-in-out ${
                hovered === null
                  ? 'blur-0 scale-100'
                  : hovered === index
                  ? 'blur-0 scale-105'
                  : 'blur-xs'
              }`}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleImageClick(post.id)}
            />

            {/* Overlay Icons */}
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {/* AR Icon */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleArClick(post.arUrl);
                }}
                className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
              >
                <FaVrCardboard className="text-gray-800 text-lg" />
              </button>

              {/* QR Icon */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleQrClick(post.qrUrl);
                }}
                className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
              >
                <FaQrcode className="text-gray-800 text-lg" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
