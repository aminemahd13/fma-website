import { Separator } from "@/components/shared";

export const speakers = [
  {
    firstName: 'Salim',
    lastName: 'TAYOU',
    position: 'Assistant Professor at Dartmouth College',
    details: '',
    imageUrl: '/speakers/salim_tayou.jpg',
    portfolioUrl: 'https://people.math.harvard.edu/~tayou/',
  },
  {
    firstName: 'Rida',
    lastName: 'LARAKI',
    position: 'Director of Research at CNRS & Professor at UM6P',
    details: '',
    imageUrl: '/speakers/rida_laraki.jpg',
    portfolioUrl: 'https://sites.google.com/site/ridalaraki/',
  },
  {
    firstName: 'Omar',
    lastName: 'EL HOUSNI',
    position: 'Assistant Professor at Cornell University',
    details: '',
    imageUrl: '/speakers/omar_el_housni.jpg',
    portfolioUrl: 'https://www.engineering.cornell.edu/faculty-directory/omar-el-housni',
  },
  {
    firstName: 'Rachid',
    lastName: 'GUERRAOUI',
    position: 'Professor at EPFL',
    details: '',
    imageUrl: '/speakers/rachid_guerraoui.jpg',
    portfolioUrl: 'https://people.epfl.ch/rachid.guerraoui?lang=en',
  },
];

export const SpeakerDetails = ({
  name,
}:{
  name: string
}) => {
  switch(name) {
    case 'salim':
      return <>
        <p>Pr. Salim is currently an Assistant Professor at Dartmouth College (an Ivy League university). </p>
        <p>Previously, he was a fellow in the Mathematics Department at Harvard University. He graduated from École Normale Supérieure de Paris-Ulm and he holds a PhD in Mathematics from Université Paris-Sud. Salim&apos;s research focuses on number theory and algebraic geometry.</p>
        <p>He has received several accolades, including a Bronze Medal at the 2010 International Mathematical Olympiad in Astana and the first prize in Mathematics at the Concours Général des Sciences et Techniques.</p>
        <p>He was recently nominated by his Majesty the King as a member of Hassan II Academy of Science and Technology.</p>
      </>
    
    case 'rida': 
      return <>
        <p>Pr. Laraki is a professor at Université Mohammed VI Polytechnique and the founder of the Moroccan Center of Game Theory.</p>
        <p>He earned a master&apos;s degree from École Polytechnique and a PhD in Mathematics from Université Pierre et Marie Curie, and received two honorable mentions in IMO 1992 and 1993.</p>
        <p>He has held prestigious research and teaching positions at École Polytechnique, University of Liverpool, and as a Director of Research at CNRS.</p>
        <p>An expert in game theory, his work intersects economic theory, optimization, and operations research. Notably, he co-invented the Majority Judgment voting system with the late Michel Balinski</p>
      </>

    case 'omar': 
      return <>
        <p>Pr. El Housni is an assistant professor in Operations Research at Cornell University.</p>
        <p>He holds a master&apos;s degree from Ecole polytechnique and a PhD in Operations Research from Columbia University.</p>
        <p>He has taken part in the 2010 International Mathematics Olympiads (IMO), where he earned an honorable mention, and in the 2023 IMO in Japan as a Senior Coordinator.</p>
        <p>Throughout his career, he has led several industrial projects with companies such as Uber and Amazon, and his work has been featured in several top conferences and journals. His work focuses on discrete optimization, with a focus on matching and assortment optimization.</p>
      </>

    case 'rachid': 
      return <>
        <p>Pr. Guerraoui is a distinguished computer scientist at EPFL in Lausanne and a leading expert in distributed computing and machine learning.</p>
        <p>He has been affiliated with several prestigious institutions, including the Collège de France, the Massachusetts Institute of Technology (MIT) and UM6P College of Computing.</p>
        <p>Throughout his illustrious career, he has co-authored numerous groundbreaking papers and books and received multiple awards, such as the Google Focused Award and the 10-Years Best Paper Award at the ACM Middleware conference.</p>
        <p>In 2019, he was appointed by His Majesty King Mohammed VI as a member of the Special Committee on the Development Model.</p>
      </>
    
    default: 
      return ''
  }
}

export const TalkAbstract = ({
  name,
}:{
  name: string
}) => {
  switch(name) {
    case 'salim':
      return <>
        <p className="text-lg md:text-xl">Title: <span className="font-semibold">Geometry and arithmetic of algebraic varieties.</span></p>
        <Separator />
        <p>Algebraic varieties are traditionally defined as sets of solutions of algebraic equations. They are central objects of study in algebraic geometry and number theory with far-reaching applications to other fields, such as cryptography, machine learning, general relativity, and more. </p>
        <p>This talk will give a panoramic overview of algebraic varieties, starting from the early developements with the Greeks, up to the most recent advances, as well as some open problems.</p>
      </>
    
    case 'rida':
      return <>
        <p className="text-lg md:text-xl">Title: <span className="font-semibold">Mathematics in Game Theory.</span></p>
        <Separator />
        <p>This talk will delve into some fundamental results in game theory, highlighting the diverse mathematical tools employed in this field. We will provide detailed expositions of significant theorems and their proofs. Specifically, the talk will include:</p>
        <ul className="list-disc ml-4">
          <li>The von Neumann-Morgenstern minmax theorem, presented with two proofs: one using duality in linear programming and the other employing a learning procedure.</li>
          <li>The Nash equilibrium existence theorem, with a proof based on Brouwer&apos;s fixed point theorem.</li>
          <li>A strategic characterization of +1 index equilibria, along with an outline of the proof.</li>
        </ul>
        <p>This aims to showcase the richness and versatility of mathematical approaches in game theory, appealing to both novices and experts in the field.</p>
      </>

    case 'omar': 
      return <>
        <p className="text-lg md:text-xl">Title: <span className="font-semibold">Matchings: From Graph Theory to Real-World Applications.</span></p>
        <Separator />
        <p>In this talk, we delve into the fascinating world of matchings, a fundamental concept in graph theory with wide-ranging applications in various fields.</p>
        <ul className="list-disc ml-4">
          <li>We will start by defining matchings in graph theory and exploring their mathematical properties.</li>
          <li>Our journey will then take us through several practical applications, starting with matchings in ride-sharing platforms. We will discuss the design of algorithms for minimum weighted matching and two-stage robust matching, emphasizing their importance in optimizing ride-sharing services.</li>
          <li>Next, we will explore the stable matching problem and its elegant solution via the Gale-Shapley algorithm, which has revolutionized the way medical residents are matched to hospitals and students to schools.</li>
          <li>Finally, we will investigate online matchings with preferences in two-sided platforms, such as accommodation, carpooling, and freelancing platforms, where both sides have preferences and efficient, fair matchings are crucial.</li>
        </ul>
      </>
    
    default: 
      return undefined
  }
}