import { cn } from "@/lib/utils";
import { pgp } from "@/lib/pgp";
import { useState } from "react";

export interface CommandHistoryProps {
  /** Add an extra className to CommandHistory wrapper */
  className?: string;
}

export const CommandHistory: React.FunctionComponent<CommandHistoryProps> = (
  props
) => {
  const [isOpened, setIsOpened] = useState(false);
  if (!isOpened) {
    return (
      <div className={props.className}>
        <button onClick={() => setIsOpened(true)}>List raw gpg calls</button>
      </div>
    );
  }
  const commands = pgp.history();
  return (
    <div className={cn(props.className, "max-h-40", "overflow-auto")}>
      <h1 className="flex justify-between">
        <span>Command history</span>
        <button onClick={() => setIsOpened(false)}>Close</button>
      </h1>
      <ul>
        {commands.map((command, index) => (
          <li key={index}>
            <pre>
              gpg {command.args.map((arg) => arg.toString()).join(" ")}
              {command.stdIn ? ` < ${command.stdIn}` : ""}
            </pre>
          </li>
        ))}
      </ul>
    </div>
  );
};
