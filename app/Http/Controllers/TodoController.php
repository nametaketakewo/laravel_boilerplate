<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTodoRequest;
use App\Http\Requests\UpdateTodoRequest;
use App\Models\Todo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TodoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): \Inertia\Response
    {
        $done = $request->validate([
            'done' => 'nullable|boolean',
        ])['done'] ?? null;
        $done = is_null($done) ? null : (bool)$done;
        $q = $request->user()->todos()->latest('id');
        $q = match ($done) {
            true => $q->done(),
            false => $q->done(false),
            default => $q,
        };
        return Inertia::render('Todo/Index', [
            'todoPaginator' => $q->paginate(10)->withQueryString(),
            'done' => $done,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTodoRequest $request): \Illuminate\Http\RedirectResponse
    {
        $request->user()->todos()->create($request->collect()->filter()->all());
        return redirect(action([self::class, 'index']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTodoRequest $request, Todo $todo): \Illuminate\Http\RedirectResponse
    {
        $todo->update($request->validated());
        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Todo $todo): \Illuminate\Http\RedirectResponse
    {
        $todo->delete();
        return redirect()->back();
    }
}
