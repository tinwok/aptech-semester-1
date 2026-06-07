<?php

namespace App\Services;

use Cloudinary\Cloudinary;

class CloudinaryService
{
    protected Cloudinary $cloudinary;

    public function __construct()
    {
        $this->cloudinary = new Cloudinary([
            'cloud' => [
                'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                'api_key'    => env('CLOUDINARY_API_KEY'),
                'api_secret' => env('CLOUDINARY_API_SECRET'),
            ]
        ]);
    }

    /**
     * Upload file lên Cloudinary
     */
    public function upload($file, string $folder = null)
    {
        $options = [];

        if ($folder) {
            $options['folder'] = $folder;
        }

        $result = $this->cloudinary
            ->uploadApi()
            ->upload($file->getRealPath(), $options);

        return [
            'url' => $result['secure_url'],
            'public_id' => $result['public_id'],
        ];
    }

    /**
     * Xoá ảnh trên Cloudinary
     */
    public function delete(string $publicId)
    {
        return $this->cloudinary
            ->uploadApi()
            ->destroy($publicId);
    }
}
