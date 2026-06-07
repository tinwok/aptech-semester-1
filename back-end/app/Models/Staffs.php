<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Staffs extends Model
{
    protected $fillable = ['user_id', 'position', 'salary', 'shift', 'status'];
    public function users()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function customers()
    {
        return $this->hasMany(Customers::class, 'preferred_staff_id');
    }
    public function invoice()
    {
        return $this->hasMany(Invoices::class, 'staff_id');
    }
}
