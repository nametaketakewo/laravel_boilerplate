export type Todo = {
    id: number;
    user_id: number;
    name: string;
    description: string;
    is_done: boolean;
    created_at?: string;
    updated_at?: string;
    user?: User;
};
export type User = {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    created_at?: string;
    updated_at?: string;
    todos?: Todo[];
};
