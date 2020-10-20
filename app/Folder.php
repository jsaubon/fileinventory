<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Folder extends Model
{
    protected $guarded = [];

    public function folder_files() {
        return $this->hasMany('App\FolderFile','folder_id');
    }

    public function user() {
        return $this->belongsTo('App\User','user_id');
    }
}
