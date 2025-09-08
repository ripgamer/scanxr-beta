'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Masonry from 'react-masonry-css';
import { useRouter } from 'next/navigation';
import { FaQrcode, FaVrCardboard } from 'react-icons/fa';
import ImageModal from '@/components/ui/ImageModal';

export default function ExplorePage() {
  const router = useRouter();
  const [hovered, setHovered] = useState(null);
  const [images, setImages] = useState([]);
  const [modal, setModal] = useState({ open: false, glbUrl: '', title: '' });

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
        glbUrl: '/models/chair.glb',
        sketchfabUrl: 'https://sketchfab.com/models/b935005e86464b0fb29477f05a3790ef/embed',
        arUrl: '/ar/chair',
        qrUrl: 'https://scanxr.com/post/1'
      },
      {
        id: 2,
        title: 'Futuristic Car',
        imageUrl: 'https://picsum.photos/640/480?random=2',
        glbUrl: '/models/car.glb',
        arUrl: '/ar/car',
        qrUrl: 'https://scanxr.com/post/2'
      },
      {
        id: 3,
        title: 'Modern House',
        imageUrl: 'https://picsum.photos/1280/720?random=3',
        glbUrl: '/models/house.glb',
        arUrl: '/ar/house',
        qrUrl: 'https://scanxr.com/post/3'
      }
    ]);
  }, []);

  const handleImageClick = (post) => {
    setModal({ open: true, glbUrl: post.glbUrl, title: post.title, sketchfabUrl: post.sketchfabUrl });
  };

  const handleQrClick = (qrUrl) => {
    // For now, open QR in a new tab (later show modal with QR image)
    window.open(qrUrl, '_blank');
  };

  const handleArClick = (arUrl) => {
    // Navigate to AR view (WebAR / 3D scene)
    router.push(arUrl);
  };

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <div className="min-h-screen px-4 py-20 md:px-6">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {images.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 ease-in-out cursor-pointer mb-4"
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
              onClick={() => handleImageClick(post)}
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
      </Masonry>
      <ImageModal
        open={modal.open}
        onClose={() => setModal({ open: false, glbUrl: '', title: '', sketchfabUrl: '' })}
        glbUrl={modal.glbUrl}
        title={modal.title}
        sketchfabUrl={modal.sketchfabUrl}
      />
    </div>
  );
}
