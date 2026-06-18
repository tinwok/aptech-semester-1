<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoices extends Model
{
    protected $fillable = [
        'status',
        'customer_id',
        'staff_id',
        'payment_id',
        'appointment_date',
        'start_time',
        'end_time',
        'note',
    ];

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

    public function inventoryTransactions()
    {
        return $this->hasMany(Inventory_transactions::class, 'invoice_id');
    }

    public function payment()
    {
        return $this->belongsTo(Payments::class, 'payment_id');
    }

    public function feedbacks()
    {
        return $this->hasOne(FeedBack::class, 'invoice_id');
    }
}