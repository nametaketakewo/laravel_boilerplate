import NavLink from '@/Components/NavLink';
import { LengthAwarePaginator } from '@/types/paginator';
import { PropsWithChildren } from 'react';

export default function LengthAwarePagination({
    paginator,
    className,
    ...props
}: {
    paginator: LengthAwarePaginator<object>;
    className: string;
}) {
    const {
        first_page_url,
        last_page_url,
        next_page_url,
        prev_page_url,
        current_page,
        last_page,
    } = paginator;

    return (
        <div {...props} className={className}>
            <LinkOrP linkable={prev_page_url !== null} pageUrl={first_page_url}>
                ＜＜ 最初
            </LinkOrP>
            <LinkOrP linkable={prev_page_url !== null} pageUrl={prev_page_url}>
                ＜ 前へ
            </LinkOrP>
            <span className="text-sm">
                {current_page} / {last_page}
            </span>
            <LinkOrP linkable={next_page_url !== null} pageUrl={next_page_url}>
                次へ ＞
            </LinkOrP>
            <LinkOrP linkable={next_page_url !== null} pageUrl={last_page_url}>
                最後 ＞＞
            </LinkOrP>
        </div>
    );
}
function LinkOrP({
    linkable,
    pageUrl,
    children,
}: PropsWithChildren<{ linkable: boolean; pageUrl: string | null }>) {
    if (linkable) {
        return (
            <NavLink href={pageUrl ?? ''} active={false}>
                <p className="text-base">{children}</p>
            </NavLink>
        );
    } else {
        return (
            <button
                disabled
                aria-disabled="true"
                type="button"
                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium leading-5 text-gray-500 transition duration-150 ease-in-out hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700 focus:outline-none dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-gray-300 dark:focus:border-gray-700 dark:focus:text-gray-300"
            >
                <p className="cursor-not-allowed text-base opacity-50">
                    {children}
                </p>
            </button>
        );
    }
}
