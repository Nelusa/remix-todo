import NewNote, {links as newNoteLinks} from "../components/NewNote/NewNote"; //surfacing links
import newNoteStyles from "~/components/NewNote/NewNote.css"
import { getStoredNotes, storeNotes } from "../data/notes";
import { redirect } from "@remix-run/node";
import NoteList, {links as noteListLinks} from "../components/NoteList/NoteList";
import { json } from "react-router-dom";
import { useLoaderData } from "@remix-run/react";
import { useActionData } from "@remix-run/react";
import { Link } from "@remix-run/react";
import { useCatch } from "@remix-run/react";


//now we add some code to handle requests --> action function (name, which is Remix looking for)
//whatever we put into action function will run on the backend, on the server (not in the browser)
//Remix will split the code and only execute and store that code in this action function on the server
//action function is triggered whenever a non-GET request reaches this route --> if a GET request reaches /notes, it's simply the components that's returned (so this page component); if a non-GET request reaches /notes, it's action function which will be triggered instead of the component function
// --> follow notes.js file
export async function action({request}) { //data object, that includes request object, which has a formData() method which returns a promise
  const formData = await request.formData()
  // 2) we need to do object, while properties and string are related to "names" for inputs
  //shortcut: const noteData = Object.fromEntries(formData)
  const noteData = {
    title: formData.get("title"),
    content: formData.get("content")
  }
  //Add validation...
  // a) minimum length for title
  if (noteData.title.trim().length < 5) {
    // alert won't works here, because we are on backend --> we need to return some data
    // but how we can access those data? --> useActionData hook
    return {
      message: "Invalid title - must be at least 5 characters long."
    }
  }


  // 3) 
  const existingNotes = await getStoredNotes()
  noteData.id = new Date().toISOString()
  const updatedNotes = existingNotes.concat(noteData)
  await storeNotes(updatedNotes)

  //Redirect a user to a different page
  // returning a response (typically)
  return redirect("/notes")
}

//we want load our data and show them on client side --> loader function 
// it will be triggered whenever a GET request reaches this route, which means whenever this component is about to be rendered (when the page is shown)
//code is prepared and pre-rendered on the server --> therefore this code never reaches the client side (it is also on backend (as action function))

// THE DATA RETURNED BY THE LOADER SOMETIMES NEEDS TO BE SEND FROM THE BE TO THE FE --> RESPONSE FROM BE TO FE
// --> Remix wraps this data into the response
export async function loader() {
  const notes = await getStoredNotes()

  //error handling (backend error --> response error) 
  if (!notes || notes.length === 0) {
    throw json(
      {
        message: "Could not find any notes."
      }, {
      status: 404,
      statusText: "Not found"
    })
  }
/*   return new Response(JSON.stringify(notes), {
    headers: {
      "Content-Type": "application/json"
    }
  }) */
  //return json(notes)
  return notes // it is enough, but alternatives above explain, what is happening here
}

const NotesPage = () => {
  const notes = useLoaderData() //it gives us access to the data returned by a loader function

  //const data = useActionData() //it gives us access to the data returned by an action function
  // --> we can have it actually in some component (e.g. NewNote.jsx) so we don't need to pass it as props to it

   return (
    <main>
      <NewNote/>
      <NoteList notes={notes}/>
    </main>
  );
}
 
export default NotesPage;

export function links() {
  return [...newNoteLinks(), ...noteListLinks()];
}


//we could work with metadata for our pages, that will be then merged with any higher level metadata 
export function meta() {
  return {
    title: "All Notes",
    description: "Manage your notes with ease."
  }
}

//if we add ErrorBoundary into specific page, only this page content will be replaced in case of some error
export function ErrorBoundary({error}) {
   return (
    <main className="error">
      <h1>An error related to your notes occurred!</h1>
      <p>{error.message}</p>
      <p>Back to <Link to="/">safety</Link> again!</p>
    </main>
  )
}

//error handling for error responses 
export function CatchBoundary() {
  // useCatch hook gives as an object (caughtResponse)
  const caughtResponse = useCatch()

  const message = caughtResponse.data?.message || "Data not found"

  return (
    <main>
      <NewNote/>
      <p className="info-message">{message}</p>
    </main>
  )
}