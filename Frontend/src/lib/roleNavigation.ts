export type UserRole = 'admin' | 'supplier' | 'customer';

/**
 * Returns the destination dashboard path based on the user's role.
 * - Customer -> /dashboard
 * - Admin    -> /admin
 * - Supplier -> /supplier
 */
export function getRoleDashboardPath(role?: string | null): string {
    const normalizedRole = role?.trim().toLowerCase();
    switch (normalizedRole) {
        case 'admin':
            return '/admin';
        case 'supplier':
            return '/supplier';
        case 'customer':
            return '/dashboard';
        default:
            return '/dashboard';
    }
}
