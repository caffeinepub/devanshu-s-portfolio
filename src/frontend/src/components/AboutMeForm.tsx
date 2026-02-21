import { useState, useEffect } from 'react';
import { useGetAboutMe, useUpdateAboutMe } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';

export default function AboutMeForm() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal();
  
  const { data: aboutMe, isLoading } = useGetAboutMe(principal);
  const updateAboutMeMutation = useUpdateAboutMe();

  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('');

  useEffect(() => {
    if (aboutMe) {
      setName(aboutMe.name);
      setCourse(aboutMe.course);
      setYear(aboutMe.year);
    }
  }, [aboutMe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !course.trim() || !year.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await updateAboutMeMutation.mutateAsync({ name, course, year });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
      console.error('Update error:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="h-10 bg-muted animate-pulse rounded" />
            <div className="h-10 bg-muted animate-pulse rounded" />
            <div className="h-10 bg-muted animate-pulse rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Details</CardTitle>
        <CardDescription>
          {aboutMe ? 'Update your personal information' : 'Set up your profile information'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="course">Course</Label>
            <Input
              id="course"
              type="text"
              placeholder="e.g., Computer Science, Biology, etc."
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Academic Year</Label>
            <Input
              id="year"
              type="text"
              placeholder="e.g., 1st Year, 2nd Year, etc."
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={updateAboutMeMutation.isPending}>
            {updateAboutMeMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Profile
              </>
            )}
          </Button>
        </form>

        {aboutMe && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Current Profile</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Name:</span> {aboutMe.name}</p>
              <p><span className="font-medium">Course:</span> {aboutMe.course}</p>
              <p><span className="font-medium">Year:</span> {aboutMe.year}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
