'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const images = [
  // Simulated data — future: fetch from backend
  { id: 1, src: 'https://picsum.photos/800/600?random=1', title: 'Post 1' },
  { id: 2, src: 'https://picsum.photos/640/480?random=2', title: 'Post 2' },
  { id: 3, src: 'https://picsum.photos/1280/720?random=3', title: 'Post 3' },
  { id: 4, src: 'https://picsum.photos/960/540?random=4', title: 'Post 4' },
];

// ✅ Future: Fetch posts from backend
// useEffect(() => {
//   fetch('/api/posts')
//     .then(res => res.json())
//     .then(data => setImages(data));
// }, []);

export default function MasonryGallery() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="min-h-screen px-4 py-20 md:px-6">
      <div className="columns-1 gap-4 space-y-4 transition-all sm:columns-2 md:columns-3 lg:columns-4">
        {images.map((img, index) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 ease-in-out"
          >
            <Link href={`/post/${img.id}`}>
              <motion.img
                src={img.src}
                alt={img.title}
                className={`w-full rounded-lg object-cover transition-all duration-300 ease-in-out ${
                  hovered === null
                    ? 'blur-0 scale-100'
                    : hovered === index
                    ? 'blur-0 scale-105'
                    : 'blur-xs'
                }`}
                whileHover={{ scale: 1.05 }}
              />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
