<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Suppliers extends Model
{
    protected $fillable = ['name', 'phone', 'email'];
    public function inventoryTransactions()
    {
        return $this->hasMany(Inventory_transactions::class, 'supplier_id');
    }
}
