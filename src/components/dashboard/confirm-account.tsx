/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "@/hooks/api/use-auth";
import { useConfirmAccount } from "@/hooks/api/use-confirm-account";
import { useRequestConfirmation } from "@/hooks/api/use-request-confirmation";
import { useState } from "react";
import { toast } from "react-toastify";
import { ButtonDefault } from "../common/button";
import { InputDefault } from "../common/input";
import { PortalLayout } from "../layouts/portal-layout";
import { BrandShowcase } from "../portal/brand-showcase";

export function ConfirmAccount() {
  const { user, refreshAccessToken } = useAuth();
  const { mutateAsync, isPending } = useRequestConfirmation();
  const { mutateAsync: confirmMutateAsync, isPending: confirmIsPending } =
    useConfirmAccount();
  const [sentCode, setSentCode] = useState(false);
  const [email] = useState(user?.email);
  const [otp, setOTP] = useState("");

  const handleCodeRequest = async () => {
    try {
      await mutateAsync({ email });
      toast("Confirmation Code Sent!", {
        type: "success"
      });
      setSentCode(true);
    } catch (error: any) {
      const responseError = error.response?.data?.msg;
      toast(responseError, {
        type: "error"
      });
    }
  };

  const handleConfirmationRequest = async () => {
    try {
      await confirmMutateAsync({ email, otp: Number(otp) });
      toast("Account Confirmed!", {
        type: "success"
      });
      await refreshAccessToken();
    } catch (error: any) {
      const responseError = error.response?.data?.msg;
      toast(responseError, {
        type: "error"
      });
    }
  };

  return (
    <PortalLayout
      leftContainer={<BrandShowcase />}
      rightContainer={
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div>
            <h3 className="text-3xl font-bold">Confirm Account</h3>
            <p>To proceed further you have to confirm your account</p>

            <div className="gap-3 flex flex-col pt-7">
              <InputDefault className="" value={email} disabled />
              {sentCode && (
                <InputDefault
                  label="Confirmation Code"
                  className=""
                  value={otp}
                  onChange={(e) => setOTP(e.currentTarget.value)}
                />
              )}
              <ButtonDefault
                loading={isPending || confirmIsPending}
                onClick={
                  sentCode ? handleConfirmationRequest : handleCodeRequest
                }
              >
                {!sentCode ? "Request OTP Code" : "Confirm Account"}
              </ButtonDefault>
            </div>
          </div>
        </div>
      }
    />
  );
}
