import { LockIcon } from "lucide-react";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { StealthModeSwitcher } from "@/components/layout/StealthModeSwitcher";
import { Toaster } from "@/components/ui/toaster";
import { Page } from "@/components/layout/Page";
import { Navigation } from "@/components/layout/Navigation";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Link } from "@/components/Link";
import { useState } from "react";

interface LayoutProps {
  /** Add an extra className to  wrapper */
  className?: string;
}

export const Layout: React.FunctionComponent<LayoutProps> = () => {
  const [stealthMode, setStealthMode] = useState(true);

  return (
    <Page
      header={
        <div className="flex justify-between p-2">
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold">
              <LockIcon /> gpgUI
            </h1>
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
