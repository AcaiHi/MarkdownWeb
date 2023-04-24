import { FormEvent, useRef, useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import CreatableReactSelect from "react-select/creatable";
import { NoteData, Tag } from "./App";
import { v4 as uuidV4 } from "uuid"

// This is the default theme for react-quill
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import ReactQuill from "react-quill";

// This is the default theme for react-quill
import 'react-quill/dist/quill.snow.css';
import "./NoteForm.css"

type NoteFormProps = {
  onSubmit: (data: NoteData) => void
  onAddTag: (tag: Tag) => void
  availableTags: Tag[]
} &Partial<NoteData>


// This is the default theme for react-quill
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false]}],
    [{ font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' }
    ],
    ['link', 'image', 'video'],
  ]
}

export function NoteForm({
  onSubmit, onAddTag, availableTags,
  title = "", markdown = "", tags = [],
}: NoteFormProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const markdownRef = useRef<HTMLTextAreaElement>(null);

  const [selcetedTags, setselcetedTags] = useState<Tag[]>(tags);
  const navigate = useNavigate()


  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    onSubmit({
      title: titleRef.current!.value,
      markdown: markdownRef.current!.value,
      tags: selcetedTags,
    })

    navigate("..")
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Stack gap={4}>
        <Row>
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control ref={titleRef} required defaultValue={title}/>
            </Form.Group>
          </Col>
          <Col>
           <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <CreatableReactSelect
                onCreateOption={label => {
                  const newTag = {id : uuidV4(), label}
                  onAddTag(newTag)
                  setselcetedTags(prev => [...prev, newTag])
                }}
                value={selcetedTags.map(tag => {
                  return {label: tag.label, value: tag.id}
                })}
                options={availableTags.map(tag => {
                  return {label: tag.label, value: tag.id}
                })}
                onChange={tags => {
                  setselcetedTags(tags.map(tag => {
                    return {id: tag.value, label: tag.label}
                  }))
                }}
              isMulti/>
           </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId="body">
          <Form.Label>
            Body
          </Form.Label>
          <Form.Control
            ref={markdownRef}
            required as="textarea"
            rows={15}
            defaultValue={markdown}
          />
        </Form.Group>
        <Stack direction="horizontal" gap={2} className="justify-content-end">
          <Button
            type="submit"
            variant="primary"
          >
            Save
          </Button>
          <Link to="..">
            <Button
              type="button"
              variant="outline-secondary"
            >
              Cancel
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Form>
  )
}