import Map "mo:core/Map";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";



actor {
  include MixinStorage();

  type NoteId = Nat;

  type Subject = {
    #Maths;
    #Hindi;
    #English;
    #Science;
  };

  type Note = {
    id : NoteId;
    subject : Subject;
    photo : Storage.ExternalBlob;
    author : Principal;
  };

  module Note {
    public func compare(note1 : Note, note2 : Note) : Order.Order {
      Nat.compare(note1.id, note2.id);
    };
  };

  type AboutMe = {
    name : Text;
    course : Text;
    year : Text;
  };

  let notes = Map.empty<NoteId, Note>();
  var nextNoteId = 1;
  let aboutMe = Map.empty<Principal, AboutMe>();

  public shared ({ caller }) func uploadNote(subject : Subject, photo : Storage.ExternalBlob) : async NoteId {
    if (not aboutMe.containsKey(caller)) {
      Runtime.trap("You cannot upload any notes before setting up About Me section.");
    };
    let note : Note = {
      id = nextNoteId;
      subject;
      photo;
      author = caller;
    };
    notes.add(nextNoteId, note);
    nextNoteId += 1;
    note.id;
  };

  public query ({ caller }) func getAllNotes() : async [Note] {
    notes.values().toArray().sort();
  };

  public query ({ caller }) func getNotesBySubject(subject : Subject) : async [Note] {
    let filtered = notes.filter(
      func(_id, note) { note.subject == subject }
    );
    filtered.values().toArray();
  };

  public shared ({ caller }) func updateAboutMe(name : Text, course : Text, year : Text) : async () {
    let newAboutMe : AboutMe = {
      name;
      course;
      year;
    };
    aboutMe.add(caller, newAboutMe);
  };

  public query ({ caller }) func getAboutMe(user : Principal) : async AboutMe {
    switch (aboutMe.get(user)) {
      case (null) { Runtime.trap("User has not set up their About Me section yet.") };
      case (?aboutMe) { aboutMe };
    };
  };
};
