import Image from 'next/image';
import { Section } from '@/components/layout/Section';
import { SiteContainer } from '@/components/layout/SiteContainer';

export const metadata = { title: "Message from the President" };

const paragraphs = [
  'Dear Members, Partners, Government Institutions, Development Partners, and Friends,',
  'It is my great honor and privilege to welcome you on behalf of the Institution of Engineers of Somalia (IES).',
  'The Institution of Engineers of Somalia (IES) serves as the national professional body dedicated to promoting engineering excellence, advancing professional standards, and supporting the sustainable development of our country. As Somalia continues its journey of reconstruction and economic transformation, engineers have a vital responsibility to design, build, and maintain the infrastructure that will improve the quality of life for present and future generations.',
  'Today, Somalia stands at a defining moment. Our nation requires resilient roads, bridges, water supply systems, ports, airports, renewable energy, public buildings, and modern urban infrastructure. Engineers are at the center of this transformation, providing innovative, safe, and sustainable solutions that contribute to national development and economic growth.',
  'At IES, we are committed to strengthening the engineering profession through continuous professional development, technical excellence, ethical practice, research, innovation, and knowledge sharing. We will continue to provide opportunities for engineers to enhance their skills through training, seminars, conferences, mentorship programs, and collaboration with universities, government institutions, and industry partners.',
  'The Institution also remains committed to supporting young engineers and engineering students by creating pathways for professional growth, mentorship, leadership development, and international exposure. Investing in the next generation of engineers is essential for building a stronger and more prosperous Somalia.',
  'Engineering is increasingly a global profession. Therefore, IES will continue expanding partnerships with regional and international engineering organizations to promote professional recognition, knowledge exchange, capacity building, and collaboration on issues of mutual interest. Through these partnerships, Somali engineers will gain greater opportunities to contribute to regional and global engineering initiatives while bringing international best practices home.',
  'Professional ethics, competence, and public trust remain the foundation of our Institution. We encourage every member to uphold the highest standards of integrity, accountability, and professionalism in all engineering activities, ensuring that our work contributes positively to society and protects public safety.',
  'As we look toward the future, I invite every member to actively participate in the growth of our Institution. Together, we can strengthen the engineering profession, support national development, promote innovation, and contribute to achieving Somalia’s vision for sustainable development.',
  'I extend my sincere appreciation to our members, partners, government institutions, universities, development organizations, and all stakeholders who continue to support the Institution of Engineers, Somalia. Your collaboration is essential to build a stronger profession and a better future for our nation.',
  'Together, let us build a resilient Somalia through engineering excellence, innovation, professionalism, and collaboration.',
];

export default function PresidentMessagePage() {
  return (
    <>
      <section className="bg-gradient-to-br from-[#022D5A] to-[#035CB3] py-14 text-white">
        <SiteContainer className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-200">Message from the President</p>
          <h1 className="mx-auto mt-3 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl">
            Eng. Omar Abdi Arab, CE
          </h1>
          <p className="mt-2 text-sm text-blue-100 sm:text-base">
            President, The Institution of Engineers of Somalia (IES)
          </p>
        </SiteContainer>
      </section>

      <Section spacing="relaxed">
        <SiteContainer>
          <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
            <aside className="h-fit lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="relative aspect-square w-full bg-slate-100">
                  <Image
                    src="/Presedent-Arab.png"
                    alt="Eng. Omar Abdi Arab, CE - President, IES"
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div className="p-5">
                  <p className="text-sm font-bold text-[#022D5A]">Eng. Omar Abdi Arab, CE</p>
                  <p className="mt-0.5 text-xs text-slate-500">President — IES</p>
                  <p className="mt-3 border-l-2 border-[#48C184] pl-3 text-xs italic leading-relaxed text-slate-600">
                    &ldquo;Engineering Sustainable Development through Excellence, Innovation, Leadership, and Collaboration.&rdquo;
                  </p>
                  <div className="mt-4 flex flex-col gap-1.5 text-xs">
                    <a href="mailto:omararb@iesomalia.org.so" className="flex items-center gap-2 text-slate-600 transition-colors hover:text-[#035CB3]">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                      omararb@iesomalia.org.so
                    </a>
                    <a href="mailto:info@iesomalia.org.so" className="flex items-center gap-2 text-slate-600 transition-colors hover:text-[#035CB3]">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                      info@iesomalia.org.so
                    </a>
                  </div>
                </div>
              </div>
            </aside>

            <article className="flex flex-col gap-4 text-sm leading-relaxed text-slate-700 sm:text-base">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <div className="mt-6 border-t border-slate-200 pt-5">
                <p className="text-sm font-bold text-[#022D5A]">Eng. Omar Abdi Arab</p>
                <p className="text-sm text-slate-600">President, CE</p>
                <p className="text-sm text-slate-600">The Institution of Engineers of Somalia (IES)</p>
              </div>
            </article>
          </div>
        </SiteContainer>
      </Section>
    </>
  );
}
