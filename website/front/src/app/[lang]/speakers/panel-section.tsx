import React from 'react'

const PanelSection = () => {
  return (
    <div
      className="bg-white shadow-md p-8 rounded-lg animate-fade-up opacity-0"
      style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
    >
      <div className="flex flex-col items-center gap-y-4 md:flex-row md:justify-around md:items-start">
        <div className="flex flex-col space-y-4 h-3/4 w-3/4 md:h-1/4 md:w-1/4">
          <>
            <img
              src='/speakers/hamid_ben_elafdil.jpeg'
            />
          </>

          <div className='flex flex-col mb-4 md:mb-0'>
            <div className='text-2xl font-semibold'>Hamid BEN ELAFDIL</div>
            <div className='text-lg font-light'>Président de Jadara Foundation</div>
            <div className='text-lg font-light'>Ancien de Centrale Paris</div>
          </div>
        </div>

        <div className="flex flex-col space-y-4 h-3/4 w-3/4 md:h-1/4 md:w-1/4">
          <div className="">
            <img
              src='/speakers/ouafae_mriouah.jpeg'
            />
          </div>

          <div className='flex flex-col mb-4 md:mb-0'>
            <div className='text-2xl font-semibold'>Ouafae MRIOUAH</div>
            <div className='text-lg font-light'>Directrice Générale de la Société Centrale de Réassurance</div>
            <div className='text-lg font-light'>Ancienne de l&apos;Ecole Mohammadia d&apos;Ingénieurs</div>
          </div>
        </div>

        <div className="flex flex-col space-y-4 h-3/4 w-3/4 md:h-1/4 md:w-1/4">
          <div className="">
            <img
              src='/speakers/mohamed_el_habib_chenguiti_ansari.jpeg'
            />
          </div>

          <div className='flex flex-col mb-4 md:mb-0'>
            <div className='text-2xl font-semibold'>Mohamed El Habib CHENGUITI ANSARI</div>
            <div className='text-lg font-light'>Partner chez OCP Solutions</div>
            <div className='text-lg font-light'>Ancien de l&apos;Ecole des Ponts et du MIT</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PanelSection
