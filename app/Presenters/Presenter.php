<?php

namespace App\Presenters;

use Illuminate\Database\Eloquent\Model;

/**
 * @template TModel of Model
 */
abstract class Presenter
{
    /**
     * @param TModel $model
     */
    public function __construct(protected Model $model)
    {
    }

    /**
     * @param non-empty-string $method
     * @param array<mixed> $parameters
     * @return mixed
     */
    public function __call(string $method, array $parameters): mixed
    {
        return $this->model->$method(...$parameters);
    }

    /**
     * @param non-empty-string $key
     * @return mixed
     */
    public function __get(string $key): mixed
    {
        return $this->model->$key;
    }
}
