import { LockIcon } from "lucide-react";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { StealthModeSwitcher } from "@/components/layout/StealthModeSwitcher";
import { Toaster } from "@/components/ui/toaster";
import { Page } from "@/components/layout/Page";
import { Navigation } from "@/components/layout/Navigation";
import { Outlet, createFileRoute, Link } from "@tanstack/react-router";
import { useConfiguration } from "@/lib/configuration/use-configuration";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

interface LayoutProps {
  /** Add an extra className to  wrapper */
  className?: string;
}

export const Layout: React.FunctionComponent<LayoutProps> = () => {
  const configuration = useConfiguration();
  const queryClient = useQueryClient();
  const [stealthMode, setStealthMode] = useState(
    configuration.get("startInStealthMode")
  );
  useEffect(() => {
    window.pgp.changeContext(stealthMode ? "stealth" : "default");
    // Invalidatea any PGP releated query
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[0] === "pgp",
    });
  }, [stealthMode, queryClient]);

  return (
    <Page
      className={cn(
        stealthMode && "dark",
        "dark:*:bg-slate-500 dark:*:text-white"
      )}
      header={
        <div className="flex justify-between p-2">
          <div className="flex items-center space-x-2">
            <Link to="/">
              <h1 className="text-3xl font-bold">
                <LockIcon /> gpgUI
              </h1>
            </Link>
            <Navigation />
          </div>
          <div className="flex items-center space-x-2">
            <StealthModeSwitcher
              isStealthModeActive={stealthMode}
              onChange={setStealthMode}
            />
            <LanguageSwitcher />
          </div>
        </div>
      }
    >
      <Outlet />
      <Toaster />
    </Page>
  );
};

export const Route = createFileRoute("/_layout")({
  component: Layout,
});
