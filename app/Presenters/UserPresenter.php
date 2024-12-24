<?php

namespace App\Presenters;

/**
 * @extends Presenter<\App\Models\User>
 */
class UserPresenter extends Presenter
{
    public string $email{
        get {
            return $this->model->email;
        }
    }
}
