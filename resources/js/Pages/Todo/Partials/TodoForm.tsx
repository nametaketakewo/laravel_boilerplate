import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { StoreTodoRequest, UpdateTodoRequest } from '@/types/formRequests';
import { Todo } from '@/types/model';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function TodoForm({
    editingTodo,
    clearEditingTodo,
}: {
    editingTodo: Todo | null;
    clearEditingTodo: () => void;
}) {
    const { data, setData, post, patch, processing, errors, reset } = useForm<
        | (StoreTodoRequest & { id?: number | null })
        | (UpdateTodoRequest & { id: number })
    >({
        name: '',
        description: '',
    });
    const resetForm = () => {
        reset();
        clearEditingTodo();
    };
    let submit: FormEventHandler;
    if (editingTodo) {
        if (editingTodo.id !== data.id) {
            setData(editingTodo);
        }
        submit = (e) => {
            e.preventDefault();
            patch(route('todos.update', editingTodo), {
                onSuccess: resetForm,
                onError: (e) => {
                    console.log(e);
                },
            });
        };
    } else {
        if (data.id) {
            setData({
                name: '',
                description: '',
            });
        }
        submit = (e) => {
            e.preventDefault();
            post(route('todos.store'), {
                onSuccess: resetForm,
                onError: (e) => {
                    console.log(e);
                },
            });
        };
    }

    return (
        <div className="bg-white p-4 shadow dark:bg-gray-800 sm:rounded-lg sm:p-8">
            <form onSubmit={submit} onReset={resetForm}>
                <div className="flex">
                    <InputLabel className="flex-auto">
                        <TextInput
                            id="new-todo-name"
                            type="text"
                            name="new-todo-name"
                            value={data.name}
                            required
                            placeholder={editingTodo ? data.name : 'New Todo'}
                            className="mt-1 block w-full dark:placeholder-gray-500"
                            maxLength={255}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                    </InputLabel>
                    <PrimaryButton
                        type="submit"
                        className="ms-4"
                        disabled={processing}
                    >
                        <p className="mx-auto">
                            {editingTodo ? 'Update' : 'Create'}
                        </p>
                    </PrimaryButton>
                    <SecondaryButton
                        type="reset"
                        className="ms-4 min-w-24"
                        disabled={processing}
                    >
                        <p className="mx-auto">
                            {editingTodo ? 'Cancel' : 'Reset'}
                        </p>
                    </SecondaryButton>
                </div>

                <div className="items-center">
                    <textarea
                        id="new-todo-description"
                        name="new-todo-description"
                        maxLength={1000}
                        value={data.description}
                        placeholder={
                            editingTodo ? data.description : 'Description'
                        }
                        className="mt-5 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:placeholder-gray-500 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                        onChange={(e) => setData('description', e.target.value)}
                    ></textarea>
                </div>
                <InputError message={errors.name} className="mt-2" />
            </form>
        </div>
    );
}
