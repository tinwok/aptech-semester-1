<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Products extends Model
{
    protected $fillable = ['name', 'current_quantity', 'import_price', 'retail_price', 'unit', 'status'];
    public function serviceInventory()
    {
        return $this->hasMany(ServiceInventory::class, 'serivce_id');
    }
    public function inventoryTransactions()
    {
        return $this->hasMany(Inventory_transactions::class, 'product_id');
    }
}
