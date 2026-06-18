<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payments extends Model
{
    protected $fillable = [
        'total_amount',
        'payment_method',
        'payment_status',
    ];

    public function invoice()
    {
        return $this->hasOne(Invoices::class, 'payment_id');
    }
}