<?php

namespace App\Presenters;

use Illuminate\Database\Eloquent\Model;

/**
 * @template TModel of Model
 * @mixin TModel
 */
abstract class Presenter
{
    /**
     * @param TModel $model
     */
    public function __construct(protected Model $model)
    {
    }
}
