<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Services extends Model
{
    protected $fillable = [
        'title',
        'description',
        'price',
        'duration_minutes',
        'status',
        'note',
        'image_url'
    ];
    public function invoiceDetails()
    {
        return $this->hasMany(Invoice_details::class, 'service_id');
    }
    public function serviceInventories()
    {
        return $this->hasMany(ServiceInventory::class, 'service_id');
    }
}
