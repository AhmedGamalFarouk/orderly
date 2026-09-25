import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";
import Container from "../components/Container";

export default function NotFoundPage() {
  const error = useRouteError();
  const isNotFound = !error || (isRouteErrorResponse(error) && error.status === 404);

  return (
    <Container>
      <div className="my-16 p-8 text-center bg-white rounded-2xl border border-base-200 shadow-xs max-w-md mx-auto">
        <h1 className="font-heading text-3xl font-bold text-base-content mb-2">
          {isNotFound ? "Page not found" : "Something went wrong"}
        </h1>
        <p className="font-body text-sm text-neutral mb-6">
          {isNotFound
            ? "The page you are looking for does not exist or has moved."
            : "An unexpected error occurred. Please try again."}
        </p>
        <Link to="/" className="btn btn-primary btn-sm rounded-xl">
          Back to Orderly
        </Link>
      </div>
    </Container>
  );
}
