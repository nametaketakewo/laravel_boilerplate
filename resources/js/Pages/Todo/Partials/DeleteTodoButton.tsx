import DangerButton from '@/Components/DangerButton';
import { Todo } from '@/types/model';
import { useForm } from '@inertiajs/react';
import { MouseEventHandler } from 'react';

export default function DeleteTodoButton({
    className = '',
    todo,
    editingTodo,
    setEditingTodo,
}: {
    className: string;
    todo: Todo;
    editingTodo: Todo | null;
    setEditingTodo: (todo: Todo | null) => void;
}) {
    const {
        data,
        processing,
        reset,
        delete: destroy,
    } = useForm({
        id: todo.id,
    });
    const resetForm = () => {
        reset();
        if (data.id === editingTodo?.id) {
            setEditingTodo(null);
        }
    };
    const click: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
        destroy(route('todos.destroy', todo), {
            onFinish: resetForm,
            preserveScroll: true,
        });
    };

    return (
        <DangerButton
            className={
                'bg-red-300 hover:bg-red-600 hover:text-white dark:bg-red-950 dark:hover:bg-red-500 dark:hover:text-black ' +
                className
            }
            type="button"
            onClick={click}
            disabled={processing || editingTodo !== null}
        >
            <p className="mx-auto">Delete</p>
        </DangerButton>
    );
}
