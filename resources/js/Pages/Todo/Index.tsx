import NavLink from '@/Components/NavLink';
import Pagination from '@/Components/Pagination';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Todo } from '@/types/model';
import Paginator from '@/types/paginator';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import TodoElement from './Partials/TodoElement';
import TodoForm from './Partials/TodoForm';

export default function Index({
    todoPaginator,
    done,
}: PageProps<{ todoPaginator: Paginator<Todo>; done: boolean | null }>) {
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
    const clearEditingTodo = () => setEditingTodo(null);
    return (
        <AuthenticatedLayout
            header={
                <div className="flex w-full justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Todos -{' '}
                        {done === null ? 'All' : done ? 'Done' : 'UnDone'}
                    </h2>
                    <div className="flex min-w-64 justify-end">
                        <NavLink
                            href={route('todos.index')}
                            active={done === null}
                        >
                            <p className="mx-2 text-xl">All</p>
                        </NavLink>
                        <NavLink
                            href={route('todos.index', { done: false })}
                            active={done === false}
                        >
                            <p className="mx-2 text-xl">UnDone</p>
                        </NavLink>
                        <NavLink
                            href={route('todos.index', { done: true })}
                            active={done === true}
                        >
                            <p className="mx-2 text-xl">Done</p>
                        </NavLink>
                    </div>
                </div>
            }
        >
            <Head title="Todos" />

            <div className="my-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <TodoForm
                        editingTodo={editingTodo}
                        clearEditingTodo={clearEditingTodo}
                    />
                </div>
            </div>

            <div className="my-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 dark:bg-gray-800 sm:rounded-lg sm:p-8">
                        <Pagination
                            paginator={todoPaginator}
                            className="mx-auto mb-4 mt-0 flex max-w-4xl items-center justify-around dark:text-gray-200 sm:mb-4"
                        />
                        <ul className="my-4">
                            {todoPaginator.data.map((todo) => (
                                <li key={todo.id}>
                                    <TodoElement
                                        todo={todo}
                                        editingTodo={editingTodo}
                                        setEditingTodo={setEditingTodo}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
