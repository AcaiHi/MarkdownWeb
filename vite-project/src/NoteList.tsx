import { useMemo, useState } from 'react'
import {Row, Col, Stack, Button, Form, Card, Badge, Modal} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ReactSelect from 'react-select'
import { Tag } from './App'
import style  from "./NoteList.module.css"


type SimplifiedNote = {
  tags : Tag[]
  title: string
  id: string
}

type NoteListProps = {
  availableTags: Tag[]
  notes: SimplifiedNote[]
  onDeletetags: (id: string) => void
  onUpdateTags: (id: string, label: string) => void
}

type EditTagsModelProps = {
  show: boolean
  availableTags: Tag[]
  handleClose: () => void
  onDeletetags: (id: string) => void
  onUpdateTags: (id: string, label: string) => void
}

export function NoteList({availableTags, notes, onDeletetags, onUpdateTags}: NoteListProps) {
  const [selcetedTags, setselcetedTags] = useState<Tag[]>([]);
  const [editModeIsOpen, setEditModeIsOpen] = useState(false);
  const [title, setTitle] = useState("");

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      return (title === "" || note.title.toLowerCase().includes(title.toLowerCase()) )
        && (selcetedTags.length === 0 || selcetedTags.every(tag => note.tags.some(noteTag => noteTag.id === tag.id)))
    })
  }, [title, selcetedTags, notes])

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col><h1>Notes</h1></Col>
        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Link to="/new">
              <Button variant="primary">Create</Button>
            </Link>
            <Button
              onClick={() => setEditModeIsOpen(true)}
              variant="outline-secondary"
            >Edit Tag</Button>
          </Stack>
        </Col>
      </Row>
      <Form>
        <Row className="mb-4">
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <ReactSelect
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
      </Form>
      <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
        {filteredNotes.map(note => (
          <Col key={note.id}>
            <NoteCard
              id={note.id}
              title={note.title}
              tags={note.tags}
            ></NoteCard>
          </Col>
        ))}
      </Row>
      <EditTagsModel
        show={editModeIsOpen}
        handleClose={() => setEditModeIsOpen(false)}
        availableTags={availableTags}
        onDeletetags={onDeletetags}
        onUpdateTags={onUpdateTags}
      />
    </>
  )
}

function NoteCard({id, title, tags}: SimplifiedNote) {

  return <Card as={Link} to={`/${id}`} className={`h-100 text-reset text-decoration-none ${style.card}`}>
    <Card.Body>
      <Stack
        gap={2}
        className="algin-items-center justtify-content-center h-100"
      >
        <span className="fs-5">{title}</span>
        {tags.length > 0 && (
          <Stack
            gap={1}
            direction="horizontal"
            className="justify-content-center flex-wrap"
          >
            {tags.map(tag => (
              <Badge className="text-truncate" key={tag.id}>
                {tag.label}
              </Badge>
            ))}
          </Stack>
        )}
      </Stack>
    </Card.Body>
  </Card>
}

function EditTagsModel({availableTags, handleClose, show, onDeletetags, onUpdateTags}: EditTagsModelProps) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Tags</Modal.Title>
        <Modal.Body>
          <Form>
            <Stack gap={2}>
              {availableTags.map(tag => (
                <Row key={tag.id}>
                  <Col>
                    <Form.Control
                      type="text"
                      value={tag.label}
                      onChange={e => onUpdateTags(tag.id, e.target.value)}
                    />
                  </Col>
                  <Col xs="auto">
                    <Button
                      variant="outline-danger"
                      onClick={() => onDeletetags(tag.id)}
                    >&times;</Button>
                  </Col>
                </Row>
              ))}
            </Stack>
          </Form>
        </Modal.Body>
      </Modal.Header>
    </Modal>
  )
}