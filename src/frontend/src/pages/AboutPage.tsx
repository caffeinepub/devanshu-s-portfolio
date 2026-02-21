import AboutMeForm from '@/components/AboutMeForm';
import { User } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
          <User className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">About Me</h1>
        <p className="text-muted-foreground">
          Share your personal details and educational background
        </p>
      </div>

      {/* Form */}
      <AboutMeForm />
    </div>
  );
}
