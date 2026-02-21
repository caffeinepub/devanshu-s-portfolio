import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type NoteId = bigint;
export interface AboutMe {
    name: string;
    year: string;
    course: string;
}
export interface Note {
    id: NoteId;
    subject: Subject;
    author: Principal;
    photo: ExternalBlob;
}
export enum Subject {
    Maths = "Maths",
    Hindi = "Hindi",
    English = "English",
    Science = "Science"
}
export interface backendInterface {
    getAboutMe(user: Principal): Promise<AboutMe>;
    getAllNotes(): Promise<Array<Note>>;
    getNotesBySubject(subject: Subject): Promise<Array<Note>>;
    updateAboutMe(name: string, course: string, year: string): Promise<void>;
    uploadNote(subject: Subject, photo: ExternalBlob): Promise<NoteId>;
}
