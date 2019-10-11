<?php

    header('Content-type: text/html; charset=utf-8 \r\n');

    $name = empty($_POST['name'])? null : $_POST['name'];
    $phone = empty($_POST['phone'])? null : $_POST['phone'];
    $otk = empty($_POST['otk'])? null : $_POST['otk'];
    $kuda = empty($_POST['kuda'])? null : $_POST['kuda'];
    $ves = empty($_POST['ves'])? null : $_POST['ves'];
    $gaba = empty($_POST['gaba'])? null : $_POST['gaba'];

    $message = '
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
    <title>Заявка с сайта БТД</title>
    </head>
    <body>
    <h1>Заявка с сайта БТД</h1>';

	
    if ($name) {
        $message .= '<strong>Имя: </strong>'.$name.'<br>';
    }
    if ($phone) {
        $message .= '<strong>Телефон: </strong>'.$phone.'<br>';
    }
    if ($otk) {
        $message .= '<strong>Откуда: </strong>'.$otk.'<br>';
    }
    if ($kuda) {
        $message .= '<strong>Куда: </strong>'.$kuda.'<br>';
    }
    if ($ves) {
        $message .= '<strong>Вес: </strong>'.$ves.'<br>';
    }
    if ($gaba) {
        $message .= '<strong>Габариты: </strong>'.$gaba.'<br>';
    }

    $message .= '</body>
    </html>';

    
    $subject = "Заявка с сайта БТД";
    $headers = "Content-type: text/html; charset=utf-8 \r\n";
    $headers .='From: admin@no-reply.ru' . "\r\n";
    
    $to = "seregapsd@gmail.com";
    $result = mail($to, $subject, $message, $headers);
    
    if ($result)
    {
        echo json_encode(array('status' => true));
    }
    else
    {
        echo json_encode(array('status' => false));
    }
?>


