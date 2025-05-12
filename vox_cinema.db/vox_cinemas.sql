-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 10, 2025 at 11:07 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vox_cinemas`
--

-- --------------------------------------------------------

--
-- Table structure for table `auditoriums`
--

CREATE TABLE `auditoriums` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `type` enum('standard','vip','imax','dolby') NOT NULL DEFAULT 'standard',
  `capacity` int(11) NOT NULL,
  `rows` int(11) NOT NULL,
  `seats_per_row` int(11) NOT NULL,
  `vip_rows` varchar(255) DEFAULT NULL COMMENT 'Comma-separated list of VIP rows (e.g., "A,B")',
  `wheelchair_seats` varchar(255) DEFAULT NULL COMMENT 'Comma-separated list of wheelchair seats (e.g., "A1,B2")',
  `has_3d` tinyint(1) NOT NULL DEFAULT 0,
  `has_dolby` tinyint(1) NOT NULL DEFAULT 0,
  `seat_map` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'JSON configuration for complex seat layouts' CHECK (json_valid(`seat_map`)),
  `wheelchair_accessible` tinyint(1) NOT NULL DEFAULT 0,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Additional features in JSON format' CHECK (json_valid(`features`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `auditoriums`
--

INSERT INTO `auditoriums` (`id`, `name`, `type`, `capacity`, `rows`, `seats_per_row`, `vip_rows`, `wheelchair_seats`, `has_3d`, `has_dolby`, `seat_map`, `wheelchair_accessible`, `features`, `created_at`, `updated_at`) VALUES
(1, 'Screen 1', 'standard', 150, 10, 15, 'A,B', 'A1,A15,C5,C12', 1, 0, '{\r\n  \"rows\": [\r\n    {\r\n      \"label\": \"A\",\r\n      \"seats\": [\r\n        {\"number\": 1, \"type\": \"wheelchair\", \"show_number\": true},\r\n        {\"number\": 2, \"type\": \"standard\"},\r\n        {\"number\": 3, \"type\": \"standard\"},\r\n        {\"number\": 4, \"type\": \"standard\"},\r\n        {\"number\": 5, \"type\": \"standard\"},\r\n        {\"number\": 6, \"type\": \"standard\"},\r\n        {\"number\": 7, \"type\": \"standard\"},\r\n        {\"number\": 8, \"type\": \"standard\"},\r\n        {\"number\": 9, \"type\": \"standard\"},\r\n        {\"number\": 10, \"type\": \"standard\"},\r\n        {\"number\": 11, \"type\": \"standard\"},\r\n        {\"number\": 12, \"type\": \"standard\"},\r\n        {\"number\": 13, \"type\": \"standard\"},\r\n        {\"number\": 14, \"type\": \"standard\"},\r\n        {\"number\": 15, \"type\": \"wheelchair\", \"show_number\": true}\r\n      ]\r\n    },\r\n    {\r\n      \"label\": \"B\",\r\n      \"seats\": [\r\n        {\"number\": 1, \"type\": \"standard\", \"show_number\": true},\r\n        {\"number\": 2, \"type\": \"standard\"},\r\n        {\"number\": 3, \"type\": \"standard\"},\r\n        {\"number\": 4, \"type\": \"standard\"},\r\n        {\"number\": 5, \"type\": \"standard\"},\r\n        {\"number\": 6, \"type\": \"standard\"},\r\n        {\"number\": 7, \"type\": \"standard\"},\r\n        {\"number\": 8, \"type\": \"standard\"},\r\n        {\"number\": 9, \"type\": \"standard\"},\r\n        {\"number\": 10, \"type\": \"standard\"},\r\n        {\"number\": 11, \"type\": \"standard\"},\r\n        {\"number\": 12, \"type\": \"standard\"},\r\n        {\"number\": 13, \"type\": \"standard\"},\r\n        {\"number\": 14, \"type\": \"standard\"},\r\n        {\"number\": 15, \"type\": \"standard\", \"show_number\": true}\r\n      ]\r\n    },\r\n    {\r\n      \"label\": \"C\",\r\n      \"seats\": [\r\n        {\"number\": 1, \"type\": \"standard\", \"show_number\": true},\r\n        {\"number\": 2, \"type\": \"standard\"},\r\n        {\"number\": 3, \"type\": \"standard\"},\r\n        {\"number\": 4, \"type\": \"standard\"},\r\n        {\"number\": 5, \"type\": \"wheelchair\"},\r\n        {\"number\": 6, \"type\": \"standard\"},\r\n        {\"number\": 7, \"type\": \"standard\"},\r\n        {\"number\": 8, \"type\": \"standard\"},\r\n        {\"number\": 9, \"type\": \"standard\"},\r\n        {\"number\": 10, \"type\": \"standard\"},\r\n        {\"number\": 11, \"type\": \"standard\"},\r\n        {\"number\": 12, \"type\": \"wheelchair\"},\r\n        {\"number\": 13, \"type\": \"standard\"},\r\n        {\"number\": 14, \"type\": \"standard\"},\r\n        {\"number\": 15, \"type\": \"standard\", \"show_number\": true}\r\n      ]\r\n    },\r\n    {\r\n      \"label\": \"D\",\r\n      \"seats\": [\r\n        {\"number\": 1, \"type\": \"standard\", \"show_number\": true},\r\n        {\"number\": 2, \"type\": \"standard\"},\r\n        {\"number\": 3, \"type\": \"standard\"},\r\n        {\"number\": 4, \"type\": \"standard\"},\r\n        {\"number\": 5, \"type\": \"standard\"},\r\n        {\"number\": 6, \"type\": \"standard\"},\r\n        {\"number\": 7, \"type\": \"standard\"},\r\n        {\"number\": 8, \"type\": \"standard\"},\r\n        {\"number\": 9, \"type\": \"standard\"},\r\n        {\"number\": 10, \"type\": \"standard\"},\r\n        {\"number\": 11, \"type\": \"standard\"},\r\n        {\"number\": 12, \"type\": \"standard\"},\r\n        {\"number\": 13, \"type\": \"standard\"},\r\n        {\"number\": 14, \"type\": \"standard\"},\r\n        {\"number\": 15, \"type\": \"standard\", \"show_number\": true}\r\n      ]\r\n    },\r\n    {\r\n      \"label\": \"E\",\r\n      \"seats\": [\r\n        {\"number\": 1, \"type\": \"standard\", \"show_number\": true},\r\n        {\"number\": 2, \"type\": \"standard\"},\r\n        {\"number\": 3, \"type\": \"standard\"},\r\n        {\"number\": 4, \"type\": \"standard\"},\r\n        {\"number\": 5, \"type\": \"standard\"},\r\n        {\"number\": 6, \"type\": \"standard\"},\r\n        {\"number\": 7, \"type\": \"standard\"},\r\n        {\"number\": 8, \"type\": \"standard\"},\r\n        {\"number\": 9, \"type\": \"standard\"},\r\n        {\"number\": 10, \"type\": \"standard\"},\r\n        {\"number\": 11, \"type\": \"standard\"},\r\n        {\"number\": 12, \"type\": \"standard\"},\r\n        {\"number\": 13, \"type\": \"standard\"},\r\n        {\"number\": 14, \"type\": \"standard\"},\r\n        {\"number\": 15, \"type\": \"standard\", \"show_number\": true}\r\n      ]\r\n    }\r\n  ]\r\n}', 1, '{\"has_atmos\": false, \"has_recliners\": false, \"love_seats\": [\"C7,C8\", \"D7,D8\"]}', '2025-05-10 20:54:21', '2025-05-10 20:54:21');

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `booking_reference` varchar(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `movie_id` int(11) NOT NULL,
  `showtime_id` int(11) NOT NULL,
  `auditorium_id` int(11) NOT NULL,
  `seats` text NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `status` enum('pending_payment','confirmed','cancelled','completed') NOT NULL,
  `payment_method` enum('visa','cash','paypal') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `booking_reference`, `user_id`, `movie_id`, `showtime_id`, `auditorium_id`, `seats`, `total`, `status`, `payment_method`, `created_at`) VALUES
(1, 'BOOK-REF-001', 1, 1, 1, 1, 'A4', 12.00, 'confirmed', '', '2025-05-10 20:58:53'),
(2, 'BOOK-REF-002', 1, 1, 1, 1, 'A5', 12.00, 'confirmed', '', '2025-05-10 20:58:53');

-- --------------------------------------------------------

--
-- Table structure for table `food_categories`
--

CREATE TABLE `food_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `food_categories`
--

