'use client';

import React from 'react';
import { Truck, Lock, AlertCircle } from 'lucide-react';

export interface Address {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
}

interface AddressFieldsProps {
    values: Address;
    onChange: (v: Address) => void;
    title?: string;
}

function AddressFields({ values, onChange, title }: AddressFieldsProps) {
    return (
        <div className="space-y-4">
            {title && <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>}
            <div className="grid grid-cols-2 gap-3">
                {(['firstName', 'lastName'] as const).map((field) => (
                    <input
                        key={field}
                        placeholder={field === 'firstName' ? 'First Name *' : 'Last Name *'}
                        required
                        value={values[field]}
                        onChange={(e) => onChange({ ...values, [field]: e.target.value })}
                        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/15 bg-white text-slate-900"
                    />
                ))}
            </div>
            <input
                placeholder="Street Address *"
                required
                value={values.address}
                onChange={(e) => onChange({ ...values, address: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/15 bg-white text-slate-900"
            />
            <div className="grid grid-cols-2 gap-3">
                <input
                    placeholder="City *"
                    required
                    value={values.city}
                    onChange={(e) => onChange({ ...values, city: e.target.value })}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/15 bg-white text-slate-900"
                />
                <input
                    placeholder="State / Province"
                    value={values.state}
                    onChange={(e) => onChange({ ...values, state: e.target.value })}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/15 bg-white text-slate-900"
                />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <input
                    placeholder="Postal Code *"
                    required
                    value={values.postalCode}
                    onChange={(e) => onChange({ ...values, postalCode: e.target.value })}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/15 bg-white text-slate-900"
                />
                <input
                    placeholder="Country *"
                    required
                    value={values.country}
                    onChange={(e) => onChange({ ...values, country: e.target.value })}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/15 bg-white text-slate-900"
                />
            </div>
            <input
                placeholder="Phone Number"
                value={values.phone}
                onChange={(e) => onChange({ ...values, phone: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/15 bg-white text-slate-900"
            />
        </div>
    );
}

interface CheckoutAddressStepProps {
    shipping: Address;
    onShippingChange: (v: Address) => void;
    billing: Address;
    onBillingChange: (v: Address) => void;
    sameAsShipping: boolean;
    onSameAsShippingChange: (v: boolean) => void;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
    error: string;
}

export default function CheckoutAddressStep({
    shipping,
    onShippingChange,
    billing,
    onBillingChange,
    sameAsShipping,
    onSameAsShippingChange,
    onSubmit,
    loading,
    error
}: CheckoutAddressStepProps) {
    return (
        <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 space-y-6">
            <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <Truck className="w-5 h-5 text-[#047857]" />
                <span>Shipping Information</span>
            </div>

            <AddressFields values={shipping} onChange={onShippingChange} />

            <div className="pt-2 border-t border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                    <input
                        type="checkbox"
                        checked={sameAsShipping}
                        onChange={(e) => onSameAsShippingChange(e.target.checked)}
                        className="w-4 h-4 accent-[#047857]"
                    />
                    <span>Billing address is the same as shipping</span>
                </label>
            </div>

            {!sameAsShipping && (
                <AddressFields values={billing} onChange={onBillingChange} title="Billing Information" />
            )}

            {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-100">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#047857] hover:bg-[#065f46] active:bg-[#064e3b] text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-xs cursor-pointer"
            >
                {loading ? 'Preparing Checkout...' : <><Lock className="w-4 h-4" /> Continue to Payment</>}
            </button>
        </form>
    );
}
