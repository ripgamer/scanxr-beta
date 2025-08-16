# ScanXR - 3D World Shared in Reality

A cutting-edge Next.js application that brings immersive 3D experiences to life through augmented reality and virtual reality technologies.

## 🚀 Project Overview

ScanXR is an innovative platform that allows users to create, customize, and share 3D avatars and experiences. Built with modern web technologies, it provides a seamless bridge between the digital and physical worlds.

## 👥 Team Members

### **Aakashdeep Kumar** - Full Stack Developer & 3D Technology Specialist
- **Role**: Expert in Next.js, React, and 3D web technologies
- **Specialization**: Creating immersive 3D experiences and modern web applications
- **Skills**: Frontend Development, 3D WebGL, React, Next.js

### **Nandini Jagdade** - Team Lead & Database Architecture Manager
- **Role**: Experienced team leader specializing in database design and project management
- **Specialization**: Database architecture, system design, team leadership
- **Skills**: Database Management, Project Management, System Architecture

### **Sakshi Kapure** - UI/UX Designer & Frontend Developer
- **Role**: Creative designer focused on user experience and interface design
- **Specialization**: Creating intuitive and visually appealing 3D applications
- **Skills**: UI/UX Design, Frontend Development, User Research

### **Pramod Dwarkunde** - Full Stack Developer & Backend Specialist
- **Role**: Backend development expert with strong server-side technology skills
- **Specialization**: APIs, database management, scalable application development
- **Skills**: Backend Development, API Design, Database Management

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React, Tailwind CSS
- **3D Technology**: Three.js, WebGL, ReadyPlayer.me Integration
- **Authentication**: Clerk
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS, Framer Motion
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Clerk account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ripgamer/scanxr-beta.git
cd scanxr-beta
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env.local file
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_KEY=your_supabase_anon_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌟 Features

- **3D Avatar Creation**: Customize and create unique 3D avatars
- **Real-time 3D Rendering**: Interactive 3D models with WebGL
- **User Authentication**: Secure user management with Clerk
- **Responsive Design**: Mobile-first, responsive interface
- **Dark/Light Theme**: Theme switching with system preference detection
- **Particle Effects**: Dynamic background animations
- **Team Collaboration**: Built by a diverse team of experts

## 📱 Pages & Components

- **Home Page**: Landing page with hero section and team showcase
- **Profile Page**: User profile management with avatar customization
- **Authentication**: Sign-in and sign-up pages
- **Team Section**: Team member profiles and information
- **3D Model Viewer**: Interactive 3D model display

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
scanxr-beta/
├── app/                 # Next.js app directory
├── components/          # Reusable components
│   ├── mvpblocks/      # Main page components
│   ├── ui/             # UI components
│   └── ...             # Other components
├── lib/                 # Utility functions
├── public/              # Static assets
└── prisma/              # Database schema
```

## 🌐 SEO & Meta Tags

The application includes comprehensive SEO optimization:

- **Meta Tags**: Title, description, keywords
- **Open Graph**: Social media sharing optimization
- **Twitter Cards**: Twitter-specific meta tags
- **Structured Data**: Team member information
- **Keywords**: 3D Technology, AR/VR, Team Members

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
npm run build
npm run start
```

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines and ensure you follow the project's coding standards.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

- **Project**: ScanXR
- **Team**: Aakashdeep Kumar, Nandini Jagdade, Sakshi Kapure, Pramod Dwarkunde
- **Email**: [Your contact email]
- **Website**: [https://scanxr-beta.vercel.app/](https://scanxr-beta.vercel.app/)

## 🙏 Acknowledgments

- ReadyPlayer.me for 3D avatar technology
- Next.js team for the amazing framework
- Supabase for database services
- Clerk for authentication services
- All contributors and supporters

---

**Built with ❤️ by the ScanXR Team**