INSERT INTO `food_categories` (`id`, `name`, `description`, `image_url`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Popcorn & Snacks', 'Freshly popped popcorn and delicious snacks', 'https://images.unsplash.com/photo-1608190003443-86b2636f2fe3', 1, 1, '2025-05-05 17:10:46', '2025-05-05 17:10:46'),
(2, 'Beverages', 'Refreshing drinks for your movie experience', 'https://images.unsplash.com/photo-1554866585-cd94860890b7', 2, 1, '2025-05-05 17:10:46', '2025-05-05 17:10:46'),
(3, 'Candy & Chocolate', 'Sweet treats to enjoy during the movie', 'https://images.unsplash.com/photo-1603532648955-039310d9ed75', 3, 1, '2025-05-05 17:10:46', '2025-05-05 17:10:46'),
(4, 'Hot Food', 'Hot meals and savory snacks', 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb', 4, 1, '2025-05-05 17:10:46', '2025-05-05 17:10:46'),
(5, 'Combo Meals', 'Special value combos', 'https://images.unsplash.com/photo-1512152272829-e3139592d56f', 5, 1, '2025-05-05 17:10:46', '2025-05-05 17:10:46');

-- --------------------------------------------------------

--
-- Table structure for table `food_items`
--

CREATE TABLE `food_items` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `is_available` tinyint(1) DEFAULT 1,
  `dietary_info` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dietary_info`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `food_items`
--

INSERT INTO `food_items` (`id`, `category_id`, `name`, `description`, `price`, `image_url`, `display_order`, `is_available`, `dietary_info`, `created_at`, `updated_at`) VALUES
(1, 1, 'Classic Popcorn (Large)', 'Freshly popped with real butter', 8.99, 'https://i.postimg.cc/Zqy5D2hy/Chat-GPT-Image-May-9-2025-04-30-27-PM.png', 1, 1, '{\"vegetarian\": true, \"vegan\": false, \"glutenFree\": true}', '2025-05-05 17:10:46', '2025-05-09 13:37:23'),
(2, 1, 'Caramel Popcorn (Medium)', 'Sweet caramel coated popcorn', 7.49, 'https://i.postimg.cc/t4JTF7Sk/Chat-GPT-Image-May-9-2025-04-36-12-PM.png', 2, 1, '{\"vegetarian\": true, \"vegan\": false, \"glutenFree\": true}', '2025-05-05 17:10:46', '2025-05-09 13:36:45'),
(3, 1, 'Nachos with Cheese', 'Crispy tortilla chips with melted cheese sauce', 6.99, 'https://images.deliveryhero.io/image/talabat/MenuItems/Deluxe-Nachos_637260927489070762.jpg', 3, 1, '{\"vegetarian\": true, \"vegan\": false, \"glutenFree\": false}', '2025-05-05 17:10:46', '2025-05-05 20:43:44'),
(4, 2, 'Soft Drink (Large)', '32oz soft drink - choice of Coke, Diet Coke,fayrouz, Sprite, or Fanta', 4.99, 'https://cdnprod.mafretailproxy.com/sys-master-root/h66/hae/9856396623902/3845_1.jpg_480Wx480H', 1, 1, '{\"vegetarian\": true, \"vegan\": true, \"glutenFree\": true}', '2025-05-05 17:10:46', '2025-05-05 20:51:58'),
(5, 2, 'Bottled Water', '500ml premium bottled water', 3.50, 'https://tse4.mm.bing.net/th?id=OIP.dXO8crcv4pEkpbCg7Hj1MAHaLE&pid=Api&P=0&h=220', 2, 1, '{\"vegetarian\": true, \"vegan\": true, \"glutenFree\": true}', '2025-05-05 17:10:46', '2025-05-05 20:53:09'),
(6, 2, 'Iced Coffee', 'Cold brewed iced coffee with milk', 5.25, 'https://img.freepik.com/premium-photo/ice-coffee_978861-7.jpg', 3, 1, '{\"vegetarian\": true, \"vegan\": false, \"glutenFree\": true}', '2025-05-05 17:10:46', '2025-05-05 21:01:17'),
(7, 3, 'M&M\'s', 'Milk chocolate candies', 4.25, 'https://i5.walmartimages.com/asr/9838140d-41b6-4a56-911b-887139e1f64b_1.ab04ccc9e4be7595b17309e2603eb08d.jpeg?odnWidth=1000&odnHeight=1000&odnBg=ffffff', 1, 1, '{\"vegetarian\": true, \"vegan\": false, \"glutenFree\": false}', '2025-05-05 17:10:46', '2025-05-05 21:02:24'),
(8, 3, 'Bebeto Peach Rings', 'Sweet and sour gummy candy', 4.25, 'https://www.islamguide.dk/images/slik/bebeto-peach-rings.jpg', 2, 1, '{\"vegetarian\": true, \"vegan\": false, \"glutenFree\": true}', '2025-05-05 17:10:46', '2025-05-05 21:03:51'),
(9, 3, 'Snickers', 'Premium milk chocolate bar', 3.99, 'https://www.mashed.com/img/gallery/why-snickers-controversial-candy-design-is-turning-heads/l-intro-1650564884.jpg', 3, 1, '{\"vegetarian\": true, \"vegan\": false, \"glutenFree\": false}', '2025-05-05 17:10:46', '2025-05-05 21:05:22'),
(10, 4, 'Hot Dog', 'Classic beef hot dog with bun', 5.99, 'https://bloximages.newyork1.vip.townnews.com/lancasteronline.com/content/tncms/assets/v3/editorial/3/96/3960a830-49cf-11e6-ade0-176e51cf598c/5787a1ad7f13a.image.jpg?resize=1688%2C1227', 1, 1, '{\"vegetarian\": false, \"vegan\": false, \"glutenFree\": false}', '2025-05-05 17:10:46', '2025-05-05 21:09:53'),
(11, 4, 'Pizza Slice', 'Cheese or pepperoni pizza slice', 6.50, 'https://img.freepik.com/premium-photo/pizza-slice_841014-14272.jpg', 2, 1, '{\"vegetarian\": true, \"vegan\": false, \"glutenFree\": false}', '2025-05-05 17:10:46', '2025-05-05 21:11:06'),
(12, 4, 'Chicken Tenders', 'Crispy chicken tenders with dipping sauce', 7.99, 'https://tse1.mm.bing.net/th?id=OIP.Hj7mxiqk3T5CugQEw2W_2QHaFM&pid=Api&P=0&h=220', 3, 1, '{\"vegetarian\": false, \"vegan\": false, \"glutenFree\": false}', '2025-05-05 17:10:46', '2025-05-05 21:11:59'),
(13, 5, 'Classic Combo', 'Large popcorn + large drink + hot dog', 14.99, 'https://i.postimg.cc/VsDxX4P4/Chat-GPT-Image-May-6-2025-02-21-20-AM.png', 1, 1, '{\"vegetarian\": false, \"vegan\": false, \"glutenFree\": false}', '2025-05-05 17:10:46', '2025-05-05 23:22:25'),
(14, 5, 'Date Night Combo', '2 large popcorns + 3 large drinks + candy', 24.99, 'https://i.postimg.cc/hjQgGdGz/Chat-GPT-Image-May-9-2025-05-12-20-PM.png', 2, 1, '{\"vegetarian\": false, \"vegan\": false, \"glutenFree\": false}', '2025-05-05 17:10:46', '2025-05-09 14:13:18'),
(15, 5, 'Family Combo', '2 large popcorns + 6 drinks + 2 candies + nachos + hotdog', 34.99, 'https://i.postimg.cc/HnmnM2R8/Chat-GPT-Image-May-8-2025-03-19-19-PM.png', 3, 1, '{\"vegetarian\": false, \"vegan\": false, \"glutenFree\": false}', '2025-05-05 17:10:46', '2025-05-09 13:34:55');

-- --------------------------------------------------------

--
-- Table structure for table `food_orders`
--

CREATE TABLE `food_orders` (
  `id` int(11) NOT NULL,
  `order_reference` varchar(50) NOT NULL,
  `user_id` int(11) NOT NULL,
  `booking_id` int(11) DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','confirmed','preparing','ready','delivered','cancelled') DEFAULT 'pending',
  `payment_method` enum('card','cash','online','none') DEFAULT 'none',
  `special_requests` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `movies`
--

CREATE TABLE `movies` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `poster_url` varchar(255) DEFAULT NULL,
  `trailer_url` varchar(255) DEFAULT NULL,
  `rating` decimal(3,1) DEFAULT NULL,
  `duration` varchar(20) DEFAULT NULL,
  `genres` varchar(255) DEFAULT NULL,
  `release_date` date DEFAULT NULL,
  `category` enum('now_showing','upcoming') NOT NULL,
  `is_featured` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `movies`
--

INSERT INTO `movies` (`id`, `title`, `description`, `poster_url`, `trailer_url`, `rating`, `duration`, `genres`, `release_date`, `category`, `is_featured`) VALUES
(1, 'Interstellar', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.', 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg', 'https://youtu.be/zSWdZVtXT7E', 8.6, '2h 49m', 'Sci-Fi,Adventure,Drama', '2014-11-07', 'now_showing', 1),
(2, 'The Dark Knight', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg', 'https://youtu.be/EXeTwQWrcwY', 9.0, '2h 32m', 'Action,Crime,Drama', '2008-07-18', 'now_showing', 1),
(3, 'Dune', 'Feature adaptation of Frank Herbert\'s science fiction novel about the son of a noble family entrusted with the protection of the most valuable asset in the galaxy.', 'https://m.media-amazon.com/images/M/MV5BN2FjNmEyNWMtYzM0ZS00NjIyLTg5YzYtYThlMGVjNzE1OGViXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg', 'https://youtu.be/8g18jFHCLXk', 8.0, '2h 35m', 'Sci-Fi,Adventure', '2021-10-22', 'now_showing', 1),
(4, 'Inception', 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg', 'https://youtu.be/YoHD9XEInc0', 8.8, '2h 28m', 'Action,Adventure,Sci-Fi', '2010-07-16', 'now_showing', 0),
(5, 'The Shawshank Redemption', 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', 'https://usercontent2.hubstatic.com/13505341_f520.jpg', 'https://youtu.be/6hB3S9bIaco', 9.3, '2h 22m', 'Drama', '1994-09-23', 'now_showing', 0),
(6, 'Pulp Fiction', 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.', 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg', 'https://youtu.be/s7EdQ4FqbhY', 8.9, '2h 34m', 'Crime,Drama', '1994-10-14', 'now_showing', 0),
(7, 'The Godfather', 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg', 'https://youtu.be/sY1S34973zA', 9.2, '2h 55m', 'Crime,Drama', '1972-03-24', 'now_showing', 0),
(8, 'Fight Club', 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.', 'https://m.media-amazon.com/images/M/MV5BNDIzNDU0YzEtYzE5Ni00ZjlkLTk5ZjgtNjM3NWE4YzA3Nzk3XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_.jpg', 'https://youtu.be/qtRKdVHc-cE', 8.8, '2h 19m', 'Drama', '1999-10-15', 'now_showing', 0),
(9, 'The Matrix', 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.', 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg', 'https://youtu.be/vKQi3bBA1y8', 8.7, '2h 16m', 'Action,Sci-Fi', '1999-03-31', 'now_showing', 0),
(10, 'Parasite', 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.', 'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg', 'https://youtu.be/5xH0HfJHsaY', 8.6, '2h 12m', 'Comedy,Drama,Thriller', '2019-05-21', 'now_showing', 0),
(11, 'Avengers: Endgame', 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos\' actions and restore balance to the universe.', 'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg', 'https://youtu.be/TcMBFSGVi1c', 8.4, '3h 1m', 'Action,Adventure,Sci-Fi', '2019-04-26', 'now_showing', 1),
(12, 'Joker', 'In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society. He then embarks on a downward spiral of revolution and bloody crime.', 'https://m.media-amazon.com/images/M/MV5BNGVjNWI4ZGUtNzE0MS00YTJmLWE0ZDctN2ZiYTk2YmI3NTYyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg', 'https://youtu.be/zAGVQLHvwOY', 8.4, '2h 2m', 'Crime,Drama,Thriller', '2019-10-04', 'now_showing', 0),
(13, 'The Batman', 'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city\'s hidden corruption.', 'https://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtMDIzNi00NGVlLWIzMDYtZTk3MTQ3NGQxZGEwXkEyXkFqcGdeQXVyMzMwOTU5MDk@._V1_.jpg', 'https://youtu.be/mqqft2x_Aa4', 7.9, '2h 56m', 'Action,Crime,Drama', '2022-03-04', 'now_showing', 1),
(14, 'Top Gun: Maverick', 'After more than thirty years of service as one of the Navy\'s top aviators, Pete Mitchell is where he belongs, pushing the envelope as a courageous test pilot.', 'https://m.media-amazon.com/images/M/MV5BZWYzOGEwNTgtNWU3NS00ZTQ0LWJkODUtMmVhMjIwMjA1ZmQwXkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_.jpg', 'https://youtu.be/qSqVVswa420', 8.3, '2h 10m', 'Action,Drama', '2022-05-27', 'now_showing', 1),
(15, 'Everything Everywhere All at Once', 'A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence by exploring other universes connecting with the lives she could have led.', 'https://m.media-amazon.com/images/M/MV5BYTdiOTIyZTQtNmQ1OS00NjZlLWIyMTgtYzk5Y2M3ZDVmMDk1XkEyXkFqcGdeQXVyMTAzMDg4NzU0._V1_.jpg', 'https://youtu.be/wxN1T1uxQ2g', 8.1, '2h 19m', 'Action,Adventure,Comedy', '2022-03-25', 'now_showing', 1),
(16, 'Avatar: The Way of Water', 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na\'vi race to protect their home.', 'https://m.media-amazon.com/images/M/MV5BYjhiNjBlODctY2ZiOC00YjVlLWFlNzAtNTVhNzM1YjI1NzMxXkEyXkFqcGdeQXVyMjQxNTE1MDA@._V1_.jpg', 'https://youtu.be/d9MyW72ELq0', 7.6, '3h 12m', 'Action,Adventure,Fantasy', '2022-12-16', 'now_showing', 1),
(26, 'M3GAN 2.0', 'The next generation of the Model 3 Generative Android returns with even more deadly capabilities.', 'https://m.media-amazon.com/images/M/MV5BMDk4MTdhYzEtODk3OS00ZDBjLWFhNTQtMDI2ODdjNzQzZTA3XkEyXkFqcGdeQXVyMjMxOTE0ODA@._V1_.jpg', 'https://www.youtube.com/watch?v=example1', 0.0, '102 min', 'Horror,Sci-Fi', '2025-11-17', 'upcoming', 1),
(27, 'Superman: Legacy', 'The new DC Universe begins with the story of Superman balancing his Kryptonian heritage with his human upbringing.', 'https://m.media-amazon.com/images/M/MV5BZTFlYWFmY2ItYjBmZi00YWM1LTg1OGItOGE4NjY5ODVmMzMyXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_FMjpg_UX1000_.jpg', 'https://www.youtube.com/watch?v=example2', 0.0, '143 min', 'Action,Adventure,Superhero', '2025-07-11', 'upcoming', 1),
(28, 'Thunderbolts', 'A group of antiheroes and reformed villains come together for dangerous missions for the government.', 'https://m.media-amazon.com/images/M/MV5BMTUzOTYzNTY3MV5BMl5BanBnXkFtZTgwNDM3MDQ2MTE@._V1_.jpg', 'https://www.youtube.com/watch?v=example3', 0.0, '138 min', 'Action,Adventure,Superhero', '2025-06-02', 'upcoming', 1),
(29, 'Final Destination: Bloodlines', 'The sixth installment in the Final Destination franchise explores new deadly premonitions.', 'https://m.media-amazon.com/images/M/MV5BNzUxNTU5OTQzOV5BMl5BanBnXkFtZTgwNDY3NjY3MTE@._V1_.jpg', 'https://www.youtube.com/watch?v=example4', 0.0, '98 min', 'Horror,Thriller', '2025-07-18', 'upcoming', 0),
(30, 'Mission: Impossible 8', 'Ethan Hunt returns for his most dangerous mission yet against a powerful rogue AI.', 'https://m.media-amazon.com/images/M/MV5BMTc3NjI2OTY0N15BMl5BanBnXkFtZTgwODQzNjU5MTE@._V1_.jpg', 'https://www.youtube.com/watch?v=example5', 0.0, '156 min', 'Action,Adventure,Thriller', '2025-06-28', 'upcoming', 1),
(31, 'Lilo & Stitch (Live Action)', 'The classic Disney animated film gets a live-action remake with cutting-edge visual effects.', 'https://m.media-amazon.com/images/M/MV5BZDVjNmFiYjktOWQ0Ny00MWZhLThhN2YtOGNkZTRlYzg5YmFkXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg', 'https://www.youtube.com/watch?v=example6', 0.0, '107 min', 'Adventure,Comedy,Family', '2025-05-23', 'upcoming', 0),
(32, 'Fantastic Four', 'Marvel\'s First Family returns in this reboot set in the Marvel Cinematic Universe.', 'https://m.media-amazon.com/images/M/MV5BMDE2YjVkMDAtYjE1YS00YjA3LWIyYTMtOTY0YzFlOTNlYzY0XkEyXkFqcGdeQXVyNDg4NjY5OTQ@._V1_.jpg', 'https://www.youtube.com/watch?v=example7', 0.0, '132 min', 'Action,Adventure,Superhero', '2025-11-07', 'upcoming', 1),
(33, 'The Conjuring: Last Rites', 'The final chapter in The Conjuring series brings the Warrens face-to-face with their most powerful demonic entity yet.', 'https://m.media-amazon.com/images/M/MV5BZjRlZDIzNDUtYjVlYS00NTA4LWFlYjMtN2QzOWY0NmZjZWY0XkEyXkFqcGdeQXVyMjMxOTE0ODA@._V1_.jpg', 'https://www.youtube.com/watch?v=example8', 0.0, '112 min', 'Horror,Mystery,Thriller', '2025-10-03', 'upcoming', 1),
(34, 'The Karate Kid (2025)', 'A new generation learns the art of karate in this fresh take on the classic franchise.', 'https://m.media-amazon.com/images/M/MV5BMTk1Mzg2NDg5N15BMl5BanBnXkFtZTcwODQyNjY5NA@@._V1_.jpg', 'https://www.youtube.com/watch?v=example9', 0.0, '121 min', 'Action,Drama,Sports', '2025-12-19', 'upcoming', 0),
(35, 'Sinners', 'A former cop turned priest investigates mysterious deaths in his small town, uncovering dark secrets tied to his own past.', 'https://ew.com/thmb/PJpT1waxy0Hwu7C1DdfkH3XFy5M=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/sinners-092424-2-ca807c41533544589b0d13b8ce9205c9.jpg', 'https://video.search.yahoo.com/video/play;_ylt=AwrFPhrbEBho5S8Fbdb7w8QF;_ylu=c2VjA3NyBHNsawN2aWQEZ3BvcwMz?p=Sinners&vid=ae2ed7490e255f7ae0b278afc6ce9308&turl=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOVP.zK25AQ15nrjnQJmmG1p3PwHgFo%26pid%3DApi%26h%3D360%2', 6.8, '112 min', 'Crime,Thriller,Mystery', '2025-05-15', 'now_showing', 1);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `food_item_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price_at_order` decimal(10,2) NOT NULL,
  `special_instructions` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reminders`
--

CREATE TABLE `reminders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `movie_id` int(11) NOT NULL,
  `remind_date` date NOT NULL,
  `is_sent` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `seat_availability`
--

CREATE TABLE `seat_availability` (
  `id` int(11) NOT NULL,
  `showtime_id` int(11) NOT NULL,
  `auditorium_id` int(11) NOT NULL,
  `seat_number` varchar(10) NOT NULL,
  `status` enum('available','reserved','occupied') NOT NULL DEFAULT 'available',
  `booking_id` int(11) DEFAULT NULL,
  `reserved_until` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `seat_availability`
--

INSERT INTO `seat_availability` (`id`, `showtime_id`, `auditorium_id`, `seat_number`, `status`, `booking_id`, `reserved_until`, `created_at`, `updated_at`) VALUES
(21, 1, 1, 'A1', 'available', NULL, NULL, '2025-05-10 20:58:53', '2025-05-10 20:58:53'),
(22, 1, 1, 'A2', 'available', NULL, NULL, '2025-05-10 20:58:53', '2025-05-10 20:58:53'),
(23, 1, 1, 'A3', 'available', NULL, NULL, '2025-05-10 20:58:53', '2025-05-10 20:58:53'),
(24, 1, 1, 'A4', 'reserved', 1, '2023-12-15 18:15:00', '2025-05-10 20:58:53', '2025-05-10 20:58:53'),
(25, 1, 1, 'A5', 'occupied', 2, NULL, '2025-05-10 20:58:53', '2025-05-10 20:58:53'),
(26, 1, 1, 'B1', 'available', NULL, NULL, '2025-05-10 20:58:53', '2025-05-10 20:58:53'),
(27, 1, 1, 'B2', 'available', NULL, NULL, '2025-05-10 20:58:53', '2025-05-10 20:58:53'),
(28, 1, 1, 'B3', 'available', NULL, NULL, '2025-05-10 20:58:53', '2025-05-10 20:58:53'),
(29, 1, 1, 'B4', 'available', NULL, NULL, '2025-05-10 20:58:53', '2025-05-10 20:58:53'),
(30, 1, 1, 'B5', 'available', NULL, NULL, '2025-05-10 20:58:53', '2025-05-10 20:58:53');

-- --------------------------------------------------------

--
-- Table structure for table `showtimes`
--

CREATE TABLE `showtimes` (
  `id` int(11) NOT NULL,
  `movie_id` int(11) NOT NULL,
  `auditorium_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `is_3d` tinyint(1) NOT NULL DEFAULT 0,
  `is_imax` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `showtimes`
--

INSERT INTO `showtimes` (`id`, `movie_id`, `auditorium_id`, `date`, `time`, `is_3d`, `is_imax`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2025-12-15', '18:00:00', 1, 0, '2025-05-10 20:56:30', '2025-05-10 20:56:30'),
(2, 1, 1, '2025-12-15', '21:00:00', 0, 0, '2025-05-10 20:56:30', '2025-05-10 20:56:30'),
(3, 2, 1, '2025-12-15', '15:00:00', 0, 0, '2025-05-10 20:56:30', '2025-05-10 20:56:30');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `created_at`) VALUES
(1, 'ahmed yasser', 'ahmeddyasserr23@gmail.com', '$2b$10$20O1TtebbHsAf5IlA8XHvuamPt3qBp.BavwGzHgMgkVzwhar.yrEe', '2025-05-01 00:13:30');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `auditoriums`
--
ALTER TABLE `auditoriums`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `booking_reference` (`booking_reference`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `movie_id` (`movie_id`),
  ADD KEY `showtime_id` (`showtime_id`),
  ADD KEY `auditorium_id` (`auditorium_id`);

--
-- Indexes for table `food_categories`
--
ALTER TABLE `food_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `food_items`
--
ALTER TABLE `food_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `food_orders`
--
ALTER TABLE `food_orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `booking_id` (`booking_id`);

--
-- Indexes for table `movies`
--
ALTER TABLE `movies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `food_item_id` (`food_item_id`);

--
-- Indexes for table `reminders`
--
ALTER TABLE `reminders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `movie_id` (`movie_id`);

--
-- Indexes for table `seat_availability`
--
ALTER TABLE `seat_availability`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_seat` (`showtime_id`,`auditorium_id`,`seat_number`),
  ADD KEY `auditorium_id` (`auditorium_id`),
  ADD KEY `booking_id` (`booking_id`);

--
-- Indexes for table `showtimes`
--
ALTER TABLE `showtimes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `movie_id` (`movie_id`),
  ADD KEY `auditorium_id` (`auditorium_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `auditoriums`
--
ALTER TABLE `auditoriums`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `food_categories`
--
ALTER TABLE `food_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `food_items`
--
ALTER TABLE `food_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `food_orders`
--
ALTER TABLE `food_orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `movies`
--
ALTER TABLE `movies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reminders`
--
ALTER TABLE `reminders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `seat_availability`
--
ALTER TABLE `seat_availability`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `showtimes`
--
ALTER TABLE `showtimes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`),
  ADD CONSTRAINT `bookings_ibfk_3` FOREIGN KEY (`showtime_id`) REFERENCES `showtimes` (`id`),
  ADD CONSTRAINT `bookings_ibfk_4` FOREIGN KEY (`auditorium_id`) REFERENCES `auditoriums` (`id`);

--
-- Constraints for table `food_items`
--
ALTER TABLE `food_items`
  ADD CONSTRAINT `food_items_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `food_categories` (`id`);

--
-- Constraints for table `food_orders`
--
ALTER TABLE `food_orders`
  ADD CONSTRAINT `food_orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `food_orders_ibfk_2` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `food_orders` (`id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`food_item_id`) REFERENCES `food_items` (`id`);

--
-- Constraints for table `reminders`
--
ALTER TABLE `reminders`
  ADD CONSTRAINT `reminders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `reminders_ibfk_2` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`);

--
-- Constraints for table `seat_availability`
--
ALTER TABLE `seat_availability`
  ADD CONSTRAINT `seat_availability_ibfk_1` FOREIGN KEY (`showtime_id`) REFERENCES `showtimes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `seat_availability_ibfk_2` FOREIGN KEY (`auditorium_id`) REFERENCES `auditoriums` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `seat_availability_ibfk_3` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `showtimes`
--
ALTER TABLE `showtimes`
  ADD CONSTRAINT `showtimes_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `showtimes_ibfk_2` FOREIGN KEY (`auditorium_id`) REFERENCES `auditoriums` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
