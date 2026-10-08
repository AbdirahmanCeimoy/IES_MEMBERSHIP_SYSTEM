/**
 * Grade-specific document upload requirements.
 * Keys map directly to the backend's MembershipDocuments::FILE_FIELDS
 * so the frontend field names can be POSTed straight to
 * /api/memberships/applications as multipart/form-data.
 */

import type { GradeCode } from './grade-requirements';

export type DocumentAccept = 'image' | 'pdf' | 'pdf-image';

export interface DocumentField {
  key: string;               // backend field name, e.g. cvFileName
  label: string;             // display label
  helper?: string;           // small helper text
  accept: DocumentAccept;    // allowed file types
  required: boolean;         // required for this grade?
}

const ACCEPT_MAP: Record<DocumentAccept, string> = {
  image: '.jpg,.jpeg,.png',
  pdf: '.pdf',
  'pdf-image': '.pdf,.jpg,.jpeg,.png',
};

export const acceptAttr = (a: DocumentAccept) => ACCEPT_MAP[a];

const passportPhoto: DocumentField = {
  key: 'passportPhotoFileName',
  label: 'Passport-Size Photograph',
  helper: 'JPG or PNG Image',
  accept: 'image',
  required: true,
};

const idOrPassport: DocumentField = {
  key: 'idOrPassportFileName',
  label: 'National ID or Passport',
  helper: 'Certified by Commissioner for Oaths (NB: not advocates)',
  accept: 'pdf-image',
  required: true,
};

const cv: DocumentField = {
  key: 'cvFileName',
  label: 'Updated Curriculum Vitae (CV)',
  helper: 'PDF Preferred',
  accept: 'pdf',
  required: true,
};

const paymentProof: DocumentField = {
  key: 'paymentProofFileName',
  label: 'Proof of Payment',
  helper: 'Screenshot or Receipt of Application Fee Payment',
  accept: 'pdf-image',
  required: true,
};

const enrollmentProof: DocumentField = {
  key: 'enrollmentProofFileName',
  label: 'Student Enrollment Proof',
  helper: 'University Student ID Card or Official Letter from the Dean confirming current enrollment',
  accept: 'pdf-image',
  required: true,
};

const secondaryCert: DocumentField = {
  key: 'transcriptFileName',
  label: 'Secondary School Completion Certificate ',
  helper: 'Certified by Commissioner for Oaths (NB: not advocates)',
  accept: 'pdf-image',
  required: true,
};

const degree: DocumentField = {
  key: 'degreeFileName',
  label: 'Degree Certificate',
  helper: 'Certified by Commissioner for Oaths (NB: not advocates)',
  accept: 'pdf-image',
  required: true,
};

const hnd: DocumentField = {
  key: 'degreeFileName',
  label: 'Higher National Diploma Certificate',
  helper: 'Certified by Commissioner for Oaths',
  accept: 'pdf-image',
  required: true,
};

const transcript: DocumentField = {
  key: 'transcriptFileName',
  label: 'Academic Transcript',
  helper: 'Official transcript from your institution',
  accept: 'pdf-image',
  required: true,
};

const experienceLetter: DocumentField = {
  key: 'experienceLetterFileName',
  label: 'Employment/Experience Letters',
  helper: 'Employer Letter Confirming Engineering Responsibilities',
  accept: 'pdf-image',
  required: true,
};

const employerReference: DocumentField = {
  key: 'employerReferenceFileName',
  label: 'Employer Reference',
  helper: 'Reference letter from current employer',
  accept: 'pdf',
  required: true,
};

const projectPortfolio: DocumentField = {
  key: 'projectPortfolioFileName',
  label: 'Project/Leadership Portfolio',
  helper: 'PDF describing your key engineering projects and roles',
  accept: 'pdf',
  required: true,
};

/**
 * IES Graduate Certificate - repurposes `refereeOneFileName` (unused since
 * referees moved to Profile → Referees tab) so it does not clash with the
 * Degree Certificate slot which owns `degreeFileName`. Optional across all
 * grades that use it (Corporate + Associate) - applicants can skip it.
 */
const iesGraduateCert: DocumentField = {
  key: 'refereeOneFileName',
  label: 'IES Graduate Certificate',
  helper: 'Confirmation of your IES Graduate Member status',
  accept: 'pdf-image',
  required: false,
};

const fellowNomination: DocumentField = {
  key: 'fellowNominationFileName',
  label: 'Fellow Nomination Form',
  helper: 'Signed by two Fellows',
  accept: 'pdf',
  required: true,
};

const csrPortfolio: DocumentField = {
  key: 'projectPortfolioFileName',
  label: 'CSR & Engineering Contributions',
  helper: 'PDF Evidencing CSR Activities & Engineering Contribution',
  accept: 'pdf',
  required: false,
};

const shortBio: DocumentField = {
  key: 'achievementProfileFileName',
  label: 'Short Biography',
  helper: 'PDF Preferred (Maximum 2 Pages) - IES & CSR Involvement',
  accept: 'pdf',
  required: true,
};

/**
 * Upload buttons per grade. These MUST mirror the wording in
 * `grade-requirements.ts` - anything captured elsewhere (referees, years of
 * experience, IES involvement) is not repeated here as an upload slot.
 */
export const gradeDocuments: Record<GradeCode, DocumentField[]> = {
  STUDENT: [
    passportPhoto,
    idOrPassport,
    secondaryCert,
    enrollmentProof,
    paymentProof,
  ],
  GRADUATE: [
    passportPhoto,
    idOrPassport,
    cv,
    degree,
    secondaryCert,
    paymentProof,
  ],
  GRAD_TECHNICIAN: [
    passportPhoto,
    idOrPassport,
    cv,
    degree,
    secondaryCert,
    paymentProof,
  ],
  GRAD_TECHNOLOGIST: [
    passportPhoto,
    idOrPassport,
    cv,
    degree,
    secondaryCert,
    paymentProof,
  ],
  ASSOCIATE: [
    passportPhoto,
    idOrPassport,
    cv,
    degree,
    { ...secondaryCert, required: false },
    iesGraduateCert,
    paymentProof,
  ],
  CORPORATE: [
    passportPhoto,
    idOrPassport,
    cv,
    degree,
    iesGraduateCert,
    paymentProof,
  ],
  SENIOR: [
    passportPhoto,
    idOrPassport,
    cv,
    degree,
    shortBio,
    csrPortfolio,
    paymentProof,
  ],
  FELLOW: [
    passportPhoto,
    idOrPassport,
    cv,
    degree,
    shortBio,
    csrPortfolio,
    paymentProof,
  ],
};
