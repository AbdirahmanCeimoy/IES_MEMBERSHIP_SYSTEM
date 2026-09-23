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
  label: 'Passport-size colored photo',
  helper: 'JPG or PNG',
  accept: 'image',
  required: true,
};

const idOrPassport: DocumentField = {
  key: 'idOrPassportFileName',
  label: 'National ID or Passport',
  helper: 'PDF or JPG scan',
  accept: 'pdf-image',
  required: true,
};

const cv: DocumentField = {
  key: 'cvFileName',
  label: 'Updated Curriculum Vitae (CV)',
  helper: 'PDF preferred',
  accept: 'pdf',
  required: true,
};

const declaration: DocumentField = {
  key: 'declarationFileName',
  label: 'Signed Declaration',
  helper: 'PDF - signed IES declaration form',
  accept: 'pdf',
  required: true,
};

const paymentProof: DocumentField = {
  key: 'paymentProofFileName',
  label: 'Payment Proof',
  helper: 'Screenshot or receipt of application fee',
  accept: 'pdf-image',
  required: true,
};

const enrollmentProof: DocumentField = {
  key: 'enrollmentProofFileName',
  label: 'Student Enrollment Proof',
  helper: 'University student ID or letter from the Dean',
  accept: 'pdf-image',
  required: true,
};

const secondaryCert: DocumentField = {
  key: 'transcriptFileName',
  label: 'Secondary School Completion Certificate',
  helper: 'Certified by Commissioner for Oaths',
  accept: 'pdf-image',
  required: true,
};

const degree: DocumentField = {
  key: 'degreeFileName',
  label: 'Degree Certificate',
  helper: 'Certified by Commissioner for Oaths (not advocates)',
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
  label: 'Experience Letter',
  helper: 'Employer letter confirming engineering responsibility',
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
  label: 'Project / Leadership Portfolio',
  helper: 'PDF describing your key engineering projects and roles',
  accept: 'pdf',
  required: true,
};

const graduateLetter: DocumentField = {
  key: 'degreeFileName',
  label: 'IES Graduate Letter or Certificate',
  helper: 'Confirmation of Graduate Member status',
  accept: 'pdf-image',
  required: true,
};

const refereeOne: DocumentField = {
  key: 'refereeOneFileName',
  label: 'Referee 1 (Proposer)',
  helper: 'Paid-up Corporate or Fellow member',
  accept: 'pdf',
  required: true,
};

const refereeTwo: DocumentField = {
  key: 'refereeTwoFileName',
  label: 'Referee 2 (Seconder)',
  helper: 'Paid-up Corporate or Fellow member',
  accept: 'pdf',
  required: true,
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
  label: 'CSR & Engineering Contribution Portfolio',
  helper: 'PDF evidencing CSR activities and engineering contribution',
  accept: 'pdf',
  required: true,
};

const shortBio: DocumentField = {
  key: 'achievementProfileFileName',
  label: 'Short Biography',
  helper: 'PDF (max 2 pages) - your IES + CSR involvement',
  accept: 'pdf',
  required: true,
};

export const gradeDocuments: Record<GradeCode, DocumentField[]> = {
  STUDENT: [
    passportPhoto,
    idOrPassport,
    enrollmentProof,
    secondaryCert,
    declaration,
    paymentProof,
  ],
  GRADUATE: [
    passportPhoto,
    idOrPassport,
    cv,
    degree,
    secondaryCert,
    refereeOne,
    refereeTwo,
    declaration,
    paymentProof,
  ],
  ASSOCIATE: [
    passportPhoto,
    idOrPassport,
    cv,
    hnd,
    { ...transcript, required: false, helper: 'Transcript OR provide Experience Letter' },
    { ...experienceLetter, required: false, helper: 'Experience Letter OR provide Transcript' },
    refereeOne,
    refereeTwo,
    declaration,
    paymentProof,
  ],
  CORPORATE: [
    passportPhoto,
    idOrPassport,
    cv,
    graduateLetter,
    experienceLetter,
    refereeOne,
    refereeTwo,
    declaration,
    paymentProof,
  ],
  SENIOR: [
    passportPhoto,
    idOrPassport,
    cv,
    degree,
    experienceLetter,
    projectPortfolio,
    employerReference,
    refereeOne,
    refereeTwo,
    declaration,
    paymentProof,
  ],
  FELLOW: [
    passportPhoto,
    idOrPassport,
    cv,
    degree,
    experienceLetter,
    csrPortfolio,
    shortBio,
    fellowNomination,
    refereeOne,
    refereeTwo,
    declaration,
    paymentProof,
  ],
};
