import { Accordion, AccordionItem, AccordionTrigger, AccordionContent} from "@/components/shared/accordion";

async function getFAQs() {
  try {
    // Properly handle base URL with trailing slash
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const apiUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const endpoint = `${apiUrl}/mtym-api/faq`;
    
    console.log("Fetching FAQs from:", endpoint);
    
    const res = await fetch(endpoint, {
      cache: 'no-store',
      next: { revalidate: 60 } // Revalidate every minute
    });
    
    if (!res.ok) {
      console.error('Failed to fetch FAQs:', res.statusText);
      return [];
    }
    
    const data = await res.json();
    console.log("Fetched FAQs:", data.length);
    return data;
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }
}

export default async function FAQPage() {
  const faqs = await getFAQs();
  const hasDynamicFAQs = faqs && Array.isArray(faqs) && faqs.length > 0;
  
  return (
    <div className="w-full max-w-sm md:max-w-5xl px-5 xl:px-0 mt-10">
    {/* Informations */}
      <div className="space-y-6">
        <h1
          className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-5xl md:leading-[4rem]"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          FAQ
        </h1>

        <p
          className="animate-fade-up bg-clip-text text-center font-display text-base font-bold text-black opacity-0"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          Vous avez une question ? Veuillez lire les questions-réponses sur cette FAQ où vous allez trouver les réponses aux questions les plus posées par les participants de l&apos;édition précédente
        </p>

        <p
          className="animate-fade-up bg-clip-text text-center font-display text-base font-bold text-black opacity-0"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          Pour toute autre question non traitée sur le site vous pouvez nous contacter, via nos réseaux sociaux ou par email !
        </p>

        <p
          className="animate-fade-up bg-clip-text text-center font-display text-base font-bold text-black opacity-0"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          Notez cependant que nous ne pourrons répondre qu&apos;aux questions non discutées sur le site.
        </p>
      </div>

      <Accordion 
        type="single" 
        collapsible 
        className="animate-fade-up text-black opacity-0 mt-10"
        style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
      >
        {hasDynamicFAQs ? (
          faqs.map((faq) => (
            <AccordionItem key={faq.id} value={`item-${faq.id}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent className="text-gray-700">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))
        ) : (
          // Fallback static FAQs
          <>
        <AccordionItem value="item-1">
          <AccordionTrigger>Qui peut s&apos;inscrire ?</AccordionTrigger>
          <AccordionContent className="text-gray-700">
          Les élèves en <span className="font-bold">Tronc Commun/ 1ère Année Bac / 2ème Année Bac</span> (Il n&apos; y a pas de restriction d&apos;âge tant que le candidat est un étudiant de lycée lors de sa candidature)
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>Quel est le délai d&apos;inscription ?</AccordionTrigger>
          <AccordionContent className="text-gray-700">
          La date limite est fixée au <span className="font-bold">22 Septembre à 23h59, heure du Maroc.</span> N&apos;attendez pas jusqu&apos;au dernier jour pour soumettre votre candidature. Aucune exception ne sera accordée pour les candidatures tardives, quelles que soient les raisons invoquées, telles que l&apos;oubli, des problèmes de connexion internet ou toute autre excuse.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>Y-a-t-il des frais à payer pour l&apos;hébergement, la nourriture, et les activités ?</AccordionTrigger>
          <AccordionContent className="text-gray-700">
          Non, tous les frais d&apos;hébergement, de nourriture et d&apos;activités sont pris en charge pour les participants tout au long de l&apos;événement. Seuls les frais de transport sont à leur charge.
          </AccordionContent>
        </AccordionItem>
          </>
        )}
      </Accordion>
    </div>
  )
}