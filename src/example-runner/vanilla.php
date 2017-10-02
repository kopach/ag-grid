<?php
include 'utils.php';

$exampleDir = basename($_GET['example']);
$exampleSection = basename($_GET['section']);
$multi = isset($_GET['multi']);
$generated = isset($_GET['generated']);
$preview = isset($_GET['preview']);
$gridDefaults = getGridSettings();

if ($multi) {
    $path = path_combine('..', $exampleSection, $exampleDir, 'vanilla');
} else {
    $path = path_combine('..', $exampleSection, $exampleDir);
}

$files = getDirContents($path);

$scripts = array();
$styles = array();

foreach ($files as $file) {
    $filePath = path_combine($path, $file);
    $info = pathinfo($filePath);
    switch ($info['extension']) {
    case 'js':
        $scripts[] = $preview ? $file : $filePath;
        break;
    case 'css':
        $styles[] = $preview ? $file : $filePath;
        break;
    }
}
?>
<?php if ($generated) { echo '<!DOCTYPE html>'; } ?>
<html>
<head>
<?php if (!$preview) { ?>
    <style> html, body { margin: 0; padding: 0; height: 100%; } </style>
<?php } ?>
<?php renderExampleExtras($_GET) ?>
<?= globalAgGridScript(isset($_GET["enterprise"])) ?>

<?php renderStyles($styles); ?>
</head>
<body>

<?php
if ($generated) {
?>
    <div id="myGrid" style="height: <?= $gridDefaults['height'] ?>; width: <?= $gridDefaults['width'] ?>" class="<?= $gridDefaults['theme'] ?>"></div>
<?
} else {
    include path_combine($path, 'index.html');
}
echo "\n";
foreach ($scripts as $script) {
echo '    <script src="'.$script.'"></script>' . "\n";
}
?>
</body>
</html>
