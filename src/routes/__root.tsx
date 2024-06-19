import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, useRef } from "react";

export const Route = createRootRoute({
  component: ({ children }) => {
    const queryClient = useRef(new QueryClient());

    return (
      <QueryClientProvider client={queryClient.current}>
        <Suspense fallback="Loading...">
          <Outlet />
        </Suspense>
      </QueryClientProvider>
    );
  },
});
