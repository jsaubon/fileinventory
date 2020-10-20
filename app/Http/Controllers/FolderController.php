<?php

namespace App\Http\Controllers;

use App\Folder;
use Illuminate\Http\Request;

class FolderController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $folders = Folder::with(['folder_files','user'])->orderBy('updated_at','desc')->limit(30);
        if(isset($request->search)) {
            $columns = ['color','color_no','case_no','case_type','client_name','status','notes','updated_at'];
            foreach($columns as $column)
            {
                $folders->where($column, 'like', '%'.$request->search.'%');
            }
        }
        $folders = $folders->get();

        return response()->json([
            'success' => true,
            'data' => $folders
        ],200);
            
        
         
        

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if($request->action == 'change_color') {
            $folder = Folder::where('color',$request->color)->latest()->first();;
            $number = 1;
            if($folder) {
                 $number = $folder->color_no + 1;
            }
            return response()->json([
                'success' => true,
                'data' => $number
            ]);
        } else {
            $this->validate($request, [
                'color' => 'required',
                'color_no' => 'required',
                'client_name' => 'required',
            ]);
    
            $folder = Folder::create([
                'color' => $request->color,
                'color_no' => $request->color_no,
                'case_no' => $request->case_no,
                'case_type' => $request->case_type,
                'client_name' => $request->client_name,
                'status' => $request->status,
                'notes' => $request->notes,
                'user_id' => auth()->user()->id,
            ]);

            if($request->folder_files) {
                foreach ($request->folder_files as $key => $file) {
                    $files = \App\FolderFile::create([
                        'folder_id' => $folder->id,
                        'file_name' => $file['file_name'],
                        'file_size' => $file['file_size'],
                        'file_path' => $file['file_path'],
                    ]);
                }
            }
    
            return response()->json([
                'success' => true,
                'data' => $folder,
                'request' => $request->all(),
                'files' => $request->folder_files,
            ],200);
        }
        
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $folder = Folder::find($id);


        if (!$folder) {
            return response()->json([
                'success' => false,
                'message' => 'Product with id ' . $id . ' not found'
            ], 400);
        }

        return response()->json([
            'success' => true,
            'data' => $folder
        ],200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $folder = Folder::find($id);

        if (!$folder) {
            return response()->json([
                'success' => false,
                'message' => 'Folder with id ' . $id . ' not found'
            ], 400);
        }


        $folder->color = $request->color;
        $folder->color_no = $request->color_no;
        $folder->case_no = $request->case_no;
        $folder->case_type = $request->case_type;
        $folder->client_name = $request->client_name;
        $folder->status = $request->status;
        $folder->notes = $request->notes;
        $folder->user_id = auth()->user()->id;
        $folder->save();
        
        
        // $updated = $folder->fill($request->all())->save();

        if($request->folder_files) {
            foreach ($request->folder_files as $key => $file) {
                if(!isset($file['id'])) {
                    $files = \App\FolderFile::create([
                        'folder_id' => $folder->id,
                        'file_name' => $file['file_name'],
                        'file_size' => $file['file_size'],
                        'file_path' => $file['file_path'],
                    ]);
                }
            }
        }

        if ($folder)
            return response()->json([
                'success' => true,
                'request' => $request->all()
            ],200);
        else
            return response()->json([
                'success' => false,
                'message' => 'Folder could not be updated'
            ], 500);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $folder = Folder::find($id);

        if (!$folder) {
            return response()->json([
                'success' => false,
                'message' => 'Folder with id ' . $id . ' not found'
            ], 400);
        }

        if ($folder->delete()) {
            return response()->json([
                'success' => true
            ],200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Folder could not be deleted'
            ], 500);
        }
    }

    public function upload(Request $request) {
        if($request->hasFile('file')){
            //Storage::delete('/public/avatars/'.$user->avatar);
            // Get filename with the extension
            $filenameWithExt = $request->file('file')->getClientOriginalName();
            //Get just filename
            $filename = pathinfo($filenameWithExt, PATHINFO_FILENAME);
            // Get just ext
            $extension = $request->file('file')->getClientOriginalExtension();

            $size = $request->file('file')->getClientOriginalExtension();
            // Filename to store
            $fileNameToStore = $filename.'_'.time().'.'.$extension;
            // Upload Image
            $path = $request->file('file')->storeAs('public',$fileNameToStore);
            $size = $request->file('file')->getSize();
            return response()->json([
                'success' => true,
                'data' => [
                    'file_name' => $filenameWithExt,
                    'file_size' => $size,
                    'file_path' => $path,
                ]
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $request->hasFile('file')
        ]);
        
    }
}
