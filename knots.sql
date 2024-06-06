-- phpMyAdmin SQL Dump
-- version 4.3.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jun 03, 2024 at 01:15 PM
-- Server version: 5.6.24
-- PHP Version: 5.6.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `knot_editor`
--

-- --------------------------------------------------------

--
-- Table structure for table `knots`
--

CREATE TABLE IF NOT EXISTS `knots` (
  `id` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `json` text NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `knots`
--

INSERT INTO `knots` (`id`, `name`, `json`) VALUES
(9, 'Trefoil', '{"points":[{"x":510,"y":452,"isUpper":false,"color":"#ac8a23"},{"x":373,"y":277,"isUpper":false,"color":"#1057c8"},{"x":547,"y":143,"isUpper":true,"color":"#1057c8"},{"x":719,"y":208,"isUpper":true,"color":"#6a1e07","ispotion":true},{"x":657,"y":436,"isUpper":false,"color":"#6a1e07","ismain":true},{"x":580,"y":594,"isUpper":false,"color":"#ecac71"},{"x":312,"y":481,"isUpper":false,"color":"#ecac71"},{"x":404,"y":334,"isUpper":true,"color":"#76644f"},{"x":550,"y":340,"isUpper":false,"color":"#76644f"},{"x":801,"y":301,"isUpper":false,"color":"#768d9a"},{"x":833,"y":462,"isUpper":true,"color":"#768d9a"},{"x":667,"y":557,"isUpper":1,"color":"#3a5ea1"},{"x":510,"y":452,"isUpper":1,"color":"#3a5ea1"}],"closed":true}');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `knots`
--
ALTER TABLE `knots`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `knots`
--
ALTER TABLE `knots`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=10;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
