import { useNavigation } from '@remix-run/react';
import { useActionData } from '@remix-run/react';
import { Form } from '@remix-run/react';
import newNoteStyles from './NewNote.css';

const NewNote = () => {
  // with Form from Remix, we can use useNavigation() hook 
  // with this hook we get a navigation object, while this navigation object contains some useful data about ongoing requests that micht be happening "behind the scenes"
  const navigation = useNavigation()

  //navigation.state
  //navigation.submission
  //navigation.type

  //to add loading functionality, we use "submitting" state of navigation.state and use it with our button of adding notes below
  const isSubmitting = navigation.state === "submitting"

    const data = useActionData() //it gives us access to the data returned by an action function 

  return (
    // Form from Remix behaves differently --> if we save a note, we technically don't reload the page, even if we redirect the page (client side routing) --> so we prevent us from extra request to the server
    // we gave a POST request instead of redirect request (204 instead of 300) and GET request which triggered loader (which gave us the updated data)
    <Form method="post" id="note-form"> {/* in React we should add onSubmit and handleSubmit function --> here we don't need it and we use method="post" 
    - we don't have an action attribute because we already have NewNote component in /notes page --> form sends the data to the active page (for use /notes) */}

      {data?.message && <p className='error'>{data.message}</p>}
      <p>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" required />
      </p>
      <p>
        <label htmlFor="content">Content</label>
        <textarea id="content" name="content" rows="5" required />
      </p>
      <div className="form-actions">
        <button disabled={isSubmitting}>{isSubmitting ? "Adding..." : "Add Note"}</button>
      </div>
    </Form>
  );
}

export default NewNote;

export function links() {
  return [{ rel: 'stylesheet', href: newNoteStyles }];
}