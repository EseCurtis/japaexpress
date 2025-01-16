export function DashboardLoader() {
  return (
    <div className="grid grid-cols-5 p-3 h-dvh w-full gap-3">
      <div className="col-span-1">
        <div className="w-full h-full bg-black/10 rounded-xl animate-pulse gap-3 flex flex-col">
          <div className="w-full h-1/6 bg-black/10 rounded-xl animate-pulse"></div>
          <div className="w-full h-5/6 bg-black/10 rounded-xl animate-pulse"></div>
        </div>
      </div>
      <div className="col-span-4">
        <div className="w-full h-full bg-black/10  rounded-xl animate-pulse"></div>
      </div>
    </div>
  );
}
