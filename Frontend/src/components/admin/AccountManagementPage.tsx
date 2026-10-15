'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
    Building2,
    ChevronLeft,
    ChevronRight,
    Eye,
    Pencil,
    Plus,
    RefreshCw,
    Search,
    ShieldCheck,
    Trash2,
    UserRound,
    UserRoundCheck,
    UserRoundX,
    X
} from 'lucide-react';
import { isAxiosError } from 'axios';
import axios from '@/lib/axiosConfig';
import { useAuth } from '@/context/AuthContext';
import AccountFormModal from '@/components/admin/AccountFormModal';
import type { AccountFormData, AccountPagination, AccountStatus, ManagedAccount, ManagedAccountType } from '@/types/adminAccounts';

interface AccountManagementPageProps {
    accountType: ManagedAccountType;
}

const initialPagination: AccountPagination = { page: 1, limit: 20, total: 0, totalPages: 1 };

const getErrorMessage = (error: unknown, fallback: string) => {
    if (isAxiosError(error)) {
        const message = error.response?.data?.message;
        if (typeof message === 'string') return message;
    }
    return fallback;
};

const formatDate = (value: string) => new Intl.DateTimeFormat(undefined, {
    year: 'numeric', month: 'short', day: 'numeric'
}).format(new Date(value));

