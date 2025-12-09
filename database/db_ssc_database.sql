-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 23, 2025 at 08:58 PM
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
-- Database: `db_ssc_database`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_cash_beginning`
--

CREATE TABLE `tbl_cash_beginning` (
  `id` int(11) NOT NULL,
  `cash_start` decimal(15,2) DEFAULT NULL,
  `last_reset` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_cash_flow_summary`
--

CREATE TABLE `tbl_cash_flow_summary` (
  `id` int(11) NOT NULL,
  `cash_start` decimal(12,2) NOT NULL,
  `total_received` decimal(12,2) NOT NULL,
  `total_payments` decimal(12,2) NOT NULL,
  `misc_total` decimal(12,2) NOT NULL,
  `other_total` decimal(12,2) NOT NULL,
  `net_operating` decimal(12,2) NOT NULL,
  `net_investing` decimal(12,2) NOT NULL,
  `net_financing` decimal(12,2) NOT NULL,
  `net_increase` decimal(12,2) NOT NULL,
  `cash_end` decimal(12,2) NOT NULL,
  `created_at` datetime NOT NULL COMMENT 'CURRENT_TIMESTAMP'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_expense_history`
--

CREATE TABLE `tbl_expense_history` (
  `id` int(11) NOT NULL,
  `payment_id` int(11) NOT NULL,
  `old_date` date NOT NULL,
  `old_description` varchar(50) NOT NULL,
  `old_si_or_no` varchar(50) NOT NULL,
  `old_amount` decimal(12,2) NOT NULL,
  `new_date` date NOT NULL,
  `new_description` varchar(50) NOT NULL,
  `new_si_or_no` varchar(50) NOT NULL,
  `new_amount` decimal(12,2) NOT NULL,
  `edited_by` varchar(100) NOT NULL,
  `edited_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_expense_history`
--

INSERT INTO `tbl_expense_history` (`id`, `payment_id`, `old_date`, `old_description`, `old_si_or_no`, `old_amount`, `new_date`, `new_description`, `new_si_or_no`, `new_amount`, `edited_by`, `edited_at`) VALUES
(13, 5, '2025-11-15', 'Marker', 'SI1232453', 100.00, '2025-11-15', 'Marker', 'SI1232453', 80.00, 'current_user', '2025-11-17 12:14:14'),
(14, 6, '2025-11-23', 'Chalk', 'SI131234', 100.00, '2025-11-23', 'Chalk', 'SI131234', 130.00, 'current_user', '2025-11-23 12:17:10'),
(15, 6, '2025-11-23', 'Chalk', 'SI131234', 130.00, '2025-11-23', 'Chalk', 'SI131234', 140.00, 'current_user', '2025-11-23 12:28:04');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_lockers`
--

CREATE TABLE `tbl_lockers` (
  `id` int(11) NOT NULL,
  `locker_name` varchar(20) NOT NULL COMMENT 'LOCKER',
  `locker_letter` enum('A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z') NOT NULL,
  `locker_number` int(11) NOT NULL,
  `status` enum('Available','Occupied') NOT NULL DEFAULT 'Available',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_lockers`
--

INSERT INTO `tbl_lockers` (`id`, `locker_name`, `locker_letter`, `locker_number`, `status`, `created_at`, `updated_at`) VALUES
(35, 'LOCKER A-1', 'A', 1, 'Available', '2025-11-17 12:21:08', '2025-11-17 12:21:08'),
(36, 'LOCKER A-2', 'A', 2, 'Available', '2025-11-17 12:21:09', '2025-11-17 12:21:09'),
(37, 'LOCKER A-3', 'A', 3, 'Available', '2025-11-17 12:21:10', '2025-11-17 12:21:10'),
(38, 'LOCKER A-4', 'A', 4, 'Occupied', '2025-11-17 12:21:11', '2025-11-17 12:23:27'),
(39, 'LOCKER A-5', 'A', 5, 'Available', '2025-11-17 12:21:12', '2025-11-17 12:21:12'),
(40, 'LOCKER B-1', 'B', 1, 'Available', '2025-11-17 12:21:30', '2025-11-17 12:21:30'),
(41, 'LOCKER B-2', 'B', 2, 'Available', '2025-11-17 12:21:32', '2025-11-17 12:21:32');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_locker_rentals`
--

CREATE TABLE `tbl_locker_rentals` (
  `id` int(11) NOT NULL,
  `locker_letter` varchar(20) NOT NULL,
  `locker_number` varchar(10) NOT NULL,
  `student_number` varchar(20) NOT NULL,
  `surname` varchar(50) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `middle_name` varchar(50) DEFAULT NULL,
  `department` varchar(50) NOT NULL,
  `course` varchar(50) NOT NULL,
  `contact_number` varchar(20) NOT NULL,
  `date_rented` datetime NOT NULL DEFAULT current_timestamp(),
  `due_date` datetime NOT NULL,
  `status` enum('Active','Released','Renewed','Expired') NOT NULL COMMENT '''Active''',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_locker_rentals`
--

INSERT INTO `tbl_locker_rentals` (`id`, `locker_letter`, `locker_number`, `student_number`, `surname`, `first_name`, `middle_name`, `department`, `course`, `contact_number`, `date_rented`, `due_date`, `status`, `created_at`, `updated_at`) VALUES
(38, 'A', '4', '221080004', 'Cauntoy', 'John Paul', 'Paggao', 'CITE', 'BSIT', '09936287033', '2025-11-17 20:23:27', '2025-12-17 20:23:27', 'Active', '2025-11-17 12:23:27', '2025-11-17 12:23:27');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_miscellaneous_transactions`
--

CREATE TABLE `tbl_miscellaneous_transactions` (
  `id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `quantity` varchar(100) NOT NULL,
  `total_fee` decimal(10,2) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_miscellaneous_transactions`
--

INSERT INTO `tbl_miscellaneous_transactions` (`id`, `description`, `quantity`, `total_fee`, `date_created`) VALUES
(59, 'Small Big Bin', '1', 347.00, '2025-10-19 20:13:29'),
(60, 'Trash Bag', '5', 20.00, '2025-10-19 20:19:29'),
(61, 'Small Bin', '2', 100.00, '2025-10-19 21:15:38'),
(62, 'Walis ting ting', '2', 20.00, '2025-10-20 12:17:16');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_operating_activities_net_cash`
--

CREATE TABLE `tbl_operating_activities_net_cash` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `total_net_cash` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_operating_activities_payments`
--

CREATE TABLE `tbl_operating_activities_payments` (
  `id` int(11) NOT NULL,
  `payment_id` int(11) NOT NULL,
  `category` varchar(100) NOT NULL,
  `expense_date` date NOT NULL,
  `description` varchar(50) NOT NULL,
  `si_or_no` varchar(100) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `total` decimal(12,2) NOT NULL,
  `created_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_operating_activities_payments`
--

INSERT INTO `tbl_operating_activities_payments` (`id`, `payment_id`, `category`, `expense_date`, `description`, `si_or_no`, `amount`, `total`, `created_date`, `created_at`) VALUES
(5, 0, 'Supplies', '2025-11-15', 'Marker', 'SI1232453', 80.00, 0.00, '2025-11-17', '2025-11-17 12:13:01'),
(6, 0, 'Supplies', '2025-11-23', 'Chalk', 'SI131234', 140.00, 0.00, '2025-11-23', '2025-11-23 12:15:41');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_operating_activities_recieved`
--

CREATE TABLE `tbl_operating_activities_recieved` (
  `id` int(11) NOT NULL,
  `transaction_id` int(11) NOT NULL,
  `membership_id` int(11) NOT NULL,
  `student_number` varchar(50) NOT NULL,
  `surname` varchar(100) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `middle_name` varchar(100) NOT NULL,
  `department` varchar(50) NOT NULL,
  `course` varchar(50) NOT NULL,
  `level` varchar(30) NOT NULL,
  `officer` enum('yes','no') NOT NULL COMMENT '''no''',
  `organization` varchar(100) DEFAULT NULL,
  `position` varchar(100) DEFAULT NULL,
  `description_fee` varchar(50) NOT NULL,
  `transaction_fee` decimal(10,2) NOT NULL,
  `status` enum('Paid','Unpaid','Partial') NOT NULL COMMENT '''Paid''',
  `school_year` varchar(50) NOT NULL,
  `semester` varchar(50) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_other_expenses`
--

CREATE TABLE `tbl_other_expenses` (
  `id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `quantity` varchar(100) NOT NULL,
  `total_fee` decimal(10,2) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_pending_registrations`
--

CREATE TABLE `tbl_pending_registrations` (
  `id` int(11) NOT NULL,
  `student_number` varchar(50) NOT NULL,
  `surname` varchar(100) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `middle_name` varchar(100) NOT NULL,
  `level` varchar(30) NOT NULL,
  `department` varchar(50) NOT NULL,
  `course` varchar(50) NOT NULL,
  `officer` enum('Yes','No') NOT NULL COMMENT '"No"',
  `organization` varchar(50) NOT NULL COMMENT '"N/A"',
  `position` varchar(50) NOT NULL COMMENT '"N/A"',
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_scc_memberships`
--

CREATE TABLE `tbl_scc_memberships` (
  `id` int(11) NOT NULL,
  `serial_number` int(11) NOT NULL,
  `student_number` varchar(20) NOT NULL,
  `member_type` enum('Freshmen','Old Student','Transferee') NOT NULL,
  `surname` varchar(100) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `middle_name` varchar(100) NOT NULL,
  `transferee` enum('yes','no') NOT NULL COMMENT 'No',
  `officer` enum('yes','no') NOT NULL COMMENT '''no''',
  `organization` varchar(100) DEFAULT NULL COMMENT '''N/A''',
  `position` varchar(100) DEFAULT NULL COMMENT '''N/A''',
  `department` enum('COA','CTED','CITE','CNM','COC','CBA','CHM') NOT NULL,
  `course` enum('BSA','BSAIS','BEEd','BSEd','BSIT','BSCpE','BSBA-FM','BSBA-MM','BSCrim','BSHM') NOT NULL,
  `level` enum('1st Year','2nd Year','3rd Year','4th Year') NOT NULL,
  `status` enum('Pending','Approved') NOT NULL COMMENT '"Pending"',
  `school_year` varchar(50) NOT NULL,
  `semester` varchar(50) NOT NULL,
  `date_joined` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_ssc_accounts`
--

CREATE TABLE `tbl_ssc_accounts` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('adviser','admin','vice_admin','operation_activities','financial_activities') NOT NULL,
  `is_disabled` tinyint(1) NOT NULL,
  `status` enum('active','disabled') NOT NULL COMMENT 'Active',
  `force_change` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_ssc_accounts`
--

INSERT INTO `tbl_ssc_accounts` (`id`, `username`, `email`, `password`, `role`, `is_disabled`, `status`, `force_change`) VALUES
(45, 'Administrator', 'Administrator@gmail', '@admin12345', 'admin', 0, 'active', 0),
(56, 'Elias_Azarel', 'eriasazarel55@gmail.com', '@143azarel55', 'operation_activities', 0, 'active', 0),
(57, 'Azarel', 'Azarel@gmail.com', '@azarel55', 'financial_activities', 0, 'active', 0);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_student_fee_balance`
--

CREATE TABLE `tbl_student_fee_balance` (
  `id` int(11) NOT NULL,
  `membership_id` int(11) NOT NULL,
  `student_number` varchar(20) NOT NULL,
  `description_fee` varchar(100) NOT NULL,
  `required_fee` decimal(10,2) NOT NULL,
  `total_paid` decimal(10,2) NOT NULL,
  `balance` decimal(10,2) NOT NULL,
  `status` enum('Paid','Partial','Unpaid') NOT NULL,
  `last_payment_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_sy_database`
--

CREATE TABLE `tbl_sy_database` (
  `id` int(11) NOT NULL,
  `year` year(4) NOT NULL,
  `month` varchar(50) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_transactions`
--

CREATE TABLE `tbl_transactions` (
  `id` int(11) NOT NULL,
  `membership_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `description` varchar(255) NOT NULL,
  `payment` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_transactions`
--

INSERT INTO `tbl_transactions` (`id`, `membership_id`, `date`, `description`, `payment`, `created_at`) VALUES
(208, 156, '2025-11-17', 'SSC Membership Fee', 0, '2025-11-17 12:08:38'),
(209, 156, '2025-11-17', 'Rental Locker Fee', 0, '2025-11-17 12:22:22'),
(210, 157, '2025-11-23', 'SSC Membership Fee', 0, '2025-11-23 06:38:00'),
(214, 161, '2025-11-23', 'SSC Membership Fee', 0, '2025-11-23 07:32:13'),
(215, 162, '2025-11-23', 'SSC Membership Fee', 0, '2025-11-23 07:50:40'),
(216, 163, '2025-11-23', 'SSC Membership Fee', 0, '2025-11-23 08:55:50'),
(217, 164, '2025-11-23', 'SSC Membership Fee', 0, '2025-11-23 11:55:26');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_transaction_fees`
--

CREATE TABLE `tbl_transaction_fees` (
  `id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `total_fee` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_transaction_set_up`
--

CREATE TABLE `tbl_transaction_set_up` (
  `id` int(11) NOT NULL,
  `description` varchar(100) NOT NULL,
  `total_fee` decimal(12,2) NOT NULL,
  `school_year` varchar(50) NOT NULL,
  `semester` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_transaction_set_up`
--

INSERT INTO `tbl_transaction_set_up` (`id`, `description`, `total_fee`, `school_year`, `semester`, `created_at`) VALUES
(63, 'SSC Membership Fee', 50.00, '2025-2026', '2nd Semester', '2025-11-17 12:06:11'),
(64, 'Rental Locker Fee', 150.00, '2025-2026', '2nd Semester', '2025-11-17 12:06:26'),
(65, 'Ticket for a Cost', 100.00, '2026-2027', '2nd Semester', '2025-11-23 06:38:30');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_users_log`
--

CREATE TABLE `tbl_users_log` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `ip_address` varchar(60) NOT NULL,
  `login_time` datetime NOT NULL DEFAULT current_timestamp(),
  `logout_time` datetime DEFAULT NULL,
  `activity` varchar(255) NOT NULL,
  `logout_type` enum('normal','manual','force') NOT NULL COMMENT '''normal'''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_users_log`
--

INSERT INTO `tbl_users_log` (`id`, `user_id`, `ip_address`, `login_time`, `logout_time`, `activity`, `logout_type`) VALUES
(76, 45, '127.0.0.1', '2025-11-17 09:48:41', NULL, '2025-11-17 09:48:46 - index', 'normal'),
(77, 45, '127.0.0.1', '2025-11-17 09:50:06', NULL, '2025-11-17 09:51:48 - index', 'normal'),
(78, 45, '127.0.0.1', '2025-11-17 20:00:00', NULL, '2025-11-17 20:00:25 - officers_login', 'normal'),
(79, 56, '127.0.0.1', '2025-11-17 20:00:25', NULL, '2025-11-17 20:37:52 - membership_page', 'normal'),
(80, 45, '127.0.0.1', '2025-11-17 20:01:13', NULL, '2025-11-17 20:01:39 - officers_login', 'normal'),
(81, 57, '127.0.0.1', '2025-11-17 20:01:39', NULL, '2025-11-17 20:13:17 - breakdown_notes', 'normal'),
(82, 56, '127.0.0.1', '2025-11-23 13:09:02', NULL, '2025-11-23 14:30:23 - officers_login', 'normal'),
(83, 56, '127.0.0.1', '2025-11-23 14:30:23', NULL, '2025-11-23 14:33:51 - membership_page', 'normal'),
(84, 56, '127.0.0.1', '2025-11-23 14:34:58', '2025-11-23 14:45:17', '2025-11-23 14:45:15 - main_menu', 'manual'),
(85, 56, '127.0.0.1', '2025-11-23 14:46:19', NULL, '2025-11-23 14:46:40 - student_payment_record', 'normal'),
(86, 56, '127.0.0.1', '2025-11-23 14:48:55', NULL, '2025-11-23 14:50:20 - officers_login', 'normal'),
(87, 56, '127.0.0.1', '2025-11-23 14:50:20', NULL, '2025-11-23 14:55:58 - officers_login', 'normal'),
(88, 56, '127.0.0.1', '2025-11-23 14:55:58', NULL, '2025-11-23 15:01:38 - main_menu', 'normal'),
(89, 56, '127.0.0.1', '2025-11-23 15:03:46', NULL, '2025-11-23 15:03:48 - student_payment_record', 'normal'),
(90, 56, '127.0.0.1', '2025-11-23 15:04:17', NULL, '2025-11-24 02:01:17 - officers_login', 'normal'),
(91, 57, '127.0.0.1', '2025-11-23 20:16:32', NULL, '2025-11-23 20:21:27 - breakdown_notes', 'normal'),
(92, 56, '127.0.0.1', '2025-11-24 02:01:17', NULL, '2025-11-24 03:56:45 - student_payment_record', 'normal');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_cash_beginning`
--
ALTER TABLE `tbl_cash_beginning`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_cash_flow_summary`
--
ALTER TABLE `tbl_cash_flow_summary`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_expense_history`
--
ALTER TABLE `tbl_expense_history`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_lockers`
--
ALTER TABLE `tbl_lockers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_locker` (`locker_letter`,`locker_number`);

--
-- Indexes for table `tbl_locker_rentals`
--
ALTER TABLE `tbl_locker_rentals`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_miscellaneous_transactions`
--
ALTER TABLE `tbl_miscellaneous_transactions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_operating_activities_net_cash`
--
ALTER TABLE `tbl_operating_activities_net_cash`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_operating_activities_payments`
--
ALTER TABLE `tbl_operating_activities_payments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_operating_activities_recieved`
--
ALTER TABLE `tbl_operating_activities_recieved`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_other_expenses`
--
ALTER TABLE `tbl_other_expenses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_pending_registrations`
--
ALTER TABLE `tbl_pending_registrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_scc_memberships`
--
ALTER TABLE `tbl_scc_memberships`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_ssc_accounts`
--
ALTER TABLE `tbl_ssc_accounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_student_fee_balance`
--
ALTER TABLE `tbl_student_fee_balance`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_sy_database`
--
ALTER TABLE `tbl_sy_database`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_transactions`
--
ALTER TABLE `tbl_transactions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_transaction_fees`
--
ALTER TABLE `tbl_transaction_fees`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_transaction_set_up`
--
ALTER TABLE `tbl_transaction_set_up`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_users_log`
--
ALTER TABLE `tbl_users_log`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_cash_beginning`
--
ALTER TABLE `tbl_cash_beginning`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_cash_flow_summary`
--
ALTER TABLE `tbl_cash_flow_summary`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_expense_history`
--
ALTER TABLE `tbl_expense_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `tbl_lockers`
--
ALTER TABLE `tbl_lockers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `tbl_locker_rentals`
--
ALTER TABLE `tbl_locker_rentals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `tbl_miscellaneous_transactions`
--
ALTER TABLE `tbl_miscellaneous_transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `tbl_operating_activities_net_cash`
--
ALTER TABLE `tbl_operating_activities_net_cash`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_operating_activities_payments`
--
ALTER TABLE `tbl_operating_activities_payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tbl_operating_activities_recieved`
--
ALTER TABLE `tbl_operating_activities_recieved`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=95;

--
-- AUTO_INCREMENT for table `tbl_other_expenses`
--
ALTER TABLE `tbl_other_expenses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tbl_pending_registrations`
--
ALTER TABLE `tbl_pending_registrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tbl_scc_memberships`
--
ALTER TABLE `tbl_scc_memberships`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=169;

--
-- AUTO_INCREMENT for table `tbl_ssc_accounts`
--
ALTER TABLE `tbl_ssc_accounts`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `tbl_student_fee_balance`
--
ALTER TABLE `tbl_student_fee_balance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_sy_database`
--
ALTER TABLE `tbl_sy_database`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_transactions`
--
ALTER TABLE `tbl_transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=218;

--
-- AUTO_INCREMENT for table `tbl_transaction_fees`
--
ALTER TABLE `tbl_transaction_fees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_transaction_set_up`
--
ALTER TABLE `tbl_transaction_set_up`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT for table `tbl_users_log`
--
ALTER TABLE `tbl_users_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
