import HeroSection from "@/components/home/hero-section";
import { ImageSlider } from "@/components/home/image-slider";
import TimeAndLocation from "@/components/home/time-and-location";
import { getSlideshowImages } from "@/lib/utils";
import CtaButton from "@/components/home/cta-button";
import Informations from "@/components/home/informations";
import InstagramReels from "@/components/home/instagram-reels";
import { getTranslation } from "../i18n";
import AboutSection from "@/components/home/about-section";
import TutorialSection from "@/components/home/tutorial-section";

export default async function Home({
  params
}:{
  params: { lang: string },
}) {
  // console.log('home lang', params?.lang)
  const { t } = await getTranslation(params?.lang, 'home')
  // console.log('home t', t)
  // console.log('home t(hero-title)', t('hero-title'))
  return (
    <>
      <div className="w-full max-w-4xl px-5 xl:px-0 space-y-8">
        <HeroSection heroTitle={t('hero-title')} heroSubtitle={t('hero-subtitle')} heroTitleResults={t('hero-title-results')}/>
        <TimeAndLocation />
        <CtaButton />
      </div>

      <div 
        className="h-[26rem] relative animate-fade-up opacity-0 overflow-hidden flex flex-col justify-center"
        style={{ animationDelay: "0.45s", animationFillMode: "forwards" }}
      >
        <ImageSlider
          images={getSlideshowImages()}
          direction="left"
          speed="slow"
        />
      </div>
      
      <div className="w-full max-w-sm md:max-w-7xl px-5 xl:px-0 space-y-20">
        {/* Informations */}
        <div className="space-y-6">
          <h1
            className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-5xl md:leading-[4rem]"
            style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
          >
            C&apos;est quoi, MFA ?
          </h1>

          <Informations />
        </div>

        <div className="space-y-6">
          <h1
            className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-5xl md:leading-[4rem]"
            style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
          >
            Comment participer?
          </h1>

          <TutorialSection />
        </div>

        <div className="space-y-6">
          <h1
            className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-5xl md:leading-[4rem]"
            style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
          >
            Qui sommes-nous ?
          </h1>

          <AboutSection />
        </div>

        {/* Social Media Videos */}
        <div className="space-y-6">
          <h1
            className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm [text-wrap:balance] md:text-5xl md:leading-[4rem]"
            style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
          >
            On en parle
          </h1>

          <div className="w-full bg-transparent flex flex-col items-center rounded-md space-y-12">
            <InstagramReels />
          </div>
        </div>
      </div>
    </>
  );
}