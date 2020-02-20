<?php
// NOTE: This page is generated automatically; please do not edit it directly. See generate-pages.js
$pageTitle = 'Charts Standalone Gallery: Grouped Bar';
$pageDescription = 'ag-Charts is a highly performant charting library with a clean API to effortlessly create beautiful visualizations.';
$pageKeyboards = 'Javascript Grid Charting';
$pageGroup = 'feature';
include '../documentation-main/documentation_header.php';
define('skipInPageNav', true);
?>

<h1 class="heading">Charts Standalone Gallery: Grouped Bar</h1>

<p class="lead">
    The bar chart represents data as a series of horizontal bars grouped together.
</p>

<?= chart_example('Grouped Bar', 'grouped-bar', 'generated', array('exampleHeight' => '60vh')) ?>

<div class="chart-navigation">
    <a class="chart-navigation__left" href="./simple-bar.php">❮&nbsp;&nbsp;Simple Bar</a>
    <a class="chart-navigation__right" href="./stacked-bar.php">Stacked Bar&nbsp;&nbsp;❯</a>
</div>

<?php include '../documentation-main/documentation_footer.php'; ?>