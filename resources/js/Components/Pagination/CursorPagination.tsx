import { CursorPaginator } from '@/types/paginator';

export default function CursorPagination({
    paginator,
}: {
    paginator: CursorPaginator<object>;
}) {
    return (
        <div className="pagination dark:text-gray-200">{paginator.path}</div>
    );
}
