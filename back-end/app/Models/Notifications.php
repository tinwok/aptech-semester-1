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
        'type',
        'url',
        'is_read',
        'send_at',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'send_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}