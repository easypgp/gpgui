import React, { Suspense } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";

const LoadingPanel: React.FunctionComponent = () => {
  return <div>Loading...</div>;
};

export interface PageProps {
  /** Add an extra className to Page wrapper */
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  leftPanel?: React.ReactNode;
  rightPanel?: React.ReactNode;
  children: React.ReactNode;
}

export const Page: React.FunctionComponent<PageProps> = (props) => {
  return (
    <div
      className={cn(
        [
          "flex flex-col justify-stretch align-items-stretch h-dvh w-dvw overflow-hidden",
        ],
        props.className
      )}
    >
      {props.header ? (
        <div className={cn(["border-b border-gray-200"])}>{props.header}</div>
      ) : (
        ""
      )}
      <ResizablePanelGroup direction="horizontal" className="grow">
        {props.leftPanel && (
          <>
            <ResizablePanel defaultSize={20}>
              <Suspense fallback={<LoadingPanel />}>{props.leftPanel}</Suspense>
            </ResizablePanel>
            <ResizableHandle />
          </>
        )}
        <ResizablePanel>
          <Suspense fallback={<LoadingPanel />}>
            <div className="h-full w-full">{props.children}</div>
          </Suspense>
        </ResizablePanel>
        {props.rightPanel && (
          <>
            <ResizableHandle />
            <ResizablePanel defaultSize={20}>
              <Suspense fallback={<LoadingPanel />}>
                {props.rightPanel}
              </Suspense>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
      {props.footer ? <div>{props.footer}</div> : ""}
    </div>
  );
};
