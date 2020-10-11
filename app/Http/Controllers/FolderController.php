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
        $folders = Folder::orderBy('updated_at','desc')->limit(30);
        
        if($request->search) {
            $columns = ['color','case_no','case_type','client_name','status','notes','updated_at'];
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
        $this->validate($request, [
            'color' => 'required',
            'case_no' => 'required',
            'client_name' => 'required',
        ]);

        $folder = Folder::create([
            'color' => $request->color,
            'case_no' => $request->case_no,
            'case_type' => $request->case_type,
            'client_name' => $request->client_name,
            'status' => $request->status,
            'notes' => $request->notes,
        ]);

        return response()->json([
            'success' => true,
            'data' => $folder
        ],200);
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

        $updated = $folder->fill($request->all())->save();

        if ($updated)
            return response()->json([
                'success' => true
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
}
