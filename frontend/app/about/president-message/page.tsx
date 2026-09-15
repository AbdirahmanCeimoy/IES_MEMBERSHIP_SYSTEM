import { PageHero } from '@/components/layout/PageHero';
import { Section } from '@/components/layout/Section';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { routes } from '@/config/routes';

export const metadata = { title: "President's Message" };

const paragraphs = [
  'Dear Members, Partners, Government Institutions, Development Partners, and Friends,',
  'It is my great honor and privilege to welcome you on behalf of the Institution of Engineers of Somalia (IES).',
  'The Institution of Engineers of Somalia (IES) serves as the national professional body dedicated to promoting engineering excellence, advancing professional standards, and supporting the sustainable development of our country. As Somalia continues its journey of reconstruction and economic transformation, engineers have a vital responsibility to design, build, and maintain the infrastructure that will improve the quality of life for present and future generations.',
  'Today, Somalia stands at a defining moment. Our nation requires resilient roads, bridges, water supply systems, ports, airports, renewable energy, public buildings, and modern urban infrastructure. Engineers are at the centre of this transformation, providing innovative, safe, and sustainable solutions that contribute to national development and economic growth.',
  'At IES, we are committed to strengthening the engineering profession through continuous professional development, technical excellence, ethical practice, research, innovation, and knowledge sharing. We will continue to provide opportunities for engineers to enhance their skills through training, seminars, conferences, mentorship programs, and collaboration with universities, government institutions, and industry partners.',
  'The Institution also remains committed to supporting young engineers and engineering students by creating pathways for professional growth, mentorship, leadership development, and international exposure. Investing in the next generation of engineers is essential for building a stronger and more prosperous Somalia.',
  'Engineering is increasingly a global profession. Therefore, IES will continue expanding partnerships with regional and international engineering organizations to promote professional recognition, knowledge exchange, capacity building, and collaboration on issues of mutual interest.',
  'Professional ethics, competence, and public trust remain the foundation of our Institution. We encourage every member to uphold the highest standards of integrity, accountability, and professionalism in all engineering activities.',
  'As we look toward the future, I invite every member to actively participate in the growth of our Institution. Together, we can strengthen the engineering profession, support national development, promote innovation, and contribute to achieving Somalia\'s vision for sustainable development.',
  'I extend my sincere appreciation to our members, partners, government institutions, universities, development organizations, and all stakeholders who continue to support the Institution of Engineers of Somalia. Your collaboration is essential to build a stronger profession and a better future for our nation.',
  'Together, let us build a resilient Somalia through engineering excellence, innovation, professionalism, and collaboration.',
];

export default function PresidentMessagePage() {
  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About', href: routes.about.root }, { label: "President's Message" }]} />}
        eyebrow="Message from the President"
        title="Building a stronger profession, together"
        description="Eng. Omar Abdi Arab, CE - President, The Institution of Engineers of Somalia (IES)"
      />
      <Section>
        <div className="grid gap-8 lg:grid-cols-[2fr_5fr]">
          <Card padded className="h-fit lg:sticky lg:top-24">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0047AB] text-lg font-bold text-white">OA</div>
              <div>
                <p className="text-sm font-semibold text-[#082B55]">Eng. Omar Abdi Arab</p>
                <p className="text-xs text-slate-500">President, CE - IES</p>
              </div>
            </div>
            <p className="mt-3 text-xs italic text-slate-600">
              &ldquo;Engineering Sustainable Development through Excellence, Innovation, Leadership and Collaboration.&rdquo;
            </p>
            <div className="mt-3 flex flex-col gap-1 text-xs">
              <a href="mailto:omararb@iesomalia.org.so" className="text-[#0047AB] hover:underline">omararb@iesomalia.org.so</a>
              <a href="mailto:info@iesomalia.org.so" className="text-[#0047AB] hover:underline">info@iesomalia.org.so</a>
            </div>
          </Card>

          <article className="flex flex-col gap-4 text-sm leading-relaxed text-slate-700 sm:text-base">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p className="mt-2 text-sm text-slate-500">Eng. Omar Abdi Arab · President, CE · The Institution of Engineers of Somalia (IES)</p>
          </article>
        </div>
      </Section>
    </>
  );
}
