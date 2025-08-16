export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ScanXR",
  "description": "3D World Shared in Reality - Innovative platform for creating and sharing immersive 3D experiences",
  "url": "https://scanxr-beta.vercel.app",
  "logo": "https://scanxr-beta.vercel.app/logo.svg",
  "sameAs": [
    "https://github.com/your-username/scanxr-beta",
    "https://linkedin.com/company/scanxr"
  ],
  "foundingDate": "2024",
  "founder": [
    {
      "@type": "Person",
      "name": "Aakashdeep Kumar",
      "jobTitle": "Full Stack Developer & 3D Technology Specialist",
      "description": "Expert in Next.js, React, and 3D web technologies"
    },
    {
      "@type": "Person", 
      "name": "Nandini Jagdade",
      "jobTitle": "Team Lead & Database Architecture Manager",
      "description": "Experienced team leader specializing in database design and project management"
    },
    {
      "@type": "Person",
      "name": "Sakshi Kapure", 
      "jobTitle": "UI/UX Designer & Frontend Developer",
      "description": "Creative designer focused on user experience and interface design"
    },
    {
      "@type": "Person",
      "name": "Pramod Dwarkunde",
      "jobTitle": "Full Stack Developer & Backend Specialist", 
      "description": "Backend development expert with strong server-side technology skills"
    }
  ],
  "employee": [
    {
      "@type": "Person",
      "name": "Aakashdeep Kumar",
      "jobTitle": "Full Stack Developer & 3D Technology Specialist",
      "knowsAbout": ["Next.js", "React", "3D WebGL", "Web Development"],
      "description": "Expert in Next.js, React, and 3D web technologies. Specializes in creating immersive 3D experiences and modern web applications."
    },
    {
      "@type": "Person",
      "name": "Nandini Jagdade", 
      "jobTitle": "Team Lead & Database Architecture Manager",
      "knowsAbout": ["Database Design", "Project Management", "System Architecture", "Team Leadership"],
      "description": "Experienced team leader specializing in database design, project management, and system architecture. Leads the ScanXR development team."
    },
    {
      "@type": "Person",
      "name": "Sakshi Kapure",
      "jobTitle": "UI/UX Designer & Frontend Developer", 
      "knowsAbout": ["UI/UX Design", "Frontend Development", "User Research", "3D Applications"],
      "description": "Creative designer focused on user experience and interface design. Specializes in creating intuitive and visually appealing 3D applications."
    },
    {
      "@type": "Person",
      "name": "Pramod Dwarkunde",
      "jobTitle": "Full Stack Developer & Backend Specialist",
      "knowsAbout": ["Backend Development", "API Design", "Database Management", "Scalable Applications"],
      "description": "Backend development expert with strong skills in server-side technologies, APIs, and database management for scalable applications."
    }
  ],
  "knowsAbout": [
    "3D Technology",
    "Augmented Reality", 
    "Virtual Reality",
    "Web Development",
    "Next.js",
    "React",
    "3D Modeling",
    "AR/VR Development",
    "WebGL",
    "Three.js"
  ],
  "areaServed": "Worldwide",
  "serviceType": "3D Technology Platform",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "ScanXR Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "3D Avatar Creation",
          "description": "Create and customize unique 3D avatars"
        }
      },
      {
        "@type": "Offer", 
        "itemOffered": {
          "@type": "Service",
          "name": "3D Experience Sharing",
          "description": "Share immersive 3D experiences"
        }
      }
    ]
  }
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "ScanXR",
  "description": "3D World Shared in Reality - Create, customize, and share immersive 3D experiences",
  "url": "https://scanxr-beta.vercel.app",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://scanxr-beta.vercel.app/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@type": "Organization",
    "name": "ScanXR Team"
  }
}; 