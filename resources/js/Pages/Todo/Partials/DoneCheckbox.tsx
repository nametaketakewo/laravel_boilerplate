import Checkbox from '@/Components/Checkbox';
import { Todo } from '@/types/model';
import { router } from '@inertiajs/react';
import { ChangeEventHandler, useState } from 'react';

export default function DoneCheckbox({ todo }: { todo: Todo }) {
    const [state, setState] = useState({
        done: todo.is_done,
        processing: false,
    });
    const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setState({
            done: e.target.checked,
            processing: true,
        });
        router.patch(
            route('todos.update', todo),
            {
                is_done: e.target.checked,
            },
            {
                onFinish: () =>
                    setState({ done: e.target.checked, processing: false }),
                preserveScroll: true,
            },
        );
    };
    return (
        <form>
            <Checkbox
                name="is_done"
                checked={state.done}
                onChange={onChange}
                className="scale-150"
                disabled={state.processing}
            />
        </form>
    );
}
