<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoices extends Model
{
    protected $fillable = ['status', 'customer_id', 'staff_id', 'payments_id', 'appointment_date', 'start_time', 'end_time', 'note'];

    public function customer()
    {
        return $this->belongsTo(Customers::class, 'customer_id');
    }

    public function staff()
    {
        return $this->belongsTo(Staffs::class, 'staff_id');
    }
    public function invoiceDetails()
    {
        return $this->hasMany(Invoice_details::class, 'invoice_id');
    }
}
