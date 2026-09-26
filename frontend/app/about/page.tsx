import { Section } from '@/components/layout/Section';
import { SiteContainer } from '@/components/layout/SiteContainer';

export const metadata = { title: 'About Us' };

const coreValues = [
  {
    label: 'Integrity',
    icon: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </>
    ),
  },
  {
    label: 'Inclusivity',
    icon: (
      <>
        <circle cx="12" cy="4" r="2" />
        <circle cx="4.5" cy="9" r="2" />
        <circle cx="19.5" cy="9" r="2" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="17" cy="18" r="2" />
        <path d="M13.7 5.3l4.3 2.2" />
        <path d="M10.3 5.3l-4.3 2.2" />
        <path d="M2.8 10.5l2.7 6" />
        <path d="M21.2 10.5l-2.7 6" />
        <path d="M9 18.5h6" />
      </>
    ),
  },
  {
    label: 'Professionalism',
    icon: (
      <>
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
      </>
    ),
  },
  {
    label: 'Innovation',
    icon: (
      <>
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z" />
      </>
    ),
  },
  {
    label: 'Sustainability',
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2c-3 4-3 10 0 20" />
        <path d="M12 2c3 4 3 10 0 20" />
        <path d="M2 12h20" />
        <path d="M8 8c1.5 1 3 1 4 0" />
      </>
    ),
  },
  {
    label: 'Social Responsibility',
    icon: (
      <>
        <circle cx="12" cy="5" r="2.5" />
        <circle cx="5" cy="7.5" r="2" />
        <circle cx="19" cy="7.5" r="2" />
        <path d="M7 21v-1a5 5 0 0110 0v1" />
        <path d="M1 19v-.5a4 4 0 016-3.5" />
        <path d="M23 19v-.5a4 4 0 00-6-3.5" />
      </>
    ),
  },
];

const roles = [
  { title: 'Collaborative Platform', body: 'Provide a collaborative platform for engineers to gather for social, professional, and career development.' },
  { title: 'National & International Representation', body: 'Represent engineers at national and international levels.' },
  { title: 'Knowledge & Skills', body: 'Enhance the knowledge and skills of engineers.' },
  { title: 'Dignity & Reputation', body: 'Uphold the dignity and reputation of engineers.' },
];

const objectives = [
  'To enhance the character, status, and interests of the engineering profession and those engaged in it.',
  'To promote ethical conduct, honorable practice, and mutual respect, and to develop standards guiding engineering practice and professional behavior among members.',
  'To support members through quality services, capacity building, and advocacy, while contributing to national development and infrastructure growth.',
  'To advance continuous professional development (CPD), research, knowledge exchange, and professional fellowship among engineers.',
];

const activities = [
  {
    title: 'Seminars',
    body: 'IES organizes seminars to help members stay informed about the latest advancements in technology, engineering practices, and management strategies.',
    icon: <><path d="M2 3h20v14H2z" /><path d="M8 21h8" /><path d="M12 17v4" /></>,
  },
  {
    title: 'Publications',
    body: 'IES publishes a range of materials, including technical papers, reports, newsletters, and guidelines, to provide members with valuable resources for their professional development.',
    icon: <><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></>,
  },
  {
    title: 'Training Programs',
    body: 'IES offers training programmes to enhance the skills and knowledge of its members, ensuring they remain competitive in the ever-evolving engineering profession.',
    icon: <><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></>,
  },
  {
    title: 'IES Newsletter',
    body: 'The IES Newsletter is published regularly and distributed to members. It features articles on technical developments, industry trends, engineering innovations, and updates on IES activities.',
    icon: <><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2" /><path d="M18 14h-8M15 18h-5M10 6h8v4h-8z" /></>,
  },
  {
    title: 'Continuing Professional Development (CPD)',
    body: 'IES organizes professional development programmes, technical workshops, and training courses to support lifelong learning and help members keep pace with emerging technologies, industry standards, and best engineering practices.',
    icon: <><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /><circle cx="12" cy="17" r="1" /></>,
  },
];

