import { SimplePaginator } from '@/types/paginator';

export default function SimplePagination({
    paginator,
}: {
    paginator: SimplePaginator<object>;
}) {
    return (
        <div className="pagination dark:text-gray-200">{paginator.path}</div>
    );
}
