<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tenant extends Model
{
    /** @use HasFactory<\Database\Factories\TenantFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'slug',
        'name',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\hasMany<User, $this>
     */
    public function users(): \Illuminate\Database\Eloquent\Relations\hasMany
    {

        return $this->hasMany(User::class);
    }
}
