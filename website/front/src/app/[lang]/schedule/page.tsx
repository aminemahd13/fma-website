import ScheduleCarousel from "./components/schedule-carousel";

export default function SchedulePage() {
  return (
    <div className="w-full max-w-md md:max-w-[85rem] px-5 xl:px-0 mt-10">
      <div className="space-y-6">
        <h1
          className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-5xl md:leading-[4rem]"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          <span className='mb-8 bg-gradient-to-br from-sky-500 to-[#272162] inline-block text-transparent bg-clip-text'>Programme</span>
        </h1>

        <div
          className="animate-fade-up bg-clip-text text-center font-display text-base font-bold text-black opacity-0"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          <div className="flex flex-col-reverse md:flex-row space-x-10">
            <ScheduleCarousel />
            <div className="flex flex-col space-y-1 text-sm mt-8">
              <div className="p-1 bg-red-400">Contest</div>
              <div className="p-1 bg-orange-400">Talks</div>
              <div className="p-1 bg-green-400">Various activities</div>
              <div className="p-1 bg-purple-200">Meals</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}