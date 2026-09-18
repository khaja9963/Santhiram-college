'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  GraduationCap, CheckCircle2, FileText, HelpCircle,
  Phone, Mail, Bot, ArrowRight, ShieldCheck, ChevronDown,
  X, Check, Download, Printer, User, BookOpen, Building2, MapPin, Sparkles, RefreshCw,
  AlertCircle
} from 'lucide-react';
import { assetUrl } from '@/lib/assets';
import ApplicationFeePayment, { PaymentRecord } from '@/components/admissions/ApplicationFeePayment';

interface ApplicationFormData {
  fullName: string;
  fatherName: string;
  dob: string;
  gender: string;
  category: string;
  mobile: string;
  whatsapp: string;
  email: string;
  address: string;
  district: string;
  state: string;
  firstChoice: string;
  secondChoice: string;
  hostelRequired: string;
  interCollege: string;
  interBoard: string;
  interPercentage: string;
  entranceExam: string;
  entranceRank: string;
  hallTicketNumber: string;
  paymentStatus?: 'PAID' | 'PENDING';
  paymentAmount?: number;
  baseFee?: number;
  gstAmount?: number;
  paymentMethod?: 'UPI' | 'CARD' | 'QR';
  transactionId?: string;
  paymentDate?: string;
}

const INITIAL_PAYMENT: PaymentRecord = {
  isPaid: false,
  baseFee: 150,
  taxAmount: 27,
  totalAmount: 177,
};

const INITIAL_FORM: ApplicationFormData = {
  fullName: '',
  fatherName: '',
  dob: '',
  gender: 'Male',
  category: 'OC',
  mobile: '',
  whatsapp: '',
  email: '',
  address: '',
  district: 'Nandyal',
  state: 'Andhra Pradesh',
  firstChoice: 'CSE - Computer Science & Engineering',
  secondChoice: 'CSM - Artificial Intelligence & Machine Learning',
  hostelRequired: 'No',
  interCollege: '',
  interBoard: 'BIEAP (Andhra Pradesh State Board)',
  interPercentage: '',
  entranceExam: 'AP EAPCET',
  entranceRank: '',
  hallTicketNumber: '',
};