const councilRoles = [
  'Organizing lectures, demonstrations, and technical visits.',
  'Upholding professional standards.',
  'Expanding IES membership.',
  'Ensuring maximum benefits for members.',
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#022D5A] via-[#035CB3] to-[#024A8F] py-16 text-white sm:py-20">
        <div className="absolute inset-0">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#48C184]/10 blur-3xl" />
          <div className="absolute -bottom-10 right-0 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute right-1/4 top-1/4 h-40 w-40 rounded-full bg-[#035CB3]/30 blur-2xl" />
        </div>
        <SiteContainer className="relative text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#48C184]">About IES</p>
          <h1 className="mx-auto mt-3 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            About Us
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-blue-100 sm:text-base">
            Discover our history and contributions to the engineering community.
            <br />
            Advancing engineering through knowledge, innovation, and service for the benefit of humanity.
          </p>
        </SiteContainer>
      </section>

      {/* About IES intro */}
      <Section spacing="default">
        <SiteContainer>
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-bold  tracking-widest sm:text-4xl text-[#035CB3]">About IES</p>
          </div>
          <div className="mt-8 flex flex-col gap-4 text-left text-sm leading-relaxed text-slate-700 sm:text-base">
            <p>
              The Institution of Engineers Somalia (IES) was established in 2024 as the national professional body representing engineers across all engineering disciplines in Somalia. IES collaborates with national and international institutions to advance engineering for the benefit of society, promote the growth and development of the engineering profession, and support the adoption of international standards and global best practices.
            </p>
            <p>
              IES is committed to strengthening the engineering profession by promoting networking, public awareness, engineering education, knowledge sharing, research, and innovation. It also works to establish and promote recognized standards, uphold ethical conduct and integrity, and protect the rights, welfare, and interests of engineers across all disciplines in Somalia.
            </p>
          </div>

          {/* Vision & Mission cards */}
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#035CB3] to-[#024A8F] p-8 text-white shadow-lg transition-transform hover:-translate-y-0.5">
              <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/5" />
              <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-white/5" />
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-blue-200">Our Vision</p>
                <p className="mt-2 text-base leading-relaxed text-blue-50">
                  To be the trusted professional body and voice of the engineering profession in Somalia.
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#48C184] to-[#2d7a50] p-8 text-white shadow-lg transition-transform hover:-translate-y-0.5">
              <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/5" />
              <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-white/5" />
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                    <line x1="22" y1="2" x2="12" y2="12" />
                    <path d="M22 2l-4.5 1.5L19 5z" />
                  </svg>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-green-100">Our Mission</p>
                <p className="mt-2 text-base leading-relaxed text-green-50">
                  To advance the engineering profession through innovation, ethics, leadership, and professional development for the benefit of society.
                </p>
              </div>
            </div>
          </div>
        </SiteContainer>
      </Section>

      {/* Core Values */}
      <Section tone="muted" spacing="default">
        <SiteContainer>
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-[#035CB3] sm:text-4xl">Our Core Values</h2>
          </div>
          <div className="mx-auto mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {coreValues.map((value) => (
              <div key={value.label} className="flex flex-col items-center gap-3">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#035CB3]/8 transition-colors hover:bg-[#035CB3]/15">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#035CB3]/12">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#035CB3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      {value.icon}
                    </svg>
                  </div>
                </div>
                <p className="text-center text-xs font-bold uppercase tracking-wide text-[#022D5A]">{value.label}</p>
              </div>
            ))}
          </div>
        </SiteContainer>
      </Section>

      {/* Roles of IES */}
      <Section spacing="default">
        <SiteContainer>
          <div className="text-center">
            {/* <p className="text-xs font-bold uppercase tracking-widest text-[#035CB3]">About IES</p> */}
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#035CB3] sm:text-4xl">Roles of IES</h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {roles.map((role, i) => (
              <div
                key={role.title}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="absolute right-0 top-0 h-20 w-20 translate-x-6 -translate-y-6 rounded-full bg-[#035CB3]/[0.04] transition-transform group-hover:scale-125" />
                <div className="relative">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#035CB3] to-[#024A8F] text-sm font-bold text-white">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="mt-4 text-base font-bold text-[#022D5A]">{role.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{role.body}</p>
                </div>
              </div>
            ))}
          </div>
        </SiteContainer>
      </Section>

      {/* Objectives */}
      <Section tone="muted" spacing="default">
        <SiteContainer>
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-[#035CB3] sm:text-4xl">Objectives of IES</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
              Since its formation, the Institution of Engineers Somalia (IES) has been guided by the following ideals and objectives:
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {objectives.map((obj, i) => (
              <div
                key={i}
                className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-[#035CB3]/30 hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#48C184]/12 text-sm font-bold text-[#2d7a50]">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <p className="text-sm leading-relaxed text-slate-700">{obj}</p>
              </div>
            ))}
          </div>
        </SiteContainer>
      </Section>

      {/* Activities of IES */}
      <Section spacing="default">
        <SiteContainer>
          <div className="text-center">
            {/* <p className="text-xs font-bold uppercase tracking-widest text-[#035CB3]">Services</p> */}
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#035CB3] sm:text-4xl">Activities of IES</h2>
            <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
              IES is committed to providing valuable services to its members through various activities designed to keep them updated on technical, industrial, and managerial developments in engineering.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => (
              <div
                key={activity.title}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="absolute right-0 top-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-[#035CB3]/[0.04] transition-transform group-hover:scale-125" />
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#035CB3]/8 text-[#035CB3]">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      {activity.icon}
                    </svg>
                  </div>
                  <h3 className="mt-4 text-base font-bold text-[#022D5A]">{activity.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{activity.body}</p>
                </div>
              </div>
            ))}
          </div>
        </SiteContainer>
      </Section>

      {/* Role of the Council */}
      <Section tone="muted" spacing="default">
        <SiteContainer>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#035CB3]">Governance</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#022D5A] sm:text-4xl">
                Role of the Council
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">
                The interests of all members are represented by the Council of IES, which coordinates the activities of the institution&apos;s committees and associated bodies. The Council organizes national conferences, seminars, and represents IES members in various national and international committees.
              </p>
              <p className="mt-3 text-sm text-slate-600">
                IES committees and regional representatives play a vital role in:
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {councilRoles.map((role, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-[#035CB3]/30 hover:shadow-sm"
                >
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#035CB3]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-700">{role}</p>
                </div>
              ))}
              <p className="mt-3 rounded-xl border border-[#48C184]/25 bg-[#48C184]/5 p-4 text-sm italic leading-relaxed text-slate-600">
                Members are encouraged to actively participate in IES activities to ensure the continued growth and success of the institution.
              </p>
            </div>
          </div>
        </SiteContainer>
      </Section>

      {/* Stay Updated */}
      <Section spacing="default">
        <SiteContainer>
          <div className="mx-auto max-w-4xl rounded-2xl border border-[#035CB3]/15 bg-gradient-to-br from-[#e8f0fe] to-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#035CB3]/10">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#035CB3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight text-[#035CB3] sm:text-3xl">Stay Updated</h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Through these activities, IES ensures that its members are well-equipped to tackle challenges in the engineering profession and contribute to the sustainable development of Somalia and beyond.
            </p>
          </div>
        </SiteContainer>
      </Section>

    </>
  );
}
