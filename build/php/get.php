<?php

class Get
{
    public function GetRequest()
    {
        $dir = __DIR__;
        $table = file_get_contents("{$dir}/base/table.json");
    }
}

Main();
function Main()
{
    $get = new Get();
    $get->GetRequest();
}