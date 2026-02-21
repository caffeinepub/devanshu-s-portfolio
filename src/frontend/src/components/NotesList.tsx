import { useState } from 'react';
import { useGetAllNotes } from '@/hooks/useQueries';
import { Subject, type Note } from '@/backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const subjectConfig = {
  [Subject.Maths]: { icon: '📐', color: 'bg-chart-1/10 text-chart-1 border-chart-1/20' },
  [Subject.Hindi]: { icon: '📚', color: 'bg-chart-2/10 text-chart-2 border-chart-2/20' },
  [Subject.English]: { icon: '✍️', color: 'bg-chart-3/10 text-chart-3 border-chart-3/20' },
  [Subject.Science]: { icon: '🔬', color: 'bg-chart-4/10 text-chart-4 border-chart-4/20' },
};

export default function NotesList() {
  const { data: notes, isLoading, error } = useGetAllNotes();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-48 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-destructive">Failed to load notes. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            No notes yet. Upload your first note to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  const notesBySubject = {
    [Subject.Maths]: notes.filter((n) => n.subject === Subject.Maths),
    [Subject.Hindi]: notes.filter((n) => n.subject === Subject.Hindi),
    [Subject.English]: notes.filter((n) => n.subject === Subject.English),
    [Subject.Science]: notes.filter((n) => n.subject === Subject.Science),
  };

  const NoteCard = ({ note }: { note: Note }) => (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => setSelectedNote(note)}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <span>{subjectConfig[note.subject].icon}</span>
            {note.subject}
          </CardTitle>
          <Badge variant="outline" className={subjectConfig[note.subject].color}>
            #{note.id.toString()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <AspectRatio ratio={4 / 3}>
          <img
            src={note.photo.getDirectURL()}
            alt={`${note.subject} note #${note.id}`}
            className="w-full h-full object-cover rounded-md"
            loading="lazy"
          />
        </AspectRatio>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5 max-w-3xl mx-auto">
          <TabsTrigger value="all">All ({notes.length})</TabsTrigger>
          <TabsTrigger value={Subject.Maths}>📐 ({notesBySubject[Subject.Maths].length})</TabsTrigger>
          <TabsTrigger value={Subject.Hindi}>📚 ({notesBySubject[Subject.Hindi].length})</TabsTrigger>
          <TabsTrigger value={Subject.English}>✍️ ({notesBySubject[Subject.English].length})</TabsTrigger>
          <TabsTrigger value={Subject.Science}>🔬 ({notesBySubject[Subject.Science].length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <NoteCard key={note.id.toString()} note={note} />
            ))}
          </div>
        </TabsContent>

        {Object.entries(notesBySubject).map(([subject, subjectNotes]) => (
          <TabsContent key={subject} value={subject} className="mt-6">
            {subjectNotes.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    No notes for {subject} yet. Upload one to get started!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {subjectNotes.map((note) => (
                  <NoteCard key={note.id.toString()} note={note} />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          {selectedNote && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span>{subjectConfig[selectedNote.subject].icon}</span>
                  {selectedNote.subject} - Note #{selectedNote.id.toString()}
                </DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <img
                  src={selectedNote.photo.getDirectURL()}
                  alt={`${selectedNote.subject} note #${selectedNote.id}`}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
