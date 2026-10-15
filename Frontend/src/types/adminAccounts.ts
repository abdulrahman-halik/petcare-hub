export type ManagedAccountType = 'supplier' | 'customer';
export type AccountStatus = 'active' | 'deactivated';

export interface ManagedAccount {
    _id: string;
    role: ManagedAccountType;
    accountId: string | null;
    name: string;
    businessName?: string;
    contactPerson?: string;
    email: string;
    phone: string;
    address: string;
    accountStatus: AccountStatus;
    createdAt: string;
    updatedAt: string;
}

export interface AccountPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface AccountFormData {
    accountId: string;
    name: string;
    businessName: string;
    contactPerson: string;
    email: string;
    password: string;
    phone: string;
    address: string;
}