const StatusBadge = ({ status }: { status: AccountStatus }) => (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide ${status === 'active'
        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
        : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
        {status === 'active' ? 'Active' : 'Deactivated'}
    </span>
);

export default function AccountManagementPage({ accountType }: AccountManagementPageProps) {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const pluralType = accountType === 'supplier' ? 'suppliers' : 'customers';
    const singularLabel = accountType === 'supplier' ? 'Supplier' : 'Customer';
    const isSupplier = accountType === 'supplier';

    const [accounts, setAccounts] = useState<ManagedAccount[]>([]);
    const [pagination, setPagination] = useState<AccountPagination>(initialPagination);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [status, setStatus] = useState<'all' | AccountStatus>('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [formAccount, setFormAccount] = useState<ManagedAccount | null | undefined>(undefined);
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [details, setDetails] = useState<ManagedAccount | null>(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsError, setDetailsError] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const loadAccounts = useCallback(async (requestedPage = 1) => {
        try {
            setLoading(true);
            setError('');
            const { data } = await axios.get(`/admin/accounts/${pluralType}`, {
                params: { page: requestedPage, limit: 20, status, search: debouncedSearch.trim() || undefined }
            });
            setAccounts(data.data.accounts || []);
            setPagination(data.data.pagination || initialPagination);
        } catch (requestError) {
            setError(getErrorMessage(requestError, `Unable to load ${pluralType}. Please refresh and try again.`));
        } finally {
            setLoading(false);
        }
    }, [pluralType, debouncedSearch, status]);

    useEffect(() => {
        if (!authLoading) {
            if (!user) router.replace('/login');
            else if (user.role !== 'admin') router.replace('/');
        }
    }, [authLoading, router, user]);

    useEffect(() => {
        if (user?.role === 'admin') loadAccounts(1);
    }, [loadAccounts, user]);

    const clearFilters = () => {
        setSearch('');
        setDebouncedSearch('');
        setStatus('all');
        setPagination((current) => ({ ...current, page: 1 }));
    };

    const openDetails = async (account: ManagedAccount) => {
        setDetails(account);
        setDetailsError('');
        setDetailsLoading(true);
        try {
            const { data } = await axios.get(`/admin/accounts/${pluralType}/${account._id}`);
            setDetails(data.data.account);
        } catch (requestError) {
            setDetailsError(getErrorMessage(requestError, 'Unable to refresh this account profile.'));
        } finally {
            setDetailsLoading(false);
        }
    };

    const saveAccount = async (values: AccountFormData) => {
        const payload: Record<string, string> = {
            email: values.email,
            phone: values.phone,
            address: values.address
        };
        if (values.accountId.trim()) payload.accountId = values.accountId;
        if (isSupplier) {
            payload.businessName = values.businessName;
            payload.contactPerson = values.contactPerson;
        } else {
            payload.name = values.name;
        }
        if (!formAccount) {
            payload.password = values.password;
        } else if (values.password && values.password.trim()) {
            payload.password = values.password.trim();
        }

        try {
            setIsSubmitting(true);
            setFormError('');
            const response = formAccount
                ? await axios.put(`/admin/accounts/${pluralType}/${formAccount._id}`, payload)
                : await axios.post(`/admin/accounts/${pluralType}`, payload);
            setFormAccount(undefined);
            setNotice(response.data.message || `${singularLabel} account saved successfully.`);
            await loadAccounts(formAccount ? pagination.page : 1);
        } catch (requestError) {
            setFormError(getErrorMessage(requestError, `Unable to save this ${singularLabel.toLowerCase()} account.`));
        } finally {
            setIsSubmitting(false);
        }
    };

    const changeStatus = async (account: ManagedAccount) => {
        const nextStatus: AccountStatus = account.accountStatus === 'active' ? 'deactivated' : 'active';
        const action = nextStatus === 'active' ? 'reactivate' : 'deactivate';
        if (!window.confirm(`Are you sure you want to ${action} ${account.name}? This takes effect immediately.`)) return;

        try {
            setError('');
            const { data } = await axios.patch(`/admin/accounts/${pluralType}/${account._id}/status`, { status: nextStatus });
            setNotice(data.message || `Account ${nextStatus === 'active' ? 'reactivated' : 'deactivated'} successfully.`);
            await loadAccounts();
        } catch (requestError) {
            setError(getErrorMessage(requestError, `Unable to ${action} this account.`));
        }
    };

    const deleteAccount = async (account: ManagedAccount) => {
        if (!window.confirm(`Permanently delete ${account.name}? This will remove this ${singularLabel.toLowerCase()} account and its associated records. This cannot be undone.`)) return;

        try {
            setError('');
            const { data } = await axios.delete(`/admin/accounts/${pluralType}/${account._id}`);
            setNotice(data.message || 'Account deleted successfully.');
            const nextPage = accounts.length === 1 && pagination.page > 1 ? pagination.page - 1 : pagination.page;
            await loadAccounts(nextPage);
        } catch (requestError) {
            setError(getErrorMessage(requestError, 'This account could not be deleted.'));
        }
    };

    const recordSummary = useMemo(() => `${pagination.total} ${pagination.total === 1 ? 'account' : 'accounts'}`, [pagination.total]);
    const Icon = isSupplier ? Building2 : UserRound;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                        <ShieldCheck className="h-4 w-4" />
                        Account administration
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">{singularLabel} Management</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Search accounts, maintain accurate profile information, and safely manage access status.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button onClick={() => { setNotice(''); setFormError(''); setFormAccount(null); }} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-xs transition-colors hover:bg-emerald-700">
                        <Plus className="h-4 w-4" /> Add {singularLabel}
                    </button>
                    <button onClick={() => loadAccounts()} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-bold text-gray-700 shadow-xs hover:bg-gray-50 disabled:opacity-60" title={`Refresh ${pluralType}`}>
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        <span className="hidden sm:inline">Refresh</span>
                    </button>
                </div>
            </div>

            <section className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-xs">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                        <input value={search} onChange={(event) => { setSearch(event.target.value); setPagination((current) => ({ ...current, page: 1 })); }} placeholder={`Search by name, email, or ${singularLabel.toLowerCase()} ID…`} className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 transition-all focus:bg-white" />
                    </div>
                    <div className="flex items-center gap-3">
                        <select value={status} onChange={(event) => { setStatus(event.target.value as 'all' | AccountStatus); setPagination((current) => ({ ...current, page: 1 })); }} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-semibold text-gray-700">
                            <option value="all">All statuses</option>
                            <option value="active">Active</option>
                            <option value="deactivated">Deactivated</option>
                        </select>
                        {(search || status !== 'all') && <button onClick={clearFilters} className="text-sm font-bold text-emerald-700 hover:text-emerald-800">Clear</button>}
                    </div>
                </div>
            </section>

            {notice && <div role="status" className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800"><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss success message"><X className="h-4 w-4" /></button></div>}
            {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</div>}

            <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xs">
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                    <div className="flex items-center gap-3"><div className="rounded-xl bg-emerald-50 p-2 text-emerald-700"><Icon className="h-4 w-4" /></div><div><h2 className="font-extrabold text-gray-900">{singularLabel} accounts</h2><p className="text-xs text-gray-500">{recordSummary} matching the current criteria</p></div></div>
                    <span className="text-xs font-semibold text-gray-500">Page {pagination.page} of {pagination.totalPages}</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] text-left text-sm">
                        <thead className="border-b border-gray-200 bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-500"><tr><th className="px-5 py-3.5">Account</th><th className="px-5 py-3.5">Contact</th><th className="px-5 py-3.5">ID & registration</th><th className="px-5 py-3.5">Status</th><th className="px-5 py-3.5 text-right">Actions</th></tr></thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? <tr><td colSpan={5} className="px-5 py-16 text-center text-sm font-medium text-gray-400">Loading {pluralType}…</td></tr>
                                : accounts.length === 0 ? <tr><td colSpan={5} className="px-5 py-16 text-center"><p className="font-bold text-gray-700">No {pluralType} found</p><p className="mt-1 text-sm text-gray-500">Try another search or add a new {singularLabel.toLowerCase()} account.</p></td></tr>
                                    : accounts.map((account) => <tr key={account._id} className="transition-colors hover:bg-gray-50/70">
                                        <td className="px-5 py-4"><p className="font-bold text-gray-900">{isSupplier ? account.businessName || account.name : account.name}</p>{isSupplier && <p className="mt-0.5 text-xs text-gray-500">Contact: {account.contactPerson || 'Not provided'}</p>}</td>
                                        <td className="px-5 py-4"><p className="font-medium text-gray-800">{account.email}</p><p className="mt-0.5 text-xs text-gray-500">{account.phone || 'No phone number'}</p></td>
                                        <td className="px-5 py-4"><p className="font-mono text-xs font-semibold text-gray-700">{account.accountId || 'Legacy account'}</p><p className="mt-0.5 text-xs text-gray-500">Joined {formatDate(account.createdAt)}</p></td>
                                        <td className="px-5 py-4"><StatusBadge status={account.accountStatus} /></td>
                                        <td className="px-5 py-4"><div className="flex justify-end gap-1.5"><button onClick={() => openDetails(account)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800" title="View account details" aria-label={`View ${account.name}`}><Eye className="h-4 w-4" /></button><button onClick={() => { setNotice(''); setFormError(''); setFormAccount(account); }} className="rounded-lg p-2 text-gray-500 hover:bg-emerald-50 hover:text-emerald-700" title="Edit account" aria-label={`Edit ${account.name}`}><Pencil className="h-4 w-4" /></button><button onClick={() => changeStatus(account)} className={`rounded-lg p-2 ${account.accountStatus === 'active' ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-700 hover:bg-emerald-50'}`} title={account.accountStatus === 'active' ? 'Deactivate account' : 'Reactivate account'} aria-label={account.accountStatus === 'active' ? `Deactivate ${account.name}` : `Reactivate ${account.name}`}>{account.accountStatus === 'active' ? <UserRoundX className="h-4 w-4" /> : <UserRoundCheck className="h-4 w-4" />}</button><button onClick={() => deleteAccount(account)} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50" title="Delete eligible account" aria-label={`Delete ${account.name}`}><Trash2 className="h-4 w-4" /></button></div></td>
                                    </tr>)}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs font-medium text-gray-500">Showing {accounts.length} of {pagination.total} records</p><div className="flex gap-2"><button onClick={() => loadAccounts(pagination.page - 1)} disabled={pagination.page <= 1 || loading} className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-45"><ChevronLeft className="h-3.5 w-3.5" />Previous</button><button onClick={() => loadAccounts(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages || loading} className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-45">Next<ChevronRight className="h-3.5 w-3.5" /></button></div></div>
            </section>

            {formAccount !== undefined && <AccountFormModal accountType={accountType} account={formAccount} isSubmitting={isSubmitting} error={formError} onClose={() => { if (!isSubmitting) setFormAccount(undefined); }} onSave={saveAccount} />}

            {details && <div className="fixed inset-0 z-[60] overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="account-details-title"><div className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm" onClick={() => setDetails(null)} aria-hidden="true" /><div className="relative min-h-full px-4 py-6 sm:flex sm:items-center sm:justify-center"><div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"><div className="flex items-start justify-between border-b border-gray-100 px-5 py-4 sm:px-6"><div><p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Account details</p><h2 id="account-details-title" className="mt-0.5 text-lg font-extrabold text-gray-900">{isSupplier ? details.businessName || details.name : details.name}</h2></div><button onClick={() => setDetails(null)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700" aria-label="Close account details"><X className="h-5 w-5" /></button></div><div className="px-5 py-5 sm:px-6">{detailsError && <p role="alert" className="mb-4 rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{detailsError}</p>}{detailsLoading ? <p className="py-10 text-center text-sm text-gray-400">Loading account profile…</p> : <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2"><Detail label={isSupplier ? 'Supplier ID' : 'Customer ID'} value={details.accountId || 'Not assigned'} /><Detail label="Account status" value={<StatusBadge status={details.accountStatus} />} /><Detail label="Email" value={details.email} /><Detail label="Phone number" value={details.phone || 'Not provided'} />{isSupplier && <><Detail label="Business name" value={details.businessName || details.name} /><Detail label="Contact person" value={details.contactPerson || 'Not provided'} /></>}<Detail label="Registration date" value={formatDate(details.createdAt)} /><Detail label="Address" value={details.address || 'Not provided'} fullWidth /></div>}</div><div className="flex justify-end border-t border-gray-100 bg-gray-50 px-5 py-4 sm:px-6"><button onClick={() => setDetails(null)} className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100">Close</button></div></div></div></div>}
        </div>
    );
}

function Detail({ label, value, fullWidth = false }: { label: string; value: ReactNode; fullWidth?: boolean }) {
    return <div className={fullWidth ? 'sm:col-span-2' : ''}><p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{label}</p><div className="mt-1 break-words text-sm font-semibold text-gray-800">{value}</div></div>;
}
