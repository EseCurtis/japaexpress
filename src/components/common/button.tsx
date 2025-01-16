/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Button, Spinner } from "@material-tailwind/react";
import { FC, ReactNode } from "react";

interface ButtonDefaultProps {
  children: ReactNode;
  icon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset" | undefined;
}

export const ButtonDefault: FC<ButtonDefaultProps> = ({
  children,
  icon,
  loading = false,
  disabled = false,
  onClick,
  type
}) => {
  return (
    //@ts-ignore
    <Button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center py-4 w-full rounded-lg"
      placeholder=""
      variant="filled"
      type={type}
    >
      <div className="flex items-center w-full">
        <div className="mx-auto">{children}</div>
        {loading ? (
          //@ts-ignore
          <Spinner className="w-4 h-4" />
        ) : (
          icon
        )}
      </div>
    </Button>
  );
};
