import Image from "next/image";
import { LogoWordMark } from "../common/logo";

export function BrandShowcase() {
  return (
    <div className="h-full w-full bg-black rounded-3xl relative overflow-clip">
      <Image
        src="/images/delivery-2.jpg"
        width={300}
        height={500}
        alt={"delivery images"}
        className="absolute top-0 left-0 w-full h-full object-cover opacity-70"
      />
      <div className="bg-gradient-to-t from-[#161620] to-transparent w-full h-full top-0 left-0 absolute"></div>

      <div className="w-full h-full z-10 relative flex flex-col">
        <div className="grid grid-cols-6 p-5">
          <div className="col-span-2 h-12">
            <LogoWordMark variant="white" />
          </div>
        </div>

        <div className="w-full flex flex-col items-center h-auto bg-red mt-auto text-white p-7 py-12 pb-20 gap-5">
          <h3 className="text-3xl font-bold text-center">
            Company Related <br /> Shipping & Deliveries
          </h3>
          <span className="p-7 py-0.5 bg-accent rounded-full"></span>
        </div>
      </div>
    </div>
  );
}
