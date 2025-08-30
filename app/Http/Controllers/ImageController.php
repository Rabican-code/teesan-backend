<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\File;

class ImageController extends Controller
{
    public function show($type, $filename)
    {
        $path = storage_path("app/public/{$type}/{$filename}");

        if (!Storage::disk('public')->exists("{$type}/{$filename}")) {
            abort(404);
        }

        $file = Storage::disk('public')->get("{$type}/{$filename}");
                $mimeType = File::mimeType($path);

        $response = Response::make($file, 200);
        $response->header("Content-Type", $mimeType);

        return $response;
    }
}
