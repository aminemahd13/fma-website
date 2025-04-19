import { Accordion, AccordionItem, AccordionTrigger, AccordionContent} from "@/components/shared/accordion";

async function getFAQs() {
  try {
    // Properly handle base URL with trailing slash
    const baseUrl = process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:5000/mtym-api';
    const apiUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const endpoint = `${apiUrl}/faq`;
    
    console.log("Fetching FAQs from:", endpoint);
    
    const res = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        // Since this is a public endpoint, we don't need to include auth token
        // for FAQ data which should be publicly accessible
      },
      next: { revalidate: 60 } // Use only revalidate for consistent caching behavior
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
          Vous avez une question ? Veuillez lire les questions-réponses sur cette FAQ où vous allez trouver les réponses aux questions les plus posées par les participants
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
          // Show dynamic FAQs from API
          faqs.map((faq) => (
            <AccordionItem key={faq.id} value={`item-${faq.id}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent className="text-gray-700">
                <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
              </AccordionContent>
            </AccordionItem>
          ))
        ) : (
          // Show a message when no FAQs are available
          <div className="py-8 text-center">
            <p className="text-gray-500">Aucune FAQ disponible pour le moment. Veuillez revenir ultérieurement.</p>
          </div>
        )}
      </Accordion>
    </div>
  )
}