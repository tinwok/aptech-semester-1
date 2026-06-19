<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payments extends Model
{
    protected $fillable = [
        'invoice_id',
        'total_amount',
        'payment_method',
        'payment_status',
    ];

    public function invoice()
    {
        return $this->belongsTo(Invoices::class, 'invoice_id');
    }
}