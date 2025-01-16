/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "@/hooks/api/use-auth";
import { useRegisterCompany } from "@/hooks/api/use-register-company";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { toast } from "react-toastify";
import { ButtonDefault } from "../common/button";
import { InputDefault } from "../common/input";
import { PortalLayout } from "../layouts/portal-layout";
import { BrandShowcase } from "../portal/brand-showcase";

export function RegisterCompany() {
  const { refreshAccessToken } = useAuth();
  const { mutateAsync, isPending } = useRegisterCompany();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleRegistrationRequest = async () => {
    try {
      await mutateAsync({ name, phone, address });
      toast("Company registered!", {
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
        <div className="flex flex-col items-center justify-center h-full text-center px-7">
          <div className="flex items-center justify-center mb-10">
            <div className="bg-black font-bold uppercase text-white text-4xl p-3 rounded-full h-20 w-20 flex items-center justify-center">
              {name?.[0] || <FaUser />}
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold">Register Company</h3>
            <p>
              To proceed further you have to register you company to handle your
              logistics operations
            </p>

            <div className="gap-3 flex flex-col pt-7">
              <InputDefault
                className=""
                placeholder="Company Name"
                label="Company Name"
                onChange={(e) => {
                  setName(e.currentTarget.value);
                }}
              />

              <div className="flex gap-3">
                <InputDefault
                  className=""
                  label="Phone Number"
                  onChange={(e) => {
                    setPhone(e.currentTarget.value);
                  }}
                />
                <InputDefault
                  className=""
                  label="Company Address"
                  onChange={(e) => {
                    setAddress(e.currentTarget.value);
                  }}
                />
              </div>

              <ButtonDefault
                onClick={handleRegistrationRequest}
                loading={isPending}
              >
                Register Company
              </ButtonDefault>
            </div>
          </div>
        </div>
      }
    />
  );
}
