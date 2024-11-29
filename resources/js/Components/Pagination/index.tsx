import Paginator, {
    CursorPaginator,
    LengthAwarePaginator,
    SimplePaginator,
} from '@/types/paginator';
import CursorPagination from './CursorPagination';
import LengthAwarePagination from './LengthAwarePagination';
import SimplePagination from './SimplePagination';

export default function Pagination({
    paginator,
    className = '',
    ...props
}: {
    paginator: Paginator<object>;
    className: string;
}) {
    if ('next_cursor' in paginator && 'prev_cursor' in paginator) {
        return (
            <CursorPagination
                paginator={paginator as CursorPaginator<object>}
            />
        );
    }
    if ('links' in paginator) {
        return (
            <LengthAwarePagination
                paginator={paginator as LengthAwarePaginator<object>}
                className={className}
                {...props}
            />
        );
    }
    return (
        <SimplePagination paginator={paginator as SimplePaginator<object>} />
    );
}
