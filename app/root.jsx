import { Link } from "@remix-run/react";
import { useCatch } from "@remix-run/react";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import styles from '~/styles/main.css';
import MainNavigation from "./components/MainNavigation/MainNavigation";

export const meta = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <header>
          <MainNavigation/>
        </header>
        <Outlet />
        <ScrollRestoration /> {/* restoring scroll bar position when user navigates between pages */}
        <Scripts /> {/* injecting the client-side scripts when the page is downloaded on the client side */}
        <LiveReload /> {/* live reloading of the page */}
      </body>
    </html>
  );
}

//error handling (normal errors, not response errors) --> ErrorBoundary function, which will be rendered by Remix instead of the "App" component (if an error is thrown anywhere in our app)
export function ErrorBoundary({error}) {
   return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <title>An error occurred!</title>
      </head>
      <body>
        <header>
          <MainNavigation/>
        </header>
        <main className="error">
          <h1>An error occurred!</h1>
          <p>{error.message}</p>
          <p>Back to <Link to="/">safety</Link> again!</p>
        </main>
        <ScrollRestoration /> {/* restoring scroll bar position when user navigates between pages */}
        <Scripts /> {/* injecting the client-side scripts when the page is downloaded on the client side */}
        <LiveReload /> {/* live reloading of the page */}
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const caughtResponse = useCatch()
   return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <title>An error occurred!</title>
      </head>
      <body>
        <header>
          <MainNavigation/>
        </header>
        <main className="error">
          <h1>{caughtResponse.statusText}</h1>
          <p>{caughtResponse.data?.message || "Something went wrong!"}</p>
          <p>Back to <Link to="/">safety</Link> again!</p>
        </main>
        <ScrollRestoration /> {/* restoring scroll bar position when user navigates between pages */}
        <Scripts /> {/* injecting the client-side scripts when the page is downloaded on the client side */}
        <LiveReload /> {/* live reloading of the page */}
      </body>
    </html>
  );
}

//need to add some extra links
export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}
