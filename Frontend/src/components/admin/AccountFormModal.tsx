'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Building2, Save, UserRound, X } from 'lucide-react';
import type { AccountFormData, ManagedAccount, ManagedAccountType } from '@/types/adminAccounts';

interface AccountFormModalProps {
    accountType: ManagedAccountType;
    account: ManagedAccount | null;
    isSubmitting: boolean;
    error: string;
    onClose: () => void;
    onSave: (values: AccountFormData) => Promise<void>;
}

const emptyForm: AccountFormData = {
    accountId: '',
    name: '',
    businessName: '',
    contactPerson: '',
    email: '',
    password: '',
    phone: '',
    address: ''
};

export default function AccountFormModal({
    accountType,
    account,
    isSubmitting,
    error,
    onClose,
    onSave
}: AccountFormModalProps) {
    const isSupplier = accountType === 'supplier';
    const isEditing = Boolean(account);
    const [form, setForm] = useState<AccountFormData>(emptyForm);
    const [clientError, setClientError] = useState('');

    useEffect(() => {
        setClientError('');
        setForm(account ? {
            accountId: account.accountId || '',
            name: account.name,
            businessName: account.businessName || account.name,
            contactPerson: account.contactPerson || '',
            email: account.email,
            password: '',
            phone: account.phone || '',
            address: account.address || ''
        } : emptyForm);
    }, [account]);

    const updateField = (field: keyof AccountFormData, value: string) => {
        setClientError('');
        setForm((current) => ({ ...current, [field]: value }));
    };

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const displayName = isSupplier ? form.businessName : form.name;
        if (!displayName.trim() || (isSupplier && !form.contactPerson.trim()) || !form.email.trim() || !form.phone.trim()) {
            setClientError('Please complete every required field.');
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
            setClientError('Please provide a valid email address.');
            return;
        }
        if (!/^[0-9+().\-\s]{7,30}$/.test(form.phone.trim())) {
            setClientError('Please provide a valid phone number (7-30 characters).');
            return;
        }
        if (!isEditing && form.password.length < 8) {
            setClientError('Temporary password must be at least 8 characters long.');
            return;
        }
        if (isEditing && form.password.trim() && form.password.trim().length < 8) {
            setClientError('Password must be at least 8 characters long if provided.');
            return;
        }
        await onSave(form);
    };

    const visibleError = clientError || error;
    const Icon = isSupplier ? Building2 : UserRound;
    const title = `${isEditing ? 'Edit' : 'Add'} ${isSupplier ? 'Supplier' : 'Customer'}`;

    return (
        <div className="fixed inset-0 z-[60] overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="account-form-title">
            <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm" onClick={isSubmitting ? undefined : onClose} aria-hidden="true" />
            <div className="relative min-h-full px-4 py-6 sm:flex sm:items-center sm:justify-center">
                <form onSubmit={submit} className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                    <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4 sm:px-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                                <Icon className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 id="account-form-title" className="text-lg font-extrabold text-gray-900">{title}</h2>
                                <p className="text-xs text-gray-500">
                                    {isEditing ? 'Update account information. Role and status stay administrator-controlled.' : 'Create a secure, active account. An ID is generated when left blank.'}
                                </p>
                            </div>
                        </div>
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50" aria-label="Close form">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="max-h-[calc(100vh-11rem)] overflow-y-auto px-5 py-5 sm:px-6">
                        {visibleError && (
                            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700" role="alert">
                                {visibleError}
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                {isSupplier ? 'Supplier ID' : 'Customer ID'} <span className="font-normal text-gray-400">(optional)</span>
                                <input value={form.accountId} onChange={(event) => updateField('accountId', event.target.value)} maxLength={50} placeholder="Generated automatically" className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900" />
                            </label>
                            <label className="block text-sm font-semibold text-gray-700">
                                Email <span className="text-rose-600">*</span>
                                <input required type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} maxLength={254} autoComplete="email" className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900" />
                            </label>

                            {isSupplier ? (
                                <>
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Business name <span className="text-rose-600">*</span>
                                        <input required value={form.businessName} onChange={(event) => updateField('businessName', event.target.value)} maxLength={160} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900" />
                                    </label>
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Contact person <span className="text-rose-600">*</span>
                                        <input required value={form.contactPerson} onChange={(event) => updateField('contactPerson', event.target.value)} maxLength={120} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900" />
                                    </label>
                                </>
                            ) : (
                                <label className="block text-sm font-semibold text-gray-700 sm:col-span-2">
                                    Full name <span className="text-rose-600">*</span>
                                    <input required value={form.name} onChange={(event) => updateField('name', event.target.value)} maxLength={120} autoComplete="name" className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900" />
                                </label>
                            )}

                            <label className="block text-sm font-semibold text-gray-700">
                                Phone number <span className="text-rose-600">*</span>
                                <input required type="tel" value={form.phone} onChange={(event) => updateField('phone', event.target.value)} maxLength={30} autoComplete="tel" className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900" />
                            </label>
                            {isEditing ? (
                                <label className="block text-sm font-semibold text-gray-700">
                                    Reset password <span className="font-normal text-gray-400">(optional)</span>
                                    <input type="password" value={form.password} onChange={(event) => updateField('password', event.target.value)} minLength={8} placeholder="Leave blank to keep current" autoComplete="new-password" className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900" />
                                </label>
                            ) : (
                                <label className="block text-sm font-semibold text-gray-700">
                                    Temporary password <span className="text-rose-600">*</span>
                                    <input required type="password" value={form.password} onChange={(event) => updateField('password', event.target.value)} minLength={8} autoComplete="new-password" className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900" />
                                </label>
                            )}
                            <label className="block text-sm font-semibold text-gray-700 sm:col-span-2">
                                Address
                                <textarea value={form.address} onChange={(event) => updateField('address', event.target.value)} maxLength={500} rows={3} className="mt-1.5 w-full resize-y rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900" />
                            </label>
                        </div>
                    </div>

                    <div className="flex flex-col-reverse gap-2 border-t border-gray-100 bg-gray-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-50">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
                            <Save className="h-4 w-4" />
                            {isSubmitting ? 'Saving…' : isEditing ? 'Save changes' : `Create ${isSupplier ? 'supplier' : 'customer'}`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
