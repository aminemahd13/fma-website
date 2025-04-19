import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shared/table"
import results from "./results";

export default function PastEditionPage() {
  const goldGradient = 'bg-gradient-to-r from-transparent to-[#FFCF40]';
  const silverGradient = 'bg-gradient-to-r from-transparent to-[#D3D3D3]';
  const bronzeGradient = 'bg-gradient-to-r from-transparent to-[#cd7f32]';
  const honorableGradient = 'bg-gradient-to-r from-transparent to-sky-300';

  const getGradient = (ranking: string) => {
    const parseRank = parseInt(ranking);

    if (parseRank == 1) return goldGradient;
    else if (parseRank == 2) return silverGradient;
    else if (parseRank == 3) return bronzeGradient;
    else if (parseRank >= 4 && parseRank <= 6) return honorableGradient;
    else return '';
  }

  const getPrize = (ranking: string) => {
    const parseRank = parseInt(ranking);

    if (parseRank == 1) return "Première place";
    else if (parseRank == 2) return "Deuxième place";
    else if (parseRank == 3) return "Troisième place";
    else if (parseRank <= 6) return "Mention honorable";
    else return '';
  }

  return (

    <div className="w-full md:max-w-5xl px-5 xl:px-0">
      <h1
        className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-5xl md:leading-[4rem]"
        style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
      >
        Résultats <span className='bg-gradient-to-br from-sky-500 to-[#272162] inline-block text-transparent bg-clip-text'>MTYM 2024</span>
      </h1>

      <div
          className="flex justify-around flex-wrap gap-6 md:p-8 animate-fade-up opacity-0"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Classement</TableHead>
              <TableHead>Nom de l&apos;équipe</TableHead>
              <TableHead>Membres de l&apos;équipe</TableHead>
              <TableHead className="text-right">Prix</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result: any) => (
              <TableRow key={result["Ranking"]} className={getGradient(result['ranking'])}>
                <TableCell className="font-medium">{result["ranking"]}</TableCell>
                <TableCell>{result['teamName']}</TableCell>
                <TableCell>
                  <ul>
                    {result['teamMembers'].map((member: string, index: number) => 
                      <li key={index} className="list-disc">
                        {member}
                      </li>
                    )}
                  </ul>
                  </TableCell>
                <TableCell className="text-right">{getPrize(result['ranking'])}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>      
    </div>
  )
}

