<?php

namespace App\Traits;

use App\Presenters\Presenter;

/**
 * @template TPresenter of Presenter
 */
trait HasPresenter
{
    /**
     * @var ?class-string<TPresenter>
     */
    public ?string $presenterName;

    /**
     * @var TPresenter
     */
    private Presenter $presenter;

    /**
     * @var TPresenter
     */
    public function present(): Presenter
    {
        return $this->presenter ??= $this::newPresenter();
    }

    /**
     * @return TPresenter
     */
    public function newPresenter(): Presenter
    {
        /**
         * @var class-string<TPresenter> $class
         */
        $class = $this->presenterName ?? 'App\\Presenters\\'.(new \ReflectionClass($this))->getShortName().'Presenter';
        return new $class($this);
    }
}
