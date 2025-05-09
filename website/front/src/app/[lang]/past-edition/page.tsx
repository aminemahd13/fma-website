"use client"

import { Exam, Rocket, Solution, Trophy } from "@/components/shared/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PastEditionPage() {
  const router = useRouter();

  return (
    <div className="w-full max-w-sm md:max-w-5xl px-5 xl:px-0 mt-10">
      <div className="space-y-6">
        <h1
          className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-5xl md:leading-[4rem]"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          Past Edition <span className='bg-gradient-to-br from-sky-500 to-[#272162] inline-block text-transparent bg-clip-text'>2023</span>
        </h1>

        <div
          className="flex justify-around flex-wrap gap-6 bg-white shadow-md p-8 rounded-lg animate-fade-up opacity-0"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          <div className="space-y-4 flex flex-col md:flex-row md:space-x-4 md:space-y-0">          
            <Link href='https://drive.google.com/file/d/1oCejbBinUACzqYRnTKhBNJqwmbluoGMw/view' target="_blank">
              <div 
                className="h-[7rem] w-[8rem] bg-white border-b-4 border-red-500 flex justify-center items-center rounded-md py-2 hover:cursor-pointer shadow-lg"
              > 
                <div className="flex flex-col items-center text-center">
                <span className="text-sm">Practice exercises</span>
                <Rocket />
                </div>
              </div>
            </Link>

            <Link href='https://drive.google.com/file/d/1mGo-D44d7u3odnpkQVJcPZujWZQznTBI/view' target="_blank">
              <div 
                className="h-[7rem] w-[8rem] bg-white border-b-4 border-red-500 flex justify-center items-center rounded-md py-2 hover:cursor-pointer shadow-lg"
              > 
                <div className="flex flex-col items-center text-center">
                <span className="text-sm">Exam 2023</span>
                <Exam />
                </div>
              </div>
            </Link>

            <Link href='https://drive.google.com/file/d/13ek3AjET72NA5BSAbEWqhbk-1rDq4_p3/view' target="_blank">
              <div 
                className="h-[7rem] w-[8rem] bg-white border-b-4 border-red-500 flex justify-center items-center rounded-md py-2 hover:cursor-pointer shadow-lg"
              > 
                <div className="flex flex-col items-center text-center">
                <span className="text-sm">Solution 2023</span>
                <Solution />
                </div>
              </div>
            </Link>

            <div 
              className="h-[7rem] w-[8rem] bg-white border-b-4 border-red-500 flex justify-center items-center rounded-md py-2 hover:cursor-pointer shadow-lg"
              onClick={() => router.push('/past-edition/results')}
            > 
              <div className="flex flex-col items-center text-center">
              <span className="text-sm">Results</span>
              <Trophy />
              </div>
            </div>
          </div>
        </div>

        <div 
          className="flex justify-around flex-wrap gap-6 bg-white shadow-md p-8 rounded-lg animate-fade-up opacity-0"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          <div className="md:flex">
            <div className="w-full md:w-1/2 lg:w-1/3">
              <img 
                src="/poster_mmc_2023.jpeg" 
                alt="Poster MMC 2023" 
              />
            </div>

            <div className="w-full pt-6 md:w-1/2 lg:w-2/3 md:pl-6 md:pt-0 md:text-lg space-y-4">
              <div>
                <span className='bg-gradient-to-br from-sky-500 to-[#272162] inline-block text-transparent bg-clip-text font-semibold text-2xl'>Who are we?</span><br/>
                {" "}Math&Maroc Competition (MMC) is a mathematics competition organized by the <span className="text-[#272162] font-medium">Math&Maroc</span> association, in collaboration with the Al Khawarizmi department (<span className="text-[#272162] font-medium">Mohammed VI Polytechnic University UM6P</span>) and our official sponsor <span className="text-[#272162] font-medium">Adria B&T</span>.<br/> 
                {/* Its aim is to develop mathematical thinking, creativity, and excellence among Moroccan students. It will also be an opportunity to meet the association members and other students passionate about mathematics, participate in numerous activities and conferences, and have a unique experience at UM6P. */}
              </div>

              <div>
                <span className='bg-gradient-to-br from-sky-500 to-[#272162] inline-block text-transparent bg-clip-text font-semibold text-2xl'>Who is it for?</span><br/>
                {" "}Students in their first year of higher education in universities, preparatory classes (CPGE), and post-baccalaureate engineering schools.
              </div>

              <div>
                <span className='bg-gradient-to-br from-sky-500 to-[#272162] inline-block text-transparent bg-clip-text font-semibold text-2xl'>When?</span><br/>
                {" "}From Saturday <span className="font-semibold">April 29th 2023</span> in the evening to <span className="font-semibold">May 1st 2023</span> in the morning.
                Registration open from <span className="font-semibold">01/03/2023</span> to <span className="font-semibold">01/04/2023</span>.
              </div>

              <div>
                <span className='bg-gradient-to-br from-sky-500 to-[#272162] inline-block text-transparent bg-clip-text font-semibold text-2xl'>Where?</span><br/>
                {" "}In <span className="font-semibold">UM6P Benguérir</span>. Accommodation and meals for participants will be provided (see competition regulations).
              </div>
            </div>

          </div>
        </div>

        <h1
          className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-2xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-4xl md:leading-[4rem]"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          Vlog
        </h1>

        <div 
          className="flex justify-around flex-wrap gap-6 p-8 rounded-lg animate-fade-up opacity-0"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          <iframe width="800" height="450" src="https://www.youtube.com/embed/BC9-Ppt9dk0?si=pOcJBDvkHF7u17WZ" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        </div>

        <h1
          className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-2xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-4xl md:leading-[4rem]"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          How to register
        </h1>

        <div 
          className="flex justify-around flex-wrap gap-6 bg-white shadow-md p-8 rounded-lg animate-fade-up opacity-0"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          <ul className="space-y-4 text-gray-800 list-disc list-inside dark:text-gray-400">
            <li>Read thoroughly the <Link href='/documents/reglement.pdf' target='_blank' className="text-blue-500 underline">competition regulations</Link></li>
            <li>Fill out the <Link href='https://docs.google.com/forms/d/e/1FAIpQLScG-VhZLXyOMcGfLt7ZRBrxMTVbxiSL8jsDJgS9f7Xcc0E3XA/viewform' target='_blank' className="text-blue-500 underline">registration form</Link>.</li>
            <li>N.B.: The form requires you to upload your 2022-2023 school certificate, your CINE, your first trimester/semester 2022-2023 transcript, and the signed regulations.</li>
            <li>Please do not fill out the form until you are sure you can be present on-site.</li>
            <li>The number of spots available is <span className="font-semibold">150 people</span>. If there are more applications, the organizing committee will proceed with a selection based on the form responses (motivation question, report card, representation of all profiles). Therefore, you will only be considered definitively registered after receiving a confirmation email after the registration phase ends (after 01/04/2023). In any case, you will receive an email following up on your request; please do not follow up with us on this matter.</li>
            <li>After 01/04/2023 and until the eve of the competition, it will be possible to register on the waiting list. Candidates in this case will be contacted individually if a spot becomes available.</li>
            <li>For any questions, difficulties with travel, need for financial assistance, or special requests for exemption from the regulations, please contact us by email at math.maroc.competition@gmail.com. No special request or exemption from the regulations will be granted if it does not go through this channel.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}