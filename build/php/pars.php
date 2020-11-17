<?php
include 'simple_html_dom.php';
header('Content-type: application/json');

class Collector
{
    protected simple_html_dom $html;

    /**
     * Собирает с целевого сайта страницу
     * @param string $url Цель
     * @param string $referer Откуда пришёл
     * @param string $device Устройство
     * @return array Возвращает массив с кодом запроса и страницей
     */
    public function collecting(string $url, string $referer, string $device) : array
    {
    $curl = curl_init(); //запуск сеанса
    curl_setopt($curl, CURLOPT_USERAGENT, $device);
    curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1); // Автоматом идём по редиректам
    curl_setopt ($curl, CURLOPT_SSL_VERIFYPEER, 0); // Не проверять SSL сертификат
    curl_setopt ($curl, CURLOPT_SSL_VERIFYHOST, 0); // Не проверять Host SSL сертификата
    curl_setopt($curl, CURLOPT_REFERER, $referer); // Откуда пришли
    curl_setopt($curl, CURLOPT_URL, $url);/*указываем адрес страницы с помощью опции CURLOPT_URL*/
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);/*CURLOPT_RETURNTRANSFER при ненулевом значении результат будет возвращен, а не выведен.*/
    $result['html'] = curl_exec($curl);//выполнение запроса
    $info = curl_getinfo($curl);
    curl_close($curl);//закрытие сеанса
    return $data = [$result, $info];
    }
    public function __construct()
    {
        $this->html = new simple_html_dom();
    }
}
class CollectorFirst extends Collector
{
    /**
     * Сохраняет массив с данными в json файл
     * @param array $html
     * @return void
     */
    public function save(array $html) : void
    {
        $dir = __DIR__;

        $json = json_encode( array(
            'ckod'=>$html[0],
            'bkod'=>$html[1],
            'name'=>$html[2],
            'amount'=>$html[3],
            'course'=>$html[4]),
            JSON_UNESCAPED_UNICODE);

        file_put_contents("{$dir}/base/table.json", json_encode($json));

        $file = file_get_contents("{$dir}/base/table.json");
        $taskList = json_decode($file , true, JSON_OBJECT_AS_ARRAY);
        $conversionToArray = json_decode($taskList,true);
        print_r($conversionToArray);
        unset($file);
    }

    /**
     * Из html строки собирает массив с данными
     * @param string $html html строка
     * @return array Возвращает массив в котором таблица сформированная из html строки
     */
    public function handler(string $html) : array
    {
        $this->html->load($html);
        $tabe = $this->html->find('tr');
        $table =
            [
                [], //Цкод
                [], //Бкод
                [], //имя
                [], //количество
                [] //курс
            ];
//        $g = count($tabe);
        print "{$html}\n \n";

        for ($i = 0; $i < count($tabe)-1; ++$i)
        {
            $table[0][$i] = $tabe[$i]->find('span', 0)->innertext;
            $table[1][$i] = $tabe[$i]->find('span', 1)->innertext;
            $table[2][$i] = $tabe[$i]->find('td', 1)->innertext;
            $table[2][$i]= preg_replace('~<span class="gray">.*?</span>~','', $table[2][$i]);
            $table[3][$i] = $tabe[$i]->find('span', 2)->innertext;
            $table[4][$i] = $tabe[$i]->find('td', 2)->innertext;
        }

        for ($ii = 0; $ii < count($table); ++$ii)
        {
            for ($iii = 0; $iii < 7; ++$iii)
            {
                unset($table[$ii][$iii]);
            }
        }
//        print_r($table);
        return $table;
    }
}

Main();
function Main()
{
    $col = new CollectorFirst();
    $data = $col->collecting('https://www.alta.ru/currency/',
        "https://yandex.ru/search/?text=валюты%20стран%20мира%20ъ&lr=213&clid=1955453&win=461",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:71.0) Gecko/20100101 Firefox/72.0");

    if ($data[1]['http_code'] == 200 || $data[1]['http_code'] == 400)
    {
        print "Успех! Мы их сделали, нам ответели: : {$data[1]["http_code"]}\n";
        $col->save($col->handler($data[0]["html"]));
    }
    else
    {
        print "Сэр! Нас послали, сказав нам на последок: {$data[1]["http_code"]}\n";
    }

}
