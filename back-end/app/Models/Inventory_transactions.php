<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inventory_transactions extends Model
{
    protected $fillable = ['product_id', 'import_price', 'supplier_id', 'invoice_id', 'type', 'quantity', 'note'];
    public function product()
    {
        return $this->belongsTo(Products::class, 'product_id');
    }
    public function supplier()
    {
        return $this->belongsTo(Suppliers::class, 'supplier_id');
    }
    public function invoice()
    {
        return $this->belongsTo(Invoices::class, 'invoice_id');
    }
}
