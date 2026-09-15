import Link from 'next/link';
import React from 'react';

interface MembershipProps {
    title: string;
    description: string;
    grade: 'STUDENT' | 'GRADUATE' | 'ASSOCIATE' | 'CORPORATE' | 'SENIOR' | 'FELLOW';
    price?: string;
}

const MembershipCard: React.FC<MembershipProps> = ({ title, description, grade, price }) => {
    return (
        <div className="group bg-white rounded-2xl shadow-md p-8 flex flex-col items-start border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-ies-blue transform -translate-x-2 group-hover:translate-x-0 transition-transform duration-300"></div>

            <div className="mb-4 bg-blue-50 p-3 rounded-lg text-ies-blue group-hover:bg-ies-blue group-hover:text-white transition-colors duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-ies-blue transition-colors">{title}</h3>
            <p className="text-gray-600 mb-6 flex-grow leading-relaxed">{description}</p>
            {price && <p className="text-3xl font-bold text-gray-900 mb-6">{price}</p>}

            <Link href={`/register?grade=${grade}`} className="w-full text-center bg-gray-50 text-gray-900 py-3 px-4 rounded-xl hover:bg-ies-blue hover:text-white transition-all duration-300 font-semibold border border-gray-200 hover:border-ies-blue">
                Apply Now
            </Link>
        </div>
    );
};

export default MembershipCard;
