export interface TeamMember {
    id: string;
    name: string;
    roles: ('ux' | 'backend' | 'frontend')[];
}