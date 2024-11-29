import SecondaryButton from '@/Components/SecondaryButton';
import DeleteTodoButton from '@/Pages/Todo/Partials/DeleteTodoButton';
import { Todo } from '@/types/model';
import { Dispatch, SetStateAction, useState } from 'react';
import DoneCheckbox from './DoneCheckbox';

export default function TodoElement({
    todo,
    editingTodo,
    setEditingTodo,
}: {
    todo: Todo;
    editingTodo: Todo | null;
    setEditingTodo: Dispatch<SetStateAction<Todo | null>>;
}) {
    const [showingDescriptionDropdown, setShowingDescriptionDropdown] =
        useState<boolean>(false);
    return (
        <div className="my-6">
            <div className="flex border-2 border-solid bg-white p-4 shadow dark:border-gray-500 dark:bg-gray-800 sm:rounded-lg sm:p-8">
                <div className="ml-4 mr-8 content-center">
                    <DoneCheckbox todo={todo}></DoneCheckbox>
                </div>
                <h4 className="flex-auto content-center text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {todo.name}
                </h4>

                <span className="inline-flex rounded-md">
                    <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                        onClick={() =>
                            setShowingDescriptionDropdown(
                                !showingDescriptionDropdown,
                            )
                        }
                    >
                        <svg
                            className="-me-0.5 ms-2 h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </span>
            </div>

            <div
                className={
                    'm-3 mt-0 flex justify-between border-2 p-4 shadow dark:border-gray-700 sm:rounded-b-lg sm:p-8' +
                    (showingDescriptionDropdown ? ' block' : ' hidden')
                }
            >
                <div>
                    <p className="mr-6 flex-auto text-sm text-gray-600 dark:text-gray-400">
                        {todo.description}
                    </p>
                </div>
                <div>
                    <SecondaryButton
                        type="button"
                        className="mx-0 my-2 min-w-24 sm:mx-2"
                        disabled={editingTodo !== null}
                        onClick={() => {
                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth',
                            });
                            setEditingTodo(todo);
                        }}
                    >
                        <p className="mx-auto">edit</p>
                    </SecondaryButton>
                    <DeleteTodoButton
                        className="mx-0 my-2 min-w-24 sm:mx-2"
                        todo={todo}
                        editingTodo={editingTodo}
                        setEditingTodo={setEditingTodo}
                    />
                </div>
            </div>
        </div>
    );
}
