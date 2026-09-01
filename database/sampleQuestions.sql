-- Insert sample questions with individual option columns
insert into questions (topic_slug, category, subcategory, level, question, option_a, option_b, option_c, option_d, correct_answer, explanation) values
-- Percentages - Easy
('percentages', 'quant', 'percentage', 'easy', 'What is 25% of 200?', '25', '40', '50', '60', '50', '25% of 200 = 50'),
('percentages', 'quant', 'percentage', 'easy', 'A number increases from 100 to 120. Find % increase.', '10%', '15%', '20%', '25%', '20%', 'Increase = 20 → 20%'),
('percentages', 'quant', 'percentage', 'easy', 'What is 10% of 450?', '35', '40', '45', '50', '45', '10% of 450 = 45'),
('percentages', 'quant', 'percentage', 'easy', 'Decrease 300 by 10%.', '260', '270', '280', '290', '270', '10% of 300 = 30 → 300 - 30 = 270'),
('percentages', 'quant', 'percentage', 'easy', 'What percent of 50 is 10?', '10%', '20%', '25%', '30%', '20%', '10/50 × 100 = 20%'),
('percentages', 'quant', 'percentage', 'easy', 'Express 3/4 as a percentage.', '65%', '70%', '75%', '80%', '75%', '3/4 = 0.75 = 75%'),
('percentages', 'quant', 'percentage', 'easy', 'What is 15% of 60?', '6', '8', '9', '12', '9', '10% is 6, 5% is 3. Total 9.'),
('percentages', 'quant', 'percentage', 'easy', 'Find 200% of 15.', '15', '30', '45', '60', '30', '200% means double. 15 × 2 = 30.'),
('percentages', 'quant', 'percentage', 'easy', 'If 40% of a number is 80, what is the number?', '160', '200', '240', '300', '200', '80 / 0.4 = 200'),
('percentages', 'quant', 'percentage', 'easy', 'A student scored 18 out of 20. What is the percentage?', '80%', '85%', '90%', '95%', '90%', '18/20 = 9/10 = 90%'),
-- Percentages - Medium
('percentages', 'quant', 'percentage', 'medium', 'A price increased from $80 to $100. Find the percentage increase.', '20%', '25%', '30%', '15%', '25%', '((100-80)/80) * 100 = 25%'),
('percentages', 'quant', 'percentage', 'medium', 'In a class of 40 students, 60% are girls. How many are boys?', '12', '16', '24', '28', '16', 'Boys = 40% of 40 = 16.'),
('percentages', 'quant', 'percentage', 'medium', 'A man''s salary was increased by 10% and then decreased by 10%. What is the net change?', 'No change', '1% increase', '1% decrease', '2% decrease', '1% decrease', '1.10 * 0.90 = 0.99'),
('percentages', 'quant', 'percentage', 'medium', 'If A is 25% more than B, then B is how much percent less than A?', '20%', '25%', '30%', '15%', '20%', 'If B=100, A=125. (25/125)*100 = 20%'),
('percentages', 'quant', 'percentage', 'medium', 'What is 20% of 30% of 500?', '30', '60', '90', '100', '30', '0.20 * 0.30 * 500 = 30.'),
-- Profit & Loss
('profit-loss', 'quant', 'profit-loss', 'easy', 'A shopkeeper buys an article for $100 and sells for $120. Find profit%.', '10%', '15%', '20%', '25%', '20%', 'Profit = 20, Profit% = 20/100 * 100 = 20%'),
('profit-loss', 'quant', 'profit-loss', 'easy', 'A shop buys an item for $200 and sells for $150. Find loss%.', '20%', '25%', '30%', '35%', '25%', 'Loss = 50, Loss% = 50/200 * 100 = 25%'),
('profit-loss', 'quant', 'profit-loss', 'easy', 'Find selling price if cost = $80 and profit = 20%.', '90', '96', '100', '104', '96', 'SP = 80 + 20% of 80 = 80 + 16 = 96'),
('profit-loss', 'quant', 'profit-loss', 'medium', 'A merchant offers 20% discount on marked price. If cost price is $100 and marked price is $150, find profit%.', '5%', '10%', '15%', '20%', '10%', 'SP = 150 - 20% of 150 = 150 - 30 = 120. Profit = 20.'),
('profit-loss', 'quant', 'profit-loss', 'medium', 'Two articles sold at $100 each. One at 10% profit, other at 10% loss. Find net result.', 'No profit no loss', '1% profit', '1% loss', '2% loss', '1% loss', 'Overall loss = (10×10)/100 = 1%'),
-- Simple Interest
('simple-interest', 'quant', 'simple-interest', 'easy', 'Find SI on $1000 at 5% per annum for 2 years.', '$50', '$100', '$150', '$200', '$100', 'SI = P × R × T / 100 = 1000 × 5 × 2 / 100 = 100'),
('simple-interest', 'quant', 'simple-interest', 'easy', 'Simple interest on $500 at 10% for 3 years is?', '$100', '$120', '$150', '$180', '$150', 'SI = 500 × 10 × 3 / 100 = 150'),
('simple-interest', 'quant', 'simple-interest', 'medium', 'A sum becomes 1.5 times in 5 years. Find rate of interest.', '5%', '8%', '10%', '12%', '10%', 'SI = 0.5P in 5 years. Rate = (0.5P × 100) / (P × 5) = 10%'),
-- Ratios & Proportions
('ratios-proportions', 'quant', 'ratios-proportions', 'easy', 'Divide 60 in ratio 2:3:5.', '10, 15, 35', '12, 18, 30', '15, 20, 25', '10, 20, 30', '12, 18, 30', 'Sum = 10 parts. Each part = 60/10 = 6. So 12, 18, 30'),
('ratios-proportions', 'quant', 'ratios-proportions', 'easy', 'If x:y = 3:4, find x if y = 20.', '12', '15', '16', '18', '15', '3/4 = x/20 → x = 15'),
('ratios-proportions', 'quant', 'ratios-proportions', 'medium', 'A mixture contains milk and water in ratio 4:1. If total is 50L, find water.', '5L', '8L', '10L', '12L', '10L', '5 parts = 50L, 1 part = 10L'),
-- Time & Work
('time-work', 'quant', 'time-work', 'easy', 'A can complete work in 10 days. B in 20 days. Together in how many days?', '6 days', '6.5 days', '7 days', '8 days', '6.67 days', 'A = 1/10, B = 1/20. Together = 3/20 = 6.67 days'),
('time-work', 'quant', 'time-work', 'easy', 'If 5 men can do work in 20 days, how long for 10 men?', '5 days', '8 days', '10 days', '12 days', '10 days', 'Work is inversely proportional. 5×20 = 10×x → x = 10'),
('time-work', 'quant', 'time-work', 'medium', 'A is twice as efficient as B. A completes work in 10 days. How long for both together?', '3.33 days', '4 days', '5 days', '6 days', '3.33 days', 'A = 1/10, B = 1/20. Together = 3/20 = 6.67 days');
