import { ReactNode } from "react";

type PortalLayoutProps = {
  leftContainer: ReactNode;
  rightContainer: ReactNode;
};

export function PortalLayout({
  leftContainer,
  rightContainer
}: PortalLayoutProps) {
  return (
    <div className="grid grid-cols-5 w-full h-dvh">
      <div className="col-span-3 p-3">{leftContainer}</div>

      <div className="col-span-2 h-full p-10 flex items-center">
        {rightContainer}
      </div>
    </div>
  );
}
