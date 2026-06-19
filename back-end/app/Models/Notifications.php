<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notifications extends Model
{
    protected $fillable = [
        'user_id',
        'reference_id',
        'reference_type',
        'title',
        'message',
        'url',
        'type',
        'is_read',
        'send_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}