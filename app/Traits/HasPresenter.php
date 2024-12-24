<?php

namespace App\Traits;

use App\Presenters\Presenter;

/**
 * @template TPresenter
 * @mixin TPresenter
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
    public Presenter $presenter{
        get {
            return $this->presenter ??= $this::newPresenter();
        }
    }

    /**
     * @return TPresenter
     */
    public function present(): Presenter
    {
        return $this->presenter;
    }

    /**
     * @return TPresenter
     */
    protected function newPresenter(): Presenter
    {
        /**
         * @var class-string<TPresenter> $class
         */
        $class = $this->presenterName ?? 'App\\Presenters\\'. new \ReflectionClass($this)->getShortName().'Presenter';
        return new $class($this);
    }

    /**
     * @param string $method
     * @param array<mixed> $parameters
     */
    public function __call($method, $parameters): mixed
    {
        if (method_exists($this->presenter, $method)) {
            return $this->presenter->$method(...$parameters);
        }
        return parent::__call($method, $parameters);
    }

    /**
     * @param string $key
     */
    public function __get($key): mixed
    {
        if ($this->hasAttribute($key)) {
            return parent::__get($key);
        }
        if (property_exists($this->presenter, $key)) {
            return $this->presenter->$key;
        }
        return parent::__get($key);
    }
}
