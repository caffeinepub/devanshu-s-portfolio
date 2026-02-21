import { Link } from '@tanstack/react-router';
import { BookOpen, User, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Welcome Section */}
      <section className="text-center space-y-4 py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
          <GraduationCap className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Welcome to Devanshu Portfolio
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A personal space for organizing academic notes across subjects and sharing information about my educational journey.
        </p>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-2 gap-6">
        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-chart-1/10 flex items-center justify-center mb-2">
              <BookOpen className="w-6 h-6 text-chart-1" />
            </div>
            <CardTitle>Academic Notes</CardTitle>
            <CardDescription>
              Upload and organize your study notes across different subjects including Maths, Hindi, English, and Science.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/notes">
              <Button className="w-full">View Notes</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-chart-2/10 flex items-center justify-center mb-2">
              <User className="w-6 h-6 text-chart-2" />
            </div>
            <CardTitle>About Me</CardTitle>
            <CardDescription>
              Learn more about my educational background, current course, and academic year.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/about">
              <Button variant="outline" className="w-full">
                View Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Subject Overview */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Subjects Covered</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Maths', icon: '📐', color: 'bg-chart-1/10 text-chart-1' },
            { name: 'Hindi', icon: '📚', color: 'bg-chart-2/10 text-chart-2' },
            { name: 'English', icon: '✍️', color: 'bg-chart-3/10 text-chart-3' },
            { name: 'Science', icon: '🔬', color: 'bg-chart-4/10 text-chart-4' },
          ].map((subject) => (
            <Card key={subject.name} className="text-center">
              <CardContent className="pt-6">
                <div className={`w-16 h-16 rounded-full ${subject.color} flex items-center justify-center text-3xl mx-auto mb-3`}>
                  {subject.icon}
                </div>
                <p className="font-semibold">{subject.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
