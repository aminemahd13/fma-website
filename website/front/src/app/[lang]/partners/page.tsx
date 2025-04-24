const organizers = [
  {
    key: "math-and-maroc",
    label: "Math&Maroc",
    imageHref: "/mm.png",
  },
];

const partners = [
  {
    key: "CDG",
    label: "CDG",
    imageHref: "/CDG_logo.png",
    imageHeight: "90px",
  },
  {
    key: "LM6E",
    label: "LM6E",
    imageHref: "/LM6E.png",
    imageHeight: "90px",
  },
  {
    key: "ram",
    label: "RAM",
    imageHref: "/ram.svg",
    imageHeight: "120px",
  },
  {
    key: "evalmee",
    label: "Evalmee",
    imageHref: "/evalmee_sm.png",
    imageHeight: "120px",
  },
];

export default function PartnersPage() {
  return (
    <div className="w-full max-w-sm md:max-w-7xl px-5 xl:px-0 mt-10">
      <div className="space-y-6">

        {/* ORGANISATEUR */}
        <SectionTitle text="Organisateur" />
        <div className="flex justify-around flex-wrap gap-6 p-8 rounded-lg animate-fade-up opacity-0" style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}>
          <Card
            key={organizers[0].key}
            imageHref={organizers[0].imageHref}
            imageAlt={organizers[0].label}
            imageHeight="60px"
            content={[
              <>
                <HighlightText text="Math&Maroc" /> est une association à but non lucratif créée en 2016 par de jeunes Marocains souhaitant redonner à la collectivité.
              </>,
              <>
                <span className="font-bold">Notre mission</span> est de promouvoir les mathématiques et les sciences au Maroc, et ainsi guider les jeunes vers l&apos;excellence.
              </>,
              <>
                <HighlightText text="Math&Maroc" /> organise la première édition de <span className="font-bold">FMA</span>.
              </>
            ]}
          />
        </div>

        {/* SPONSOR */}
        <SectionTitle text="Sponsor" />
        <div className="flex justify-around flex-wrap gap-6 p-8 rounded-lg animate-fade-up opacity-0" style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}>
          <Card
            key={partners[0].key}
            imageHref={partners[0].imageHref}
            imageAlt={partners[0].label}
            imageHeight={partners[0].imageHeight}
            content={[
              <>
                <HighlightText text="Caisse de Dépôt et de Gestion (CDG)" colors="from-stone-500 to-[#628c11]" /> est une institution intergénérationnelle, engagée au service du progrès économique et social du Maroc à travers la gestion de fonds d&apos;épargne et l&apos;investissement à long terme.
              </>,
              <>
                Il s&apos;agit du <span className="font-semibold">principal financeur</span> de cette édition de <HighlightText text="FMA" colors="from-sky-500 to-[#2596be]" />, et son soutien a été déterminant pour rendre cet événement possible.
              </>
            ]}
          />
        </div>

        {/* Organisme d’accueil */}
        <SectionTitle text="Organisme d&apos;accueil" />
        <div className="flex justify-around flex-wrap gap-6 p-8 rounded-lg animate-fade-up opacity-0" style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}>
          <Card
            key={partners[1].key}
            imageHref={partners[1].imageHref}
            imageAlt={partners[1].label}
            imageHeight={partners[1].imageHeight}
            content={[
              <>
                <HighlightText text="Lycée d'Excellence Mohammed VI (LM6E)" colors="from-[#937868] to-[#f44434]" /> est un établissement scientifique et technologique situé à Benguérir, intégré à l&apos;écosystème de l&apos;Université Mohammed VI Polytechnique (UM6P). Il a comme objectif de former les leaders africains de demain dans un cadre résidentiel moderne et multiculturel.
              </>,
              <>
                <HighlightText text="LM6E" colors="from-[#937868] to-[#f44434]" /> co-organise cette 1ère édition de <span className="font-bold">FMA</span> avec <HighlightText text="Math&Maroc" />
              </>
            ]}
          />
        </div>

      </div>
    </div>
  );
}

function SectionTitle({ text }: { text: string }) {
  return (
    <h1
      className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-5xl md:leading-[4rem]"
      style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
    >
      {text}
    </h1>
  );
}

function HighlightText({ text, colors = "from-sky-500 to-[#272162]" }: { text: string; colors?: string }) {
  return (
    <span className={`mb-8 bg-gradient-to-br ${colors} text-transparent bg-clip-text font-semibold`}>
      {text}
    </span>
  );
}

function Card({
  imageHref,
  imageAlt,
  imageHeight,
  content,
}: {
  key?: string;
  imageHref: string;
  imageAlt: string;
  imageHeight: string;
  content: React.ReactNode[];
}) {
  return (
    <div className="w-[16rem] md:h-[18rem] md:w-[36rem] bg-white shadow-lg border-b-4 border-red-500 md:flex justify-center items-center rounded-md">
      <div className="h-[8rem] w-[16rem] md:h-fit md:w-[18rem] flex justify-center items-center">
        <img src={imageHref} alt={imageAlt} style={{ height: imageHeight, width: "auto" }} />
      </div>
      <div className="h-fit w-[16rem] p-4 md:w-[20rem] flex flex-col space-y-2">
        {content.map((text, idx) => (
          <div key={idx}>{text}</div>
        ))}
      </div>
    </div>
  );
}
