export default function PrizesPage() {
  return (
    <div className="w-full max-w-sm md:max-w-5xl px-5 xl:px-0 mt-10">
      <div className="space-y-6">
        <h1
          className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-5xl md:leading-[4rem]"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          Prizes
        </h1>

        <p
          className="animate-fade-up bg-clip-text text-center font-display text-base font-bold text-black opacity-0 mt-12"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          <div className="flex justify-center">
            <img 
              src="/prizes.jpg" 
              alt="Prizes"
              width={700}
            />
          </div>
          
        </p>
      </div>
    </div>
  )
}