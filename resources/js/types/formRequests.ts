export type UpdateTodoRequest = {
    name: string;
    description?: string;
    is_done?: string;
};
export type StoreTodoRequest = {
    name: string;
    description?: string;
};
export type ProfileUpdateRequest = {
    name: string;
    email: string;
};
export type LoginRequest = {
    email: string;
    password: string;
};
