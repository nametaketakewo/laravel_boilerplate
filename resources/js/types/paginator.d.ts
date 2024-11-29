export default interface Paginator<T extends object> {
    data: T[];
    next_page_url: ?string;
    prev_page_url: ?string;
    path: string;
    per_page: number;
}

export interface SimplePaginator<T extends object> extends Paginator<T> {
    current_page: number;
    first_page_url: string;
    from: ?number;
    to: ?number;
}

export interface LengthAwarePaginator<T extends object>
    extends SimplePaginator<T> {
    last_page: number;
    last_page_url: string;
    links: { url: ?string; label: string; active: boolean }[];
    total: number;
}

export interface CursorPaginator<T extends object> extends Paginator<T> {
    next_cursor: ?string;
    prev_cursor: ?string;
}
