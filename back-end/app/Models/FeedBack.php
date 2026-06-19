<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeedBack extends Model
{
    protected $fillable = ['invoice_id', 'rating', 'comment'];

    public function invoice()
    {
        return $this->belongsTo(Invoices::class, 'invoice_id');
    }

    public function invoices()
    {
        return $this->belongsTo(Invoices::class, 'invoice_id');
    }
}