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

        <AccordionItem value="item-4">
          <AccordionTrigger>Est-ce que nos parents peuvent nous accompagner pour les 4 jours de la compétition ?</AccordionTrigger>
          <AccordionContent className="text-gray-700">
          Non, c&apos;est réservé qu&apos;aux participants ! Mais vos parents pourront suivre vos exploits sur nos réseaux sociaux ! 
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger>Où pourrais-je vous contacter si j&apos;ai une demande spéciale, ou une autre question ?</AccordionTrigger>
          <AccordionContent className="text-gray-700">
          Vous pouvez envoyer un email à la boîte mail suivante: <span className="text-blue-500">math.maroc.mtym@gmail.com</span>.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-6">
          <AccordionTrigger>Pourrais-je participer même si je n&apos;ai pas encore de carte d&apos;identité nationale ?</AccordionTrigger>
          <AccordionContent className="text-gray-700">
          Oui, il suffit de mettre une preuve d&apos;identité qui contient une photo; exemples: attestation de scolarité, carte étudiant, carte de club, carte de fondation…
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-7">
          <AccordionTrigger>Est-ce que la compétition est réservée aux élèves du lycée publique ?</AccordionTrigger>
          <AccordionContent className="text-gray-700">
          Non, tous les élèves du lycée peuvent s&apos;inscrire incluant lycée publique, privé ou bien mission étrangère.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-8">
          <AccordionTrigger>Les élèves du tronc commun doivent-ils fournir leur relevé de note de 3ème année collège ?</AccordionTrigger>
          <AccordionContent className="text-gray-700">
          Oui, les élèves du tronc commun doivent soumettre leur bulletin de 3ème année collège.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-9">
          <AccordionTrigger>Faut-il une lettre de motivation lors de l&apos;inscription ?</AccordionTrigger>
          <AccordionContent className="text-gray-700">
          Non, les lettres de motivation ne seront pas prises en considération. Par contre dans le formulaire d&apos;inscription il sera demandé d&apos;inclure une motivation de max 300 mots.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-10">
          <AccordionTrigger>Que faire si je n&apos;ai pas encore reçu mon relevé de notes ?</AccordionTrigger>
          <AccordionContent className="text-gray-700">
          Normalement, vous avez tous le bulletin de l&apos;année dernière, si vous l&apos;avez perdu il est de votre responsabilité de solliciter votre école pour une copie. En cas de preuve sérieuse on peut accepter un bulletin d&apos;une année précédente.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-11">
          <AccordionTrigger>Pourrais-je participer à distance ?</AccordionTrigger>
          <AccordionContent className="text-gray-700">
          Non, en vous inscrivant vous vous engagez à venir en personne à Al Akhawayn University à Ifrane (AUI) et y rester pendant toute la durée de l&apos;événement.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-12">
          <AccordionTrigger>Dois-je obligatoirement avoir une équipe pour participer ?</AccordionTrigger>
          <AccordionContent className="text-gray-700">
          Oui, aucune candidature sans équipe ne sera acceptée. Les équipes avec 1 ou 2 personnes ne seront pas convoquées au test de sélection. Aucune exception ne sera accordée. 
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-13">
          <AccordionTrigger>Est-ce qu&apos;il faut nécessairement que je sois avec une équipe de mon lycée / de ma ville ?</AccordionTrigger>
          <AccordionContent className="text-gray-700">
          Non, vous pouvez rejoindre une équipe qui n&apos;est pas du même lycée/ville que la vôtre.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-14">
          <AccordionTrigger>Est-ce que deux équipes du même lycée peuvent toutes les deux participer ?</AccordionTrigger>
          <AccordionContent className="text-gray-700">
          Oui, ya aucune limite sur des équipes provenant du même lycée.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-15">
          <AccordionTrigger>Dans une même équipe peut-il y avoir des élèves de filières différentes (ex : sciences mathématiques et sciences physiques) ?</AccordionTrigger>
          <AccordionContent className="text-gray-700">
          Oui, il n&apos;y a pas de restriction sur les branches des élèves. 
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-16">
          <AccordionTrigger>Est ce qu&apos;un membre de l&apos;équipe peut être refusé ?</AccordionTrigger>
          <AccordionContent className="text-gray-700">
          Un membre de l&apos;équipe peut être refusé seulement s&apos;il y a un problème dans son dossier de candidature.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-17">
          <AccordionTrigger>Comment savoir si mon équipe a été sélectionné ?</AccordionTrigger>
          <AccordionContent className="text-gray-700">
          Vous serez notifié par email et on vous ajoutera dans un groupe whatsapp, pensez à bien vérifier que vous avez mis le bon numéro de téléphone qui contient whatsapp. 
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-18">
          <AccordionTrigger>Quand est-ce que je pourrais si mon équipe est sélectionnée?</AccordionTrigger>
          <AccordionContent className="text-gray-700">
          Les résultats de sélection seront envoyés au plus tard début Octobre. 
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-19">
          <AccordionTrigger>A quel type de problèmes dois-je m&apos;attendre ? Quelles sont les notions dont j&apos;aurais besoin ?</AccordionTrigger>
          <AccordionContent className="text-gray-700">
          Les problèmes sont très différents de ce que vous avez l&apos;habitude à l&apos;école. Référez vous aux problèmes de l&apos;année dernière disponible dans (la page édition 2023-2024).
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-20">
          <AccordionTrigger>Est-ce qu&apos;il y aura des problèmes différents selon le niveau scolaire ?</AccordionTrigger>
          <AccordionContent className="text-gray-700">
          Non, tous les candidats auront affaire aux mêmes problèmes. 
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-21">
          <AccordionTrigger>Est-ce qu&apos;il y aura des certificats de participation ?</AccordionTrigger>
          <AccordionContent className="text-gray-700">
          Oui, il y aura des certificats aux gagnants ainsi qu&apos;aux participants.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-22">
          <AccordionTrigger>Quels sont les prix à gagner ?</AccordionTrigger>
          <AccordionContent className="text-gray-700">
          Les prix seront annoncés avant la compétition sur nos réseaux sociaux.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-23">
          <AccordionTrigger>Quelle langue doit être utilisée lors de la compétition ?</AccordionTrigger>
          <AccordionContent className="text-gray-700">
          Vous êtes libre d&apos;utiliser n&apos;importe quelle langue pendant les préparations. Par contre les rendus doivent être en français ou anglais.  
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-24">
          <AccordionTrigger>Va-t-on passer des tests type examen lors de la compétition ?</AccordionTrigger>
          <AccordionContent className="text-gray-700">
          Non y&apos;aura pas d&apos;examen durant la compétition. Mais un rendu intermédiaire et un rendu final seront demandés à un moment donné. Les détails seront communiqués par mail ainsi que par le groupe whatsapp qui sera créé pour les participants. 
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-25">
          <AccordionTrigger>Doit-on choisir une personne pour faire la présentation ?</AccordionTrigger>
          <AccordionContent className="text-gray-700">
          Le jour de la présentation, le jury vous demandera de choisir une personne pour faire la présentation. Mais c&apos;est mieux de se préparer à l&apos;avance et de désigner par exemple une personne par problème. 
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-26">
          <AccordionTrigger>Comment se fait le classement des équipes si elles arrivent toutes à résoudre les problèmes ?</AccordionTrigger>
          <AccordionContent className="text-gray-700">
          Le but n&apos;est pas que de résoudre les problèmes mais il faut aussi réussir à bien jouer les rôles de défense, attaque et rapport. Une session zoom sera organisé avant l&apos;événement pour mettre tout ça au clair.  
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-27">
          <AccordionTrigger>Est-ce que deux équipes peuvent s&apos;entraider dans la résolution des problèmes ?</AccordionTrigger>
          <AccordionContent className="text-gray-700">
          Non, il est strictement interdit d&apos;échanger des solutions entre équipes. En faisant ça vous risquez d&apos;être disqualifié et black listé de math&maroc. C&apos;est bien dommage parce que vous n&apos;êtes qu&apos;au lycée et Maths&Maroc organisera des événements pour vous jusqu&apos;au BAC+4.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}