export default function AdmissionsPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Application Modal state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [formData, setFormData] = useState<ApplicationFormData>(INITIAL_FORM);
  const [paymentData, setPaymentData] = useState<PaymentRecord>(INITIAL_PAYMENT);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<ApplicationFormData | null>(null);
  const [declarationAccepted, setDeclarationAccepted] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const modalBodyRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      q: 'What is the college counselling code for AP EAPCET?',
      a: 'The official counselling code for Santhiram Engineering College in AP EAPCET / ECET / ICET is SREC.',
    },
    {
      q: 'Are students eligible for Jagananna Vidya Deevena (JVD) fee reimbursement?',
      a: 'Yes, eligible students admitted under Category-A (Convener Quota) through AP EAPCET receive 100% tuition fee reimbursement directly from the Government of Andhra Pradesh as per JVD norms.',
    },
    {
      q: 'Can diploma holders join B.Tech directly into the second year?',
      a: 'Yes. Diploma holders and B.Sc. mathematics graduates can seek direct lateral entry admission into the 2nd year (3rd semester) B.Tech through AP ECET under the 10% supernumerary quota.',
    },
    {
      q: 'What are the hostel accommodations and mess facilities?',
      a: 'SREC provides separate, secured hostels for boys and girls with RO purified water, biometric security, hygienic vegetarian and non-vegetarian dining, and 24/7 medical access with Santhiram General Hospital.',
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const autoFillSampleData = () => {
    setFormData({
      fullName: 'B. Rajesh Kumar',
      fatherName: 'B. Venkateswarlu',
      dob: '2008-04-18',
      gender: 'Male',
      category: 'OC',
      mobile: '9848022338',
      whatsapp: '9848022338',
      email: 'rajesh.kumar@gmail.com',
      address: 'Plot No. 45, Sanjeeva Nagar',
      district: 'Nandyal',
      state: 'Andhra Pradesh',
      firstChoice: 'CSE - Computer Science & Engineering',
      secondChoice: 'CSM - Artificial Intelligence & Machine Learning',
      hostelRequired: 'No',
      interCollege: 'Sri Chaitanya Junior College, Nandyal',
      interBoard: 'BIEAP (Andhra Pradesh State Board)',
      interPercentage: '92.4%',
      entranceExam: 'AP EAPCET',
      entranceRank: '14250',
      hallTicketNumber: 'EAPCET26-88319',
    });
    setPaymentData({
      isPaid: true,
      method: 'UPI',
      txnId: `UPI/SREC/${Date.now().toString().slice(-6)}/984812`,
      paidAt: new Date().toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      baseFee: 150,
      taxAmount: 27,
      totalAmount: 177,
    });
    setDeclarationAccepted(true);
    setFieldErrors({});
    setFormError('');
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Candidate Full Name is required *';
    } else if (formData.fullName.trim().length < 3) {
      errors.fullName = 'Full Name must be at least 3 characters';
    }

    if (!formData.fatherName.trim()) {
      errors.fatherName = "Father's / Guardian's Name is required *";
    }

    if (!formData.dob) {
      errors.dob = 'Date of Birth is required *';
    }

    if (!formData.gender) {
      errors.gender = 'Gender selection is required *';
    }

    if (!formData.category) {
      errors.category = 'Category selection is required *';
    }

    const cleanMobile = formData.mobile.replace(/\D/g, '');
    if (!cleanMobile) {
      errors.mobile = 'Primary Mobile Number is required *';
    } else if (cleanMobile.length !== 10) {
      errors.mobile = 'Enter a valid 10-digit mobile number *';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email Address is required *';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Enter a valid email address *';
    }

    if (!formData.address.trim()) {
      errors.address = 'Permanent Residential Address is required *';
    }

    if (!formData.district.trim()) {
      errors.district = 'District is required *';
    }

    if (!formData.state.trim()) {
      errors.state = 'State is required *';
    }

    if (!formData.firstChoice.trim()) {
      errors.firstChoice = '1st Branch Preference is required *';
    }

    if (!formData.interCollege.trim()) {
      errors.interCollege = 'Intermediate / Junior College Name is required *';
    }

    if (!formData.interPercentage.trim()) {
      errors.interPercentage = '10+2 MPC Marks / Percentage is required *';
    }

    if (!declarationAccepted) {
      errors.declaration = 'You must accept the institutional merit declaration *';
    }

    if (!paymentData.isPaid) {
      errors.payment = 'Application fee payment of ₹177 (₹150 + ₹27 GST) is mandatory before submitting *';
    }

    return errors;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFormError('Please fill in all mandatory fields marked with * and complete the Application Fee payment before submitting.');

      // Auto-scroll to first invalid element or payment section
      setTimeout(() => {
        const firstErrorKey = Object.keys(errors)[0];
        const errorEl = document.getElementById(firstErrorKey === 'payment' ? 'paymentSection' : firstErrorKey);
        if (errorEl) {
          errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          modalBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 50);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    const refNo = `SREC-BTECH-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const finalizedData: ApplicationFormData = {
      ...formData,
      paymentStatus: 'PAID',
      paymentAmount: paymentData.totalAmount,
      baseFee: paymentData.baseFee,
      gstAmount: paymentData.taxAmount,
      paymentMethod: paymentData.method,
      transactionId: paymentData.txnId,
      paymentDate: paymentData.paidAt,
    };

    const applicationRecord = {
      refNo,
      status: 'PENDING',
      submittedAt: new Date().toISOString(),
      ...finalizedData,
    };

    try {
      const existingRaw = localStorage.getItem('srec_btech_applications');
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      localStorage.setItem('srec_btech_applications', JSON.stringify([applicationRecord, ...existing]));
    } catch {}

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedRef(refNo);
      setSubmittedData(finalizedData);
      modalBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  };

  const resetAndCloseModal = () => {
    setIsApplyModalOpen(false);
    setSubmittedRef(null);
    setSubmittedData(null);
    setFormData(INITIAL_FORM);
    setPaymentData(INITIAL_PAYMENT);
    setDeclarationAccepted(true);
    setFieldErrors({});
    setFormError('');
  };

  const submitAnotherApplication = () => {
    setSubmittedRef(null);
    setSubmittedData(null);
    setFormData(INITIAL_FORM);
    setPaymentData(INITIAL_PAYMENT);
    setDeclarationAccepted(true);
    setFieldErrors({});
    setFormError('');
    modalBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const downloadAcknowledgement = () => {
    if (!submittedData || !submittedRef) return;

    const receipt = `===============================================================
SANTHIRAM ENGINEERING COLLEGE (AUTONOMOUS) - NANDYAL
Approved by AICTE, New Delhi | Affiliated to JNTUA, Ananthapuramu
Accredited by NAAC 'A' Grade & NBA
===============================================================
B.TECH ADMISSION APPLICATION ACKNOWLEDGEMENT (2026-2027)
Category - B (Institutional Merit / Management Quota)
===============================================================

Application Reference No : ${submittedRef}
Submission Date & Time   : ${new Date().toLocaleString()}

1. CANDIDATE PARTICULARS
---------------------------------------------------------------
Full Name                : ${submittedData.fullName}
Father / Guardian Name   : ${submittedData.fatherName}
Date of Birth            : ${submittedData.dob || 'Not specified'}
Gender                   : ${submittedData.gender}
Category / Community     : ${submittedData.category}
Contact Mobile           : ${submittedData.mobile}
WhatsApp Number          : ${submittedData.whatsapp || submittedData.mobile}
Email Address            : ${submittedData.email}
Address                  : ${submittedData.address}
District & State         : ${submittedData.district}, ${submittedData.state}

2. PROGRAMME & BRANCH PREFERENCES
---------------------------------------------------------------
1st Choice (Preferred)   : ${submittedData.firstChoice}
2nd Choice (Alternative) : ${submittedData.secondChoice}
Campus Hostel Required   : ${submittedData.hostelRequired}

3. QUALIFYING EXAM & ACADEMIC MERIT
---------------------------------------------------------------
Intermediate College     : ${submittedData.interCollege}
Board of Examination     : ${submittedData.interBoard}
Intermediate MPC %       : ${submittedData.interPercentage}
Entrance Exam            : ${submittedData.entranceExam}
Entrance Rank            : ${submittedData.entranceRank || 'Direct Merit Application'}
Hall Ticket Number       : ${submittedData.hallTicketNumber || 'N/A'}

4. APPLICATION FEE & PAYMENT RECEIPT
---------------------------------------------------------------
Base Application Fee     : Rs. 150.00
CGST (9%)                : Rs. 13.50
SGST (9%)                : Rs. 13.50
Total GST (18%)          : Rs. 27.00
Total Amount Paid        : Rs. 177.00
Payment Status           : PAID & VERIFIED
Payment Mode             : ${submittedData.paymentMethod || 'Online'}
Transaction Reference ID : ${submittedData.transactionId || 'N/A'}
Payment Date             : ${submittedData.paymentDate || 'Recorded'}

===============================================================
IMPORTANT INSTRUCTIONS FOR APPLICANT:
1. Please preserve this Application Reference Number for all future correspondence.
2. The SREC Admissions Committee will review your application and contact you within 24 to 48 hours for document verification.
3. For immediate assistance, contact the SREC Admissions Helpdesk:
   Phone: +91 8514 275301 / 275302
   Email: admissions@srecnandyal.edu.in
   Campus: NH-40, Nandyal - 518501, Andhra Pradesh.
===============================================================`;

    const blob = new Blob([receipt], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${submittedRef}_Acknowledgement.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#0B2545] to-blue-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold px-3 py-1 rounded-full">
            Admissions 2026-27 &bull; EAPCET Code: SREC
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Admissions &amp; Eligibility Criteria
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl">
            Join an autonomous engineering college recognized for excellence in innovation, industry-driven curriculum, and high-impact campus placements.
          </p>
        </div>
      </section>

      {/* Admission Quota Breakdown */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Category A */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black bg-blue-100 text-blue-900 px-3 py-1 rounded-md">
                  Category - A (70% Seats)
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                  Convener Quota
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900">AP EAPCET State Counselling</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Admissions are conducted through centralized web counselling by APSCHE based on merit rank secured in AP EAPCET.
              </p>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="font-bold text-slate-900">Eligibility:</div>
                <ul className="space-y-1.5 list-disc pl-5">
                  <li>Passed 10+2 with Mathematics, Physics, and Chemistry (MPC).</li>
                  <li>Minimum 45% aggregate in group subjects (40% for SC/ST/BC categories).</li>
                  <li>Qualified rank in AP EAPCET examination.</li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="text-xs text-slate-500 font-medium">
                Counselling Code: <strong className="font-mono text-blue-900 font-black">SREC</strong> &bull; Centralized Web Counselling
              </div>
            </div>
          </div>

          {/* Category B - Institutional Merit Selection */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-400 to-amber-500 text-slate-950 text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider shadow-xs">
              Admissions Open 2026-27
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black bg-amber-100 text-amber-900 px-3 py-1 rounded-md">
                  Category - B (30% Seats)
                </span>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded">
                  Management / NRI Quota
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900">Institutional Merit Selection</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Admissions are conducted directly by the college management strictly following APSCHE guidelines and merit rankings.
              </p>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="font-bold text-slate-900">Eligibility:</div>
                <ul className="space-y-1.5 list-disc pl-5">
                  <li>Candidates with qualified JEE (Mains) or AP EAPCET rank.</li>
                  <li>Candidates with minimum 50% marks in intermediate (10+2) MPC subjects.</li>
                  <li>Direct institutional admission through online merit registration.</li>
                </ul>
              </div>
            </div>

            {/* Apply Now Button under Institutional Merit Selection */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black px-6 py-3 rounded-xl text-sm shadow-sm hover:shadow-md transition-all active:scale-98 cursor-pointer"
              >
                <span>Apply Now (B.Tech 2026-27)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="text-center text-[11px] text-slate-500">
                Instant online registration for Category-B institutional merit seats
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Required Documents Checklist */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Verification Checklist</span>
            <h2 className="text-2xl sm:text-3xl font-black">Mandatory Certificates for Admission</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Students must submit original documents along with 3 sets of self-attested photocopies during reporting.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {[
              'AP EAPCET / ECET Rank Card & Hall Ticket',
              'SSC / 10th Class Marks Memo (Date of Birth Proof)',
              'Intermediate / 10+2 Marks Memorandum',
              'Transfer Certificate (T.C.) & Conduct Certificate',
              'Study & Bonafide Certificates (Class VI to Intermediate)',
              'Caste Certificate (for SC / ST / BC candidates)',
              'Income Certificate issued by competent Tahsildar / MeeSeva',
              'Aadhaar Card copy of Student and Parents',
              'Recent Passport Size Color Photographs (6 copies)',
            ].map((doc, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{doc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-4xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Got Questions?</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545]">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = activeFaq === i;
            return (
              <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setActiveFaq(isOpen ? null : i)}
                  className="w-full text-left p-4 flex items-center justify-between font-bold text-slate-900 text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* B.TECH APPLICATION MODAL */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0B2545] to-blue-900 text-white p-5 sm:p-6 flex items-start justify-between gap-4 shrink-0">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  B.Tech Admissions 2026-27 &bull; Category-B Merit
                </div>
                <h2 className="text-xl sm:text-2xl font-black">
                  Online Admission Application Form
                </h2>
                <p className="text-xs text-slate-300">
                  Santhiram Engineering College (Autonomous), Nandyal &bull; EAPCET Code: SREC
                </p>
              </div>

              <button
                type="button"
                onClick={resetAndCloseModal}
                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer shrink-0"
                title="Close Application"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div ref={modalBodyRef} className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
              {submittedRef ? (
                /* SUCCESS CONFIRMATION SCREEN */
                <div className="text-center py-6 space-y-6 animate-in zoom-in-95">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                  </div>

                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/90 px-3.5 py-1 rounded-full border border-emerald-300">
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Application Submitted Successfully!</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                      Thank You, {submittedData?.fullName}!
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                      Your B.Tech admission application under <strong>Institutional Merit Selection (Category-B)</strong> has been recorded and submitted to the Santhiram Engineering College Admission Cell.
                    </p>
                  </div>

                  {/* Summary Card */}
                  <div className="p-5 bg-gradient-to-br from-slate-50 to-blue-50/50 border border-slate-200 rounded-2xl max-w-lg mx-auto space-y-3 text-left text-xs font-medium shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                      <span className="text-slate-500">Application Reference No:</span>
                      <span className="font-mono font-black text-sm text-blue-900 bg-blue-100 px-3 py-1 rounded-lg border border-blue-200 shadow-xs">
                        {submittedRef}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-2.5">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Applicant Name</span>
                        <span className="font-bold text-slate-900 text-xs">{submittedData?.fullName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Contact Mobile</span>
                        <span className="font-bold text-slate-900 text-xs">{submittedData?.mobile}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-2.5">
                      <div>
                        <span className="text-slate-500 block text-[11px]">1st Branch Choice</span>
                        <span className="font-bold text-blue-950 text-xs">{submittedData?.firstChoice}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">2nd Branch Choice</span>
                        <span className="font-bold text-slate-700 text-xs">{submittedData?.secondChoice}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 border-b border-slate-200 pb-2.5">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Intermediate MPC</span>
                        <span className="font-black text-emerald-700 text-xs">{submittedData?.interPercentage}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Category</span>
                        <span className="font-bold text-slate-800 text-xs">{submittedData?.category}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Hostel Facility</span>
                        <span className="font-bold text-slate-800 text-xs">{submittedData?.hostelRequired}</span>
                      </div>
                    </div>

                    {/* Verified Fee Payment Card */}
                    <div className="bg-emerald-50 border border-emerald-300/80 rounded-xl p-3 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-emerald-900 font-black text-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Application Fee Paid &bull; ₹{submittedData?.paymentAmount?.toFixed(2) || '177.00'}</span>
                        </div>
                        <span className="bg-emerald-200 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded">
                          {submittedData?.paymentMethod || 'Online'}
                        </span>
                      </div>
                      <div className="text-[11px] text-emerald-800 flex justify-between items-center">
                        <span>Breakdown: ₹150 (Base Fee) + ₹27 (18% GST)</span>
                        <span className="font-mono text-[10px] text-emerald-900">Txn: {submittedData?.transactionId}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-slate-500 pt-0.5">
                      <span>Status: <strong className="text-emerald-700 font-bold">Fee Paid &bull; Application Queued</strong></span>
                      <span>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>

                  {/* Next steps notice */}
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 max-w-lg mx-auto text-left leading-relaxed flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="font-bold text-emerald-900">What Happens Next?</div>
                      <div className="text-emerald-800">
                        The SREC Admissions Cell has registered your application. Our counsellor will call you on <strong className="text-emerald-950 font-black">{submittedData?.mobile}</strong> within <strong>24 to 48 hours</strong> to review certificates and finalize provisional seat allotment.
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={downloadAcknowledgement}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-sm transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Receipt (Acknowledgement)</span>
                    </button>
                    <button
                      type="button"
                      onClick={submitAnotherApplication}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold px-5 py-2.5 rounded-xl text-xs border border-blue-200 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Submit Another Application</span>
                    </button>
                    <button
                      type="button"
                      onClick={resetAndCloseModal}
                      className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : (
                /* FORM INPUT FIELDS */
                <form onSubmit={handleFormSubmit} noValidate className="space-y-6">
                  {/* Quick Auto Fill Option */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3.5 bg-gradient-to-r from-amber-50 to-blue-50 border border-amber-200/80 rounded-2xl text-xs">
                    <div className="flex items-center gap-2 text-slate-800 font-medium">
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Testing or in a hurry? Auto-fill sample student data with one click:</span>
                    </div>
                    <button
                      type="button"
                      onClick={autoFillSampleData}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl text-xs shadow-xs transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
                    >
                      ⚡ Auto-Fill Sample Details
                    </button>
                  </div>

                  {formError && (
                    <div className="p-3.5 bg-red-50 border border-red-300 text-red-800 text-xs rounded-xl font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Section 1: Candidate Personal Details */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-700" />
                        <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">
                          1. Personal Particulars
                        </h3>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Fields marked with <span className="text-red-500 font-bold">*</span> are mandatory
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700" htmlFor="fullName">
                          Candidate Full Name <span className="text-red-500 font-bold">*</span>{' '}
                          <span className="text-slate-400 font-normal">(as per SSC)</span>
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          name="fullName"
                          placeholder="e.g. Rahul Sharma"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className={`w-full text-xs p-2.5 rounded-xl border ${
                            fieldErrors.fullName
                              ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                              : 'border-slate-200 bg-slate-50'
                          } focus:bg-white focus:border-blue-600 outline-hidden font-medium`}
                        />
                        {fieldErrors.fullName && (
                          <p className="text-[11px] font-semibold text-red-600 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 shrink-0 text-red-500" />
                            <span>{fieldErrors.fullName}</span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700" htmlFor="fatherName">
                          Father&rsquo;s / Guardian&rsquo;s Name <span className="text-red-500 font-bold">*</span>
                        </label>
                        <input
                          id="fatherName"
                          type="text"
                          name="fatherName"
                          placeholder="e.g. S. Ramakrishna Sharma"
                          value={formData.fatherName}
                          onChange={handleInputChange}
                          className={`w-full text-xs p-2.5 rounded-xl border ${
                            fieldErrors.fatherName
                              ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                              : 'border-slate-200 bg-slate-50'
                          } focus:bg-white focus:border-blue-600 outline-hidden font-medium`}
                        />
                        {fieldErrors.fatherName && (
                          <p className="text-[11px] font-semibold text-red-600 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 shrink-0 text-red-500" />
                            <span>{fieldErrors.fatherName}</span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700" htmlFor="dob">
                          Date of Birth <span className="text-red-500 font-bold">*</span>
                        </label>
                        <input
                          id="dob"
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleInputChange}
                          className={`w-full text-xs p-2.5 rounded-xl border ${
                            fieldErrors.dob
                              ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                              : 'border-slate-200 bg-slate-50'
                          } focus:bg-white focus:border-blue-600 outline-hidden font-medium`}
                        />
                        {fieldErrors.dob && (
                          <p className="text-[11px] font-semibold text-red-600 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 shrink-0 text-red-500" />
                            <span>{fieldErrors.dob}</span>
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700" htmlFor="gender">
                            Gender <span className="text-red-500 font-bold">*</span>
                          </label>
                          <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className={`w-full text-xs p-2.5 rounded-xl border ${
                              fieldErrors.gender
                                ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                                : 'border-slate-200 bg-slate-50'
                            } focus:bg-white font-medium`}
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                          {fieldErrors.gender && (
                            <p className="text-[10px] font-semibold text-red-600 mt-0.5">
                              {fieldErrors.gender}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700" htmlFor="category">
                            Category <span className="text-red-500 font-bold">*</span>
                          </label>
                          <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className={`w-full text-xs p-2.5 rounded-xl border ${
                              fieldErrors.category
                                ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                                : 'border-slate-200 bg-slate-50'
                            } focus:bg-white font-medium`}
                          >
                            <option value="OC">OC</option>
                            <option value="BC-A">BC-A</option>
                            <option value="BC-B">BC-B</option>
                            <option value="BC-C">BC-C</option>
                            <option value="BC-D">BC-D</option>
                            <option value="BC-E">BC-E</option>
                            <option value="SC">SC</option>
                            <option value="ST">ST</option>
                          </select>
                          {fieldErrors.category && (
                            <p className="text-[10px] font-semibold text-red-600 mt-0.5">
                              {fieldErrors.category}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700" htmlFor="mobile">
                          Primary Mobile Number <span className="text-red-500 font-bold">*</span>
                        </label>
                        <input
                          id="mobile"
                          type="tel"
                          name="mobile"
                          maxLength={10}
                          placeholder="e.g. 9876543210"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          className={`w-full text-xs p-2.5 rounded-xl border ${
                            fieldErrors.mobile
                              ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                              : 'border-slate-200 bg-slate-50'
                          } focus:bg-white focus:border-blue-600 outline-hidden font-medium`}
                        />
                        {fieldErrors.mobile && (
                          <p className="text-[11px] font-semibold text-red-600 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 shrink-0 text-red-500" />
                            <span>{fieldErrors.mobile}</span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700" htmlFor="whatsapp">
                          WhatsApp Mobile Number <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          id="whatsapp"
                          type="tel"
                          name="whatsapp"
                          maxLength={10}
                          placeholder="e.g. 9876543210"
                          value={formData.whatsapp}
                          onChange={handleInputChange}
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 outline-hidden font-medium"
                        />
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-bold text-slate-700" htmlFor="email">
                          Email Address <span className="text-red-500 font-bold">*</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          name="email"
                          placeholder="candidate@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full text-xs p-2.5 rounded-xl border ${
                            fieldErrors.email
                              ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                              : 'border-slate-200 bg-slate-50'
                          } focus:bg-white focus:border-blue-600 outline-hidden font-medium`}
                        />
                        {fieldErrors.email && (
                          <p className="text-[11px] font-semibold text-red-600 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 shrink-0 text-red-500" />
                            <span>{fieldErrors.email}</span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-bold text-slate-700" htmlFor="address">
                          Permanent Residential Address <span className="text-red-500 font-bold">*</span>
                        </label>
                        <input
                          id="address"
                          type="text"
                          name="address"
                          placeholder="Door No, Street, Village/Town"
                          value={formData.address}
                          onChange={handleInputChange}
                          className={`w-full text-xs p-2.5 rounded-xl border ${
                            fieldErrors.address
                              ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                              : 'border-slate-200 bg-slate-50'
                          } focus:bg-white focus:border-blue-600 outline-hidden font-medium`}
                        />
                        {fieldErrors.address && (
                          <p className="text-[11px] font-semibold text-red-600 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 shrink-0 text-red-500" />
                            <span>{fieldErrors.address}</span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700" htmlFor="district">
                          District <span className="text-red-500 font-bold">*</span>
                        </label>
                        <input
                          id="district"
                          type="text"
                          name="district"
                          placeholder="e.g. Nandyal, Kurnool, Kadapa"
                          value={formData.district}
                          onChange={handleInputChange}
                          className={`w-full text-xs p-2.5 rounded-xl border ${
                            fieldErrors.district
                              ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                              : 'border-slate-200 bg-slate-50'
                          } focus:bg-white focus:border-blue-600 outline-hidden font-medium`}
                        />
                        {fieldErrors.district && (
                          <p className="text-[11px] font-semibold text-red-600 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 shrink-0 text-red-500" />
                            <span>{fieldErrors.district}</span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700" htmlFor="state">
                          State <span className="text-red-500 font-bold">*</span>
                        </label>
                        <input
                          id="state"
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className={`w-full text-xs p-2.5 rounded-xl border ${
                            fieldErrors.state
                              ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                              : 'border-slate-200 bg-slate-50'
                          } focus:bg-white focus:border-blue-600 outline-hidden font-medium`}
                        />
                        {fieldErrors.state && (
                          <p className="text-[11px] font-semibold text-red-600 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 shrink-0 text-red-500" />
                            <span>{fieldErrors.state}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Branch Preferences */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
                      <BookOpen className="w-4 h-4 text-amber-600" />
                      <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">
                        2. B.Tech Branch Preferences
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700" htmlFor="firstChoice">
                          1st Branch Preference <span className="text-red-500 font-bold">*</span>
                        </label>
                        <select
                          id="firstChoice"
                          name="firstChoice"
                          value={formData.firstChoice}
                          onChange={handleInputChange}
                          className={`w-full text-xs p-2.5 rounded-xl border ${
                            fieldErrors.firstChoice
                              ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                              : 'border-slate-200 bg-slate-50'
                          } focus:bg-white font-medium`}
                        >
                          <option value="CSE - Computer Science & Engineering">CSE - Computer Science &amp; Engineering</option>
                          <option value="CSM - Artificial Intelligence & Machine Learning">CSM - Artificial Intelligence &amp; ML</option>
                          <option value="CSD - Data Science">CSD - Data Science</option>
                          <option value="ECE - Electronics & Communication Engineering">ECE - Electronics &amp; Communication</option>
                          <option value="EEE - Electrical & Electronics Engineering">EEE - Electrical &amp; Electronics</option>
                          <option value="ME - Mechanical Engineering">ME - Mechanical Engineering</option>
                          <option value="CE - Civil Engineering">CE - Civil Engineering</option>
                        </select>
                        {fieldErrors.firstChoice && (
                          <p className="text-[11px] font-semibold text-red-600 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 shrink-0 text-red-500" />
                            <span>{fieldErrors.firstChoice}</span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700" htmlFor="secondChoice">
                          2nd Branch Preference
                        </label>
                        <select
                          id="secondChoice"
                          name="secondChoice"
                          value={formData.secondChoice}
                          onChange={handleInputChange}
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-medium"
                        >
                          <option value="CSM - Artificial Intelligence & Machine Learning">CSM - Artificial Intelligence &amp; ML</option>
                          <option value="CSE - Computer Science & Engineering">CSE - Computer Science &amp; Engineering</option>
                          <option value="CSD - Data Science">CSD - Data Science</option>
                          <option value="ECE - Electronics & Communication Engineering">ECE - Electronics &amp; Communication</option>
                          <option value="EEE - Electrical & Electronics Engineering">EEE - Electrical &amp; Electronics</option>
                          <option value="ME - Mechanical Engineering">ME - Mechanical Engineering</option>
                          <option value="CE - Civil Engineering">CE - Civil Engineering</option>
                        </select>
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-bold text-slate-700">
                          Do you require SREC Campus Hostel Accommodation?
                        </label>
                        <div className="flex items-center gap-6 pt-1">
                          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                            <input
                              type="radio"
                              name="hostelRequired"
                              value="Yes"
                              checked={formData.hostelRequired === 'Yes'}
                              onChange={handleInputChange}
                            />
                            <span>Yes, Campus Hostel Required (Separate Boys &amp; Girls)</span>
                          </label>
                          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                            <input
                              type="radio"
                              name="hostelRequired"
                              value="No"
                              checked={formData.hostelRequired === 'No'}
                              onChange={handleInputChange}
                            />
                            <span>No, Day Scholar (College Bus Transport)</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Academic Qualifications & Entrance */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
                      <GraduationCap className="w-4 h-4 text-emerald-700" />
                      <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">
                        3. Qualifying Examination &amp; Merit
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-bold text-slate-700" htmlFor="interCollege">
                          Intermediate / +2 Junior College Name &amp; Town <span className="text-red-500 font-bold">*</span>
                        </label>
                        <input
                          id="interCollege"
                          type="text"
                          name="interCollege"
                          placeholder="e.g. Narayana / Sri Chaitanya Junior College, Nandyal"
                          value={formData.interCollege}
                          onChange={handleInputChange}
                          className={`w-full text-xs p-2.5 rounded-xl border ${
                            fieldErrors.interCollege
                              ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                              : 'border-slate-200 bg-slate-50'
                          } focus:bg-white focus:border-blue-600 outline-hidden font-medium`}
                        />
                        {fieldErrors.interCollege && (
                          <p className="text-[11px] font-semibold text-red-600 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 shrink-0 text-red-500" />
                            <span>{fieldErrors.interCollege}</span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700" htmlFor="interBoard">
                          Intermediate Board <span className="text-red-500 font-bold">*</span>
                        </label>
                        <select
                          id="interBoard"
                          name="interBoard"
                          value={formData.interBoard}
                          onChange={handleInputChange}
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-medium"
                        >
                          <option value="BIEAP (Andhra Pradesh State Board)">BIEAP (Andhra Pradesh)</option>
                          <option value="TSBIE (Telangana State Board)">TSBIE (Telangana)</option>
                          <option value="CBSE (Central Board)">CBSE (Class XII)</option>
                          <option value="ICSE / ISC">ICSE / ISC</option>
                          <option value="Other Recognized State Board">Other Recognized Board</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700" htmlFor="interPercentage">
                          10+2 MPC Marks / Percentage (%) <span className="text-red-500 font-bold">*</span>
                        </label>
                        <input
                          id="interPercentage"
                          type="text"
                          name="interPercentage"
                          placeholder="e.g. 88.5% or 920/1000"
                          value={formData.interPercentage}
                          onChange={handleInputChange}
                          className={`w-full text-xs p-2.5 rounded-xl border ${
                            fieldErrors.interPercentage
                              ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                              : 'border-slate-200 bg-slate-50'
                          } focus:bg-white focus:border-blue-600 outline-hidden font-medium`}
                        />
                        {fieldErrors.interPercentage && (
                          <p className="text-[11px] font-semibold text-red-600 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 shrink-0 text-red-500" />
                            <span>{fieldErrors.interPercentage}</span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700" htmlFor="entranceExam">
                          Competitive Entrance Exam
                        </label>
                        <select
                          id="entranceExam"
                          name="entranceExam"
                          value={formData.entranceExam}
                          onChange={handleInputChange}
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-medium"
                        >
                          <option value="AP EAPCET">AP EAPCET 2026</option>
                          <option value="JEE Mains">JEE (Mains) 2026</option>
                          <option value="Direct Intermediate Merit">Direct Inter Marks Merit</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700" htmlFor="entranceRank">
                          Entrance Rank <span className="text-slate-400 font-normal">(if qualified)</span>
                        </label>
                        <input
                          id="entranceRank"
                          type="text"
                          name="entranceRank"
                          placeholder="e.g. 24810 or Awaiting Results"
                          value={formData.entranceRank}
                          onChange={handleInputChange}
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 outline-hidden font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Application Fee & Payment Details */}
                  <ApplicationFeePayment
                    baseFee={150}
                    taxPercent={18}
                    applicantName={formData.fullName}
                    applicantMobile={formData.mobile}
                    paymentData={paymentData}
                    hasError={Boolean(fieldErrors.payment)}
                    onPaymentSuccess={(record) => {
                      setPaymentData(record);
                      if (fieldErrors.payment) {
                        setFieldErrors((prev) => {
                          const next = { ...prev };
                          delete next.payment;
                          return next;
                        });
                      }
                      if (formError && !Object.keys(fieldErrors).some((k) => k !== 'payment')) {
                        setFormError('');
                      }
                    }}
                    onResetPayment={() => {
                      setPaymentData(INITIAL_PAYMENT);
                    }}
                  />

                  {/* Declaration & Submission */}
                  <div className="pt-3 border-t border-slate-200 space-y-4">
                    <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer select-none" htmlFor="declaration">
                      <input
                        id="declaration"
                        type="checkbox"
                        checked={declarationAccepted}
                        onChange={(e) => {
                          setDeclarationAccepted(e.target.checked);
                          if (e.target.checked && fieldErrors.declaration) {
                            setFieldErrors((prev) => {
                              const next = { ...prev };
                              delete next.declaration;
                              return next;
                            });
                          }
                        }}
                        className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="leading-relaxed">
                        I hereby declare that all the information provided above is authentic. I wish to apply for B.Tech admission at <strong>Santhiram Engineering College (Autonomous), Nandyal</strong> under Institutional Merit (Category-B) for 2026-2027. <span className="text-red-500 font-bold">*</span>
                      </span>
                    </label>

                    {fieldErrors.declaration && (
                      <p className="text-[11px] font-semibold text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
                        <span>{fieldErrors.declaration}</span>
                      </p>
                    )}

                    {formError && (
                      <div className="p-3.5 bg-red-50 border border-red-300 text-red-800 text-xs rounded-xl font-semibold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                        <span>{formError}</span>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={resetAndCloseModal}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-700 to-[#0B2545] hover:from-blue-800 hover:to-blue-950 text-white font-bold px-7 py-2.5 rounded-xl text-xs shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-75"
                      >
                        {isSubmitting ? (
                          <span>Submitting Application...</span>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Submit B.Tech Application</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
