import { Accordion, AccordionItem, AccordionTrigger, AccordionContent} from "@/components/shared/accordion";

export default function FAQPage() {
  return (
    <div className="w-full max-w-sm md:max-w-5xl px-5 xl:px-0 mt-10">
    {/* Informations */}
      <div className="space-y-6">
        <h1
          className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-5xl md:leading-[4rem]"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          Cérémonie d&apos;ouverture
        </h1>

        <div
          className="animate-fade-up bg-clip-text flex justify-center opacity-0"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          <iframe width="800" height="450" src="https://www.youtube.com/embed/3kRoLgYO7p8?si=F85z9JGcy2MrHrkW" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        </div>

        <div>
          
        </div>
      </div>
    </div>
  )
}