import { useState } from 'react';
import NoteUpload from '@/components/NoteUpload';
import NotesList from '@/components/NotesList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen } from 'lucide-react';

export default function NotesPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleNoteUploaded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">Academic Notes</h1>
        <p className="text-muted-foreground">
          Upload and organize your study notes by subject
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="all">View Notes</TabsTrigger>
          <TabsTrigger value="upload">Upload Note</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <NotesList key={refreshKey} />
        </TabsContent>

        <TabsContent value="upload" className="mt-6">
          <div className="max-w-2xl mx-auto">
            <NoteUpload onNoteUploaded={handleNoteUploaded} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
