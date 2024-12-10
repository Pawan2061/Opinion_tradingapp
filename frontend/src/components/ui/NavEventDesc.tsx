import ScrollCard from "./scrollCard";

export function EventDescNav() {
  return (
    <div className="max-w-xl lg:ml-24 space-y-2">
      <h2 className="font-semibold font-work-sans border-b-2 pb-2 ">
        All Events
      </h2>
      <div className="max-w-lg  mx-auto  gap-8 mx-automt-4">
        <div>
          <ScrollCard />
        </div>
      </div>
    </div>
  );
}
