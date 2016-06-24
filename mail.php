<?php

$question = isset($_POST['question'])?$_POST['question']:"";
$realname = isset($_POST['realname'])?$_POST['realname']:"";
$country = isset($_POST['country'])?$_POST['country']:"";
$email = isset($_POST['email'])?$_POST['email']:"";
$subject = isset($_POST['subject'])?$_POST['subject']:"";

$recipient = isset($_POST['recipient'])?$_POST['recipient']:"";

/* message */
$message = '
<html>
<head>
<title>Web site contact form.</title>
</head>
<body>
<table>
<tr>
<td colspan="2">To Erwin:</br></br> '.$question.'</br></td>
</tr>
<tr>
<th><div align="left">From:</br> '.$realname.'</div></th></br>
</tr>
<tr>
<td><div align="left">Country: '.$country.'</div></td>
</tr>
<tr>
<th><div align="left">Email: '.$email.'</div></th>
</tr>
</table>
</body>
</html>
';

/* To send HTML mail, you can set the Content-type header. */
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=iso-8859-1\r\n";

/* additional headers */
$headers .= "From: ".$realname." <".$email.">\r\n";
$headers .= "Reply-To: ".$email."\r\n";

/* and now mail it */
mail($recipient, $subject, $message, $headers);
?>

<html>
	<head>
		<title><?php echo $subject; ?></title>
	</head>
<body>
	Thank you your email has been sent, you will now be redirected to our home page.
	<meta http-equiv="refresh" content="1;URL=http://www.erwinweberart.com.au">
</body>
</html>
