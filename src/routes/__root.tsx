import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ConfigurationProvider } from "@/lib/configuration/ConfigurationProvider";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { logger } from "@/lib/logger/renderer";

export const Route = createRootRoute({
  component: () => {
    const queryClient = useRef(new QueryClient());

    return (
      <QueryClientProvider client={queryClient.current}>
        <Suspense fallback={<LoadingIndicator />}>
          <ConfigurationProvider>
            <Outlet />
          </ConfigurationProvider>
        </Suspense>
      </QueryClientProvider>
    );
  },
  notFoundComponent: () => {
    logger.error("Not found");
    const { t } = useTranslation("common");
    return (
      <div>
        <h1>404</h1>
        <p>{t("Not found")}</p>
        <Link to="/">{t("Go to home")}</Link>
      </div>
    );
  },
});
