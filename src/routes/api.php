<?php

use DataStory\Diagram;
use DataStory\Models\Story;
use DataStory\Support\SimpleFile;
use Illuminate\Support\Facades\Route;

Route::post('datastory/api/boot', function() {
    return [
        'status'    => 200,
        'stories'   => Story::all(),
        'dataStoryCapabilities' => Diagram::capabilities(),
        'serializedModel' => request()->input('context') ? file_get_contents(
            app_path("DataStory/stories/demo.story")
        ) : null,
    ];
});

Route::post('datastory/api/run', function() {
    $diagram = Diagram::deserialize(
        json_decode(request()->input('model'))
    );

    $diagram->registerGlobal()->run();

    return [
        'status' => 200,
        'diagram' => $diagram,
        'logs' => [],
        'executionTime' => 0.31,
    ];
});

Route::post('datastory/api/save', function() {
    $filename = request()->input('filename'); 
    $content = request()->input('model');

    SimpleFile::put(
        config('data-story.stories-dir') . '/' . $filename . '.json',
        $content
    );
});