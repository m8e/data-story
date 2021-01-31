<?php

namespace DataStory\Tests\Feature;

use DataStory\Tests\TestCase;

class FakeModelTest extends TestCase
{
    public function test_fake_models()
    {
        $this->assertInstanceOf(
            \Illuminate\Database\Eloquent\Builder::class,
            \App\Models\User::query()
        );
    }
}