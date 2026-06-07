<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Auth extends Model
{
    protected $fillable = [
        'phone',
        'email',
        'password',
        'role',
        'must_change_password',
    ];
}
