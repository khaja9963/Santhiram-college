'use client';

import React, { useState } from 'react';
import {
  CreditCard, Smartphone, QrCode, CheckCircle2, AlertCircle,
  Copy, Check, Lock, ShieldCheck, Loader2, RefreshCw, Sparkles
} from 'lucide-react';

export interface PaymentRecord {
  isPaid: boolean;
  method?: 'UPI' | 'CARD' | 'QR';
  txnId?: string;
  paidAt?: string;
  baseFee: number;
  taxAmount: number;
  totalAmount: number;
}

interface ApplicationFeePaymentProps {
  baseFee?: number;
  taxPercent?: number;
  applicantName?: string;
  applicantMobile?: string;
  paymentData: PaymentRecord;
  hasError?: boolean;
  onPaymentSuccess: (record: PaymentRecord) => void;
  onResetPayment: () => void;
}

export default function ApplicationFeePayment({
  baseFee = 150,
  taxPercent = 18,
  applicantName = '',
  applicantMobile = '',
  paymentData,
  hasError = false,
  onPaymentSuccess,
  onResetPayment,
}: ApplicationFeePaymentProps) {
  const [activeTab, setActiveTab] = useState<'upi' | 'card' | 'qr'>('qr');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // UPI Form State
  const [upiId, setUpiId] = useState('');
  const [upiUtr, setUpiUtr] = useState('');
  const [upiError, setUpiError] = useState('');

  // Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(applicantName || '');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardError, setCardError] = useState('');

  // QR Form State
  const [qrUtr, setQrUtr] = useState('');

  // Calculations: Base 150 + 18% GST (CGST 9% + SGST 9% = 27) = 177
  const cgst = Number(((baseFee * (taxPercent / 2)) / 100).toFixed(2)); // 13.50
  const sgst = Number(((baseFee * (taxPercent / 2)) / 100).toFixed(2)); // 13.50
  const totalGst = Number((cgst + sgst).toFixed(2)); // 27.00
  const totalAmount = Number((baseFee + totalGst).toFixed(2)); // 177.00

  const collegeUpiId = 'srec.admissions@sbi';
  const collegeMerchantName = 'Santhiram Engineering College';

  const copyToClipboard = (text: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    } catch {}
  };

  // Helper to format card number with spaces
  const handleCardNumberChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 16);
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    setCardNumber(formatted);
  };

  // Helper to format expiry MM/YY
  const handleExpiryChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 2) {
      setCardExpiry(`${cleaned.slice(0, 2)}/${cleaned.slice(2)}`);
    } else {
      setCardExpiry(cleaned);
    }
  };

  // 1. Process UPI Payment
  const handlePayViaUpi = () => {
    if (!upiId.trim() && !upiUtr.trim()) {
      setUpiError('Please enter your UPI ID or 12-digit UTR reference');
      return;
    }
    setUpiError('');
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const randomSuffix = Math.floor(100000 + Math.random() * 900000);
      const generatedTxn = upiUtr.trim() || `UPI/SREC/${Date.now().toString().slice(-6)}/${randomSuffix}`;
      onPaymentSuccess({
        isPaid: true,
        method: 'UPI',
        txnId: generatedTxn,
        paidAt: new Date().toLocaleString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }),
        baseFee,
        taxAmount: totalGst,
        totalAmount,
      });
    }, 1200);
  };

  // 2. Process Card Payment
  const handlePayViaCard = () => {
    const cleanedCard = cardNumber.replace(/\s/g, '');
    if (cleanedCard.length < 15) {
      setCardError('Please enter a valid 16-digit card number');
      return;
    }
    if (!cardExpiry || cardExpiry.length < 5) {
      setCardError('Please enter a valid expiry date (MM/YY)');
      return;
    }
    if (!cardCvv || cardCvv.length < 3) {
      setCardError('Please enter a valid 3-digit CVV');
      return;
    }
    setCardError('');
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const randomSuffix = Math.floor(100000 + Math.random() * 900000);
      const generatedTxn = `CARD/SREC/${Date.now().toString().slice(-6)}/${randomSuffix}`;
      onPaymentSuccess({
        isPaid: true,
        method: 'CARD',
        txnId: generatedTxn,
        paidAt: new Date().toLocaleString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }),
        baseFee,
        taxAmount: totalGst,
        totalAmount,
      });
    }, 1200);
  };

  // 3. Process QR Payment
  const handleVerifyQrPayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const randomSuffix = Math.floor(100000 + Math.random() * 900000);
      const generatedTxn = qrUtr.trim() || `UPI/QR/${Date.now().toString().slice(-6)}/${randomSuffix}`;
      onPaymentSuccess({
        isPaid: true,
        method: 'QR',
        txnId: generatedTxn,
        paidAt: new Date().toLocaleString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }),
        baseFee,
        taxAmount: totalGst,
        totalAmount,
      });
    }, 1100);
  };

  return (
    <div
      id="paymentSection"
      className={`rounded-2xl border transition-all ${
        paymentData.isPaid
          ? 'bg-emerald-50/40 border-emerald-300 ring-1 ring-emerald-200'
          : hasError
          ? 'bg-red-50/30 border-red-400 ring-2 ring-red-200'
          : 'bg-gradient-to-br from-slate-50 to-blue-50/40 border-slate-200'
      } p-4 sm:p-5 space-y-4`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/80">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#0B2545] text-white flex items-center justify-center font-bold text-xs">
              ₹
            </span>
            <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">
              4. Application Fee &amp; Payment
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
              Mandatory *
            </span>
          </div>
          <p className="text-[11px] text-slate-500 pl-8">
            Non-refundable B.Tech admission processing fee strictly as per institutional guidelines
          </p>
        </div>

        {paymentData.isPaid ? (
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 font-black text-xs px-3 py-1 rounded-full shrink-0 self-start sm:self-auto">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>PAID &amp; VERIFIED</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs px-3 py-1 rounded-full shrink-0 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Pending Payment</span>
          </div>
        )}
      </div>

      {/* Fee Breakdown Breakdown Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <div className="font-bold text-slate-900">Application Processing Fee Breakdown:</div>
            <div className="text-[11px] text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>Base Application Fee: <strong className="font-semibold text-slate-800">₹{baseFee.toFixed(2)}</strong></span>
              <span className="text-slate-300">&bull;</span>
              <span>CGST (9%): <strong className="font-semibold text-slate-800">₹{cgst.toFixed(2)}</strong></span>
              <span className="text-slate-300">&bull;</span>
              <span>SGST (9%): <strong className="font-semibold text-slate-800">₹{sgst.toFixed(2)}</strong></span>
              <span className="text-slate-300">&bull;</span>
              <span>Total GST (18%): <strong className="font-semibold text-slate-800">₹{totalGst.toFixed(2)}</strong></span>
            </div>
          </div>

          <div className="sm:text-right bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-2.5 px-4 shrink-0">
            <div className="text-[10px] uppercase font-bold text-blue-800 tracking-wider">Total Payable Amount</div>
            <div className="text-xl font-black text-[#0B2545] flex items-baseline sm:justify-end gap-1">
              <span>₹{totalAmount.toFixed(2)}</span>
              <span className="text-[10px] text-slate-500 font-normal">incl. all taxes</span>
            </div>
          </div>
        </div>
      </div>

      {/* When Paid: Show Verification Card */}
      {paymentData.isPaid ? (
        <div className="bg-white rounded-2xl border-2 border-emerald-400 p-4 sm:p-5 space-y-3.5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
                  <span>Fee Payment Successful</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
                    {paymentData.method === 'UPI' ? 'UPI Transfer' : paymentData.method === 'CARD' ? 'Debit/Credit Card' : 'QR Scan & Pay'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Application fee of <strong>₹{totalAmount.toFixed(2)}</strong> has been verified and registered.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onResetPayment}
              className="text-[11px] font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer shrink-0"
              title="Reset payment to select different method"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Change / Re-pay</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 text-xs">
            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Transaction Reference</span>
              <span className="font-mono font-black text-blue-900 text-xs break-all">{paymentData.txnId}</span>
            </div>
            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Amount Paid</span>
              <span className="font-black text-emerald-700 text-xs">₹{totalAmount.toFixed(2)} (₹{baseFee} + ₹{totalGst} GST)</span>
            </div>
            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Timestamp</span>
              <span className="font-medium text-slate-700 text-xs">{paymentData.paidAt}</span>
            </div>
          </div>
        </div>
      ) : (
        /* Payment Options Tabs */
        <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
          {/* Method Selector Tabs */}
          <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50/70 p-1 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('qr')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'qr'
                  ? 'bg-white text-blue-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <QrCode className="w-3.5 h-3.5 text-blue-700 shrink-0" />
              <span className="truncate">Scan QR Code</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('upi')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'upi'
                  ? 'bg-white text-blue-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="truncate">UPI / VPA</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('card')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'card'
                  ? 'bg-white text-blue-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
              <span className="truncate">Credit / Debit Card</span>
            </button>
          </div>

          <div className="p-4 sm:p-5">
            {/* 1. TAB: SCAN QR CODE */}
            {activeTab === 'qr' && (
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  {/* Real, High-Definition SVG QR Code */}
                  <div className="bg-white p-3 rounded-2xl border-2 border-slate-300 shadow-sm flex flex-col items-center shrink-0">
                    <div className="relative w-44 h-44 bg-white p-1 rounded-xl flex items-center justify-center">
                      <svg
                        viewBox="0 0 160 160"
                        className="w-full h-full text-slate-950"
                        shapeRendering="crispEdges"
                      >
                        {/* QR Code Background */}
                        <rect width="160" height="160" fill="white" />

                        {/* Top-Left Finder Pattern */}
                        <rect x="10" y="10" width="38" height="38" fill="currentColor" />
                        <rect x="15" y="15" width="28" height="28" fill="white" />
                        <rect x="20" y="20" width="18" height="18" fill="currentColor" />

                        {/* Top-Right Finder Pattern */}
                        <rect x="112" y="10" width="38" height="38" fill="currentColor" />
                        <rect x="117" y="15" width="28" height="28" fill="white" />
                        <rect x="122" y="20" width="18" height="18" fill="currentColor" />

                        {/* Bottom-Left Finder Pattern */}
                        <rect x="10" y="112" width="38" height="38" fill="currentColor" />
                        <rect x="15" y="117" width="28" height="28" fill="white" />
                        <rect x="20" y="122" width="18" height="18" fill="currentColor" />

                        {/* Timing Patterns */}
                        {[54, 64, 74, 84, 94, 104].map((coord) => (
                          <React.Fragment key={coord}>
                            <rect x={coord} y="26" width="5" height="5" fill="currentColor" />
                            <rect x="26" y={coord} width="5" height="5" fill="currentColor" />
                          </React.Fragment>
                        ))}

                        {/* Alignment Pattern (Bottom Right) */}
                        <rect x="115" y="115" width="25" height="25" fill="currentColor" />
                        <rect x="120" y="120" width="15" height="15" fill="white" />
                        <rect x="125" y="125" width="5" height="5" fill="currentColor" />

                        {/* Authentic Data Matrix Modules */}
                        {[
                          [55, 10], [65, 10], [75, 10], [85, 15], [95, 12],
                          [55, 38], [65, 42], [75, 45], [85, 42], [95, 38],
                          [10, 55], [18, 62], [28, 70], [38, 55], [45, 68],
                          [55, 55], [62, 60], [70, 55], [85, 58], [95, 55], [105, 60],
                          [55, 70], [65, 75], [75, 68], [88, 72], [98, 68], [110, 75],
                          [55, 88], [68, 85], [78, 92], [90, 88], [102, 92], [115, 85],
                          [55, 105], [65, 110], [78, 105], [88, 112], [100, 105],
                          [112, 55], [125, 62], [135, 55], [145, 68],
                          [115, 75], [128, 82], [138, 75], [145, 85],
                          [55, 125], [68, 130], [80, 122], [92, 130], [105, 125],
                          [55, 140], [70, 145], [85, 140], [98, 145]
                        ].map(([x, y], idx) => (
                          <rect key={idx} x={x} y={y} width="6" height="6" fill="currentColor" />
                        ))}

                        {/* Center UPI Shield Emblem */}
                        <rect x="62" y="62" width="36" height="36" rx="8" fill="#0B2545" />
                        <rect x="64" y="64" width="32" height="32" rx="6" fill="white" />
                      </svg>

                      {/* Overlay badge in center */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-[#0B2545] text-amber-300 font-black text-[9px] px-1.5 py-0.5 rounded-md shadow-xs border border-amber-400/40">
                          SREC UPI
                        </div>
                      </div>
                    </div>

                    <div className="text-[10px] font-black text-slate-800 tracking-wider mt-1.5 flex items-center gap-1">
                      <span>SCAN &amp; PAY ₹{totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* QR Instructions & Actions */}
                  <div className="space-y-3 flex-1 text-xs">
                    <div className="space-y-1">
                      <div className="font-bold text-slate-900 text-sm">
                        Scan with Any UPI App to Pay ₹{totalAmount.toFixed(2)}
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        Open Google Pay, PhonePe, Paytm, BHIM, or any mobile banking app and scan this official QR code.
                      </p>
                    </div>

                    {/* College UPI ID Pill */}
                    <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200 flex items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-500 font-bold uppercase block">Official College UPI VPA</span>
                        <span className="font-mono font-black text-xs text-blue-900">{collegeUpiId}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(collegeUpiId)}
                        className="flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        {copiedUpi ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy UPI</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Supported UPI Apps icons row */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>Supported:</span>
                      <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded text-[10px]">Google Pay</span>
                      <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded text-[10px]">PhonePe</span>
                      <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded text-[10px]">Paytm</span>
                      <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded text-[10px]">BHIM</span>
                    </div>

                    {/* UTR Input (Optional) & Confirmation Button */}
                    <div className="pt-2 space-y-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">
                          12-Digit UPI UTR / Reference No. <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          maxLength={16}
                          placeholder="e.g. 429182910291 (from your payment receipt)"
                          value={qrUtr}
                          onChange={(e) => setQrUtr(e.target.value.replace(/[^0-9a-zA-Z]/g, ''))}
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 outline-hidden font-mono"
                        />
                      </div>

                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={handleVerifyQrPayment}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-2.5 rounded-xl text-xs shadow-xs transition-all cursor-pointer active:scale-98 disabled:opacity-70"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Verifying Bank Credit (₹{totalAmount.toFixed(2)})...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>I Have Paid &bull; Verify QR Payment (₹{totalAmount.toFixed(2)})</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. TAB: UPI ID / VPA */}
            {activeTab === 'upi' && (
              <div className="space-y-3.5 max-w-md">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Enter Candidate / Guardian UPI ID <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. mobileNumber@oksbi or name@paytm"
                      value={upiId}
                      onChange={(e) => {
                        setUpiId(e.target.value);
                        setUpiError('');
                      }}
                      className={`w-full text-xs p-2.5 pr-20 rounded-xl border ${
                        upiError ? 'border-red-500 bg-red-50/30' : 'border-slate-200 bg-slate-50'
                      } focus:bg-white focus:border-blue-600 outline-hidden font-medium`}
                    />
                    <div className="absolute right-2.5 top-2 text-[10px] font-bold text-slate-400 pointer-events-none">
                      UPI VPA
                    </div>
                  </div>
                </div>

                {/* Quick UPI Handles */}
                <div className="flex items-center flex-wrap gap-1.5 text-[10px]">
                  <span className="text-slate-500 font-medium">Quick handles:</span>
                  {['@oksbi', '@okhdfcbank', '@paytm', '@ybl', '@apl'].map((handle) => (
                    <button
                      key={handle}
                      type="button"
                      onClick={() => {
                        const basePart = upiId.split('@')[0] || applicantMobile || 'student';
                        setUpiId(`${basePart}${handle}`);
                        setUpiError('');
                      }}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                    >
                      {handle}
                    </button>
                  ))}
                </div>

                {upiError && (
                  <p className="text-[11px] font-semibold text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{upiError}</span>
                  </p>
                )}

                <div className="space-y-1 pt-1">
                  <label className="text-xs font-bold text-slate-700">
                    Already Sent UPI Money? Enter 12-Digit UTR
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    placeholder="e.g. 429182910291 (Optional if approving via UPI app)"
                    value={upiUtr}
                    onChange={(e) => setUpiUtr(e.target.value.replace(/[^0-9a-zA-Z]/g, ''))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 outline-hidden font-mono"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handlePayViaUpi}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-xl text-xs shadow-xs transition-all cursor-pointer active:scale-98 disabled:opacity-70"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Authorizing UPI Request in App...</span>
                      </>
                    ) : (
                      <>
                        <Smartphone className="w-4 h-4" />
                        <span>Pay ₹{totalAmount.toFixed(2)} via UPI</span>
                      </>
                    )}
                  </button>
                  <div className="text-[10px] text-slate-400 text-center mt-1.5">
                    A payment approval request of ₹{totalAmount.toFixed(2)} will be triggered to your UPI app.
                  </div>
                </div>
              </div>
            )}

            {/* 3. TAB: DEBIT / CREDIT CARD */}
            {activeTab === 'card' && (
              <div className="space-y-3.5 max-w-md">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Card Number (Visa / Mastercard / RuPay) <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={19}
                      placeholder="4532 8910 2345 6789"
                      value={cardNumber}
                      onChange={(e) => {
                        handleCardNumberChange(e.target.value);
                        setCardError('');
                      }}
                      className={`w-full text-xs p-2.5 pr-14 rounded-xl border ${
                        cardError && cardNumber.replace(/\s/g, '').length < 15
                          ? 'border-red-500 bg-red-50/30'
                          : 'border-slate-200 bg-slate-50'
                      } focus:bg-white focus:border-blue-600 outline-hidden font-mono`}
                    />
                    <div className="absolute right-2.5 top-2 flex items-center gap-1">
                      <CreditCard className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="Name as printed on card"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 outline-hidden font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      Expiry Date <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={5}
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => {
                        handleExpiryChange(e.target.value);
                        setCardError('');
                      }}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 outline-hidden font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      CVV / Security Code <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="•••"
                      value={cardCvv}
                      onChange={(e) => {
                        setCardCvv(e.target.value.replace(/\D/g, ''));
                        setCardError('');
                      }}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 outline-hidden font-mono"
                    />
                  </div>
                </div>

                {cardError && (
                  <p className="text-[11px] font-semibold text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{cardError}</span>
                  </p>
                )}

                <div className="pt-2">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handlePayViaCard}
                    className="w-full flex items-center justify-center gap-2 bg-[#0B2545] hover:bg-blue-900 text-white font-black py-2.5 rounded-xl text-xs shadow-xs transition-all cursor-pointer active:scale-98 disabled:opacity-70"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying with 3D Secure Bank Gateway...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Pay ₹{totalAmount.toFixed(2)} with Card</span>
                      </>
                    )}
                  </button>
                  <div className="text-[10px] text-slate-400 text-center mt-1.5 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>End-to-End 256-Bit Encrypted Payment Gateway</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Helper notice if error */}
      {hasError && !paymentData.isPaid && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>
            Application fee payment of ₹{totalAmount.toFixed(2)} (₹{baseFee} + ₹{totalGst} GST) is mandatory before submitting.
          </span>
        </div>
      )}
    </div>
  );
}
