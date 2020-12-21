<?php

namespace DataStory\Nodes;

use DataStory\Categories\Workflow;
use DataStory\NodeModel;
use DataStory\Parameters\Number;
use DataStory\Parameters\String_;

class Create extends NodeModel
{
    const CATEGORY = Workflow::class;

    const IN_PORTS = [];    

    public static function describeParameters($data = [])
    {
        return [
            String_::make('node_name')->default('Create'),
            Number::make('number_of_features_to_create')->default(10),
        ];
    }

    public function run()
    {
        $this->output(
            collect()->times($this->getParameter('number_of_features_to_create'), function($i) {
                return (object) [
                    'creation_id' => $i
                ];
            })
        );
    }
}