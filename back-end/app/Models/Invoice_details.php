<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice_details extends Model
{
    protected $fillable = ['invoice_id', 'service_id', 'unit_price', 'discount', 'subtotal'];
    public function invoice()
    {
        return $this->belongsTo(Invoices::class, 'invoice_id');
    }
    public function service()
    {
        return $this->belongsTo(Services::class, 'service_id');
    }
}
