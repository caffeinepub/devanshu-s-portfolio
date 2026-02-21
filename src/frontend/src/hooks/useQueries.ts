import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Subject, type Note, type AboutMe, ExternalBlob } from '@/backend';
import type { Principal } from '@icp-sdk/core/principal';

export function useGetAllNotes() {
  const { actor, isFetching } = useActor();

  return useQuery<Note[]>({
    queryKey: ['notes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllNotes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetNotesBySubject(subject: Subject) {
  const { actor, isFetching } = useActor();

  return useQuery<Note[]>({
    queryKey: ['notes', subject],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotesBySubject(subject);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUploadNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ subject, photo }: { subject: Subject; photo: ExternalBlob }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.uploadNote(subject, photo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}

export function useGetAboutMe(user: Principal | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<AboutMe | null>({
    queryKey: ['aboutMe', user?.toString()],
    queryFn: async () => {
      if (!actor || !user) return null;
      try {
        return await actor.getAboutMe(user);
      } catch (error) {
        // User hasn't set up their About Me section yet
        return null;
      }
    },
    enabled: !!actor && !!user && !isFetching,
  });
}

export function useUpdateAboutMe() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, course, year }: { name: string; course: string; year: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateAboutMe(name, course, year);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aboutMe'] });
    },
  });
}
