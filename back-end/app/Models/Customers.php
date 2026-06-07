<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customers extends Model
{
    protected $fillable = ['user_id', 'preferences', 'allergies', 'preferred_staff_id'];
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function preferred_staff()
    {
        return $this->belongsTo(Staffs::class, 'preferred_staff_id');
    }
    public function invoices()
    {
        return $this->hasMany(Invoices::class, 'customer_id');
    }
}
