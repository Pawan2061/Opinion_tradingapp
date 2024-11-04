import ScrollCard from "./scrollCard";

export function EventDescNav() {
  return (
    <div className="max-w-xl">
      <h2 className="font-semibold font-work-sans border-b-2 pb-2">
        All Events
      </h2>
      <div className="grid grid-cols-2 gap-3 mt-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index}>
            <ScrollCard />
          </div>
        ))}
      </div>
    </div>
  );
}
