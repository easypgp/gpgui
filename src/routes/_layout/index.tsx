import { createFileRoute } from "@tanstack/react-router";

export interface IndexProps {}

export const Index: React.FunctionComponent<IndexProps> = () => {
  return (
    <>
      <h1 className="underline">💖 Hello World!</h1>
      <p>Welcome to your Electron application.</p>
    </>
  );
};
export const Route = createFileRoute("/_layout/")({
  component: Index,
});
