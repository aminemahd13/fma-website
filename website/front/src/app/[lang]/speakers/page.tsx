import PanelSection from "./panel-section";
import SpeakerCard from "./speaker-card";
import { speakers } from "./speakers";

export default function SpeakersPage() {
  return (
    <div className="w-full max-w-xl md:max-w-[85rem] px-5 xl:px-0 mt-10">
      <div className="space-y-6">
        <h1
          className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-5xl md:leading-[4rem]"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          Speakers
        </h1>

        <div 
          className="bg-white shadow-md p-8 rounded-lg animate-fade-up opacity-0"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          <div className="flex flex-col gap-y-4 md:flex-row md:flex-wrap md:justify-between">
            {speakers.map(speaker => 
              <SpeakerCard {...speaker} key={speaker?.firstName.toLowerCase()} />
            )}
          </div>
        </div>

        <h1
          className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-5xl md:leading-[4rem]"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          Panel
        </h1>

        <PanelSection />
      </div>
    </div>
  )
}