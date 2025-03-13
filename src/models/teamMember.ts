export interface TeamMember {
    id: string;
    name: string;
    roles: ('ux' | 'dev backend' | 'dev frontend')[];
}