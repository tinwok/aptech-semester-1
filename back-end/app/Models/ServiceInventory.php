<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceInventory extends Model
{
    protected $fillable = ['service_id', 'product_id', 'quantity_used'];
    public function service()
    {
        return $this->belongsTo(Services::class, 'service_id');
    }
    public function product()
    {
        return $this->belongsTo(Services::class, 'product_id');
    }
}
