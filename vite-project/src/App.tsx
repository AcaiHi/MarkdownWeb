import { Route, Routes, Navigate } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { Container } from "react-bootstrap"
import { NewNote } from "./NewNote"
import { useLocalStorage } from "./useLocalStorage";
import { useMemo } from "react";
import { v4 as uuidV4 } from "uuid"
import { NoteList } from "./NoteList";
import { NoteLayout } from "./NoteLayout";
import { EditNote } from "./EditNote";
import { Note } from "./Note";


export type Note = {
  id: string,
} &NoteData

export type RawNote = {
  id: string,
} &RawNoteData

export type RawNoteData = {
  title: string,
  markdown: string,
  tagIds: string[],
}

export type NoteData = {
  title: string,
  markdown: string,
  tags: Tag[],
}

export type Tag = {
  id: string,
  label: string
}


function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("Notes",[])
  const [tags, setTags] = useLocalStorage<Tag[]>("tags",[])

  const notesWithTags = useMemo(() => {
    return notes.map(note => {
      return {
        ...note,
        tags: tags.filter(tag =>
          note.tagIds.includes(tag.id)
        )
      }
    })
  }, [notes, tags])

  function onUpdateNote(id: string, {tags, ...data}: NoteData){
    setNotes(prevNotes => {
      return prevNotes.map(note => {
        if(note.id === id){
          return {...note, ...data, tagIds: tags.map(tag => tag.id)}
        }else {
          return note
        }
      })
    })
  }

  function onDeleteNote(id: string){
    setNotes(prevNotes => {
      return prevNotes.filter(note => note.id !== id)
    })
  }

  function onCreatNote({tags, ...data}: NoteData){
    setNotes(prevNotes => {
      return [...prevNotes,
        {...data, id: uuidV4(), tagIds: tags.map(tag => tag.id)}
      ]
    })
  }

  function addTags(tag: Tag){
    setTags(prev => [...prev, tag])
  }

  function UpdateTags(id: string, label: string){
    setTags(prevTags => {
      return prevTags.map(tag => {
        if(tag.id === id){
          return {...tag, label}
        }else {
          return tag
        }
      })
    })
  }

  function DeleteTags(id: string){
    setTags(prevTags => {
      return prevTags.filter(tag => tag.id !== id)
    })
  }

  return (
    <Container className="my-4">
      <Routes>
        <Route path="/"
          element={
            <NoteList
              availableTags={tags}
              notes={notesWithTags}
              onUpdateTags={UpdateTags}
              onDeletetags={DeleteTags}
            ></NoteList>
          }
        />
        <Route path="/new" element={<NewNote onSubmit={onCreatNote} onAddTag={addTags} availableTags={tags}/>} />
        <Route path="/:id" element={<NoteLayout notes={notesWithTags}></NoteLayout>}>
          <Route index element={<Note onDelete={onDeleteNote}></Note>} />
          <Route path="edit" element={<EditNote onSubmit={onUpdateNote} onAddTag={addTags} availableTags={tags}></EditNote>} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  )
}

export default App
