import { Link } from '@remix-run/react';
import styles from './NoteList.css';

function NoteList({ notes }) {
  return (
    <ul id="note-list">
      {notes.map((note, index) => (
        <li key={note.id} className="note">
          <Link to={note.id}>
            {/* <Link to={`/${note.id}`}> for not appending note after /notes page --> but in this app we rather rename $noteId.jsx page to "notes.$noteId" (with this notation, the dot is essentially translated to a "/"; this feature is also not just available for dynamic routes, but instead for ALL routes */}
            <article>
              <header>
                <ul className="note-meta">
                  <li>#{index + 1}</li>
                  <li>
                    {/* we can use time with note.id because of logic we wrote on backend side */}
                    <time dateTime={note.id}>
                      {new Date(note.id).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </time>
                  </li>
                </ul>
                <h2>{note.title}</h2>
              </header>
              <p>{note.content}</p>
            </article>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default NoteList;

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}